document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   PLAYER
========================================================== */

let xp = 0;
let streak = 0;

const xpText =
  document.getElementById("xpText");

const streakText =
  document.getElementById("streakText");

function updatePlayer() {
  xpText.textContent = xp + " XP";
  streakText.textContent = streak;
}


/* ==========================================================
   SCREEN NAVIGATION
========================================================== */

const screens =
  document.querySelectorAll(".screen");

document
  .querySelectorAll("[data-screen]")
  .forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const target =
          button.dataset.screen;

        screens.forEach(
          function (screen) {
            screen.classList.remove("active");
          }
        );

        document
          .getElementById(target)
          .classList
          .add("active");

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  });


/* ==========================================================
   BUZZWORD DATABASE

   Add future Buzzwords here.

   The LAST entry becomes today's challenge.
========================================================== */

const buzzwords = [

  {
    number: "001",

    name:
      "Carbon Dioxide",

    formula:
      "CO₂",

    center:
      "C",

    clue:
      "A gas essential to photosynthesis. One carbon atom anchors the molecule.",

    /*
      Six positions surround the center.

      null means the cell is not needed
      for this molecule.
    */

    slots: [
      null,
      "O",
      null,
      null,
      "O",
      null
    ],

    tiles: [
      "O",
      "H",
      "N",
      "O",
      "Cl",
      "Na"
    ],

    type:
      "Covalent Molecule",

    anchor:
      "Carbon",

    atomCount:
      "3",

    mass:
      "44.01 g/mol",

    explanation:
      "Carbon forms two double bonds with oxygen, giving carbon and both oxygen atoms complete valence shells.",

    fact:
      "Plants take in carbon dioxide during photosynthesis and use its carbon to help construct sugars."

  }

];


const activeBuzzword =
  buzzwords[
    buzzwords.length - 1
  ];


/* ==========================================================
   BUZZWORD ELEMENTS
========================================================== */

const buzzCenterElement =
  document.getElementById(
    "buzzCenterElement"
  );

const buzzClue =
  document.getElementById(
    "buzzClue"
  );

const buzzTileBank =
  document.getElementById(
    "buzzTileBank"
  );

const buzzSlots =
  Array.from(
    document.querySelectorAll(
      ".buzz-slot"
    )
  );

const buzzCheck =
  document.getElementById(
    "buzzCheck"
  );

const buzzReset =
  document.getElementById(
    "buzzReset"
  );

const buzzFeedback =
  document.getElementById(
    "buzzFeedback"
  );

const buzzAttempts =
  document.getElementById(
    "buzzAttempts"
  );

const buzzStreak =
  document.getElementById(
    "buzzStreak"
  );

const buzzReveal =
  document.getElementById(
    "buzzReveal"
  );

const buzzMoleculeName =
  document.getElementById(
    "buzzMoleculeName"
  );

const buzzFormula =
  document.getElementById(
    "buzzFormula"
  );

const buzzType =
  document.getElementById(
    "buzzType"
  );

const buzzAnchor =
  document.getElementById(
    "buzzAnchor"
  );

const buzzAtomCount =
  document.getElementById(
    "buzzAtomCount"
  );

const buzzMass =
  document.getElementById(
    "buzzMass"
  );

const buzzExplanation =
  document.getElementById(
    "buzzExplanation"
  );

const buzzFact =
  document.getElementById(
    "buzzFact"
  );

const shareBuzz =
  document.getElementById(
    "shareBuzz"
  );


/* ==========================================================
   BUZZWORD STATE
========================================================== */

let selectedBuzzTile =
  null;

let buzzPlaced =
  new Array(6).fill(null);

let buzzAttemptCount =
  0;

let buzzSolved =
  false;


/* ==========================================================
   LOAD BUZZWORD
========================================================== */

function loadBuzzword() {

  buzzCenterElement.textContent =
    activeBuzzword.center;

  buzzClue.textContent =
    activeBuzzword.clue;

  buzzMoleculeName.textContent =
    activeBuzzword.name;

  buzzFormula.textContent =
    activeBuzzword.formula;

  buzzType.textContent =
    activeBuzzword.type;

  buzzAnchor.textContent =
    activeBuzzword.anchor;

  buzzAtomCount.textContent =
    activeBuzzword.atomCount;

  buzzMass.textContent =
    activeBuzzword.mass;

  buzzExplanation.textContent =
    activeBuzzword.explanation;

  buzzFact.textContent =
    activeBuzzword.fact;

  resetBuzzword();

}


/* ==========================================================
   CREATE AVAILABLE BUZZ TILES
========================================================== */

function buildBuzzTiles() {

  buzzTileBank.innerHTML = "";

  activeBuzzword.tiles.forEach(
    function (symbol, index) {

      const tile =
        document.createElement(
          "button"
        );

      tile.type =
        "button";

      tile.className =
        "buzz-tile";

      tile.textContent =
        symbol;

      tile.dataset.symbol =
        symbol;

      tile.dataset.index =
        index;

      tile.draggable =
        true;


      tile.addEventListener(
        "click",
        function () {

          document
            .querySelectorAll(
              ".buzz-tile"
            )
            .forEach(
              function (other) {
                other.classList.remove(
                  "selected"
                );
              }
            );

          selectedBuzzTile =
            symbol;

          tile.classList.add(
            "selected"
          );

        }
      );


      tile.addEventListener(
        "dragstart",
        function (event) {

          event.dataTransfer.setData(
            "text/plain",
            symbol
          );

          selectedBuzzTile =
            symbol;

        }
      );


      buzzTileBank.appendChild(
        tile
      );

    }
  );

}


/* ==========================================================
   BUZZ HIVE SLOTS
========================================================== */

buzzSlots.forEach(
  function (slot) {

    const index =
      Number(
        slot.dataset.slot
      );


    slot.addEventListener(
      "click",
      function () {

        if (
          buzzSolved
        ) {
          return;
        }

        if (
          selectedBuzzTile
        ) {

          placeBuzzTile(
            index,
            selectedBuzzTile
          );

        }

        else if (
          buzzPlaced[index]
        ) {

          buzzPlaced[index] =
            null;

          slot.textContent =
            "?";

          slot.classList.remove(
            "filled"
          );

        }

      }
    );


    slot.addEventListener(
      "dragover",
      function (event) {
        event.preventDefault();
      }
    );


    slot.addEventListener(
      "drop",
      function (event) {

        event.preventDefault();

        const symbol =
          event.dataTransfer.getData(
            "text/plain"
          );

        placeBuzzTile(
          index,
          symbol
        );

      }
    );

  }
);


/* ==========================================================
   PLACE TILE
========================================================== */

function placeBuzzTile(
  index,
  symbol
) {

  if (
    buzzSolved
  ) {
    return;
  }

  buzzPlaced[index] =
    symbol;

  buzzSlots[index].textContent =
    symbol;

  buzzSlots[index]
    .classList
    .add("filled");

}


/* ==========================================================
   CHECK BUZZWORD
========================================================== */

buzzCheck.addEventListener(
  "click",
  function () {

    if (
      buzzSolved
    ) {
      return;
    }

    buzzAttemptCount++;

    buzzAttempts.textContent =
      buzzAttemptCount;


    let correct =
      true;


    activeBuzzword.slots.forEach(
      function (
        expected,
        index
      ) {

        if (
          expected === null
        ) {

          /*
            Unused hive cells must remain empty.
          */

          if (
            buzzPlaced[index] !== null
          ) {
            correct = false;
          }

        }

        else if (
          buzzPlaced[index] !== expected
        ) {

          correct = false;

        }

      }
    );


    if (
      correct
    ) {

      solveBuzzword();

    }

    else {

      buzzFeedback.textContent =
        "Not quite — some atoms are buzzing in the wrong part of the hive.";

    }

  }
);


/* ==========================================================
   SOLVE BUZZWORD
========================================================== */

function solveBuzzword() {

  buzzSolved =
    true;

  buzzFeedback.textContent =
    "🐝 Hive complete!";

  xp += 25;

  streak++;

  updatePlayer();

  buzzStreak.textContent =
    streak;


  /*
    Reveal every correct molecular position.
  */

  activeBuzzword.slots.forEach(
    function (
      symbol,
      index
    ) {

      if (
        symbol
      ) {

        buzzSlots[index].textContent =
          symbol;

        buzzSlots[index]
          .classList
          .add("filled");

      }

      else {

        buzzSlots[index].textContent =
          "";

      }

    }
  );


  buzzReveal.classList.add(
    "visible"
  );


  setTimeout(
    function () {

      buzzReveal.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    },
    250
  );

}


/* ==========================================================
   RESET BUZZWORD
========================================================== */

function resetBuzzword() {

  buzzPlaced =
    new Array(6).fill(null);

  buzzAttemptCount =
    0;

  buzzSolved =
    false;

  selectedBuzzTile =
    null;

  buzzAttempts.textContent =
    "0";

  buzzFeedback.textContent =
    "";

  buzzReveal.classList.remove(
    "visible"
  );


  buzzSlots.forEach(
    function (slot) {

      slot.textContent =
        "?";

      slot.classList.remove(
        "filled"
      );

    }
  );


  buildBuzzTiles();

}


buzzReset.addEventListener(
  "click",
  resetBuzzword
);


/* ==========================================================
   SHARE MY BUZZ
========================================================== */

function buildBuzzShareText() {

  let attemptLine;

  if (
    buzzAttemptCount === 1
  ) {

    attemptLine =
      "Hive completed in 1 attempt";

  }

  else {

    attemptLine =
      "Hive completed in " +
      buzzAttemptCount +
      " attempts";

  }


  return (
    "🐝 MOLECULAR BEE\n" +
    "BUZZWORD #" +
    activeBuzzword.number +
    "\n\n" +

    "⬡   ⬡   ⬡\n" +
    "  ⬡  🐝  ⬡\n" +
    "⬡   ⬡   ⬡\n\n" +

    attemptLine +
    "\n" +

    "🔥 Buzz Streak: " +
    streak +
    "\n\n" +

    "The molecules are buzzing around the hive.\n\n" +

    "Can you solve today's Buzzword?\n" +

    "PAT Learning Lab"
  );

}


shareBuzz.addEventListener(
  "click",
  async function () {

    const text =
      buildBuzzShareText();

    try {

      if (
        navigator.share
      ) {

        await navigator.share({

          title:
            "Molecular Bee Buzzword #" +
            activeBuzzword.number,

          text:
            text,

          url:
            window.location.href

        });

        return;

      }


      await navigator.clipboard.writeText(
        text +
        "\n\n" +
        window.location.href
      );


      const original =
        shareBuzz.textContent;

      shareBuzz.textContent =
        "Copied! 🐝";


      setTimeout(
        function () {

          shareBuzz.textContent =
            original;

        },
        1300
      );

    }

    catch (error) {

      console.log(
        "Share cancelled."
      );

    }

  }
);


/* ==========================================================
   SPELLING BEE
========================================================== */

const spellingChallenges = [

  {
    name: "Water",
    formula: ["H", "H", "O"]
  },

  {
    name: "Carbon Dioxide",
    formula: ["C", "O", "O"]
  },

  {
    name: "Ammonia",
    formula: ["N", "H", "H", "H"]
  }

];

let spellingIndex = 0;
let spellingAnswer = [];

const spellingPrompt =
  document.getElementById("spellingPrompt");

const spellingBuild =
  document.getElementById("spellingBuild");

const spellingTiles =
  document.getElementById("spellingTiles");

const spellingFeedback =
  document.getElementById("spellingFeedback");


function loadSpelling() {

  const challenge =
    spellingChallenges[spellingIndex];

  spellingPrompt.textContent =
    "Build " + challenge.name;

  spellingAnswer = [];

  spellingBuild.innerHTML = "";

  spellingTiles.innerHTML = "";

  spellingFeedback.textContent = "";


  const options =
    [
      ...challenge.formula,
      "Na",
      "Cl",
      "N"
    ];


  options.forEach(
    function (symbol) {

      const tile =
        document.createElement("button");

      tile.type = "button";

      tile.className =
        "honey-tile";

      tile.textContent =
        symbol;

      tile.draggable =
        true;


      tile.addEventListener(
        "click",
        function () {

          spellingAnswer.push(
            symbol
          );

          renderSpellingAnswer();

        }
      );


      tile.addEventListener(
        "dragstart",
        function (event) {

          event.dataTransfer.setData(
            "text/plain",
            symbol
          );

        }
      );


      spellingTiles.appendChild(
        tile
      );

    }
  );

}


function renderSpellingAnswer() {

  spellingBuild.innerHTML = "";

  spellingAnswer.forEach(
    function (symbol) {

      const tile =
        document.createElement("div");

      tile.className =
        "hex";

      tile.textContent =
        symbol;

      spellingBuild.appendChild(
        tile
      );

    }
  );

}


spellingBuild.addEventListener(
  "dragover",
  function (event) {
    event.preventDefault();
  }
);


spellingBuild.addEventListener(
  "drop",
  function (event) {

    event.preventDefault();

    spellingAnswer.push(
      event.dataTransfer.getData(
        "text/plain"
      )
    );

    renderSpellingAnswer();

  }
);


document
  .getElementById("spellingBackspace")
  .addEventListener(
    "click",
    function () {

      spellingAnswer.pop();

      renderSpellingAnswer();

    }
  );


document
  .getElementById("spellingReset")
  .addEventListener(
    "click",
    loadSpelling
  );


document
  .getElementById("spellingCheck")
  .addEventListener(
    "click",
    function () {

      const correct =
        spellingChallenges[
          spellingIndex
        ].formula;


      if (
        spellingAnswer.join(",") ===
        correct.join(",")
      ) {

        spellingFeedback.textContent =
          "🐝 Correct molecule!";

        xp += 10;

        updatePlayer();

      }

      else {

        spellingFeedback.textContent =
          "Not quite. Check the atom ratio.";

      }

    }
  );


/* ==========================================================
   QUEEN BEE
========================================================== */

const queenPrompt =
  document.getElementById("queenPrompt");

const queenElement =
  document.getElementById("queenElement");

const queenRing =
  document.getElementById("queenRing");

const queenTiles =
  document.getElementById("queenTiles");

const queenFeedback =
  document.getElementById("queenFeedback");

let queenPlaced = [];


function loadQueen() {

  queenPrompt.textContent =
    "Build water around the Queen oxygen.";

  queenElement.textContent =
    "O";

  queenPlaced = [];

  queenRing.innerHTML = "";

  queenTiles.innerHTML = "";

  queenFeedback.textContent = "";


  ["H", "H", "C", "Na", "Cl"]
    .forEach(
      function (symbol) {

        const tile =
          document.createElement(
            "button"
          );

        tile.type =
          "button";

        tile.className =
          "honey-tile";

        tile.textContent =
          symbol;

        tile.draggable =
          true;


        tile.addEventListener(
          "click",
          function () {

            queenPlaced.push(
              symbol
            );

            renderQueen();

          }
        );


        tile.addEventListener(
          "dragstart",
          function (event) {

            event.dataTransfer.setData(
              "text/plain",
              symbol
            );

          }
        );


        queenTiles.appendChild(
          tile
        );

      }
    );

}


function renderQueen() {

  queenRing.innerHTML = "";

  queenPlaced.forEach(
    function (symbol) {

      const tile =
        document.createElement(
          "div"
        );

      tile.className =
        "hex";

      tile.textContent =
        symbol;

      queenRing.appendChild(
        tile
      );

    }
  );

}


queenRing.addEventListener(
  "dragover",
  function (event) {
    event.preventDefault();
  }
);


queenRing.addEventListener(
  "drop",
  function (event) {

    event.preventDefault();

    queenPlaced.push(
      event.dataTransfer.getData(
        "text/plain"
      )
    );

    renderQueen();

  }
);


document
  .getElementById("queenCheck")
  .addEventListener(
    "click",
    function () {

      const hydrogens =
        queenPlaced.filter(
          function (item) {
            return item === "H";
          }
        ).length;


      if (
        hydrogens === 2 &&
        queenPlaced.length === 2
      ) {

        queenFeedback.textContent =
          "👑 Correct — H₂O!";

        xp += 10;

        updatePlayer();

      }

      else {

        queenFeedback.textContent =
          "The Queen needs exactly two hydrogen neighbors.";

      }

    }
  );


document
  .getElementById("queenReset")
  .addEventListener(
    "click",
    loadQueen
  );


/* ==========================================================
   WORKER BEE
========================================================== */

let protons = 0;
let neutrons = 0;
let electrons = 0;

const protonCount =
  document.getElementById("protonCount");

const neutronCount =
  document.getElementById("neutronCount");

const innerElectronCount =
  document.getElementById(
    "innerElectronCount"
  );

const outerElectronCount =
  document.getElementById(
    "outerElectronCount"
  );

const workerPrompt =
  document.getElementById(
    "workerPrompt"
  );

const workerFeedback =
  document.getElementById(
    "workerFeedback"
  );


function renderAtom() {

  protonCount.textContent =
    protons;

  neutronCount.textContent =
    neutrons;

  innerElectronCount.textContent =
    Math.min(
      electrons,
      2
    );

  outerElectronCount.textContent =
    Math.max(
      electrons - 2,
      0
    );

}


function resetWorker() {

  protons = 0;
  neutrons = 0;
  electrons = 0;

  workerPrompt.textContent =
    "Build a neutral carbon-12 atom.";

  workerFeedback.textContent =
    "";

  renderAtom();

}


document
  .getElementById("addProton")
  .addEventListener(
    "click",
    function () {

      protons++;
      renderAtom();

    }
  );


document
  .getElementById("addNeutron")
  .addEventListener(
    "click",
    function () {

      neutrons++;
      renderAtom();

    }
  );


document
  .getElementById("addElectron")
  .addEventListener(
    "click",
    function () {

      electrons++;
      renderAtom();

    }
  );


document
  .getElementById("workerReset")
  .addEventListener(
    "click",
    resetWorker
  );


document
  .getElementById("workerCheck")
  .addEventListener(
    "click",
    function () {

      if (
        protons === 6 &&
        neutrons === 6 &&
        electrons === 6
      ) {

        workerFeedback.textContent =
          "🔧 Correct — Carbon-12!";

        xp += 10;

        updatePlayer();

      }

      else {

        workerFeedback.textContent =
          "Keep building: carbon-12 needs 6 protons, 6 neutrons and 6 electrons.";

      }

    }
  );


/* ==========================================================
   POLLINATION
========================================================== */

const pollinationChallenges = [

  {
    flower: "Na⁺",
    pollen: "Cl⁻",
    answer: "NaCl"
  },

  {
    flower: "Ca²⁺",
    pollen: "Cl⁻",
    needed: 2,
    answer: "CaCl₂"
  },

  {
    flower: "Al³⁺",
    pollen: "O²⁻",
    needed: 3,
    answer: "Al₂O₃"
  },

  {
    flower: "Mg²⁺",
    pollen: "F⁻",
    needed: 2,
    answer: "MgF₂"
  },

  {
    flower: "K⁺",
    pollen: "Br⁻",
    answer: "KBr"
  }

];

let pollinationIndex = 0;
let delivered = [];

const flowerIon =
  document.getElementById("flowerIon");

const pollenBank =
  document.getElementById("pollenBank");

const deliveredPollen =
  document.getElementById(
    "deliveredPollen"
  );

const pollinationPrompt =
  document.getElementById(
    "pollinationPrompt"
  );

const pollinationResult =
  document.getElementById(
    "pollinationResult"
  );

const pollinationFeedback =
  document.getElementById(
    "pollinationFeedback"
  );

const flowerTarget =
  document.getElementById(
    "flowerTarget"
  );


function loadPollination() {

  const challenge =
    pollinationChallenges[
      pollinationIndex %
      pollinationChallenges.length
    ];

  delivered = [];

  flowerIon.textContent =
    challenge.flower;

  pollinationPrompt.textContent =
    "Choose pollen that can neutralize the flower.";

  pollenBank.innerHTML =
    "";

  deliveredPollen.innerHTML =
    "";

  pollinationResult.textContent =
    "";

  pollinationFeedback.textContent =
    "";


  const options = [
    challenge.pollen,
    "Cl⁻",
    "O²⁻",
    "Na⁺",
    "F⁻",
    "Br⁻"
  ];


  options.forEach(
    function (ion) {

      const pollen =
        document.createElement(
          "button"
        );

      pollen.type =
        "button";

      pollen.className =
        "honey-tile";

      pollen.textContent =
        ion;

      pollen.draggable =
        true;


      pollen.addEventListener(
        "click",
        function () {

          deliverPollen(
            ion
          );

        }
      );


      pollen.addEventListener(
        "dragstart",
        function (event) {

          event.dataTransfer.setData(
            "text/plain",
            ion
          );

        }
      );


      pollenBank.appendChild(
        pollen
      );

    }
  );

}


function deliverPollen(ion) {

  delivered.push(
    ion
  );

  const piece =
    document.createElement(
      "div"
    );

  piece.className =
    "hex";

  piece.textContent =
    ion;

  deliveredPollen.appendChild(
    piece
  );

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

    deliverPollen(
      event.dataTransfer.getData(
        "text/plain"
      )
    );

  }
);


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

      const challenge =
        pollinationChallenges[
          pollinationIndex %
          pollinationChallenges.length
        ];

      const needed =
        challenge.needed || 1;

      const correctCount =
        delivered.filter(
          function (ion) {
            return ion ===
              challenge.pollen;
          }
        ).length;


      if (
        correctCount === needed &&
        delivered.length === needed
      ) {

        pollinationResult.textContent =
          "🌼 " +
          challenge.answer;

        pollinationFeedback.textContent =
          "Neutral compound grown!";

        xp += 10;

        updatePlayer();

        pollinationIndex++;

      }

      else {

        pollinationFeedback.textContent =
          "The charges have not balanced yet.";

      }

    }
  );


/* ==========================================================
   START
========================================================== */

updatePlayer();

loadBuzzword();

loadSpelling();

loadQueen();

resetWorker();

loadPollination();


});
