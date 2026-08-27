document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   KOAN~KAON
   PAT LEARNING LAB

   PROFILE.JS V3 COMPATIBLE

   CURRENT RULES

   SU(1)
   - Genuine solve:
     XP + completion + mastery
   - Current puzzle:
     advances koan_one streak
   - Archived puzzle:
     does NOT advance koan_one streak
   - Reveal:
     no XP / completion / streak

   SU(2)
   - Genuine solve:
     XP + completion + mastery
   - Current puzzle:
     advances koan_two streak
   - Archived puzzle:
     does NOT advance koan_two streak
   - Reveal:
     no XP / completion / streak

   LAST PUZZLE IN EACH DATABASE = CURRENT
========================================================== */



/* ==========================================================
   ANALYTICS
========================================================== */

function trackEvent(
  eventName,
  mode,
  puzzleNumber,
  extraData
) {

  if (
    typeof gtag !==
    "function"
  ) {

    return;

  }


  const data = {

    game_name:
      "koan_kaon",

    mode:
      mode,

    puzzle_number:
      puzzleNumber

  };


  if (
    extraData
  ) {

    Object.assign(
      data,
      extraData
    );

  }


  gtag(
    "event",
    eventName,
    data
  );

}



/* ==========================================================
   PROFILE HELPERS
========================================================== */

function profileAvailable() {

  return Boolean(

    window.PATProfile

    &&
    typeof PATProfile.get ===
    "function"

  );

}



function archiveUnlocked() {

  if (
    !profileAvailable()

    ||
    typeof PATProfile.canAccessArchive !==
    "function"
  ) {

    return false;

  }


  return PATProfile
    .canAccessArchive();

}



function refreshKoanProfile() {

  if (
    typeof window.renderKoanProfile ===
    "function"
  ) {

    window.renderKoanProfile();

  }

}



/* ==========================================================
   PROFILE COMPLETION FLAGS

   Prevent repeat completion calls during
   the same loaded puzzle.
========================================================== */

let generalProfileCompletionHandled =
  false;


let miniProfileCompletionHandled =
  false;



/* ==========================================================
   ARCHIVE STATE
========================================================== */

let generalIsArchived =
  false;


let miniIsArchived =
  false;



/* ==========================================================
   COMPLETE SU(1)

   CURRENT:
   - XP
   - completion
   - mastery
   - koan_one release streak

   ARCHIVED:
   - XP
   - completion
   - mastery
   - NO live release streak
========================================================== */

function completeGeneralProfile() {

  if (
    generalProfileCompletionHandled
  ) {

    return null;

  }


  generalProfileCompletionHandled =
    true;


  if (
    !profileAvailable()

    ||
    typeof PATProfile.complete !==
    "function"
  ) {

    return null;

  }


  const options = {

    mastery: {

      puzzlesSolved:
        1

    }

  };


  if (
    !generalIsArchived
  ) {

    options.streakKey =
      "koan_one";

  }


  const result =
    PATProfile.complete(

      "koan_kaon",

      "su1-" +
      activeGeneral.number,

      options

    );


  refreshKoanProfile();


  return result;

}



/* ==========================================================
   COMPLETE SU(2)

   CURRENT:
   - XP
   - completion
   - mastery
   - koan_two release streak

   ARCHIVED:
   - XP
   - completion
   - mastery
   - NO live release streak
========================================================== */

function completeMiniProfile() {

  if (
    miniProfileCompletionHandled
  ) {

    return null;

  }


  miniProfileCompletionHandled =
    true;


  if (
    !profileAvailable()

    ||
    typeof PATProfile.complete !==
    "function"
  ) {

    return null;

  }


  const options = {

    mastery: {

      puzzlesSolved:
        1

    }

  };


  if (
    !miniIsArchived
  ) {

    options.streakKey =
      "koan_two";

  }


  const result =
    PATProfile.complete(

      "koan_kaon",

      "su2-" +
      activeMini.number,

      options

    );


  refreshKoanProfile();


  return result;

}



/* ==========================================================
   ANALYTICS / SOLVE STATE
========================================================== */

let generalSolveTracked =
  false;


let generalRevealTracked =
  false;


let generalWasRevealed =
  false;


let miniSolveTracked =
  false;


let miniRevealTracked =
  false;


let miniWasRevealed =
  false;



/* ==========================================================
   KOAN~KAON DATABASE

   LAST ENTRY = CURRENT
   EARLIER ENTRIES = ARCHIVE
========================================================== */



/* ==========================================================
   SU(1)
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
          "Koan decays into ‘quark-y’ parable.",

        enumeration:
          "(4)",

        row:
          0

      },


      {

        number:
          5,

        clue:
          "Gore gory goblin?",

        enumeration:
          "(4)",

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

        row:
          2

      },


      {

        number:
          7,

        clue:
          "Cartoony ants cartoonist.",

        enumeration:
          "(4)",

        row:
          3

      }

    ],


    conjugate: [

      {

        number:
          1,

        clue:
          "Koan symmetry-breaking particle.",

        enumeration:
          "(4)",

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

        column:
          3

      }

    ]

  }

];



/* ==========================================================
   SU(2) MINI
========================================================== */

const miniPuzzles = [

  {

    number:
      "001",

    title:
      "Mini #001",

    subtitle:
      "SU(2) Mini • Fold in One",

    difficulty:
      "Foundational",


    transverseClue:
      "In Hanazono, decapitated major dynasty & did not take no for answer; found throne.",

    transverseEnumeration:
      "(3)",


    conjugateClue:
      "Beginning & end before nothing, N = N.",

    conjugateEnumeration:
      "(3)",


    answer:
      "Z"

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
   NAVIGATION
========================================================== */

const screens =
  document.querySelectorAll(
    ".screen"
  );


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



/* ==========================================================
   ARCHIVE ELEMENTS
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


const koanArchiveAccess =
  document.getElementById(
    "koanArchiveAccess"
  );


const koanPlusPanel =
  document.getElementById(
    "koanPlusPanel"
  );



/* ==========================================================
   PLUS PANEL
========================================================== */

function showKoanPlusPanel() {

  if (
    !koanPlusPanel
  ) {

    return;

  }


  koanPlusPanel
    .classList
    .add(
      "visible"
    );


  koanPlusPanel
    .scrollIntoView(
      {

        behavior:
          "smooth",

        block:
          "nearest"

      }
    );

}



/* ==========================================================
   ARCHIVE ACCESS MESSAGE
========================================================== */

function renderKoanArchiveAccess() {

  if (
    !koanArchiveAccess
  ) {

    return;

  }


  if (
    archiveUnlocked()
  ) {

    const profile =
      PATProfile.get();


    koanArchiveAccess.innerHTML = `

      <strong>
        🔓 KOAN~KAON Archive Unlocked
      </strong>

      <br>

      ${
        profile.username
        ||
        "Explorer"
      },
      your Learning Lab+ access includes
      previous SU(1) and SU(2) Mini puzzles.

    `;


    return;

  }


  koanArchiveAccess.innerHTML = `

    <strong>
      🔒 Current Puzzles Free • Archive Learning Lab+
    </strong>

    <br>

    Everyone can play the current SU(1)
    and SU(2) Mini.

    Previous puzzles remain visible here
    and unlock with Learning Lab+.

  `;

}



/* ==========================================================
   GENERIC SCREEN BUTTONS
========================================================== */

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

          if (
            button.dataset.screen ===
            "archiveScreen"
          ) {

            buildArchive();

          }


          showScreen(
            button.dataset.screen
          );

        }
      );

    }
  );



/* ==========================================================
   START CURRENT SU(1)
========================================================== */

document
  .getElementById(
    "generalModeButton"
  )
  .addEventListener(
    "click",
    function () {

      loadGeneralPuzzle(
        currentGeneral,
        false
      );


      showScreen(
        "generalScreen"
      );


      trackEvent(
        "puzzle_started",
        "su1",
        currentGeneral.number,
        {

          archived:
            false

        }
      );

    }
  );



/* ==========================================================
   START CURRENT SU(2)
========================================================== */

document
  .getElementById(
    "miniModeButton"
  )
  .addEventListener(
    "click",
    function () {

      loadMiniPuzzle(
        currentMini,
        false
      );


      showScreen(
        "miniScreen"
      );


      trackEvent(
        "puzzle_started",
        "su2_mini",
        currentMini.number,
        {

          archived:
            false

        }
      );

    }
  );



/* ==========================================================
   MAIN ARCHIVE BUTTON
========================================================== */

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
   SU(1) STATE
========================================================== */

let generalSelectedRow =
  0;


let generalSelectedColumn =
  0;


let generalDirection =
  "transverse";


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
   SU(1) CELL NUMBER
========================================================== */

function getCellNumber(
  row,
  column
) {

  if (
    row ===
    0
  ) {

    return column + 1;

  }


  if (
    column ===
    0
  ) {

    return row + 4;

  }


  return null;

}



/* ==========================================================
   LOAD SU(1)
========================================================== */

function loadGeneralPuzzle(
  puzzle,
  isArchived =
    false
) {

  activeGeneral =
    puzzle;


  generalIsArchived =
    Boolean(
      isArchived
    );


  generalSelectedRow =
    0;


  generalSelectedColumn =
    0;


  generalDirection =
    "transverse";


  generalSolveTracked =
    false;


  generalRevealTracked =
    false;


  generalWasRevealed =
    false;


  generalProfileCompletionHandled =
    false;


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
   BUILD SU(1) GRID
========================================================== */

function buildGeneralGrid() {

  generalGrid.innerHTML =
    "";


  for (
    let row =
      0;
    row <
      4;
    row++
  ) {

    for (
      let column =
        0;
      column <
        4;
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

        const label =
          document.createElement(
            "span"
          );


        label.className =
          "cell-number";


        label.textContent =
          number;


        cell.appendChild(
          label
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
        ", column "
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

            generalDirection =
              generalDirection ===
              "transverse"
              ?
                "conjugate"
              :
                "transverse";

          }


          selectGeneralCell(
            row,
            column
          );

        }
      );


      input.addEventListener(
        "input",
        function () {

          input.value =
            input.value
              .toUpperCase()
              .replace(
                /[^A-Z]/g,
                ""
              )
              .slice(
                0,
                1
              );


          clearGeneralStyles();


          if (
            input.value
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

          if (
            event.key ===
            "Backspace"

            &&
            input.value ===
            ""
          ) {

            moveGeneralBackward();

          }


          if (
            event.key ===
            "Enter"
          ) {

            event.preventDefault();


            checkGeneral();

          }

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
   BUILD SU(1) CLUES
========================================================== */

function buildGeneralClues() {

  generalAcrossClues.innerHTML =
    "";


  generalDownClues.innerHTML =
    "";


  activeGeneral
    .transverse
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


        button.dataset.index =
          clue.row;


        button.innerHTML =
          '<span class="clue-number">'
          +
          clue.number
          +
          '.</span>'
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


  activeGeneral
    .conjugate
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


        button.dataset.index =
          clue.column;


        button.innerHTML =
          '<span class="clue-number">'
          +
          clue.number
          +
          '.</span>'
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
   SU(1) SELECTION
========================================================== */

function selectGeneralCell(
  row,
  column,
  direction
) {

  generalSelectedRow =
    row;


  generalSelectedColumn =
    column;


  if (
    direction
  ) {

    generalDirection =
      direction;

  }


  updateGeneralHighlight();

}



function updateGeneralHighlight() {

  generalGrid
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

    generalGrid
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
      activeGeneral
        .transverse[
          generalSelectedRow
        ];


    if (
      clue
    ) {

      generalDirectionLabel.textContent =
        "TRANSVERSE "
        +
        clue.number
        +
        " • "
        +
        clue.clue;

    }


    const button =
      generalAcrossClues
        .querySelector(
          '[data-index="'
          +
          generalSelectedRow
          +
          '"]'
        );


    if (
      button
    ) {

      button.classList.add(
        "active"
      );

    }

  }

  else {

    generalGrid
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
      activeGeneral
        .conjugate[
          generalSelectedColumn
        ];


    if (
      clue
    ) {

      generalDirectionLabel.textContent =
        "CONJUGATE "
        +
        clue.number
        +
        " • "
        +
        clue.clue;

    }


    const button =
      generalDownClues
        .querySelector(
          '[data-index="'
          +
          generalSelectedColumn
          +
          '"]'
        );


    if (
      button
    ) {

      button.classList.add(
        "active"
      );

    }

  }


  const cell =
    generalGrid
      .querySelector(
        '.crossword-cell[data-row="'
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
    cell
  ) {

    cell.classList.add(
      "active"
    );

  }

}



/* ==========================================================
   SU(1) INPUT HELPERS
========================================================== */

function getGeneralInput(
  row,
  column
) {

  return generalGrid
    .querySelector(
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

    &&
    column <
    3
  ) {

    column++;

  }


  else if (
    generalDirection ===
    "conjugate"

    &&
    row <
    3
  ) {

    row++;

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

    &&
    column >
    0
  ) {

    column--;

  }


  else if (
    generalDirection ===
    "conjugate"

    &&
    row >
    0
  ) {

    row--;

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
   SU(1) CHECK HELPERS
========================================================== */

function clearGeneralStyles() {

  generalGrid
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



function generalIsSolved() {

  for (
    let row =
      0;
    row <
      4;
    row++
  ) {

    for (
      let column =
        0;
      column <
        4;
      column++
    ) {

      const input =
        getGeneralInput(
          row,
          column
        );


      if (
        !input

        ||
        input.value !==
        activeGeneral
          .solution[
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



/* ==========================================================
   CHECK SU(1)
========================================================== */

function checkGeneral() {

  clearGeneralStyles();


  let correct =
    0;


  let filled =
    0;


  for (
    let row =
      0;
    row <
      4;
    row++
  ) {

    for (
      let column =
        0;
      column <
        4;
      column++
    ) {

      const input =
        getGeneralInput(
          row,
          column
        );


      if (
        !input
        ||
        !input.value
      ) {

        continue;

      }


      filled++;


      if (
        input.value ===
        activeGeneral
          .solution[
            row
          ][
            column
          ]
      ) {

        correct++;


        input
          .parentElement
          .classList
          .add(
            "correct"
          );

      }

      else {

        input
          .parentElement
          .classList
          .add(
            "incorrect"
          );

      }

    }

  }



  /* ========================================================
     SOLVED
  ======================================================== */

  if (
    generalIsSolved()
  ) {

    generalSolvedPanel
      .classList
      .add(
        "visible"
      );


    /*
      Genuine solve.

      If revealGeneral() was used,
      generalWasRevealed is true and no completion occurs.
    */

    if (
      !generalSolveTracked

      &&
      !generalWasRevealed
    ) {

      generalSolveTracked =
        true;


      trackEvent(
        "puzzle_solved",
        "su1",
        activeGeneral.number,
        {

          archived:
            generalIsArchived

        }
      );


      const result =
        completeGeneralProfile();


      if (
        result
      ) {

        let feedback =
          generalIsArchived
          ?
            "✦ Archive symmetry restored."
          :
            "✦ Every letter satisfies both directions.";


        if (
          result.xpEarned >
          0
        ) {

          feedback +=
            " +"
            +
            result.xpEarned
            +
            " XP";

        }


        if (
          generalIsArchived
        ) {

          feedback +=
            " • Live SU(1) streak unchanged.";

        }


        else if (
          result.streakAdvanced

          &&
          result.profile

          &&
          result.profile.streaks
        ) {

          feedback +=
            " • 🔥 SU(1) streak "
            +
            (
              result
                .profile
                .streaks
                .koan_one
              ||
              0
            );

        }


        if (
          result.alreadyCompleted
        ) {

          feedback =
            generalIsArchived
            ?
              "✦ Archive symmetry restored. Puzzle already catalogued."
            :
              "✦ Every letter satisfies both directions. Puzzle already catalogued.";

        }


        generalFeedback.textContent =
          feedback;

      }

      else {

        generalFeedback.textContent =
          "✦ Every letter satisfies both directions.";

      }

    }


    else {

      generalFeedback.textContent =
        generalWasRevealed
        ?
          "✦ Symmetry restored after reveal. This does not count toward XP or your SU(1) streak."
        :
          "✦ Every letter satisfies both directions.";

    }


    return;

  }



  /* ========================================================
     EMPTY
  ======================================================== */

  if (
    filled ===
    0
  ) {

    generalFeedback.textContent =
      "Enter some letters first.";


    return;

  }



  /* ========================================================
     PARTIAL
  ======================================================== */

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
   SU(1) HINT
========================================================== */

function hintGeneral() {

  const candidates =
    [];


  for (
    let row =
      0;
    row <
      4;
    row++
  ) {

    for (
      let column =
        0;
      column <
        4;
      column++
    ) {

      const input =
        getGeneralInput(
          row,
          column
        );


      if (
        input

        &&
        input.value !==
        activeGeneral
          .solution[
            row
          ][
            column
          ]
      ) {

        candidates.push(
          {

            input:
              input,

            row:
              row,

            column:
              column

          }
        );

      }

    }

  }


  if (
    !candidates.length
  ) {

    generalFeedback.textContent =
      "No letters remain to reveal.";


    return;

  }


  const target =
    candidates[
      0
    ];


  target.input.value =
    activeGeneral
      .solution[
        target.row
      ][
        target.column
      ];


  generalFeedback.textContent =
    "✦ One symmetry point revealed.";


  trackEvent(
    "hint_used",
    "su1",
    activeGeneral.number,
    {

      archived:
        generalIsArchived

    }
  );

}



/* ==========================================================
   SU(1) CLEAR
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


  clearGeneralStyles();


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



/* ==========================================================
   SU(1) REVEAL
========================================================== */

function revealGeneral() {

  if (
    !window.confirm(
      "Reveal the complete SU(1) solution?"
    )
  ) {

    return;

  }


  generalWasRevealed =
    true;


  if (
    !generalRevealTracked
  ) {

    generalRevealTracked =
      true;


    trackEvent(
      "puzzle_revealed",
      "su1",
      activeGeneral.number,
      {

        archived:
          generalIsArchived

      }
    );

  }


  for (
    let row =
      0;
    row <
      4;
    row++
  ) {

    for (
      let column =
        0;
      column <
        4;
      column++
    ) {

      const input =
        getGeneralInput(
          row,
          column
        );


      if (
        input
      ) {

        input.value =
          activeGeneral
            .solution[
              row
            ][
              column
            ];

      }

    }

  }


  clearGeneralStyles();


  generalFeedback.textContent =
    generalIsArchived
    ?
      "Archive solution revealed. No XP or live SU(1) streak progress awarded."
    :
      "Solution revealed. No XP or SU(1) streak progress awarded.";


  generalSolvedPanel
    .classList
    .add(
      "visible"
    );

}



/* ==========================================================
   SU(1) CONTROLS
========================================================== */

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
   SU(2) MINI ELEMENTS
========================================================== */

const miniCenter =
  document.getElementById(
    "miniCenter"
  );


const miniCenterInput =
  document.getElementById(
    "miniCenterInput"
  );


const miniFeedback =
  document.getElementById(
    "miniFeedback"
  );


const miniSolvedPanel =
  document.getElementById(
    "miniSolvedPanel"
  );


const miniSolvedLetter =
  document.getElementById(
    "miniSolvedLetter"
  );



/* ==========================================================
   LOAD SU(2)
========================================================== */

function loadMiniPuzzle(
  puzzle,
  isArchived =
    false
) {

  activeMini =
    puzzle;


  miniIsArchived =
    Boolean(
      isArchived
    );


  miniSolveTracked =
    false;


  miniRevealTracked =
    false;


  miniWasRevealed =
    false;


  miniProfileCompletionHandled =
    false;


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


  document
    .getElementById(
      "miniAcrossClue"
    )
    .textContent =
      "1. "
      +
      puzzle.transverseClue
      +
      " "
      +
      puzzle.transverseEnumeration;


  document
    .getElementById(
      "miniDownClue"
    )
    .textContent =
      "1. "
      +
      puzzle.conjugateClue
      +
      " "
      +
      puzzle.conjugateEnumeration;


  miniCenterInput.value =
    "";


  miniFeedback.textContent =
    "";


  miniCenter.classList.remove(
    "correct",
    "incorrect"
  );


  miniSolvedPanel
    .classList
    .remove(
      "visible"
    );


  miniSolvedLetter.textContent =
    "";

}



/* ==========================================================
   SU(2) INPUT
========================================================== */

miniCenterInput
  .addEventListener(
    "input",
    function () {

      miniCenterInput.value =
        miniCenterInput.value
          .toUpperCase()
          .replace(
            /[^A-Z]/g,
            ""
          )
          .slice(
            0,
            1
          );


      miniCenter.classList.remove(
        "correct",
        "incorrect"
      );


      miniFeedback.textContent =
        "";

    }
  );


miniCenterInput
  .addEventListener(
    "keydown",
    function (
      event
    ) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();


        checkMini();

      }

    }
  );



/* ==========================================================
   CHECK SU(2)
========================================================== */

function checkMini() {

  const guess =
    miniCenterInput.value
      .trim()
      .toUpperCase();


  if (
    !guess
  ) {

    miniFeedback.textContent =
      "Enter the missing center letter first.";


    return;

  }



  /* ========================================================
     CORRECT
  ======================================================== */

  if (
    guess ===
    activeMini.answer
  ) {

    miniCenter.classList.remove(
      "incorrect"
    );


    miniCenter.classList.add(
      "correct"
    );


    miniSolvedLetter.textContent =
      activeMini.answer;


    miniSolvedPanel
      .classList
      .add(
        "visible"
      );


    if (
      !miniSolveTracked

      &&
      !miniWasRevealed
    ) {

      miniSolveTracked =
        true;


      trackEvent(
        "puzzle_solved",
        "su2_mini",
        activeMini.number,
        {

          archived:
            miniIsArchived

        }
      );


      const result =
        completeMiniProfile();


      if (
        result
      ) {

        let feedback =
          miniIsArchived
          ?
            "✣ Archive symmetry closed."
          :
            "✣ Correct — the symmetry closes at the center.";


        if (
          result.xpEarned >
          0
        ) {

          feedback +=
            " +"
            +
            result.xpEarned
            +
            " XP";

        }


        if (
          miniIsArchived
        ) {

          feedback +=
            " • Live SU(2) streak unchanged.";

        }


        else if (
          result.streakAdvanced

          &&
          result.profile

          &&
          result.profile.streaks
        ) {

          feedback +=
            " • 🔥 SU(2) streak "
            +
            (
              result
                .profile
                .streaks
                .koan_two
              ||
              0
            );

        }


        if (
          result.alreadyCompleted
        ) {

          feedback =
            miniIsArchived
            ?
              "✣ Archive symmetry closed. Puzzle already catalogued."
            :
              "✣ Correct — the symmetry closes at the center. Puzzle already catalogued.";

        }


        miniFeedback.textContent =
          feedback;

      }

      else {

        miniFeedback.textContent =
          "✣ Correct — the symmetry closes at the center.";

      }

    }


    else {

      miniFeedback.textContent =
        miniWasRevealed
        ?
          "✣ Center completed after reveal. No XP or streak progress awarded."
        :
          "✣ Correct — the symmetry closes at the center.";

    }


    return;

  }



  /* ========================================================
     INCORRECT
  ======================================================== */

  miniCenter.classList.remove(
    "correct"
  );


  miniCenter.classList.add(
    "incorrect"
  );


  miniFeedback.textContent =
    "Not quite. Read the Transverse and Conjugate clues together.";

}



/* ==========================================================
   SU(2) HINT
========================================================== */

function hintMini() {

  miniFeedback.textContent =
    "Hint: the answer is a single letter shared by both clue directions.";


  trackEvent(
    "hint_used",
    "su2_mini",
    activeMini.number,
    {

      archived:
        miniIsArchived

    }
  );

}



/* ==========================================================
   SU(2) CLEAR
========================================================== */

function clearMini() {

  miniCenterInput.value =
    "";


  miniCenter.classList.remove(
    "correct",
    "incorrect"
  );


  miniFeedback.textContent =
    "Center cleared.";


  miniSolvedPanel
    .classList
    .remove(
      "visible"
    );


  miniSolvedLetter.textContent =
    "";

}



/* ==========================================================
   SU(2) REVEAL
========================================================== */

function revealMini() {

  if (
    !window.confirm(
      "Reveal the missing SU(2) center?"
    )
  ) {

    return;

  }


  miniWasRevealed =
    true;


  if (
    !miniRevealTracked
  ) {

    miniRevealTracked =
      true;


    trackEvent(
      "puzzle_revealed",
      "su2_mini",
      activeMini.number,
      {

        archived:
          miniIsArchived

      }
    );

  }


  miniCenterInput.value =
    activeMini.answer;


  miniCenter.classList.remove(
    "incorrect"
  );


  miniCenter.classList.add(
    "correct"
  );


  miniFeedback.textContent =
    miniIsArchived
    ?
      "Archive center revealed. No XP or live SU(2) streak progress awarded."
    :
      "Center revealed. No XP or SU(2) streak progress awarded.";


  miniSolvedLetter.textContent =
    activeMini.answer;


  miniSolvedPanel
    .classList
    .add(
      "visible"
    );

}



/* ==========================================================
   SU(2) CONTROLS
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
   SHARE
========================================================== */

async function sharePuzzle(
  button,
  title,
  text,
  mode,
  puzzleNumber,
  archived
) {

  try {

    if (
      navigator.share
    ) {

      await navigator.share(
        {

          title:
            title,

          text:
            text,

          url:
            window.location.href

        }
      );


      trackEvent(
        "puzzle_shared",
        mode,
        puzzleNumber,
        {

          share_method:
            "native",

          archived:
            archived

        }
      );


      return;

    }


    await navigator
      .clipboard
      .writeText(
        text
        +
        "\n\n"
        +
        window.location.href
      );


    trackEvent(
      "puzzle_shared",
      mode,
      puzzleNumber,
      {

        share_method:
          "clipboard",

        archived:
          archived

      }
    );


    const original =
      button.textContent;


    button.textContent =
      "Copied!";


    setTimeout(
      function () {

        button.textContent =
          original;

      },

      1200
    );

  }

  catch (
    error
  ) {

    console.log(
      "Share cancelled."
    );

  }

}



/* ==========================================================
   SHARE SU(1)
========================================================== */

document
  .getElementById(
    "generalShare"
  )
  .addEventListener(
    "click",
    function () {

      let filled =
        0;


      generalGrid
        .querySelectorAll(
          "input"
        )
        .forEach(
          function (
            input
          ) {

            if (
              input.value
            ) {

              filled++;

            }

          }
        );


      let status =
        filled
        +
        "/16 letters entered";


      if (
        generalIsSolved()

        &&
        !generalWasRevealed
      ) {

        status =
          "✦ SYMMETRY RESTORED";

      }


      else if (
        generalWasRevealed
      ) {

        status =
          "Solution revealed";

      }


      const text =
        "KOAN~KAON • SU(1) Puzzle #"
        +
        activeGeneral.number
        +
        "\n\n"
        +
        status
        +
        "\n\n"
        +
        "Four Transverse clues."
        +
        "\n"
        +
        "Four Conjugate clues."
        +
        "\n"
        +
        "One shared lexical field."
        +
        "\n\n"
        +
        "Can you restore the symmetry?"
        +
        "\n\nPAT Learning Lab";


      sharePuzzle(
        this,
        "KOAN~KAON SU(1)",
        text,
        "su1",
        activeGeneral.number,
        generalIsArchived
      );

    }
  );



/* ==========================================================
   SHARE SU(2)
========================================================== */

document
  .getElementById(
    "miniShare"
  )
  .addEventListener(
    "click",
    function () {

      const miniSolved =
        miniCenterInput.value
          .toUpperCase()
        ===
        activeMini.answer;


      let status =
        "□ CENTER UNSOLVED";


      if (
        miniSolved

        &&
        !miniWasRevealed
      ) {

        status =
          "✣ FOLD IN ONE — SOLVED";

      }


      else if (
        miniWasRevealed
      ) {

        status =
          "Center revealed";

      }


      const text =
        "KOAN~KAON • SU(2) Mini #"
        +
        activeMini.number
        +
        "\n\n"
        +
        status
        +
        "\n\n"
        +
        "Two clue directions."
        +
        "\n"
        +
        "One missing center."
        +
        "\n\n"
        +
        "Can you fold the symmetry into one letter?"
        +
        "\n\nPAT Learning Lab";


      sharePuzzle(
        this,
        "KOAN~KAON SU(2) Mini",
        text,
        "su2_mini",
        activeMini.number,
        miniIsArchived
      );

    }
  );



/* ==========================================================
   BUILD ARCHIVE
========================================================== */

function buildArchive() {

  if (
    koanPlusPanel
  ) {

    koanPlusPanel
      .classList
      .remove(
        "visible"
      );

  }


  renderKoanArchiveAccess();


  buildGeneralArchive();


  buildMiniArchive();

}



/* ==========================================================
   SU(1) ARCHIVE
========================================================== */

function buildGeneralArchive() {

  archiveGeneralList.innerHTML =
    "";


  const archive =
    generalPuzzles
      .slice(
        0,
        -1
      )
      .reverse();


  if (
    !archive.length
  ) {

    archiveGeneralList.innerHTML =
      '<div class="empty-archive">'
      +
      'SU(1) Puzzle #'
      +
      currentGeneral.number
      +
      ' is currently live.'
      +
      '<br><br>'
      +
      'When the next SU(1) puzzle is released, this puzzle will automatically move here.'
      +
      '</div>';


    return;

  }


  const hasAccess =
    archiveUnlocked();


  archive.forEach(
    function (
      puzzle
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "archive-card";


      if (
        !hasAccess
      ) {

        card.classList.add(
          "locked"
        );

      }


      card.innerHTML = `

        <div class="archive-top">

          <span class="archive-number">
            PUZZLE #${puzzle.number}
          </span>

          <span class="archive-type general">
            SU(1)
          </span>

        </div>

        <div class="archive-title">
          ${puzzle.title}
        </div>

        <div class="archive-description">
          ${puzzle.subtitle}
        </div>

        <button
          class="archive-play-button"
          type="button"
        >

          ${
            hasAccess
            ?
              "Play Archived SU(1)"
            :
              "🔒 Unlock with Learning Lab+"
          }

        </button>

      `;


      const button =
        card.querySelector(
          ".archive-play-button"
        );


      if (
        hasAccess
      ) {

        button.addEventListener(
          "click",
          function () {

            loadGeneralPuzzle(
              puzzle,
              true
            );


            showScreen(
              "generalScreen"
            );


            trackEvent(
              "puzzle_started",
              "su1",
              puzzle.number,
              {

                archived:
                  true

              }
            );

          }
        );

      }


      else {

        button.addEventListener(
          "click",
          function () {

            showKoanPlusPanel();


            trackEvent(
              "archive_locked_clicked",
              "su1",
              puzzle.number,
              {

                archived:
                  true

              }
            );

          }
        );

      }


      archiveGeneralList.appendChild(
        card
      );

    }
  );

}



/* ==========================================================
   SU(2) ARCHIVE
========================================================== */

function buildMiniArchive() {

  archiveMiniList.innerHTML =
    "";


  const archive =
    miniPuzzles
      .slice(
        0,
        -1
      )
      .reverse();


  if (
    !archive.length
  ) {

    archiveMiniList.innerHTML =
      '<div class="empty-archive">'
      +
      'SU(2) Mini #'
      +
      currentMini.number
      +
      ' is currently live.'
      +
      '<br><br>'
      +
      'When the next SU(2) Mini is released, this puzzle will automatically move here.'
      +
      '</div>';


    return;

  }


  const hasAccess =
    archiveUnlocked();


  archive.forEach(
    function (
      puzzle
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "archive-card";


      if (
        !hasAccess
      ) {

        card.classList.add(
          "locked"
        );

      }


      card.innerHTML = `

        <div class="archive-top">

          <span class="archive-number">
            MINI #${puzzle.number}
          </span>

          <span class="archive-type mini">
            SU(2) MINI
          </span>

        </div>

        <div class="archive-title">
          ${puzzle.title}
        </div>

        <div class="archive-description">
          ${puzzle.subtitle}
        </div>

        <button
          class="archive-play-button"
          type="button"
        >

          ${
            hasAccess
            ?
              "Play Archived Mini"
            :
              "🔒 Unlock with Learning Lab+"
          }

        </button>

      `;


      const button =
        card.querySelector(
          ".archive-play-button"
        );


      if (
        hasAccess
      ) {

        button.addEventListener(
          "click",
          function () {

            loadMiniPuzzle(
              puzzle,
              true
            );


            showScreen(
              "miniScreen"
            );


            trackEvent(
              "puzzle_started",
              "su2_mini",
              puzzle.number,
              {

                archived:
                  true

              }
            );

          }
        );

      }


      else {

        button.addEventListener(
          "click",
          function () {

            showKoanPlusPanel();


            trackEvent(
              "archive_locked_clicked",
              "su2_mini",
              puzzle.number,
              {

                archived:
                  true

              }
            );

          }
        );

      }


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
   PROFILE UPDATE

   If plan / XP / streak changes:
   - refresh profile strip
   - rebuild archive if archive is open
========================================================== */

window.addEventListener(
  "pat-profile-updated",
  function () {

    refreshKoanProfile();


    const archiveScreen =
      document.getElementById(
        "archiveScreen"
      );


    if (
      archiveScreen

      &&
      archiveScreen
        .classList
        .contains(
          "active"
        )
    ) {

      buildArchive();

    }

  }
);



/* ==========================================================
   PROFILE READY
========================================================== */

window.addEventListener(
  "pat-profile-ready",
  function () {

    refreshKoanProfile();

  }
);



/* ==========================================================
   START

   Initializes both current puzzles.

   IMPORTANT:

   No XP
   No completion
   No streak

   is awarded merely by loading the page.
========================================================== */

loadGeneralPuzzle(
  currentGeneral,
  false
);


loadMiniPuzzle(
  currentMini,
  false
);


buildArchive();


refreshKoanProfile();


  }
);
