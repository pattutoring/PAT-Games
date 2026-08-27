document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   GOOGLE ANALYTICS
========================================================== */

function trackBeeEvent(
  eventName,
  mode,
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
        "molecular_bee",

      mode:
        mode,

      ...(extraData || {})

    }
  );

}



/* ==========================================================
   MODE START TRACKING
========================================================== */

const startedModes =
  new Set();


function trackModeStart(
  mode
) {

  if (
    startedModes.has(
      mode
    )
  ) {

    return;

  }


  startedModes.add(
    mode
  );


  trackBeeEvent(
    "game_mode_started",
    mode
  );

}



/* ==========================================================
   SHARED PAT PROFILE
========================================================== */

function beeProfileAvailable() {

  return Boolean(

    window.PATProfile
    &&
    typeof PATProfile.get ===
    "function"

  );

}



function refreshBeeProfile() {

  if (
    typeof window.renderMolecularBeeProfile ===
    "function"
  ) {

    window.renderMolecularBeeProfile();

  }

}



/*
  Only Buzzword currently owns a Molecular Bee streak.

  The remaining modes stay fully playable,
  but do not create separate streaks.
*/

let buzzProfileCompletionHandled =
  false;



function completeBuzzwordProfile() {

  if (
    buzzProfileCompletionHandled
  ) {

    return null;

  }


  buzzProfileCompletionHandled =
    true;


  if (
    !beeProfileAvailable()
    ||
    typeof PATProfile.complete !==
    "function"
  ) {

    return null;

  }


  const result =
    PATProfile.complete(

      "molecular_bee",

      "buzzword-001",

      {

        streakKey:
          "buzzword"

      }

    );


  refreshBeeProfile();


  return result;

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


  window.scrollTo(
    {

      top:
        0,

      behavior:
        "smooth"

    }
  );

}



/* ==========================================================
   SCREEN → ANALYTICS MODE
========================================================== */

const screenModes = {

  spellingScreen:
    "spelling_bee",

  queenScreen:
    "queen_bee",

  workerScreen:
    "worker_bee",

  pollinationScreen:
    "pollination",

  hiveScreen:
    "hive_mind"

};



document
  .querySelectorAll(
    "[data-screen]"
  )
  .forEach(
    function (
      button
    ) {

      button.addEventListener(
        "click",
        function () {

          const screen =
            button.dataset.screen;


          showScreen(
            screen
          );


          if (
            screenModes[
              screen
            ]
          ) {

            trackModeStart(
              screenModes[
                screen
              ]
            );

          }

        }
      );

    }
  );



document
  .getElementById(
    "buzzwordFeature"
  )
  .addEventListener(
    "click",
    function () {

      showScreen(
        "buzzwordScreen"
      );


      trackModeStart(
        "buzzword"
      );

    }
  );



/* ==========================================================
   CHEMISTRY DATA
========================================================== */

const elementNames = {

  H:
    "Hydrogen",

  C:
    "Carbon",

  N:
    "Nitrogen",

  O:
    "Oxygen",

  Na:
    "Sodium",

  K:
    "Potassium",

  Li:
    "Lithium",

  Mg:
    "Magnesium",

  Ca:
    "Calcium",

  Al:
    "Aluminum",

  S:
    "Sulfur",

  Cl:
    "Chlorine",

  F:
    "Fluorine",

  Br:
    "Bromine",

  I:
    "Iodine"

};



const subscripts = {

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



/* ==========================================================
   FORMULA BUILDER
========================================================== */

function formulaFromSequence(
  sequence
) {

  if (
    sequence.length ===
    0
  ) {

    return "";

  }


  let output =
    "";


  let current =
    sequence[0];


  let count =
    1;


  for (
    let i =
      1;
    i <=
      sequence.length;
    i++
  ) {

    if (
      sequence[i] ===
      current
    ) {

      count++;

    }

    else {

      output +=
        current;


      if (
        count >
        1
      ) {

        output +=
          subscripts[
            count
          ]
          ||
          count;

      }


      current =
        sequence[i];


      count =
        1;

    }

  }


  return output;

}



/* ==========================================================
   UNIVERSAL DRAG ENGINE
========================================================== */

let activeDrag =
  null;



function registerDrag(
  element,
  payload
) {

  element.addEventListener(
    "pointerdown",
    function (
      event
    ) {

      if (
        event.pointerType ===
        "mouse"
        &&
        event.button !==
        0
      ) {

        return;

      }


      event.preventDefault();


      const rect =
        element.getBoundingClientRect();


      activeDrag = {

        source:
          element,

        payload:
          payload,

        startX:
          event.clientX,

        startY:
          event.clientY,

        offsetX:
          event.clientX -
          rect.left,

        offsetY:
          event.clientY -
          rect.top,

        moving:
          false,

        ghost:
          null

      };

    },
    {

      passive:
        false

    }
  );

}



document.addEventListener(
  "pointermove",
  function (
    event
  ) {

    if (
      !activeDrag
    ) {

      return;

    }


    const distance =
      Math.hypot(

        event.clientX -
        activeDrag.startX,

        event.clientY -
        activeDrag.startY

      );


    if (
      !activeDrag.moving
      &&
      distance <
      6
    ) {

      return;

    }


    event.preventDefault();


    if (
      !activeDrag.moving
    ) {

      activeDrag.moving =
        true;


      activeDrag.ghost =
        activeDrag.source
          .cloneNode(
            true
          );


      activeDrag.ghost
        .classList
        .add(
          "drag-ghost"
        );


      const rect =
        activeDrag.source
          .getBoundingClientRect();


      activeDrag.ghost.style.width =
        rect.width +
        "px";


      activeDrag.ghost.style.height =
        rect.height +
        "px";


      document.body.appendChild(
        activeDrag.ghost
      );


      activeDrag.source.style.opacity =
        ".35";

    }


    activeDrag.ghost.style.left =
      (
        event.clientX -
        activeDrag.offsetX
      )
      +
      "px";


    activeDrag.ghost.style.top =
      (
        event.clientY -
        activeDrag.offsetY
      )
      +
      "px";


    clearDragHover();


    const target =
      findDropTarget(
        event.clientX,
        event.clientY,
        activeDrag.payload
      );


    if (
      target
    ) {

      target.classList.add(
        "drag-hover"
      );

    }

  },
  {

    passive:
      false

  }
);



document.addEventListener(
  "pointerup",
  function (
    event
  ) {

    if (
      !activeDrag
    ) {

      return;

    }


    const drag =
      activeDrag;


    const target =
      drag.moving
      ?
        findDropTarget(
          event.clientX,
          event.clientY,
          drag.payload
        )
      :
        null;


    if (
      drag.ghost
    ) {

      drag.ghost.remove();

    }


    drag.source.style.opacity =
      "";


    clearDragHover();


    activeDrag =
      null;


    if (
      drag.moving
      &&
      target
    ) {

      handleDrop(
        drag.source,
        drag.payload,
        target
      );


      return;

    }


    if (
      !drag.moving
    ) {

      handleTap(
        drag.source,
        drag.payload
      );

    }

  }
);



document.addEventListener(
  "pointercancel",
  function () {

    if (
      activeDrag
    ) {

      if (
        activeDrag.ghost
      ) {

        activeDrag.ghost.remove();

      }


      activeDrag.source.style.opacity =
        "";

    }


    activeDrag =
      null;


    clearDragHover();

  }
);



function clearDragHover() {

  document
    .querySelectorAll(
      ".drag-hover"
    )
    .forEach(
      function (
        item
      ) {

        item.classList.remove(
          "drag-hover"
        );

      }
    );

}



function pointInside(
  x,
  y,
  element
) {

  const rect =
    element.getBoundingClientRect();


  return (

    x >=
    rect.left

    &&
    x <=
    rect.right

    &&
    y >=
    rect.top

    &&
    y <=
    rect.bottom

  );

}



/* ==========================================================
   FIND DROP TARGET
========================================================== */

function findDropTarget(
  x,
  y,
  payload
) {


  /* SPELLING */

  if (
    payload.game ===
    "spelling"
  ) {

    const slots =
      Array.from(
        document.querySelectorAll(
          ".spelling-drop:not(.filled)"
        )
      );


    return (
      slots.find(
        function (
          slot
        ) {

          return pointInside(
            x,
            y,
            slot
          );

        }
      )
      ||
      null
    );

  }



  /* QUEEN */

  if (
    payload.game ===
    "queen"
  ) {

    const slots =
      Array.from(
        document.querySelectorAll(
          ".queen-free-slot.available-next"
        )
      );


    return (
      slots.find(
        function (
          slot
        ) {

          return pointInside(
            x,
            y,
            slot
          );

        }
      )
      ||
      null
    );

  }



  /* WORKER */

  if (
    payload.game ===
    "worker"
  ) {

    if (
      payload.particle ===
      "electron"
    ) {

      const inner =
        document.getElementById(
          "innerShell"
        );


      const outer =
        document.getElementById(
          "outerShell"
        );


      if (
        pointInside(
          x,
          y,
          inner
        )
      ) {

        return inner;

      }


      if (
        pointInside(
          x,
          y,
          outer
        )
      ) {

        return outer;

      }

    }

    else {

      const nucleus =
        document.getElementById(
          "nucleus"
        );


      if (
        pointInside(
          x,
          y,
          nucleus
        )
      ) {

        return nucleus;

      }

    }

  }



  /* POLLINATION */

  if (
    payload.game ===
    "pollination"
  ) {

    const flowers =
      Array.from(
        document.querySelectorAll(
          ".flower"
        )
      );


    return (
      flowers.find(
        function (
          flower
        ) {

          return pointInside(
            x,
            y,
            flower
          );

        }
      )
      ||
      null
    );

  }


  return null;

}



/* ==========================================================
   HANDLE DROP
========================================================== */

function handleDrop(
  source,
  payload,
  target
) {

  if (
    payload.game ===
    "spelling"
  ) {

    placeSpelling(
      source,
      payload.symbol,
      target
    );

  }


  if (
    payload.game ===
    "queen"
  ) {

    placeQueen(
      source,
      payload.symbol,
      target
    );

  }


  if (
    payload.game ===
    "worker"
  ) {

    placeWorkerParticle(
      payload.particle,
      target
    );

  }


  if (
    payload.game ===
    "pollination"
  ) {

    pollinate(
      source,
      payload.ion,
      target
    );

  }

}



/* ==========================================================
   TAP FALLBACK
========================================================== */

function handleTap(
  source,
  payload
) {


  if (
    payload.game ===
    "spelling"
  ) {

    const target =
      document.querySelector(
        ".spelling-drop:not(.filled)"
      );


    if (
      target
    ) {

      placeSpelling(
        source,
        payload.symbol,
        target
      );

    }

  }



  if (
    payload.game ===
    "queen"
  ) {

    const target =
      document.querySelector(
        ".queen-free-slot.available-next"
      );


    if (
      target
    ) {

      placeQueen(
        source,
        payload.symbol,
        target
      );

    }

  }



  if (
    payload.game ===
    "worker"
  ) {

    if (
      payload.particle ===
      "electron"
    ) {

      const target =
        workerElectrons <
        2
        ?
          document.getElementById(
            "innerShell"
          )
        :
          document.getElementById(
            "outerShell"
          );


      placeWorkerParticle(
        "electron",
        target
      );

    }

    else {

      placeWorkerParticle(
        payload.particle,
        document.getElementById(
          "nucleus"
        )
      );

    }

  }



  if (
    payload.game ===
    "pollination"
  ) {

    const flower =
      document.querySelector(
        '[data-flower-ion="'
        +
        payload.ion
        +
        '"]'
      );


    if (
      flower
    ) {

      pollinate(
        source,
        payload.ion,
        flower
      );

    }

  }

}



/* ==========================================================
   ATOM TILE CREATOR
========================================================== */

function createAtomTile(
  symbol,
  game,
  sourceId
) {

  const tile =
    document.createElement(
      "button"
    );


  tile.type =
    "button";


  tile.className =
    "atom-hex";


  tile.dataset.sourceId =
    sourceId;


  tile.innerHTML =
    "<strong>"
    +
    symbol
    +
    "</strong>"
    +
    "<small>"
    +
    (
      elementNames[
        symbol
      ]
      ||
      symbol
    )
    +
    "</small>";


  registerDrag(
    tile,
    {

      game:
        game,

      symbol:
        symbol

    }
  );


  return tile;

}



/* ==========================================================
   BUZZWORD

   WEEKLY PUZZLE #001

   Completion rule:
   FIND ALL ACCEPTED COMPOUNDS.

   Moleculargram:
   collectively use every element somewhere
   across your discovered swarm.
========================================================== */

const BUZZWORD_NUMBER =
  "001";


const buzzHiveElements = [

  "Cl",
  "H",
  "O",
  "N",
  "C",
  "S",
  "Na"

];



const buzzAnswers = [


  {

    sequence: [
      "C",
      "O"
    ],

    formula:
      "CO",

    name:
      "Carbon Monoxide"

  },


  {

    sequence: [
      "C",
      "O",
      "O"
    ],

    formula:
      "CO₂",

    name:
      "Carbon Dioxide"

  },


  {

    sequence: [
      "C",
      "H",
      "H",
      "H",
      "H"
    ],

    formula:
      "CH₄",

    name:
      "Methane"

  },


  {

    sequence: [
      "C",
      "S",
      "S"
    ],

    formula:
      "CS₂",

    name:
      "Carbon Disulfide"

  },


  {

    sequence: [
      "C",
      "Cl",
      "Cl",
      "Cl",
      "Cl"
    ],

    formula:
      "CCl₄",

    name:
      "Carbon Tetrachloride"

  },


  {

    sequence: [
      "H",
      "C",
      "N"
    ],

    formula:
      "HCN",

    name:
      "Hydrogen Cyanide"

  },


  {

    sequence: [
      "H",
      "H",
      "C",
      "O",
      "O",
      "O"
    ],

    formula:
      "H₂CO₃",

    name:
      "Carbonic Acid"

  },


  {

    sequence: [
      "Na",
      "Na",
      "C",
      "O",
      "O",
      "O"
    ],

    formula:
      "Na₂CO₃",

    name:
      "Sodium Carbonate"

  }


];



let buzzSequence =
  [];


let buzzFound =
  [];


let moleculargramTracked =
  false;


let buzzwordCompleted =
  false;



document
  .querySelectorAll(
    "[data-buzz]"
  )
  .forEach(
    function (
      button
    ) {

      button.addEventListener(
        "click",
        function () {

          trackModeStart(
            "buzzword"
          );


          buzzSequence.push(
            button.dataset.buzz
          );


          button.classList.add(
            "flash"
          );


          setTimeout(
            function () {

              button.classList.remove(
                "flash"
              );

            },

            120
          );


          renderBuzz();

        }
      );

    }
  );



function renderBuzz() {

  const formula =
    document.getElementById(
      "buzzFormula"
    );


  const words =
    document.getElementById(
      "buzzWords"
    );


  if (
    buzzSequence.length ===
    0
  ) {

    formula.textContent =
      "Tap an element to begin";


    formula.classList.add(
      "empty"
    );


    words.textContent =
      "";


    return;

  }


  formula.classList.remove(
    "empty"
  );


  formula.textContent =
    formulaFromSequence(
      buzzSequence
    );


  words.textContent =
    buzzSequence
      .map(
        function (
          symbol
        ) {

          return (
            elementNames[
              symbol
            ]
            ||
            symbol
          );

        }
      )
      .join(
        " → "
      );

}



document
  .getElementById(
    "buzzUndo"
  )
  .addEventListener(
    "click",
    function () {

      buzzSequence.pop();


      renderBuzz();

    }
  );



document
  .getElementById(
    "buzzClear"
  )
  .addEventListener(
    "click",
    function () {

      buzzSequence =
        [];


      renderBuzz();

    }
  );



/* ==========================================================
   ELEMENTS USED ACROSS FOUND COMPOUNDS
========================================================== */

function getBuzzSwarmElements() {

  const used =
    new Set();


  buzzFound.forEach(
    function (
      answer
    ) {

      answer.sequence.forEach(
        function (
          symbol
        ) {

          used.add(
            symbol
          );

        }
      );

    }
  );


  return used;

}



/* ==========================================================
   CHECK MOLECULARGRAM
========================================================== */

function checkMoleculargram() {

  const used =
    getBuzzSwarmElements();


  const complete =
    buzzHiveElements.every(
      function (
        symbol
      ) {

        return used.has(
          symbol
        );

      }
    );


  if (
    !complete
  ) {

    return false;

  }


  document
    .getElementById(
      "moleculargram"
    )
    .classList
    .add(
      "visible"
    );


  if (
    !moleculargramTracked
  ) {

    moleculargramTracked =
      true;


    trackBeeEvent(
      "moleculargram_earned",
      "buzzword",
      {

        puzzle_number:
          BUZZWORD_NUMBER,

        compounds_found:
          buzzFound.length

      }
    );

  }


  return true;

}



/* ==========================================================
   COMPLETE WEEKLY BUZZWORD
========================================================== */

function checkBuzzwordCompletion() {

  if (
    buzzwordCompleted
  ) {

    return;

  }


  if (
    buzzFound.length <
    buzzAnswers.length
  ) {

    return;

  }


  buzzwordCompleted =
    true;


  const result =
    completeBuzzwordProfile();


  const feedback =
    document.getElementById(
      "buzzFeedback"
    );


  let message =
    "🐝👑 Weekly Buzzword complete! You found the entire Molecular Swarm.";


  if (
    result
    &&
    result.xpEarned >
    0
  ) {

    message +=
      " +"
      +
      result.xpEarned
      +
      " XP";

  }

  else if (
    result
    &&
    result.alreadyCompleted
  ) {

    message +=
      " This week's Buzzword was already catalogued.";

  }


  feedback.textContent =
    message;


  trackBeeEvent(
    "puzzle_solved",
    "buzzword",
    {

      puzzle_number:
        BUZZWORD_NUMBER,

      compounds_found:
        buzzFound.length,

      moleculargram:
        moleculargramTracked

    }
  );

}



/* ==========================================================
   SUBMIT BUZZWORD COMPOUND
========================================================== */

document
  .getElementById(
    "buzzSubmit"
  )
  .addEventListener(
    "click",
    function () {

      trackModeStart(
        "buzzword"
      );


      const feedback =
        document.getElementById(
          "buzzFeedback"
        );


      if (
        !buzzSequence.includes(
          "C"
        )
      ) {

        feedback.textContent =
          "👑 Every Buzzword compound must use Carbon, the gold center element.";


        return;

      }


      const answer =
        buzzAnswers.find(
          function (
            item
          ) {

            return (
              item.sequence.join(
                "|"
              )
              ===
              buzzSequence.join(
                "|"
              )
            );

          }
        );


      if (
        !answer
      ) {

        feedback.textContent =
          "That combination is not one of this week's accepted compounds.";


        return;

      }


      const duplicate =
        buzzFound.some(
          function (
            item
          ) {

            return (
              item.formula ===
              answer.formula
            );

          }
        );


      if (
        duplicate
      ) {

        feedback.textContent =
          "You already discovered "
          +
          answer.name
          +
          ".";


        buzzSequence =
          [];


        renderBuzz();


        return;

      }


      buzzFound.push(
        answer
      );


      trackBeeEvent(
        "compound_found",
        "buzzword",
        {

          puzzle_number:
            BUZZWORD_NUMBER,

          compound_name:
            answer.name,

          formula:
            answer.formula,

          compounds_found:
            buzzFound.length,

          compounds_total:
            buzzAnswers.length

        }
      );


      feedback.textContent =
        "🐝 "
        +
        answer.name
        +
        " found!";


      buzzSequence =
        [];


      renderBuzz();


      renderBuzzFound();


      const earnedMoleculargram =
        checkMoleculargram();


      if (
        earnedMoleculargram
        &&
        buzzFound.length <
        buzzAnswers.length
      ) {

        feedback.textContent =
          "🐝👑 MOLECULARGRAM! Your swarm has now used every element in the hive.";

      }


      checkBuzzwordCompletion();

    }
  );



/* ==========================================================
   RENDER FOUND COMPOUNDS
========================================================== */

function renderBuzzFound() {

  const list =
    document.getElementById(
      "buzzFound"
    );


  list.innerHTML =
    "";


  document
    .getElementById(
      "buzzFoundCount"
    )
    .textContent =
      buzzFound.length;


  if (
    buzzFound.length ===
    0
  ) {

    list.innerHTML =
      "<em>Your discoveries will appear here.</em>";


    return;

  }


  buzzFound.forEach(
    function (
      answer
    ) {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "found-row";


      row.innerHTML =
        "<strong>"
        +
        answer.formula
        +
        "</strong>"
        +
        "<span>"
        +
        answer.name
        +
        "</span>";


      list.appendChild(
        row
      );

    }
  );

}



/* ==========================================================
   SPELLING BEE
========================================================== */

const spellingChallenges = [


  {

    name:
      "water",

    answer: [
      "H",
      "H",
      "O"
    ],

    bank: [
      "H",
      "H",
      "O",
      "C",
      "N"
    ]

  },


  {

    name:
      "carbon dioxide",

    answer: [
      "C",
      "O",
      "O"
    ],

    bank: [
      "C",
      "O",
      "O",
      "H",
      "N"
    ]

  },


  {

    name:
      "ammonia",

    answer: [
      "N",
      "H",
      "H",
      "H"
    ],

    bank: [
      "N",
      "H",
      "H",
      "H",
      "O",
      "C"
    ]

  },


  {

    name:
      "methane",

    answer: [
      "C",
      "H",
      "H",
      "H",
      "H"
    ],

    bank: [
      "C",
      "H",
      "H",
      "H",
      "H",
      "O",
      "N"
    ]

  }


];



let spellingIndex =
  0;


const SPELLING_SLOT_COUNT =
  8;



function loadSpelling() {

  const challenge =
    spellingChallenges[
      spellingIndex
    ];


  document
    .getElementById(
      "spellingPrompt"
    )
    .textContent =
      "Build "
      +
      challenge.name
      +
      ".";


  document
    .getElementById(
      "spellingFeedback"
    )
    .textContent =
      "";


  const slots =
    document.getElementById(
      "spellingSlots"
    );


  slots.innerHTML =
    "";


  for (
    let index =
      0;
    index <
      SPELLING_SLOT_COUNT;
    index++
  ) {

    const slot =
      document.createElement(
        "button"
      );


    slot.type =
      "button";


    slot.className =
      "spelling-drop";


    slot.dataset.slot =
      index;


    slot.dataset.symbol =
      "";


    slot.addEventListener(
      "click",
      function () {

        if (
          slot.classList.contains(
            "filled"
          )
        ) {

          returnSpelling(
            slot
          );

        }

      }
    );


    slots.appendChild(
      slot
    );

  }


  const bank =
    document.getElementById(
      "spellingBank"
    );


  bank.innerHTML =
    "";


  challenge.bank.forEach(
    function (
      symbol,
      index
    ) {

      bank.appendChild(
        createAtomTile(

          symbol,

          "spelling",

          "spelling-"
          +
          index

        )
      );

    }
  );


  updateSpellingFormula();

}



/* ==========================================================
   PLACE SPELLING ATOM
========================================================== */

function placeSpelling(
  source,
  symbol,
  target
) {

  trackModeStart(
    "spelling_bee"
  );


  if (
    target.classList.contains(
      "filled"
    )
  ) {

    return;

  }


  target.classList.add(
    "filled"
  );


  target.dataset.symbol =
    symbol;


  target.dataset.sourceId =
    source.dataset.sourceId;


  target.textContent =
    symbol;


  source.style.visibility =
    "hidden";


  updateSpellingFormula();

}



function returnSpelling(
  slot
) {

  const source =
    document.querySelector(
      '[data-source-id="'
      +
      slot.dataset.sourceId
      +
      '"]'
    );


  if (
    source
  ) {

    source.style.visibility =
      "";

  }


  slot.classList.remove(
    "filled"
  );


  slot.dataset.symbol =
    "";


  slot.dataset.sourceId =
    "";


  slot.textContent =
    "";


  updateSpellingFormula();

}



function getSpellingSequence() {

  return Array
    .from(
      document.querySelectorAll(
        ".spelling-drop"
      )
    )
    .map(
      function (
        slot
      ) {

        return (
          slot.dataset.symbol
          ||
          ""
        );

      }
    )
    .filter(
      Boolean
    );

}



function updateSpellingFormula() {

  const sequence =
    getSpellingSequence();


  const preview =
    document.getElementById(
      "spellingFormula"
    );


  if (
    sequence.length ===
    0
  ) {

    preview.textContent =
      "Chemical formula";


    preview.classList.add(
      "empty"
    );


    return;

  }


  preview.textContent =
    formulaFromSequence(
      sequence
    );


  preview.classList.remove(
    "empty"
  );

}



document
  .getElementById(
    "spellingUndo"
  )
  .addEventListener(
    "click",
    function () {

      const filled =
        Array.from(
          document.querySelectorAll(
            ".spelling-drop.filled"
          )
        );


      if (
        filled.length
      ) {

        returnSpelling(
          filled[
            filled.length -
            1
          ]
        );

      }

    }
  );



document
  .getElementById(
    "spellingReset"
  )
  .addEventListener(
    "click",
    loadSpelling
  );



document
  .getElementById(
    "spellingCheck"
  )
  .addEventListener(
    "click",
    function () {

      trackModeStart(
        "spelling_bee"
      );


      const challenge =
        spellingChallenges[
          spellingIndex
        ];


      const answer =
        getSpellingSequence();


      if (
        answer.join(
          "|"
        )
        ===
        challenge.answer.join(
          "|"
        )
      ) {

        document
          .getElementById(
            "spellingFeedback"
          )
          .textContent =
            "🐝 Correct — "
            +
            formulaFromSequence(
              challenge.answer
            )
            +
            "!";


        trackBeeEvent(
          "challenge_completed",
          "spelling_bee",
          {

            challenge_name:
              challenge.name,

            formula:
              formulaFromSequence(
                challenge.answer
              ),

            challenge_index:
              spellingIndex +
              1

          }
        );


        setTimeout(
          function () {

            spellingIndex =
              (
                spellingIndex +
                1
              )
              %
              spellingChallenges.length;


            loadSpelling();

          },

          1000
        );

      }

      else {

        document
          .getElementById(
            "spellingFeedback"
          )
          .textContent =
            "Not quite. Rearrange the atom honeycombs and try again.";

      }

    }
  );



/* ==========================================================
   QUEEN BEE
========================================================== */

const queenAtomBank = [

  "H",
  "C",
  "N",
  "O",
  "F",
  "Cl",
  "S",
  "Na",
  "Mg"

];



const queenMolecules = [


  {

    name:
      "Methane",

    formula:
      "CH₄",

    center:
      "C",

    neighbors: [
      "H",
      "H",
      "H",
      "H"
    ],

    info:
      "Carbon forms four single bonds to hydrogen."

  },


  {

    name:
      "Carbon Dioxide",

    formula:
      "CO₂",

    center:
      "C",

    neighbors: [
      "O",
      "O"
    ],

    info:
      "Carbon dioxide contains one carbon and two oxygen atoms."

  },


  {

    name:
      "Carbon Disulfide",

    formula:
      "CS₂",

    center:
      "C",

    neighbors: [
      "S",
      "S"
    ],

    info:
      "Carbon disulfide contains carbon bonded to two sulfur atoms."

  },


  {

    name:
      "Carbon Tetrachloride",

    formula:
      "CCl₄",

    center:
      "C",

    neighbors: [
      "Cl",
      "Cl",
      "Cl",
      "Cl"
    ],

    info:
      "Carbon tetrachloride contains carbon bonded to four chlorine atoms."

  },


  {

    name:
      "Water",

    formula:
      "H₂O",

    center:
      "O",

    neighbors: [
      "H",
      "H"
    ],

    info:
      "Water contains one oxygen bonded to two hydrogen atoms."

  },


  {

    name:
      "Ammonia",

    formula:
      "NH₃",

    center:
      "N",

    neighbors: [
      "H",
      "H",
      "H"
    ],

    info:
      "Ammonia contains nitrogen bonded to three hydrogen atoms."

  },


  {

    name:
      "Hydrogen Chloride",

    formula:
      "HCl",

    center:
      "H",

    neighbors: [
      "Cl"
    ],

    info:
      "Hydrogen chloride contains one hydrogen and one chlorine atom."

  },


  {

    name:
      "Hydrogen Chloride",

    formula:
      "HCl",

    center:
      "Cl",

    neighbors: [
      "H"
    ],

    info:
      "Hydrogen chloride contains one chlorine and one hydrogen atom."

  },


  {

    name:
      "Hydrogen Fluoride",

    formula:
      "HF",

    center:
      "H",

    neighbors: [
      "F"
    ],

    info:
      "Hydrogen fluoride contains hydrogen bonded to fluorine."

  },


  {

    name:
      "Hydrogen Fluoride",

    formula:
      "HF",

    center:
      "F",

    neighbors: [
      "H"
    ],

    info:
      "Hydrogen fluoride contains fluorine bonded to hydrogen."

  },


  {

    name:
      "Hydrogen Sulfide",

    formula:
      "H₂S",

    center:
      "S",

    neighbors: [
      "H",
      "H"
    ],

    info:
      "Hydrogen sulfide contains sulfur bonded to two hydrogen atoms."

  },


  {

    name:
      "Molecular Hydrogen",

    formula:
      "H₂",

    center:
      "H",

    neighbors: [
      "H"
    ],

    info:
      "Elemental hydrogen normally exists as the diatomic molecule H₂."

  },


  {

    name:
      "Molecular Oxygen",

    formula:
      "O₂",

    center:
      "O",

    neighbors: [
      "O"
    ],

    info:
      "Elemental oxygen normally exists as O₂."

  },


  {

    name:
      "Molecular Nitrogen",

    formula:
      "N₂",

    center:
      "N",

    neighbors: [
      "N"
    ],

    info:
      "Elemental nitrogen normally exists as N₂."

  }


];



let queenCorrectCount =
  0;


let queenActiveCell =
  null;


const queenCells =
  new Map();


const queenCoordinates =
  [];



for (
  let q =
    -3;
  q <=
    3;
  q++
) {

  for (
    let r =
      -3;
    r <=
      3;
    r++
  ) {

    const s =
      -q -
      r;


    if (
      Math.abs(
        s
      )
      <=
      3
    ) {

      queenCoordinates.push(
        {

          q:
            q,

          r:
            r

        }
      );

    }

  }

}



function queenKey(
  q,
  r
) {

  return (
    q
    +
    ","
    +
    r
  );

}



const queenDirections = [

  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1]

];



function getQueenNeighborKeys(
  q,
  r
) {

  return queenDirections
    .map(
      function (
        direction
      ) {

        return queenKey(

          q +
          direction[0],

          r +
          direction[1]

        );

      }
    );

}



/* ==========================================================
   BUILD QUEEN BOARD
========================================================== */

function buildQueenBoard() {

  const hive =
    document.getElementById(
      "queenHive"
    );


  if (
    !hive
  ) {

    return;

  }


  hive.innerHTML =
    "";


  queenCells.clear();


  queenCorrectCount =
    0;


  const hexWidth =
    88;


  const hexHeight =
    78;


  const horizontalStep =
    66;


  const verticalStep =
    78;


  const centerX =
    360;


  const centerY =
    325;


  queenCoordinates.forEach(
    function (
      coordinate
    ) {

      const q =
        coordinate.q;


      const r =
        coordinate.r;


      const key =
        queenKey(
          q,
          r
        );


      const slot =
        document.createElement(
          "button"
        );


      slot.type =
        "button";


      slot.className =
        "queen-free-slot empty";


      slot.dataset.q =
        q;


      slot.dataset.r =
        r;


      slot.dataset.key =
        key;


      const left =
        centerX
        +
        q *
        horizontalStep
        -
        hexWidth /
        2;


      const top =
        centerY
        +
        (
          r +
          q /
          2
        )
        *
        verticalStep
        -
        hexHeight /
        2;


      slot.style.left =
        left +
        "px";


      slot.style.top =
        top +
        "px";


      slot.addEventListener(
        "click",
        function () {

          handleQueenCellClick(
            slot
          );

        }
      );


      hive.appendChild(
        slot
      );

    }
  );


  queenCells.set(
    "0,0",
    {

      symbol:
        "C",

      locked:
        true

    }
  );


  queenActiveCell =
    hive.querySelector(
      '[data-key="0,0"]'
    );


  buildQueenAtomBank();


  renderQueenBoard();


  updateQueenStatus();


  updateQueenFormula();


  document
    .getElementById(
      "queenFeedback"
    )
    .textContent =
      "";


  document
    .getElementById(
      "queenDiscovery"
    )
    .classList
    .remove(
      "visible"
    );

}



/* ==========================================================
   QUEEN ATOM BANK
========================================================== */

function buildQueenAtomBank() {

  const bank =
    document.getElementById(
      "queenBank"
    );


  bank.innerHTML =
    "";


  queenAtomBank.forEach(
    function (
      symbol,
      index
    ) {

      const tile =
        createAtomTile(

          symbol,

          "queen",

          "queen-unlimited-"
          +
          index

        );


      tile.dataset.queenReusable =
        "true";


      bank.appendChild(
        tile
      );

    }
  );

}



/* ==========================================================
   RENDER QUEEN GRID
========================================================== */

function renderQueenBoard() {

  const hive =
    document.getElementById(
      "queenHive"
    );


  hive
    .querySelectorAll(
      ".queen-free-slot"
    )
    .forEach(
      function (
        slot
      ) {

        const key =
          slot.dataset.key;


        const cell =
          queenCells.get(
            key
          );


        slot.className =
          "queen-free-slot";


        slot.innerHTML =
          "";


        if (
          !cell
        ) {

          slot.classList.add(
            "empty"
          );

        }

        else {

          slot.classList.add(
            "occupied"
          );


          if (
            cell.locked
          ) {

            slot.classList.add(
              "locked"
            );

          }


          slot.innerHTML =
            "<strong>"
            +
            cell.symbol
            +
            "</strong>"
            +
            "<small>"
            +
            (
              elementNames[
                cell.symbol
              ]
              ||
              cell.symbol
            )
            +
            "</small>";

        }

      }
    );


  if (
    queenActiveCell
  ) {

    queenActiveCell
      .classList
      .add(
        "active-queen"
      );

  }


  updateQueenAvailableCells();

}



/* ==========================================================
   AVAILABLE QUEEN CELLS
========================================================== */

function updateQueenAvailableCells() {

  const hive =
    document.getElementById(
      "queenHive"
    );


  hive
    .querySelectorAll(
      ".queen-free-slot"
    )
    .forEach(
      function (
        slot
      ) {

        slot.classList.remove(
          "available-next"
        );

      }
    );


  if (
    !queenActiveCell
  ) {

    return;

  }


  const q =
    Number(
      queenActiveCell.dataset.q
    );


  const r =
    Number(
      queenActiveCell.dataset.r
    );


  const neighborKeys =
    getQueenNeighborKeys(
      q,
      r
    );


  neighborKeys.forEach(
    function (
      key
    ) {

      if (
        queenCells.has(
          key
        )
      ) {

        return;

      }


      const slot =
        hive.querySelector(
          '[data-key="'
          +
          key
          +
          '"]'
        );


      if (
        slot
      ) {

        slot.classList.add(
          "available-next"
        );

      }

    }
  );

}



/* ==========================================================
   PLACE QUEEN ATOM
========================================================== */

function placeQueen(
  source,
  symbol,
  target
) {

  trackModeStart(
    "queen_bee"
  );


  if (
    !target
  ) {

    return;

  }


  if (
    !target.classList.contains(
      "available-next"
    )
  ) {

    return;

  }


  const key =
    target.dataset.key;


  if (
    queenCells.has(
      key
    )
  ) {

    return;

  }


  queenCells.set(
    key,
    {

      symbol:
        symbol,

      locked:
        false

    }
  );


  renderQueenBoard();


  updateQueenFormula();


  document
    .getElementById(
      "queenFeedback"
    )
    .textContent =
      "";

}



/* ==========================================================
   QUEEN CELL CLICK
========================================================== */

function handleQueenCellClick(
  slot
) {

  const key =
    slot.dataset.key;


  const cell =
    queenCells.get(
      key
    );


  if (
    !cell
  ) {

    return;

  }


  if (
    !cell.locked
  ) {

    queenCells.delete(
      key
    );


    renderQueenBoard();


    updateQueenFormula();


    return;

  }


  queenActiveCell =
    slot;


  renderQueenBoard();


  updateQueenStatus();


  updateQueenFormula();


  document
    .getElementById(
      "queenFeedback"
    )
    .textContent =
      "👑 "
      +
      (
        elementNames[
          cell.symbol
        ]
        ||
        cell.symbol
      )
      +
      " is now the active Queen. Build outward from it.";


  document
    .getElementById(
      "queenDiscovery"
    )
    .classList
    .remove(
      "visible"
    );

}



/* ==========================================================
   QUEEN HELPERS
========================================================== */

function getQueenActiveData() {

  if (
    !queenActiveCell
  ) {

    return null;

  }


  const key =
    queenActiveCell.dataset.key;


  return (
    queenCells.get(
      key
    )
    ||
    null
  );

}



function getQueenTemporaryNeighbors() {

  if (
    !queenActiveCell
  ) {

    return [];

  }


  const q =
    Number(
      queenActiveCell.dataset.q
    );


  const r =
    Number(
      queenActiveCell.dataset.r
    );


  return getQueenNeighborKeys(
    q,
    r
  )
    .map(
      function (
        key
      ) {

        return {

          key:
            key,

          cell:
            queenCells.get(
              key
            )

        };

      }
    )
    .filter(
      function (
        item
      ) {

        return (
          item.cell
          &&
          !item.cell.locked
        );

      }
    );

}



/* ==========================================================
   QUEEN FORMULA
========================================================== */

function updateQueenFormula() {

  const active =
    getQueenActiveData();


  const preview =
    document.getElementById(
      "queenFormula"
    );


  if (
    !active
  ) {

    preview.textContent =
      "Choose an active atom";


    preview.classList.add(
      "empty"
    );


    return;

  }


  const neighbors =
    getQueenTemporaryNeighbors();


  if (
    neighbors.length ===
    0
  ) {

    preview.textContent =
      "Grow outward from "
      +
      active.symbol;


    preview.classList.add(
      "empty"
    );


    return;

  }


  const neighborSymbols =
    neighbors.map(
      function (
        item
      ) {

        return item.cell.symbol;

      }
    );


  neighborSymbols.sort();


  const sequence = [

    active.symbol,

    ...neighborSymbols

  ];


  preview.textContent =
    formulaFromSequence(
      sequence
    );


  preview.classList.remove(
    "empty"
  );

}



function normalizeAtomList(
  atoms
) {

  return atoms
    .slice()
    .sort()
    .join(
      "|"
    );

}



/* ==========================================================
   QUEEN SELF CHECK
========================================================== */

document
  .getElementById(
    "queenCheck"
  )
  .addEventListener(
    "click",
    function () {

      trackModeStart(
        "queen_bee"
      );


      const active =
        getQueenActiveData();


      const feedback =
        document.getElementById(
          "queenFeedback"
        );


      const discovery =
        document.getElementById(
          "queenDiscovery"
        );


      if (
        !active
      ) {

        feedback.textContent =
          "Choose an active atom first.";


        return;

      }


      const temporary =
        getQueenTemporaryNeighbors();


      if (
        temporary.length ===
        0
      ) {

        feedback.textContent =
          "Build something around the Queen before checking it.";


        return;

      }


      const neighborAtoms =
        temporary.map(
          function (
            item
          ) {

            return item.cell.symbol;

          }
        );


      const match =
        queenMolecules.find(
          function (
            molecule
          ) {

            return (
              molecule.center ===
              active.symbol
              &&
              normalizeAtomList(
                molecule.neighbors
              )
              ===
              normalizeAtomList(
                neighborAtoms
              )
            );

          }
        );


      if (
        !match
      ) {

        feedback.textContent =
          "🐝 That is not a recognized molecule yet. Rearrange the atoms or keep experimenting.";


        discovery.classList.remove(
          "visible"
        );


        return;

      }


      temporary.forEach(
        function (
          item
        ) {

          item.cell.locked =
            true;

        }
      );


      queenCorrectCount++;


      trackBeeEvent(
        "challenge_completed",
        "queen_bee",
        {

          molecule_name:
            match.name,

          formula:
            match.formula,

          correct_builds:
            queenCorrectCount,

          center_atom:
            active.symbol

        }
      );


      feedback.textContent =
        "👑 Correct — "
        +
        match.name
        +
        " • "
        +
        match.formula
        +
        "!";


      discovery.innerHTML =
        "<strong>"
        +
        match.name
        +
        " • "
        +
        match.formula
        +
        "</strong>"
        +
        "<br><br>"
        +
        match.info
        +
        "<br><br>"
        +
        "Your atoms are now part of the hive."
        +
        "<br>"
        +
        "Tap any completed atom to make it the new Queen and continue growing.";


      discovery.classList.add(
        "visible"
      );


      renderQueenBoard();


      updateQueenStatus();


      updateQueenFormula();

    }
  );



/* ==========================================================
   QUEEN STATUS
========================================================== */

function updateQueenStatus() {

  const active =
    getQueenActiveData();


  document
    .getElementById(
      "queenCorrectCount"
    )
    .textContent =
      queenCorrectCount;


  document
    .getElementById(
      "queenActiveAtom"
    )
    .textContent =
      active
      ?
        active.symbol
      :
        "—";


  if (
    active
  ) {

    document
      .getElementById(
        "queenBuildMessage"
      )
      .textContent =
        "Build freely around "
        +
        (
          elementNames[
            active.symbol
          ]
          ||
          active.symbol
        )
        +
        ". Self-check whenever you think you've made a valid molecule.";

  }

}



/* ==========================================================
   CLEAR QUEEN ATTEMPT
========================================================== */

document
  .getElementById(
    "queenClearBuild"
  )
  .addEventListener(
    "click",
    function () {

      const temporary =
        getQueenTemporaryNeighbors();


      temporary.forEach(
        function (
          item
        ) {

          queenCells.delete(
            item.key
          );

        }
      );


      renderQueenBoard();


      updateQueenFormula();


      document
        .getElementById(
          "queenFeedback"
        )
        .textContent =
          "Current attempt cleared. Your completed hive remains.";


      document
        .getElementById(
          "queenDiscovery"
        )
        .classList
        .remove(
          "visible"
        );

    }
  );



document
  .getElementById(
    "queenReset"
  )
  .addEventListener(
    "click",
    function () {

      buildQueenBoard();

    }
  );



/* ==========================================================
   WORKER BEE
========================================================== */

const workerChallenges = [


  {

    name:
      "Helium-4",

    protons:
      2,

    neutrons:
      2,

    electrons:
      2

  },


  {

    name:
      "Lithium-7",

    protons:
      3,

    neutrons:
      4,

    electrons:
      3

  },


  {

    name:
      "Beryllium-9",

    protons:
      4,

    neutrons:
      5,

    electrons:
      4

  },


  {

    name:
      "Carbon-12",

    protons:
      6,

    neutrons:
      6,

    electrons:
      6

  }


];



let workerIndex =
  0;


let workerProtons =
  0;


let workerNeutrons =
  0;


let workerElectrons =
  0;



document
  .querySelectorAll(
    ".particle-source"
  )
  .forEach(
    function (
      source
    ) {

      registerDrag(
        source,
        {

          game:
            "worker",

          particle:
            source.dataset.particle

        }
      );

    }
  );



function loadWorker() {

  workerProtons =
    0;


  workerNeutrons =
    0;


  workerElectrons =
    0;


  document
    .getElementById(
      "workerPrompt"
    )
    .textContent =
      "Build "
      +
      workerChallenges[
        workerIndex
      ].name
      +
      ".";


  document
    .getElementById(
      "workerFeedback"
    )
    .textContent =
      "";


  document
    .getElementById(
      "nucleusParticles"
    )
    .innerHTML =
      "";


  document
    .getElementById(
      "innerParticles"
    )
    .innerHTML =
      "";


  document
    .getElementById(
      "outerParticles"
    )
    .innerHTML =
      "";


  updateWorkerCounts();

}



function updateWorkerCounts() {

  document
    .getElementById(
      "protonCount"
    )
    .textContent =
      workerProtons;


  document
    .getElementById(
      "neutronCount"
    )
    .textContent =
      workerNeutrons;

}



function placeWorkerParticle(
  particle,
  target
) {

  trackModeStart(
    "worker_bee"
  );


  if (
    particle ===
    "proton"
  ) {

    if (
      target.id !==
      "nucleus"
    ) {

      return;

    }


    workerProtons++;


    addNucleusParticle(
      "p⁺",
      "proton-particle"
    );

  }


  if (
    particle ===
    "neutron"
  ) {

    if (
      target.id !==
      "nucleus"
    ) {

      return;

    }


    workerNeutrons++;


    addNucleusParticle(
      "n⁰",
      "neutron-particle"
    );

  }


  if (
    particle ===
    "electron"
  ) {

    workerElectrons++;


    addElectronParticle(
      target
    );

  }


  updateWorkerCounts();

}



function addNucleusParticle(
  text,
  className
) {

  const layer =
    document.getElementById(
      "nucleusParticles"
    );


  const particle =
    document.createElement(
      "span"
    );


  particle.className =
    "placed-particle "
    +
    className;


  particle.textContent =
    text;


  const index =
    layer.children.length;


  const angle =
    index *
    2.3;


  const radius =
    35;


  particle.style.left =
    (
      58
      +
      Math.cos(
        angle
      )
      *
      radius
    )
    +
    "px";


  particle.style.top =
    (
      58
      +
      Math.sin(
        angle
      )
      *
      radius
    )
    +
    "px";


  layer.appendChild(
    particle
  );

}



function addElectronParticle(
  shell
) {

  const layer =
    shell.querySelector(
      ".particle-layer"
    );


  const particle =
    document.createElement(
      "span"
    );


  particle.className =
    "placed-particle electron-particle";


  particle.textContent =
    "e⁻";


  const index =
    layer.children.length;


  const angle =
    index *
    (
      Math.PI /
      3
    );


  const radius =
    shell.clientWidth /
    2
    -
    22;


  particle.style.left =
    (
      shell.clientWidth /
      2
      +
      Math.cos(
        angle
      )
      *
      radius
      -
      14
    )
    +
    "px";


  particle.style.top =
    (
      shell.clientHeight /
      2
      +
      Math.sin(
        angle
      )
      *
      radius
      -
      14
    )
    +
    "px";


  layer.appendChild(
    particle
  );

}



document
  .getElementById(
    "workerReset"
  )
  .addEventListener(
    "click",
    loadWorker
  );



document
  .getElementById(
    "workerCheck"
  )
  .addEventListener(
    "click",
    function () {

      trackModeStart(
        "worker_bee"
      );


      const challenge =
        workerChallenges[
          workerIndex
        ];


      if (
        workerProtons ===
        challenge.protons
        &&
        workerNeutrons ===
        challenge.neutrons
        &&
        workerElectrons ===
        challenge.electrons
      ) {

        document
          .getElementById(
            "workerFeedback"
          )
          .textContent =
            "🔧 Correct — "
            +
            challenge.name
            +
            "!";


        trackBeeEvent(
          "challenge_completed",
          "worker_bee",
          {

            challenge_name:
              challenge.name,

            challenge_index:
              workerIndex +
              1

          }
        );


        setTimeout(
          function () {

            workerIndex =
              (
                workerIndex +
                1
              )
              %
              workerChallenges.length;


            loadWorker();

          },

          1000
        );

      }

      else {

        document
          .getElementById(
            "workerFeedback"
          )
          .textContent =
            challenge.name
            +
            " needs "
            +
            challenge.protons
            +
            " protons, "
            +
            challenge.neutrons
            +
            " neutrons and "
            +
            challenge.electrons
            +
            " electrons.";

      }

    }
  );



/* ==========================================================
   POLLINATION
========================================================== */

const pollinationChallenges = [


  {

    name:
      "Sodium Chloride",

    formula:
      "NaCl",

    cation:
      "Na⁺",

    anion:
      "Cl⁻",

    cationCount:
      1,

    anionCount:
      1

  },


  {

    name:
      "Magnesium Chloride",

    formula:
      "MgCl₂",

    cation:
      "Mg²⁺",

    anion:
      "Cl⁻",

    cationCount:
      1,

    anionCount:
      2

  },


  {

    name:
      "Sodium Oxide",

    formula:
      "Na₂O",

    cation:
      "Na⁺",

    anion:
      "O²⁻",

    cationCount:
      2,

    anionCount:
      1

  },


  {

    name:
      "Calcium Fluoride",

    formula:
      "CaF₂",

    cation:
      "Ca²⁺",

    anion:
      "F⁻",

    cationCount:
      1,

    anionCount:
      2

  },


  {

    name:
      "Aluminum Oxide",

    formula:
      "Al₂O₃",

    cation:
      "Al³⁺",

    anion:
      "O²⁻",

    cationCount:
      2,

    anionCount:
      3

  },


  {

    name:
      "Lithium Nitride",

    formula:
      "Li₃N",

    cation:
      "Li⁺",

    anion:
      "N³⁻",

    cationCount:
      3,

    anionCount:
      1

  }


];



let pollinationIndex =
  0;


let cationDelivered =
  0;


let anionDelivered =
  0;



function loadPollination() {

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  cationDelivered =
    0;


  anionDelivered =
    0;


  document
    .getElementById(
      "pollinationPrompt"
    )
    .textContent =
      "Grow "
      +
      challenge.name
      +
      ".";


  document
    .getElementById(
      "pollinationFeedback"
    )
    .textContent =
      "";


  const pollenBank =
    document.getElementById(
      "pollenBank"
    );


  pollenBank.innerHTML =
    "";


  const pollenOptions = [

    challenge.cation,
    challenge.cation,
    challenge.cation,

    challenge.anion,
    challenge.anion,
    challenge.anion,

    "K⁺",
    "Br⁻"

  ];


  pollenOptions.forEach(
    function (
      ion,
      index
    ) {

      const pollen =
        document.createElement(
          "button"
        );


      pollen.type =
        "button";


      pollen.className =
        "pollen";


      pollen.textContent =
        ion;


      pollen.dataset.sourceId =
        "pollen-"
        +
        index;


      registerDrag(
        pollen,
        {

          game:
            "pollination",

          ion:
            ion

        }
      );


      pollenBank.appendChild(
        pollen
      );

    }
  );


  const garden =
    document.getElementById(
      "flowerGarden"
    );


  garden.innerHTML =
    "";


  const flowers = [


    {

      ion:
        challenge.cation,

      role:
        "cation"

    },


    {

      ion:
        challenge.anion,

      role:
        "anion"

    },


    {

      ion:
        "K⁺",

      role:
        "distractor"

    },


    {

      ion:
        "Br⁻",

      role:
        "distractor"

    }


  ];


  flowers.forEach(
    function (
      data,
      index
    ) {

      const flower =
        document.createElement(
          "div"
        );


      flower.className =
        "flower";


      flower.dataset.flowerIon =
        data.ion;


      flower.dataset.role =
        data.role;


      flower.innerHTML =
        '<div class="flower-emoji">'
        +
        (
          index %
          2 ===
          0
          ?
            "🌼"
          :
            "🌸"
        )
        +
        '</div>'
        +
        '<strong>'
        +
        data.ion
        +
        '</strong>'
        +
        '<div class="flower-count">'
        +
        '0 pollen'
        +
        '</div>';


      garden.appendChild(
        flower
      );

    }
  );


  const preview =
    document.getElementById(
      "pollinationFormula"
    );


  preview.textContent =
    "Grow an ionic compound";


  preview.classList.add(
    "empty"
  );

}



/* ==========================================================
   POLLINATE
========================================================== */

function pollinate(
  source,
  ion,
  flower
) {

  trackModeStart(
    "pollination"
  );


  if (
    flower.dataset.flowerIon !==
    ion
  ) {

    document
      .getElementById(
        "pollinationFeedback"
      )
      .textContent =
        ion
        +
        " pollen does not match the "
        +
        flower.dataset.flowerIon
        +
        " flower.";


    return;

  }


  if (
    flower.dataset.role ===
    "distractor"
  ) {

    document
      .getElementById(
        "pollinationFeedback"
      )
      .textContent =
        "That flower is not part of this compound.";


    return;

  }


  if (
    flower.dataset.role ===
    "cation"
  ) {

    cationDelivered++;

  }


  if (
    flower.dataset.role ===
    "anion"
  ) {

    anionDelivered++;

  }


  source.style.visibility =
    "hidden";


  const count =
    flower.querySelector(
      ".flower-count"
    );


  count.textContent =
    (
      flower.dataset.role ===
      "cation"
      ?
        cationDelivered
      :
        anionDelivered
    )
    +
    " pollen";


  updatePollinationFormula();

}



/* ==========================================================
   POLLINATION FORMULA
========================================================== */

function updatePollinationFormula() {

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  const preview =
    document.getElementById(
      "pollinationFormula"
    );


  if (
    cationDelivered ===
    challenge.cationCount
    &&
    anionDelivered ===
    challenge.anionCount
  ) {

    preview.textContent =
      challenge.formula;

  }

  else {

    preview.textContent =
      cationDelivered
      +
      " × "
      +
      challenge.cation
      +
      "   +   "
      +
      anionDelivered
      +
      " × "
      +
      challenge.anion;

  }


  preview.classList.remove(
    "empty"
  );

}



document
  .getElementById(
    "pollinationReset"
  )
  .addEventListener(
    "click",
    loadPollination
  );



document
  .getElementById(
    "pollinationCheck"
  )
  .addEventListener(
    "click",
    function () {

      trackModeStart(
        "pollination"
      );


      const challenge =
        pollinationChallenges[
          pollinationIndex
        ];


      if (
        cationDelivered ===
        challenge.cationCount
        &&
        anionDelivered ===
        challenge.anionCount
      ) {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "🌼🐝 Charges balanced — "
            +
            challenge.name
            +
            "!";


        trackBeeEvent(
          "challenge_completed",
          "pollination",
          {

            challenge_name:
              challenge.name,

            formula:
              challenge.formula,

            challenge_index:
              pollinationIndex +
              1

          }
        );


        setTimeout(
          function () {

            pollinationIndex =
              (
                pollinationIndex +
                1
              )
              %
              pollinationChallenges.length;


            loadPollination();

          },

          1200
        );

      }

      else {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "The ion ratio does not balance the charge yet.";

      }

    }
  );



/* ==========================================================
   BUZZWORD SHARE
========================================================== */

document
  .getElementById(
    "shareBuzz"
  )
  .addEventListener(
    "click",
    async function () {

      trackModeStart(
        "buzzword"
      );


      const status =
        buzzwordCompleted
        ?
          "✅ Weekly Buzzword complete"
        :
          buzzFound.length
          +
          "/"
          +
          buzzAnswers.length
          +
          " compounds found";


      const text =
        "🐝 MOLECULAR BEE • WEEKLY BUZZWORD #"
        +
        BUZZWORD_NUMBER
        +
        "\n\n"
        +
        status
        +
        "\n"
        +
        (
          moleculargramTracked
          ?
            "👑 MOLECULARGRAM earned"
          :
            ""
        )
        +
        "\n\nHow many can you find?"
        +
        "\n\nPAT Learning Lab";


      try {

        if (
          navigator.share
        ) {

          await navigator.share(
            {

              title:
                "Molecular Bee Weekly Buzzword",

              text:
                text,

              url:
                window.location.href

            }
          );


          trackBeeEvent(
            "puzzle_shared",
            "buzzword",
            {

              puzzle_number:
                BUZZWORD_NUMBER,

              compounds_found:
                buzzFound.length,

              moleculargram:
                moleculargramTracked,

              completed:
                buzzwordCompleted,

              share_method:
                "native"

            }
          );

        }

        else {

          await navigator
            .clipboard
            .writeText(
              text
              +
              "\n"
              +
              window.location.href
            );


          trackBeeEvent(
            "puzzle_shared",
            "buzzword",
            {

              puzzle_number:
                BUZZWORD_NUMBER,

              compounds_found:
                buzzFound.length,

              moleculargram:
                moleculargramTracked,

              completed:
                buzzwordCompleted,

              share_method:
                "clipboard"

            }
          );

        }

      }

      catch (
        error
      ) {

        console.log(
          "Share cancelled."
        );

      }

    }
  );



/* ==========================================================
   PROFILE UPDATE
========================================================== */

window.addEventListener(
  "pat-profile-updated",
  function () {

    refreshBeeProfile();

  }
);



/* ==========================================================
   START
========================================================== */

renderBuzz();


renderBuzzFound();


loadSpelling();


buildQueenBoard();


loadWorker();


loadPollination();


refreshBeeProfile();


});
