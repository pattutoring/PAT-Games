document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   PLAYER STATE
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

          const target =
            button.getAttribute(
              "data-screen"
            );

          showScreen(
            target
          );

        }
      );

    }
  );


/* ==========================================================
   SPELLING-BEE DATA
========================================================== */

const spellingChallenges = [

  {
    name:
      "water",

    answer:
      "HHO",

    displayAnswer:
      "H₂O",

    tiles:
      [
        "H",
        "O",
        "H",
        "C",
        "Na"
      ]
  },

  {
    name:
      "carbon dioxide",

    answer:
      "COO",

    displayAnswer:
      "CO₂",

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

    answer:
      "NHHH",

    displayAnswer:
      "NH₃",

    tiles:
      [
        "N",
        "H",
        "H",
        "H",
        "O",
        "C"
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
    " using the element tiles.";


  spellingFeedback.textContent =
    "";


  renderSpellingBuild();

  renderSpellingTiles();

}


function renderSpellingBuild() {

  spellingBuildZone.innerHTML =
    "";


  if (
    spellingBuild.length ===
    0
  ) {

    spellingBuildZone.textContent =
      "Build the formula here.";

    return;

  }


  spellingBuild.forEach(
    function (symbol) {

      const token =
        document.createElement(
          "span"
        );


      token.className =
        "build-token";


      token.textContent =
        symbol;


      spellingBuildZone.appendChild(
        token
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
      tile,
      index
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "element-tile";


      button.textContent =
        tile;


      button.addEventListener(
        "click",
        function () {

          spellingBuild.push(
            tile
          );


          renderSpellingBuild();

        }
      );


      spellingTiles.appendChild(
        button
      );

    }
  );

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
    function () {

      spellingBuild =
        [];

      spellingFeedback.textContent =
        "";

      renderSpellingBuild();

    }
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


      if (
        guess ===
        challenge.answer
      ) {

        spellingFeedback.textContent =
          "✓ Correct! " +
          challenge.displayAnswer +
          " builds " +
          challenge.name +
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
          "Not quite. Check the number and order of atoms.";


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


  const inner =
    Math.min(
      workerElectrons,
      2
    );


  const outer =
    Math.max(
      workerElectrons -
      2,
      0
    );


  document
    .getElementById(
      "innerElectronCount"
    )
    .textContent =
      inner;


  document
    .getElementById(
      "outerElectronCount"
    )
    .textContent =
      outer;

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
          "✓ Atom built correctly!";


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
          "Not quite. Check the atomic number, isotope, and neutral electron count.";


        breakStreak();

      }

    }
  );


/* ==========================================================
   QUEEN BEE
========================================================== */

const queenChallenges = [

  {
    queen:
      "O",

    prompt:
      "Which compound can be built around oxygen?",

    choices:
      [
        "H₂O",
        "NaCl",
        "CH₄",
        "NH₃"
      ],

    correct:
      "H₂O"
  },

  {
    queen:
      "C",

    prompt:
      "Which molecule contains carbon as the central element?",

    choices:
      [
        "CO₂",
        "H₂O",
        "NH₃",
        "NaCl"
      ],

    correct:
      "CO₂"
  }

];


let queenIndex =
  0;


function loadQueenChallenge() {

  const challenge =
    queenChallenges[
      queenIndex
    ];


  document
    .getElementById(
      "queenElement"
    )
    .textContent =
      challenge.queen;


  document
    .getElementById(
      "queenPrompt"
    )
    .textContent =
      challenge.prompt;


  const options =
    document.getElementById(
      "queenOptions"
    );


  options.innerHTML =
    "";


  document
    .getElementById(
      "queenFeedback"
    )
    .textContent =
      "";


  challenge.choices.forEach(
    function (choice) {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "choice-button";


      button.textContent =
        choice;


      button.addEventListener(
        "click",
        function () {

          if (
            choice ===
            challenge.correct
          ) {

            document
              .getElementById(
                "queenFeedback"
              )
              .textContent =
                "✓ Correct. The queen element belongs in " +
                choice +
                ".";


            rewardPlayer(
              10
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
              1100
            );

          }

          else {

            document
              .getElementById(
                "queenFeedback"
              )
              .textContent =
                "Not that hive. Look for the compound containing the queen element.";


            breakStreak();

          }

        }
      );


      options.appendChild(
        button
      );

    }
  );

}


/* ==========================================================
   POLLINATION
========================================================== */

const pollinationChallenges = [

  {
    pollen:
      "Na⁺",

    flower:
      "Cl⁻",

    prompt:
      "What neutral compound forms when this pollen reaches the flower?",

    choices:
      [
        "NaCl",
        "Na₂Cl",
        "NaCl₂"
      ],

    correct:
      "NaCl"
  },

  {
    pollen:
      "Ca²⁺",

    flower:
      "Cl⁻",

    prompt:
      "How many chloride ions are needed to balance one calcium ion?",

    choices:
      [
        "CaCl",
        "CaCl₂",
        "Ca₂Cl"
      ],

    correct:
      "CaCl₂"
  },

  {
    pollen:
      "Al³⁺",

    flower:
      "O²⁻",

    prompt:
      "Which formula balances the total positive and negative charge?",

    choices:
      [
        "AlO",
        "Al₂O₃",
        "Al₃O₂"
      ],

    correct:
      "Al₂O₃"
  }

];


let pollinationIndex =
  0;


function loadPollinationChallenge() {

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  document
    .getElementById(
      "pollenIon"
    )
    .textContent =
      challenge.pollen;


  document
    .getElementById(
      "flowerIon"
    )
    .textContent =
      challenge.flower;


  document
    .getElementById(
      "pollinationPrompt"
    )
    .textContent =
      challenge.prompt;


  document
    .getElementById(
      "pollinationFeedback"
    )
    .textContent =
      "";


  const choices =
    document.getElementById(
      "pollinationChoices"
    );


  choices.innerHTML =
    "";


  challenge.choices.forEach(
    function (choice) {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "choice-button";


      button.textContent =
        choice;


      button.addEventListener(
        "click",
        function () {

          if (
            choice ===
            challenge.correct
          ) {

            document
              .getElementById(
                "pollinationFeedback"
              )
              .textContent =
                "✓ Charges balanced. Compound formed: " +
                choice;


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
              1100
            );

          }

          else {

            document
              .getElementById(
                "pollinationFeedback"
              )
              .textContent =
                "Charge mismatch. The total positive and negative charge must cancel.";


            breakStreak();

          }

        }
      );


      choices.appendChild(
        button
      );

    }
  );

}


/* ==========================================================
   START
========================================================== */

updatePlayerDisplay();

loadSpellingChallenge();

loadWorkerChallenge();

loadQueenChallenge();

loadPollinationChallenge();


});
