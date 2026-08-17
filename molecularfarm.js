/* ==========================================================
   MOLECULAR FARM
   PAT LEARNING LAB

   VERSION 2 FOUNDATION

   ELEMENTAL SPECIES
   MOLECULAR SPECIES
   HABITATS
   EVOLUTION LINES
   PERIOD-EX
   ANALYTICS

   This file is designed to remain compatible with
   the current Molecular Farm HTML while preparing
   the game for the new Farm / Wild / Sea system.
========================================================== */


/* ==========================================================
   ANALYTICS
========================================================== */

function trackFarmEvent(
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
        "molecular_farm",

      ...(extraData || {})
    }
  );

}



/* ==========================================================
   HABITATS

   These become actual playable worlds in the next HTML step.
========================================================== */

const habitats = {

  period:
    {
      id:
        "period",

      name:
        "Chemical-Period",

      icon:
        "🌱",

      description:
        "The elemental species of Molecular Farm."
    },


  farm:
    {
      id:
        "farm",

      name:
        "On the Farm",

      icon:
        "🌾",

      description:
        "Build and discover molecular farm animals."
    },


  wild:
    {
      id:
        "wild",

      name:
        "In the Wild",

      icon:
        "🌲",

      description:
        "Search for elemental and molecular species in the wild."
    },


  sea:
    {
      id:
        "sea",

      name:
        "Under the Sea",

      icon:
        "🌊",

      description:
        "Discover aquatic molecular species."
    },


  evolution:
    {
      id:
        "evolution",

      name:
        "Evolution Lines",

      icon:
        "🧬",

      description:
        "Watch molecular species transform as their chemical environments change."
    }

};



/* ==========================================================
   ELEMENTAL SPECIES DATABASE

   This is now the Chemical-Period database.

   group + period prepare the species for a real
   periodic-table layout in the CSS/HTML step.
========================================================== */

const elementalSpecies = [


  /* ========================================================
     PERIOD 1
  ======================================================== */

  {
    id:
      "hydrogen-hippo",

    atomicNumber:
      1,

    symbol:
      "H",

    element:
      "Hydrogen",

    name:
      "Hydrogen Hippo",

    icon:
      "🦛",

    group:
      1,

    period:
      1,

    valenceElectrons:
      1,

    habitat:
      "wild",

    clue:
      "Hydrogen is the simplest element and carries one electron in a neutral atom.",

    unlockedByDefault:
      true
  },


  {
    id:
      "helium-hyena",

    atomicNumber:
      2,

    symbol:
      "He",

    element:
      "Helium",

    name:
      "Helium Hyena",

    icon:
      "😆",

    group:
      18,

    period:
      1,

    valenceElectrons:
      2,

    habitat:
      "wild",

    clue:
      "Helium's first electron shell is completely filled.",

    unlockedByDefault:
      true
  },



  /* ========================================================
     PERIOD 2
  ======================================================== */

  {
    id:
      "lithium-lightning-bug",

    atomicNumber:
      3,

    symbol:
      "Li",

    element:
      "Lithium",

    name:
      "Lithium Lightning-Bug",

    icon:
      "⚡",

    group:
      1,

    period:
      2,

    valenceElectrons:
      1,

    habitat:
      "wild",

    clue:
      "Study the Lightning-Bug. Its anatomy represents its electrons.",


    questions: [

      {
        question:
          "How many valence electrons does Lithium have?",

        answers:
          [
            "1",
            "2",
            "3",
            "4"
          ],

        correct:
          "1",

        explanation:
          "Exactly. Lithium has one valence electron — represented by its single antenna."
      },


      {
        question:
          "Lithium has 2 inner electrons and 1 outer electron. How many total electrons?",

        answers:
          [
            "2",
            "3",
            "4",
            "5"
          ],

        correct:
          "3",

        explanation:
          "2 + 1 = 3 electrons."
      },


      {
        question:
          "A neutral atom with 3 electrons must have how many protons?",

        answers:
          [
            "1",
            "2",
            "3",
            "4"
          ],

        correct:
          "3",

        explanation:
          "Three. That gives Lithium atomic number 3."
      }

    ]
  },


  {
    id:
      "boron-butterfly",

    atomicNumber:
      5,

    symbol:
      "B",

    element:
      "Boron",

    name:
      "Boron Butterfly",

    icon:
      "🦋",

    group:
      13,

    period:
      2,

    valenceElectrons:
      3,

    habitat:
      "wild",

    clue:
      "Look for three valence electrons in the Butterfly's anatomy."
  },


  {
    id:
      "carbon-clam",

    atomicNumber:
      6,

    symbol:
      "C",

    element:
      "Carbon",

    name:
      "Carbon Clam",

    icon:
      "🐚",

    group:
      14,

    period:
      2,

    valenceElectrons:
      4,

    habitat:
      "sea",

    clue:
      "Carbon carries four valence electrons."
  },


  {
    id:
      "oxygen-owl",

    atomicNumber:
      8,

    symbol:
      "O",

    element:
      "Oxygen",

    name:
      "Oxygen Owl",

    icon:
      "🦉",

    group:
      16,

    period:
      2,

    valenceElectrons:
      6,

    habitat:
      "wild",

    clue:
      "H(OO)T! Oxygen has six valence electrons."
  },


  {
    id:
      "fluorine-fire-ant",

    atomicNumber:
      9,

    symbol:
      "F",

    element:
      "Fluorine",

    name:
      "Fluorine Fire Ant",

    icon:
      "🐜",

    group:
      17,

    period:
      2,

    valenceElectrons:
      7,

    habitat:
      "wild",

    clue:
      "Fluorine sits one electron short of a complete outer shell."
  },



  /* ========================================================
     PERIOD 3
  ======================================================== */

  {
    id:
      "sodium-snail",

    atomicNumber:
      11,

    symbol:
      "Na",

    element:
      "Sodium",

    name:
      "Sodium Snail",

    icon:
      "🐌",

    group:
      1,

    period:
      3,

    valenceElectrons:
      1,

    habitat:
      "wild",

    clue:
      "Sodium carries one valence electron and readily forms Na⁺."
  },


  {
    id:
      "magnesium-moth",

    atomicNumber:
      12,

    symbol:
      "Mg",

    element:
      "Magnesium",

    name:
      "Magnesium Moth",

    icon:
      "🦋",

    group:
      2,

    period:
      3,

    valenceElectrons:
      2,

    habitat:
      "wild",

    clue:
      "Magnesium carries two valence electrons."
  },


  {
    id:
      "aluminum-army-ant",

    atomicNumber:
      13,

    symbol:
      "Al",

    element:
      "Aluminum",

    name:
      "Aluminum Army Ant",

    icon:
      "🐜",

    group:
      13,

    period:
      3,

    valenceElectrons:
      3,

    habitat:
      "wild",

    clue:
      "Aluminum carries three valence electrons and commonly forms Al³⁺."
  },


  {
    id:
      "silicon-stick-bug",

    atomicNumber:
      14,

    symbol:
      "Si",

    element:
      "Silicon",

    name:
      "Silicon Stick Bug",

    icon:
      "🪲",

    group:
      14,

    period:
      3,

    valenceElectrons:
      4,

    habitat:
      "wild",

    clue:
      "Silicon and carbon share four valence electrons."
  },


  {
    id:
      "phosphorus-pill-bug",

    atomicNumber:
      15,

    symbol:
      "P",

    element:
      "Phosphorus",

    name:
      "Phosphorus Pill Bug",

    icon:
      "🪲",

    group:
      15,

    period:
      3,

    valenceElectrons:
      5,

    habitat:
      "wild",

    clue:
      "Phosphorus carries five valence electrons."
  },


  {
    id:
      "chlorine-cicada",

    atomicNumber:
      17,

    symbol:
      "Cl",

    element:
      "Chlorine",

    name:
      "Chlorine Cicada",

    icon:
      "🦗",

    group:
      17,

    period:
      3,

    valenceElectrons:
      7,

    habitat:
      "wild",

    clue:
      "Chlorine is one electron short of a complete valence shell."
  }

];



/* ==========================================================
   MOLECULAR SPECIES DATABASE

   These will become discoverable by BUILDING them
   in the Farm / Wild / Sea screens.

   ingredients tells the future builder exactly
   what elemental pieces are required.
========================================================== */

const molecularSpecies = [


  /* ========================================================
     FARM
  ======================================================== */

  {
    id:
      "methane-chicken",

    formula:
      "CH₄",

    name:
      "Methane Chicken",

    icon:
      "🐔",

    habitat:
      "farm",

    family:
      "carbon-hydrogen",

    ingredients:
      {
        C:
          1,

        H:
          4
      },

    clue:
      "One Carbon Clam surrounded by four Hydrogen Hippos.",

    fact:
      "Methane contains one carbon atom bonded to four hydrogen atoms."
  },


  {
    id:
      "ammonium-horse",

    formula:
      "NH₄⁺",

    name:
      "Ammonium Horse",

    icon:
      "🐴",

    habitat:
      "farm",

    family:
      "nitrogen-hydrogen",

    ingredients:
      {
        N:
          1,

        H:
          4
      },

    charge:
      "+1",

    clue:
      "A nitrogen center carrying four hydrogens and a positive charge.",

    fact:
      "Ammonium is the polyatomic ion NH₄⁺."
  },


  {
    id:
      "chromate-crow",

    formula:
      "CrO₄²⁻",

    name:
      "Chromate Crow",

    icon:
      "🐦‍⬛",

    habitat:
      "farm",

    family:
      "chromate",

    ingredients:
      {
        Cr:
          1,

        O:
          4
      },

    charge:
      "-2",

    clue:
      "Chromium surrounded by four oxygen atoms.",

    fact:
      "Chromate is CrO₄²⁻."
  },


  {
    id:
      "dichromate-scarecrow",

    formula:
      "Cr₂O₇²⁻",

    name:
      "Dichromate Scarecrow",

    icon:
      "🎃",

    habitat:
      "farm",

    family:
      "chromate",

    ingredients:
      {
        Cr:
          2,

        O:
          7
      },

    charge:
      "-2",

    clue:
      "Two chromium centers share a larger oxygen framework.",

    fact:
      "Dichromate is Cr₂O₇²⁻."
  },


  {
    id:
      "hydrogen-phosphate-pig",

    formula:
      "HPO₄²⁻",

    name:
      "Hydrogen Phosphate Pig",

    icon:
      "🐷",

    habitat:
      "farm",

    family:
      "phosphate",

    ingredients:
      {
        H:
          1,

        P:
          1,

        O:
          4
      },

    charge:
      "-2",

    clue:
      "H-P-O(ink)! One hydrogen joins a phosphate framework.",

    fact:
      "Hydrogen phosphate is HPO₄²⁻."
  },


  {
    id:
      "permanganate-cow",

    formula:
      "MnO₄⁻",

    name:
      "M(n)OOOO! Cow",

    icon:
      "🐄",

    habitat:
      "farm",

    family:
      "manganese-oxygen",

    ingredients:
      {
        Mn:
          1,

        O:
          4
      },

    charge:
      "-1",

    clue:
      "M(n)OOOO! One manganese surrounded by four oxygens.",

    fact:
      "Permanganate is MnO₄⁻."
  },


  {
    id:
      "cho-rse",

    formula:
      "CHO",

    name:
      "C-HO(rse)",

    icon:
      "🐎",

    habitat:
      "farm",

    family:
      "carbon-hydrogen-oxygen",

    ingredients:
      {
        C:
          1,

        H:
          1,

        O:
          1
      },

    clue:
      "C + H + O forms the visual wordplay of the C-HO(rse).",

    fact:
      "This Molecular Farm species reinforces recognition of C, H and O together."
  },



  /* ========================================================
     UNDER THE SEA
  ======================================================== */

  {
    id:
      "water-octopus",

    formula:
      "H₂O",

    name:
      "H-O(ctopus)",

    icon:
      "🐙",

    habitat:
      "sea",

    family:
      "water",

    ingredients:
      {
        H:
          2,

        O:
          1
      },

    clue:
      "Two Hydrogen Hippos and one Oxygen Owl head under the sea.",

    fact:
      "Water is H₂O."
  },


  {
    id:
      "hydroxide-octopus",

    formula:
      "OH⁻",

    name:
      "OH-Octopus",

    icon:
      "🐙",

    habitat:
      "sea",

    family:
      "water",

    ingredients:
      {
        O:
          1,

        H:
          1
      },

    charge:
      "-1",

    clue:
      "Remove a proton from water and the octopus changes form.",

    fact:
      "Hydroxide is OH⁻."
  },


  {
    id:
      "sulfuric-shark",

    formula:
      "H₂SO₄",

    name:
      "Sulfuric Shark",

    icon:
      "🦈",

    habitat:
      "sea",

    family:
      "sulfuric-acid",

    ingredients:
      {
        H:
          2,

        S:
          1,

        O:
          4
      },

    clue:
      "Two hydrogens, one sulfur and four oxygens swim together.",

    fact:
      "Sulfuric acid is H₂SO₄."
  },


  {
    id:
      "hypochlorous-clownfish",

    formula:
      "HClO",

    name:
      "H-CLO(wn)-Fish",

    icon:
      "🐠",

    habitat:
      "sea",

    family:
      "chlorine-oxygen",

    ingredients:
      {
        H:
          1,

        Cl:
          1,

        O:
          1
      },

    clue:
      "H + Cl + O hides inside the clownfish's name.",

    fact:
      "Hypochlorous acid can be written HClO."
  },


  {
    id:
      "phosphoric-porcupine",

    formula:
      "H₃PO₄",

    name:
      "H-PO(rcupine)",

    icon:
      "🦔",

    habitat:
      "wild",

    family:
      "phosphate",

    ingredients:
      {
        H:
          3,

        P:
          1,

        O:
          4
      },

    clue:
      "Three hydrogens begin the phosphate evolution line.",

    fact:
      "Phosphoric acid is H₃PO₄."
  }

];



/* ==========================================================
   EVOLUTION LINES

   These reference molecularSpecies IDs rather than
   duplicating species data.

   Later the UI will display arrows, environments,
   pH changes and transformations.
========================================================== */

const evolutionLines = [


  {
    id:
      "phosphate-line",

    name:
      "Phosphate Evolution",

    icon:
      "🐷",

    trigger:
      "Increasing pH / successive deprotonation",

    description:
      "Hydrogen is progressively removed as the environment becomes more basic.",

    stages:
      [

        {
          formula:
            "H₃PO₄",

          speciesId:
            "phosphoric-porcupine",

          label:
            "Phosphoric Acid"
        },


        {
          formula:
            "H₂PO₄⁻",

          speciesId:
            null,

          label:
            "Dihydrogen Phosphate"
        },


        {
          formula:
            "HPO₄²⁻",

          speciesId:
            "hydrogen-phosphate-pig",

          label:
            "Hydrogen Phosphate"
        },


        {
          formula:
            "PO₄³⁻",

          speciesId:
            null,

          label:
            "Phosphate"
        }

      ]
  },


  {
    id:
      "water-line",

    name:
      "Water Evolution",

    icon:
      "🐙",

    trigger:
      "Acid-base environment",

    description:
      "The hydrogen/oxygen family changes as protons are gained or lost.",

    stages:
      [

        {
          formula:
            "H₃O⁺",

          speciesId:
            null,

          label:
            "Hydronium"
        },


        {
          formula:
            "H₂O",

          speciesId:
            "water-octopus",

          label:
            "Water"
        },


        {
          formula:
            "OH⁻",

          speciesId:
            "hydroxide-octopus",

          label:
            "Hydroxide"
        }

      ]
  },


  {
    id:
      "chromate-line",

    name:
      "Crow → Scarecrow",

    icon:
      "🐦‍⬛",

    trigger:
      "Acid-base equilibrium",

    description:
      "Chromate and dichromate shift relative to one another as chemical conditions change.",

    stages:
      [

        {
          formula:
            "CrO₄²⁻",

          speciesId:
            "chromate-crow",

          label:
            "Chromate Crow"
        },


        {
          formula:
            "Cr₂O₇²⁻",

          speciesId:
            "dichromate-scarecrow",

          label:
            "Dichromate Scarecrow"
        }

      ]
  }

];



/* ==========================================================
   QUICK LOOKUP HELPERS
========================================================== */

function getElementByAtomicNumber(
  atomicNumber
) {

  return elementalSpecies.find(
    function (
      item
    ) {

      return (
        item.atomicNumber ===
        atomicNumber
      );

    }
  );

}


function getElementBySymbol(
  symbol
) {

  return elementalSpecies.find(
    function (
      item
    ) {

      return (
        item.symbol ===
        symbol
      );

    }
  );

}


function getMoleculeById(
  id
) {

  return molecularSpecies.find(
    function (
      item
    ) {

      return (
        item.id ===
        id
      );

    }
  );

}



/* ==========================================================
   PLAYER DATA MIGRATION

   OLD VERSION:

   {
     xp: 0,
     unlocked: [1, 2]
   }

   NEW VERSION:

   {
     xp: 0,
     unlockedElements: [1, 2],
     unlockedMolecules: [],
     discoveredEvolutions: []
   }
========================================================== */

const oldPlayer =
  JSON.parse(
    localStorage.getItem(
      "patPlayer"
    )
  );


const savedV2Player =
  JSON.parse(
    localStorage.getItem(
      "molecularFarmPlayerV2"
    )
  );


let player;


if (
  savedV2Player
) {

  player =
    savedV2Player;

}

else if (
  oldPlayer
) {

  player =
    {
      xp:
        oldPlayer.xp || 0,

      unlockedElements:
        Array.isArray(
          oldPlayer.unlocked
        )
        ?
          oldPlayer.unlocked.slice()
        :
          [1, 2],

      unlockedMolecules:
        [],

      discoveredEvolutions:
        []
    };

}

else {

  player =
    {
      xp:
        0,

      unlockedElements:
        [1, 2],

      unlockedMolecules:
        [],

      discoveredEvolutions:
        []
    };

}


/*
  Safety checks in case future versions add fields.
*/

if (
  !Array.isArray(
    player.unlockedElements
  )
) {

  player.unlockedElements =
    [1, 2];

}


if (
  !Array.isArray(
    player.unlockedMolecules
  )
) {

  player.unlockedMolecules =
    [];

}


if (
  !Array.isArray(
    player.discoveredEvolutions
  )
) {

  player.discoveredEvolutions =
    [];

}



/* ==========================================================
   CURRENT GAME STATE
========================================================== */

let currentSpecies =
  null;


let currentQuestion =
  0;


const cataloguedThisSession =
  new Set();



/* ==========================================================
   NAVIGATION
========================================================== */

function showScreen(
  id
) {

  document
    .querySelectorAll(
      ".screen"
    )
    .forEach(
      function (
        screen
      ) {

        screen.classList.remove(
          "active"
        );

      }
    );


  const target =
    document.getElementById(
      id
    );


  if (
    target
  ) {

    target.classList.add(
      "active"
    );

  }


  if (
    id ===
    "periodScreen"
  ) {

    trackFarmEvent(
      "chemical_period_opened",
      {
        discovered_elements:
          player.unlockedElements.length,

        total_elements:
          elementalSpecies.length
      }
    );

  }


  window.scrollTo(
    0,
    0
  );

}



/* ==========================================================
   BUILD CHEMICAL-PERIOD

   Current HTML can already display these.

   The next CSS step will turn this into a true
   simplified periodic-table layout.
========================================================== */

function buildPeriod() {

  const period =
    document.getElementById(
      "period"
    );


  if (
    !period
  ) {

    return;

  }


  period.innerHTML =
    "";


  elementalSpecies.forEach(
    function (
      item
    ) {

      const discovered =
        player
          .unlockedElements
          .includes(
            item.atomicNumber
          );


      const box =
        document.createElement(
          "div"
        );


      box.className =
        "element "
        +
        (
          discovered
            ?
              "unlocked"
            :
              "locked"
        );


      box.dataset.atomicNumber =
        item.atomicNumber;


      box.dataset.symbol =
        item.symbol;


      box.dataset.group =
        item.group;


      box.dataset.period =
        item.period;


      /*
        These CSS variables will let the next
        stylesheet position each species correctly
        on the periodic table.
      */

      box.style.setProperty(
        "--group",
        item.group
      );


      box.style.setProperty(
        "--period",
        item.period
      );


      box.innerHTML = `

        <div class="atomic-number">
          ${item.atomicNumber}
        </div>

        <div class="symbol">
          ${item.symbol}
        </div>

        <div class="animal">

          ${
            discovered
              ?
                item.icon
              :
                "?"
          }

          <br>

          ${
            discovered
              ?
                item.name
              :
                item.element
          }

        </div>

      `;


      box.addEventListener(
        "click",
        function () {

          openSpecies(
            item
          );

        }
      );


      period.appendChild(
        box
      );

    }
  );

}



/* ==========================================================
   OPEN ELEMENTAL SPECIES
========================================================== */

function openSpecies(
  item
) {

  currentSpecies =
    item;


  currentQuestion =
    0;


  const alreadyDiscovered =
    player
      .unlockedElements
      .includes(
        item.atomicNumber
      );


  trackFarmEvent(
    "species_viewed",
    {
      species_type:
        "elemental",

      species_name:
        item.name,

      element_name:
        item.element,

      element_symbol:
        item.symbol,

      atomic_number:
        item.atomicNumber,

      habitat:
        item.habitat,

      already_discovered:
        alreadyDiscovered,

      has_questions:
        Boolean(
          item.questions
          &&
          item.questions.length
        )
    }
  );


  document
    .getElementById(
      "speciesName"
    )
    .textContent =
      alreadyDiscovered
      ?
        item.name
      :
        item.element +
        " Species";


  document
    .getElementById(
      "speciesImage"
    )
    .textContent =
      alreadyDiscovered
      ?
        item.icon
      :
        "❓";


  document
    .getElementById(
      "speciesClue"
    )
    .textContent =
      item.clue;


  showScreen(
    "speciesScreen"
  );


  /*
    Species with reconstruction questions
    can currently be discovered directly.

    Other species are already in the data model
    and will receive their Farm / Wild / Sea
    discovery methods in the next HTML step.
  */

  if (
    item.questions
    &&
    item.questions.length
  ) {

    loadQuestion();

  }

  else {

    const questionText =
      document.getElementById(
        "questionText"
      );


    const answers =
      document.getElementById(
        "answers"
      );


    const feedback =
      document.getElementById(
        "feedback"
      );


    if (
      alreadyDiscovered
    ) {

      questionText.textContent =
        item.element
        +
        " has been catalogued in your Period-ex.";


      feedback.innerHTML = `

        <strong>
          ${item.symbol}
          • Atomic Number
          ${item.atomicNumber}
        </strong>

        <br><br>

        Valence electrons:
        ${item.valenceElectrons}

      `;

    }

    else {

      questionText.textContent =
        "This species has not been discovered yet.";


      feedback.innerHTML = `

        <strong>
          Future Discovery:
        </strong>

        <br>

        Search the
        ${
          habitats[
            item.habitat
          ]
          ?
            habitats[
              item.habitat
            ].name
          :
            "Molecular Farm"
        }
        to catalogue this species.

      `;

    }


    answers.innerHTML =
      "";

  }

}



/* ==========================================================
   LOAD RECONSTRUCTION QUESTION
========================================================== */

function loadQuestion() {

  const q =
    currentSpecies
      .questions[
        currentQuestion
      ];


  document
    .getElementById(
      "questionText"
    )
    .textContent =
      q.question;


  document
    .getElementById(
      "feedback"
    )
    .textContent =
      "";


  const answers =
    document.getElementById(
      "answers"
    );


  answers.innerHTML =
    "";


  q.answers.forEach(
    function (
      answer
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "answer-button";


      button.textContent =
        answer;


      button.addEventListener(
        "click",
        function () {

          checkAnswer(
            answer
          );

        }
      );


      answers.appendChild(
        button
      );

    }
  );

}



/* ==========================================================
   CHECK ELEMENTAL RECONSTRUCTION ANSWER
========================================================== */

function checkAnswer(
  answer
) {

  const q =
    currentSpecies
      .questions[
        currentQuestion
      ];


  const feedback =
    document.getElementById(
      "feedback"
    );


  const correct =
    answer ===
    q.correct;


  trackFarmEvent(
    "species_answered",
    {
      species_type:
        "elemental",

      species_name:
        currentSpecies.name,

      element_symbol:
        currentSpecies.symbol,

      atomic_number:
        currentSpecies.atomicNumber,

      question_number:
        currentQuestion +
        1,

      answer_correct:
        correct
    }
  );


  if (
    correct
  ) {

    feedback.innerHTML =
      "✓ "
      +
      q.explanation;


    addXP(
      10
    );


    setTimeout(
      function () {

        currentQuestion++;


        if (
          currentQuestion
          <
          currentSpecies
            .questions
            .length
        ) {

          loadQuestion();

        }

        else {

          completeElementSpecies();

        }

      },

      1300
    );

  }

  else {

    feedback.innerHTML =
      "Not quite. Look at the structure again.";

  }

}



/* ==========================================================
   COMPLETE ELEMENTAL SPECIES
========================================================== */

function completeElementSpecies() {

  const atomicNumber =
    currentSpecies.atomicNumber;


  const wasAlreadyUnlocked =
    player
      .unlockedElements
      .includes(
        atomicNumber
      );


  if (
    !wasAlreadyUnlocked
  ) {

    player
      .unlockedElements
      .push(
        atomicNumber
      );


    addXP(
      25
    );

  }


  if (
    !wasAlreadyUnlocked
    &&
    !cataloguedThisSession.has(
      "element-"
      +
      atomicNumber
    )
  ) {

    cataloguedThisSession.add(
      "element-"
      +
      atomicNumber
    );


    trackFarmEvent(
      "species_catalogued",
      {
        species_type:
          "elemental",

        species_name:
          currentSpecies.name,

        element_symbol:
          currentSpecies.symbol,

        atomic_number:
          atomicNumber,

        total_elements_discovered:
          player.unlockedElements.length,

        xp:
          player.xp
      }
    );

  }


  savePlayer();


  document
    .getElementById(
      "speciesName"
    )
    .textContent =
      currentSpecies.name;


  document
    .getElementById(
      "speciesImage"
    )
    .textContent =
      currentSpecies.icon;


  document
    .getElementById(
      "questionText"
    )
    .innerHTML =
      "🌱 SPECIES CATALOGUED!";


  document
    .getElementById(
      "answers"
    )
    .innerHTML = `

      <button
        class="farm-button"
        onclick="showPeriodex()"
      >
        View in Period-ex
      </button>

    `;


  document
    .getElementById(
      "feedback"
    )
    .innerHTML = `

      <strong>

        ${currentSpecies.symbol}

        • Atomic Number

        ${currentSpecies.atomicNumber}

      </strong>

    `;


  buildPeriod();

}



/* ==========================================================
   MOLECULAR DISCOVERY ENGINE

   The actual drag/build interface is added in HTML next.

   This function is ready now so the new interface
   only has to send it a collection such as:

   {
     C: 1,
     H: 4
   }
========================================================== */

function normalizeIngredientObject(
  ingredients
) {

  const normalized =
    {};


  Object.keys(
    ingredients
  )
    .sort()
    .forEach(
      function (
        key
      ) {

        normalized[
          key
        ] =
          Number(
            ingredients[
              key
            ]
          );

      }
    );


  return JSON.stringify(
    normalized
  );

}



function findMolecularSpecies(
  ingredients,
  habitatId
) {

  const target =
    normalizeIngredientObject(
      ingredients
    );


  return molecularSpecies.find(
    function (
      molecule
    ) {

      const sameIngredients =
        normalizeIngredientObject(
          molecule.ingredients
        )
        ===
        target;


      const sameHabitat =
        !habitatId
        ||
        molecule.habitat ===
        habitatId;


      return (
        sameIngredients
        &&
        sameHabitat
      );

    }
  );

}



/* ==========================================================
   CATALOGUE MOLECULE

   This will be called by the Farm/Wild/Sea builder.
========================================================== */

function catalogueMolecule(
  molecule
) {

  if (
    !molecule
  ) {

    return false;

  }


  const alreadyDiscovered =
    player
      .unlockedMolecules
      .includes(
        molecule.id
      );


  if (
    !alreadyDiscovered
  ) {

    player
      .unlockedMolecules
      .push(
        molecule.id
      );


    addXP(
      30
    );


    trackFarmEvent(
      "species_catalogued",
      {
        species_type:
          "molecular",

        species_name:
          molecule.name,

        formula:
          molecule.formula,

        habitat:
          molecule.habitat,

        total_molecules_discovered:
          player.unlockedMolecules.length,

        xp:
          player.xp
      }
    );

  }


  savePlayer();


  return (
    !alreadyDiscovered
  );

}



/* ==========================================================
   BUILD MOLECULE

   Ready for the next interface.
========================================================== */

function attemptMoleculeBuild(
  ingredients,
  habitatId
) {

  const molecule =
    findMolecularSpecies(
      ingredients,
      habitatId
    );


  trackFarmEvent(
    "molecule_build_attempted",
    {
      habitat:
        habitatId || "unknown",

      successful:
        Boolean(
          molecule
        )
    }
  );


  if (
    !molecule
  ) {

    return {
      success:
        false,

      molecule:
        null
    };

  }


  const newDiscovery =
    catalogueMolecule(
      molecule
    );


  return {
    success:
      true,

    molecule:
      molecule,

    newDiscovery:
      newDiscovery
  };

}



/* ==========================================================
   EVOLUTION DISCOVERY
========================================================== */

function catalogueEvolution(
  evolutionId
) {

  const evolution =
    evolutionLines.find(
      function (
        item
      ) {

        return (
          item.id ===
          evolutionId
        );

      }
    );


  if (
    !evolution
  ) {

    return;

  }


  if (
    player
      .discoveredEvolutions
      .includes(
        evolutionId
      )
  ) {

    return;

  }


  player
    .discoveredEvolutions
    .push(
      evolutionId
    );


  addXP(
    40
  );


  savePlayer();


  trackFarmEvent(
    "evolution_discovered",
    {
      evolution_id:
        evolution.id,

      evolution_name:
        evolution.name,

      total_evolutions_discovered:
        player
          .discoveredEvolutions
          .length
    }
  );

}



/* ==========================================================
   XP
========================================================== */

function addXP(
  amount
) {

  player.xp +=
    amount;


  savePlayer();


  updateXP();

}



function updateXP() {

  const xpText =
    document.getElementById(
      "xpText"
    );


  const xpFill =
    document.getElementById(
      "xpFill"
    );


  if (
    xpText
  ) {

    xpText.textContent =
      player.xp
      +
      " XP";

  }


  if (
    xpFill
  ) {

    const percent =
      player.xp
      %
      100;


    xpFill.style.width =
      percent
      +
      "%";

  }

}



/* ==========================================================
   PERIOD-EX

   The existing HTML has one catalogue container,
   so V2 renders all collections inside it.

   Later the HTML will give us real tabs.
========================================================== */

function showPeriodex() {

  const catalogue =
    document.getElementById(
      "catalogue"
    );


  if (
    !catalogue
  ) {

    return;

  }


  catalogue.innerHTML =
    "";


  const discoveredElements =
    elementalSpecies.filter(
      function (
        item
      ) {

        return player
          .unlockedElements
          .includes(
            item.atomicNumber
          );

      }
    );


  const discoveredMolecules =
    molecularSpecies.filter(
      function (
        item
      ) {

        return player
          .unlockedMolecules
          .includes(
            item.id
          );

      }
    );


  const discoveredEvolutionLines =
    evolutionLines.filter(
      function (
        item
      ) {

        return player
          .discoveredEvolutions
          .includes(
            item.id
          );

      }
    );


  trackFarmEvent(
    "periodex_opened",
    {
      discovered_elements:
        discoveredElements.length,

      discovered_molecules:
        discoveredMolecules.length,

      discovered_evolutions:
        discoveredEvolutionLines.length
    }
  );



  /* ========================================================
     ELEMENTAL SECTION
  ======================================================== */

  const elementHeading =
    document.createElement(
      "div"
    );


  elementHeading.className =
    "periodex-section-heading";


  elementHeading.innerHTML = `

    <h2>
      🌱 Elemental Species
    </h2>

    <p>
      ${discoveredElements.length}
      /
      ${elementalSpecies.length}
      catalogued
    </p>

  `;


  catalogue.appendChild(
    elementHeading
  );


  discoveredElements.forEach(
    function (
      item
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "catalogue-card elemental-entry";


      card.innerHTML = `

        <strong>

          ${item.icon}

          ${item.name}

        </strong>

        <br>

        ${item.symbol}

        • ${item.element}

        • Atomic Number

        ${item.atomicNumber}

        <br>

        <small>
          Valence electrons:
          ${item.valenceElectrons}
        </small>

      `;


      catalogue.appendChild(
        card
      );

    }
  );



  /* ========================================================
     MOLECULAR SECTION
  ======================================================== */

  const moleculeHeading =
    document.createElement(
      "div"
    );


  moleculeHeading.className =
    "periodex-section-heading";


  moleculeHeading.innerHTML = `

    <h2>
      🐾 Molecular Species
    </h2>

    <p>
      ${discoveredMolecules.length}
      /
      ${molecularSpecies.length}
      discovered
    </p>

  `;


  catalogue.appendChild(
    moleculeHeading
  );


  if (
    discoveredMolecules.length ===
    0
  ) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "periodex-undiscovered";


    empty.innerHTML = `

      <strong>
        ??? Molecular Species
      </strong>

      <p>
        Build species on the Farm,
        in the Wild or Under the Sea
        to catalogue them here.
      </p>

    `;


    catalogue.appendChild(
      empty
    );

  }


  discoveredMolecules.forEach(
    function (
      item
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "catalogue-card molecular-entry";


      card.innerHTML = `

        <strong>

          ${item.icon}

          ${item.name}

        </strong>

        <br>

        ${item.formula}

        <br>

        <small>

          Habitat:

          ${
            habitats[
              item.habitat
            ]
            ?
              habitats[
                item.habitat
              ].name
            :
              item.habitat
          }

        </small>

        <br>

        <small>
          ${item.fact}
        </small>

      `;


      catalogue.appendChild(
        card
      );

    }
  );



  /* ========================================================
     EVOLUTION SECTION
  ======================================================== */

  const evolutionHeading =
    document.createElement(
      "div"
    );


  evolutionHeading.className =
    "periodex-section-heading";


  evolutionHeading.innerHTML = `

    <h2>
      🧬 Evolution Lines
    </h2>

    <p>
      ${discoveredEvolutionLines.length}
      /
      ${evolutionLines.length}
      completed
    </p>

  `;


  catalogue.appendChild(
    evolutionHeading
  );


  if (
    discoveredEvolutionLines.length ===
    0
  ) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "periodex-undiscovered";


    empty.innerHTML = `

      <strong>
        ??? Evolution Lines
      </strong>

      <p>
        Discover related molecular species
        and follow how they transform
        under changing chemical conditions.
      </p>

    `;


    catalogue.appendChild(
      empty
    );

  }


  discoveredEvolutionLines.forEach(
    function (
      evolution
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "catalogue-card evolution-entry";


      const stageText =
        evolution.stages
          .map(
            function (
              stage
            ) {

              return stage.formula;

            }
          )
          .join(
            " → "
          );


      card.innerHTML = `

        <strong>

          ${evolution.icon}

          ${evolution.name}

        </strong>

        <br><br>

        ${stageText}

        <br><br>

        <small>
          ${evolution.trigger}
        </small>

      `;


      catalogue.appendChild(
        card
      );

    }
  );


  showScreen(
    "periodex"
  );

}



/* ==========================================================
   SAVE PLAYER

   Save new format.

   Also maintain the old patPlayer key for compatibility
   while the rest of the site transitions.
========================================================== */

function savePlayer() {

  localStorage.setItem(

    "molecularFarmPlayerV2",

    JSON.stringify(
      player
    )

  );


  localStorage.setItem(

    "patPlayer",

    JSON.stringify(
      {
        xp:
          player.xp,

        unlocked:
          player.unlockedElements
      }
    )

  );

}



/* ==========================================================
   DEBUG / DEVELOPMENT HELPERS

   These are intentionally available globally while
   we're building the prototype.

   Example in browser console:

   discoverMoleculeForTesting("methane-chicken")
========================================================== */

window.discoverMoleculeForTesting =
  function (
    id
  ) {

    const molecule =
      getMoleculeById(
        id
      );


    if (
      molecule
    ) {

      catalogueMolecule(
        molecule
      );


      console.log(
        "Discovered:",
        molecule.name
      );

    }

  };


window.discoverEvolutionForTesting =
  function (
    id
  ) {

    catalogueEvolution(
      id
    );


    console.log(
      "Evolution discovered:",
      id
    );

  };



/* ==========================================================
   START MOLECULAR FARM
========================================================== */

savePlayer();


buildPeriod();


updateXP();


trackFarmEvent(
  "world_entered",
  {
    version:
      "2",

    discovered_elements:
      player.unlockedElements.length,

    discovered_molecules:
      player.unlockedMolecules.length,

    discovered_evolutions:
      player
        .discoveredEvolutions
        .length,

    xp:
      player.xp
  }
);
