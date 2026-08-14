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
    JSON.stringify(
      player
    )
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


/* Buzzword card has its own explicit listener */

const buzzwordFeature =
  document.getElementById(
    "buzzwordFeature"
  );


if (
  buzzwordFeature
) {

  buzzwordFeature.addEventListener(
    "click",
    function () {

      showScreen(
        "buzzwordScreen"
      );

    }
  );

}


/* All other navigation buttons */

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
            button.dataset.screen
          );

        }
      );

    }
  );



/* ==========================================================
   ELEMENT NAMES
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
   FORMULA HELPERS
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

      formula +=
        current;


      if (
        count >
        1
      ) {

        formula +=
          subscriptMap[
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


  return formula;

}


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
          Number(
            number
          )
        ]
        ||
        number
      );

    }
  );

}



/* ==========================================================
   GENERIC HEX CREATOR
========================================================== */

function createHex(
  symbol,
  label
) {

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.className =
    "hex";


  button.dataset.symbol =
    symbol;


  if (
    label
  ) {

    const small =
      document.createElement(
        "small"
      );


    small.textContent =
      label;


    button.appendChild(
      small
    );

  }


  const strong =
    document.createElement(
      "strong"
    );


  strong.textContent =
    symbol;


  button.appendChild(
    strong
  );


  return button;

}



/* ==========================================================
   UNIVERSAL TOUCH + MOUSE DRAG SYSTEM

   This does not rely on browser HTML drag/drop,
   so it works much better on iPhone and iPad.
========================================================== */

let activeDrag =
  null;


function beginMolecularDrag(
  event,
  source,
  symbol,
  type,
  data
) {

  /*
    Ignore right clicks.
  */

  if (
    event.pointerType ===
    "mouse"
    &&
    event.button !==
    0
  ) {

    return;

  }


  if (
    source.classList.contains(
      "used"
    )
  ) {

    return;

  }


  const startRect =
    source.getBoundingClientRect();


  activeDrag = {

    source:
      source,

    symbol:
      symbol,

    type:
      type,

    data:
      data || {},

    pointerId:
      event.pointerId,

    startX:
      event.clientX,

    startY:
      event.clientY,

    offsetX:
      event.clientX -
      startRect.left,

    offsetY:
      event.clientY -
      startRect.top,

    dragging:
      false,

    ghost:
      null

  };


  try {

    source.setPointerCapture(
      event.pointerId
    );

  }

  catch (
    error
  ) {}

}


function moveMolecularDrag(
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


  /*
    Don't begin a drag until the user
    has actually moved a little.
  */

  if (
    !activeDrag.dragging
    &&
    distance <
    8
  ) {

    return;

  }


  if (
    !activeDrag.dragging
  ) {

    activeDrag.dragging =
      true;


    activeDrag.ghost =
      activeDrag.source.cloneNode(
        true
      );


    activeDrag.ghost.classList.add(
      "molecular-drag-ghost"
    );


    Object.assign(
      activeDrag.ghost.style,
      {

        position:
          "fixed",

        width:
          activeDrag.source
            .getBoundingClientRect()
            .width
          +
          "px",

        height:
          activeDrag.source
            .getBoundingClientRect()
            .height
          +
          "px",

        margin:
          "0",

        zIndex:
          "99999",

        pointerEvents:
          "none",

        opacity:
          "0.9",

        transform:
          "scale(1.08)",

        filter:
          "drop-shadow(0 8px 8px rgba(0,0,0,.2))"

      }
    );


    document.body.appendChild(
      activeDrag.ghost
    );


    activeDrag.source.style.opacity =
      "0.35";

  }


  event.preventDefault();


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


  clearMolecularDropHighlights();


  const target =
    findMolecularDropTarget(
      event.clientX,
      event.clientY,
      activeDrag.type
    );


  if (
    target
  ) {

    target.classList.add(
      "drop-active"
    );

  }

}


function endMolecularDrag(
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
    drag.dragging
      ?
        findMolecularDropTarget(
          event.clientX,
          event.clientY,
          drag.type
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


  clearMolecularDropHighlights();


  activeDrag =
    null;


  /*
    If this was only a tap,
    let the normal click handler handle it.
  */

  if (
    !drag.dragging
  ) {

    return;

  }


  /*
    Prevent a drag ending from also
    becoming an accidental click.
  */

  suppressNextClick(
    drag.source
  );


  if (
    !target
  ) {

    return;

  }


  if (
    drag.type ===
    "spelling"
  ) {

    dropSpellingAtom(
      drag.source,
      drag.symbol,
      target
    );

  }


  if (
    drag.type ===
    "queen"
  ) {

    dropQueenAtom(
      drag.source,
      drag.symbol,
      target
    );

  }


  if (
    drag.type ===
    "pollination"
  ) {

    dropPollen(
      drag.source,
      drag.symbol,
      target
    );

  }

}


function suppressNextClick(
  element
) {

  element.dataset.suppressClick =
    "true";


  setTimeout(
    function () {

      delete element.dataset.suppressClick;

    },
    300
  );

}


function findMolecularDropTarget(
  x,
  y,
  type
) {

  let targets =
    [];


  if (
    type ===
    "spelling"
  ) {

    /*
      User can drop directly onto an empty
      honeycomb OR anywhere inside the board.
    */

    targets =
      Array.from(
        document.querySelectorAll(
          "#spellingBuild .honey-slot:not(.filled)"
        )
      );


    const direct =
      findRectTarget(
        x,
        y,
        targets
      );


    if (
      direct
    ) {

      return direct;

    }


    const build =
      document.getElementById(
        "spellingBuild"
      );


    if (
      pointInsideElement(
        x,
        y,
        build
      )
    ) {

      return (
        build.querySelector(
          ".honey-slot:not(.filled)"
        )
        ||
        null
      );

    }

  }


  if (
    type ===
    "queen"
  ) {

    targets =
      Array.from(
        document.querySelectorAll(
          "#queenHive .queen-slot:not(.center-slot):not(.filled)"
        )
      );


    return findRectTarget(
      x,
      y,
      targets
    );

  }


  if (
    type ===
    "pollination"
  ) {

    const flower =
      document.getElementById(
        "flowerTarget"
      );


    if (
      pointInsideElement(
        x,
        y,
        flower
      )
    ) {

      return flower;

    }

  }


  return null;

}


function pointInsideElement(
  x,
  y,
  element
) {

  if (
    !element
  ) {

    return false;

  }


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


function findRectTarget(
  x,
  y,
  elements
) {

  for (
    let i = 0;
    i <
    elements.length;
    i++
  ) {

    if (
      pointInsideElement(
        x,
        y,
        elements[i]
      )
    ) {

      return elements[i];

    }

  }


  return null;

}


function clearMolecularDropHighlights() {

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


document.addEventListener(
  "pointermove",
  moveMolecularDrag,
  {
    passive:
      false
  }
);


document.addEventListener(
  "pointerup",
  endMolecularDrag
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


    clearMolecularDropHighlights();

  }
);



/* ==========================================================
   WEEKLY BUZZWORD DATABASE
========================================================== */

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
   BUZZWORD ELEMENT BUTTONS
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
   BUZZWORD ELEMENT CLICKING
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
   BUZZWORD DISPLAY
========================================================== */

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


/* ==========================================================
   BUZZ BACKSPACE / CLEAR
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
   BUZZ VALIDATION
========================================================== */

function usesCenterElement() {

  return buzzSequence.includes(
    activeWeek.center
  );

}


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


function normalizeSequence(
  sequence
) {

  return sequence.join(
    "|"
  );

}


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
          "👑 Every answer must use the gold center element: "
          +
          (
            elementNames[
              activeWeek.center
            ]
            ||
            activeWeek.center
          )
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
   FOUND BUZZWORDS
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
   BUZZWORD SHARE GRAPHIC
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
      Math.cos(
        angle
      );


    const py =
      y +
      radius *
      Math.sin(
        angle
      );


    if (
      i ===
      0
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
      "MOLECULARGRAM!",
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
              [
                blob
              ],
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
                [
                  file
                ]
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
                [
                  file
                ]
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
   SPELLING BEE DATABASE
========================================================== */

const spellingChallenges = [

  {

    name:
      "water",

    formula:
      [
        "H",
        "H",
        "O"
      ],

    distractors:
      [
        "C",
        "N",
        "Cl"
      ]

  },


  {

    name:
      "carbon dioxide",

    formula:
      [
        "C",
        "O",
        "O"
      ],

    distractors:
      [
        "H",
        "N",
        "Na"
      ]

  },


  {

    name:
      "ammonia",

    formula:
      [
        "N",
        "H",
        "H",
        "H"
      ],

    distractors:
      [
        "O",
        "C",
        "Cl"
      ]

  },


  {

    name:
      "methane",

    formula:
      [
        "C",
        "H",
        "H",
        "H",
        "H"
      ],

    distractors:
      [
        "O",
        "N",
        "Cl"
      ]

  }

];


let spellingIndex =
  0;


/* ==========================================================
   SPELLING BOARD
========================================================== */

function buildSpellingBoard() {

  const build =
    document.getElementById(
      "spellingBuild"
    );


  build.innerHTML =
    "";


  build.classList.add(
    "honey-grid"
  );


  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const slot =
      document.createElement(
        "button"
      );


    slot.type =
      "button";


    slot.className =
      "honey-slot";


    slot.dataset.slot =
      i;


    slot.dataset.symbol =
      "";


    slot.addEventListener(
      "click",
      function () {

        if (
          !slot.classList.contains(
            "filled"
          )
        ) {

          return;

        }


        returnSpellingAtom(
          slot
        );

      }
    );


    build.appendChild(
      slot
    );

  }

}


function buildSpellingTiles() {

  const bank =
    document.getElementById(
      "spellingTiles"
    );


  bank.innerHTML =
    "";


  const challenge =
    spellingChallenges[
      spellingIndex
    ];


  const options =
    [
      ...challenge.formula,
      ...challenge.distractors
    ];


  options.forEach(
    function (
      symbol,
      index
    ) {

      addSpellingSourceTile(
        symbol,
        index
      );

    }
  );

}


function addSpellingSourceTile(
  symbol,
  index
) {

  const bank =
    document.getElementById(
      "spellingTiles"
    );


  const tile =
    createHex(
      symbol,
      elementNames[
        symbol
      ]
      ||
      "Atom"
    );


  tile.dataset.index =
    String(
      index
      ??
      (
        Date.now()
        +
        Math.random()
      )
    );


  /*
    TAP SUPPORT
  */

  tile.addEventListener(
    "click",
    function () {

      if (
        tile.dataset.suppressClick ===
        "true"
      ) {

        return;

      }


      if (
        tile.classList.contains(
          "used"
        )
      ) {

        return;

      }


      const target =
        document.querySelector(
          "#spellingBuild .honey-slot:not(.filled)"
        );


      if (
        target
      ) {

        dropSpellingAtom(
          tile,
          symbol,
          target
        );

      }

    }
  );


  /*
    DRAG SUPPORT
  */

  tile.addEventListener(
    "pointerdown",
    function (
      event
    ) {

      beginMolecularDrag(
        event,
        tile,
        symbol,
        "spelling"
      );

    }
  );


  bank.appendChild(
    tile
  );

}


function dropSpellingAtom(
  source,
  symbol,
  target
) {

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
    source.dataset.index;


  target.innerHTML =
    "<strong>"
    +
    symbol
    +
    "</strong>";


  source.classList.add(
    "used"
  );


  updateSpellingFormula();

}


function returnSpellingAtom(
  slot
) {

  const sourceId =
    slot.dataset.sourceId;


  const source =
    document.querySelector(
      '#spellingTiles [data-index="'
      +
      sourceId
      +
      '"]'
    );


  if (
    source
  ) {

    source.classList.remove(
      "used"
    );

  }


  slot.classList.remove(
    "filled"
  );


  slot.dataset.symbol =
    "";


  slot.dataset.sourceId =
    "";


  slot.innerHTML =
    "";


  updateSpellingFormula();

}


function getSpellingSequence() {

  return Array.from(
    document.querySelectorAll(
      "#spellingBuild .honey-slot.filled"
    )
  )
  .sort(
    function (
      a,
      b
    ) {

      return (
        Number(
          a.dataset.slot
        )
        -
        Number(
          b.dataset.slot
        )
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


function updateSpellingFormula() {

  const preview =
    document.getElementById(
      "spellingFormula"
    );


  const sequence =
    getSpellingSequence();


  if (
    sequence.length ===
    0
  ) {

    preview.textContent =
      "Chemical formula will appear here";


    preview.classList.add(
      "empty"
    );


    return;

  }


  preview.classList.remove(
    "empty"
  );


  preview.textContent =
    sequenceToFormula(
      sequence
    );

}


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
      "Spell "
      +
      challenge.name
      +
      " using the honeycomb atoms.";


  document
    .getElementById(
      "spellingFeedback"
    )
    .textContent =
      "";


  buildSpellingBoard();


  buildSpellingTiles();


  updateSpellingFormula();

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
          document.querySelectorAll(
            "#spellingBuild .honey-slot.filled"
          )
        );


      if (
        filled.length ===
        0
      ) {

        return;

      }


      returnSpellingAtom(
        filled[
          filled.length -
          1
        ]
      );

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

      const actual =
        getSpellingSequence();


      const expected =
        spellingChallenges[
          spellingIndex
        ].formula;


      if (
        actual.join(
          "|"
        )
        ===
        expected.join(
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
            sequenceToFormula(
              expected
            )
            +
            "!";


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


            loadSpelling();

          },
          1100
        );

      }

      else {

        document
          .getElementById(
            "spellingFeedback"
          )
          .textContent =
            "Not quite. Check the atom order and ratio.";

      }

    }
  );



/* ==========================================================
   QUEEN BEE DATABASE
========================================================== */

const queenChallenges = [

  {

    center:
      "O",

    name:
      "water",

    formula:
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
        "Na",
        "Cl"
      ]

  },


  {

    center:
      "C",

    name:
      "carbon dioxide",

    formula:
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
        "N",
        "Cl"
      ]

  },


  {

    center:
      "N",

    name:
      "ammonia",

    formula:
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
        "O",
        "C"
      ]

  },


  {

    center:
      "C",

    name:
      "methane",

    formula:
      "CH₄",

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
        "O",
        "N"
      ]

  }

];


let queenIndex =
  0;


/* ==========================================================
   BUILD QUEEN HIVE
========================================================== */

function buildQueenHive() {

  const hive =
    document.getElementById(
      "queenHive"
    );


  hive.innerHTML =
    "";


  const challenge =
    queenChallenges[
      queenIndex
    ];


  const grid =
    document.createElement(
      "div"
    );


  grid.className =
    "queen-grid";


  for (
    let i = 1;
    i <=
    6;
    i++
  ) {

    const slot =
      document.createElement(
        "button"
      );


    slot.type =
      "button";


    slot.className =
      "queen-slot slot-"
      +
      i;


    slot.dataset.symbol =
      "";


    slot.textContent =
      "?";


    slot.addEventListener(
      "click",
      function () {

        if (
          slot.classList.contains(
            "filled"
          )
        ) {

          returnQueenAtom(
            slot
          );

        }

      }
    );


    grid.appendChild(
      slot
    );

  }


  const center =
    document.createElement(
      "div"
    );


  center.className =
    "queen-slot center-slot filled";


  center.innerHTML =
    "<strong>👑<br>"
    +
    challenge.center
    +
    "</strong>";


  grid.appendChild(
    center
  );


  hive.appendChild(
    grid
  );

}


function buildQueenTiles() {

  const bank =
    document.getElementById(
      "queenTiles"
    );


  bank.innerHTML =
    "";


  const challenge =
    queenChallenges[
      queenIndex
    ];


  challenge.tiles.forEach(
    function (
      symbol,
      index
    ) {

      const tile =
        createHex(
          symbol,
          elementNames[
            symbol
          ]
          ||
          "Worker"
        );


      tile.dataset.index =
        index;


      /*
        TAP
      */

      tile.addEventListener(
        "click",
        function () {

          if (
            tile.dataset.suppressClick ===
            "true"
          ) {

            return;

          }


          if (
            tile.classList.contains(
              "used"
            )
          ) {

            return;

          }


          const target =
            document.querySelector(
              "#queenHive .queen-slot:not(.center-slot):not(.filled)"
            );


          if (
            target
          ) {

            dropQueenAtom(
              tile,
              symbol,
              target
            );

          }

        }
      );


      /*
        DRAG
      */

      tile.addEventListener(
        "pointerdown",
        function (
          event
        ) {

          beginMolecularDrag(
            event,
            tile,
            symbol,
            "queen"
          );

        }
      );


      bank.appendChild(
        tile
      );

    }
  );

}


function dropQueenAtom(
  source,
  symbol,
  target
) {

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


  target.dataset.sourceIndex =
    source.dataset.index;


  target.innerHTML =
    "<strong>"
    +
    symbol
    +
    "</strong>";


  source.classList.add(
    "used"
  );

}


function returnQueenAtom(
  slot
) {

  const source =
    document.querySelector(
      '#queenTiles [data-index="'
      +
      slot.dataset.sourceIndex
      +
      '"]'
    );


  if (
    source
  ) {

    source.classList.remove(
      "used"
    );

  }


  slot.classList.remove(
    "filled"
  );


  slot.dataset.symbol =
    "";


  slot.dataset.sourceIndex =
    "";


  slot.textContent =
    "?";

}


function loadQueen() {

  const challenge =
    queenChallenges[
      queenIndex
    ];


  document
    .getElementById(
      "queenPrompt"
    )
    .textContent =
      "Build "
      +
      challenge.name
      +
      " ("
      +
      challenge.formula
      +
      ") around the Queen.";


  document
    .getElementById(
      "queenFeedback"
    )
    .textContent =
      "";


  buildQueenHive();


  buildQueenTiles();

}


document
  .getElementById(
    "queenReset"
  )
  .addEventListener(
    "click",
    loadQueen
  );


document
  .getElementById(
    "queenCheck"
  )
  .addEventListener(
    "click",
    function () {

      const actual =
        Array.from(
          document.querySelectorAll(
            "#queenHive .queen-slot.filled:not(.center-slot)"
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


      const expected =
        queenChallenges[
          queenIndex
        ].required
        .slice()
        .sort();


      if (
        actual.join(
          "|"
        )
        ===
        expected.join(
          "|"
        )
      ) {

        document
          .getElementById(
            "queenFeedback"
          )
          .textContent =
            "👑 Hive complete — "
            +
            queenChallenges[
              queenIndex
            ].formula
            +
            "!";


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


            loadQueen();

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
            "Not quite. Check the atoms around the Queen.";

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

  },


  {

    name:
      "Carbon",

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


function updateWorker() {

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
      "Build a neutral "
      +
      workerChallenges[
        workerIndex
      ].name
      +
      " atom.";


  document
    .getElementById(
      "workerFeedback"
    )
    .textContent =
      "";


  updateWorker();

}


document
  .getElementById(
    "addProton"
  )
  .addEventListener(
    "click",
    function () {

      workerProtons++;


      updateWorker();

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


      updateWorker();

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


      updateWorker();

    }
  );


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


            loadWorker();

          },
          1100
        );

      }

      else {

        document
          .getElementById(
            "workerFeedback"
          )
          .textContent =
            "Not quite. Check your protons, neutrons and electrons.";

      }

    }
  );



/* ==========================================================
   POLLINATION DATABASE
========================================================== */

const pollinationChallenges = [

  {

    flower:
      "Cl⁻",

    pollen:
      "Na⁺",

    needed:
      1,

    formula:
      "NaCl",

    name:
      "Sodium Chloride"

  },


  {

    flower:
      "O²⁻",

    pollen:
      "Na⁺",

    needed:
      2,

    formula:
      "Na₂O",

    name:
      "Sodium Oxide"

  },


  {

    flower:
      "S²⁻",

    pollen:
      "K⁺",

    needed:
      2,

    formula:
      "K₂S",

    name:
      "Potassium Sulfide"

  },


  {

    flower:
      "N³⁻",

    pollen:
      "Li⁺",

    needed:
      3,

    formula:
      "Li₃N",

    name:
      "Lithium Nitride"

  },


  {

    flower:
      "Mg²⁺",

    pollen:
      "Cl⁻",

    needed:
      2,

    formula:
      "MgCl₂",

    name:
      "Magnesium Chloride"

  },


  {

    flower:
      "Ca²⁺",

    pollen:
      "F⁻",

    needed:
      2,

    formula:
      "CaF₂",

    name:
      "Calcium Fluoride"

  },


  {

    flower:
      "Al³⁺",

    pollen:
      "Cl⁻",

    needed:
      3,

    formula:
      "AlCl₃",

    name:
      "Aluminum Chloride"

  },


  {

    flower:
      "Mg²⁺",

    pollen:
      "O²⁻",

    needed:
      1,

    formula:
      "MgO",

    name:
      "Magnesium Oxide"

  },


  {

    flower:
      "Ca²⁺",

    pollen:
      "O²⁻",

    needed:
      1,

    formula:
      "CaO",

    name:
      "Calcium Oxide"

  },


  {

    flower:
      "Al³⁺",

    pollen:
      "N³⁻",

    needed:
      1,

    formula:
      "AlN",

    name:
      "Aluminum Nitride"

  },


  {

    flower:
      "Br⁻",

    pollen:
      "K⁺",

    needed:
      1,

    formula:
      "KBr",

    name:
      "Potassium Bromide"

  },


  {

    flower:
      "I⁻",

    pollen:
      "Li⁺",

    needed:
      1,

    formula:
      "LiI",

    name:
      "Lithium Iodide"

  }

];


let pollinationIndex =
  0;


let deliveredPollenPieces =
  [];


/* ==========================================================
   POLLINATION
========================================================== */

function loadPollination() {

  deliveredPollenPieces =
    [];


  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  const flowerIon =
    document.getElementById(
      "flowerIon"
    );


  const pollenBank =
    document.getElementById(
      "pollenBank"
    );


  const deliveredPollen =
    document.getElementById(
      "deliveredPollen"
    );


  flowerIon.textContent =
    challenge.flower;


  document
    .getElementById(
      "pollinationPrompt"
    )
    .textContent =
      "Carry charged "
      +
      challenge.pollen
      +
      " pollen to the "
      +
      challenge.flower
      +
      " flower to grow "
      +
      challenge.name
      +
      ".";


  pollenBank.innerHTML =
    "";


  deliveredPollen.innerHTML =
    "";


  document
    .getElementById(
      "pollinationResult"
    )
    .textContent =
      "";


  document
    .getElementById(
      "pollinationFeedback"
    )
    .textContent =
      "";


  /*
    Correct pollen plus distractors.
  */

  const options =
    [
      challenge.pollen,
      challenge.pollen,
      challenge.pollen,
      challenge.pollen,
      "Na⁺",
      "Cl⁻",
      "O²⁻",
      "Ca²⁺"
    ];


  options.forEach(
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
        "pollen-piece";


      pollen.dataset.index =
        index;


      pollen.dataset.symbol =
        ion;


      pollen.textContent =
        ion;


      /*
        TAP
      */

      pollen.addEventListener(
        "click",
        function () {

          if (
            pollen.dataset.suppressClick ===
            "true"
          ) {

            return;

          }


          if (
            pollen.classList.contains(
              "used"
            )
          ) {

            return;

          }


          dropPollen(
            pollen,
            ion,
            document.getElementById(
              "flowerTarget"
            )
          );

        }
      );


      /*
        DRAG
      */

      pollen.addEventListener(
        "pointerdown",
        function (
          event
        ) {

          beginMolecularDrag(
            event,
            pollen,
            ion,
            "pollination"
          );

        }
      );


      pollenBank.appendChild(
        pollen
      );

    }
  );

}


function dropPollen(
  source,
  ion,
  flower
) {

  if (
    !flower
  ) {

    return;

  }


  if (
    source.classList.contains(
      "used"
    )
  ) {

    return;

  }


  source.classList.add(
    "used"
  );


  deliveredPollenPieces.push(
    {
      ion:
        ion,

      sourceIndex:
        source.dataset.index
    }
  );


  const token =
    document.createElement(
      "button"
    );


  token.type =
    "button";


  token.className =
    "delivered-token";


  token.textContent =
    ion;


  token.title =
    "Tap to return this pollen";


  token.addEventListener(
    "click",
    function () {

      const index =
        deliveredPollenPieces.findIndex(
          function (
            item
          ) {

            return (
              item.sourceIndex ===
              source.dataset.index
            );

          }
        );


      if (
        index !==
        -1
      ) {

        deliveredPollenPieces.splice(
          index,
          1
        );

      }


      source.classList.remove(
        "used"
      );


      token.remove();

    }
  );


  document
    .getElementById(
      "deliveredPollen"
    )
    .appendChild(
      token
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

      const challenge =
        pollinationChallenges[
          pollinationIndex
        ];


      const correctPollen =
        deliveredPollenPieces.filter(
          function (
            piece
          ) {

            return (
              piece.ion ===
              challenge.pollen
            );

          }
        );


      const allCorrect =
        correctPollen.length ===
        deliveredPollenPieces.length;


      if (
        allCorrect
        &&
        correctPollen.length ===
        challenge.needed
      ) {

        document
          .getElementById(
            "pollinationResult"
          )
          .textContent =
            "🌼 "
            +
            challenge.formula;


        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "🐝 Charges balanced — "
            +
            challenge.name
            +
            " formed!";


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


            loadPollination();

          },
          1300
        );

      }

      else if (
        !allCorrect
      ) {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "Some of that pollen carries the wrong charge.";

      }

      else if (
        correctPollen.length <
        challenge.needed
      ) {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "The flower still needs more charge.";

      }

      else {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "Too much pollen — the charges no longer balance.";

      }

    }
  );



/* ==========================================================
   START
========================================================== */

updatePlayerDisplay();


loadWeeklyBuzzword();


loadSpelling();


loadQueen();


loadWorker();


loadPollination();


});
