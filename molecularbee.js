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
      player.xp + " XP";


  document
    .getElementById("streakText")
    .textContent =
      player.streak;

}


function rewardPlayer(amount) {

  player.xp += amount;

  savePlayer();

  updatePlayerDisplay();

}


/* ==========================================================
   NAVIGATION
========================================================== */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(
      function (screen) {

        screen.classList.remove(
          "active"
        );

      }
    );


  const target =
    document.getElementById(id);


  if (target) {

    target.classList.add(
      "active"
    );

  }


  window.scrollTo(
    {
      top: 0,
      behavior: "smooth"
    }
  );

}


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

    }
  );


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
            button.dataset.screen
          );

        }
      );

    }
  );


/* ==========================================================
   ELEMENT INFORMATION
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

  S:
    "Sulfur",

  Cl:
    "Chlorine",

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

  F:
    "Fluorine",

  Br:
    "Bromine",

  I:
    "Iodine",

  He:
    "Helium",

  Be:
    "Beryllium"

};


/* ==========================================================
   WEEKLY BUZZWORD DATABASE
========================================================== */

/*
  CENTER is always required.

  validAnswers is the curated answer list.

  Moleculargram detection is automatic:
  if any accepted answer uses EVERY one of
  the seven hive elements at least once,
  the Moleculargram award appears.
*/

const buzzwordWeeks = [

  {

    number:
      "001",

    center:
      "C",

    outer:
      [
        "H",
        "O",
        "N",
        "S",
        "Na",
        "Cl"
      ],


    validAnswers: [

      {
        formula:
          "CO2",

        name:
          "Carbon Dioxide",

        sequence:
          [
            "C",
            "O",
            "O"
          ]
      },


      {
        formula:
          "CO",

        name:
          "Carbon Monoxide",

        sequence:
          [
            "C",
            "O"
          ]
      },


      {
        formula:
          "CH4",

        name:
          "Methane",

        sequence:
          [
            "C",
            "H",
            "H",
            "H",
            "H"
          ]
      },


      {
        formula:
          "CCl4",

        name:
          "Carbon Tetrachloride",

        sequence:
          [
            "C",
            "Cl",
            "Cl",
            "Cl",
            "Cl"
          ]
      },


      {
        formula:
          "CS2",

        name:
          "Carbon Disulfide",

        sequence:
          [
            "C",
            "S",
            "S"
          ]
      },


      {
        formula:
          "HCN",

        name:
          "Hydrogen Cyanide",

        sequence:
          [
            "H",
            "C",
            "N"
          ]
      },


      {
        formula:
          "H2CO3",

        name:
          "Carbonic Acid",

        sequence:
          [
            "H",
            "H",
            "C",
            "O",
            "O",
            "O"
          ]
      },


      {
        formula:
          "Na2CO3",

        name:
          "Sodium Carbonate",

        sequence:
          [
            "Na",
            "Na",
            "C",
            "O",
            "O",
            "O"
          ]
      }

    ]

  }

];


/* ==========================================================
   WEEKLY ROTATION
========================================================== */

const weeklyStart =
  new Date(
    "2026-08-10T00:00:00"
  );


const now =
  new Date();


const weekNumber =
  Math.max(
    0,
    Math.floor(
      (
        now -
        weeklyStart
      )
      /
      (
        7 *
        24 *
        60 *
        60 *
        1000
      )
    )
  );


const activeWeek =
  buzzwordWeeks[
    weekNumber %
    buzzwordWeeks.length
  ];


/* ==========================================================
   BUZZWORD STATE
========================================================== */

let buzzSequence =
  [];


let foundAnswers =
  [];


let moleculargramFound =
  false;


/* ==========================================================
   BUZZWORD HIVE SETUP
========================================================== */

const outerBuzzButtons = [

  document.getElementById(
    "buzzElement0"
  ),

  document.getElementById(
    "buzzElement1"
  ),

  document.getElementById(
    "buzzElement2"
  ),

  document.getElementById(
    "buzzElement3"
  ),

  document.getElementById(
    "buzzElement4"
  ),

  document.getElementById(
    "buzzElement5"
  )

];


const centerBuzzButton =
  document.getElementById(
    "buzzCenter"
  );


function loadWeeklyBuzzword() {

  document
    .getElementById(
      "buzzwordNumber"
    )
    .textContent =
      "Weekly Hive • #"
      +
      activeWeek.number;


  activeWeek.outer.forEach(
    function (
      symbol,
      index
    ) {

      outerBuzzButtons[
        index
      ].textContent =
        symbol;


      outerBuzzButtons[
        index
      ].dataset.symbol =
        symbol;

    }
  );


  centerBuzzButton.textContent =
    activeWeek.center;


  centerBuzzButton.dataset.symbol =
    activeWeek.center;


  buzzSequence =
    [];


  foundAnswers =
    [];


  moleculargramFound =
    false;


  updateBuzzBuilder();


  renderFoundAnswers();


  document
    .getElementById(
      "moleculargramCard"
    )
    .classList
    .remove(
      "visible"
    );


  document
    .getElementById(
      "buzzFeedback"
    )
    .textContent =
      "";

}


/* ==========================================================
   CLICK ELEMENT
========================================================== */

function selectBuzzElement(
  button
) {

  const symbol =
    button.dataset.symbol;


  buzzSequence.push(
    symbol
  );


  button.classList.add(
    "pressed"
  );


  setTimeout(
    function () {

      button.classList.remove(
        "pressed"
      );

    },
    120
  );


  updateBuzzBuilder();

}


outerBuzzButtons.forEach(
  function (
    button
  ) {

    button.addEventListener(
      "click",
      function () {

        selectBuzzElement(
          button
        );

      }
    );

  }
);


centerBuzzButton.addEventListener(
  "click",
  function () {

    selectBuzzElement(
      centerBuzzButton
    );

  }
);


/* ==========================================================
   FORMULA DISPLAY
========================================================== */

const subscriptMap = {

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


function sequenceToFormula(
  sequence
) {

  if (
    sequence.length ===
    0
  ) {

    return "";

  }


  let formula =
    "";


  let current =
    sequence[0];


  let count =
    1;


  for (
    let i = 1;
    i <= sequence.length;
    i++
  ) {

    if (
      sequence[i] ===
      current
    ) {

      count++;

    }

    else {

      formula +=
        current;


      if (
        count >
        1
      ) {

        formula +=
          subscriptMap[count]
          ||
          count;

      }


      current =
        sequence[i];


      count =
        1;

    }

  }


  return formula;

}


function normalizeSequence(
  sequence
) {

  return sequence.join(
    "|"
  );

}


function updateBuzzBuilder() {

  const formulaBox =
    document.getElementById(
      "buzzFormulaBuilder"
    );


  const spelledBox =
    document.getElementById(
      "buzzSpelledOut"
    );


  if (
    buzzSequence.length ===
    0
  ) {

    formulaBox.textContent =
      "Tap an element to begin";


    formulaBox.classList.add(
      "empty"
    );


    spelledBox.textContent =
      "";


    return;

  }


  formulaBox.classList.remove(
    "empty"
  );


  formulaBox.textContent =
    sequenceToFormula(
      buzzSequence
    );


  spelledBox.textContent =
    buzzSequence
      .map(
        function (
          symbol
        ) {

          return (
            elementNames[symbol]
            ||
            symbol
          );

        }
      )
      .join(
        " → "
      );

}


/* ==========================================================
   BACKSPACE / CLEAR
========================================================== */

document
  .getElementById(
    "buzzBackspace"
  )
  .addEventListener(
    "click",
    function () {

      buzzSequence.pop();


      updateBuzzBuilder();

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


      updateBuzzBuilder();


      document
        .getElementById(
          "buzzFeedback"
        )
        .textContent =
          "";

    }
  );


/* ==========================================================
   REQUIRED CENTER
========================================================== */

function usesCenterElement() {

  return buzzSequence.includes(
    activeWeek.center
  );

}


/* ==========================================================
   MOLECULARGRAM CHECK
========================================================== */

function usesEveryHiveElement(
  sequence
) {

  const required =
    [
      activeWeek.center,
      ...activeWeek.outer
    ];


  return required.every(
    function (
      symbol
    ) {

      return sequence.includes(
        symbol
      );

    }
  );

}


/* ==========================================================
   SUBMIT COMPOUND
========================================================== */

document
  .getElementById(
    "buzzSubmit"
  )
  .addEventListener(
    "click",
    function () {

      const feedback =
        document.getElementById(
          "buzzFeedback"
        );


      if (
        buzzSequence.length ===
        0
      ) {

        feedback.textContent =
          "Build a compound first.";


        return;

      }


      if (
        !usesCenterElement()
      ) {

        feedback.textContent =
          "👑 Every Buzzword answer must use the gold center element: "
          +
          elementNames[
            activeWeek.center
          ]
          +
          ".";


        return;

      }


      const submitted =
        normalizeSequence(
          buzzSequence
        );


      const match =
        activeWeek.validAnswers.find(
          function (
            answer
          ) {

            return (
              normalizeSequence(
                answer.sequence
              )
              ===
              submitted
            );

          }
        );


      if (
        !match
      ) {

        feedback.textContent =
          "That combination is not in this week's hive yet. Try another compound.";


        return;

      }


      const alreadyFound =
        foundAnswers.some(
          function (
            answer
          ) {

            return (
              answer.formula ===
              match.formula
            );

          }
        );


      if (
        alreadyFound
      ) {

        feedback.textContent =
          "You already found "
          +
          match.name
          +
          ".";


        buzzSequence =
          [];


        updateBuzzBuilder();


        return;

      }


      foundAnswers.push(
        match
      );


      rewardPlayer(
        10
      );


      feedback.textContent =
        "🐝 Correct — "
        +
        match.name
        +
        "!";


      if (
        usesEveryHiveElement(
          buzzSequence
        )
      ) {

        moleculargramFound =
          true;


        document
          .getElementById(
            "moleculargramCard"
          )
          .classList
          .add(
            "visible"
          );


        rewardPlayer(
          25
        );


        feedback.textContent =
          "🐝👑 MOLECULARGRAM! You used every element in the hive!";

      }


      renderFoundAnswers();


      buzzSequence =
        [];


      updateBuzzBuilder();

    }
  );


/* ==========================================================
   FOUND ANSWERS
========================================================== */

function renderFoundAnswers() {

  const list =
    document.getElementById(
      "buzzFoundList"
    );


  document
    .getElementById(
      "buzzFoundCount"
    )
    .textContent =
      foundAnswers.length;


  list.innerHTML =
    "";


  if (
    foundAnswers.length ===
    0
  ) {

    list.innerHTML =
      '<div class="nothing-found">'
      +
      'Your discovered compounds will appear here.'
      +
      '</div>';


    return;

  }


  foundAnswers.forEach(
    function (
      answer
    ) {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "found-compound";


      row.innerHTML =
        '<span class="found-formula">'
        +
        prettifyFormula(
          answer.formula
        )
        +
        '</span>'
        +
        '<span class="found-name">'
        +
        answer.name
        +
        '</span>';


      list.appendChild(
        row
      );

    }
  );

}


/* ==========================================================
   FORMULA PRETTIFIER
========================================================== */

function prettifyFormula(
  formula
) {

  return formula.replace(
    /([0-9])/g,
    function (
      number
    ) {

      return (
        subscriptMap[
          Number(number)
        ]
        ||
        number
      );

    }
  );

}


/* ==========================================================
   SHARE HIVE
========================================================== */

function drawHex(
  context,
  x,
  y,
  radius,
  center,
  symbol
) {

  context.beginPath();


  for (
    let i = 0;
    i < 6;
    i++
  ) {

    const angle =
      Math.PI /
      3 *
      i;


    const px =
      x +
      radius *
      Math.cos(angle);


    const py =
      y +
      radius *
      Math.sin(angle);


    if (
      i === 0
    ) {

      context.moveTo(
        px,
        py
      );

    }

    else {

      context.lineTo(
        px,
        py
      );

    }

  }


  context.closePath();


  context.fillStyle =
    center
      ?
        "#d8a72f"
      :
        "#fff1ba";


  context.fill();


  context.lineWidth =
    4;


  context.strokeStyle =
    "#99711f";


  context.stroke();


  context.fillStyle =
    "#29261f";


  context.font =
    center
      ?
        "bold 46px Georgia"
      :
        "bold 38px Georgia";


  context.textAlign =
    "center";


  context.textBaseline =
    "middle";


  context.fillText(
    symbol,
    x,
    y
  );

}


/* ==========================================================
   CREATE SHARE IMAGE
========================================================== */

async function createBuzzShareFile() {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    1080;


  canvas.height =
    1080;


  const ctx =
    canvas.getContext(
      "2d"
    );


  ctx.fillStyle =
    "#fff8e8";


  ctx.fillRect(
    0,
    0,
    1080,
    1080
  );


  ctx.textAlign =
    "center";


  ctx.fillStyle =
    "#29261f";


  ctx.font =
    "bold 68px Georgia";


  ctx.fillText(
    "MOLECULAR BEE",
    540,
    100
  );


  ctx.fillStyle =
    "#99711f";


  ctx.font =
    "bold 36px Georgia";


  ctx.fillText(
    "WEEKLY BUZZWORD #"
    +
    activeWeek.number,
    540,
    160
  );


  const radius =
    90;


  const positions = [

    [
      460,
      350,
      activeWeek.outer[0]
    ],

    [
      620,
      350,
      activeWeek.outer[1]
    ],

    [
      380,
      490,
      activeWeek.outer[2]
    ],

    [
      700,
      490,
      activeWeek.outer[3]
    ],

    [
      460,
      630,
      activeWeek.outer[4]
    ],

    [
      620,
      630,
      activeWeek.outer[5]
    ]

  ];


  positions.forEach(
    function (
      item
    ) {

      drawHex(
        ctx,
        item[0],
        item[1],
        radius,
        false,
        item[2]
      );

    }
  );


  drawHex(
    ctx,
    540,
    490,
    radius,
    true,
    activeWeek.center
  );


  ctx.fillStyle =
    "#29261f";


  ctx.font =
    "bold 40px Georgia";


  ctx.fillText(
    foundAnswers.length
    +
    " compounds found",
    540,
    790
  );


  if (
    moleculargramFound
  ) {

    ctx.fillStyle =
      "#99711f";


    ctx.font =
      "bold 43px Georgia";


    ctx.fillText(
      "🐝 MOLECULARGRAM!",
      540,
      850
    );

  }


  ctx.fillStyle =
    "#765638";


  ctx.font =
    "italic 31px Georgia";


  ctx.fillText(
    "How many can you find?",
    540,
    920
  );


  ctx.font =
    "bold 28px Georgia";


  ctx.fillText(
    "PAT Learning Lab",
    540,
    975
  );


  return new Promise(
    function (
      resolve
    ) {

      canvas.toBlob(
        function (
          blob
        ) {

          if (
            !blob
          ) {

            resolve(
              null
            );

            return;

          }


          resolve(
            new File(
              [blob],
              "Molecular-Bee-Buzzword-"
              +
              activeWeek.number
              +
              ".png",
              {
                type:
                  "image/png"
              }
            )
          );

        },
        "image/png"
      );

    }
  );

}


/* ==========================================================
   SHARE
========================================================== */

document
  .getElementById(
    "shareBuzzButton"
  )
  .addEventListener(
    "click",
    async function () {

      const text =
        "🐝 MOLECULAR BEE"
        +
        "\nWEEKLY BUZZWORD #"
        +
        activeWeek.number
        +
        "\n\n"
        +
        foundAnswers.length
        +
        " compounds found"
        +
        (
          moleculargramFound
          ?
            "\n🐝👑 MOLECULARGRAM!"
          :
            ""
        )
        +
        "\n\nHow many can you find?"
        +
        "\nPAT Learning Lab";


      const file =
        await createBuzzShareFile();


      try {

        if (
          file
          &&
          navigator.share
          &&
          navigator.canShare
          &&
          navigator.canShare(
            {
              files:
                [file]
            }
          )
        ) {

          await navigator.share(
            {

              title:
                "Molecular Bee Weekly Buzzword",

              text:
                text,

              files:
                [file]

            }
          );


          return;

        }


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
   BASIC EXISTING MODE HELPERS
========================================================== */

function createHex(
  symbol
) {

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.className =
    "hex";


  button.textContent =
    symbol;


  return button;

}


/* ==========================================================
   SPELLING BEE
========================================================== */

const spellingChallenges = [

  {
    name: "water",
    formula: ["H","H","O"]
  },

  {
    name: "carbon dioxide",
    formula: ["C","O","O"]
  },

  {
    name: "ammonia",
    formula: ["N","H","H","H"]
  }

];


let spellingIndex =
  0;


let spellingSequence =
  [];


function loadSpelling() {

  const challenge =
    spellingChallenges[
      spellingIndex
    ];


  spellingSequence =
    [];


  document
    .getElementById(
      "spellingPrompt"
    )
    .textContent =
      "Spell "
      +
      challenge.name
      +
      ".";


  const build =
    document.getElementById(
      "spellingBuild"
    );


  const tiles =
    document.getElementById(
      "spellingTiles"
    );


  build.innerHTML =
    "";


  tiles.innerHTML =
    "";


  document
    .getElementById(
      "spellingFeedback"
    )
    .textContent =
      "";


  [
    ...challenge.formula,
    "Na",
    "Cl",
    "N"
  ]
  .forEach(
    function (
      symbol
    ) {

      const tile =
        createHex(symbol);


      tile.onclick =
        function () {

          spellingSequence.push(
            symbol
          );


          renderSpelling();

        };


      tiles.appendChild(
        tile
      );

    }
  );


  renderSpelling();

}


function renderSpelling() {

  const build =
    document.getElementById(
      "spellingBuild"
    );


  build.innerHTML =
    "";


  spellingSequence.forEach(
    function (
      symbol
    ) {

      const tile =
        createHex(
          symbol
        );


      build.appendChild(
        tile
      );

    }
  );


  const formula =
    document.getElementById(
      "spellingFormula"
    );


  if (
    spellingSequence.length ===
    0
  ) {

    formula.textContent =
      "Chemical formula will appear here";


    return;

  }


  formula.textContent =
    sequenceToFormula(
      spellingSequence
    );

}


document
  .getElementById(
    "spellingBackspace"
  )
  .onclick =
    function () {

      spellingSequence.pop();

      renderSpelling();

    };


document
  .getElementById(
    "spellingReset"
  )
  .onclick =
    loadSpelling;


document
  .getElementById(
    "spellingCheck"
  )
  .onclick =
    function () {

      const correct =
        spellingChallenges[
          spellingIndex
        ].formula;


      if (
        spellingSequence.join("|")
        ===
        correct.join("|")
      ) {

        document
          .getElementById(
            "spellingFeedback"
          )
          .textContent =
            "🐝 Correct!";


        rewardPlayer(10);


        spellingIndex =
          (
            spellingIndex + 1
          )
          %
          spellingChallenges.length;


        setTimeout(
          loadSpelling,
          900
        );

      }

      else {

        document
          .getElementById(
            "spellingFeedback"
          )
          .textContent =
            "Not quite.";

      }

    };


/* ==========================================================
   QUEEN BEE
========================================================== */

let queenAtoms =
  [];


function loadQueen() {

  queenAtoms =
    [];


  document
    .getElementById(
      "queenPrompt"
    )
    .textContent =
      "Build water around the Queen oxygen.";


  const hive =
    document.getElementById(
      "queenHive"
    );


  hive.innerHTML =
    "<h2>👑 O</h2>";


  const tiles =
    document.getElementById(
      "queenTiles"
    );


  tiles.innerHTML =
    "";


  ["H","H","C","Na"]
  .forEach(
    function (
      symbol
    ) {

      const tile =
        createHex(
          symbol
        );


      tile.onclick =
        function () {

          queenAtoms.push(
            symbol
          );


          hive.innerHTML =
            "<h2>👑 O</h2>"
            +
            "<p>"
            +
            queenAtoms.join(" • ")
            +
            "</p>";

      };


      tiles.appendChild(
        tile
      );

    }
  );

}


document
  .getElementById(
    "queenReset"
  )
  .onclick =
    loadQueen;


document
  .getElementById(
    "queenCheck"
  )
  .onclick =
    function () {

      const correct =
        queenAtoms.length ===
        2
        &&
        queenAtoms.every(
          function (
            atom
          ) {

            return atom === "H";

          }
        );


      document
        .getElementById(
          "queenFeedback"
        )
        .textContent =
          correct
          ?
            "👑 Correct — H₂O!"
          :
            "Not quite.";

    };


/* ==========================================================
   WORKER BEE
========================================================== */

let p = 0;
let n = 0;
let e = 0;


function updateWorker() {

  protonCount.textContent =
    p;


  neutronCount.textContent =
    n;


  innerElectronCount.textContent =
    Math.min(e,2);


  outerElectronCount.textContent =
    Math.max(e - 2,0);

}


function resetWorker() {

  p = 0;
  n = 0;
  e = 0;


  document
    .getElementById(
      "workerPrompt"
    )
    .textContent =
      "Build a neutral carbon-12 atom.";


  updateWorker();

}


addProton.onclick =
  function () {

    p++;

    updateWorker();

  };


addNeutron.onclick =
  function () {

    n++;

    updateWorker();

  };


addElectron.onclick =
  function () {

    e++;

    updateWorker();

  };


workerReset.onclick =
  resetWorker;


workerCheck.onclick =
  function () {

    workerFeedback.textContent =
      (
        p === 6
        &&
        n === 6
        &&
        e === 6
      )
      ?
        "🔧 Correct — Carbon-12!"
      :
        "Not quite.";

  };


/* ==========================================================
   POLLINATION
========================================================== */

const pollinationChallenges = [

  {
    flower: "Cl⁻",
    pollen: "Na⁺",
    needed: 1,
    formula: "NaCl"
  },

  {
    flower: "O²⁻",
    pollen: "Na⁺",
    needed: 2,
    formula: "Na₂O"
  },

  {
    flower: "S²⁻",
    pollen: "K⁺",
    needed: 2,
    formula: "K₂S"
  },

  {
    flower: "Ca²⁺",
    pollen: "Cl⁻",
    needed: 2,
    formula: "CaCl₂"
  }

];


let pollenIndex =
  0;


let delivered =
  0;


function loadPollination() {

  delivered =
    0;


  const challenge =
    pollinationChallenges[
      pollenIndex
    ];


  flowerIon.textContent =
    challenge.flower;


  pollinationPrompt.textContent =
    "Balance "
    +
    challenge.flower
    +
    " using "
    +
    challenge.pollen
    +
    " pollen.";


  pollenBank.innerHTML =
    "";


  deliveredPollen.innerHTML =
    "";


  for (
    let i = 0;
    i < 4;
    i++
  ) {

    const pollen =
      document.createElement(
        "button"
      );


    pollen.className =
      "pollen-piece";


    pollen.textContent =
      challenge.pollen;


    pollen.onclick =
      function () {

        if (
          pollen.classList.contains(
            "used"
          )
        ) {

          return;

        }


        pollen.classList.add(
          "used"
        );


        delivered++;


        const token =
          document.createElement(
            "span"
          );


        token.className =
          "delivered-token";


        token.textContent =
          challenge.pollen;


        deliveredPollen.appendChild(
          token
        );

      };


    pollenBank.appendChild(
      pollen
    );

  }

}


pollinationReset.onclick =
  loadPollination;


pollinationCheck.onclick =
  function () {

    const challenge =
      pollinationChallenges[
        pollenIndex
      ];


    if (
      delivered ===
      challenge.needed
    ) {

      pollinationResult.textContent =
        "🌼 "
        +
        challenge.formula;


      pollinationFeedback.textContent =
        "Charges balanced!";


      pollenIndex =
        (
          pollenIndex + 1
        )
        %
        pollinationChallenges.length;


      setTimeout(
        loadPollination,
        1000
      );

    }

    else {

      pollinationFeedback.textContent =
        "Charge mismatch.";

    }

  };


/* ==========================================================
   START
========================================================== */

updatePlayerDisplay();

loadWeeklyBuzzword();

loadSpelling();

loadQueen();

resetWorker();

loadPollination();


});
