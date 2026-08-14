document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   GOOGLE ANALYTICS
========================================================== */

function trackCrypticEvent(
  eventName,
  extraData
) {

  if (
    typeof gtag !==
    "function"
  ) {

    return;

  }


  gtag(
    "event",
    eventName,
    {
      game_name:
        "cryptic_calculus",

      ...(extraData || {})
    }
  );

}


/*
  Prevent duplicate solve/reveal events
  during the same page visit.
*/

const solvedPractices =
  new Set();


const revealedPractices =
  new Set();


const solvedChallenges =
  new Set();


const revealedChallenges =
  new Set();



/* ==========================================================
   CRYPTIC-CALCULUS OPERATIONS
========================================================== */

const operations = [

  {

    id:
      "approximation",

    title:
      "Approximation / Homophone",

    symbol:
      "≈",

    category:
      "SOUND OPERATION",

    visual:
      "🔈  ≈  ",

    subtitle:
      "Different spelling. Similar sound.",

    formula:
      "sound(A) ≈ sound(B)",

    description:
      "Treat one spoken form as approximately equivalent to another. The spelling changes while the sound remains close enough to carry the transformation.",

    exampleInput:
      "SOX",

    exampleOperation:
      "Approximation",

    exampleMiddle:
      "SOX ≈ SOCKS",

    exampleResult:
      "SOCKS",

    note:
      "The approximation sign represents near-equivalence rather than literal identity.",


    practiceClue:
      "Reportedly, a pair of fruit. (4)",

    practiceAnswer:
      "PEAR",

    practiceHint:
      "Say PAIR aloud.",

    practiceExplanation:
      "PAIR ≈ PEAR. The sound supplies PEAR, defined by fruit."

  },


  {

    id:
      "superposition",

    title:
      "Superposition",

    symbol:
      "⊕",

    category:
      "MEANING OPERATION",

    visual:
      "MEANING A  ⊕  MEANING B",

    subtitle:
      "Two meanings. One answer.",

    formula:
      "M₁(x) ⊕ M₂(x) → x",

    description:
      "Keep two definitions active simultaneously until one lexical state satisfies both.",

    exampleInput:
      "Pulling a rabbit out three times is the goal.",

    exampleOperation:
      "Magic ⊕ Sport",

    exampleMiddle:
      "hat trick ⊕ hat trick",

    exampleResult:
      "HAT-TRICK",

    note:
      "Double definitions become a superposition of meanings that collapse onto one answer.",


    practiceClue:
      "Season or coil. (6)",

    practiceAnswer:
      "SPRING",

    practiceHint:
      "One word names both a season and a coil.",

    practiceExplanation:
      "SPRING satisfies both definitions simultaneously."

  },


  {

    id:
      "container",

    title:
      "Container",

    symbol:
      "⊂",

    category:
      "STRUCTURE OPERATION",

    visual:
      "OUTER ⟦ INNER ⟧",

    subtitle:
      "Put one unit inside another.",

    formula:
      "C(outer, inner) = outer(inner)",

    description:
      "Place one piece of clue material inside another. Words such as around, holding, containing and swallowing can signal the operation.",

    exampleInput:
      "SING holds T",

    exampleOperation:
      "Container(SING, T)",

    exampleMiddle:
      "S(T)ING",

    exampleResult:
      "STING",

    note:
      "Container notation preserves which material acts as the shell and which acts as the inserted object.",


    practiceClue:
      "Pain from SING holding T. (5)",

    practiceAnswer:
      "STING",

    practiceHint:
      "Put T inside SING.",

    practiceExplanation:
      "SING contains T → S(T)ING → STING."

  },


  {

    id:
      "composition",

    title:
      "Composition",

    symbol:
      "∘",

    category:
      "FUNCTION OPERATION",

    visual:
      "x → g(x) → f(g(x))",

    subtitle:
      "Apply one operation after another.",

    formula:
      "(f ∘ g)(x) = f(g(x))",

    description:
      "Feed the output of one wordplay operation into another. This lets a multi-step cryptic clue behave like composed functions.",

    exampleInput:
      "DRAWERS",

    exampleOperation:
      "Reverse ∘ Delete(S)",

    exampleMiddle:
      "DRAWERS − S = DRAWER",

    exampleResult:
      "DRAWER ↔ REWARD",

    note:
      "Order matters: f ∘ g means apply g first and f second.",


    practiceClue:
      "Prize from DRAWERS losing S, returned. (6)",

    practiceAnswer:
      "REWARD",

    practiceHint:
      "Delete S first. Then reverse what remains.",

    practiceExplanation:
      "DRAWERS − S = DRAWER. Reverse DRAWER → REWARD."

  },


  {

    id:
      "deletion",

    title:
      "Deletion",

    symbol:
      "−",

    category:
      "LETTER OPERATION",

    visual:
      "WHOLE − PART",

    subtitle:
      "Remove specified material.",

    formula:
      "A − B",

    description:
      "Subtract a specified letter, sound, beginning, ending or other unit from the clue material.",

    exampleInput:
      "PLANE − P",

    exampleOperation:
      "Deletion",

    exampleMiddle:
      "PLANE − P",

    exampleResult:
      "LANE",

    note:
      "Indicators can include without, losing, headless, tailless, dropping or minus.",


    practiceClue:
      "Narrow passage from PLANE without P. (4)",

    practiceAnswer:
      "LANE",

    practiceHint:
      "Remove the first letter of PLANE.",

    practiceExplanation:
      "PLANE − P = LANE."

  },


  {

    id:
      "reversal",

    title:
      "Reversal",

    symbol:
      "↔",

    category:
      "ORDER OPERATION",

    visual:
      "A B C  ↔  C B A",

    subtitle:
      "Reverse the sequence.",

    formula:
      "R(a₁a₂...aₙ) = aₙ...a₂a₁",

    description:
      "Reverse the order of letters or another sequence supplied by the clue.",

    exampleInput:
      "DON",

    exampleOperation:
      "Reverse",

    exampleMiddle:
      "DON ↔ NOD",

    exampleResult:
      "NOD",

    note:
      "Indicators can include back, returned, reflected, reversed or turned.",


    practiceClue:
      "Consent when DON turns back. (3)",

    practiceAnswer:
      "NOD",

    practiceHint:
      "Reverse DON.",

    practiceExplanation:
      "DON reversed gives NOD, meaning consent."

  },


  {

    id:
      "anagram",

    title:
      "Anagram",

    symbol:
      "⟳",

    category:
      "PERMUTATION OPERATION",

    visual:
      "A B C D  ⟳  B D A C",

    subtitle:
      "Rearrange the components.",

    formula:
      "Permute(A) → A′",

    description:
      "Rearrange a supplied set of letters while preserving the same components.",

    exampleInput:
      "SILENT",

    exampleOperation:
      "Permutation",

    exampleMiddle:
      "⟳ SILENT",

    exampleResult:
      "LISTEN",

    note:
      "Anagram indicators often suggest mixing, disorder, movement or transformation.",


    practiceClue:
      "Attend to SILENT mixed. (6)",

    practiceAnswer:
      "LISTEN",

    practiceHint:
      "Rearrange every letter in SILENT.",

    practiceExplanation:
      "SILENT ⟳ LISTEN."

  },


  {

    id:
      "rebus",

    title:
      "Rebus Bus",

    symbol:
      "🚌",

    category:
      "VISUAL OPERATION",

    visual:
      "🚌  LAYOUT → LANGUAGE",

    subtitle:
      "Read arrangement as meaning.",

    formula:
      "layout(x) → lexical meaning",

    description:
      "Position itself becomes information. Read above, below, inside, outside, repeated or displaced material as part of the answer.",

    exampleInput:
      "HEAD\n\nHEELS",

    exampleOperation:
      "Read vertical relation",

    exampleMiddle:
      "HEAD over HEELS",

    exampleResult:
      "HEAD OVER HEELS",

    note:
      "The arrangement is an operator: visual position becomes lexical structure.",


    practiceClue:
      "Read the arrangement.",

    practiceVisual:
      "HEAD\n\nHEELS",

    practiceAnswer:
      "HEAD OVER HEELS",

    practiceHint:
      "Where is HEAD relative to HEELS?",

    practiceExplanation:
      "HEAD is physically over HEELS → HEAD OVER HEELS."

  },


  {

    id:
      "redfish",

    title:
      "Red-Fish Blue-Shift",

    symbol:
      "⇠🐟⇢",

    category:
      "SEMANTIC SHIFT",

    visual:
      "RED ⇠ 🐟 ⇢ BLUE",

    subtitle:
      "Shift interpretation toward or away.",

    formula:
      "Shift(m, ±Δcontext)",

    description:
      "Move an interpretation through semantic space. A blue-shift pulls it toward a target relation; a red-shift moves it away into a broader or more displaced reading.",

    exampleInput:
      "SOX",

    exampleOperation:
      "Blue-shift toward clothing through sound",

    exampleMiddle:
      "SOX ≈ SOCKS",

    exampleResult:
      "SOCKS",

    note:
      "The shift visualizes movement between interpretations rather than treating lexical meaning as fixed.",


    practiceClue:
      "Blue-shift SOX toward something worn on your feet. (5)",

    practiceAnswer:
      "SOCKS",

    practiceHint:
      "Shift by sound rather than spelling.",

    practiceExplanation:
      "SOX blue-shifts toward the sound-equivalent SOCKS."

  }

];



/* ==========================================================
   MULTI-OPERATION CHALLENGES
========================================================== */

const challenges = [

  {

    clue:
      "Prize from DRAWERS losing S, returned.",

    enumeration:
      "(6)",

    answer:
      "REWARD",

    operations:
      [
        "Deletion",
        "Reversal"
      ],

    formula:
      "R(DRAWERS − S)",

    hint:
      "Use Deletion first, then Reversal.",

    steps:
      [
        "Start with DRAWERS.",
        "Delete S → DRAWER.",
        "Reverse DRAWER → REWARD.",
        "REWARD = prize."
      ]

  },


  {

    clue:
      "Pain from SIGN mixed around T.",

    enumeration:
      "(5)",

    answer:
      "STING",

    operations:
      [
        "Anagram",
        "Container"
      ],

    formula:
      "Container(⟳SIGN, T)",

    hint:
      "Rearrange SIGN first, then put T inside.",

    steps:
      [
        "Anagram SIGN → SING.",
        "Insert T into SING.",
        "S(T)ING → STING.",
        "STING = pain."
      ]

  },


  {

    clue:
      "Footwear reportedly from baseball team SOX.",

    enumeration:
      "(5)",

    answer:
      "SOCKS",

    operations:
      [
        "Approximation",
        "Blue-Shift"
      ],

    formula:
      "BlueShift(sound(SOX)) ≈ SOCKS",

    hint:
      "Move from the written team name toward its spoken clothing equivalent.",

    steps:
      [
        "Begin with SOX.",
        "Use sound rather than spelling.",
        "SOX ≈ SOCKS.",
        "Shift toward the clothing meaning → SOCKS."
      ]

  },


  {

    clue:
      "Prize hidden behind two moves: remove S from DRAWERS, then send it back.",

    enumeration:
      "(6)",

    answer:
      "REWARD",

    operations:
      [
        "Deletion",
        "Composition",
        "Reversal"
      ],

    formula:
      "(R ∘ Dₛ)(DRAWERS)",

    hint:
      "This explicitly forms a composition of two functions.",

    steps:
      [
        "Dₛ(DRAWERS) = DRAWER.",
        "R(DRAWER) = REWARD.",
        "Therefore (R ∘ Dₛ)(DRAWERS) = REWARD."
      ]

  }

];



/* ==========================================================
   STATE
========================================================== */

let activeOperation =
  operations[0];


let challengeIndex =
  0;


let challengeSolvedCount =
  0;


let compositionInitialized =
  false;



/* ==========================================================
   ELEMENTS
========================================================== */

const operationBank =
  document.getElementById(
    "operationBank"
  );


const operationCategory =
  document.getElementById(
    "operationCategory"
  );


const operationTitle =
  document.getElementById(
    "operationTitle"
  );


const operationSymbol =
  document.getElementById(
    "operationSymbol"
  );


const operationVisual =
  document.getElementById(
    "operationVisual"
  );


const operationFormula =
  document.getElementById(
    "operationFormula"
  );


const operationDescription =
  document.getElementById(
    "operationDescription"
  );


const exampleInput =
  document.getElementById(
    "exampleInput"
  );


const exampleOperation =
  document.getElementById(
    "exampleOperation"
  );


const exampleMiddle =
  document.getElementById(
    "exampleMiddle"
  );


const exampleResult =
  document.getElementById(
    "exampleResult"
  );


const operationNote =
  document.getElementById(
    "operationNote"
  );


const practiceSymbol =
  document.getElementById(
    "practiceSymbol"
  );


const practiceClue =
  document.getElementById(
    "practiceClue"
  );


const practiceVisual =
  document.getElementById(
    "practiceVisual"
  );


const practiceInput =
  document.getElementById(
    "practiceInput"
  );


const practiceFeedback =
  document.getElementById(
    "practiceFeedback"
  );


const practiceSolution =
  document.getElementById(
    "practiceSolution"
  );


const firstOperation =
  document.getElementById(
    "firstOperation"
  );


const secondOperation =
  document.getElementById(
    "secondOperation"
  );


const compositionFormula =
  document.getElementById(
    "compositionFormula"
  );


const compositionExplanation =
  document.getElementById(
    "compositionExplanation"
  );


const referenceGrid =
  document.getElementById(
    "referenceGrid"
  );



/* ==========================================================
   NORMALIZE ANSWERS
========================================================== */

function normalizeAnswer(
  text
) {

  return text
    .trim()
    .toUpperCase()
    .replace(
      /[^A-Z0-9]/g,
      ""
    );

}



/* ==========================================================
   OPERATION BANK
========================================================== */

function buildOperationBank() {

  operationBank.innerHTML =
    "";


  operations.forEach(
    function (
      operation
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "operation-card";


      button.dataset.operationId =
        operation.id;


      button.innerHTML =
        '<div class="operation-card-symbol">'
        +
        operation.symbol
        +
        '</div>'
        +
        '<div>'
        +
        '<span class="operation-card-title">'
        +
        operation.title
        +
        '</span>'
        +
        '<span class="operation-card-subtitle">'
        +
        operation.subtitle
        +
        '</span>'
        +
        '</div>';


      button.addEventListener(
        "click",
        function () {

          showOperation(
            operation.id,
            true
          );

        }
      );


      operationBank.appendChild(
        button
      );

    }
  );

}



/* ==========================================================
   SHOW OPERATION
========================================================== */

function showOperation(
  id,
  trackView
) {

  const operation =
    operations.find(
      function (
        item
      ) {

        return item.id === id;

      }
    );


  if (
    !operation
  ) {

    return;

  }


  activeOperation =
    operation;


  if (
    trackView
  ) {

    trackCrypticEvent(
      "operation_viewed",
      {
        operation_id:
          operation.id,

        operation_name:
          operation.title,

        operation_category:
          operation.category
      }
    );

  }


  document
    .querySelectorAll(
      ".operation-card"
    )
    .forEach(
      function (
        card
      ) {

        card.classList.remove(
          "active"
        );

      }
    );


  const activeCard =
    document.querySelector(
      '[data-operation-id="'
      +
      id
      +
      '"]'
    );


  if (
    activeCard
  ) {

    activeCard.classList.add(
      "active"
    );

  }


  operationCategory.textContent =
    operation.category;


  operationTitle.textContent =
    operation.title;


  operationSymbol.textContent =
    operation.symbol;


  operationVisual.textContent =
    operation.visual;


  operationFormula.textContent =
    operation.formula;


  operationDescription.textContent =
    operation.description;


  exampleInput.textContent =
    operation.exampleInput;


  exampleOperation.textContent =
    operation.exampleOperation;


  exampleMiddle.textContent =
    operation.exampleMiddle;


  exampleResult.textContent =
    operation.exampleResult;


  operationNote.textContent =
    operation.note;


  loadPractice(
    operation
  );

}



/* ==========================================================
   MINI PRACTICE
========================================================== */

function loadPractice(
  operation
) {

  practiceSymbol.textContent =
    operation.symbol;


  practiceClue.textContent =
    operation.practiceClue;


  practiceInput.value =
    "";


  practiceFeedback.textContent =
    "";


  practiceFeedback.classList.remove(
    "correct"
  );


  practiceSolution.textContent =
    "";


  practiceSolution.classList.remove(
    "visible"
  );


  if (
    operation.practiceVisual
  ) {

    practiceVisual.textContent =
      operation.practiceVisual;


    practiceVisual.classList.add(
      "visible"
    );

  }

  else {

    practiceVisual.textContent =
      "";


    practiceVisual.classList.remove(
      "visible"
    );

  }

}



/* ==========================================================
   MINI PRACTICE CHECK
========================================================== */

function checkPractice() {

  const guess =
    normalizeAnswer(
      practiceInput.value
    );


  const answer =
    normalizeAnswer(
      activeOperation.practiceAnswer
    );


  if (
    !guess
  ) {

    practiceFeedback.textContent =
      "Enter an answer first.";


    return;

  }


  trackCrypticEvent(
    "mini_clue_attempted",
    {
      operation_id:
        activeOperation.id,

      operation_name:
        activeOperation.title
    }
  );


  if (
    guess ===
    answer
  ) {

    practiceFeedback.textContent =
      "✓ Correct — "
      +
      activeOperation.practiceAnswer;


    practiceFeedback.classList.add(
      "correct"
    );


    practiceSolution.textContent =
      activeOperation.practiceExplanation;


    practiceSolution.classList.add(
      "visible"
    );


    if (
      !solvedPractices.has(
        activeOperation.id
      )
    ) {

      solvedPractices.add(
        activeOperation.id
      );


      trackCrypticEvent(
        "mini_clue_solved",
        {
          operation_id:
            activeOperation.id,

          operation_name:
            activeOperation.title,

          answer:
            activeOperation.practiceAnswer
        }
      );

    }


    return;

  }


  practiceFeedback.classList.remove(
    "correct"
  );


  practiceFeedback.textContent =
    "Not quite. Apply the selected operation again.";

}



document
  .getElementById(
    "practiceCheck"
  )
  .addEventListener(
    "click",
    checkPractice
  );


practiceInput
  .addEventListener(
    "keydown",
    function (
      event
    ) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();


        checkPractice();

      }

    }
  );



/* ==========================================================
   PRACTICE HINT
========================================================== */

document
  .getElementById(
    "practiceHint"
  )
  .addEventListener(
    "click",
    function () {

      practiceFeedback.textContent =
        activeOperation.practiceHint;


      trackCrypticEvent(
        "mini_clue_hint",
        {
          operation_id:
            activeOperation.id,

          operation_name:
            activeOperation.title
        }
      );

    }
  );



/* ==========================================================
   PRACTICE REVEAL
========================================================== */

document
  .getElementById(
    "practiceReveal"
  )
  .addEventListener(
    "click",
    function () {

      practiceInput.value =
        activeOperation.practiceAnswer;


      practiceFeedback.textContent =
        "Answer revealed.";


      practiceSolution.textContent =
        activeOperation.practiceExplanation;


      practiceSolution.classList.add(
        "visible"
      );


      if (
        !revealedPractices.has(
          activeOperation.id
        )
        &&
        !solvedPractices.has(
          activeOperation.id
        )
      ) {

        revealedPractices.add(
          activeOperation.id
        );


        trackCrypticEvent(
          "mini_clue_revealed",
          {
            operation_id:
              activeOperation.id,

            operation_name:
              activeOperation.title
          }
        );

      }

    }
  );



/* ==========================================================
   COMPOSITION SELECTORS
========================================================== */

function buildCompositionSelectors() {

  firstOperation.innerHTML =
    "";


  secondOperation.innerHTML =
    "";


  operations.forEach(
    function (
      operation
    ) {

      const optionOne =
        document.createElement(
          "option"
        );


      optionOne.value =
        operation.id;


      optionOne.textContent =
        operation.symbol
        +
        " "
        +
        operation.title;


      firstOperation.appendChild(
        optionOne
      );


      const optionTwo =
        document.createElement(
          "option"
        );


      optionTwo.value =
        operation.id;


      optionTwo.textContent =
        operation.symbol
        +
        " "
        +
        operation.title;


      secondOperation.appendChild(
        optionTwo
      );

    }
  );


  firstOperation.value =
    "deletion";


  secondOperation.value =
    "reversal";


  updateComposition(
    false
  );


  compositionInitialized =
    true;

}



/* ==========================================================
   COMPOSITION
========================================================== */

function updateComposition(
  shouldTrack
) {

  const first =
    operations.find(
      function (
        operation
      ) {

        return (
          operation.id ===
          firstOperation.value
        );

      }
    );


  const second =
    operations.find(
      function (
        operation
      ) {

        return (
          operation.id ===
          secondOperation.value
        );

      }
    );


  if (
    !first ||
    !second
  ) {

    return;

  }


  compositionFormula.textContent =
    second.symbol
    +
    " ∘ "
    +
    first.symbol
    +
    " (x)";


  compositionExplanation.textContent =
    "Apply "
    +
    first.title
    +
    " first. Its output becomes the input for "
    +
    second.title
    +
    ".";


  if (
    shouldTrack
    &&
    compositionInitialized
  ) {

    trackCrypticEvent(
      "operation_composed",
      {
        first_operation:
          first.id,

        first_operation_name:
          first.title,

        second_operation:
          second.id,

        second_operation_name:
          second.title
      }
    );

  }

}



firstOperation
  .addEventListener(
    "change",
    function () {

      updateComposition(
        true
      );

    }
  );


secondOperation
  .addEventListener(
    "change",
    function () {

      updateComposition(
        true
      );

    }
  );



/* ==========================================================
   CHALLENGE ELEMENTS
========================================================== */

const challengeClue =
  document.getElementById(
    "challengeClue"
  );


const challengeEnumeration =
  document.getElementById(
    "challengeEnumeration"
  );


const challengeInput =
  document.getElementById(
    "challengeInput"
  );


const challengeFeedback =
  document.getElementById(
    "challengeFeedback"
  );


const challengeBreakdown =
  document.getElementById(
    "challengeBreakdown"
  );


const challengeFormula =
  document.getElementById(
    "challengeFormula"
  );


const challengeSteps =
  document.getElementById(
    "challengeSteps"
  );



/* ==========================================================
   LOAD CHALLENGE
========================================================== */

function loadChallenge() {

  const challenge =
    challenges[
      challengeIndex
    ];


  document
    .getElementById(
      "challengeNumber"
    )
    .textContent =
      (
        challengeIndex +
        1
      );


  challengeClue.textContent =
    challenge.clue;


  challengeEnumeration.textContent =
    challenge.enumeration;


  challengeInput.value =
    "";


  challengeFeedback.textContent =
    "";


  challengeFeedback.classList.remove(
    "correct"
  );


  challengeBreakdown.classList.remove(
    "visible"
  );


  challengeFormula.textContent =
    "";


  challengeSteps.innerHTML =
    "";

}



/* ==========================================================
   CHALLENGE BREAKDOWN
========================================================== */

function revealChallengeBreakdown(
  challenge
) {

  challengeFormula.textContent =
    challenge.formula;


  challengeSteps.innerHTML =
    "";


  challenge.steps.forEach(
    function (
      step,
      index
    ) {

      const line =
        document.createElement(
          "div"
        );


      line.textContent =
        (
          index +
          1
        )
        +
        ". "
        +
        step;


      challengeSteps.appendChild(
        line
      );

    }
  );


  challengeBreakdown.classList.add(
    "visible"
  );

}



/* ==========================================================
   CHECK CHALLENGE
========================================================== */

function checkChallenge() {

  const challenge =
    challenges[
      challengeIndex
    ];


  const guess =
    normalizeAnswer(
      challengeInput.value
    );


  if (
    !guess
  ) {

    challengeFeedback.textContent =
      "Enter an answer first.";


    return;

  }


  trackCrypticEvent(
    "challenge_attempted",
    {
      challenge_number:
        challengeIndex +
        1,

      operations:
        challenge.operations.join(
          " + "
        )
    }
  );


  if (
    guess ===
    normalizeAnswer(
      challenge.answer
    )
  ) {

    challengeFeedback.textContent =
      "✓ Correct — "
      +
      challenge.answer;


    challengeFeedback.classList.add(
      "correct"
    );


    /*
      Only increase the displayed solve count
      the first time this challenge is solved.
    */

    if (
      !solvedChallenges.has(
        challengeIndex
      )
    ) {

      solvedChallenges.add(
        challengeIndex
      );


      challengeSolvedCount++;


      document
        .getElementById(
          "challengeSolved"
        )
        .textContent =
          challengeSolvedCount;


      trackCrypticEvent(
        "challenge_solved",
        {
          challenge_number:
            challengeIndex +
            1,

          answer:
            challenge.answer,

          operations:
            challenge.operations.join(
              " + "
            ),

          total_challenges_solved:
            challengeSolvedCount
        }
      );

    }


    revealChallengeBreakdown(
      challenge
    );


    return;

  }


  challengeFeedback.classList.remove(
    "correct"
  );


  challengeFeedback.textContent =
    "Not quite. Track the transformations in order.";

}



document
  .getElementById(
    "challengeCheck"
  )
  .addEventListener(
    "click",
    checkChallenge
  );


challengeInput
  .addEventListener(
    "keydown",
    function (
      event
    ) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();


        checkChallenge();

      }

    }
  );



/* ==========================================================
   CHALLENGE HINT
========================================================== */

document
  .getElementById(
    "challengeHint"
  )
  .addEventListener(
    "click",
    function () {

      const challenge =
        challenges[
          challengeIndex
        ];


      challengeFeedback.textContent =
        challenge.hint;


      trackCrypticEvent(
        "challenge_hint",
        {
          challenge_number:
            challengeIndex +
            1,

          operations:
            challenge.operations.join(
              " + "
            )
        }
      );

    }
  );



/* ==========================================================
   CHALLENGE REVEAL
========================================================== */

document
  .getElementById(
    "challengeReveal"
  )
  .addEventListener(
    "click",
    function () {

      const challenge =
        challenges[
          challengeIndex
        ];


      challengeInput.value =
        challenge.answer;


      challengeFeedback.textContent =
        "Answer revealed.";


      revealChallengeBreakdown(
        challenge
      );


      if (
        !revealedChallenges.has(
          challengeIndex
        )
        &&
        !solvedChallenges.has(
          challengeIndex
        )
      ) {

        revealedChallenges.add(
          challengeIndex
        );


        trackCrypticEvent(
          "challenge_revealed",
          {
            challenge_number:
              challengeIndex +
              1,

            operations:
              challenge.operations.join(
                " + "
              )
          }
        );

      }

    }
  );



/* ==========================================================
   NEXT CHALLENGE
========================================================== */

document
  .getElementById(
    "challengeNext"
  )
  .addEventListener(
    "click",
    function () {

      challengeIndex =
        (
          challengeIndex +
          1
        )
        %
        challenges.length;


      trackCrypticEvent(
        "challenge_viewed",
        {
          challenge_number:
            challengeIndex +
            1,

          operations:
            challenges[
              challengeIndex
            ].operations.join(
              " + "
            )
        }
      );


      loadChallenge();

    }
  );



/* ==========================================================
   QUICK REFERENCE
========================================================== */

function buildReferenceGrid() {

  referenceGrid.innerHTML =
    "";


  operations.forEach(
    function (
      operation
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "reference-card";


      card.innerHTML =
        '<div class="reference-symbol">'
        +
        operation.symbol
        +
        '</div>'
        +
        '<h3>'
        +
        operation.title
        +
        '</h3>'
        +
        '<p>'
        +
        operation.subtitle
        +
        '</p>';


      referenceGrid.appendChild(
        card
      );

    }
  );

}



/* ==========================================================
   START
========================================================== */

buildOperationBank();


buildCompositionSelectors();


buildReferenceGrid();


showOperation(
  operations[0].id,
  false
);


loadChallenge();


trackCrypticEvent(
  "world_entered",
  {
    operation_count:
      operations.length,

    challenge_count:
      challenges.length
  }
);


});
