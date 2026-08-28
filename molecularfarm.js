/* ==========================================================
   MOLECULAR FARM
   PAT LEARNING LAB

   VERSION 4

   ACCOUNT-INTEGRATED EDITION

   BUILD → DISCOVER → CAPTURE → CATALOGUE

   SUPPORTS:
   - Elemental Species
   - Molecular Species
   - Atom Construction
   - Molecule Construction
   - Habitats
   - Evolution Lines
   - Period-ex
   - Analytics
   - Shared PAT Learning Lab Profile
   - Account XP
   - Daily Lab Activity
   - Molecular Farm Mastery
   - Cloud-backed Farm Progress
   - Legacy Farm Save Migration

   IMPORTANT:

   Molecular Farm progress now lives in:

   PATProfile.progress.molecular_farm

   When signed in, profile.js synchronizes that
   progress to the player's Supabase account.
========================================================== */



/* ==========================================================
   GAME ID
========================================================== */

const MOLECULAR_FARM_GAME_ID =
  "molecular_farm";



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
========================================================== */

const habitats = {


  period: {

    id:
      "period",

    name:
      "Chemical-Period",

    icon:
      "🌱"

  },


  farm: {

    id:
      "farm",

    name:
      "On the Farm",

    icon:
      "🌾"

  },


  wild: {

    id:
      "wild",

    name:
      "In the Wild",

    icon:
      "🌲"

  },


  sea: {

    id:
      "sea",

    name:
      "Under the Sea",

    icon:
      "🌊"

  }

};



/* ==========================================================
   ELEMENTAL SPECIES
========================================================== */

const elementalSpecies = [


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

    commonNeutrons:
      0,

    habitat:
      "wild",

    clue:
      "Hydrogen is the simplest element and carries one electron.",

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

    commonNeutrons:
      2,

    habitat:
      "wild",

    clue:
      "Helium's first electron shell is completely filled.",

    unlockedByDefault:
      true
  },


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

    commonNeutrons:
      4,

    habitat:
      "wild",

    clue:
      "Its electron structure gives Lithium one outer electron.",

    questions: [

      {
        question:
          "How many valence electrons does Lithium have?",

        answers: [
          "1",
          "2",
          "3",
          "4"
        ],

        correct:
          "1",

        explanation:
          "Exactly. Lithium has one valence electron."
      },


      {
        question:
          "Lithium has 2 inner electrons and 1 outer electron. How many total electrons?",

        answers: [
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

        answers: [
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

    commonNeutrons:
      6,

    habitat:
      "wild",

    clue:
      "Boron has three valence electrons."
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

    commonNeutrons:
      6,

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

    commonNeutrons:
      8,

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

    commonNeutrons:
      10,

    habitat:
      "wild",

    clue:
      "Fluorine is one electron short of a complete outer shell."
  },


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

    commonNeutrons:
      12,

    habitat:
      "wild",

    clue:
      "Sodium carries one valence electron."
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

    commonNeutrons:
      12,

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

    commonNeutrons:
      14,

    habitat:
      "wild",

    clue:
      "Aluminum carries three valence electrons."
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

    commonNeutrons:
      14,

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

    commonNeutrons:
      16,

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

    commonNeutrons:
      18,

    habitat:
      "wild",

    clue:
      "Chlorine is one electron short of a complete outer shell."
  }

];



/* ==========================================================
   BUILDING ELEMENTS
========================================================== */

const buildingElements = {

  H:
    "Hydrogen",

  C:
    "Carbon",

  N:
    "Nitrogen",

  O:
    "Oxygen",

  F:
    "Fluorine",

  Na:
    "Sodium",

  Mg:
    "Magnesium",

  Al:
    "Aluminum",

  Si:
    "Silicon",

  P:
    "Phosphorus",

  S:
    "Sulfur",

  Cl:
    "Chlorine",

  Cr:
    "Chromium",

  Mn:
    "Manganese"

};



/* ==========================================================
   MOLECULAR SPECIES
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

    ingredients: {

      C:
        1,

      H:
        4

    },

    clue:
      "One Carbon Clam surrounded by four Hydrogen Hippos.",

    fact:
      "Methane is CH₄."
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

    ingredients: {

      N:
        1,

      H:
        4

    },

    charge:
      "+1",

    clue:
      "One nitrogen with four hydrogens.",

    fact:
      "Ammonium is NH₄⁺."
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

    ingredients: {

      Cr:
        1,

      O:
        4

    },

    charge:
      "-2",

    clue:
      "One chromium and four oxygens.",

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
      "🌾",

    habitat:
      "farm",

    ingredients: {

      Cr:
        2,

      O:
        7

    },

    charge:
      "-2",

    clue:
      "Two chromium atoms and seven oxygens.",

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

    ingredients: {

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
      "H-P-O(ink)!",

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

    ingredients: {

      Mn:
        1,

      O:
        4

    },

    charge:
      "-1",

    clue:
      "M(n)OOOO!",

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

    ingredients: {

      C:
        1,

      H:
        1,

      O:
        1

    },

    clue:
      "C + H + O.",

    fact:
      "The species connects C, H and O through its name."
  },



  /* ========================================================
     WILD
  ======================================================== */

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

    ingredients: {

      H:
        3,

      P:
        1,

      O:
        4

    },

    clue:
      "Build phosphoric acid.",

    fact:
      "Phosphoric acid is H₃PO₄."
  },



  /* ========================================================
     SEA
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

    ingredients: {

      H:
        2,

      O:
        1

    },

    clue:
      "Two hydrogens and one oxygen.",

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

    ingredients: {

      O:
        1,

      H:
        1

    },

    charge:
      "-1",

    clue:
      "One oxygen and one hydrogen.",

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

    ingredients: {

      H:
        2,

      S:
        1,

      O:
        4

    },

    clue:
      "Two hydrogens, one sulfur and four oxygens.",

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

    ingredients: {

      H:
        1,

      Cl:
        1,

      O:
        1

    },

    clue:
      "H + Cl + O.",

    fact:
      "Hypochlorous acid is HClO."
  }

];



/* ==========================================================
   EVOLUTION LINES
========================================================== */

const evolutionLines = [


  {
    id:
      "phosphate-line",

    name:
      "Porcupine Phosphate Evolution",

    icon:
      "🦔",

    speciesName:
      "H-PO(rcupine)",

    trigger:
      "Increasing pH / successive deprotonation",

    description:
      "The same Porcupine changes protonation state as the environment becomes more basic.",

    stages: [

      {
        formula:
          "H₃PO₄",

        label:
          "Phosphoric Acid",

        icon:
          "🦔"
      },


      {
        formula:
          "H₂PO₄⁻",

        label:
          "Dihydrogen Phosphate",

        icon:
          "🦔"
      },


      {
        formula:
          "HPO₄²⁻",

        label:
          "Hydrogen Phosphate",

        icon:
          "🦔"
      },


      {
        formula:
          "PO₄³⁻",

        label:
          "Phosphate",

        icon:
          "🦔"
      }

    ]
  },


  {
    id:
      "water-line",

    name:
      "Octopus Water Evolution",

    icon:
      "🐙",

    trigger:
      "Acid-base environment",

    description:
      "The hydrogen-oxygen species changes as protons are gained or lost.",

    stages: [

      {
        formula:
          "H₃O⁺",

        label:
          "Hydronium",

        icon:
          "🐙"
      },


      {
        formula:
          "H₂O",

        label:
          "Water",

        icon:
          "🐙"
      },


      {
        formula:
          "OH⁻",

        label:
          "Hydroxide",

        icon:
          "🐙"
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
      "Chromate and dichromate shift relative to one another as conditions change.",

    stages: [

      {
        formula:
          "CrO₄²⁻",

        label:
          "Chromate Crow",

        icon:
          "🐦‍⬛"
      },


      {
        formula:
          "Cr₂O₇²⁻",

        label:
          "Dichromate Scarecrow",

        icon:
          "🌾"
      }

    ]
  }

];



/* ==========================================================
   LOOKUPS
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
   PROFILE AVAILABLE
========================================================== */

function farmProfileAvailable() {

  return Boolean(

    window.PATProfile

    &&
    typeof PATProfile.getProgress ===
    "function"

    &&
    typeof PATProfile.mergeProgress ===
    "function"

  );

}



/* ==========================================================
   DEFAULT FARM PLAYER

   XP IS NO LONGER STORED HERE.

   XP belongs to PATProfile globally.
========================================================== */

function createDefaultFarmPlayer() {

  return {

    unlockedElements: [
      1,
      2
    ],

    unlockedMolecules:
      [],

    discoveredEvolutions:
      []

  };

}



/* ==========================================================
   LEGACY FARM SAVE
========================================================== */

function getLegacyFarmPlayer() {

  let savedPlayer =
    null;


  let oldPlayer =
    null;


  try {

    savedPlayer =
      JSON.parse(
        localStorage.getItem(
          "molecularFarmPlayerV2"
        )
        ||
        "null"
      );

  }

  catch (
    error
  ) {

    savedPlayer =
      null;

  }


  try {

    oldPlayer =
      JSON.parse(
        localStorage.getItem(
          "patPlayer"
        )
        ||
        "null"
      );

  }

  catch (
    error
  ) {

    oldPlayer =
      null;

  }


  const migrated =
    createDefaultFarmPlayer();



  if (
    savedPlayer
    &&
    Array.isArray(
      savedPlayer.unlockedElements
    )
  ) {

    migrated.unlockedElements =
      savedPlayer.unlockedElements.slice();

  }


  else if (
    oldPlayer
    &&
    Array.isArray(
      oldPlayer.unlocked
    )
  ) {

    migrated.unlockedElements =
      oldPlayer.unlocked.slice();

  }



  if (
    savedPlayer
    &&
    Array.isArray(
      savedPlayer.unlockedMolecules
    )
  ) {

    migrated.unlockedMolecules =
      savedPlayer.unlockedMolecules.slice();

  }



  if (
    savedPlayer
    &&
    Array.isArray(
      savedPlayer.discoveredEvolutions
    )
  ) {

    migrated.discoveredEvolutions =
      savedPlayer.discoveredEvolutions.slice();

  }


  return migrated;

}



/* ==========================================================
   NORMALIZE FARM PLAYER
========================================================== */

function normalizeFarmPlayer(
  source
) {

  const player =
    createDefaultFarmPlayer();


  if (
    source
    &&
    typeof source ===
    "object"
  ) {


    if (
      Array.isArray(
        source.unlockedElements
      )
    ) {

      player.unlockedElements =
        source.unlockedElements
          .map(
            Number
          )
          .filter(
            function (
              number
            ) {

              return Number.isFinite(
                number
              );

            }
          );

    }


    if (
      Array.isArray(
        source.unlockedMolecules
      )
    ) {

      player.unlockedMolecules =
        source.unlockedMolecules
          .map(
            String
          );

    }


    if (
      Array.isArray(
        source.discoveredEvolutions
      )
    ) {

      player.discoveredEvolutions =
        source.discoveredEvolutions
          .map(
            String
          );

    }

  }



  /* ALWAYS DISCOVERED BY DEFAULT */

  [
    1,
    2
  ]
  .forEach(
    function (
      atomicNumber
    ) {

      if (
        !player.unlockedElements
          .includes(
            atomicNumber
          )
      ) {

        player.unlockedElements
          .push(
            atomicNumber
          );

      }

    }
  );



  player.unlockedElements =
    [
      ...new Set(
        player.unlockedElements
      )
    ];


  player.unlockedMolecules =
    [
      ...new Set(
        player.unlockedMolecules
      )
    ];


  player.discoveredEvolutions =
    [
      ...new Set(
        player.discoveredEvolutions
      )
    ];


  return player;

}



/* ==========================================================
   DOES PROFILE ALREADY CONTAIN FARM PROGRESS?
========================================================== */

function farmProfileHasProgress(
  progress
) {

  if (
    !progress
    ||
    typeof progress !==
    "object"
  ) {

    return false;

  }


  return Boolean(

    (
      Array.isArray(
        progress.unlockedElements
      )
      &&
      progress.unlockedElements.length >
      0
    )

    ||

    (
      Array.isArray(
        progress.unlockedMolecules
      )
      &&
      progress.unlockedMolecules.length >
      0
    )

    ||

    (
      Array.isArray(
        progress.discoveredEvolutions
      )
      &&
      progress.discoveredEvolutions.length >
      0
    )

  );

}



/* ==========================================================
   BUILD DISCOVERED SPECIES LIST

   Used by the shared profile display.
========================================================== */

function getFarmDiscoveredSpeciesIds(
  farmPlayer
) {

  const ids =
    [];


  farmPlayer.unlockedElements
    .forEach(
      function (
        atomicNumber
      ) {

        const element =
          getElementByAtomicNumber(
            atomicNumber
          );


        if (
          element
        ) {

          ids.push(
            element.id
          );

        }

      }
    );


  farmPlayer.unlockedMolecules
    .forEach(
      function (
        moleculeId
      ) {

        ids.push(
          moleculeId
        );

      }
    );


  return [
    ...new Set(
      ids
    )
  ];

}



/* ==========================================================
   LOAD FARM PLAYER

   PROFILE SAVE WINS.

   If no profile Farm progress exists yet,
   migrate the old device Farm save once.
========================================================== */

function loadFarmPlayer() {

  if (
    farmProfileAvailable()
  ) {

    const profileProgress =
      PATProfile.getProgress(
        MOLECULAR_FARM_GAME_ID
      )
      ||
      {};


    if (
      farmProfileHasProgress(
        profileProgress
      )
    ) {

      return normalizeFarmPlayer(
        profileProgress
      );

    }


    const legacy =
      normalizeFarmPlayer(
        getLegacyFarmPlayer()
      );


    PATProfile.mergeProgress(

      MOLECULAR_FARM_GAME_ID,

      {

        unlockedElements:
          legacy.unlockedElements,

        unlockedMolecules:
          legacy.unlockedMolecules,

        discoveredEvolutions:
          legacy.discoveredEvolutions,

        discoveredSpecies:
          getFarmDiscoveredSpeciesIds(
            legacy
          ),

        migratedFromLegacy:
          true

      }

    );


    return legacy;

  }


  return normalizeFarmPlayer(
    getLegacyFarmPlayer()
  );

}



/* ==========================================================
   PLAYER
========================================================== */

let player =
  loadFarmPlayer();



/* ==========================================================
   GENERAL STATE
========================================================== */

let currentSpecies =
  null;


let currentQuestion =
  0;


let pendingCapture =
  null;


let applyingProfileRefresh =
  false;



/* ==========================================================
   SAVE FARM PROGRESS

   PATProfile is now the permanent save.

   profile.js handles:
   localStorage immediately
   +
   Supabase cloud synchronization when signed in.
========================================================== */

function savePlayer() {

  player =
    normalizeFarmPlayer(
      player
    );


  if (
    farmProfileAvailable()
  ) {

    PATProfile.mergeProgress(

      MOLECULAR_FARM_GAME_ID,

      {

        unlockedElements:
          player.unlockedElements.slice(),

        unlockedMolecules:
          player.unlockedMolecules.slice(),

        discoveredEvolutions:
          player.discoveredEvolutions.slice(),

        discoveredSpecies:
          getFarmDiscoveredSpeciesIds(
            player
          ),

        elementalSpeciesDiscovered:
          player.unlockedElements.length,

        molecularSpeciesDiscovered:
          player.unlockedMolecules.length,

        evolutionLinesDiscovered:
          player.discoveredEvolutions.length

      }

    );


    return;

  }



  /*
    FALLBACK ONLY.

    Allows gameplay if profile.js fails to load.
  */

  localStorage.setItem(

    "molecularFarmPlayerV2",

    JSON.stringify(
      player
    )

  );

}



/* ==========================================================
   ACCOUNT XP

   XP is awarded through UNIQUE PATProfile completions.

   Therefore:
   - reloading the page cannot farm XP
   - repeating the same capture cannot farm XP
   - the XP belongs to the account
   - the XP can synchronize across devices
========================================================== */

function awardFarmXP(
  activityId,
  amount,
  mastery
) {

  if (
    !window.PATProfile
    ||
    typeof PATProfile.complete !==
    "function"
  ) {

    return null;

  }


  const result =
    PATProfile.complete(

      MOLECULAR_FARM_GAME_ID,

      activityId,

      {

        xp:
          amount,

        mastery:
          mastery
          ||
          {}

      }

    );


  updateXP();


  return result;

}



/* ==========================================================
   XP DISPLAY
========================================================== */

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
    window.PATProfile
    &&
    typeof PATProfile.stats ===
    "function"
  ) {

    const stats =
      PATProfile.stats();


    if (
      xpText
    ) {

      xpText.textContent =
        (
          stats.xp
          ||
          0
        )
        +
        " XP • Level "
        +
        (
          stats.level
          ||
          1
        );

    }


    if (
      xpFill
    ) {

      xpFill.style.width =
        Math.min(
          100,
          Math.max(
            0,
            stats.levelPercent
            ||
            0
          )
        )
        +
        "%";

    }


    return;

  }



  if (
    xpText
  ) {

    xpText.textContent =
      "0 XP";

  }


  if (
    xpFill
  ) {

    xpFill.style.width =
      "0%";

  }

}



/* ==========================================================
   MARK FARM ACTIVE

   Powers the shared Daily Lab streak.

   Merely entering does NOT award XP.
========================================================== */

function markFarmPlayed() {

  if (
    window.PATProfile
    &&
    typeof PATProfile.markPlayed ===
    "function"
  ) {

    PATProfile.markPlayed(
      MOLECULAR_FARM_GAME_ID
    );

  }

}



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


  markFarmPlayed();



  if (
    id ===
    "periodScreen"
  ) {

    trackFarmEvent(
      "chemical_period_opened",
      {

        discovered_elements:
          player.unlockedElements.length

      }
    );

  }


  window.scrollTo(
    0,
    0
  );

}



/* ==========================================================
   CHEMICAL PERIOD
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
   SPECIES DETAIL
========================================================== */

function openSpecies(
  item
) {

  currentSpecies =
    item;


  currentQuestion =
    0;


  const discovered =
    player
      .unlockedElements
      .includes(
        item.atomicNumber
      );


  document
    .getElementById(
      "speciesName"
    )
    .textContent =
      discovered
      ?
        item.name
      :
        item.element
        +
        " Species";


  document
    .getElementById(
      "speciesImage"
    )
    .textContent =
      discovered
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


  trackFarmEvent(
    "species_viewed",
    {

      species_type:
        "elemental",

      species_name:
        item.name,

      discovered:
        discovered

    }
  );


  if (
    item.questions
    &&
    item.questions.length
    &&
    discovered
  ) {

    loadQuestion();


    return;

  }


  const question =
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


  answers.innerHTML =
    "";


  if (
    discovered
  ) {

    question.textContent =
      "Species catalogued.";


    feedback.innerHTML = `

      <strong>
        ${item.element}
      </strong>

      <br>

      Atomic Number:
      ${item.atomicNumber}

      <br>

      Valence Electrons:
      ${item.valenceElectrons}

    `;

  }

  else {

    question.textContent =
      "You haven't captured this species yet.";


    feedback.innerHTML = `

      Build the atom in one of the
      discovery habitats to find and capture it.

    `;

  }

}



/* ==========================================================
   RECONSTRUCTION QUIZ
========================================================== */

function loadQuestion() {

  const q =
    currentSpecies.questions[
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


      button.type =
        "button";


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
   CHECK QUIZ ANSWER
========================================================== */

function checkAnswer(
  answer
) {

  const q =
    currentSpecies.questions[
      currentQuestion
    ];


  const feedback =
    document.getElementById(
      "feedback"
    );


  if (
    answer ===
    q.correct
  ) {

    feedback.textContent =
      "✓ "
      +
      q.explanation;



    /*
      UNIQUE QUESTION XP.

      A player can replay the quiz,
      but each question awards XP once.
    */

    awardFarmXP(

      "reconstruction-"
      +
      currentSpecies.id
      +
      "-q"
      +
      (
        currentQuestion +
        1
      ),

      5,

      {

        reconstructionsSolved:
          1

      }

    );


    setTimeout(
      function () {

        currentQuestion++;


        if (
          currentQuestion <
          currentSpecies.questions.length
        ) {

          loadQuestion();

        }

        else {

          document
            .getElementById(
              "questionText"
            )
            .textContent =
              "Reconstruction complete!";


          document
            .getElementById(
              "answers"
            )
            .innerHTML =
              "";


          trackFarmEvent(
            "reconstruction_completed",
            {

              species_name:
                currentSpecies.name

            }
          );

        }

      },

      900
    );

  }

  else {

    feedback.textContent =
      "Not quite. Look at the structure again.";

  }

}



/* ==========================================================
   HABITAT BUILDER STATE
========================================================== */

const habitatBuilderState = {


  farm: {

    mode:
      "molecule",

    atoms:
      {},

    proton:
      0,

    neutron:
      0,

    electron:
      0

  },


  wild: {

    mode:
      "molecule",

    atoms:
      {},

    proton:
      0,

    neutron:
      0,

    electron:
      0

  },


  sea: {

    mode:
      "molecule",

    atoms:
      {},

    proton:
      0,

    neutron:
      0,

    electron:
      0

  }

};



/* ==========================================================
   GET HABITAT ELEMENTS
========================================================== */

function getHabitatElements(
  habitat
) {

  const symbols =
    new Set();


  molecularSpecies
    .filter(
      function (
        molecule
      ) {

        return (
          molecule.habitat ===
          habitat
        );

      }
    )
    .forEach(
      function (
        molecule
      ) {

        Object
          .keys(
            molecule.ingredients
          )
          .forEach(
            function (
              symbol
            ) {

              symbols.add(
                symbol
              );

            }
          );

      }
    );


  [
    "H",
    "C",
    "N",
    "O",
    "P",
    "S",
    "Cl"
  ]
  .forEach(
    function (
      symbol
    ) {

      symbols.add(
        symbol
      );

    }
  );


  return Array.from(
    symbols
  );

}



/* ==========================================================
   INJECT BUILDER MODE CONTROLS
========================================================== */

function injectBuilderControls(
  habitat
) {

  const bank =
    document.getElementById(
      habitat
      +
      "ElementBank"
    );


  if (
    !bank
  ) {

    return;

  }


  const parent =
    bank.parentElement;


  if (
    parent.querySelector(
      ".discovery-mode-switch"
    )
  ) {

    return;

  }


  const switcher =
    document.createElement(
      "div"
    );


  switcher.className =
    "discovery-mode-switch";


  switcher.innerHTML = `

    <button
      type="button"
      class="discovery-mode-button"
      data-mode="atom"
    >
      ⚛️ Build an Atom
    </button>

    <button
      type="button"
      class="discovery-mode-button active"
      data-mode="molecule"
    >
      🧪 Build a Molecule
    </button>

  `;


  parent.insertBefore(
    switcher,
    bank
  );


  switcher
    .querySelectorAll(
      ".discovery-mode-button"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            habitatBuilderState[
              habitat
            ].mode =
              button.dataset.mode;


            switcher
              .querySelectorAll(
                ".discovery-mode-button"
              )
              .forEach(
                function (
                  item
                ) {

                  item.classList.remove(
                    "active"
                  );

                }
              );


            button.classList.add(
              "active"
            );


            clearHabitatBuild(
              habitat
            );


            renderHabitatBuilder(
              habitat
            );

          }
        );

      }
    );

}



/* ==========================================================
   RENDER HABITAT BUILDER
========================================================== */

function renderHabitatBuilder(
  habitat
) {

  const state =
    habitatBuilderState[
      habitat
    ];


  const bank =
    document.getElementById(
      habitat
      +
      "ElementBank"
    );


  const tray =
    document.getElementById(
      habitat
      +
      "BuildTray"
    );


  const formula =
    document.getElementById(
      habitat
      +
      "Formula"
    );


  const buildButton =
    document.getElementById(
      habitat
      +
      "BuildButton"
    );


  if (
    !bank
    ||
    !tray
    ||
    !formula
    ||
    !buildButton
  ) {

    return;

  }


  bank.innerHTML =
    "";


  tray.innerHTML =
    "";


  pendingCapture =
    null;


  hideDiscoveryCard(
    habitat
  );


  if (
    state.mode ===
    "atom"
  ) {

    buildButton.textContent =
      "🔎 Identify Atom";


    renderAtomBuilder(
      habitat
    );


    return;

  }


  buildButton.textContent =
    "🔎 Identify Molecule";


  getHabitatElements(
    habitat
  )
  .forEach(
    function (
      symbol
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "builder-element";


      button.innerHTML = `

        <strong>
          ${symbol}
        </strong>

        <small>
          ${
            buildingElements[
              symbol
            ]
            ||
            symbol
          }
        </small>

      `;


      button.addEventListener(
        "click",
        function () {

          addMoleculeAtom(
            habitat,
            symbol
          );

        }
      );


      bank.appendChild(
        button
      );

    }
  );


  renderMoleculeTray(
    habitat
  );

}



/* ==========================================================
   ATOM BUILDER
========================================================== */

function renderAtomBuilder(
  habitat
) {

  const state =
    habitatBuilderState[
      habitat
    ];


  const bank =
    document.getElementById(
      habitat
      +
      "ElementBank"
    );


  const tray =
    document.getElementById(
      habitat
      +
      "BuildTray"
    );


  const formula =
    document.getElementById(
      habitat
      +
      "Formula"
    );


  bank.innerHTML = `

    <div class="atom-builder-info">

      <strong>
        Build the atom from particles.
      </strong>

      <br>

      Neutral atoms need equal numbers
      of protons and electrons.

    </div>

  `;


  tray.innerHTML = `

    <div class="particle-builder">


      <div class="particle-build-card">

        <span class="particle-symbol">
          p⁺
        </span>

        <strong>
          Protons
        </strong>

        <div class="particle-controls">

          <button
            type="button"
            data-particle="proton"
            data-change="-1"
          >
            −
          </button>

          <span id="${habitat}ProtonCount">
            ${state.proton}
          </span>

          <button
            type="button"
            data-particle="proton"
            data-change="1"
          >
            +
          </button>

        </div>

      </div>



      <div class="particle-build-card">

        <span class="particle-symbol">
          n⁰
        </span>

        <strong>
          Neutrons
        </strong>

        <div class="particle-controls">

          <button
            type="button"
            data-particle="neutron"
            data-change="-1"
          >
            −
          </button>

          <span id="${habitat}NeutronCount">
            ${state.neutron}
          </span>

          <button
            type="button"
            data-particle="neutron"
            data-change="1"
          >
            +
          </button>

        </div>

      </div>



      <div class="particle-build-card">

        <span class="particle-symbol">
          e⁻
        </span>

        <strong>
          Electrons
        </strong>

        <div class="particle-controls">

          <button
            type="button"
            data-particle="electron"
            data-change="-1"
          >
            −
          </button>

          <span id="${habitat}ElectronCount">
            ${state.electron}
          </span>

          <button
            type="button"
            data-particle="electron"
            data-change="1"
          >
            +
          </button>

        </div>

      </div>


    </div>

  `;


  tray
    .querySelectorAll(
      "[data-particle]"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            const particle =
              button.dataset.particle;


            const change =
              Number(
                button.dataset.change
              );


            state[
              particle
            ] =
              Math.max(
                0,
                state[
                  particle
                ]
                +
                change
              );


            renderAtomBuilder(
              habitat
            );

          }
        );

      }
    );


  if (
    state.proton ===
    0
  ) {

    formula.textContent =
      "Build a nucleus";

  }

  else {

    formula.textContent =
      state.proton
      +
      "p⁺  •  "
      +
      state.neutron
      +
      "n⁰  •  "
      +
      state.electron
      +
      "e⁻";

  }

}



/* ==========================================================
   IDENTIFY BUILT ATOM
========================================================== */

function attemptAtomBuild(
  habitat
) {

  const state =
    habitatBuilderState[
      habitat
    ];


  const feedback =
    document.getElementById(
      habitat
      +
      "BuildFeedback"
    );


  if (
    state.proton ===
    0
  ) {

    feedback.textContent =
      "Add protons to the nucleus first.";


    return;

  }


  if (
    state.proton !==
    state.electron
  ) {

    feedback.textContent =
      "That structure is charged. For now, capture a neutral atom by matching protons and electrons.";


    return;

  }


  const element =
    elementalSpecies.find(
      function (
        item
      ) {

        return (

          item.atomicNumber ===
          state.proton

          &&

          item.commonNeutrons ===
          state.neutron

        );

      }
    );


  trackFarmEvent(
    "atom_build_attempted",
    {

      habitat:
        habitat,

      protons:
        state.proton,

      neutrons:
        state.neutron,

      electrons:
        state.electron,

      successful:
        Boolean(
          element
        )

    }
  );


  if (
    !element
  ) {

    const atomicMatch =
      elementalSpecies.find(
        function (
          item
        ) {

          return (
            item.atomicNumber ===
            state.proton
          );

        }
      );


    if (
      atomicMatch
    ) {

      feedback.textContent =
        "You found "
        +
        atomicMatch.element
        +
        ", but this prototype is looking for its common isotope. Check the neutron count.";


      return;

    }


    feedback.textContent =
      "That atom is chemically possible, but it does not have a Molecular Farm species in the current Chemical-Period yet.";


    return;

  }


  pendingCapture = {

    type:
      "element",

    habitat:
      habitat,

    data:
      element

  };


  feedback.textContent =
    "🌱 Species located! Capture it to add it to your Period-ex.";


  showElementDiscovery(
    habitat,
    element
  );

}



/* ==========================================================
   ADD MOLECULE ATOM
========================================================== */

function addMoleculeAtom(
  habitat,
  symbol
) {

  const state =
    habitatBuilderState[
      habitat
    ];


  state.atoms[
    symbol
  ] =
    (
      state.atoms[
        symbol
      ]
      ||
      0
    )
    +
    1;


  renderMoleculeTray(
    habitat
  );

}



/* ==========================================================
   REMOVE MOLECULE ATOM
========================================================== */

function removeMoleculeAtom(
  habitat,
  symbol
) {

  const state =
    habitatBuilderState[
      habitat
    ];


  if (
    !state.atoms[
      symbol
    ]
  ) {

    return;

  }


  state.atoms[
    symbol
  ]--;


  if (
    state.atoms[
      symbol
    ] <=
    0
  ) {

    delete state.atoms[
      symbol
    ];

  }


  renderMoleculeTray(
    habitat
  );

}



/* ==========================================================
   BUILD FORMULA PREVIEW
========================================================== */

const subscriptCharacters = {

  2:
    "₂",

  3:
    "₃",

  4:
    "₄",

  5:
    "₅",

  6:
    "₆",

  7:
    "₇",

  8:
    "₈",

  9:
    "₉"

};



function getIngredientFormula(
  ingredients
) {

  return Object
    .keys(
      ingredients
    )
    .map(
      function (
        symbol
      ) {

        const count =
          ingredients[
            symbol
          ];


        return (

          symbol

          +

          (
            count >
            1
            ?
              (
                subscriptCharacters[
                  count
                ]
                ||
                count
              )
            :
              ""
          )

        );

      }
    )
    .join(
      ""
    );

}



/* ==========================================================
   RENDER MOLECULE TRAY
========================================================== */

function renderMoleculeTray(
  habitat
) {

  const state =
    habitatBuilderState[
      habitat
    ];


  const tray =
    document.getElementById(
      habitat
      +
      "BuildTray"
    );


  const formula =
    document.getElementById(
      habitat
      +
      "Formula"
    );


  if (
    !tray
    ||
    !formula
  ) {

    return;

  }


  tray.innerHTML =
    "";


  const symbols =
    Object.keys(
      state.atoms
    );


  if (
    symbols.length ===
    0
  ) {

    tray.innerHTML = `

      <div class="empty-build-message">
        Add elements to begin building.
      </div>

    `;


    formula.textContent =
      "?";


    return;

  }


  symbols.forEach(
    function (
      symbol
    ) {

      for (
        let index =
          0;
        index <
          state.atoms[
            symbol
          ];
        index++
      ) {

        const atom =
          document.createElement(
            "button"
          );


        atom.type =
          "button";


        atom.className =
          "build-atom";


        atom.innerHTML = `

          <strong>
            ${symbol}
          </strong>

          <small>
            tap to remove
          </small>

        `;


        atom.addEventListener(
          "click",
          function () {

            removeMoleculeAtom(
              habitat,
              symbol
            );

          }
        );


        tray.appendChild(
          atom
        );

      }

    }
  );


  formula.textContent =
    getIngredientFormula(
      state.atoms
    );

}



/* ==========================================================
   NORMALIZE MOLECULE INGREDIENTS
========================================================== */

function normalizeIngredientObject(
  ingredients
) {

  const normalized =
    {};


  Object
    .keys(
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



/* ==========================================================
   FIND MOLECULE
========================================================== */

function findMolecularSpecies(
  ingredients,
  habitat
) {

  const target =
    normalizeIngredientObject(
      ingredients
    );


  return molecularSpecies.find(
    function (
      molecule
    ) {

      return (

        molecule.habitat ===
        habitat

        &&

        normalizeIngredientObject(
          molecule.ingredients
        ) ===
        target

      );

    }
  );

}



/* ==========================================================
   IDENTIFY MOLECULE
========================================================== */

function attemptMoleculeBuild(
  habitat
) {

  const state =
    habitatBuilderState[
      habitat
    ];


  const feedback =
    document.getElementById(
      habitat
      +
      "BuildFeedback"
    );


  if (
    Object.keys(
      state.atoms
    ).length ===
    0
  ) {

    feedback.textContent =
      "Build a molecular structure first.";


    return;

  }


  const molecule =
    findMolecularSpecies(
      state.atoms,
      habitat
    );


  trackFarmEvent(
    "molecule_build_attempted",
    {

      habitat:
        habitat,

      successful:
        Boolean(
          molecule
        )

    }
  );


  if (
    !molecule
  ) {

    feedback.textContent =
      "Nothing has appeared yet. Change the number or combination of atoms and keep searching.";


    hideDiscoveryCard(
      habitat
    );


    pendingCapture =
      null;


    return;

  }


  pendingCapture = {

    type:
      "molecule",

    habitat:
      habitat,

    data:
      molecule

  };


  feedback.textContent =
    "🐾 Something appeared! Capture it to catalogue the species.";


  showMoleculeDiscovery(
    habitat,
    molecule
  );

}



/* ==========================================================
   SHOW ELEMENT DISCOVERY
========================================================== */

function showElementDiscovery(
  habitat,
  element
) {

  const card =
    document.getElementById(
      habitat
      +
      "DiscoveryCard"
    );


  if (
    !card
  ) {

    return;

  }


  const alreadyCaptured =
    player
      .unlockedElements
      .includes(
        element.atomicNumber
      );


  card.innerHTML = `

    <div class="discovery-icon">
      ${element.icon}
    </div>

    <div class="section-kicker">
      ELEMENTAL SPECIES FOUND
    </div>

    <h2>
      ${element.name}
    </h2>

    <div class="discovery-formula">
      ${element.symbol}
    </div>

    <p>
      Atomic Number:
      ${element.atomicNumber}
    </p>

    <p>
      ${element.clue}
    </p>

    <button
      type="button"
      class="primary-button capture-species-button"
    >

      ${
        alreadyCaptured
        ?
          "✓ Already Catalogued"
        :
          "📸 Capture Species"
      }

    </button>

  `;


  card.classList.add(
    "visible"
  );


  const button =
    card.querySelector(
      ".capture-species-button"
    );


  if (
    alreadyCaptured
  ) {

    button.disabled =
      true;

  }

  else {

    button.addEventListener(
      "click",
      capturePendingSpecies
    );

  }

}



/* ==========================================================
   SHOW MOLECULE DISCOVERY
========================================================== */

function showMoleculeDiscovery(
  habitat,
  molecule
) {

  const card =
    document.getElementById(
      habitat
      +
      "DiscoveryCard"
    );


  if (
    !card
  ) {

    return;

  }


  const alreadyCaptured =
    player
      .unlockedMolecules
      .includes(
        molecule.id
      );


  card.innerHTML = `

    <div class="discovery-icon">
      ${molecule.icon}
    </div>

    <div class="section-kicker">
      MOLECULAR SPECIES FOUND
    </div>

    <h2>
      ${molecule.name}
    </h2>

    <div class="discovery-formula">
      ${molecule.formula}
    </div>

    <p>
      ${molecule.fact}
    </p>

    <button
      type="button"
      class="primary-button capture-species-button"
    >

      ${
        alreadyCaptured
        ?
          "✓ Already Catalogued"
        :
          "📸 Capture Species"
      }

    </button>

  `;


  card.classList.add(
    "visible"
  );


  const button =
    card.querySelector(
      ".capture-species-button"
    );


  if (
    alreadyCaptured
  ) {

    button.disabled =
      true;

  }

  else {

    button.addEventListener(
      "click",
      capturePendingSpecies
    );

  }

}



/* ==========================================================
   HIDE DISCOVERY
========================================================== */

function hideDiscoveryCard(
  habitat
) {

  const card =
    document.getElementById(
      habitat
      +
      "DiscoveryCard"
    );


  if (
    card
  ) {

    card.classList.remove(
      "visible"
    );


    card.innerHTML =
      "";

  }

}



/* ==========================================================
   CAPTURE PENDING SPECIES
========================================================== */

function capturePendingSpecies() {

  if (
    !pendingCapture
  ) {

    return;

  }


  if (
    pendingCapture.type ===
    "element"
  ) {

    captureElement(

      pendingCapture.data,

      pendingCapture.habitat

    );

  }


  if (
    pendingCapture.type ===
    "molecule"
  ) {

    captureMolecule(

      pendingCapture.data,

      pendingCapture.habitat

    );

  }

}



/* ==========================================================
   CAPTURE ELEMENT

   SAVES:
   - Farm progress
   - account XP
   - mastery
   - completion history
   - cloud profile
========================================================== */

function captureElement(
  element,
  habitat
) {

  if (
    player
      .unlockedElements
      .includes(
        element.atomicNumber
      )
  ) {

    return;

  }


  player
    .unlockedElements
    .push(
      element.atomicNumber
    );


  savePlayer();


  const result =
    awardFarmXP(

      "element-"
      +
      element.id,

      25,

      {

        speciesDiscovered:
          1,

        atomsBuilt:
          1

      }

    );


  buildPeriod();


  trackFarmEvent(
    "species_captured",
    {

      species_type:
        "elemental",

      species_name:
        element.name,

      element_symbol:
        element.symbol,

      atomic_number:
        element.atomicNumber,

      habitat:
        habitat,

      xp_earned:
        result
        ?
          result.xpEarned
        :
          0

    }
  );


  const card =
    document.getElementById(
      habitat
      +
      "DiscoveryCard"
    );


  if (
    card
  ) {

    card.innerHTML += `

      <div class="capture-success">
        ✓ CAPTURED IN PERIOD-EX
      </div>

    `;


    const button =
      card.querySelector(
        ".capture-species-button"
      );


    if (
      button
    ) {

      button.textContent =
        "✓ Captured";


      button.disabled =
        true;

    }

  }


  pendingCapture =
    null;

}



/* ==========================================================
   CAPTURE MOLECULE
========================================================== */

function captureMolecule(
  molecule,
  habitat
) {

  if (
    player
      .unlockedMolecules
      .includes(
        molecule.id
      )
  ) {

    return;

  }


  player
    .unlockedMolecules
    .push(
      molecule.id
    );


  savePlayer();


  const result =
    awardFarmXP(

      "molecule-"
      +
      molecule.id,

      30,

      {

        speciesDiscovered:
          1,

        moleculesBuilt:
          1,

        compoundsBuilt:
          1

      }

    );


  trackFarmEvent(
    "species_captured",
    {

      species_type:
        "molecular",

      species_name:
        molecule.name,

      formula:
        molecule.formula,

      habitat:
        habitat,

      xp_earned:
        result
        ?
          result.xpEarned
        :
          0

    }
  );


  updateEvolutionUnlocks();


  const card =
    document.getElementById(
      habitat
      +
      "DiscoveryCard"
    );


  if (
    card
  ) {

    card.innerHTML += `

      <div class="capture-success">
        ✓ CAPTURED IN PERIOD-EX
      </div>

    `;


    const button =
      card.querySelector(
        ".capture-species-button"
      );


    if (
      button
    ) {

      button.textContent =
        "✓ Captured";


      button.disabled =
        true;

    }

  }


  pendingCapture =
    null;

}



/* ==========================================================
   CLEAR HABITAT BUILD
========================================================== */

function clearHabitatBuild(
  habitat
) {

  const state =
    habitatBuilderState[
      habitat
    ];


  state.atoms =
    {};


  state.proton =
    0;


  state.neutron =
    0;


  state.electron =
    0;


  pendingCapture =
    null;


  const feedback =
    document.getElementById(
      habitat
      +
      "BuildFeedback"
    );


  if (
    feedback
  ) {

    feedback.textContent =
      "";

  }


  hideDiscoveryCard(
    habitat
  );

}



/* ==========================================================
   WIRE HABITAT BUTTONS
========================================================== */

function wireHabitatButtons(
  habitat
) {

  const buildButton =
    document.getElementById(
      habitat
      +
      "BuildButton"
    );


  const clearButton =
    document.getElementById(
      habitat
      +
      "ClearButton"
    );


  if (
    buildButton
  ) {

    buildButton.addEventListener(
      "click",
      function () {

        markFarmPlayed();


        if (
          habitatBuilderState[
            habitat
          ].mode ===
          "atom"
        ) {

          attemptAtomBuild(
            habitat
          );

        }

        else {

          attemptMoleculeBuild(
            habitat
          );

        }

      }
    );

  }


  if (
    clearButton
  ) {

    clearButton.addEventListener(
      "click",
      function () {

        clearHabitatBuild(
          habitat
        );


        renderHabitatBuilder(
          habitat
        );

      }
    );

  }

}



/* ==========================================================
   EVOLUTION UNLOCKS
========================================================== */

function updateEvolutionUnlocks() {


  if (
    player
      .unlockedMolecules
      .includes(
        "phosphoric-porcupine"
      )
  ) {

    catalogueEvolution(
      "phosphate-line",
      false
    );

  }


  if (
    player
      .unlockedMolecules
      .includes(
        "water-octopus"
      )
  ) {

    catalogueEvolution(
      "water-line",
      false
    );

  }


  if (
    player
      .unlockedMolecules
      .includes(
        "chromate-crow"
      )

    &&

    player
      .unlockedMolecules
      .includes(
        "dichromate-scarecrow"
      )
  ) {

    catalogueEvolution(
      "chromate-line",
      false
    );

  }

}



/* ==========================================================
   CATALOGUE EVOLUTION
========================================================== */

function catalogueEvolution(
  evolutionId,
  rewardPlayer =
    true
) {

  if (
    player
      .discoveredEvolutions
      .includes(
        evolutionId
      )
  ) {

    return;

  }


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


  player
    .discoveredEvolutions
    .push(
      evolutionId
    );


  savePlayer();



  /*
    Most evolution lines currently unlock
    automatically from captures.

    Because the captures already awarded XP,
    automatic discovery does not double-reward.

    If a future Evolution activity explicitly
    makes the student solve the line, call this
    with rewardPlayer = true.
  */

  if (
    rewardPlayer
  ) {

    awardFarmXP(

      "evolution-"
      +
      evolutionId,

      40,

      {

        transformationsMapped:
          1

      }

    );

  }

  else if (
    window.PATProfile
    &&
    typeof PATProfile.incrementMastery ===
    "function"
  ) {

    /*
      Mastery records the discovered relationship
      even when no separate XP is awarded.
    */

    const masteryKey =
      "evolutionCatalogued_"
      +
      evolutionId;


    const existing =
      PATProfile.getMastery(
        MOLECULAR_FARM_GAME_ID,
        masteryKey
      );


    if (
      !existing
    ) {

      PATProfile.setMastery(
        MOLECULAR_FARM_GAME_ID,
        masteryKey,
        1
      );


      PATProfile.incrementMastery(
        MOLECULAR_FARM_GAME_ID,
        "transformationsMapped",
        1
      );

    }

  }


  trackFarmEvent(
    "evolution_discovered",
    {

      evolution_name:
        evolution.name

    }
  );

}



/* ==========================================================
   PERIOD-EX
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


  const discoveredEvolutions =
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



  /* ========================================================
     ELEMENTAL SPECIES
  ======================================================== */

  catalogue.innerHTML += `

    <div class="periodex-section-heading">

      <h2>
        🌱 Elemental Species
      </h2>

      <p>
        ${discoveredElements.length}
        /
        ${elementalSpecies.length}
        captured
      </p>

    </div>

  `;


  discoveredElements.forEach(
    function (
      item
    ) {

      catalogue.innerHTML += `

        <div class="catalogue-card elemental-entry">

          <strong>
            ${item.icon}
            ${item.name}
          </strong>

          <br>

          ${item.symbol}
          •
          ${item.element}

          <br>

          <small>

            Atomic Number:
            ${item.atomicNumber}

            •

            Valence Electrons:
            ${item.valenceElectrons}

          </small>

        </div>

      `;

    }
  );



  /* ========================================================
     MOLECULAR SPECIES
  ======================================================== */

  catalogue.innerHTML += `

    <div class="periodex-section-heading">

      <h2>
        🐾 Molecular Species
      </h2>

      <p>
        ${discoveredMolecules.length}
        /
        ${molecularSpecies.length}
        captured
      </p>

    </div>

  `;


  if (
    discoveredMolecules.length ===
    0
  ) {

    catalogue.innerHTML += `

      <div class="periodex-undiscovered">

        <strong>
          ??? Molecular Species
        </strong>

        <p>

          Build and capture molecular animals
          on the Farm, in the Wild
          or Under the Sea.

        </p>

      </div>

    `;

  }


  discoveredMolecules.forEach(
    function (
      item
    ) {

      catalogue.innerHTML += `

        <div class="catalogue-card molecular-entry">

          <strong>
            ${item.icon}
            ${item.name}
          </strong>

          <br>

          ${item.formula}

          <br>

          <small>
            ${item.fact}
          </small>

        </div>

      `;

    }
  );



  /* ========================================================
     EVOLUTION LINES
  ======================================================== */

  catalogue.innerHTML += `

    <div class="periodex-section-heading">

      <h2>
        🧬 Evolution Lines
      </h2>

      <p>
        ${discoveredEvolutions.length}
        /
        ${evolutionLines.length}
        discovered
      </p>

    </div>

  `;


  if (
    discoveredEvolutions.length ===
    0
  ) {

    catalogue.innerHTML += `

      <div class="periodex-undiscovered">

        Capture related species to uncover
        their chemical evolution.

      </div>

    `;

  }


  discoveredEvolutions.forEach(
    function (
      evolution
    ) {

      const stages =
        evolution.stages
          .map(
            function (
              stage
            ) {

              return (
                stage.icon
                +
                " "
                +
                stage.formula
              );

            }
          )
          .join(
            " → "
          );


      catalogue.innerHTML += `

        <div class="catalogue-card evolution-entry">

          <strong>
            ${evolution.icon}
            ${evolution.name}
          </strong>

          <br><br>

          ${stages}

          <br><br>

          <small>
            ${evolution.trigger}
          </small>

        </div>

      `;

    }
  );


  trackFarmEvent(
    "periodex_opened",
    {

      elements:
        discoveredElements.length,

      molecules:
        discoveredMolecules.length,

      evolutions:
        discoveredEvolutions.length

    }
  );


  showScreen(
    "periodex"
  );

}



/* ==========================================================
   INITIALIZE HABITAT
========================================================== */

function initializeHabitat(
  habitat
) {

  injectBuilderControls(
    habitat
  );


  wireHabitatButtons(
    habitat
  );


  renderHabitatBuilder(
    habitat
  );

}



/* ==========================================================
   REFRESH FARM FROM PROFILE

   Important when Supabase downloads account data
   after the page has already loaded.
========================================================== */

function refreshFarmFromProfile() {

  if (
    applyingProfileRefresh

    ||
    !farmProfileAvailable()
  ) {

    return;

  }


  applyingProfileRefresh =
    true;


  try {

    const progress =
      PATProfile.getProgress(
        MOLECULAR_FARM_GAME_ID
      );


    if (
      farmProfileHasProgress(
        progress
      )
    ) {

      player =
        normalizeFarmPlayer(
          progress
        );


      buildPeriod();


      updateXP();


      updateEvolutionUnlocks();

    }

  }

  finally {

    applyingProfileRefresh =
      false;

  }

}



/* ==========================================================
   PROFILE EVENTS
========================================================== */

window.addEventListener(
  "pat-cloud-synced",
  function (
    event
  ) {

    const detail =
      event.detail
      ||
      {};


    /*
      Only force a reload after cloud → device sync.

      Uploads already originated from this Farm.
    */

    if (
      detail.direction ===
      "download"
    ) {

      refreshFarmFromProfile();

    }


    updateXP();

  }
);



window.addEventListener(
  "pat-profile-ready",
  function () {

    refreshFarmFromProfile();


    updateXP();

  }
);



/* ==========================================================
   DEVELOPMENT RESET

   FARM PROGRESS ONLY.

   DOES NOT DELETE THE PLAYER'S WHOLE ACCOUNT.
   DOES NOT DELETE OTHER Learning Lab games.
========================================================== */

window.resetMolecularFarmProgress =
  function () {

    if (
      !window.confirm(
        "Reset Molecular Farm species progress? Your other Learning Lab progress will remain."
      )
    ) {

      return;

    }


    if (
      window.PATProfile
      &&
      typeof PATProfile.clearProgress ===
      "function"
    ) {

      PATProfile.clearProgress(
        MOLECULAR_FARM_GAME_ID
      );

    }


    localStorage.removeItem(
      "molecularFarmPlayerV2"
    );


    localStorage.removeItem(
      "patPlayer"
    );


    window.location.reload();

  };



/* ==========================================================
   START
========================================================== */


/*
  Count opening Molecular Farm as today's
  Learning Lab activity.

  This can continue the shared Daily Lab streak.

  It does NOT give XP.
*/

markFarmPlayed();



/*
  Make sure current Farm progress is normalized
  and stored in the shared profile.
*/

savePlayer();



/*
  Build the interface.
*/

buildPeriod();


updateXP();


updateEvolutionUnlocks();


initializeHabitat(
  "farm"
);


initializeHabitat(
  "wild"
);


initializeHabitat(
  "sea"
);



/* ==========================================================
   WORLD ENTERED ANALYTICS
========================================================== */

trackFarmEvent(
  "world_entered",
  {

    version:
      "4",

    profile_system:
      (
        farmProfileAvailable()
        ?
          "PATProfile"
        :
          "legacy_fallback"
      ),

    cloud_signed_in:
      Boolean(

        window.PATProfile

        &&
        typeof PATProfile.isCloudSignedIn ===
        "function"

        &&
        PATProfile.isCloudSignedIn()

      ),

    discovered_elements:
      player.unlockedElements.length,

    discovered_molecules:
      player.unlockedMolecules.length,

    discovered_evolutions:
      player.discoveredEvolutions.length,

    xp:
      (
        window.PATProfile
        &&
        typeof PATProfile.stats ===
        "function"
      )
      ?
        PATProfile.stats().xp
      :
        0

  }
);
