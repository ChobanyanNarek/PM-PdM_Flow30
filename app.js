(() => {
  'use strict';

  const KEYS = {
    THEME: 'pmflow30_theme',
    LANG: 'pmflow30_lang',
    CUSTOM_LESSONS: 'pmflow30_custom_lessons',
    VAULT: 'pmflow30_vault',
    HISTORY: 'pmflow30_history',
    PROFILE: 'pmflow30_profile',
    ACTIVE_LESSON: 'pmflow30_active_lesson',
    GEMINI_KEY: 'speakflow30_gemini_key'
  };

  const $ = (id) => document.getElementById(id);

  function loadJSON(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
  function formatTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }
  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function escapeHTML(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const builtInLessons = window.PMFLOW_LESSONS || [];
  let customLessons = loadJSON(KEYS.CUSTOM_LESSONS, []);
  let vault = loadJSON(KEYS.VAULT, []);
  let historyDates = loadJSON(KEYS.HISTORY, []);

  function getAllLessons() { return [...builtInLessons, ...customLessons]; }

  const state = {
    lang: localStorage.getItem(KEYS.LANG) || 'hy',
    lesson: null,
    currentStage: 1,
    unlockedStage: 1,
    masterSecondsLeft: 30 * 60,
    stageSecondsLeft: { 1: 10 * 60, 2: 10 * 60, 3: 10 * 60 },
    timerRunning: false,
    timerInterval: null,
    selectedIdx: 0,
    checkedConcepts: [],
    anchors: [],
    roleplayText: '',
    flashcardIndex: 0,
    flashcardMode: false,
    blitzItems: [],
    blitzIndex: 0,
    blitzScore: 0,
    blitzSecondsLeft: 60,
    blitzTimer: null
  };

  function t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[state.lang] || obj.hy || obj.en || '';
  }

  // Theme & Language
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEYS.THEME, theme); } catch {}
    $('icon-sun').classList.toggle('hidden', theme === 'light');
    $('icon-moon').classList.toggle('hidden', theme === 'dark');
  }
  applyTheme(localStorage.getItem(KEYS.THEME) || 'light');
  $('btn-theme-toggle').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  function updateLangUI() {
    $('lang-label').textContent = state.lang === 'hy' ? 'HY + EN' : 'English';
    if (state.lesson) {
      $('header-lesson-title').textContent = t(state.lesson.title);
      $('stage1-lesson-title').textContent = t(state.lesson.title);
      $('lesson-category-tag').textContent = t(state.lesson.category);
      $('roleplay-prompt').textContent = t(state.lesson.roleplayPrompt);
      renderStage1();
      renderStage2();
      if (state.currentStage === 4) renderNightRecall();
    }
  }

  $('btn-lang-toggle').addEventListener('click', () => {
    state.lang = state.lang === 'hy' ? 'en' : 'hy';
    try { localStorage.setItem(KEYS.LANG, state.lang); } catch {}
    updateLangUI();
  });

  // Timers
  function updateTimerUI() {
    $('master-timer-display').textContent = formatTime(state.masterSecondsLeft);
    const pct = ((30 * 60 - state.masterSecondsLeft) / (30 * 60)) * 100;
    $('master-progress-bar').style.width = `${Math.min(100, Math.max(0, pct))}%`;
    $('stage1-timer').textContent = formatTime(state.stageSecondsLeft[1]);
    $('stage2-timer').textContent = formatTime(state.stageSecondsLeft[2]);
    $('stage3-timer').textContent = formatTime(state.stageSecondsLeft[3]);
    $('icon-master-play').classList.toggle('hidden', state.timerRunning);
    $('icon-master-pause').classList.toggle('hidden', !state.timerRunning);
  }
  function startTimer() {
    if (state.timerRunning) return;
    state.timerRunning = true;
    updateTimerUI();
    state.timerInterval = setInterval(() => {
      if (state.masterSecondsLeft > 0) state.masterSecondsLeft -= 1;
      if (state.currentStage >= 1 && state.currentStage <= 3 && state.stageSecondsLeft[state.currentStage] > 0) {
        state.stageSecondsLeft[state.currentStage] -= 1;
      }
      updateTimerUI();
    }, 1000);
  }
  function pauseTimer() {
    state.timerRunning = false;
    if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
    updateTimerUI();
  }
  function ensureTimerStarted() {
    if (!state.timerRunning && state.currentStage <= 3) startTimer();
  }
  $('btn-master-toggle').addEventListener('click', () => state.timerRunning ? pauseTimer() : startTimer());
  $('btn-master-reset').addEventListener('click', () => {
    if (confirm('Reset current 30-min PM session?')) loadLesson(state.lesson.id);
  });

  // Stages
  function goToStage(n) {
    if (n > state.unlockedStage && n <= 3) return;
    state.currentStage = n;
    [1, 2, 3].forEach((i) => {
      $(`stage-${i}`).classList.toggle('hidden', i !== n);
      const btn = $(`step-btn-${i}`);
      btn.classList.toggle('active', i === n);
      btn.classList.toggle('locked', i > state.unlockedStage);
      btn.classList.toggle('completed', i < state.unlockedStage || n === 4);
      btn.disabled = i > state.unlockedStage;
      const lock = btn.querySelector('.step-lock');
      if (lock) lock.classList.toggle('hidden', i <= state.unlockedStage);
    });
    $('stage-complete').classList.toggle('hidden', n !== 4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  [1, 2, 3].forEach((i) => $(`step-btn-${i}`).addEventListener('click', () => goToStage(i)));

  // Load Lesson
  function loadLesson(id) {
    const all = getAllLessons();
    const found = all.find((l) => l.id === id) || all[0];
    if (!found) return;
    pauseTimer();
    state.lesson = found;
    try { localStorage.setItem(KEYS.ACTIVE_LESSON, found.id); } catch {}
    state.currentStage = 1;
    state.unlockedStage = 1;
    state.masterSecondsLeft = 30 * 60;
    state.stageSecondsLeft = { 1: 10 * 60, 2: 10 * 60, 3: 10 * 60 };
    state.selectedIdx = 0;
    state.checkedConcepts = found.concepts.map(() => false);
    state.anchors = found.concepts.map(() => ({ feynmanCheck: '', projectAnchor: '', difficulty: 'easy' }));
    state.roleplayText = '';
    state.flashcardIndex = 0;
    state.flashcardMode = false;

    $('header-lesson-title').textContent = t(found.title);
    $('stage1-lesson-title').textContent = t(found.title);
    $('lesson-level-tag').textContent = found.level || 'Mid → Senior PM';
    $('lesson-category-tag').textContent = t(found.category);
    $('roleplay-prompt').textContent = t(found.roleplayPrompt);
    $('roleplay-textarea').value = '';
    $('roleplay-word-count').textContent = '0 words';
    $('roleplay-feedback-panel').classList.add('hidden');

    renderStage1();
    renderStage2();
    renderStage3Tracker();
    updateTimerUI();
    goToStage(1);
  }

  // Stage 1
  function renderStage1() {
    const concepts = state.lesson.concepts;
    let html = escapeHTML(t(state.lesson.contextText));
    concepts.forEach((c, idx) => {
      const pattern = new RegExp(`(${escapeRegex(escapeHTML(c.phrase))})`, 'gi');
      const cls = `phrase-highlight${idx === state.selectedIdx ? ' selected' : ''}${state.checkedConcepts[idx] ? ' checked' : ''}`;
      html = html.replace(pattern, `<button type="button" class="${cls}" data-idx="${idx}">$1</button>`);
    });

    const passageEl = $('reading-passage');
    passageEl.innerHTML = html;
    passageEl.querySelectorAll('.phrase-highlight').forEach((btn) => {
      btn.addEventListener('click', () => {
        ensureTimerStarted();
        state.selectedIdx = Number(btn.dataset.idx);
        passageEl.querySelectorAll('.phrase-highlight').forEach((el) => el.classList.toggle('selected', Number(el.dataset.idx) === state.selectedIdx));
        updateInspector();
      });
    });

    const listEl = $('stage1-checklist');
    listEl.innerHTML = '';
    concepts.forEach((c, idx) => {
      const li = document.createElement('li');
      li.className = `checklist-item${state.checkedConcepts[idx] ? ' done' : ''}`;
      li.innerHTML = `<input type="checkbox" ${state.checkedConcepts[idx] ? 'checked' : ''} /><span>${escapeHTML(c.phrase)}</span>`;
      const cb = li.querySelector('input');
      cb.addEventListener('change', () => { ensureTimerStarted(); state.checkedConcepts[idx] = cb.checked; renderStage1(); });
      li.addEventListener('click', (e) => { if (e.target !== cb) { state.selectedIdx = idx; updateInspector(); } });
      listEl.appendChild(li);
    });

    const done = state.checkedConcepts.filter(Boolean).length;
    $('stage1-check-count').textContent = `${done} / ${concepts.length} Understood`;
    const unlockBtn = $('btn-unlock-stage2');
    unlockBtn.disabled = done < concepts.length;
    unlockBtn.textContent = done === concepts.length ? 'Continue to Stage 2: Project Application' : `Check ${concepts.length - done} More to Unlock Stage 2`;
    updateInspector();
  }

  function updateInspector() {
    const c = state.lesson.concepts[state.selectedIdx];
    if (!c) return;
    $('inspector-phrase').textContent = c.phrase;
    $('inspector-feynman').textContent = t(c.feynman);
    $('inspector-basic').textContent = t(c.juniorView);
    $('inspector-pro').textContent = t(c.seniorView);
    $('inspector-examples').classList.remove('hidden');
  }

  $('btn-unlock-stage2').addEventListener('click', () => {
    if (state.unlockedStage < 2) state.unlockedStage = 2;
    goToStage(2);
  });

  function getSelectedModel() {
    const saved = localStorage.getItem('pmflow30_ai_model');
    if (saved === 'gemini-3.8-flash' || saved === 'gemini-3.5-flash-lite') return saved;
    return 'gemini-3.8-flash';
  }

  let lastGeminiError = '';

  async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  async function discoverGeminiModel(apiKey) {
    try {
      const resp = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
        {},
        8000
      );
      if (!resp.ok) return null;
      const data = await resp.json();
      const candidates = (data.models || [])
        .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent') && /gemini/i.test(m.name) && !/image|tts|audio|embedding/i.test(m.name))
        .map((m) => m.name.replace(/^models\//, ''));
      return candidates.find((n) => /flash/i.test(n)) || candidates[0] || null;
    } catch {
      return null;
    }
  }

  async function fetchGeminiJSON(apiKey, promptText, temperature = 0.4, statusCb = null) {
    const primary = getSelectedModel();
    const cachedModel = localStorage.getItem('pmflow30_working_model');
    const baseModels = primary === 'gemini-3.8-flash'
      ? ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite']
      : ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash-lite'];

    const models = cachedModel && !baseModels.includes(cachedModel)
      ? [cachedModel, ...baseModels]
      : cachedModel
      ? [cachedModel, ...baseModels.filter((m) => m !== cachedModel)]
      : baseModels;

    lastGeminiError = '';

    const tryModel = async (model) => {
      if (statusCb) statusCb(`Calling ${model}...`);
      const resp = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { responseMimeType: 'application/json', temperature }
          })
        },
        30000
      );
      if (!resp.ok) {
        const errTxt = await resp.text();
        lastGeminiError = `${model} (${resp.status}): ${errTxt.slice(0, 140)}`;
        return null;
      }
      const data = await resp.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (raw) {
        try { localStorage.setItem('pmflow30_working_model', model); } catch {}
        return JSON.parse(raw);
      }
      return null;
    };

    // Fast-discover supported models first if no cached working model
    if (!cachedModel) {
      if (statusCb) statusCb('Checking available Gemini models...');
      const discovered = await discoverGeminiModel(apiKey);
      if (discovered && !models.includes(discovered)) {
        models.unshift(discovered);
      }
    }

    for (const model of models) {
      try {
        const res = await tryModel(model);
        if (res) return res;
      } catch (e) {
        lastGeminiError = e.name === 'AbortError' ? `${model}: Timed out (12s)` : e.message;
      }
    }
    return null;
  }

  // Checking Engine (Local + Gemini Senior PM Mentor)
  async function callPMMentorAI(promptText) {
    const apiKey = localStorage.getItem(KEYS.GEMINI_KEY) || '';
    if (!apiKey) return null;
    return fetchGeminiJSON(apiKey, promptText, 0.4);
  }

  async function checkStage2Application(idx, fbEl, btnEl) {
    const c = state.lesson.concepts[idx];
    const anchor = state.anchors[idx];
    const text = anchor.projectAnchor.trim();
    fbEl.classList.remove('hidden', 'ok', 'warn', 'error');

    const words = text ? text.split(/\s+/).length : 0;
    if (words < 5) {
      fbEl.classList.add('error');
      fbEl.textContent = state.lang === 'hy'
        ? 'Գրիր առնվազն 5 բառ՝ կիրառելով սա քո իրական պրոյեկտի կամ թիմի վրա։'
        : 'Write at least 5 words applying this concretely to your real project.';
      return;
    }

    btnEl.disabled = true; btnEl.textContent = 'Checking...';
    const ai = await callPMMentorAI(`You are a Staff Product & Project Manager Mentor.
Concept: "${c.phrase}" (${t(c.feynman)})
User's Feynman explanation: "${anchor.feynmanCheck || '(empty)'}"
User's real project application (may be in Armenian or English): "${text}"

Evaluate whether they applied the concept concretely (not vaguely). Respond in ${state.lang === 'hy' ? 'Armenian with English PM terms' : 'English'}.
Return ONLY JSON:
{
  "isStrong": true or false,
  "feedback": "1-2 sentences of sharp, practical PM mentor feedback.",
  "staffUpgrade": "1 sentence showing how a Staff PM would sharpen or quantify this exact point."
}`);
    btnEl.disabled = false; btnEl.textContent = 'Check Application';

    if (ai) {
      fbEl.classList.add(ai.isStrong ? 'ok' : 'warn');
      fbEl.innerHTML = `<strong>${ai.isStrong ? '✓ Staff PM Mentor:' : '✎ PM Mentor Tip:'}</strong> ${escapeHTML(ai.feedback)}${ai.staffUpgrade ? `<div class="feedback-upgrade"><span class="contrast-label c1">Staff PM Framing</span><div style="margin-top:4px;">${escapeHTML(ai.staffUpgrade)}</div></div>` : ''}`;
    } else {
      const hasTerm = text.toLowerCase().includes(c.phrase.toLowerCase());
      fbEl.classList.add(hasTerm ? 'ok' : 'warn');
      fbEl.innerHTML = hasTerm
        ? `<strong>✓ Applied!</strong> ${state.lang === 'hy' ? 'Լավ կիրառում է։ (AI Mentor գնահատականի համար տեղադրիր Gemini API Key-ը Auto-Plan-ում)' : 'Good concrete application. (Add Gemini API Key in Auto-Plan for Staff PM Mentor review.)'}`
        : `<strong>✎ Tip:</strong> ${state.lang === 'hy' ? `Փորձիր ուղիղ ներառել "${escapeHTML(c.phrase)}" տերմինը քո նախադասության մեջ։` : `Try explicitly referencing "${escapeHTML(c.phrase)}" in your application.`}`;
    }
  }

  function recordRadarScore(domainName, scoreNum) {
    const radar = loadJSON('pmflow30_radar', {});
    const key = domainName || 'General PM';
    if (!radar[key]) radar[key] = { sum: 0, count: 0 };
    radar[key].sum += scoreNum;
    radar[key].count += 1;
    saveJSON('pmflow30_radar', radar);
  }

  async function checkStage3Case() {
    const fb = $('roleplay-feedback-panel');
    const btn = $('btn-roleplay-check');
    const text = state.roleplayText.trim();
    const concepts = state.lesson.concepts.map((c) => c.phrase);
    fb.classList.remove('hidden', 'ok', 'warn', 'error');

    const words = text ? text.split(/\s+/).length : 0;
    if (words < 15) {
      fb.classList.add('error');
      fb.textContent = state.lang === 'hy'
        ? 'Պատասխանը շատ կարճ է։ Գրիր առնվազն 3–4 նախադասություն քո ռազմավարական քայլերով։'
        : 'Response is too short. Write at least 3–4 sentences outlining your decision.';
      return;
    }

    const used = concepts.filter((p) => text.toLowerCase().includes(p.toLowerCase()));
    btn.disabled = true; btn.textContent = 'Mentor Reviewing...';
    const ai = await callPMMentorAI(`You are a Staff Product & Project Manager Mentor evaluating a PM case response.
Case: ${t(state.lesson.roleplayPrompt)}
Key concepts: ${concepts.join(', ')}
User's response (may be in Armenian or English): "${text}"

Evaluate Product Sense, Risk Coverage, Metrics, and Stakeholder Communication. Also generate ONE tough follow-up Executive Pushback question (e.g. CFO cuts budget 30% or key engineer leaves or metric drops) challenging their specific answer. Respond in ${state.lang === 'hy' ? 'Armenian with English PM terms' : 'English'}.
Return ONLY JSON:
{
  "scoreNum": 8,
  "score": "8/10",
  "isStrong": true or false,
  "feedback": "2-3 concise sentences on what was strong and what risk/metric was missed.",
  "staffAnswer": "A crisp 3-4 sentence Staff PM model answer.",
  "pushbackQuestion": "1 sharp Executive Pushback follow-up question."
}`);
    btn.disabled = false; btn.textContent = 'Senior PM Mentor Check';

    const domainLabel = t(state.lesson.category).split('·')[0].trim();

    if (ai) {
      const numScore = Number(ai.scoreNum) || parseInt(ai.score, 10) || (ai.isStrong ? 8 : 6);
      recordRadarScore(domainLabel, Math.min(10, Math.max(1, numScore)));
      fb.classList.add(ai.isStrong && used.length >= 3 ? 'ok' : 'warn');
      fb.innerHTML = `<strong>Senior PM Mentor (${escapeHTML(ai.score || `${numScore}/10`)}):</strong> ${escapeHTML(ai.feedback)}${ai.staffAnswer ? `<div class="feedback-upgrade"><span class="contrast-label c1">Staff PM Model Answer</span><div style="margin-top:4px;">${escapeHTML(ai.staffAnswer)}</div></div>` : ''}`;
      showPushbackPanel(ai.pushbackQuestion);
    } else {
      const localScore = Math.min(10, 4 + used.length * 1.2 + (words >= 40 ? 1 : 0));
      recordRadarScore(domainLabel, Math.round(localScore));
      fb.classList.add(used.length >= 3 ? 'ok' : 'warn');
      fb.innerHTML = used.length >= 3
        ? `<strong>✓ Solid Structure (${Math.round(localScore)}/10):</strong> ${used.length}/5 concepts addressed (${words} words).`
        : `<strong>✎ ${used.length}/5 concepts used (Goal: 3+):</strong> ${state.lang === 'hy' ? 'Ավելացրու նաև ռիսկերի ու մետրիկների մասին նշումներ։' : 'Try weaving in at least 3 of today\'s concepts.'}`;
      const offlinePushback = state.lang === 'hy'
        ? 'Իսկ եթե հենց հիմա CFO-ն կրճատի բյուջեն/ռեսուրսը 30%-ով կամ տա կիսով չափ քիչ ժամանակ, ո՞րն է քո Plan B-ն և ի՞նչն ես առաջինը կտրում։'
        : 'Pushback: What if the CFO cuts your engineering capacity by 30% tomorrow—what is your Plan B and what do you cut first?';
      showPushbackPanel(offlinePushback);
    }
  }

  function showPushbackPanel(questionText) {
    if (!questionText) return;
    $('pushback-question').textContent = questionText;
    $('pushback-textarea').value = '';
    $('pushback-feedback-panel').classList.add('hidden');
    $('pushback-panel').classList.remove('hidden');
  }

  $('btn-pushback-check').addEventListener('click', async () => {
    const reply = $('pushback-textarea').value.trim();
    const fb = $('pushback-feedback-panel');
    const btn = $('btn-pushback-check');
    fb.classList.remove('hidden', 'ok', 'warn', 'error');
    if (reply.split(/\s+/).length < 8) {
      fb.classList.add('error');
      fb.textContent = state.lang === 'hy' ? 'Գրիր առնվազն 2 նախադասություն՝ պաշտպանելով քո Plan B-ն։' : 'Write at least 2 sentences defending your Plan B.';
      return;
    }
    btn.disabled = true; btn.textContent = 'Reviewing...';
    const ai = await callPMMentorAI(`Executive Pushback Question: "${$('pushback-question').textContent}"
PM's Plan B Defense: "${reply}"
Evaluate decisiveness, trade-off clarity, and executive composure in ${state.lang === 'hy' ? 'Armenian with English PM terms' : 'English'}.
Return ONLY JSON: { "isStrong": true/false, "feedback": "2 sharp sentences." }`);
    btn.disabled = false; btn.textContent = 'Check Pushback Reply';
    if (ai) {
      fb.classList.add(ai.isStrong ? 'ok' : 'warn');
      fb.innerHTML = `<strong>${ai.isStrong ? '✓ Strong Defense:' : '✎ Sharpen Further:'}</strong> ${escapeHTML(ai.feedback)}`;
    } else {
      fb.classList.add('ok');
      fb.innerHTML = `<strong>✓ Plan B Recorded!</strong> ${state.lang === 'hy' ? 'Լավ արձագանք ճնշման տակ։' : 'Solid composure under executive pushback.'}`;
    }
  });

  // Stage 2
  function renderStage2() {
    const container = $('anchor-builder-list');
    container.innerHTML = '';
    state.lesson.concepts.forEach((c, idx) => {
      const a = state.anchors[idx];
      const card = document.createElement('div');
      card.className = 'card anchor-card';
      card.innerHTML = `
        <div class="anchor-card-header">
          <div class="anchor-title-group">
            <span class="anchor-num">${idx + 1}</span>
            <span class="anchor-phrase">${escapeHTML(c.phrase)}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn btn-secondary btn-xs btn-check-anchor">Check Application</button>
            <div class="difficulty-toggle">
              <button type="button" class="diff-btn ${a.difficulty === 'easy' ? 'active' : ''}" data-diff="easy">Easy</button>
              <button type="button" class="diff-btn ${a.difficulty === 'hard' ? 'active' : ''}" data-diff="hard">Hard Mode</button>
            </div>
          </div>
        </div>
        <div class="anchor-fields">
          <div class="field-group">
            <label class="field-label" for="feynman-input-${idx}">1. Feynman Check (Simple explanation)</label>
            <input id="feynman-input-${idx}" class="text-input" type="text" placeholder="${state.lang === 'hy' ? 'Բացատրիր 1 պարզ նախադասությամբ...' : 'Explain in 1 simple sentence...'}" value="${escapeHTML(a.feynmanCheck)}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="anchor-input-${idx}">2. My Real Project Application</label>
            <input id="anchor-input-${idx}" class="text-input" type="text" placeholder="${state.lang === 'hy' ? `Կիրառիր «${escapeHTML(c.phrase)}»-ը քո պրոյեկտի վրա...` : `Apply '${escapeHTML(c.phrase)}' to your real project...`}" value="${escapeHTML(a.projectAnchor)}" />
          </div>
        </div>
        <div id="anchor-feedback-${idx}" class="feedback-box hidden"></div>
      `;
      card.querySelectorAll('.diff-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          a.difficulty = btn.dataset.diff;
          card.querySelectorAll('.diff-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
      card.querySelector(`#feynman-input-${idx}`).addEventListener('input', (e) => { ensureTimerStarted(); a.feynmanCheck = e.target.value; });
      card.querySelector(`#anchor-input-${idx}`).addEventListener('input', (e) => { ensureTimerStarted(); a.projectAnchor = e.target.value; updateStage2Gate(); });
      const checkBtn = card.querySelector('.btn-check-anchor');
      const fbEl = card.querySelector(`#anchor-feedback-${idx}`);
      checkBtn.addEventListener('click', () => checkStage2Application(idx, fbEl, checkBtn));
      container.appendChild(card);
    });
    updateStage2Gate();
  }

  function updateStage2Gate() {
    const done = state.anchors.filter((a) => a.projectAnchor.trim().length >= 5).length;
    $('stage2-anchor-count').textContent = `${done} / ${state.lesson.concepts.length} Project Applications Completed`;
    $('btn-unlock-stage3').disabled = done < state.lesson.concepts.length;
  }

  $('btn-unlock-stage3').addEventListener('click', () => {
    if (state.unlockedStage < 3) state.unlockedStage = 3;
    goToStage(3);
  });

  // Stage 3
  function renderStage3Tracker() {
    const text = state.roleplayText.toLowerCase();
    const container = $('roleplay-phrase-badges');
    container.innerHTML = '';
    let matched = 0;
    state.lesson.concepts.forEach((c) => {
      const ok = text.includes(c.phrase.toLowerCase());
      if (ok) matched += 1;
      const b = document.createElement('span');
      b.className = `phrase-badge${ok ? ' matched' : ''}`;
      b.innerHTML = `${ok ? '✓ ' : ''}${escapeHTML(c.phrase)}`;
      container.appendChild(b);
    });
    $('roleplay-tracker-count').textContent = `${matched} / ${state.lesson.concepts.length} Used (Goal: 3+)`;
  }

  $('roleplay-textarea').addEventListener('input', (e) => {
    ensureTimerStarted();
    state.roleplayText = e.target.value;
    const words = state.roleplayText.trim() ? state.roleplayText.trim().split(/\s+/).length : 0;
    $('roleplay-word-count').textContent = `${words} words`;
    renderStage3Tracker();
  });
  $('btn-roleplay-check').addEventListener('click', checkStage3Case);

  // Complete & Vault
  $('btn-complete-session').addEventListener('click', () => {
    pauseTimer();
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    state.lesson.concepts.forEach((c, idx) => {
      const a = state.anchors[idx];
      const intervalDays = a.difficulty === 'hard' ? 1 : 3;
      const id = `${state.lesson.id}::${c.phrase.toLowerCase()}`;
      const existing = vault.findIndex((v) => v.id === id);
      const rec = {
        id, phrase: c.phrase, feynman: t(c.feynman), projectAnchor: a.projectAnchor.trim(),
        difficulty: a.difficulty, intervalDays, lastReviewedAt: now, nextReviewAt: now + intervalDays * dayMs
      };
      if (existing >= 0) vault[existing] = rec; else vault.unshift(rec);
    });
    saveJSON(KEYS.VAULT, vault);
    const today = todayISO();
    if (!historyDates.includes(today)) { historyDates.push(today); saveJSON(KEYS.HISTORY, historyDates); }
    renderNightRecall();
    updateVaultBadge();
    goToStage(4);
  });

  function renderNightRecall() {
    const listEl = $('night-recall-list');
    listEl.innerHTML = '';
    state.lesson.concepts.forEach((c, idx) => {
      const a = state.anchors[idx];
      const card = document.createElement('div');
      card.className = 'card recall-card';
      card.innerHTML = `<div class="card-header-row"><h3>${escapeHTML(c.phrase)}</h3><span class="tag">${a.difficulty === 'hard' ? 'Hard (1d)' : 'Easy (3d)'}</span></div><p class="muted-text">${escapeHTML(t(c.feynman))}</p><div class="recall-anchor"><strong>Project Anchor:</strong> ${escapeHTML(a.projectAnchor)}</div>`;
      listEl.appendChild(card);
    });
    renderFlashcard();
  }

  $('btn-copy-recall').addEventListener('click', async () => {
    const lines = [`# PMFlow 30 — ${t(state.lesson.title)}`, ''];
    state.lesson.concepts.forEach((c, i) => {
      lines.push(`**${i + 1}. ${c.phrase}**`, `- ${t(c.feynman)}`, `- My Project: ${state.anchors[i].projectAnchor}`, '');
    });
    try { await navigator.clipboard.writeText(lines.join('\n')); $('copy-recall-label').textContent = 'Copied!'; setTimeout(() => { $('copy-recall-label').textContent = 'Copy Summary Notes'; }, 2000); } catch {}
  });

  function renderFlashcard() {
    const c = state.lesson.concepts[state.flashcardIndex];
    const a = state.anchors[state.flashcardIndex];
    if (!c) return;
    $('flashcard-counter').textContent = `Card ${state.flashcardIndex + 1} of ${state.lesson.concepts.length}`;
    $('fc-front-phrase').textContent = c.phrase;
    $('fc-front-hint').textContent = `Typical PM Trap: "${t(c.juniorView)}"`;
    $('fc-back-feynman').textContent = t(c.feynman);
    $('fc-back-anchor').textContent = a.projectAnchor;
    $('flashcard-box').classList.remove('flipped');
  }
  $('btn-toggle-flashcards').addEventListener('click', () => {
    state.flashcardMode = !state.flashcardMode;
    $('night-recall-list').classList.toggle('hidden', state.flashcardMode);
    $('night-recall-flashcards').classList.toggle('hidden', !state.flashcardMode);
  });
  $('flashcard-box').addEventListener('click', () => $('flashcard-box').classList.toggle('flipped'));
  $('btn-fc-prev').addEventListener('click', () => { state.flashcardIndex = (state.flashcardIndex - 1 + state.lesson.concepts.length) % state.lesson.concepts.length; renderFlashcard(); });
  $('btn-fc-next').addEventListener('click', () => { state.flashcardIndex = (state.flashcardIndex + 1) % state.lesson.concepts.length; renderFlashcard(); });

  // Auto-Curriculum PM Engine (Senior -> Staff -> Principal, Unlimited Domains)
  const PM_DOMAINS = [
    'Product Strategy & Moats', 'Unit Economics & Pricing', 'Delivery, Scale & Risk',
    'Discovery & Customer Psychology', 'Tech Debt & Architecture Trade-offs',
    'GTM & Growth Loops', 'Org Design & Executive Alignment',
    'AI Product Strategy & Evals', 'Budget, Vendor & Contract Strategy', 'Crisis & Incident Leadership'
  ];

  function getProfile() {
    const p = loadJSON(KEYS.PROFILE, { domain: '', lastIdx: -1 });
    const s = historyDates.length;
    const level = s >= 20 ? 'Head of Product' : s >= 10 ? 'Principal PM' : s >= 4 ? 'Staff PM' : 'Senior PM';
    const nextIdx = (p.lastIdx + 1) % PM_DOMAINS.length;
    return { p, level, nextTopic: PM_DOMAINS[nextIdx], nextIdx };
  }

  function buildOfflineEndlessPMCase(level, topic, domainHint) {
    const completedSet = new Set(vault.map((v) => v.id.split('::')[0]));
    const uncompleted = builtInLessons.find((l) => !completedSet.has(l.id));
    if (uncompleted) return { lesson: uncompleted, isNew: false };

    const bank = window.PMFLOW_ENDLESS_BANK || [];
    const fromBuiltIn = builtInLessons.flatMap((l) => l.concepts);
    const pool = [...bank, ...fromBuiltIn];

    const vaultedMap = new Map(vault.map((v) => [v.phrase.toLowerCase(), v]));
    const scored = pool.map((c) => {
      const v = vaultedMap.get(c.phrase.toLowerCase());
      const prio = !v ? 4 : v.difficulty === 'hard' ? 3 : 1;
      return { c, score: prio + Math.random() * 0.9 };
    });
    scored.sort((a, b) => b.score - a.score);

    const picked = [];
    const seen = new Set();
    for (const item of scored) {
      const k = item.c.phrase.toLowerCase();
      if (!seen.has(k)) { seen.add(k); picked.push(item.c); }
      if (picked.length === 5) break;
    }

    const dom = domainHint ? ` (${domainHint})` : '';
    const hyText = `${topic}${dom} ուղղությամբ ուժեղ առաջնորդությունը պահանջում է համակարգային մտածողություն։ ${picked.map((c) => c.seniorView.hy).join(' ')} Այս հինգ սկզբունքները կօգնեն կայացնել հաշվարկված որոշումներ։`;
    const enText = `Mastering ${topic}${dom} at a ${level} level requires systemic thinking. ${picked.map((c) => c.seniorView.en).join(' ')} Combining these five lenses sharpens executive decision-making.`;

    return {
      isNew: true,
      lesson: {
        id: `pm-mix-${Date.now()}`,
        pillar: 'endless',
        level,
        title: { hy: `${topic}${dom}`, en: `${topic}${dom}` },
        category: { hy: `Auto · ${topic}`, en: `Auto · ${topic}` },
        contextText: { hy: hyText, en: enText },
        concepts: picked,
        roleplayPrompt: {
          hy: `Քեյս (${topic}${dom}). Ղեկավարությունը պահանջում է արագ ռազմավարական որոշում, որտեղ կա կոնֆլիկտ աճի, ռիսկի և ռեսուրսների միջև։ Գրիր 4–5 նախադասությամբ քո որոշումը՝ կիրառելով առնվազն 3 կոնցեպտ։`,
          en: `Case (${topic}${dom}): Leadership needs a fast strategic call balancing growth, risk, and capacity. Write a 4–5 sentence decision using at least 3 concepts.`
        }
      }
    };
  }

  async function generateNextPMCase(btnEl, labelEl, errEl) {
    const { p, level, nextTopic, nextIdx } = getProfile();
    const dom = $('endless-role-input')?.value.trim();
    if (dom) p.domain = dom;
    const keyInput = $('gemini-api-key')?.value.trim();
    const apiKey = keyInput || localStorage.getItem(KEYS.GEMINI_KEY) || '';
    if (keyInput) try { localStorage.setItem(KEYS.GEMINI_KEY, keyInput); } catch {}
    p.lastIdx = nextIdx;
    saveJSON(KEYS.PROFILE, p);
    if (errEl) errEl.classList.add('hidden');

    if (apiKey) {
      if (btnEl) btnEl.disabled = true;
      if (labelEl) labelEl.textContent = `Generating ${level} Case...`;
      const recent = vault.map((v) => v.phrase).slice(0, 20);
      const weak = vault.filter((v) => v.difficulty === 'hard').map((v) => v.phrase).slice(0, 5);
      const isHy = state.lang === 'hy';
      const prompt = `Create a challenging Product & Project Management 30-minute case lesson for a ${level} (${p.domain || 'Tech / Software'}).
Topic: ${nextTopic}. Weak concepts: ${weak.join(', ') || 'none'}. Avoid: ${recent.join(', ') || 'none'}.
Language: ${isHy ? 'Armenian prose with exact English PM terms (1-3 words)' : 'English'}.
CRITICAL: All 5 "phrase" values (in English, 1-3 words) MUST appear verbatim inside "contextText".
Return ONLY JSON:
{
  "title": "...",
  "category": "Auto · ${nextTopic}",
  "level": "${level}",
  "contextText": "100-130 words containing all 5 exact English phrases verbatim",
  "concepts": [
    {
      "phrase": "exact English PM term",
      "feynman": "1 short sentence",
      "juniorView": "Typical PM Trap...",
      "seniorView": "Staff/Principal PM framing..."
    }
  ],
  "roleplayPrompt": "Realistic executive/PM dilemma asking for 4-5 sentences using 3+ concepts"
}`;
      try {
        const modelSel = $('ai-model-select')?.value;
        if (modelSel) try { localStorage.setItem('pmflow30_ai_model', modelSel); } catch {}
        const parsed = await fetchGeminiJSON(apiKey, prompt, 0.9, (msg) => {
          if (labelEl) labelEl.textContent = msg;
        });
        if (!parsed) throw new Error(lastGeminiError || 'Gemini API error or quota exceeded');
        parsed.id = `pm-ai-${Date.now()}`;
        customLessons.unshift(parsed);
        saveJSON(KEYS.CUSTOM_LESSONS, customLessons);
        loadLesson(parsed.id);
        $('modal-lessons').classList.add('hidden');
        return;
      } catch (err) {
        if (errEl) {
          errEl.textContent = `${err.message}`;
          errEl.classList.remove('hidden');
          if (btnEl && btnEl.id === 'btn-auto-generate-now') return;
        }
      } finally {
        if (btnEl) btnEl.disabled = false;
        if (labelEl) labelEl.textContent = 'Generate Next Auto-Case Now';
      }
    }

    const { lesson, isNew } = buildOfflineEndlessPMCase(level, nextTopic, p.domain);
    if (isNew) {
      customLessons.unshift(lesson);
      saveJSON(KEYS.CUSTOM_LESSONS, customLessons);
    }
    loadLesson(lesson.id);
    $('modal-lessons').classList.add('hidden');
  }

  $('btn-next-auto-lesson').addEventListener('click', () => generateNextPMCase($('btn-next-auto-lesson'), null, null));
  $('btn-auto-generate-now').addEventListener('click', () => generateNextPMCase($('btn-auto-generate-now'), $('ai-gen-label'), $('ai-gen-error')));
  if ($('ai-model-select')) {
    $('ai-model-select').addEventListener('change', (e) => {
      try { localStorage.setItem('pmflow30_ai_model', e.target.value); } catch {}
    });
  }

  $('btn-open-lessons').addEventListener('click', () => {
    const { p, level, nextTopic } = getProfile();
    $('profile-level-badge').textContent = level;
    $('profile-next-pillar').textContent = nextTopic.split('&')[0].trim();
    $('profile-weak-count').textContent = String(vault.filter((v) => v.difficulty === 'hard').length);
    if (p.domain && !$('endless-role-input').value) $('endless-role-input').value = p.domain;
    const savedKey = localStorage.getItem(KEYS.GEMINI_KEY) || '';
    if (savedKey && !$('gemini-api-key').value) $('gemini-api-key').value = savedKey;
    if ($('ai-model-select')) $('ai-model-select').value = getSelectedModel();
    const list = $('lesson-list');
    list.innerHTML = '';
    getAllLessons().forEach((l) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `lesson-option${state.lesson && l.id === state.lesson.id ? ' active' : ''}`;
      btn.innerHTML = `<div><strong>${escapeHTML(t(l.title))}</strong><div class="muted-text">${escapeHTML(t(l.category))} · ${escapeHTML(l.level)}</div></div><span class="tag">${l.concepts.length}</span>`;
      btn.addEventListener('click', () => { loadLesson(l.id); $('modal-lessons').classList.add('hidden'); });
      list.appendChild(btn);
    });
    $('modal-lessons').classList.remove('hidden');
  });

  $('tab-lessons-endless').addEventListener('click', () => {
    $('tab-lessons-endless').classList.add('active'); $('tab-lessons-browse').classList.remove('active');
    $('panel-lessons-endless').classList.remove('hidden'); $('panel-lessons-browse').classList.add('hidden');
  });
  $('tab-lessons-browse').addEventListener('click', () => {
    $('tab-lessons-browse').classList.add('active'); $('tab-lessons-endless').classList.remove('active');
    $('panel-lessons-browse').classList.remove('hidden'); $('panel-lessons-endless').classList.add('hidden');
  });

  // Vault & Blitz
  function getDue() {
    const now = Date.now();
    return vault.filter((v) => v.difficulty === 'hard' || now >= (v.nextReviewAt || 0));
  }
  function updateVaultBadge() {
    const due = getDue();
    $('vault-due-badge').textContent = String(due.length);
    $('vault-due-badge').classList.toggle('hidden', due.length === 0);
    if (due.length > 0 && state.currentStage === 1) {
      $('blitz-banner').classList.remove('hidden');
      $('blitz-banner-title').textContent = `${due.length} PM concept${due.length > 1 ? 's' : ''} due for review`;
    } else $('blitz-banner').classList.add('hidden');
  }

  $('btn-open-vault').addEventListener('click', () => {
    $('stat-streak').textContent = String(historyDates.length);
    $('stat-total-sessions').textContent = String(historyDates.length);
    $('stat-mastered-count').textContent = String(vault.length);
    const hm = $('streak-heatmap'); hm.innerHTML = '';
    const set = new Set(historyDates); const today = todayISO();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const c = document.createElement('div');
      c.className = `heat-cell${set.has(iso) ? ' done' : ''}${iso === today ? ' today' : ''}`;
      hm.appendChild(c);
    }
    const radarEl = $('weak-spot-radar');
    radarEl.innerHTML = '';
    const radar = loadJSON('pmflow30_radar', {});
    const entries = Object.entries(radar);
    if (entries.length === 0) {
      radarEl.innerHTML = `<p class="muted-text">Complete Stage 3 checks to see your strongest &amp; weakest PM domains.</p>`;
    } else {
      entries
        .map(([k, v]) => ({ domain: k, avg: +(v.sum / v.count).toFixed(1), count: v.count }))
        .sort((a, b) => a.avg - b.avg)
        .forEach((row) => {
          const pct = Math.min(100, Math.round((row.avg / 10) * 100));
          const color = row.avg >= 7.5 ? 'var(--success)' : row.avg >= 6 ? 'var(--warning)' : 'var(--danger)';
          const item = document.createElement('div');
          item.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:0.84rem; margin-bottom:3px;">
              <strong>${escapeHTML(row.domain)}</strong>
              <span>${row.avg}/10 (${row.count}x)</span>
            </div>
            <div style="height:7px; border-radius:999px; background:var(--bg-subtle); overflow:hidden;">
              <div style="height:100%; width:${pct}%; background:${color}; border-radius:999px;"></div>
            </div>
          `;
          radarEl.appendChild(item);
        });
    }

    const list = $('vault-items-list'); list.innerHTML = '';
    vault.forEach((v) => {
      const div = document.createElement('div'); div.className = 'vault-item';
      div.innerHTML = `<div class="vault-item-top"><strong>${escapeHTML(v.phrase)}</strong><span class="tag">${v.difficulty === 'hard' ? 'Hard Mode' : `${v.intervalDays}d`}</span></div><p class="muted-text">${escapeHTML(v.projectAnchor)}</p>`;
      list.appendChild(div);
    });
    $('btn-vault-blitz').disabled = vault.length === 0;
    $('modal-vault').classList.remove('hidden');
  });

  function startBlitz() {
    const pool = getDue().length ? getDue() : vault;
    if (!pool.length) return;
    state.blitzItems = pool.slice(0, 5); state.blitzIndex = 0; state.blitzScore = 0; state.blitzSecondsLeft = 60;
    $('modal-vault').classList.add('hidden');
    $('blitz-active-view').classList.remove('hidden'); $('blitz-done-view').classList.add('hidden');
    $('modal-blitz').classList.remove('hidden');
    renderBlitz();
    if (state.blitzTimer) clearInterval(state.blitzTimer);
    $('blitz-timer').textContent = formatTime(state.blitzSecondsLeft);
    state.blitzTimer = setInterval(() => {
      state.blitzSecondsLeft -= 1; $('blitz-timer').textContent = formatTime(state.blitzSecondsLeft);
      if (state.blitzSecondsLeft <= 0) finishBlitz();
    }, 1000);
  }
  function renderBlitz() {
    const item = state.blitzItems[state.blitzIndex];
    if (!item) { finishBlitz(); return; }
    $('blitz-progress-label').textContent = `Item ${state.blitzIndex + 1} of ${state.blitzItems.length}`;
    $('blitz-feynman-clue').textContent = item.feynman;
    const re = new RegExp(escapeRegex(item.phrase), 'i');
    $('blitz-blank-sentence').textContent = re.test(item.projectAnchor) ? item.projectAnchor.replace(re, '__________') : `${item.projectAnchor} (Concept: __________)`;
    $('blitz-answer-input').value = ''; $('blitz-feedback').classList.add('hidden'); $('blitz-answer-input').focus();
  }
  function checkBlitz() {
    const item = state.blitzItems[state.blitzIndex]; if (!item) return;
    const guess = $('blitz-answer-input').value.trim().toLowerCase();
    const fb = $('blitz-feedback'); fb.classList.remove('hidden', 'ok', 'bad');
    if (guess === item.phrase.toLowerCase()) {
      state.blitzScore += 1; fb.textContent = 'Correct!'; fb.classList.add('ok');
      item.intervalDays = item.intervalDays <= 1 ? 3 : 7; item.difficulty = 'easy'; item.nextReviewAt = Date.now() + item.intervalDays * 86400000;
      saveJSON(KEYS.VAULT, vault);
      setTimeout(() => { state.blitzIndex += 1; renderBlitz(); }, 600);
    } else { fb.textContent = 'Try again or reveal.'; fb.classList.add('bad'); }
  }
  function finishBlitz() {
    if (state.blitzTimer) clearInterval(state.blitzTimer);
    $('blitz-active-view').classList.add('hidden'); $('blitz-done-view').classList.remove('hidden');
    $('blitz-score-heading').textContent = `Blitz Complete: ${state.blitzScore} / ${state.blitzItems.length}`;
    updateVaultBadge();
  }

  $('btn-start-blitz').addEventListener('click', startBlitz);
  $('btn-vault-blitz').addEventListener('click', startBlitz);
  $('btn-dismiss-blitz').addEventListener('click', () => $('blitz-banner').classList.add('hidden'));
  $('btn-blitz-check').addEventListener('click', checkBlitz);
  $('blitz-answer-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') checkBlitz(); });
  $('btn-blitz-reveal').addEventListener('click', () => { const it = state.blitzItems[state.blitzIndex]; if (it) { $('blitz-feedback').className = 'blitz-feedback bad'; $('blitz-feedback').textContent = `Answer: "${it.phrase}"`; $('blitz-feedback').classList.remove('hidden'); } });
  $('btn-blitz-close').addEventListener('click', () => { if (state.blitzTimer) clearInterval(state.blitzTimer); $('modal-blitz').classList.add('hidden'); });
  $('btn-blitz-finish').addEventListener('click', () => $('modal-blitz').classList.add('hidden'));

  document.querySelectorAll('.modal-close').forEach((b) => b.addEventListener('click', () => $(b.dataset.close).classList.add('hidden')));
  document.querySelectorAll('.modal-backdrop').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m && m.id !== 'modal-blitz') m.classList.add('hidden'); }));

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
  }

  updateLangUI();
  loadLesson(localStorage.getItem(KEYS.ACTIVE_LESSON) || builtInLessons[0]?.id);
  updateVaultBadge();
})();
