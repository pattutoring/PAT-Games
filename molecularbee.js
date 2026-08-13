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
    .getElementById("xpText")
    .textContent =
      player.xp +
      " XP";


  document
    .getElementById("streakText")
    .textContent =
      player.streak;

}


function rewardPlayer(amount) {

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

function showScreen(id) {

  document
    .querySelectorAll(
      ".screen"
    )
    .forEach(
      function (screen) {

        screen.classList.remove(
          "active"
        );

      }
    );


  document
    .getElementById(id)
    .classList.add(
      "active"
    );


  window.scrollTo(
    {
      top: 0,
      behavior: "smooth"
    }
  );

}


document
  .querySelectorAll(
    "[data-screen]"
  )
  .forEach(
    function (button) {

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
   GENERIC HEX CREATOR
========================================================== */

function createHex(
  symbol,
  label,
  data
) {

  const hex =
    document.createElement(
      "button"
    );


  hex.type =
    "button";


  hex.className =
    "hex";


  hex.draggable =
    true;


  hex.dataset.symbol =
    symbol;


  if (
    data
  ) {

    Object.keys(data)
      .forEach(
        function (key) {

          hex.dataset[key] =
            data[key];

        }
      );

  }


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
   DRAG STATE
========================================================== */

let draggedPayload =
  null;


function setDragPayload(
  type,
  payload
) {

  draggedPayload = {
    type: type,
    payload: payload
  };

}


/* ==========================================================
   SPELLING BEE
========================================================== */

const spellingChallenges = [

  {
    name:
      "water",

    formula:
      "H₂O",

    sequence:
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

    sequence:
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

    sequence:
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
        "O",
        "C"
      ]
  },

  {
    name:
      "methane",

    formula:
      "CH₄",

    sequence:
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
  }

];


let spellingIndex =
  0;


let spellingBuild =
  [];


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


function addSpellingAtom(
  symbol
) {

  spellingBuild.push(
    symbol
  );


  renderSpellingBuild();

}


function renderSpellingBuild() {

  spellingBuildZone.innerHTML =
    "";


  if (
    spellingBuild.length ===
    0
  ) {

    spellingBuildZone.innerHTML =
      "<em>Build the molecular hive here.</em>";

    return;

  }


  spellingBuild.forEach(
    function (symbol) {

      const hex =
        createHex(
          symbol,
          "Placed"
        );


      hex.draggable =
        false;


      hex.style.cursor =
        "default";


      spellingBuildZone.appendChild(
        hex
      );

    }
  );

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
      symbol,
      index
    ) {

      const hex =
        createHex(
          symbol,
          "Atom",
          {
            index: index
          }
        );


      hex.addEventListener(
        "click",
        function () {

          addSpellingAtom(
            symbol
          );

        }
      );


      hex.addEventListener(
        "dragstart",
        function () {

          setDragPayload(
            "spelling",
            symbol
          );

        }
      );


      spellingTiles.appendChild(
        hex
      );

    }
  );

}


spellingBuildZone.addEventListener(
  "dragover",
  function (event) {

    event.preventDefault();

  }
);


spellingBuildZone.addEventListener(
  "drop",
  function (event) {

    event.preventDefault();


    if (
      draggedPayload &&
      draggedPayload.type ===
      "spelling"
    ) {

      addSpellingAtom(
        draggedPayload.payload
      );

    }

  }
);


function loadSpellingChallenge() {

  spellingBuild =
    [];


  const challenge =
    spellingChallenges[
      spellingIndex
    ];


  spellingPrompt.textContent =
    "Spell " +
    challenge.name +
    " using the honeycomb atoms.";


  spellingFeedback.textContent =
    "";


  renderSpellingBuild();

  renderSpellingTiles();

}


document
  .getElementById(
    "spellingBackspace"
  )
  .addEventListener(
    "click",
    function () {

      spellingBuild.pop();

      renderSpellingBuild();

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


      const guess =
        spellingBuild.join(
          ""
        );


      const answer =
        challenge.sequence.join(
          ""
        );


      if (
        guess ===
        answer
      ) {

        spellingFeedback.textContent =
          "✓ Correct! The hive collapses into " +
          challenge.formula +
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
          1200
        );

      }

      else {

        spellingFeedback.textContent =
          "Not quite. Check how many of each atom belong in the molecule.";


        breakStreak();

      }

    }
  );


/* ==========================================================
   QUEEN BEE
========================================================== */

const queenChallenges = [

  {
    central:
      "O",

    molecule:
      "H₂O",

    name:
      "water",

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

    molecule:
      "CO₂",

    name:
      "carbon dioxide",

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

    molecule:
      "NH₃",

    name:
      "ammonia",

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
  },

  {
    central:
      "C",

    molecule:
      "CH₄",

    name:
      "methane",

    required:
      [
        "H",
        "H",
        "H",
        "H"
      ],

    tiles:
      [
        "H",
        "H",
        "H",
        "H",
        "O"
      ]
  }

];


let queenIndex =
  0;


let queenBuild =
  [];


const queenPrompt =
  document.getElementById(
    "queenPrompt"
  );


const queenElement =
  document.getElementById(
    "queenElement"
  );


const queenTiles =
  document.getElementById(
    "queenTiles"
  );


const queenRing =
  document.getElementById(
    "queenRing"
  );


const queenHive =
  document.getElementById(
    "queenHive"
  );


const queenFeedback =
  document.getElementById(
    "queenFeedback"
  );


function addQueenAtom(
  symbol
) {

  if (
    queenBuild.length >=
    4
  ) {

    queenFeedback.textContent =
      "The Queen's first hive ring is full.";

    return;

  }


  queenBuild.push(
    symbol
  );


  renderQueenBuild();

}


function renderQueenBuild() {

  queenRing.innerHTML =
    "";


  queenBuild.forEach(
    function (symbol) {

      const hex =
        createHex(
          symbol,
          "Bonded"
        );


      hex.classList.add(
        "placed-hex"
      );


      hex.draggable =
        false;


      queenRing.appendChild(
        hex
      );

    }
  );

}


function renderQueenTiles() {

  queenTiles.innerHTML =
    "";


  const challenge =
    queenChallenges[
      queenIndex
    ];


  challenge.tiles.forEach(
    function (symbol) {

      const hex =
        createHex(
          symbol,
          "Worker"
        );


      hex.addEventListener(
        "click",
        function () {

          addQueenAtom(
            symbol
          );

        }
      );


      hex.addEventListener(
        "dragstart",
        function () {

          setDragPayload(
            "queen",
            symbol
          );

        }
      );


      queenTiles.appendChild(
        hex
      );

    }
  );

}


queenHive.addEventListener(
  "dragover",
  function (event) {

    event.preventDefault();

  }
);


queenHive.addEventListener(
  "drop",
  function (event) {

    event.preventDefault();


    if (
      draggedPayload &&
      draggedPayload.type ===
      "queen"
    ) {

      addQueenAtom(
        draggedPayload.payload
      );

    }

  }
);


function loadQueenChallenge() {

  queenBuild =
    [];


  const challenge =
    queenChallenges[
      queenIndex
    ];


  queenElement.textContent =
    challenge.central;


  queenPrompt.textContent =
    "Build " +
    challenge.name +
    " (" +
    challenge.molecule +
    ") around the Queen.";


  queenFeedback.textContent =
    "";


  renderQueenBuild();

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


      const guess =
        queenBuild
          .slice()
          .sort()
          .join(
            ""
          );


      const answer =
        challenge.required
          .slice()
          .sort()
          .join(
            ""
          );


      if (
        guess ===
        answer
      ) {

        queenFeedback.textContent =
          "✓ Hive complete! " +
          challenge.molecule +
          " forms around the Queen.";


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
          "Not quite. Check how many atoms should surround the Queen.";


        breakStreak();

      }

    }
  );


/* ==========================================================
   WORKER BEE
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
    "Build a neutral " +
    challenge.name +
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
          "Not quite. Check the nucleus and neutral electron count.";


        breakStreak();

      }

    }
  );


/* ==========================================================
   POLLINATION
========================================================== */

const pollinationChallenges = [

  {
    flower:
      "Cl⁻",

    pollen:
      "Na⁺",

    pollenCharge:
      1,

    flowerCharge:
      -1,

    neededPollen:
      1,

    formula:
      "NaCl",

    available:
      4
  },

  {
    flower:
      "O²⁻",

    pollen:
      "Na⁺",

    pollenCharge:
      1,

    flowerCharge:
      -2,

    neededPollen:
      2,

    formula:
      "Na₂O",

    available:
      4
  },

  {
    flower:
      "Cl⁻",

    pollen:
      "Ca²⁺",

    pollenCharge:
      2,

    flowerCharge:
      -1,

    neededPollen:
      1,

    flowerCount:
      2,

    formula:
      "CaCl₂",

    available:
      3
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


function deliverPollen(
  symbol
) {

  delivered.push(
    symbol
  );


  renderDeliveredPollen();

}


function renderDeliveredPollen() {

  deliveredPollen.innerHTML =
    "";


  delivered.forEach(
    function (symbol) {

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


function renderPollenBank() {

  pollenBank.innerHTML =
    "";


  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  for (
    let i = 0;
    i < challenge.available;
    i++
  ) {

    const piece =
      document.createElement(
        "button"
      );


    piece.type =
      "button";


    piece.className =
      "pollen-piece";


    piece.draggable =
      true;


    piece.textContent =
      challenge.pollen;


    piece.addEventListener(
      "click",
      function () {

        if (
          piece.classList.contains(
            "used"
          )
        ) {

          return;

        }


        piece.classList.add(
          "used"
        );


        deliverPollen(
          challenge.pollen
        );

      }
    );


    piece.addEventListener(
      "dragstart",
      function () {

        if (
          piece.classList.contains(
            "used"
          )
        ) {

          return;

        }


        setDragPayload(
          "pollination",
          {
            symbol:
              challenge.pollen,

            element:
              piece
          }
        );

      }
    );


    pollenBank.appendChild(
      piece
    );

  }

}


flowerTarget.addEventListener(
  "dragover",
  function (event) {

    event.preventDefault();

  }
);


flowerTarget.addEventListener(
  "drop",
  function (event) {

    event.preventDefault();


    if (
      draggedPayload &&
      draggedPayload.type ===
      "pollination"
    ) {

      const piece =
        draggedPayload
          .payload
          .element;


      if (
        piece.classList.contains(
          "used"
        )
      ) {

        return;

      }


      piece.classList.add(
        "used"
      );


      deliverPollen(
        draggedPayload
          .payload
          .symbol
      );

    }

  }
);


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
    "Carry enough " +
    challenge.pollen +
    " pollen to the " +
    challenge.flower +
    " flower to form a neutral ionic compound.";


  pollinationFeedback.textContent =
    "";


  pollinationResult.textContent =
    "";


  renderDeliveredPollen();

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
          "🌸 " +
          challenge.formula;


        pollinationFeedback.textContent =
          "✓ Charges balance. The flower blooms into " +
          challenge.formula +
          ".";


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

        pollinationFeedback.textContent =
          "Charge mismatch. Adjust the number of pollen pieces.";


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
