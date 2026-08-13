/* ==========================================================
   MOLECULAR FARM
   PAT LEARNING LAB

   SPECIES DATA + GAME ENGINE
========================================================== */


/* ==========================================================
   SPECIES DATABASE

   Eventually this is where we can add your actual
   Molecular Farm artwork, formulas, lessons and evolutions.
========================================================== */


const species = [


  /* HYDROGEN */

  {
    atomicNumber: 1,

    symbol: "H",

    name:
      "Hydrogen Hippo",

    icon:
      "🦛",

    clue:
      "Hydrogen is the simplest element.",

    unlockedByDefault:
      true
  },


  /* HELIUM */

  {
    atomicNumber: 2,

    symbol: "He",

    name:
      "Helium Hyena",

    icon:
      "😆",

    clue:
      "Helium's first electron shell is completely filled.",

    unlockedByDefault:
      true
  },


  /* LITHIUM */

  {
    atomicNumber: 3,

    symbol: "Li",

    name:
      "Lithium Lightning-Bug",

    icon:
      "⚡",

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


  /* BERYLLIUM */

  {
    atomicNumber: 4,

    symbol: "Be",

    name:
      "Beryllium Bee",

    icon:
      "🐝",

    clue:
      "Two outer electrons appear in the Bee's design."
  },


  /* BORON */

  {
    atomicNumber: 5,

    symbol: "B",

    name:
      "Boron Butterfly",

    icon:
      "🦋",

    clue:
      "Look for three valence electrons in the Butterfly's anatomy."
  },


  /* CARBON */

  {
    atomicNumber: 6,

    symbol: "C",

    name:
      "Carbon Clam",

    icon:
      "🐚",

    clue:
      "Carbon carries four valence electrons."
  },


  /* NITROGEN */

  {
    atomicNumber: 7,

    symbol: "N",

    name:
      "Undiscovered Species",

    icon:
      "?",

    clue:
      "This species hasn't been discovered yet."
  },


  /* OXYGEN */

  {
    atomicNumber: 8,

    symbol: "O",

    name:
      "Oxygen Owl",

    icon:
      "🦉",

    clue:
      "H(OO)T! Oxygen has six valence electrons."
  }

];



/* ==========================================================
   PLAYER DATA

   localStorage means progress remains on the device
   between visits.
========================================================== */


let player =
  JSON.parse(
    localStorage.getItem(
      "patPlayer"
    )
  )

  ||

  {
    xp: 0,

    unlocked:
      [
        1,
        2
      ]
  };


let currentSpecies =
  null;


let currentQuestion =
  0;



/* ==========================================================
   NAVIGATION
========================================================== */


function showScreen(id) {

  document
    .querySelectorAll(
      ".screen"
    )

    .forEach(
      screen =>
        screen
          .classList
          .remove(
            "active"
          )
    );


  document
    .getElementById(id)

    .classList
    .add(
      "active"
    );


  window.scrollTo(
    0,
    0
  );

}



/* ==========================================================
   BUILD CHEMICAL-PERIOD
========================================================== */


function buildPeriod() {

  const period =
    document.getElementById(
      "period"
    );


  period.innerHTML =
    "";


  species.forEach(
    item => {


      const discovered =
        player
          .unlocked
          .includes(
            item.atomicNumber
          );


      const box =
        document.createElement(
          "div"
        );


      box.className =
        "element " +
        (
          discovered
            ? "unlocked"
            : "locked"
        );


      box.innerHTML = `

        <div class="atomic-number">
          ${item.atomicNumber}
        </div>

        <div class="symbol">
          ${item.symbol}
        </div>

        <div class="animal">

          ${item.icon}

          <br>

          ${item.name}

        </div>

      `;


      box.onclick =
        () =>
          openSpecies(
            item
          );


      period.appendChild(
        box
      );

    }
  );

}



/* ==========================================================
   OPEN SPECIES
========================================================== */


function openSpecies(item) {

  currentSpecies =
    item;


  currentQuestion =
    0;


  document
    .getElementById(
      "speciesName"
    )

    .textContent =
      item.name;


  document
    .getElementById(
      "speciesImage"
    )

    .textContent =
      item.icon;


  document
    .getElementById(
      "speciesClue"
    )

    .textContent =
      item.clue;


  showScreen(
    "speciesScreen"
  );


  if (
    item.questions
    &&
    item.questions.length
  ) {

    loadQuestion();

  }

  else {

    document
      .getElementById(
        "questionText"
      )

      .textContent =
        "More reconstruction challenges coming soon.";


    document
      .getElementById(
        "answers"
      )

      .innerHTML =
        "";


    document
      .getElementById(
        "feedback"
      )

      .innerHTML =
        "";

  }

}



/* ==========================================================
   LOAD QUESTION
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
    answer => {


      const button =
        document.createElement(
          "button"
        );


      button.className =
        "answer-button";


      button.textContent =
        answer;


      button.onclick =
        () =>
          checkAnswer(
            answer
          );


      answers.appendChild(
        button
      );

    }
  );

}



/* ==========================================================
   CHECK ANSWER
========================================================== */


function checkAnswer(answer) {

  const q =
    currentSpecies
      .questions[
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

    feedback.innerHTML =
      "✓ " +
      q.explanation;


    addXP(
      10
    );


    setTimeout(
      () => {


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

          completeSpecies();

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
   COMPLETE SPECIES
========================================================== */


function completeSpecies() {

  if (
    !player
      .unlocked
      .includes(
        currentSpecies
          .atomicNumber
      )
  ) {

    player
      .unlocked
      .push(
        currentSpecies
          .atomicNumber
      );


    addXP(
      25
    );

  }


  savePlayer();


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
   XP
========================================================== */


function addXP(amount) {

  player.xp +=
    amount;


  savePlayer();


  updateXP();

}



function updateXP() {

  document
    .getElementById(
      "xpText"
    )

    .textContent =
      player.xp +
      " XP";


  const percent =
    player.xp
    %
    100;


  document
    .getElementById(
      "xpFill"
    )

    .style.width =
      percent +
      "%";

}



/* ==========================================================
   PERIOD-EX
========================================================== */


function showPeriodex() {

  const catalogue =
    document.getElementById(
      "catalogue"
    );


  catalogue.innerHTML =
    "";


  const discovered =
    species.filter(
      item =>
        player
          .unlocked
          .includes(
            item.atomicNumber
          )
    );


  if (
    discovered.length === 0
  ) {

    catalogue.innerHTML =
      "<p>No species discovered yet.</p>";

  }

  else {

    discovered.forEach(
      item => {

        catalogue.innerHTML += `

          <div class="catalogue-card">

            <strong>

              ${item.icon}

              ${item.name}

            </strong>

            <br>

            ${item.symbol}

            • Atomic Number

            ${item.atomicNumber}

          </div>

        `;

      }
    );

  }


  showScreen(
    "periodex"
  );

}



/* ==========================================================
   SAVE PLAYER
========================================================== */


function savePlayer() {

  localStorage.setItem(

    "patPlayer",

    JSON.stringify(
      player
    )

  );

}



/* ==========================================================
   START MOLECULAR FARM
========================================================== */


buildPeriod();

updateXP();
