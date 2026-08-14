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


function refreshPlayer() {

  document
    .getElementById("xpText")
    .textContent =
      player.xp + " XP";


  document
    .getElementById("streakText")
    .textContent =
      player.streak;

}


function reward(amount) {

  player.xp += amount;

  savePlayer();

  refreshPlayer();

}



/* ==========================================================
   NAVIGATION
========================================================== */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(
      function (screen) {

        screen.classList.remove("active");

      }
    );


  const target =
    document.getElementById(id);


  if (target) {

    target.classList.add("active");

  }


  window.scrollTo(
    {
      top: 0,
      behavior: "smooth"
    }
  );

}


document
  .querySelectorAll("[data-screen]")
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


document
  .getElementById("buzzwordFeature")
  .addEventListener(
    "click",
    function () {

      showScreen("buzzwordScreen");

    }
  );



/* ==========================================================
   CHEMISTRY HELPERS
========================================================== */

const elementNames = {

  H: "Hydrogen",
  C: "Carbon",
  N: "Nitrogen",
  O: "Oxygen",

  Na: "Sodium",
  K: "Potassium",
  Li: "Lithium",

  Mg: "Magnesium",
  Ca: "Calcium",
  Al: "Aluminum",

  S: "Sulfur",
  Cl: "Chlorine",
  F: "Fluorine",
  Br: "Bromine",
  I: "Iodine"

};


const subscripts = {

  2: "₂",
  3: "₃",
  4: "₄",
  5: "₅",
  6: "₆",
  7: "₇",
  8: "₈",
  9: "₉"

};


function sequenceToFormula(sequence) {

  if (!sequence.length) {

    return "";

  }


  let result = "";

  let current =
    sequence[0];

  let count = 1;


  for (
    let i = 1;
    i <= sequence.length;
    i++
  ) {

    if (
      sequence[i] === current
    ) {

      count++;

      continue;

    }


    result += current;


    if (
      count > 1
    ) {

      result +=
        subscripts[count]
        ||
        count;

    }


    current =
      sequence[i];

    count = 1;

  }


  return result;

}


function prettyFormula(formula) {

  return formula.replace(
    /([2-9])/g,
    function (number) {

      return (
        subscripts[number]
        ||
        number
      );

    }
  );

}



/* ==========================================================
   UNIVERSAL POINTER DRAG ENGINE

   This is the important part.

   Works with:
   - mouse
   - iPhone finger
   - iPad finger
   - Apple Pencil
========================================================== */

let drag =
  null;


function registerDraggable(
  element,
  payload
) {

  element.classList.add(
    "draggable-item"
  );


  element.addEventListener(
    "pointerdown",
    function (event) {

      if (
        event.pointerType === "mouse"
        &&
        event.button !== 0
      ) {

        return;

      }


      event.preventDefault();


      const rect =
        element.getBoundingClientRect();


      drag = {

        source:
          element,

        payload:
          payload,

        pointerId:
          event.pointerId,

        startX:
          event.clientX,

        startY:
          event.clientY,

        offsetX:
          event.clientX - rect.left,

        offsetY:
          event.clientY - rect.top,

        started:
          false,

        ghost:
          null

      };


      try {

        element.setPointerCapture(
          event.pointerId
        );

      }

      catch (error) {}

    },
    {
      passive: false
    }
  );

}


document.addEventListener(
  "pointermove",
  function (event) {

    if (!drag) {

      return;

    }


    const distance =
      Math.hypot(

        event.clientX -
        drag.startX,

        event.clientY -
        drag.startY

      );


    if (
      !drag.started
      &&
      distance < 6
    ) {

      return;

    }


    event.preventDefault();


    if (
      !drag.started
    ) {

      drag.started = true;


      drag.ghost =
        drag.source.cloneNode(true);


      drag.ghost.classList.add(
        "drag-ghost"
      );


      const rect =
        drag.source
          .getBoundingClientRect();


      drag.ghost.style.width =
        rect.width + "px";


      drag.ghost.style.height =
        rect.height + "px";


      document.body.appendChild(
        drag.ghost
      );


      drag.source.style.opacity =
        ".35";

    }


    drag.ghost.style.left =
      (
        event.clientX -
        drag.offsetX
      )
      +
      "px";


    drag.ghost.style.top =
      (
        event.clientY -
        drag.offsetY
      )
      +
      "px";


    clearDropTargets();


    const target =
      getDropTarget(
        event.clientX,
        event.clientY,
        drag.payload
      );


    if (target) {

      target.classList.add(
        "drop-target"
      );

    }

  },
  {
    passive: false
  }
);


document.addEventListener(
  "pointerup",
  function (event) {

    if (!drag) {

      return;

    }


    const oldDrag =
      drag;


    const target =
      oldDrag.started
      ?
        getDropTarget(
          event.clientX,
          event.clientY,
          oldDrag.payload
        )
      :
        null;


    if (
      oldDrag.ghost
    ) {

      oldDrag.ghost.remove();

    }


    oldDrag.source.style.opacity =
      "";


    clearDropTargets();


    drag = null;


    /*
      A true drag was completed.
    */

    if (
      oldDrag.started
      &&
      target
    ) {

      handleDrop(
        oldDrag.source,
        oldDrag.payload,
        target
      );

      return;

    }


    /*
      Short tap fallback.
      Makes it usable for younger students too.
    */

    if (
      !oldDrag.started
    ) {

      handleTap(
        oldDrag.source,
        oldDrag.payload
      );

    }

  }
);


document.addEventListener(
  "pointercancel",
  cancelDrag
);


function cancelDrag() {

  if (!drag) {

    return;

  }


  if (
    drag.ghost
  ) {

    drag.ghost.remove();

  }


  drag.source.style.opacity =
    "";


  drag = null;


  clearDropTargets();

}


function clearDropTargets() {

  document
    .querySelectorAll(
      ".drop-target"
    )
    .forEach(
      function (element) {

        element.classList.remove(
          "drop-target"
        );

      }
    );

}


function inside(
  x,
  y,
  element
) {

  const rect =
    element.getBoundingClientRect();


  return (
    x >= rect.left
    &&
    x <= rect.right
    &&
    y >= rect.top
    &&
    y <= rect.bottom
  );

}


/* ==========================================================
   FIND DROP TARGET
========================================================== */

function getDropTarget(
  x,
  y,
  payload
) {

  /*
    SPELLING
  */

  if (
    payload.game === "spelling"
  ) {

    const slots =
      Array.from(
        document.querySelectorAll(
          "#spellingSlots .formula-slot:not(.filled)"
        )
      );


    return (
      slots.find(
        function (slot) {

          return inside(
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


  /*
    QUEEN
  */

  if (
    payload.game === "queen"
  ) {

    const slots =
      Array.from(
        document.querySelectorAll(
          "#queenGrid .queen-slot:not(.queen-center):not(.filled)"
        )
      );


    return (
      slots.find(
        function (slot) {

          return inside(
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


  /*
    WORKER
  */

  if (
    payload.game === "worker"
  ) {

    if (
      payload.particle === "proton"
      ||
      payload.particle === "neutron"
    ) {

      const nucleus =
        document.getElementById(
          "nucleusDrop"
        );


      if (
        inside(
          x,
          y,
          nucleus
        )
      ) {

        return nucleus;

      }

    }


    if (
      payload.particle === "electron"
    ) {

      const inner =
        document.getElementById(
          "innerShell"
        );


      const outer =
        document.getElementById(
          "outerShell"
        );


      /*
        Inner gets priority because it physically
        sits inside the outer shell.
      */

      if (
        inside(
          x,
          y,
          inner
        )
      ) {

        return inner;

      }


      if (
        inside(
          x,
          y,
          outer
        )
      ) {

        return outer;

      }

    }

  }


  /*
    POLLINATION
  */

  if (
    payload.game === "pollination"
  ) {

    const flowers =
      Array.from(
        document.querySelectorAll(
          ".flower"
        )
      );


    return (
      flowers.find(
        function (flower) {

          return inside(
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
   DROP HANDLER
========================================================== */

function handleDrop(
  source,
  payload,
  target
) {

  if (
    payload.game === "spelling"
  ) {

    placeSpelling(
      source,
      payload.symbol,
      target
    );

  }


  else if (
    payload.game === "queen"
  ) {

    placeQueen(
      source,
      payload.symbol,
      target
    );

  }


  else if (
    payload.game === "worker"
  ) {

    placeWorkerParticle(
      payload.particle,
      target
    );

  }


  else if (
    payload.game === "pollination"
  ) {

    pollinateFlower(
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
    payload.game === "spelling"
  ) {

    const target =
      document.querySelector(
        "#spellingSlots .formula-slot:not(.filled)"
      );


    if (target) {

      placeSpelling(
        source,
        payload.symbol,
        target
      );

    }

  }


  else if (
    payload.game === "queen"
  ) {

    const target =
      document.querySelector(
        "#queenGrid .queen-slot:not(.queen-center):not(.filled)"
      );


    if (target) {

      placeQueen(
        source,
        payload.symbol,
        target
      );

    }

  }


  else if (
    payload.game === "worker"
  ) {

    if (
      payload.particle === "electron"
    ) {

      const target =
        workerElectrons < 2
        ?
          document.getElementById(
            "innerShell"
          )
        :
          document.getElementById(
            "outerShell"
          );


      placeWorkerParticle(
        payload.particle,
        target
      );

    }

    else {

      placeWorkerParticle(
        payload.particle,
        document.getElementById(
          "nucleusDrop"
        )
      );

    }

  }


  else if (
    payload.game === "pollination"
  ) {

    const firstFlower =
      document.querySelector(
        ".flower"
      );


    if (firstFlower) {

      pollinateFlower(
        source,
        payload.ion,
        firstFlower
      );

    }

  }

}



/* ==========================================================
   BUZZWORD
========================================================== */

const buzzWeek = {

  number:
    "001",

  center:
    "C",

  outer:
    [
      "Cl",
      "H",
      "O",
      "N",
      "S",
      "Na"
    ],

  answers: [

    {
      sequence:
        ["C","O","O"],

      formula:
        "CO2",

      name:
        "Carbon Dioxide"
    },

    {
      sequence:
        ["C","O"],

      formula:
        "CO",

      name:
        "Carbon Monoxide"
    },

    {
      sequence:
        ["C","H","H","H","H"],

      formula:
        "CH4",

      name:
        "Methane"
    },

    {
      sequence:
        ["C","S","S"],

      formula:
        "CS2",

      name:
        "Carbon Disulfide"
    },

    {
      sequence:
        ["C","Cl","Cl","Cl","Cl"],

      formula:
        "CCl4",

      name:
        "Carbon Tetrachloride"
    },

    {
      sequence:
        ["H","C","N"],

      formula:
        "HCN",

      name:
        "Hydrogen Cyanide"
    },

    {
      sequence:
        ["H","H","C","O","O","O"],

      formula:
        "H2CO3",

      name:
        "Carbonic Acid"
    },

    {
      sequence:
        ["Na","Na","C","O","O","O"],

      formula:
        "Na2CO3",

      name:
        "Sodium Carbonate"
    }

  ]

};


let buzzSequence = [];

let buzzFound = [];


const buzzOuterButtons =
  Array.from(
    document.querySelectorAll(
      "[data-buzz-index]"
    )
  );


function loadBuzzword() {

  document
    .getElementById("buzzNumber")
    .textContent =
      "Weekly Hive • #"
      +
      buzzWeek.number;


  buzzOuterButtons.forEach(
    function (
      button,
      index
    ) {

      button.textContent =
        buzzWeek.outer[index];


      button.dataset.symbol =
        buzzWeek.outer[index];

    }
  );


  const center =
    document.getElementById(
      "buzzCenter"
    );


  center.textContent =
    buzzWeek.center;


  center.dataset.symbol =
    buzzWeek.center;


  buzzSequence = [];

  buzzFound = [];


  renderBuzz();

  renderBuzzFound();

}


function chooseBuzz(button) {

  buzzSequence.push(
    button.dataset.symbol
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


buzzOuterButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        chooseBuzz(button);

      }
    );

  }
);


document
  .getElementById("buzzCenter")
  .addEventListener(
    "click",
    function () {

      chooseBuzz(this);

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


  if (!buzzSequence.length) {

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
    sequenceToFormula(
      buzzSequence
    );


  words.textContent =
    buzzSequence
      .map(
        function (symbol) {

          return (
            elementNames[symbol]
            ||
            symbol
          );

        }
      )
      .join(" → ");

}


document
  .getElementById("buzzUndo")
  .addEventListener(
    "click",
    function () {

      buzzSequence.pop();

      renderBuzz();

    }
  );


document
  .getElementById("buzzClear")
  .addEventListener(
    "click",
    function () {

      buzzSequence = [];

      renderBuzz();

    }
  );


document
  .getElementById("buzzSubmit")
  .addEventListener(
    "click",
    function () {

      const feedback =
        document.getElementById(
          "buzzFeedback"
        );


      if (
        !buzzSequence.includes(
          buzzWeek.center
        )
      ) {

        feedback.textContent =
          "Every compound must use the gold center element: Carbon.";


        return;

      }


      const key =
        buzzSequence.join("|");


      const answer =
        buzzWeek.answers.find(
          function (candidate) {

            return (
              candidate.sequence.join("|")
              ===
              key
            );

          }
        );


      if (!answer) {

        feedback.textContent =
          "That compound is not in this week's answer hive.";


        return;

      }


      const duplicate =
        buzzFound.some(
          function (item) {

            return (
              item.formula ===
              answer.formula
            );

          }
        );


      if (duplicate) {

        feedback.textContent =
          "You already found "
          +
          answer.name
          +
          ".";


        buzzSequence = [];

        renderBuzz();

        return;

      }


      buzzFound.push(
        answer
      );


      reward(10);


      feedback.textContent =
        "🐝 "
        +
        answer.name
        +
        " found!";


      const allSymbols =
        [
          buzzWeek.center,
          ...buzzWeek.outer
        ];


      if (
        allSymbols.every(
          function (symbol) {

            return buzzSequence.includes(
              symbol
            );

          }
        )
      ) {

        document
          .getElementById(
            "moleculargram"
          )
          .classList
          .add(
            "visible"
          );

      }


      buzzSequence = [];

      renderBuzz();

      renderBuzzFound();

    }
  );


function renderBuzzFound() {

  const list =
    document.getElementById(
      "buzzFound"
    );


  list.innerHTML = "";


  document
    .getElementById(
      "buzzFoundCount"
    )
    .textContent =
      buzzFound.length;


  if (!buzzFound.length) {

    list.innerHTML =
      "<em>Your compounds will appear here.</em>";

    return;

  }


  buzzFound.forEach(
    function (answer) {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "found-row";


      row.innerHTML =
        "<strong>"
        +
        prettyFormula(
          answer.formula
        )
        +
        "</strong>"
        +
        "<span>"
        +
        answer.name
        +
        "</span>";


      list.appendChild(row);

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

    answer:
      ["H","H","O"],

    bank:
      ["H","H","O","C","N"]
  },

  {
    name:
      "carbon dioxide",

    answer:
      ["C","O","O"],

    bank:
      ["C","O","O","H","N"]
  },

  {
    name:
      "ammonia",

    answer:
      ["N","H","H","H"],

    bank:
      ["N","H","H","H","O","C"]
  },

  {
    name:
      "methane",

    answer:
      ["C","H","H","H","H"],

    bank:
      ["C","H","H","H","H","O","N"]
  }

];


let spellingIndex = 0;


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
      "Drag the atoms into the hive to spell "
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


  slots.innerHTML = "";


  /*
    EXACTLY the number of hexagons
    needed for the answer.
  */

  challenge.answer.forEach(
    function (
      unused,
      index
    ) {

      const slot =
        document.createElement(
          "button"
        );


      slot.type =
        "button";


      slot.className =
        "formula-slot";


      slot.dataset.index =
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
  );


  const bank =
    document.getElementById(
      "spellingBank"
    );


  bank.innerHTML = "";


  challenge.bank.forEach(
    function (
      symbol,
      index
    ) {

      const tile =
        createAtomHex(
          symbol
        );


      tile.dataset.sourceId =
        "s"
        +
        index;


      registerDraggable(
        tile,
        {
          game:
            "spelling",

          symbol:
            symbol
        }
      );


      bank.appendChild(
        tile
      );

    }
  );


  updateSpellingFormula();

}


function createAtomHex(symbol) {

  const tile =
    document.createElement(
      "button"
    );


  tile.type =
    "button";


  tile.className =
    "hex";


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
      elementNames[symbol]
      ||
      "Atom"
    )
    +
    "</small>";


  return tile;

}


function placeSpelling(
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
    source.dataset.sourceId;


  target.textContent =
    symbol;


  source.style.visibility =
    "hidden";


  updateSpellingFormula();

}


function returnSpelling(slot) {

  const source =
    document.querySelector(
      '[data-source-id="'
      +
      slot.dataset.sourceId
      +
      '"]'
    );


  if (source) {

    source.style.visibility =
      "";

  }


  slot.classList.remove(
    "filled"
  );


  slot.dataset.symbol = "";

  slot.dataset.sourceId = "";

  slot.textContent = "";


  updateSpellingFormula();

}


function spellingSequence() {

  return Array.from(
    document.querySelectorAll(
      "#spellingSlots .formula-slot"
    )
  )
  .map(
    function (slot) {

      return slot.dataset.symbol;

    }
  )
  .filter(Boolean);

}


function updateSpellingFormula() {

  const preview =
    document.getElementById(
      "spellingFormula"
    );


  const sequence =
    spellingSequence();


  if (!sequence.length) {

    preview.textContent =
      "Chemical formula";


    preview.classList.add(
      "empty"
    );

  }

  else {

    preview.textContent =
      sequenceToFormula(sequence);


    preview.classList.remove(
      "empty"
    );

  }

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
            "#spellingSlots .formula-slot.filled"
          )
        );


      if (filled.length) {

        returnSpelling(
          filled[
            filled.length - 1
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

      const actual =
        spellingSequence();


      const correct =
        spellingChallenges[
          spellingIndex
        ].answer;


      if (
        actual.join("|")
        ===
        correct.join("|")
      ) {

        document
          .getElementById(
            "spellingFeedback"
          )
          .textContent =
            "🐝 Correct — "
            +
            sequenceToFormula(
              correct
            )
            +
            "!";


        reward(10);


        setTimeout(
          function () {

            spellingIndex =
              (
                spellingIndex + 1
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
            "Not quite. Rearrange the atoms and try again.";

      }

    }
  );



/* ==========================================================
   QUEEN BEE
========================================================== */

const queenChallenges = [

  {
    center:
      "O",

    name:
      "water",

    answer:
      ["H","H"],

    bank:
      ["H","H","C","N","Na"]
  },

  {
    center:
      "C",

    name:
      "carbon dioxide",

    answer:
      ["O","O"],

    bank:
      ["O","O","H","N","Cl"]
  },

  {
    center:
      "N",

    name:
      "ammonia",

    answer:
      ["H","H","H"],

    bank:
      ["H","H","H","O","C"]
  },

  {
    center:
      "C",

    name:
      "methane",

    answer:
      ["H","H","H","H"],

    bank:
      ["H","H","H","H","O","N"]
  }

];


let queenIndex = 0;


const queenSlotClasses = [

  "q-top",
  "q-ul",
  "q-ur",
  "q-left",
  "q-right",
  "q-bottom",

  "q-top2",
  "q-ul2",
  "q-ur2",
  "q-left2",
  "q-right2",
  "q-bottom2"

];


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
      "Start with the Queen "
      +
      (
        elementNames[
          challenge.center
        ]
        ||
        challenge.center
      )
      +
      " and build "
      +
      challenge.name
      +
      ".";


  const grid =
    document.getElementById(
      "queenGrid"
    );


  grid.innerHTML = "";


  queenSlotClasses.forEach(
    function (
      className,
      index
    ) {

      const slot =
        document.createElement(
          "button"
        );


      slot.type =
        "button";


      slot.className =
        "queen-slot "
        +
        className;


      slot.dataset.index =
        index;


      slot.dataset.symbol =
        "";


      slot.textContent =
        "·";


      slot.addEventListener(
        "click",
        function () {

          if (
            slot.classList.contains(
              "filled"
            )
          ) {

            returnQueen(slot);

          }

        }
      );


      grid.appendChild(
        slot
      );

    }
  );


  const center =
    document.createElement(
      "div"
    );


  center.className =
    "queen-slot queen-center q-center filled";


  center.innerHTML =
    "👑<br><strong>"
    +
    challenge.center
    +
    "</strong>";


  grid.appendChild(
    center
  );


  const bank =
    document.getElementById(
      "queenBank"
    );


  bank.innerHTML = "";


  challenge.bank.forEach(
    function (
      symbol,
      index
    ) {

      const tile =
        createAtomHex(symbol);


      tile.dataset.sourceId =
        "q"
        +
        index;


      registerDraggable(
        tile,
        {
          game:
            "queen",

          symbol:
            symbol
        }
      );


      bank.appendChild(
        tile
      );

    }
  );


  document
    .getElementById(
      "queenFeedback"
    )
    .textContent =
      "";


  updateQueenFormula();

}


function placeQueen(
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
    source.dataset.sourceId;


  target.textContent =
    symbol;


  source.style.visibility =
    "hidden";


  updateQueenFormula();

}


function returnQueen(slot) {

  const source =
    document.querySelector(
      '[data-source-id="'
      +
      slot.dataset.sourceId
      +
      '"]'
    );


  if (source) {

    source.style.visibility =
      "";

  }


  slot.classList.remove(
    "filled"
  );


  slot.dataset.symbol = "";

  slot.dataset.sourceId = "";

  slot.textContent = "·";


  updateQueenFormula();

}


function queenPlacedAtoms() {

  return Array.from(
    document.querySelectorAll(
      "#queenGrid .queen-slot.filled:not(.queen-center)"
    )
  )
  .map(
    function (slot) {

      return slot.dataset.symbol;

    }
  )
  .filter(Boolean);

}


function updateQueenFormula() {

  const atoms =
    queenPlacedAtoms();


  const center =
    queenChallenges[
      queenIndex
    ].center;


  const preview =
    document.getElementById(
      "queenFormula"
    );


  if (!atoms.length) {

    preview.textContent =
      "Build around the Queen";


    preview.classList.add(
      "empty"
    );


    return;

  }


  preview.classList.remove(
    "empty"
  );


  preview.textContent =
    center
    +
    " + "
    +
    atoms.join(" • ");

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
        queenPlacedAtoms()
          .slice()
          .sort();


      const expected =
        queenChallenges[
          queenIndex
        ].answer
        .slice()
        .sort();


      if (
        actual.join("|")
        ===
        expected.join("|")
      ) {

        const challenge =
          queenChallenges[
            queenIndex
          ];


        const formula =
          sequenceToFormula(
            [
              challenge.center,
              ...challenge.answer
            ]
          );


        document
          .getElementById(
            "queenFeedback"
          )
          .textContent =
            "👑 Hive complete — "
            +
            formula
            +
            "!";


        reward(15);


        setTimeout(
          function () {

            queenIndex =
              (
                queenIndex + 1
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
            "The Queen's molecular hive is not complete yet.";

      }

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


let workerIndex = 0;

let workerProtons = 0;

let workerNeutrons = 0;

let workerElectrons = 0;


registerDraggable(
  document.getElementById(
    "protonSource"
  ),
  {
    game:
      "worker",

    particle:
      "proton"
  }
);


registerDraggable(
  document.getElementById(
    "neutronSource"
  ),
  {
    game:
      "worker",

    particle:
      "neutron"
  }
);


registerDraggable(
  document.getElementById(
    "electronSource"
  ),
  {
    game:
      "worker",

    particle:
      "electron"
  }
);


function loadWorker() {

  workerProtons = 0;

  workerNeutrons = 0;

  workerElectrons = 0;


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


  clearWorkerVisuals();

  refreshWorkerCounts();

}


function refreshWorkerCounts() {

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


function clearWorkerVisuals() {

  document
    .getElementById(
      "nucleusParticles"
    )
    .innerHTML =
      "";


  document
    .getElementById(
      "innerElectrons"
    )
    .innerHTML =
      "";


  document
    .getElementById(
      "outerElectrons"
    )
    .innerHTML =
      "";

}


function placeWorkerParticle(
  particle,
  target
) {

  if (
    particle === "proton"
  ) {

    workerProtons++;


    addNucleusParticle(
      "p⁺",
      "proton-dot"
    );

  }


  else if (
    particle === "neutron"
  ) {

    workerNeutrons++;


    addNucleusParticle(
      "n⁰",
      "neutron-dot"
    );

  }


  else if (
    particle === "electron"
  ) {

    workerElectrons++;


    addElectronVisual(
      target
    );

  }


  refreshWorkerCounts();

}


function addNucleusParticle(
  text,
  className
) {

  const container =
    document.getElementById(
      "nucleusParticles"
    );


  const dot =
    document.createElement(
      "span"
    );


  dot.className =
    "particle-dot "
    +
    className;


  dot.textContent =
    text;


  const number =
    container.children.length;


  const angle =
    number *
    2.4;


  const radius =
    36;


  dot.style.left =
    (
      58
      +
      Math.cos(angle)
      *
      radius
    )
    +
    "px";


  dot.style.top =
    (
      58
      +
      Math.sin(angle)
      *
      radius
    )
    +
    "px";


  container.appendChild(dot);

}


function addElectronVisual(target) {

  const isInner =
    target.id ===
    "innerShell";


  const container =
    document.getElementById(
      isInner
      ?
        "innerElectrons"
      :
        "outerElectrons"
    );


  const shell =
    isInner
    ?
      document.getElementById(
        "innerShell"
      )
    :
      document.getElementById(
        "outerShell"
      );


  const count =
    container.children.length;


  const angle =
    count *
    (
      Math.PI / 3
    );


  const rect =
    shell.getBoundingClientRect();


  const radius =
    rect.width /
    2
    -
    22;


  const dot =
    document.createElement(
      "span"
    );


  dot.className =
    "particle-dot electron-dot";


  dot.textContent =
    "e⁻";


  dot.style.left =
    (
      rect.width /
      2
      +
      Math.cos(angle)
      *
      radius
      -
      14
    )
    +
    "px";


  dot.style.top =
    (
      rect.height /
      2
      +
      Math.sin(angle)
      *
      radius
      -
      14
    )
    +
    "px";


  container.appendChild(dot);

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
            "🔧 Atom complete — "
            +
            challenge.name
            +
            "!";


        reward(15);


        setTimeout(
          function () {

            workerIndex =
              (
                workerIndex + 1
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
            "Check the number of protons, neutrons and electrons.";

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
      "MgCl2",

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
      "Na2O",

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
      "CaF2",

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
      "Al2O3",

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
      "Li3N",

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


let pollinationIndex = 0;

let flowerDeliveries =
  {};


function loadPollination() {

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  flowerDeliveries =
    {
      cation: 0,
      anion: 0
    };


  document
    .getElementById(
      "pollinationPrompt"
    )
    .textContent =
      "Pollinate the correct flowers to grow "
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


  const formula =
    document.getElementById(
      "pollinationFormula"
    );


  formula.textContent =
    "Grow an ionic compound";


  formula.classList.add(
    "empty"
  );


  buildPollenBank(
    challenge
  );


  buildFlowerGarden(
    challenge
  );

}


function buildPollenBank(
  challenge
) {

  const bank =
    document.getElementById(
      "pollenBank"
    );


  bank.innerHTML = "";


  const ions = [

    challenge.cation,
    challenge.cation,
    challenge.cation,

    challenge.anion,
    challenge.anion,
    challenge.anion,

    "K⁺",
    "Br⁻"

  ];


  ions.forEach(
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
        "p"
        +
        index;


      registerDraggable(
        pollen,
        {
          game:
            "pollination",

          ion:
            ion
        }
      );


      bank.appendChild(
        pollen
      );

    }
  );

}


function buildFlowerGarden(
  challenge
) {

  const garden =
    document.getElementById(
      "flowerGarden"
    );


  garden.innerHTML = "";


  const flowers = [

    {
      role:
        "cation",

      ion:
        challenge.cation
    },

    {
      role:
        "anion",

      ion:
        challenge.anion
    },

    {
      role:
        "distractor",

      ion:
        "K⁺"
    },

    {
      role:
        "distractor",

      ion:
        "Br⁻"
    }

  ];


  flowers.forEach(
    function (data) {

      const flower =
        document.createElement(
          "div"
        );


      flower.className =
        "flower";


      flower.dataset.role =
        data.role;


      flower.dataset.ion =
        data.ion;


      flower.innerHTML =
        '<div class="flower-symbol">🌼</div>'
        +
        '<div class="flower-ion">'
        +
        data.ion
        +
        '</div>'
        +
        '<div class="flower-delivery">0 pollen</div>';


      garden.appendChild(
        flower
      );

    }
  );

}


function pollinateFlower(
  source,
  ion,
  flower
) {

  /*
    Wrong ion dropped onto this flower.
  */

  if (
    flower.dataset.ion !==
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
        flower.dataset.ion
        +
        " flower.";


    return;

  }


  const role =
    flower.dataset.role;


  if (
    role !== "cation"
    &&
    role !== "anion"
  ) {

    document
      .getElementById(
        "pollinationFeedback"
      )
      .textContent =
        "That flower is not part of this compound.";


    return;

  }


  flowerDeliveries[role]++;


  source.style.visibility =
    "hidden";


  flower
    .querySelector(
      ".flower-delivery"
    )
    .textContent =
      flowerDeliveries[role]
      +
      (
        flowerDeliveries[role] === 1
        ?
          " pollen"
        :
          " pollen"
      );


  updatePollinationFormula();

}


function updatePollinationFormula() {

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  const formula =
    document.getElementById(
      "pollinationFormula"
    );


  if (
    flowerDeliveries.cation ===
    challenge.cationCount
    &&
    flowerDeliveries.anion ===
    challenge.anionCount
  ) {

    formula.textContent =
      prettyFormula(
        challenge.formula
      );


    formula.classList.remove(
      "empty"
    );

  }

  else {

    formula.textContent =
      flowerDeliveries.cation
      +
      " × "
      +
      challenge.cation
      +
      "   +   "
      +
      flowerDeliveries.anion
      +
      " × "
      +
      challenge.anion;


    formula.classList.remove(
      "empty"
    );

  }

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


      if (
        flowerDeliveries.cation ===
        challenge.cationCount
        &&
        flowerDeliveries.anion ===
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
            " formed!";


        reward(15);


        setTimeout(
          function () {

            pollinationIndex =
              (
                pollinationIndex + 1
              )
              %
              pollinationChallenges.length;


            loadPollination();

          },
          1300
        );

      }

      else {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "The pollen ratio does not neutralize the charges yet.";

      }

    }
  );



/* ==========================================================
   SHARE BUZZWORD
========================================================== */

document
  .getElementById(
    "shareBuzz"
  )
  .addEventListener(
    "click",
    async function () {

      const text =
        "🐝 MOLECULAR BEE • WEEKLY BUZZWORD #"
        +
        buzzWeek.number
        +
        "\n\n"
        +
        buzzFound.length
        +
        " compounds found"
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

        }

        else {

          await navigator.clipboard.writeText(
            text
            +
            "\n"
            +
            window.location.href
          );

        }

      }

      catch (error) {

        console.log(
          "Share cancelled."
        );

      }

    }
  );



/* ==========================================================
   START EVERYTHING
========================================================== */

refreshPlayer();

loadBuzzword();

loadSpelling();

loadQueen();

loadWorker();

loadPollination();


});
