document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   PLAYER
========================================================== */

let player =
  JSON.parse(
    localStorage.getItem(
      "molecularBeePlayer"
    )
  )

  ||

  {
    xp: 0,
    streak: 0
  };


function savePlayer() {

  localStorage.setItem(
    "molecularBeePlayer",
    JSON.stringify(player)
  );

}


function updatePlayerDisplay() {

  document
    .getElementById(
      "xpText"
    )
    .textContent =
      player.xp +
      " XP";


  document
    .getElementById(
      "streakText"
    )
    .textContent =
      player.streak;

}


function rewardPlayer(
  amount
) {

  player.xp +=
    amount;


  player.streak++;


  savePlayer();


  updatePlayerDisplay();

}


function breakStreak() {

  player.streak =
    0;


  savePlayer();


  updatePlayerDisplay();

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

        screen
          .classList
          .remove(
            "active"
          );

      }
    );


  document
    .getElementById(
      id
    )
    .classList
    .add(
      "active"
    );


  window.scrollTo(
    {
      top:
        0,

      behavior:
        "smooth"
    }
  );

}


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

          showScreen(
            button.getAttribute(
              "data-screen"
            )
          );

        }
      );

    }
  );


/* ==========================================================
   HEX CREATOR
========================================================== */

function createHex(
  symbol,
  label
) {

  const hex =
    document.createElement(
      "button"
    );


  hex.type =
    "button";


  hex.className =
    "hex";


  hex.dataset.symbol =
    symbol;


  const strong =
    document.createElement(
      "strong"
    );


  strong.textContent =
    symbol;


  const small =
    document.createElement(
      "small"
    );


  small.textContent =
    label ||
    "Atom";


  hex.appendChild(
    strong
  );


  hex.appendChild(
    small
  );


  return hex;

}


/* ==========================================================
   POINTER DRAG ENGINE
========================================================== */

let activeDrag =
  null;


function makePointerDraggable(
  element,
  payload,
  validTargets,
  onDrop
) {

  let moved =
    false;


  element.addEventListener(
    "pointerdown",
    function (
      event
    ) {

      if (
        element.classList.contains(
          "used"
        )
      ) {

        return;

      }


      moved =
        false;


      event.preventDefault();


      const rect =
        element
          .getBoundingClientRect();


      activeDrag = {

        element:
          element,

        payload:
          payload,

        pointerId:
          event.pointerId,

        offsetX:
          event.clientX -
          rect.left,

        offsetY:
          event.clientY -
          rect.top,

        startX:
          event.clientX,

        startY:
          event.clientY

      };


      try {

        element.setPointerCapture(
          event.pointerId
        );

      }

      catch (
        error
      ) {}


    }
  );


  element.addEventListener(
    "pointermove",
    function (
      event
    ) {

      if (
        !activeDrag ||
        activeDrag.element !==
        element
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
        distance <
        7
      ) {

        return;

      }


      moved =
        true;


      if (
        !element.classList.contains(
          "dragging"
        )
      ) {

        element.classList.add(
          "dragging"
        );

      }


      moveDraggedElement(
        event.clientX,
        event.clientY
      );


      highlightTarget(
        event.clientX,
        event.clientY,
        validTargets
      );

    }
  );


  element.addEventListener(
    "pointerup",
    function (
      event
    ) {

      if (
        !activeDrag ||
        activeDrag.element !==
        element
      ) {

        return;

      }


      if (
        moved
      ) {

        const target =
          findDropTarget(

            event.clientX,
            event.clientY,
            validTargets

          );


        cleanupTargetHighlights();


        element
          .classList
          .remove(
            "dragging"
          );


        element.style.left =
          "";


        element.style.top =
          "";


        if (
          target
        ) {

          onDrop(
            payload,
            target,
            element
          );

        }

      }


      activeDrag =
        null;

    }
  );


  return function () {

    return moved;

  };

}


function moveDraggedElement(
  x,
  y
) {

  if (
    !activeDrag
  ) {

    return;

  }


  activeDrag.element.style.left =
    (
      x -
      activeDrag.offsetX
    )
    +
    "px";


  activeDrag.element.style.top =
    (
      y -
      activeDrag.offsetY
    )
    +
    "px";

}


function findDropTarget(
  x,
  y,
  selector
) {

  const elements =
    document.querySelectorAll(
      selector
    );


  for (
    let i = 0;
    i <
    elements.length;
    i++
  ) {

    const element =
      elements[i];


    if (
      element.classList.contains(
        "filled"
      )
    ) {

      continue;

    }


    const rect =
      element
        .getBoundingClientRect();


    if (
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
    ) {

      return element;

    }

  }


  return null;

}


function highlightTarget(
  x,
  y,
  selector
) {

  cleanupTargetHighlights();


  const target =
    findDropTarget(
      x,
      y,
      selector
    );


  if (
    target
  ) {

    target.classList.add(
      "drop-active"
    );

  }

}


function cleanupTargetHighlights() {

  document
    .querySelectorAll(
      ".drop-active"
    )
    .forEach(
      function (
        element
      ) {

        element.classList.remove(
          "drop-active"
        );

      }
    );

}


/* ==========================================================
   CHEMICAL FORMULA BUILDER

   H H O  -> H₂O
   C O O  -> CO₂
   N H H H -> NH₃
========================================================== */

const subscriptDigits = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉"
};


function toSubscript(
  number
) {

  return String(
    number
  )
    .split(
      ""
    )
    .map(
      function (
        digit
      ) {

        return subscriptDigits[
          digit
        ];

      }
    )
    .join(
      ""
    );

}


function sequenceToFormula(
  sequence
) {

  if (
    sequence.length ===
    0
  ) {

    return "";

  }


  const groups =
    [];


  sequence.forEach(
    function (
      symbol
    ) {

      const last =
        groups[
          groups.length -
          1
        ];


      if (
        last &&
        last.symbol ===
        symbol
      ) {

        last.count++;

      }

      else {

        groups.push(
          {
            symbol:
              symbol,

            count:
              1
          }
        );

      }

    }
  );


  return groups
    .map(
      function (
        group
      ) {

        return (
          group.symbol
          +
          (
            group.count >
            1

              ?
                toSubscript(
                  group.count
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
   SPELLING-BEE
========================================================== */

const spellingChallenges = [

  {
    name:
      "water",

    formula:
      "H₂O",

    required:
      [
        "H",
        "H",
        "O"
      ],

    tiles:
      [
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

    formula:
      "CO₂",

    required:
      [
        "C",
        "O",
        "O"
      ],

    tiles:
      [
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

    formula:
      "NH₃",

    required:
      [
        "N",
        "H",
        "H",
        "H"
      ],

    tiles:
      [
        "N",
        "H",
        "H",
        "H",
        "O"
      ]
  },


  {
    name:
      "methane",

    formula:
      "CH₄",

    required:
      [
        "C",
        "H",
        "H",
        "H",
        "H"
      ],

    tiles:
      [
        "C",
        "H",
        "H",
        "H",
        "H",
        "O"
      ]
  },


  {
    name:
      "hydrogen peroxide",

    formula:
      "H₂O₂",

    required:
      [
        "H",
        "H",
        "O",
        "O"
      ],

    tiles:
      [
        "H",
        "H",
        "O",
        "O",
        "C"
      ]
  }

];


let spellingIndex =
  0;


const spellingPrompt =
  document.getElementById(
    "spellingPrompt"
  );


const spellingTiles =
  document.getElementById(
    "spellingTiles"
  );


const spellingBuildZone =
  document.getElementById(
    "spellingBuild"
  );


const spellingFeedback =
  document.getElementById(
    "spellingFeedback"
  );


let formulaPreview =
  null;


function buildSpellingGrid() {

  spellingBuildZone.innerHTML =
    "";


  spellingBuildZone.classList.add(
    "honey-grid"
  );


  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const slot =
      document.createElement(
        "div"
      );


    slot.className =
      "honey-slot";


    slot.dataset.slot =
      i;


    spellingBuildZone.appendChild(
      slot
    );

  }


  formulaPreview =
    document.createElement(
      "div"
    );


  formulaPreview.className =
    "formula-preview empty";


  formulaPreview.textContent =
    "Chemical formula will appear here";


  spellingBuildZone
    .parentNode
    .insertBefore(
      formulaPreview,
      spellingBuildZone.nextSibling
    );

}


function getSpellingSequence() {

  return Array.from(
    spellingBuildZone
      .querySelectorAll(
        ".honey-slot.filled"
      )
  )
  .sort(
    function (
      a,
      b
    ) {

      return Number(
        a.dataset.slot
      )
      -
      Number(
        b.dataset.slot
      );

    }
  )
  .map(
    function (
      slot
    ) {

      return slot.dataset.symbol;

    }
  );

}


function updateFormulaPreview() {

  const sequence =
    getSpellingSequence();


  if (
    sequence.length ===
    0
  ) {

    formulaPreview.textContent =
      "Chemical formula will appear here";


    formulaPreview.classList.add(
      "empty"
    );


    formulaPreview.classList.remove(
      "correct"
    );


    return;

  }


  formulaPreview.textContent =
    sequenceToFormula(
      sequence
    );


  formulaPreview.classList.remove(
    "empty"
  );


  formulaPreview.classList.remove(
    "correct"
  );

}


function placeSpellingAtom(
  symbol,
  slot
) {

  if (
    slot.classList.contains(
      "filled"
    )
  ) {

    return false;

  }


  const hex =
    createHex(
      symbol,
      "Atom"
    );


  hex.style.cursor =
    "default";


  hex.style.touchAction =
    "auto";


  slot.classList.add(
    "filled"
  );


  slot.dataset.symbol =
    symbol;


  slot.appendChild(
    hex
  );


  updateFormulaPreview();


  return true;

}


function renderSpellingTiles() {

  spellingTiles.innerHTML =
    "";


  const challenge =
    spellingChallenges[
      spellingIndex
    ];


  challenge.tiles.forEach(
    function (
      symbol
    ) {

      const hex =
        createHex(
          symbol,
          "Atom"
        );


      let pointerMoved =
        false;


      hex.addEventListener(
        "pointerdown",
        function () {

          pointerMoved =
            false;

        }
      );


      hex.addEventListener(
        "pointermove",
        function () {

          pointerMoved =
            true;

        }
      );


      makePointerDraggable(

        hex,

        symbol,

        "#spellingBuild .honey-slot",

        function (
          payload,
          target,
          source
        ) {

          if (
            placeSpellingAtom(
              payload,
              target
            )
          ) {

            source.remove();

          }

        }

      );


      hex.addEventListener(
        "click",
        function () {

          if (
            pointerMoved
          ) {

            return;

          }


          const empty =
            spellingBuildZone
              .querySelector(
                ".honey-slot:not(.filled)"
              );


          if (
            !empty
          ) {

            return;

          }


          if (
            placeSpellingAtom(
              symbol,
              empty
            )
          ) {

            hex.remove();

          }

        }
      );


      spellingTiles.appendChild(
        hex
      );

    }
  );

}


function loadSpellingChallenge() {

  if (
    formulaPreview
  ) {

    formulaPreview.remove();

  }


  const challenge =
    spellingChallenges[
      spellingIndex
    ];


  spellingPrompt.textContent =
    "Spell "
    +
    challenge.name
    +
    " using the honeycomb atoms.";


  spellingFeedback.textContent =
    "";


  buildSpellingGrid();


  renderSpellingTiles();

}


document
  .getElementById(
    "spellingBackspace"
  )
  .addEventListener(
    "click",
    function () {

      const filled =
        Array.from(
          spellingBuildZone
            .querySelectorAll(
              ".honey-slot.filled"
            )
        );


      if (
        filled.length ===
        0
      ) {

        return;

      }


      filled.sort(
        function (
          a,
          b
        ) {

          return Number(
            a.dataset.slot
          )
          -
          Number(
            b.dataset.slot
          );

        }
      );


      const last =
        filled[
          filled.length -
          1
        ];


      const symbol =
        last.dataset.symbol;


      last.innerHTML =
        "";


      last.classList.remove(
        "filled"
      );


      delete last.dataset.symbol;


      const replacement =
        createHex(
          symbol,
          "Atom"
        );


      spellingTiles.appendChild(
        replacement
      );


      /*
        Reloading the tile bank here gives
        the restored atom full touch/drag support.
      */

      renderSpellingTiles();


      updateFormulaPreview();

    }
  );


document
  .getElementById(
    "spellingReset"
  )
  .addEventListener(
    "click",
    loadSpellingChallenge
  );


document
  .getElementById(
    "spellingCheck"
  )
  .addEventListener(
    "click",
    function () {

      const challenge =
        spellingChallenges[
          spellingIndex
        ];


      const actual =
        getSpellingSequence();


      if (
        actual.join(
          ""
        )
        ===
        challenge.required.join(
          ""
        )
      ) {

        formulaPreview.textContent =
          challenge.formula;


        formulaPreview.classList.remove(
          "empty"
        );


        formulaPreview.classList.add(
          "correct"
        );


        spellingFeedback.textContent =
          "✓ Correct! The honeycomb collapses into "
          +
          challenge.formula
          +
          ".";


        rewardPlayer(
          10
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


            loadSpellingChallenge();

          },
          1400
        );

      }

      else {

        spellingFeedback.textContent =
          "Not quite. Check the atom order and subscripts.";


        breakStreak();

      }

    }
  );


/* ==========================================================
   QUEEN-BEE
========================================================== */

const queenChallenges = [

  {
    central:
      "O",

    name:
      "water",

    molecule:
      "H₂O",

    required:
      [
        "H",
        "H"
      ],

    tiles:
      [
        "H",
        "H",
        "C",
        "Na"
      ]
  },


  {
    central:
      "C",

    name:
      "carbon dioxide",

    molecule:
      "CO₂",

    required:
      [
        "O",
        "O"
      ],

    tiles:
      [
        "O",
        "O",
        "H",
        "N"
      ]
  },


  {
    central:
      "N",

    name:
      "ammonia",

    molecule:
      "NH₃",

    required:
      [
        "H",
        "H",
        "H"
      ],

    tiles:
      [
        "H",
        "H",
        "H",
        "O"
      ]
  }

];


let queenIndex =
  0;


const queenPrompt =
  document.getElementById(
    "queenPrompt"
  );


const queenHive =
  document.getElementById(
    "queenHive"
  );


const queenTiles =
  document.getElementById(
    "queenTiles"
  );


const queenElement =
  document.getElementById(
    "queenElement"
  );


const queenFeedback =
  document.getElementById(
    "queenFeedback"
  );


function buildQueenGrid() {

  queenHive.innerHTML =
    "";


  const grid =
    document.createElement(
      "div"
    );


  grid.className =
    "queen-grid";


  for (
    let i = 1;
    i <= 6;
    i++
  ) {

    const slot =
      document.createElement(
        "div"
      );


    slot.className =
      "queen-slot slot-"
      +
      i;


    grid.appendChild(
      slot
    );

  }


  const centerSlot =
    document.createElement(
      "div"
    );


  centerSlot.className =
    "queen-slot center-slot filled";


  const queenHex =
    createHex(

      queenChallenges[
        queenIndex
      ].central,

      "Queen"

    );


  queenHex.classList.add(
    "queen-hex"
  );


  const crown =
    document.createElement(
      "span"
    );


  crown.className =
    "queen-crown";


  crown.textContent =
    "👑";


  queenHex.prepend(
    crown
  );


  centerSlot.appendChild(
    queenHex
  );


  grid.appendChild(
    centerSlot
  );


  queenHive.appendChild(
    grid
  );

}


function placeQueenAtom(
  symbol,
  slot
) {

  if (
    slot.classList.contains(
      "filled"
    )
  ) {

    return false;

  }


  const hex =
    createHex(
      symbol,
      "Bonded"
    );


  hex.style.cursor =
    "default";


  slot.classList.add(
    "filled"
  );


  slot.dataset.symbol =
    symbol;


  slot.appendChild(
    hex
  );


  return true;

}


function renderQueenTiles() {

  queenTiles.innerHTML =
    "";


  const challenge =
    queenChallenges[
      queenIndex
    ];


  challenge.tiles.forEach(
    function (
      symbol
    ) {

      const hex =
        createHex(
          symbol,
          "Worker"
        );


      makePointerDraggable(

        hex,

        symbol,

        "#queenHive .queen-slot:not(.center-slot)",

        function (
          payload,
          target,
          source
        ) {

          if (
            placeQueenAtom(
              payload,
              target
            )
          ) {

            source.remove();

          }

        }

      );


      hex.addEventListener(
        "click",
        function () {

          const empty =
            queenHive
              .querySelector(
                ".queen-slot:not(.center-slot):not(.filled)"
              );


          if (
            !empty
          ) {

            return;

          }


          if (
            placeQueenAtom(
              symbol,
              empty
            )
          ) {

            hex.remove();

          }

        }
      );


      queenTiles.appendChild(
        hex
      );

    }
  );

}


function loadQueenChallenge() {

  const challenge =
    queenChallenges[
      queenIndex
    ];


  queenPrompt.textContent =
    "Build "
    +
    challenge.name
    +
    " ("
    +
    challenge.molecule
    +
    ") around the Queen.";


  queenElement.textContent =
    challenge.central;


  queenFeedback.textContent =
    "";


  buildQueenGrid();


  renderQueenTiles();

}


document
  .getElementById(
    "queenReset"
  )
  .addEventListener(
    "click",
    loadQueenChallenge
  );


document
  .getElementById(
    "queenCheck"
  )
  .addEventListener(
    "click",
    function () {

      const challenge =
        queenChallenges[
          queenIndex
        ];


      const actual =
        Array.from(
          queenHive
            .querySelectorAll(
              ".queen-slot.filled:not(.center-slot)"
            )
        )
        .map(
          function (
            slot
          ) {

            return slot.dataset.symbol;

          }
        )
        .sort();


      const required =
        challenge.required
          .slice()
          .sort();


      if (
        actual.join(
          ""
        )
        ===
        required.join(
          ""
        )
      ) {

        queenFeedback.textContent =
          "✓ Hive complete! "
          +
          challenge.molecule
          +
          " formed.";


        rewardPlayer(
          15
        );


        setTimeout(
          function () {

            queenIndex =
              (
                queenIndex +
                1
              )
              %
              queenChallenges.length;


            loadQueenChallenge();

          },
          1200
        );

      }

      else {

        queenFeedback.textContent =
          "Not quite. Check the atoms surrounding the Queen.";


        breakStreak();

      }

    }
  );


/* ==========================================================
   WORKER-BEE
========================================================== */

const workerChallenges = [

  {
    name:
      "Helium",

    protons:
      2,

    neutrons:
      2,

    electrons:
      2
  },


  {
    name:
      "Lithium",

    protons:
      3,

    neutrons:
      4,

    electrons:
      3
  },


  {
    name:
      "Beryllium",

    protons:
      4,

    neutrons:
      5,

    electrons:
      4
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


const workerPrompt =
  document.getElementById(
    "workerPrompt"
  );


const workerFeedback =
  document.getElementById(
    "workerFeedback"
  );


function updateWorkerDisplay() {

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


  document
    .getElementById(
      "innerElectronCount"
    )
    .textContent =
      Math.min(
        workerElectrons,
        2
      );


  document
    .getElementById(
      "outerElectronCount"
    )
    .textContent =
      Math.max(
        workerElectrons -
        2,
        0
      );

}


function loadWorkerChallenge() {

  workerProtons =
    0;


  workerNeutrons =
    0;


  workerElectrons =
    0;


  const challenge =
    workerChallenges[
      workerIndex
    ];


  workerPrompt.textContent =
    "Build a neutral "
    +
    challenge.name
    +
    " atom.";


  workerFeedback.textContent =
    "";


  updateWorkerDisplay();

}


document
  .getElementById(
    "addProton"
  )
  .addEventListener(
    "click",
    function () {

      workerProtons++;


      updateWorkerDisplay();

    }
  );


document
  .getElementById(
    "addNeutron"
  )
  .addEventListener(
    "click",
    function () {

      workerNeutrons++;


      updateWorkerDisplay();

    }
  );


document
  .getElementById(
    "addElectron"
  )
  .addEventListener(
    "click",
    function () {

      workerElectrons++;


      updateWorkerDisplay();

    }
  );


document
  .getElementById(
    "workerReset"
  )
  .addEventListener(
    "click",
    loadWorkerChallenge
  );


document
  .getElementById(
    "workerCheck"
  )
  .addEventListener(
    "click",
    function () {

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

        workerFeedback.textContent =
          "✓ Atom built correctly.";


        rewardPlayer(
          15
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


            loadWorkerChallenge();

          },
          1100
        );

      }

      else {

        workerFeedback.textContent =
          "Not quite. Check the nucleus and electron count.";


        breakStreak();

      }

    }
  );


/* ==========================================================
   POLLINATION

   12 DIFFERENT IONIC COMPOUNDS
========================================================== */

const pollinationChallenges = [

  {
    flower:
      "Cl⁻",

    pollen:
      "Na⁺",

    neededPollen:
      1,

    formula:
      "NaCl",

    name:
      "sodium chloride",

    available:
      4
  },


  {
    flower:
      "O²⁻",

    pollen:
      "Na⁺",

    neededPollen:
      2,

    formula:
      "Na₂O",

    name:
      "sodium oxide",

    available:
      4
  },


  {
    flower:
      "S²⁻",

    pollen:
      "K⁺",

    neededPollen:
      2,

    formula:
      "K₂S",

    name:
      "potassium sulfide",

    available:
      4
  },


  {
    flower:
      "N³⁻",

    pollen:
      "Li⁺",

    neededPollen:
      3,

    formula:
      "Li₃N",

    name:
      "lithium nitride",

    available:
      5
  },


  {
    flower:
      "Mg²⁺",

    pollen:
      "Cl⁻",

    neededPollen:
      2,

    formula:
      "MgCl₂",

    name:
      "magnesium chloride",

    available:
      4
  },


  {
    flower:
      "Ca²⁺",

    pollen:
      "F⁻",

    neededPollen:
      2,

    formula:
      "CaF₂",

    name:
      "calcium fluoride",

    available:
      4
  },


  {
    flower:
      "Al³⁺",

    pollen:
      "Cl⁻",

    neededPollen:
      3,

    formula:
      "AlCl₃",

    name:
      "aluminum chloride",

    available:
      5
  },


  {
    flower:
      "Mg²⁺",

    pollen:
      "O²⁻",

    neededPollen:
      1,

    formula:
      "MgO",

    name:
      "magnesium oxide",

    available:
      4
  },


  {
    flower:
      "Ca²⁺",

    pollen:
      "O²⁻",

    neededPollen:
      1,

    formula:
      "CaO",

    name:
      "calcium oxide",

    available:
      4
  },


  {
    flower:
      "Al³⁺",

    pollen:
      "N³⁻",

    neededPollen:
      1,

    formula:
      "AlN",

    name:
      "aluminum nitride",

    available:
      4
  },


  {
    flower:
      "Br⁻",

    pollen:
      "K⁺",

    neededPollen:
      1,

    formula:
      "KBr",

    name:
      "potassium bromide",

    available:
      4
  },


  {
    flower:
      "I⁻",

    pollen:
      "Li⁺",

    neededPollen:
      1,

    formula:
      "LiI",

    name:
      "lithium iodide",

    available:
      4
  }

];


let pollinationIndex =
  0;


let delivered =
  [];


const pollenBank =
  document.getElementById(
    "pollenBank"
  );


const flowerTarget =
  document.getElementById(
    "flowerTarget"
  );


const flowerIon =
  document.getElementById(
    "flowerIon"
  );


const deliveredPollen =
  document.getElementById(
    "deliveredPollen"
  );


const pollinationPrompt =
  document.getElementById(
    "pollinationPrompt"
  );


const pollinationFeedback =
  document.getElementById(
    "pollinationFeedback"
  );


const pollinationResult =
  document.getElementById(
    "pollinationResult"
  );


function renderPollenBank() {

  pollenBank.innerHTML =
    "";


  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  for (
    let i = 0;
    i <
    challenge.available;
    i++
  ) {

    const pollen =
      document.createElement(
        "button"
      );


    pollen.type =
      "button";


    pollen.className =
      "pollen-piece";


    pollen.textContent =
      challenge.pollen;


    makePointerDraggable(

      pollen,

      challenge.pollen,

      "#flowerTarget",

      function (
        payload,
        target,
        source
      ) {

        deliverPollen(
          payload
        );


        source.classList.add(
          "used"
        );

      }

    );


    pollen.addEventListener(
      "click",
      function () {

        if (
          pollen.classList.contains(
            "used"
          )
        ) {

          return;

        }


        deliverPollen(
          challenge.pollen
        );


        pollen.classList.add(
          "used"
        );

      }
    );


    pollenBank.appendChild(
      pollen
    );

  }

}


function deliverPollen(
  symbol
) {

  delivered.push(
    symbol
  );


  renderDelivered();

}


function renderDelivered() {

  deliveredPollen.innerHTML =
    "";


  delivered.forEach(
    function (
      symbol
    ) {

      const token =
        document.createElement(
          "span"
        );


      token.className =
        "delivered-token";


      token.textContent =
        symbol;


      deliveredPollen.appendChild(
        token
      );

    }
  );

}


function loadPollinationChallenge() {

  delivered =
    [];


  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  flowerIon.textContent =
    challenge.flower;


  pollinationPrompt.textContent =
    "Pollinate "
    +
    challenge.flower
    +
    " with enough "
    +
    challenge.pollen
    +
    " to grow "
    +
    challenge.name
    +
    ".";


  pollinationFeedback.textContent =
    "";


  pollinationResult.textContent =
    "";


  renderDelivered();


  renderPollenBank();

}


document
  .getElementById(
    "pollinationReset"
  )
  .addEventListener(
    "click",
    loadPollinationChallenge
  );


document
  .getElementById(
    "pollinationCheck"
  )
  .addEventListener(
    "click",
    function () {

      const challenge =
        pollinationChallenges[
          pollinationIndex
        ];


      if (
        delivered.length ===
        challenge.neededPollen
      ) {

        pollinationResult.textContent =
          "🌼 "
          +
          challenge.formula;


        pollinationFeedback.textContent =
          "✓ Charges balance. "
          +
          challenge.name
          +
          " formed.";


        rewardPlayer(
          15
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


            loadPollinationChallenge();

          },
          1400
        );

      }

      else {

        const difference =
          challenge.neededPollen -
          delivered.length;


        if (
          difference >
          0
        ) {

          pollinationFeedback.textContent =
            "Charge mismatch. Add "
            +
            difference
            +
            " more pollen piece"
            +
            (
              difference ===
              1

                ?
                  "."

                :
                  "s."
            );

        }

        else {

          pollinationFeedback.textContent =
            "Too much charge. Reset and try fewer pollen pieces.";

        }


        breakStreak();

      }

    }
  );


/* ==========================================================
   START
========================================================== */

updatePlayerDisplay();


loadSpellingChallenge();


loadQueenChallenge();


loadWorkerChallenge();


loadPollinationChallenge();


});
