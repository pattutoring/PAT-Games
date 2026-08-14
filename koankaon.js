document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   KOAN~KAON
   PAT LEARNING LAB

   PUZZLE DATABASE

   IMPORTANT:

   The LAST puzzle in each database becomes
   the current puzzle automatically.

   Earlier puzzles automatically move
   into the Archive.
========================================================== */


/* ==========================================================
   GENERAL PUZZLES
========================================================== */

const generalPuzzles = [

  {

    number:
      "001",

    title:
      "Puzzle #001",

    subtitle:
      "Symmetry-Bending Word Game",

    difficulty:
      "Foundational",


    /*
      SOLVED GRID

      KAON
      OGRE
      ARCS
      NAST

      Reading vertically:

      KOAN
      AGRA
      ORCS
      NEST
    */

    solution: [

      ["K", "A", "O", "N"],

      ["O", "G", "R", "E"],

      ["A", "R", "C", "S"],

      ["N", "A", "S", "T"]

    ],


    transverse: [

      {

        number:
          1,

        clue:
          "Koan decays into ‘quark-y’ pairable.",

        enumeration:
          "(4)",

        answer:
          "KAON",

        row:
          0

      },


      {

        number:
          5,

        clue:
          "Core gory goblin?",

        enumeration:
          "(4)",

        answer:
          "OGRE",

        row:
          1

      },


      {

        number:
          6,

        clue:
          "Fight-back, minus head of personal-narratives.",

        enumeration:
          "(4)",

        answer:
          "ARCS",

        row:
          2

      },


      {

        number:
          7,

        clue:
          "Cartoony ants cartoonists.",

        enumeration:
          "(4)",

        answer:
          "NAST",

        row:
          3

      }

    ],


    conjugate: [

      {

        number:
          1,

        clue:
          "Koan symmetry-breakings particle.",

        enumeration:
          "(4)",

        answer:
          "KOAN",

        column:
          0

      },


      {

        number:
          2,

        clue:
          "Indian city lives in the heart of vagrant.",

        enumeration:
          "(4)",

        answer:
          "AGRA",

        column:
          1

      },


      {

        number:
          3,

        clue:
          "Rewound scroll, two fifties taken by trolls.",

        enumeration:
          "(4)",

        answer:
          "ORCS",

        column:
          2

      },


      {

        number:
          4,

        clue:
          "Make your bed from tens, now lie in it.",

        enumeration:
          "(4)",

        answer:
          "NEST",

        column:
          3

      }

    ]

  }


  /*
  ==========================================================
  FUTURE GENERAL PUZZLE

  When #002 is ready:

  add a comma after Puzzle #001
  and place the next object here.

  Example:

  ,

  {

    number: "002",

    title: "Puzzle #002",

    subtitle: "Your subtitle",

    difficulty: "Medium",

    solution: [

      ["A","B","C","D"],
      ["E","F","G","H"],
      ["I","J","K","L"],
      ["M","N","O","P"]

    ],

    transverse: [

      {
        number: 1,
        clue: "Clue here",
        enumeration: "(4)",
        answer: "ABCD",
        row: 0
      }

    ],

    conjugate: [

      {
        number: 1,
        clue: "Clue here",
        enumeration: "(4)",
        answer: "AEIM",
        column: 0
      }

    ]

  }

  ==========================================================
  */

];



/* ==========================================================
   SU(2) MINI PUZZLES

   STANDARD MINI GEOMETRY:

   4 letters Transverse
   4 letters Conjugate

   TRANSVERSE letter #2
              =
   CONJUGATE letter #3

   JavaScript indexes:

   transverseIntersection = 1
   conjugateIntersection = 2
========================================================== */

const miniPuzzles = [

  {

    number:
      "001",

    title:
      "Mini #001",

    subtitle:
      "SU(2) Symmetry Mini",

    difficulty:
      "Foundational",


    /*
      This first digital Mini is configured
      as a four-letter cross so the engine
      follows the permanent Mini rule.

      We can replace ONLY this data block
      with the exact first physical Mini
      once we confirm its four-letter pair.

      Nothing else in the game will need
      to change.
    */


    transverseClue:
      "A small symmetry puzzle waiting to be collapsed.",

    transverseEnumeration:
      "(4)",

    transverseAnswer:
      "NODE",


    conjugateClue:
      "A crossing point where two directions meet.",

    conjugateEnumeration:
      "(4)",

    conjugateAnswer:
      "AXIS",


    /*
      NODE second letter = O

      AXIS third letter = I

      Those do NOT intersect.

      Therefore we use the pair below
      in the actual starter data.
    */


    across:
      "KNOT",

    down:
      "ANON",


    acrossClue:
      "A semantic tangle to be untied.",

    downClue:
      "Nameless, hidden behind the clue.",


    /*
      KNOT:

      K [N] O T
         ↑
      second letter = N


      ANON:

      A
      N
     [O]
      N

      Third letter would be O, so this
      pair also would not satisfy our rule.

      Rather than silently use incorrect
      geometry, the engine below validates
      every Mini before loading it.

      Until the exact Mini #001 pair is
      entered, this puzzle displays a
      configuration message.

      THIS PREVENTS BAD PUZZLE DATA.
    */


    transverseIntersection:
      1,

    conjugateIntersection:
      2

  }

];



/* ==========================================================
   CURRENT PUZZLES
========================================================== */

const currentGeneral =
  generalPuzzles[
    generalPuzzles.length - 1
  ];


const currentMini =
  miniPuzzles[
    miniPuzzles.length - 1
  ];


let activeGeneral =
  currentGeneral;


let activeMini =
  currentMini;



/* ==========================================================
   SCREEN ELEMENTS
========================================================== */

const screens =
  document.querySelectorAll(
    ".screen"
  );


const homeScreen =
  document.getElementById(
    "homeScreen"
  );


const generalScreen =
  document.getElementById(
    "generalScreen"
  );


const miniScreen =
  document.getElementById(
    "miniScreen"
  );


const archiveScreen =
  document.getElementById(
    "archiveScreen"
  );



/* ==========================================================
   NAVIGATION
========================================================== */

function showScreen(
  screenId
) {

  screens.forEach(
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
      screenId
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

          const destination =
            button.dataset.screen;


          if (
            destination ===
            "archiveScreen"
          ) {

            buildArchive();

          }


          showScreen(
            destination
          );

        }
      );

    }
  );



document
  .getElementById(
    "generalModeButton"
  )
  .addEventListener(
    "click",
    function () {

      activeGeneral =
        currentGeneral;


      loadGeneralPuzzle(
        activeGeneral
      );


      showScreen(
        "generalScreen"
      );

    }
  );



document
  .getElementById(
    "miniModeButton"
  )
  .addEventListener(
    "click",
    function () {

      activeMini =
        currentMini;


      loadMiniPuzzle(
        activeMini
      );


      showScreen(
        "miniScreen"
      );

    }
  );



document
  .getElementById(
    "archiveButton"
  )
  .addEventListener(
    "click",
    function () {

      buildArchive();


      showScreen(
        "archiveScreen"
      );

    }
  );



/* ==========================================================
   GENERAL GAME STATE
========================================================== */

let generalSelectedRow =
  0;


let generalSelectedColumn =
  0;


let generalDirection =
  "transverse";


let generalHintIndex =
  0;



/* ==========================================================
   GENERAL ELEMENTS
========================================================== */

const generalGrid =
  document.getElementById(
    "generalGrid"
  );


const generalAcrossClues =
  document.getElementById(
    "generalAcrossClues"
  );


const generalDownClues =
  document.getElementById(
    "generalDownClues"
  );


const generalFeedback =
  document.getElementById(
    "generalFeedback"
  );


const generalDirectionLabel =
  document.getElementById(
    "generalDirectionLabel"
  );


const generalSolvedPanel =
  document.getElementById(
    "generalSolvedPanel"
  );



/* ==========================================================
   GENERAL CELL NUMBERS

   Standard crossword numbering:

   Row 1:
   1 2 3 4

   Next across starts:
   5

   then 6

   then 7
========================================================== */

function getCellNumber(
  row,
  column
) {

  if (
    row === 0
  ) {

    return (
      column + 1
    );

  }


  if (
    column === 0
  ) {

    return (
      row + 4
    );

  }


  return null;

}



/* ==========================================================
   LOAD GENERAL PUZZLE
========================================================== */

function loadGeneralPuzzle(
  puzzle
) {

  activeGeneral =
    puzzle;


  generalSelectedRow =
    0;


  generalSelectedColumn =
    0;


  generalDirection =
    "transverse";


  generalHintIndex =
    0;


  document
    .getElementById(
      "generalPuzzleTitle"
    )
    .textContent =
      puzzle.title;


  document
    .getElementById(
      "generalPuzzleSubtitle"
    )
    .textContent =
      puzzle.subtitle;


  generalFeedback.textContent =
    "";


  generalSolvedPanel
    .classList
    .remove(
      "visible"
    );


  buildGeneralGrid();


  buildGeneralClues();


  selectGeneralCell(
    0,
    0,
    "transverse"
  );

}



/* ==========================================================
   BUILD GENERAL GRID
========================================================== */

function buildGeneralGrid() {

  generalGrid.innerHTML =
    "";


  for (
    let row = 0;
    row < 4;
    row++
  ) {

    for (
      let column = 0;
      column < 4;
      column++
    ) {

      const cell =
        document.createElement(
          "div"
        );


      cell.className =
        "crossword-cell";


      cell.dataset.row =
        row;


      cell.dataset.column =
        column;


      const number =
        getCellNumber(
          row,
          column
        );


      if (
        number !==
        null
      ) {

        const numberLabel =
          document.createElement(
            "span"
          );


        numberLabel.className =
          "cell-number";


        numberLabel.textContent =
          number;


        cell.appendChild(
          numberLabel
        );

      }


      const input =
        document.createElement(
          "input"
        );


      input.type =
        "text";


      input.maxLength =
        1;


      input.autocomplete =
        "off";


      input.autocapitalize =
        "characters";


      input.spellcheck =
        false;


      input.dataset.row =
        row;


      input.dataset.column =
        column;


      input.setAttribute(
        "aria-label",
        "Row "
        +
        (
          row + 1
        )
        +
        " column "
        +
        (
          column + 1
        )
      );


      input.addEventListener(
        "focus",
        function () {

          selectGeneralCell(
            row,
            column
          );

        }
      );


      input.addEventListener(
        "click",
        function () {

          if (
            generalSelectedRow ===
            row
            &&
            generalSelectedColumn ===
            column
          ) {

            toggleGeneralDirection();

          }

          else {

            selectGeneralCell(
              row,
              column
            );

          }

        }
      );


      input.addEventListener(
        "input",
        function (
          event
        ) {

          const value =
            event.target.value
              .toUpperCase()
              .replace(
                /[^A-Z]/g,
                ""
              );


          event.target.value =
            value;


          clearGeneralCheckStyles();


          if (
            value
          ) {

            moveGeneralForward();

          }

        }
      );


      input.addEventListener(
        "keydown",
        function (
          event
        ) {

          handleGeneralKeydown(
            event,
            row,
            column
          );

        }
      );


      cell.appendChild(
        input
      );


      generalGrid.appendChild(
        cell
      );

    }

  }

}



/* ==========================================================
   GENERAL CLUES
========================================================== */

function buildGeneralClues() {

  generalAcrossClues.innerHTML =
    "";


  generalDownClues.innerHTML =
    "";


  activeGeneral.transverse
    .forEach(
      function (
        clue
      ) {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "clue-button transverse-clue";


        button.dataset.direction =
          "transverse";


        button.dataset.index =
          clue.row;


        button.innerHTML =
          '<span class="clue-number">'
          +
          clue.number
          +
          '.</span> '
          +
          clue.clue
          +
          " "
          +
          clue.enumeration;


        button.addEventListener(
          "click",
          function () {

            selectGeneralCell(
              clue.row,
              0,
              "transverse"
            );


            focusGeneralCell(
              clue.row,
              0
            );

          }
        );


        generalAcrossClues.appendChild(
          button
        );

      }
    );


  activeGeneral.conjugate
    .forEach(
      function (
        clue
      ) {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "clue-button conjugate-clue";


        button.dataset.direction =
          "conjugate";


        button.dataset.index =
          clue.column;


        button.innerHTML =
          '<span class="clue-number">'
          +
          clue.number
          +
          '.</span> '
          +
          clue.clue
          +
          " "
          +
          clue.enumeration;


        button.addEventListener(
          "click",
          function () {

            selectGeneralCell(
              0,
              clue.column,
              "conjugate"
            );


            focusGeneralCell(
              0,
              clue.column
            );

          }
        );


        generalDownClues.appendChild(
          button
        );

      }
    );

}



/* ==========================================================
   GENERAL SELECTION
========================================================== */

function selectGeneralCell(
  row,
  column,
  forcedDirection
) {

  generalSelectedRow =
    row;


  generalSelectedColumn =
    column;


  if (
    forcedDirection
  ) {

    generalDirection =
      forcedDirection;

  }


  updateGeneralHighlight();

}



function toggleGeneralDirection() {

  generalDirection =
    generalDirection ===
    "transverse"
    ?
      "conjugate"
    :
      "transverse";


  updateGeneralHighlight();

}



/* ==========================================================
   GENERAL HIGHLIGHTING
========================================================== */

function updateGeneralHighlight() {

  document
    .querySelectorAll(
      ".crossword-cell"
    )
    .forEach(
      function (
        cell
      ) {

        cell.classList.remove(
          "active",
          "transverse-highlight",
          "conjugate-highlight"
        );

      }
    );


  document
    .querySelectorAll(
      ".clue-button"
    )
    .forEach(
      function (
        clue
      ) {

        clue.classList.remove(
          "active"
        );

      }
    );


  if (
    generalDirection ===
    "transverse"
  ) {

    document
      .querySelectorAll(
        '.crossword-cell[data-row="'
        +
        generalSelectedRow
        +
        '"]'
      )
      .forEach(
        function (
          cell
        ) {

          cell.classList.add(
            "transverse-highlight"
          );

        }
      );


    const clue =
      generalAcrossClues
        .querySelector(
          '[data-index="'
          +
          generalSelectedRow
          +
          '"]'
        );


    if (
      clue
    ) {

      clue.classList.add(
        "active"
      );

    }


    const data =
      activeGeneral.transverse[
        generalSelectedRow
      ];


    generalDirectionLabel.textContent =
      "TRANSVERSE "
      +
      data.number
      +
      " • "
      +
      data.clue;

  }

  else {

    document
      .querySelectorAll(
        '.crossword-cell[data-column="'
        +
        generalSelectedColumn
        +
        '"]'
      )
      .forEach(
        function (
          cell
        ) {

          cell.classList.add(
            "conjugate-highlight"
          );

        }
      );


    const clue =
      generalDownClues
        .querySelector(
          '[data-index="'
          +
          generalSelectedColumn
          +
          '"]'
        );


    if (
      clue
    ) {

      clue.classList.add(
        "active"
      );

    }


    const data =
      activeGeneral.conjugate[
        generalSelectedColumn
      ];


    generalDirectionLabel.textContent =
      "CONJUGATE "
      +
      data.number
      +
      " • "
      +
      data.clue;

  }


  const selected =
    generalGrid.querySelector(
      '[data-row="'
      +
      generalSelectedRow
      +
      '"][data-column="'
      +
      generalSelectedColumn
      +
      '"]'
    );


  if (
    selected
  ) {

    selected.classList.add(
      "active"
    );

  }

}



/* ==========================================================
   GENERAL FOCUS / MOVEMENT
========================================================== */

function getGeneralInput(
  row,
  column
) {

  return generalGrid.querySelector(
    'input[data-row="'
    +
    row
    +
    '"][data-column="'
    +
    column
    +
    '"]'
  );

}



function focusGeneralCell(
  row,
  column
) {

  const input =
    getGeneralInput(
      row,
      column
    );


  if (
    input
  ) {

    input.focus();


    input.select();

  }

}



function moveGeneralForward() {

  let row =
    generalSelectedRow;


  let column =
    generalSelectedColumn;


  if (
    generalDirection ===
    "transverse"
  ) {

    if (
      column < 3
    ) {

      column++;

    }

  }

  else {

    if (
      row < 3
    ) {

      row++;

    }

  }


  selectGeneralCell(
    row,
    column
  );


  focusGeneralCell(
    row,
    column
  );

}



function moveGeneralBackward() {

  let row =
    generalSelectedRow;


  let column =
    generalSelectedColumn;


  if (
    generalDirection ===
    "transverse"
  ) {

    if (
      column > 0
    ) {

      column--;

    }

  }

  else {

    if (
      row > 0
    ) {

      row--;

    }

  }


  selectGeneralCell(
    row,
    column
  );


  focusGeneralCell(
    row,
    column
  );

}



/* ==========================================================
   KEYBOARD NAVIGATION
========================================================== */

function handleGeneralKeydown(
  event,
  row,
  column
) {

  if (
    event.key ===
    "Backspace"
  ) {

    const input =
      event.target;


    if (
      input.value ===
      ""
    ) {

      event.preventDefault();


      moveGeneralBackward();

    }


    return;

  }


  if (
    event.key ===
    "ArrowRight"
  ) {

    event.preventDefault();


    generalDirection =
      "transverse";


    selectGeneralCell(
      row,
      Math.min(
        3,
        column + 1
      )
    );


    focusGeneralCell(
      row,
      Math.min(
        3,
        column + 1
      )
    );


    return;

  }


  if (
    event.key ===
    "ArrowLeft"
  ) {

    event.preventDefault();


    generalDirection =
      "transverse";


    selectGeneralCell(
      row,
      Math.max(
        0,
        column - 1
      )
    );


    focusGeneralCell(
      row,
      Math.max(
        0,
        column - 1
      )
    );


    return;

  }


  if (
    event.key ===
    "ArrowDown"
  ) {

    event.preventDefault();


    generalDirection =
      "conjugate";


    selectGeneralCell(
      Math.min(
        3,
        row + 1
      ),
      column
    );


    focusGeneralCell(
      Math.min(
        3,
        row + 1
      ),
      column
    );


    return;

  }


  if (
    event.key ===
    "ArrowUp"
  ) {

    event.preventDefault();


    generalDirection =
      "conjugate";


    selectGeneralCell(
      Math.max(
        0,
        row - 1
      ),
      column
    );


    focusGeneralCell(
      Math.max(
        0,
        row - 1
      ),
      column
    );

  }

}



/* ==========================================================
   GENERAL CHECKING
========================================================== */

function clearGeneralCheckStyles() {

  document
    .querySelectorAll(
      ".crossword-cell"
    )
    .forEach(
      function (
        cell
      ) {

        cell.classList.remove(
          "correct",
          "incorrect"
        );

      }
    );

}



function generalIsComplete() {

  const inputs =
    Array.from(
      generalGrid.querySelectorAll(
        "input"
      )
    );


  return inputs.every(
    function (
      input
    ) {

      return (
        input.value !==
        ""
      );

    }
  );

}



function generalIsSolved() {

  for (
    let row = 0;
    row < 4;
    row++
  ) {

    for (
      let column = 0;
      column < 4;
      column++
    ) {

      const input =
        getGeneralInput(
          row,
          column
        );


      if (
        input.value !==
        activeGeneral.solution[
          row
        ][
          column
        ]
      ) {

        return false;

      }

    }

  }


  return true;

}



function checkGeneral() {

  clearGeneralCheckStyles();


  let correct =
    0;


  let filled =
    0;


  for (
    let row = 0;
    row < 4;
    row++
  ) {

    for (
      let column = 0;
      column < 4;
      column++
    ) {

      const input =
        getGeneralInput(
          row,
          column
        );


      const cell =
        input.parentElement;


      if (
        input.value ===
        ""
      ) {

        continue;

      }


      filled++;


      if (
        input.value ===
        activeGeneral.solution[
          row
        ][
          column
        ]
      ) {

        correct++;


        cell.classList.add(
          "correct"
        );

      }

      else {

        cell.classList.add(
          "incorrect"
        );

      }

    }

  }


  if (
    generalIsSolved()
  ) {

    generalFeedback.textContent =
      "✦ Every letter satisfies both directions.";


    generalSolvedPanel
      .classList
      .add(
        "visible"
      );


    return;

  }


  if (
    filled ===
    0
  ) {

    generalFeedback.textContent =
      "Enter some letters before checking.";


    return;

  }


  if (
    generalIsComplete()
  ) {

    generalFeedback.textContent =
      correct
      +
      " of 16 cells are currently correct.";


    return;

  }


  generalFeedback.textContent =
    correct
    +
    " of "
    +
    filled
    +
    " entered letters are correct.";

}



/* ==========================================================
   GENERAL HINT
========================================================== */

function hintGeneral() {

  const inputs =
    Array.from(
      generalGrid.querySelectorAll(
        "input"
      )
    );


  const candidates =
    inputs.filter(
      function (
        input
      ) {

        const row =
          Number(
            input.dataset.row
          );


        const column =
          Number(
            input.dataset.column
          );


        return (
          input.value !==
          activeGeneral.solution[
            row
          ][
            column
          ]
        );

      }
    );


  if (
    candidates.length ===
    0
  ) {

    generalFeedback.textContent =
      "There are no letters left to reveal.";


    return;

  }


  const target =
    candidates[
      generalHintIndex %
      candidates.length
    ];


  generalHintIndex++;


  const row =
    Number(
      target.dataset.row
    );


  const column =
    Number(
      target.dataset.column
    );


  target.value =
    activeGeneral.solution[
      row
    ][
      column
    ];


  selectGeneralCell(
    row,
    column
  );


  clearGeneralCheckStyles();


  generalFeedback.textContent =
    "✦ One symmetry point revealed.";

}



/* ==========================================================
   GENERAL CLEAR / REVEAL
========================================================== */

function clearGeneral() {

  generalGrid
    .querySelectorAll(
      "input"
    )
    .forEach(
      function (
        input
      ) {

        input.value =
          "";

      }
    );


  clearGeneralCheckStyles();


  generalSolvedPanel
    .classList
    .remove(
      "visible"
    );


  generalFeedback.textContent =
    "Grid cleared.";


  selectGeneralCell(
    0,
    0,
    "transverse"
  );

}



function revealGeneral() {

  const confirmed =
    window.confirm(
      "Reveal the entire KOAN~KAON solution?"
    );


  if (
    !confirmed
  ) {

    return;

  }


  for (
    let row = 0;
    row < 4;
    row++
  ) {

    for (
      let column = 0;
      column < 4;
      column++
    ) {

      getGeneralInput(
        row,
        column
      ).value =
        activeGeneral.solution[
          row
        ][
          column
        ];

    }

  }


  clearGeneralCheckStyles();


  generalFeedback.textContent =
    "Solution revealed.";


  generalSolvedPanel
    .classList
    .add(
      "visible"
    );

}



document
  .getElementById(
    "generalCheck"
  )
  .addEventListener(
    "click",
    checkGeneral
  );


document
  .getElementById(
    "generalHint"
  )
  .addEventListener(
    "click",
    hintGeneral
  );


document
  .getElementById(
    "generalClear"
  )
  .addEventListener(
    "click",
    clearGeneral
  );


document
  .getElementById(
    "generalReveal"
  )
  .addEventListener(
    "click",
    revealGeneral
  );



/* ==========================================================
   MINI GAME
========================================================== */

const miniGrid =
  document.getElementById(
    "miniGrid"
  );


const miniFeedback =
  document.getElementById(
    "miniFeedback"
  );


const miniAcrossClue =
  document.getElementById(
    "miniAcrossClue"
  );


const miniDownClue =
  document.getElementById(
    "miniDownClue"
  );


const miniSolvedPanel =
  document.getElementById(
    "miniSolvedPanel"
  );


let miniSelectedDirection =
  "transverse";


let miniHintCounter =
  0;


/* ==========================================================
   VALIDATE MINI DATA
========================================================== */

function miniIsValid(
  puzzle
) {

  if (
    !puzzle.across
    ||
    !puzzle.down
  ) {

    return false;

  }


  const acrossIndex =
    puzzle.transverseIntersection;


  const downIndex =
    puzzle.conjugateIntersection;


  if (
    puzzle.across.length !==
    4
    ||
    puzzle.down.length !==
    4
  ) {

    return false;

  }


  return (
    puzzle.across[
      acrossIndex
    ]
    ===
    puzzle.down[
      downIndex
    ]
  );

}



/* ==========================================================
   LOAD MINI
========================================================== */

function loadMiniPuzzle(
  puzzle
) {

  activeMini =
    puzzle;


  miniHintCounter =
    0;


  miniSelectedDirection =
    "transverse";


  document
    .getElementById(
      "miniPuzzleTitle"
    )
    .textContent =
      puzzle.title;


  document
    .getElementById(
      "miniPuzzleSubtitle"
    )
    .textContent =
      puzzle.subtitle;


  miniFeedback.textContent =
    "";


  miniSolvedPanel
    .classList
    .remove(
      "visible"
    );


  if (
    !miniIsValid(
      puzzle
    )
  ) {

    buildMiniConfigurationNotice(
      puzzle
    );


    return;

  }


  buildMiniGrid(
    puzzle
  );


  buildMiniClues(
    puzzle
  );

}



/* ==========================================================
   MINI CONFIGURATION NOTICE

   Prevents us from displaying an invalid
   intersection while the exact Mini #001
   data is being entered.
========================================================== */

function buildMiniConfigurationNotice(
  puzzle
) {

  miniGrid.innerHTML =
    "";


  const notice =
    document.createElement(
      "div"
    );


  notice.style.position =
    "absolute";


  notice.style.left =
    "50%";


  notice.style.top =
    "50%";


  notice.style.transform =
    "translate(-50%, -50%)";


  notice.style.width =
    "80%";


  notice.style.padding =
    "22px";


  notice.style.border =
    "2px dashed #d2a23c";


  notice.style.borderRadius =
    "16px";


  notice.style.background =
    "#fff8e8";


  notice.style.lineHeight =
    "1.5";


  notice.innerHTML =
    "<strong>SU(2) Mini #"
    +
    puzzle.number
    +
    "</strong>"
    +
    "<br><br>"
    +
    "The interactive Mini engine is ready."
    +
    "<br>"
    +
    "We only need to enter the exact four-letter Transverse and Conjugate answers from your original puzzle.";


  miniGrid.appendChild(
    notice
  );


  miniAcrossClue.textContent =
    puzzle.acrossClue
    +
    " (4)";


  miniDownClue.textContent =
    puzzle.downClue
    +
    " (4)";


  miniFeedback.textContent =
    "Mini geometry requires Transverse[2] = Conjugate[3].";

}



/* ==========================================================
   BUILD MINI CROSS
========================================================== */

function buildMiniGrid(
  puzzle
) {

  miniGrid.innerHTML =
    "";


  /*
    Cell size = 82px.

    Transverse is positioned as:

        □ □ □ □

    Down intersects through:

          □
          □
      □ [□] □ □
          □

    Shared cell:

    across index 1
    down index 2
  */


  const cellSize =
    82;


  const centerX =
    210;


  const centerY =
    210;


  const acrossStartX =
    centerX -
    cellSize *
    1.5;


  const acrossY =
    centerY -
    cellSize /
    2;


  const sharedX =
    acrossStartX +
    cellSize;


  const downStartY =
    acrossY -
    cellSize *
    2;


  /*
    TRANSVERSE CELLS
  */

  for (
    let index = 0;
    index < 4;
    index++
  ) {

    const cell =
      createMiniCell(
        "transverse",
        index
      );


    cell.style.left =
      (
        acrossStartX +
        index *
        cellSize
      )
      +
      "px";


    cell.style.top =
      acrossY +
      "px";


    if (
      index ===
      puzzle.transverseIntersection
    ) {

      cell.classList.add(
        "shared-cell"
      );


      cell.dataset.shared =
        "true";

    }


    miniGrid.appendChild(
      cell
    );

  }


  /*
    CONJUGATE CELLS

    Do not create a second input
    at the shared intersection.
  */

  for (
    let index = 0;
    index < 4;
    index++
  ) {

    if (
      index ===
      puzzle.conjugateIntersection
    ) {

      continue;

    }


    const cell =
      createMiniCell(
        "conjugate",
        index
      );


    cell.style.left =
      sharedX +
      "px";


    cell.style.top =
      (
        downStartY +
        index *
        cellSize
      )
      +
      "px";


    miniGrid.appendChild(
      cell
    );

  }


  /*
    AXIS LABELS
  */

  const transverseLabel =
    document.createElement(
      "div"
    );


  transverseLabel.className =
    "mini-axis-label transverse";


  transverseLabel.textContent =
    "T • TRANSVERSE";


  transverseLabel.style.left =
    centerX +
    "px";


  transverseLabel.style.top =
    (
      acrossY +
      cellSize +
      16
    )
    +
    "px";


  miniGrid.appendChild(
    transverseLabel
  );


  const conjugateLabel =
    document.createElement(
      "div"
    );


  conjugateLabel.className =
    "mini-axis-label conjugate";


  conjugateLabel.textContent =
    "C • CONJUGATE";


  conjugateLabel.style.left =
    (
      sharedX -
      24
    )
    +
    "px";


  conjugateLabel.style.top =
    centerY +
    "px";


  miniGrid.appendChild(
    conjugateLabel
  );


  highlightMiniDirection();

}



/* ==========================================================
   CREATE MINI CELL
========================================================== */

function createMiniCell(
  direction,
  index
) {

  const cell =
    document.createElement(
      "div"
    );


  cell.className =
    "mini-cell "
    +
    (
      direction ===
      "transverse"
      ?
        "transverse-cell"
      :
        "conjugate-cell"
    );


  cell.dataset.direction =
    direction;


  cell.dataset.index =
    index;


  const input =
    document.createElement(
      "input"
    );


  input.type =
    "text";


  input.maxLength =
    1;


  input.autocomplete =
    "off";


  input.autocapitalize =
    "characters";


  input.spellcheck =
    false;


  input.dataset.direction =
    direction;


  input.dataset.index =
    index;


  input.addEventListener(
    "focus",
    function () {

      miniSelectedDirection =
        direction;


      highlightMiniDirection();

    }
  );


  input.addEventListener(
    "input",
    function (
      event
    ) {

      event.target.value =
        event.target.value
          .toUpperCase()
          .replace(
            /[^A-Z]/g,
            ""
          );


      clearMiniCheckStyles();

    }
  );


  cell.appendChild(
    input
  );


  return cell;

}



/* ==========================================================
   MINI CLUES
========================================================== */

function buildMiniClues(
  puzzle
) {

  miniAcrossClue.textContent =
    puzzle.acrossClue
    +
    " (4)";


  miniDownClue.textContent =
    puzzle.downClue
    +
    " (4)";


  miniAcrossClue.onclick =
    function () {

      miniSelectedDirection =
        "transverse";


      highlightMiniDirection();

    };


  miniDownClue.onclick =
    function () {

      miniSelectedDirection =
        "conjugate";


      highlightMiniDirection();

    };

}



/* ==========================================================
   MINI INPUT HELPERS
========================================================== */

function getMiniSharedInput() {

  const shared =
    miniGrid.querySelector(
      ".shared-cell input"
    );


  return shared;

}



function getMiniInput(
  direction,
  index
) {

  if (
    direction ===
    "conjugate"
    &&
    index ===
    activeMini.conjugateIntersection
  ) {

    return getMiniSharedInput();

  }


  return miniGrid.querySelector(
    'input[data-direction="'
    +
    direction
    +
    '"][data-index="'
    +
    index
    +
    '"]'
  );

}



/* ==========================================================
   MINI HIGHLIGHT
========================================================== */

function highlightMiniDirection() {

  miniGrid
    .querySelectorAll(
      ".mini-cell"
    )
    .forEach(
      function (
        cell
      ) {

        cell.classList.remove(
          "active"
        );

      }
    );


  miniGrid
    .querySelectorAll(
      '.mini-cell.'
      +
      (
        miniSelectedDirection ===
        "transverse"
        ?
          "transverse-cell"
        :
          "conjugate-cell"
      )
    )
    .forEach(
      function (
        cell
      ) {

        cell.classList.add(
          "active"
        );

      }
    );


  const shared =
    miniGrid.querySelector(
      ".shared-cell"
    );


  if (
    shared
  ) {

    shared.classList.add(
      "active"
    );

  }


  miniAcrossClue.classList.remove(
    "active",
    "transverse-clue",
    "conjugate-clue"
  );


  miniDownClue.classList.remove(
    "active",
    "transverse-clue",
    "conjugate-clue"
  );


  miniAcrossClue.classList.add(
    "transverse-clue"
  );


  miniDownClue.classList.add(
    "conjugate-clue"
  );


  if (
    miniSelectedDirection ===
    "transverse"
  ) {

    miniAcrossClue.classList.add(
      "active"
    );

  }

  else {

    miniDownClue.classList.add(
      "active"
    );

  }

}



/* ==========================================================
   MINI CHECK
========================================================== */

function clearMiniCheckStyles() {

  miniGrid
    .querySelectorAll(
      ".mini-cell"
    )
    .forEach(
      function (
        cell
      ) {

        cell.classList.remove(
          "correct",
          "incorrect"
        );

      }
    );

}



function getMiniWord(
  direction
) {

  let word =
    "";


  for (
    let index = 0;
    index < 4;
    index++
  ) {

    const input =
      getMiniInput(
        direction,
        index
      );


    word +=
      input
      ?
        input.value
        :
        "";

  }


  return word;

}



function checkMini() {

  if (
    !miniIsValid(
      activeMini
    )
  ) {

    miniFeedback.textContent =
      "Mini #001 needs its final four-letter answer pair entered first.";


    return;

  }


  clearMiniCheckStyles();


  const across =
    getMiniWord(
      "transverse"
    );


  const down =
    getMiniWord(
      "conjugate"
    );


  const acrossCorrect =
    across ===
    activeMini.across;


  const downCorrect =
    down ===
    activeMini.down;


  if (
    acrossCorrect
    &&
    downCorrect
  ) {

    miniFeedback.textContent =
      "✣ Both directions collapse through the shared letter.";


    miniSolvedPanel
      .classList
      .add(
        "visible"
      );


    miniGrid
      .querySelectorAll(
        ".mini-cell"
      )
      .forEach(
        function (
          cell
        ) {

          cell.classList.add(
            "correct"
          );

        }
      );


    return;

  }


  miniFeedback.textContent =
    "The symmetry has not closed yet. Re-examine both clues.";

}



/* ==========================================================
   MINI HINT
========================================================== */

function hintMini() {

  if (
    !miniIsValid(
      activeMini
    )
  ) {

    miniFeedback.textContent =
      "Mini puzzle data still needs its exact answer pair.";


    return;

  }


  const candidates =
    [];


  [
    "transverse",
    "conjugate"
  ]
    .forEach(
      function (
        direction
      ) {

        for (
          let index = 0;
          index < 4;
          index++
        ) {

          const input =
            getMiniInput(
              direction,
              index
            );


          const answer =
            direction ===
            "transverse"
            ?
              activeMini.across
            :
              activeMini.down;


          if (
            input
            &&
            input.value !==
            answer[
              index
            ]
          ) {

            if (
              !candidates.includes(
                input
              )
            ) {

              candidates.push(
                input
              );

            }

          }

        }

      }
    );


  if (
    candidates.length ===
    0
  ) {

    miniFeedback.textContent =
      "No letters left to reveal.";


    return;

  }


  const input =
    candidates[
      miniHintCounter %
      candidates.length
    ];


  miniHintCounter++;


  const direction =
    input.dataset.direction;


  const index =
    Number(
      input.dataset.index
    );


  if (
    input.closest(
      ".shared-cell"
    )
  ) {

    input.value =
      activeMini.across[
        activeMini.transverseIntersection
      ];

  }

  else {

    const answer =
      direction ===
      "transverse"
      ?
        activeMini.across
      :
        activeMini.down;


    input.value =
      answer[
        index
      ];

  }


  miniFeedback.textContent =
    "✦ One intersection point revealed.";

}



/* ==========================================================
   MINI CLEAR
========================================================== */

function clearMini() {

  miniGrid
    .querySelectorAll(
      "input"
    )
    .forEach(
      function (
        input
      ) {

        input.value =
          "";

      }
    );


  clearMiniCheckStyles();


  miniSolvedPanel
    .classList
    .remove(
      "visible"
    );


  miniFeedback.textContent =
    "Mini cleared.";

}



/* ==========================================================
   MINI REVEAL
========================================================== */

function revealMini() {

  if (
    !miniIsValid(
      activeMini
    )
  ) {

    miniFeedback.textContent =
      "Mini puzzle data still needs its exact answer pair.";


    return;

  }


  const confirmed =
    window.confirm(
      "Reveal both Mini answers?"
    );


  if (
    !confirmed
  ) {

    return;

  }


  for (
    let index = 0;
    index < 4;
    index++
  ) {

    getMiniInput(
      "transverse",
      index
    ).value =
      activeMini.across[
        index
      ];


    getMiniInput(
      "conjugate",
      index
    ).value =
      activeMini.down[
        index
      ];

  }


  miniFeedback.textContent =
    "Mini solution revealed.";


  miniSolvedPanel
    .classList
    .add(
      "visible"
    );

}



/* ==========================================================
   MINI CONTROLS
========================================================== */

document
  .getElementById(
    "miniCheck"
  )
  .addEventListener(
    "click",
    checkMini
  );


document
  .getElementById(
    "miniHint"
  )
  .addEventListener(
    "click",
    hintMini
  );


document
  .getElementById(
    "miniClear"
  )
  .addEventListener(
    "click",
    clearMini
  );


document
  .getElementById(
    "miniReveal"
  )
  .addEventListener(
    "click",
    revealMini
  );



/* ==========================================================
   ARCHIVE
========================================================== */

const archiveGeneralTab =
  document.getElementById(
    "archiveGeneralTab"
  );


const archiveMiniTab =
  document.getElementById(
    "archiveMiniTab"
  );


const archiveGeneralList =
  document.getElementById(
    "archiveGeneralList"
  );


const archiveMiniList =
  document.getElementById(
    "archiveMiniList"
  );



function buildArchive() {

  buildGeneralArchive();


  buildMiniArchive();

}



/* ==========================================================
   GENERAL ARCHIVE
========================================================== */

function buildGeneralArchive() {

  archiveGeneralList.innerHTML =
    "";


  const archived =
    generalPuzzles
      .slice(
        0,
        -1
      )
      .reverse();


  if (
    archived.length ===
    0
  ) {

    archiveGeneralList.innerHTML =

      '<div class="empty-archive">'
      +
      'General Puzzle #001 is currently live.'
      +
      '<br><br>'
      +
      'When Puzzle #002 is released, #001 will automatically move here.'
      +
      '</div>';


    return;

  }


  archived.forEach(
    function (
      puzzle
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "archive-card";


      card.innerHTML =

        '<div class="archive-top">'
        +

          '<span class="archive-number">'
          +
            'PUZZLE #'
            +
            puzzle.number
          +
          '</span>'
          +

          '<span class="archive-type general">'
          +
            'GENERAL'
          +
          '</span>'

        +
        '</div>'

        +

        '<div class="archive-title">'
        +
          puzzle.title
        +
        '</div>'

        +

        '<div class="archive-description">'
        +
          puzzle.subtitle
        +
          ' • '
        +
          puzzle.difficulty
        +
        '</div>'

        +

        '<button class="archive-play-button" type="button">'
        +
          'Play Archived Puzzle'
        +
        '</button>';


      card
        .querySelector(
          ".archive-play-button"
        )
        .addEventListener(
          "click",
          function () {

            activeGeneral =
              puzzle;


            loadGeneralPuzzle(
              puzzle
            );


            showScreen(
              "generalScreen"
            );

          }
        );


      archiveGeneralList.appendChild(
        card
      );

    }
  );

}



/* ==========================================================
   MINI ARCHIVE
========================================================== */

function buildMiniArchive() {

  archiveMiniList.innerHTML =
    "";


  const archived =
    miniPuzzles
      .slice(
        0,
        -1
      )
      .reverse();


  if (
    archived.length ===
    0
  ) {

    archiveMiniList.innerHTML =

      '<div class="empty-archive">'
      +
      'SU(2) Mini #001 is currently live.'
      +
      '<br><br>'
      +
      'When Mini #002 is released, #001 will automatically move here.'
      +
      '</div>';


    return;

  }


  archived.forEach(
    function (
      puzzle
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "archive-card";


      card.innerHTML =

        '<div class="archive-top">'
        +

          '<span class="archive-number">'
          +
            'MINI #'
            +
            puzzle.number
          +
          '</span>'
          +

          '<span class="archive-type mini">'
          +
            'SU(2) MINI'
          +
          '</span>'

        +
        '</div>'

        +

        '<div class="archive-title">'
        +
          puzzle.title
        +
        '</div>'

        +

        '<div class="archive-description">'
        +
          puzzle.subtitle
        +
          ' • '
        +
          puzzle.difficulty
        +
        '</div>'

        +

        '<button class="archive-play-button" type="button">'
        +
          'Play Archived Mini'
        +
        '</button>';


      card
        .querySelector(
          ".archive-play-button"
        )
        .addEventListener(
          "click",
          function () {

            activeMini =
              puzzle;


            loadMiniPuzzle(
              puzzle
            );


            showScreen(
              "miniScreen"
            );

          }
        );


      archiveMiniList.appendChild(
        card
      );

    }
  );

}



/* ==========================================================
   ARCHIVE TABS
========================================================== */

archiveGeneralTab
  .addEventListener(
    "click",
    function () {

      archiveGeneralTab
        .classList
        .add(
          "active"
        );


      archiveMiniTab
        .classList
        .remove(
          "active"
        );


      archiveGeneralList
        .classList
        .add(
          "active"
        );


      archiveMiniList
        .classList
        .remove(
          "active"
        );

    }
  );



archiveMiniTab
  .addEventListener(
    "click",
    function () {

      archiveMiniTab
        .classList
        .add(
          "active"
        );


      archiveGeneralTab
        .classList
        .remove(
          "active"
        );


      archiveMiniList
        .classList
        .add(
          "active"
        );


      archiveGeneralList
        .classList
        .remove(
          "active"
        );

    }
  );



/* ==========================================================
   START
========================================================== */

loadGeneralPuzzle(
  currentGeneral
);


buildArchive();


});
