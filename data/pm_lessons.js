window.PMFLOW_LESSONS = [
  {
    id: "pm-01",
    pillar: "prioritization",
    level: "Mid → Senior PM",
    title: {
      hy: "RICE Prioritization և Opportunity Cost",
      en: "RICE Prioritization & Opportunity Cost"
    },
    category: {
      hy: "Product Strategy · Առաջնահերթություն",
      en: "Product Strategy · Prioritization"
    },
    contextText: {
      hy: "Երբ բոլոր stakeholder-ները պնդում են, որ իրենց ֆիչան ամենակարևորն է, PM-ը չի կարող որոշում կայացնել զգացմունքով։ Առաջին քայլը Reach & Impact գնահատելն է՝ քանի իրական օգտատիրոջ վրա է ազդելու և ինչքանով է շարժելու հիմնական մետրիկը։ Երկրորդը Confidence Level-ն է՝ արդյոք ունենք իրական տվյալներ, թե պարզապես գուշակում ենք։ Երրորդը Effort Estimation-ն է թիմի շաբաթներով։ Միշտ հիշիր Opportunity Cost-ը՝ ամեն «Այո»-ն մի ֆիչային նշանակում է «Ոչ» մյուսին։ Իսկ եթե թիմը ծանրաբեռնված է, արագ արժեք տալու համար ընտրիր Quick Wins-ը։",
      en: "When every stakeholder insists their feature is urgent, a PM cannot decide based on gut feeling. Start by estimating Reach & Impact: how many real users will experience it and how strongly it moves the core metric. Next, check your Confidence Level—do you have validated data or just assumptions? Then weigh Effort Estimation in person-weeks with engineering. Always account for Opportunity Cost: saying yes to one initiative means saying no to another. When capacity is tight, prioritize high-leverage Quick Wins to deliver measurable value fast."
    },
    concepts: [
      {
        phrase: "Reach & Impact",
        feynman: {
          hy: "Քանի մարդու վրա է ազդելու փոփոխությունը և ինչքան ուժեղ է փոխելու նրանց վարքը։",
          en: "How many users will be affected and how strongly it will move your target metric."
        },
        juniorView: {
          hy: "Անում ենք, որովհետև CEO-ն կամ մեկ մեծ հաճախորդը խնդրեց։",
          en: "Build it because the CEO or one loud customer asked for it."
        },
        seniorView: {
          hy: "Հաշվում եմ՝ 10,000 օգտատերից քանիսին կհասնի և քանի %-ով կբարձրացնի Activation-ը։",
          en: "Quantify how many of our 10k MAUs it reaches and the expected lift in Activation."
        }
      },
      {
        phrase: "Confidence Level",
        feynman: {
          hy: "Թե քանի տոկոսով ենք վստահ մեր գնահատականի վրա՝ հիմնված փաստերի, ոչ թե կարծիքի վրա։",
          en: "How sure you are about your estimates based on real evidence rather than guesses."
        },
        juniorView: {
          hy: "Ինձ թվում է՝ օգտատերերին դուր կգա (100% վստահ)։",
          en: "I feel like users will love this (assumes 100% confidence)."
        },
        seniorView: {
          hy: "Ունենք 5 interview ու analytics funnel, բայց ոչ A/B test՝ Confidence-ը 60% է։",
          en: "We have 5 user interviews and funnel data, no A/B test yet—so Confidence is 60%."
        }
      },
      {
        phrase: "Effort Estimation",
        feynman: {
          hy: "Ինչքան ժամանակ և ռեսուրս է պահանջելու ամբողջ թիմից (Design + Eng + QA)։",
          en: "Total team time required across design, engineering, and QA to ship safely."
        },
        juniorView: {
          hy: "Մի փոքր կոճակ է, 2 օրում կավարտեն։",
          en: "It's just a small button, engineers can finish in 2 days."
        },
        seniorView: {
          hy: "Ներառում եմ API փոփոխությունները, edge case-երը և QA-ը՝ իրատեսական 3 person-weeks։",
          en: "Include API changes, edge cases, and QA—realistic 3 person-weeks."
        }
      },
      {
        phrase: "Opportunity Cost",
        feynman: {
          hy: "Այն արժեքը, որը կորցնում ենք՝ ընտրելով այս գործը մյուս ավելի կարևոր գործի փոխարեն։",
          en: "The value you give up by spending team time on this instead of the next best option."
        },
        juniorView: {
          hy: "Հա, սա էլ անենք, վնաս չի տա։",
          en: "Sure, let's add this too—it won't hurt."
        },
        seniorView: {
          hy: "Եթե սա անենք հիմա, Onboarding-ի բարելավումը հետաձգվում է 3 շաբաթով՝ դա է մեր գինը։",
          en: "Building this now delays our Onboarding fix by 3 weeks—that is our real cost."
        }
      },
      {
        phrase: "Quick Wins",
        feynman: {
          hy: "Փոքր ծախսով, բայց մեծ ու արագ արդյունք տվող քայլեր։",
          en: "Low-effort changes that deliver high, fast measurable value."
        },
        juniorView: {
          hy: "Եկեք 6 ամսով ամբողջ համակարգը վերագրենք։",
          en: "Let's spend 6 months rewriting the entire platform."
        },
        seniorView: {
          hy: "Նախ ուղղենք checkout-ի 2-օրյա bug-ը, որը +8% conversion է տալիս՝ հետո մեծ ռեֆակտոր։",
          en: "Ship the 2-day checkout fix for +8% conversion first, then plan the big refactor."
        }
      }
    ],
    roleplayPrompt: {
      hy: "Քեյս. Sales-ի ղեկավարը պահանջում է 4-շաբաթանոց custom dashboard 1 հաճախորդի համար, մինչդեռ քո թիմը աշխատում է Retention-ի բարելավման վրա։ Գրիր կամ ասա 4–5 նախադասությամբ քո որոշումն ու հիմնավորումը՝ օգտագործելով առնվազն 3 կոնցեպտ։",
      en: "Case: Your Head of Sales demands a 4-week custom dashboard for 1 enterprise prospect while your squad is mid-sprint on a Retention fix. Write or speak a 4–5 sentence decision using at least 3 concepts."
    }
  },
  {
    id: "pm-02",
    pillar: "delivery",
    level: "Mid → Senior Project Manager",
    title: {
      hy: "Critical Path, Dependencies և Scope Creep",
      en: "Critical Path, Dependencies & Scope Creep"
    },
    category: {
      hy: "Project Delivery · Ժամկետներ և Ռիսկեր",
      en: "Project Delivery · Timelines & Risk"
    },
    contextText: {
      hy: "Պրոյեկտները սովորաբար ուշանում են ոչ թե կոդ գրելու պատճառով, այլ թաքնված ռիսկերի։ Ամեն ռելիզից առաջ պետք է գտնել Critical Path-ը՝ այն հաջորդական խնդիրները, որոնցից ուղիղ կախված է վերջնաժամկետը։ Հաջորդը Cross-Team Dependencies-ն են՝ որ թիմն է սպասում մյուսին։ Առանց Risk Buffer-ի պլանը առաջին իսկ խնդրից փլվում է։ Երբ ընթացքում ավելանում են չպլանավորված պահանջներ, դա Scope Creep է, որը կանգնեցնելու համար պետք է ունենալ հստակ Definition of Done։",
      en: "Projects rarely slip because of typing speed—they slip due to unmapped risks. Start by identifying the Critical Path: the chain of essential tasks that directly dictates your launch date. Next, map Cross-Team Dependencies early so one squad never blocks another silently. A schedule without a Risk Buffer shatters on the first surprise. When unapproved requests sneak in mid-sprint, that is Scope Creep, which you prevent with a strict Definition of Done."
    },
    concepts: [
      {
        phrase: "Critical Path",
        feynman: {
          hy: "Ամենաերկար ու պարտադիր քայլերի շղթան, որի 1 օր ուշացումը ուշացնում է ամբողջ պրոյեկտը։",
          en: "The longest chain of dependent tasks where any 1-day delay pushes back the final launch."
        },
        juniorView: {
          hy: "Բոլոր տասկերը նույն կարևորությունն ունեն, կարևորը բոլորը զբաղված են։",
          en: "Every task is equally important as long as everyone looks busy."
        },
        seniorView: {
          hy: "Եթե Payment API-ը ուշանա 3 օր, լրիվ ռելիզը կուշանա՝ ամբողջ ուշադրությունը դրա վրա է։",
          en: "If the Payment API slips 3 days, launch slips—so I protect that chain daily."
        }
      },
      {
        phrase: "Cross-Team Dependencies",
        feynman: {
          hy: "Երբ քո թիմի աշխատանքը կանգնում է, մինչև մեկ այլ թիմ (օր.՝ Design, Legal, DevOps) իր մասը չավարտի։",
          en: "Handoffs where your team cannot finish until another team delivers their piece."
        },
        juniorView: {
          hy: "Մեր մասը պատրաստ է, մնացածը իրենց գործն է։",
          en: "Our part is done; the rest is their problem."
        },
        seniorView: {
          hy: "2 շաբաթ շուտ համաձայնեցնում եմ Legal ու DevOps թիմերի հետ, որ ռելիզի օրը չսպասենք։",
          en: "Align with Legal and DevOps 2 weeks upfront so launch day has zero surprises."
        }
      },
      {
        phrase: "Risk Buffer",
        feynman: {
          hy: "Միտումնավոր պահված լրացուցիչ ժամանակ՝ անսպասելի բագերի ու ձգձգումների համար։",
          en: "Intentional extra time built into a schedule for unexpected bugs or reviews."
        },
        juniorView: {
          hy: "Իդեալական դեպքում 10 օր է, ուրեմն ասենք 10 օրում պատրաստ կլինի։",
          en: "Best-case is 10 days, so let's promise 10 days."
        },
        seniorView: {
          hy: "Գնահատականը 10 օր է, +20% Risk Buffer՝ խոստանում ենք 12 օր։",
          en: "Estimate is 10 days; adding a 20% Risk Buffer, we commit to 12 days."
        }
      },
      {
        phrase: "Scope Creep",
        feynman: {
          hy: "Պրոյեկտի ընթացքում փոքր-փոքր նոր պահանջների անկառավարելի ավելացում։",
          en: "Uncontrolled growth of features or requirements after work has already started."
        },
        juniorView: {
          hy: "Հա, էս մի փոքր ֆիլտրն էլ ավելացնենք, մեծ բան չի։",
          en: "Sure, let's squeeze in this small filter too—no big deal."
        },
        seniorView: {
          hy: "Հիանալի գաղափար է, բայց գրանցում ենք Phase 2-ում, որ չխախտենք v1 ժամկետը։",
          en: "Great idea—logging it for Phase 2 so we protect the v1 launch date."
        }
      },
      {
        phrase: "Definition of Done",
        feynman: {
          hy: "Հստակ չեքլիստ, թե երբ է առաջադրանքը իրականում համարվում ավարտված (թեստեր, դոկումենտացիա, review)։",
          en: "A shared checklist defining when work is truly complete (tested, reviewed, deployed)."
        },
        juniorView: {
          hy: "Ծրագրավորողը կոդը գրեց՝ ուրեմն Done է։",
          en: "The developer wrote the code, so it's Done."
        },
        seniorView: {
          hy: "Done է միայն երբ QA անցած է, analytics event-ները դրված են և production-ում է։",
          en: "Done means QA passed, analytics events verified, and live in production."
        }
      }
    ],
    roleplayPrompt: {
      hy: "Քեյս. Ռելիզին մնացել է 5 օր, QA-ը գտել է 3 բագ, իսկ դիզայները ուզում է փոխել onboarding էկրանը։ Գրիր կամ ասա 4–5 նախադասությամբ քո գործողությունների պլանը՝ օգտագործելով առնվազն 3 կոնցեպտ։",
      en: "Case: 5 days before launch, QA finds 3 bugs and Design wants to tweak the onboarding screen. Outline your 4–5 sentence action plan using at least 3 concepts."
    }
  },
  {
    id: "pm-03",
    pillar: "discovery",
    level: "Mid → Senior Product Manager",
    title: {
      hy: "Discovery, JTBD և Vanity Metrics",
      en: "Product Discovery, JTBD & Vanity Metrics"
    },
    category: {
      hy: "Product Discovery · Օգտատիրոջ խնդիրը",
      en: "Product Discovery · User Value"
    },
    contextText: {
      hy: "Հաջողակ պրոդուկտ ստեղծելու համար պետք է տարբերել լուծումը իրական խնդրից։ Սկսիր Jobs To Be Done-ից՝ ինչ իրական «աշխատանք» է ուզում ավարտել օգտատերը։ Մի հավատա Vanity Metrics-ին (օր.՝ ընդհանուր գրանցումներ), այլ կենտրոնացիր North Star Metric-ի վրա, որը չափում է իրական արժեքը։ Մինչև թանկարժեք կոդ գրելը, արա MVP Validation՝ փորձարկելով ամենավտանգավոր ենթադրությունը։ Իսկ եթե թեստը ձախողվի, դա արժեքավոր տվյալ է՝ Pivot or Persevere որոշելու համար։",
      en: "Great products start by separating solutions from real user problems. Begin with Jobs To Be Done: what progress is the user actually hiring your product to make? Ignore Vanity Metrics like total signups and anchor on a North Star Metric that reflects true value delivered. Before writing expensive code, run MVP Validation to test your riskiest assumption cheaply. If the experiment fails, treat it as clear signal to decide whether to Pivot or Persevere."
    },
    concepts: [
      {
        phrase: "Jobs To Be Done",
        feynman: {
          hy: "Այն իրական նպատակը, որի համար մարդը «վարձում» է քո պրոդուկտը (ոչ թե ֆիչան, այլ արդյունքը)։",
          en: "The underlying real-life goal a user is trying to accomplish with your product."
        },
        juniorView: {
          hy: "Օգտատերը ուզում է PDF export կոճակ։",
          en: "The user wants a PDF export button."
        },
        seniorView: {
          hy: "Օգտատերը ուզում է 2 րոպեում ղեկավարին ուղարկել գեղեցիկ հաշվետվություն՝ գուցե shareable link-ը ավելի լավ է։",
          en: "The user needs to impress their boss in 2 minutes—maybe a shareable link beats PDF."
        }
      },
      {
        phrase: "Vanity Metrics",
        feynman: {
          hy: "Գեղեցիկ թվեր (օր.՝ page views, downloads), որոնք լավ են երևում սլայդում, բայց բիզնես արդյունք ցույց չեն տալիս։",
          en: "Numbers that look impressive on a slide (downloads, page views) but don't reflect real retention or value."
        },
        juniorView: {
          hy: "Հրաշալի է՝ ունենք 50,000 գրանցում այս ամիս։",
          en: "Awesome, we got 50,000 signups this month!"
        },
        seniorView: {
          hy: "50,000-ից քանի՞սն է վերադարձել 7-րդ օրը։ Եթե 2% է, գրանցումները պարզապես Vanity Metric են։",
          en: "How many of those 50k returned on Day 7? If 2%, signups are just a Vanity Metric."
        }
      },
      {
        phrase: "North Star Metric",
        feynman: {
          hy: "Մեկ գլխավոր ցուցանիշը, որը լավագույնս արտացոլում է օգտատիրոջ ստացած իրական արժեքը։",
          en: "The single core metric that best captures the value your product delivers to users."
        },
        juniorView: {
          hy: "Ամեն թիմ իր համար 20 տարբեր մետրիկ է նայում։",
          en: "Every team tracks 20 unrelated metrics."
        },
        seniorView: {
          hy: "Մեր North Star-ը «Շաբաթական ավարտված պրոյեկտների քանակն» է՝ դա է բերում retention և եկամուտ։",
          en: "Our North Star is 'Weekly Completed Projects'—it predicts both retention and revenue."
        }
      },
      {
        phrase: "MVP Validation",
        feynman: {
          hy: "Ամենափոքր և էժան փորձը՝ ստուգելու համար, արդյոք մարդկանց իրոք պետք է մեր գաղափարը։",
          en: "The smallest, cheapest test to prove whether users actually want your idea before building it fully."
        },
        juniorView: {
          hy: "Կառուցենք ամբողջ ֆիչան 2 ամսում, հետո կտեսնենք՝ կօգտագործեն, թե չէ։",
          en: "Let's build the full feature in 2 months and see if anyone uses it."
        },
        seniorView: {
          hy: "Կդնենք «Coming Soon» կոճակ կամ ֆորմա 2 օրում՝ տեսնենք քանի հոգի է սեղմում (Fake Door Test)։",
          en: "Run a 2-day Fake Door test or concierge prototype to measure real demand first."
        }
      },
      {
        phrase: "Pivot or Persevere",
        feynman: {
          hy: "Տվյալների հիման վրա որոշել՝ փոխել ուղղությունը (Pivot), թե շարունակել նույն գծով (Persevere)։",
          en: "Deciding based on evidence whether to change strategy (Pivot) or keep pushing forward (Persevere)."
        },
        juniorView: {
          hy: "Արդեն շատ ժամանակ ենք ծախսել, չենք կարող հետ կանգնել (Sunk Cost)։",
          en: "We already spent 3 months on this, we can't stop now."
        },
        seniorView: {
          hy: "Թեստը ցույց տվեց 1% հետաքրքրություն՝ կանգնեցնում ենք և Pivot ենք անում դեպի ավելի սուր խնդիր։",
          en: "The test showed 1% demand—we cut losses and Pivot toward a sharper pain point."
        }
      }
    ],
    roleplayPrompt: {
      hy: "Քեյս. Հիմնադիրը ուզում է 3 ամիս ծախսել AI չաթբոտ կառուցելու վրա, որովհետև «մրցակիցներն ունեն»։ Գրիր կամ ասա 4–5 նախադասությամբ քո արձագանքը՝ օգտագործելով առնվազն 3 կոնցեպտ։",
      en: "Case: The founder wants to spend 3 months building an AI chatbot 'because competitors have it.' Respond in 4–5 sentences using at least 3 concepts."
    }
  },
  {
    id: "pm-04",
    pillar: "leadership",
    level: "Senior → Staff PM",
    title: {
      hy: "Stakeholder Alignment, Postmortem և Root Cause",
      en: "Stakeholder Alignment, Postmortem & Root Cause"
    },
    category: {
      hy: "Leadership & Crisis · Կառավարում",
      en: "Leadership & Crisis · Execution"
    },
    contextText: {
      hy: "Երբ ինչ-որ բան խափանվում է կամ թիմերը չեն համաձայնում, ուժեղ PM-ը չի փնտրում մեղավորների։ Խնդրից հետո կազմակերպիր Blameless Postmortem՝ հասկանալու համար, թե համակարգում ինչն էր թույլ։ Փորիր խորը՝ գտնելու Root Cause-ը, այլ ոչ թե միայն արտաքին սիմպտոմը։ Որոշում կայացնելիս արա Trade-off Analysis և ներկայացրու ղեկավարությանը հստակ տարբերակներով։ Իսկ վերջում համոզվիր, որ կա Stakeholder Alignment և հստակ Action Items՝ պատասխանատուներով։",
      en: "When things break or teams clash, strong PMs focus on systems, not blame. After an incident, run a Blameless Postmortem to uncover what failed in the process. Dig past symptoms to find the true Root Cause. When making hard calls, present a clear Trade-off Analysis with concrete options. Finally, lock in Stakeholder Alignment and clear Action Items with owners and deadlines."
    },
    concepts: [
      {
        phrase: "Blameless Postmortem",
        feynman: {
          hy: "Սխալից հետո քննարկում, որտեղ նպատակը ոչ թե մարդուն պատժելն է, այլ պրոցեսը բարելավելը։",
          en: "A review after an outage or failure focused on fixing the system rather than blaming individuals."
        },
        juniorView: {
          hy: "Ո՞վ է մեղավոր, որ սերվերը ընկավ։",
          en: "Who broke the server?"
        },
        seniorView: {
          hy: "Ինչո՞ւ մեր deploy պրոցեսը թույլ տվեց, որ այդ սխալը հասնի production։",
          en: "Why did our deployment process allow this bug to reach production?"
        }
      },
      {
        phrase: "Root Cause",
        feynman: {
          hy: "Խնդրի ամենախորքային բուն պատճառը (5 Why մեթոդով), ոչ թե մակերեսային հետևանքը։",
          en: "The fundamental underlying reason a problem occurred, not just its surface symptom."
        },
        juniorView: {
          hy: "Օգտատերը սխալ կոճակ է սեղմել։",
          en: "The user clicked the wrong button."
        },
        seniorView: {
          hy: "Root Cause-ը UI-ի անհասկանալի տեքստն է և validation-ի բացակայությունը։",
          en: "The Root Cause is confusing microcopy combined with missing backend validation."
        }
      },
      {
        phrase: "Trade-off Analysis",
        feynman: {
          hy: "Տարբերակների ազնիվ համեմատություն՝ ամեն մեկի պլյուսներով, մինուսներով և ռիսկերով։",
          en: "Comparing options honestly by showing what you gain and what you sacrifice with each."
        },
        juniorView: {
          hy: "Եկեք ընտրենք Ա տարբերակը, լավն է։",
          en: "Let's pick Option A, it looks good."
        },
        seniorView: {
          hy: "Ա-ն արագ է (1 շաբաթ), բայց scale չի լինի; Բ-ն (4 շաբաթ) կայուն է։ Առաջարկում եմ Ա՝ որպես թեստ։",
          en: "Option A ships in 1 week but won't scale; B takes 4 weeks. I recommend A to validate demand first."
        }
      },
      {
        phrase: "Stakeholder Alignment",
        feynman: {
          hy: "Վիճակ, երբ բոլոր առանցքային կողմերը (Eng, Sales, Design, Execs) հասկանում և ընդունում են նույն պլանը։",
          en: "Ensuring all key decision-makers understand and agree on the plan before execution."
        },
        juniorView: {
          hy: "Ես իմ գաղափարը գրեցի Slack-ում, երևի տեսել են։",
          en: "I posted my idea in Slack, they probably saw it."
        },
        seniorView: {
          hy: "Նախքան sprint-ը սկսելը, 15 րոպեում համաձայնեցնում եմ ռիսկերն ու նպատակը բոլոր lead-երի հետ։",
          en: "Before sprint start, I align all leads on goals and trade-offs in a crisp 15-min sync."
        }
      },
      {
        phrase: "Action Items",
        feynman: {
          hy: "Կոնկրետ քայլեր հանդիպումից հետո՝ «Ով + Ինչ + Մինչև երբ» ձևաչափով։",
          en: "Concrete next steps after a meeting with a clear Owner, Task, and Deadline."
        },
        juniorView: {
          hy: "Լավ խոսեցինք, հետո կնայենք։",
          en: "Great discussion, let's look into it soon."
        },
        seniorView: {
          hy: "1. Արան ավելացնում է alert մինչև հինգշաբթի. 2. Ես թարմացնում եմ PRD-ն այսօր երեկոյան։",
          en: "1. Alex adds alerting by Thursday. 2. I update the PRD tonight."
        }
      }
    ],
    roleplayPrompt: {
      hy: "Քեյս. Երեկվա ռելիզից հետո 30 րոպեով վճարումները կանգնել էին, և Marketing-ն ու Engineering-ը մեղադրում են իրար։ Գրիր կամ ասա 4–5 նախադասությամբ քո քայլերը՝ օգտագործելով առնվազն 3 կոնցեպտ։",
      en: "Case: Payments went down for 30 minutes after yesterday's release, and Marketing and Engineering are blaming each other. Outline your 4–5 sentence leadership response using at least 3 concepts."
    }
  }
];

window.PMFLOW_ENDLESS_BANK = [
  {
    phrase: "Unit Economics",
    feynman: { hy: "Արդյոք 1 հաճախորդից ստացած եկամուտը (LTV) գերազանցում է նրան ներգրավելու և սպասարկելու ծախսը (CAC)։", en: "Whether the revenue from a single customer (LTV) exceeds the cost to acquire and serve them (CAC)." },
    juniorView: { hy: "Մեր օգտատերերը շատանում են, ծախսը հետո կհաշվենք։", en: "Users are growing, we'll figure out costs later." },
    seniorView: { hy: "LTV/CAC-ը 1.4 է՝ եթե scale անենք հիմա, ամեն նոր օգտատեր մեզ վնաս է բերելու։", en: "LTV/CAC is 1.4x—scaling acquisition now only burns cash faster." }
  },
  {
    phrase: "Second-Order Effects",
    feynman: { hy: "Ոչ թե առաջին ուղիղ արդյունքը, այլ դրան հաջորդող անուղղակի հետևանքները 3-6 ամիս հետո։", en: "The downstream consequences of a decision that happen after the immediate first result." },
    juniorView: { hy: "Զեղչ տվեցինք, վաճառքները այս շաբաթ աճեցին՝ հիանալի է։", en: "We offered a discount and sales spiked this week—great!" },
    seniorView: { hy: "Հաճախակի զեղչերի Second-Order Effect-ը brand-ի արժեզրկումն է ու churn-ի աճը։", en: "The Second-Order Effect of constant discounting is training users to never pay full price." }
  },
  {
    phrase: "Kill Criteria",
    feynman: { hy: "Նախապես գրված հստակ պայմաններ, թե երբ ենք փակում ֆիչան կամ պրոյեկտը, եթե արդյունք չտա։", en: "Pre-agreed thresholds that trigger shutting down an experiment or project if it fails." },
    juniorView: { hy: "Երբ արդեն launch անենք, կտեսնենք՝ ինչ է լինում։", en: "Once we launch it, we'll just see how it goes." },
    seniorView: { hy: "Եթե 30 օրում Adoption-ը չանցնի 8%-ը, կիրառում ենք Kill Criteria և հանում ենք կոդը։", en: "If adoption stays under 8% after 30 days, we trigger Kill Criteria and sunset it." }
  },
  {
    phrase: "Tech Debt",
    feynman: { hy: "Արագության համար արված կոմպրոմիսներ կոդում/արխիտեկտուրայում, որոնք հետո դանդաղեցնում են ամեն նոր ֆիչա։", en: "Shortcuts taken for speed today that slow down every future release until paid down." },
    juniorView: { hy: "Թող ինժեներները միշտ նոր ֆիչա գրեն, ռեֆակտորը ժամանակի կորուստ է։", en: "Keep engineers on new features; refactoring is wasted time." },
    seniorView: { hy: "Ամեն sprint-ի 15%-ը տալիս ենք Tech Debt-ին, որ velocity-ն 6 ամսից զրո չդառնա։", en: "Allocate 15% of sprint capacity to Tech Debt so delivery velocity doesn't collapse." }
  },
  {
    phrase: "Pre-Mortem",
    feynman: { hy: "Պրոյեկտը սկսելուց առաջ պատկերացնել, որ այն ձախողվել է, և գտնել՝ ինչու։", en: "Imagining a project has already failed before starting, to catch hidden risks early." },
    juniorView: { hy: "Պոզիտիվ մնանք, ամեն ինչ լավ կլինի։", en: "Let's stay positive, it'll work out." },
    seniorView: { hy: "30-րոպեանոց Pre-Mortem արեցինք և գտանք 2 լուրջ billing edge-case մինչև կոդ գրելը։", en: "A 30-min Pre-Mortem exposed 2 critical billing edge cases before a single line of code." }
  },
  {
    phrase: "Pricing Power",
    feynman: { hy: "Որքանով կարող ես բարձրացնել գինը կամ փոխել մոդելը՝ առանց հաճախորդների զանգվածային կորստի։", en: "The ability to raise prices or shift monetization without losing core customers." },
    juniorView: { hy: "Եկեք ամենաէժանը լինենք շուկայում, որ բոլորը մեզ ընտրեն։", en: "Let's be the cheapest option so everyone picks us." },
    seniorView: { hy: "Մեր workflow lock-in-ը տալիս է բարձր Pricing Power՝ անցնում ենք usage-based tier-ի։", en: "Our workflow lock-in gives us strong Pricing Power to shift toward value-based tiers." }
  }
];
