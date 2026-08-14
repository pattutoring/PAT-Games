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


function updatePlayer() {

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


  localStorage.setItem(
    "molecularBeePlayer",
    JSON.stringify(player)
  );


  updatePlayer();

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

      showScreen(
        "buzzwordScreen"
      );

    }
  );



/* ==========================================================
   HELPERS
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


function formulaFromSequence(sequence) {

  if (!sequence.length) {

    return "";

  }


  let output = "";

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
      sequence[i] === current
    ) {

      count++;

    }

    else {

      output += current;


      if (count > 1) {

        output +=
          subscripts[count]
          ||
          count;

      }


      current =
        sequence[i];

      count = 1;

    }

  }


  return output;

}



/* ==========================================================
   ACTUAL POINTER DRAG ENGINE
========================================================== */

let activeDrag = null;


function startDrag(
  event,
  element
) {

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


  activeDrag = {

    source:
      element,

    game:
      element.dataset.game,

    symbol:
      element.dataset.symbol,

    ion:
      element.dataset.ion,

    particle:
      element.dataset.particle,

    startX:
      event.clientX,

    startY:
      event.clientY,

    offsetX:
      event.clientX -
      rect.left,

    offsetY:
      event.clientY -
      rect.top,

    moving:
      false,

    ghost:
      null

  };

}


document
  .querySelectorAll(".draggable")
  .forEach(
    function (element) {

      element.addEventListener(
        "pointerdown",
        function (event) {

          startDrag(
            event,
            element
          );

        },
        {
          passive: false
        }
      );

    }
  );


document.addEventListener(
  "pointermove",
  function (event) {

    if (!activeDrag) {

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
      !activeDrag.moving
      &&
      distance < 6
    ) {

      return;

    }


    event.preventDefault();


    if (!activeDrag.moving) {

      activeDrag.moving = true;


      activeDrag.ghost =
        activeDrag.source
          .cloneNode(true);


      activeDrag.ghost
        .classList
        .add("drag-ghost");


      const rect =
        activeDrag.source
          .getBoundingClientRect();


      activeDrag.ghost.style.width =
        rect.width + "px";


      activeDrag.ghost.style.height =
        rect.height + "px";


      document.body.appendChild(
        activeDrag.ghost
      );


      activeDrag.source.style.opacity =
        ".35";

    }


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


    clearHover();


    const target =
      findTarget(
        event.clientX,
        event.clientY
      );


    if (target) {

      target.classList.add(
        "drag-hover"
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

    if (!activeDrag) {

      return;

    }


    const oldDrag =
      activeDrag;


    const target =
      oldDrag.moving
      ?
        findTarget(
          event.clientX,
          event.clientY
        )
      :
        null;


    if (oldDrag.ghost) {

      oldDrag.ghost.remove();

    }


    oldDrag.source.style.opacity =
      "";


    clearHover();


    activeDrag = null;


    if (
      oldDrag.moving
      &&
      target
    ) {

      completeDrop(
        oldDrag,
        target
      );


      return;

    }


    /*
      TAP FALLBACK
    */

    tapFallback(oldDrag);

  }
);


function clearHover() {

  document
    .querySelectorAll(
      ".drag-hover"
    )
    .forEach(
      function (item) {

        item.classList.remove(
          "drag-hover"
        );

      }
    );

}



/* ==========================================================
   DROP TARGET DETECTION
========================================================== */

function findTarget(x,y) {

  const element =
    document.elementFromPoint(
      x,
      y
    );


  if (!element) {

    return null;

  }


  /*
    SPELLING
  */

  if (
    activeDrag.game ===
    "spelling"
  ) {

    return element.closest(
      ".spelling-drop:not(.filled)"
    );

  }


  /*
    QUEEN
  */

  if (
    activeDrag.game ===
    "queen"
  ) {

    return element.closest(
      ".queen-slot:not(.queen-center):not(.filled)"
    );

  }


  /*
    POLLINATION
  */

  if (
    activeDrag.game ===
    "pollination"
  ) {

    return element.closest(
      ".flower"
    );

  }


  /*
    WORKER
  */

  if (
    activeDrag.game ===
    "worker"
  ) {

    if (
      activeDrag.particle ===
      "electron"
    ) {

      return (
        element.closest(
          "#innerShell"
        )
        ||
        element.closest(
          "#outerShell"
        )
      );

    }


    return element.closest(
      "#nucleus"
    );

  }


  return null;

}



/* ==========================================================
   DROP ROUTING
========================================================== */

function completeDrop(
  drag,
  target
) {

  if (
    drag.game ===
    "spelling"
  ) {

    placeSpelling(
      drag.source,
      drag.symbol,
      target
    );

  }


  else if (
    drag.game ===
    "queen"
  ) {

    placeQueen(
      drag.source,
      drag.symbol,
      target
    );

  }


  else if (
    drag.game ===
    "pollination"
  ) {

    pollinate(
      drag.source,
      drag.ion,
      target
    );

  }


  else if (
    drag.game ===
    "worker"
  ) {

    placeParticle(
      drag.particle,
      target
    );

  }

}



/* ==========================================================
   TAP FALLBACK
========================================================== */

function tapFallback(drag) {

  if (
    drag.game ===
    "spelling"
  ) {

    const target =
      document.querySelector(
        ".spelling-drop:not(.filled)"
      );


    if (target) {

      placeSpelling(
        drag.source,
        drag.symbol,
        target
      );

    }

  }


  else if (
    drag.game ===
    "queen"
  ) {

    const target =
      document.querySelector(
        ".queen-slot:not(.queen-center):not(.filled)"
      );


    if (target) {

      placeQueen(
        drag.source,
        drag.symbol,
        target
      );

    }

  }


  else if (
    drag.game ===
    "worker"
  ) {

    if (
      drag.particle ===
      "electron"
    ) {

      placeParticle(
        "electron",
        document.getElementById(
          "innerShell"
        )
      );

    }

    else {

      placeParticle(
        drag.particle,
        document.getElementById(
          "nucleus"
        )
      );

    }

  }


  else if (
    drag.game ===
    "pollination"
  ) {

    const target =
      document.querySelector(
        '.flower[data-flower-ion="'
        +
        drag.ion
        +
        '"]'
      );


    if (target) {

      pollinate(
        drag.source,
        drag.ion,
        target
      );

    }

  }

}



/* ==========================================================
   BUZZWORD
========================================================== */

let buzzSequence = [];

let buzzFound = [];


const buzzAnswers = [

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
      ["C","O","O"],

    formula:
      "CO₂",

    name:
      "Carbon Dioxide"
  },


  {
    sequence:
      ["C","H","H","H","H"],

    formula:
      "CH₄",

    name:
      "Methane"
  },


  {
    sequence:
      ["C","S","S"],

    formula:
      "CS₂",

    name:
      "Carbon Disulfide"
  },


  {
    sequence:
      ["C","Cl","Cl","Cl","Cl"],

    formula:
      "CCl₄",

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
      "H₂CO₃",

    name:
      "Carbonic Acid"
  },


  {
    sequence:
      ["Na","Na","C","O","O","O"],

    formula:
      "Na₂CO₃",

    name:
      "Sodium Carbonate"
  }

];


document
  .querySelectorAll("[data-buzz]")
  .forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          buzzSequence.push(
            button.dataset.buzz
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
      );

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
    formulaFromSequence(
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
        !buzzSequence.includes("C")
      ) {

        feedback.textContent =
          "Every answer must use Carbon, the gold center element.";


        return;

      }


      const answer =
        buzzAnswers.find(
          function (item) {

            return (
              item.sequence.join("|")
              ===
              buzzSequence.join("|")
            );

          }
        );


      if (!answer) {

        feedback.textContent =
          "That combination is not one of this week's compounds.";


        return;

      }


      if (
        buzzFound.some(
          function (item) {

            return (
              item.formula ===
              answer.formula
            );

          }
        )
      ) {

        feedback.textContent =
          "You already discovered "
          +
          answer.name
          +
          ".";


        return;

      }


      buzzFound.push(
        answer
      );


      feedback.textContent =
        "🐝 "
        +
        answer.name
        +
        "!";


      reward(10);


      renderFoundBuzz();


      buzzSequence = [];

      renderBuzz();

    }
  );


function renderFoundBuzz() {

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
        answer.formula
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
  }

];


let spellingIndex = 0;


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


  target.dataset.source =
    source.dataset.source;


  target.textContent =
    symbol;


  source.style.visibility =
    "hidden";


  updateSpellingFormula();

}


function spellingSequence() {

  return Array
    .from(
      document.querySelectorAll(
        ".spelling-drop"
      )
    )
    .map(
      function (slot) {

        return slot.dataset.symbol
          ||
          "";

      }
    )
    .filter(Boolean);

}


function updateSpellingFormula() {

  const sequence =
    spellingSequence();


  const preview =
    document.getElementById(
      "spellingFormula"
    );


  if (!sequence.length) {

    preview.textContent =
      "Chemical formula";


    preview.classList.add(
      "empty"
    );


    return;

  }


  preview.classList.remove(
    "empty"
  );


  preview.textContent =
    formulaFromSequence(
      sequence
    );

}


function resetSpelling() {

  loadSpellingChallenge(
    spellingIndex
  );

}


function loadSpellingChallenge(index) {

  const challenge =
    spellingChallenges[index];


  document
    .getElementById(
      "spellingPrompt"
    )
    .textContent =
      "Build "
      +
      challenge.name
      +
      ".";


  const slots =
    document.getElementById(
      "spellingSlots"
    );


  slots.innerHTML = "";


  challenge.answer.forEach(
    function (
      unused,
      slotIndex
    ) {

      const slot =
        document.createElement(
          "button"
        );


      slot.type =
        "button";


      slot.className =
        "drop-hex spelling-drop";


      slot.dataset.slot =
        slotIndex;


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
      bankIndex
    ) {

      const tile =
        buildAtomTile(
          symbol,
          "spelling",
          "s"
          +
          bankIndex
        );


      bank.appendChild(tile);

    }
  );


  document
    .getElementById(
      "spellingFeedback"
    )
    .textContent =
      "";


  updateSpellingFormula();

}


function buildAtomTile(
  symbol,
  game,
  sourceId
) {

  const tile =
    document.createElement(
      "button"
    );


  tile.type =
    "button";


  tile.className =
    "atom-hex draggable";


  tile.dataset.game =
    game;


  tile.dataset.symbol =
    symbol;


  tile.dataset.source =
    sourceId;


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
      symbol
    )
    +
    "</small>";


  tile.addEventListener(
    "pointerdown",
    function (event) {

      startDrag(
        event,
        tile
      );

    },
    {
      passive: false
    }
  );


  return tile;

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
            ".spelling-drop.filled"
          )
        );


      if (!filled.length) {

        return;

      }


      const slot =
        filled[
          filled.length - 1
        ];


      const source =
        document.querySelector(
          '[data-source="'
          +
          slot.dataset.source
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


      slot.textContent =
        "";


      delete slot.dataset.symbol;

      delete slot.dataset.source;


      updateSpellingFormula();

    }
  );


document
  .getElementById(
    "spellingReset"
  )
  .addEventListener(
    "click",
    resetSpelling
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


      if (
        spellingSequence()
          .join("|")
        ===
        challenge.answer
          .join("|")
      ) {

        document
          .getElementById(
            "spellingFeedback"
          )
          .textContent =
            "🐝 Correct — "
            +
            formulaFromSequence(
              challenge.answer
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


            loadSpellingChallenge(
              spellingIndex
            );

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
            "Not quite. Move the atoms into the correct formula order.";

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
  }

];


let queenIndex = 0;


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


  target.dataset.source =
    source.dataset.source;


  target.textContent =
    symbol;


  source.style.visibility =
    "hidden";


  updateQueenFormula();

}


function queenAtoms() {

  return Array
    .from(
      document.querySelectorAll(
        ".queen-slot.filled:not(.queen-center)"
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

  const challenge =
    queenChallenges[
      queenIndex
    ];


  const atoms =
    queenAtoms();


  const preview =
    document.getElementById(
      "queenFormula"
    );


  if (!atoms.length) {

    preview.textContent =
      "Grow outward from "
      +
      challenge.center;


    preview.classList.add(
      "empty"
    );


    return;

  }


  preview.classList.remove(
    "empty"
  );


  preview.textContent =
    challenge.center
    +
    " + "
    +
    atoms.join(" • ");

}


function loadQueenChallenge(index) {

  const challenge =
    queenChallenges[index];


  document
    .getElementById(
      "queenPrompt"
    )
    .textContent =
      "Build "
      +
      challenge.name
      +
      " around the Queen "
      +
      challenge.center
      +
      ".";


  document
    .querySelectorAll(
      ".queen-slot:not(.queen-center)"
    )
    .forEach(
      function (slot) {

        slot.classList.remove(
          "filled"
        );


        slot.textContent =
          "";


        delete slot.dataset.symbol;

        delete slot.dataset.source;

      }
    );


  const center =
    document.querySelector(
      ".queen-center"
    );


  center.innerHTML =
    "<span>👑</span>"
    +
    "<strong>"
    +
    challenge.center
    +
    "</strong>";


  const bank =
    document.getElementById(
      "queenBank"
    );


  bank.innerHTML =
    "";


  challenge.bank.forEach(
    function (
      symbol,
      bankIndex
    ) {

      bank.appendChild(
        buildAtomTile(
          symbol,
          "queen",
          "q"
          +
          bankIndex
        )
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


document
  .getElementById(
    "queenReset"
  )
  .addEventListener(
    "click",
    function () {

      loadQueenChallenge(
        queenIndex
      );

    }
  );


document
  .getElementById(
    "queenCheck"
  )
  .addEventListener(
    "click",
    function () {

      const actual =
        queenAtoms()
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

        document
          .getElementById(
            "queenFeedback"
          )
          .textContent =
            "👑 Molecular hive complete!";


        reward(15);


        setTimeout(
          function () {

            queenIndex =
              (
                queenIndex + 1
              )
              %
              queenChallenges.length;


            loadQueenChallenge(
              queenIndex
            );

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
            "The molecular hive is not complete yet.";

      }

    }
  );



/* ==========================================================
   WORKER BEE
========================================================== */

let workerProtons = 0;

let workerNeutrons = 0;

let workerElectrons = 0;


function placeParticle(
  particle,
  target
) {

  if (
    particle === "proton"
  ) {

    if (
      target.id !== "nucleus"
    ) {

      return;

    }


    workerProtons++;


    addNuclearParticle(
      "p⁺",
      "proton"
    );

  }


  else if (
    particle === "neutron"
  ) {

    if (
      target.id !== "nucleus"
    ) {

      return;

    }


    workerNeutrons++;


    addNuclearParticle(
      "n⁰",
      "neutron"
    );

  }


  else if (
    particle === "electron"
  ) {

    workerElectrons++;


    addElectron(
      target
    );

  }


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


function addNuclearParticle(
  text,
  type
) {

  const layer =
    document.getElementById(
      "nucleusParticles"
    );


  const particle =
    document.createElement(
      "span"
    );


  particle.className =
    "placed-particle "
    +
    type;


  particle.textContent =
    text;


  const count =
    layer.children.length;


  const angle =
    count * 2.3;


  particle.style.left =
    (
      57
      +
      Math.cos(angle)
      *
      34
    )
    +
    "px";


  particle.style.top =
    (
      57
      +
      Math.sin(angle)
      *
      34
    )
    +
    "px";


  layer.appendChild(
    particle
  );

}


function addElectron(target) {

  const layer =
    target.querySelector(
      ".particle-layer"
    );


  const particle =
    document.createElement(
      "span"
    );


  particle.className =
    "placed-particle electron";


  particle.textContent =
    "e⁻";


  const count =
    layer.children.length;


  const angle =
    count *
    Math.PI /
    3;


  const radius =
    target.clientWidth /
    2
    -
    22;


  particle.style.left =
    (
      target.clientWidth /
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


  particle.style.top =
    (
      target.clientHeight /
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


  layer.appendChild(
    particle
  );

}


function resetWorker() {

  workerProtons = 0;

  workerNeutrons = 0;

  workerElectrons = 0;


  document
    .getElementById(
      "protonCount"
    )
    .textContent =
      "0";


  document
    .getElementById(
      "neutronCount"
    )
    .textContent =
      "0";


  document
    .getElementById(
      "nucleusParticles"
    )
    .innerHTML =
      "";


  document
    .getElementById(
      "innerParticles"
    )
    .innerHTML =
      "";


  document
    .getElementById(
      "outerParticles"
    )
    .innerHTML =
      "";


  document
    .getElementById(
      "workerFeedback"
    )
    .textContent =
      "";

}


document
  .getElementById(
    "workerReset"
  )
  .addEventListener(
    "click",
    resetWorker
  );


document
  .getElementById(
    "workerCheck"
  )
  .addEventListener(
    "click",
    function () {

      if (
        workerProtons === 2
        &&
        workerNeutrons === 2
        &&
        workerElectrons === 2
      ) {

        document
          .getElementById(
            "workerFeedback"
          )
          .textContent =
            "🔧 Correct — Helium-4!";


        reward(15);

      }

      else {

        document
          .getElementById(
            "workerFeedback"
          )
          .textContent =
            "Helium-4 needs 2 protons, 2 neutrons and 2 electrons.";

      }

    }
  );



/* ==========================================================
   POLLINATION
========================================================== */

let sodiumPollen = 0;

let chloridePollen = 0;


function pollinate(
  source,
  ion,
  flower
) {

  if (
    flower.dataset.flowerIon
    !==
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
        flower.dataset.flowerIon
        +
        " flower.";


    return;

  }


  if (
    flower.dataset.role ===
    "distractor"
  ) {

    document
      .getElementById(
        "pollinationFeedback"
      )
      .textContent =
        "That flower is not part of sodium chloride.";


    return;

  }


  if (
    ion === "Na⁺"
  ) {

    sodiumPollen++;

  }


  if (
    ion === "Cl⁻"
  ) {

    chloridePollen++;

  }


  source.style.visibility =
    "hidden";


  const count =
    flower.querySelector(
      ".flower-count"
    );


  const amount =
    ion === "Na⁺"
    ?
      sodiumPollen
    :
      chloridePollen;


  count.textContent =
    amount
    +
    " pollen";


  updatePollinationFormula();

}


function updatePollinationFormula() {

  const preview =
    document.getElementById(
      "pollinationFormula"
    );


  if (
    sodiumPollen === 1
    &&
    chloridePollen === 1
  ) {

    preview.textContent =
      "NaCl";


    preview.classList.remove(
      "empty"
    );

  }

  else {

    preview.textContent =
      sodiumPollen
      +
      " × Na⁺ + "
      +
      chloridePollen
      +
      " × Cl⁻";


    preview.classList.remove(
      "empty"
    );

  }

}


function resetPollination() {

  sodiumPollen = 0;

  chloridePollen = 0;


  document
    .querySelectorAll(
      "#pollenBank .pollen"
    )
    .forEach(
      function (pollen) {

        pollen.style.visibility =
          "";

      }
    );


  document
    .querySelectorAll(
      ".flower-count"
    )
    .forEach(
      function (counter) {

        counter.textContent =
          "0 pollen";

      }
    );


  const preview =
    document.getElementById(
      "pollinationFormula"
    );


  preview.textContent =
    "Grow an ionic compound";


  preview.classList.add(
    "empty"
  );


  document
    .getElementById(
      "pollinationFeedback"
    )
    .textContent =
      "";

}


document
  .getElementById(
    "pollinationReset"
  )
  .addEventListener(
    "click",
    resetPollination
  );


document
  .getElementById(
    "pollinationCheck"
  )
  .addEventListener(
    "click",
    function () {

      if (
        sodiumPollen === 1
        &&
        chloridePollen === 1
      ) {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "🌼🐝 Charges balanced — Sodium Chloride!";


        reward(15);

      }

      else {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "You need one Na⁺ and one Cl⁻ to make neutral NaCl.";

      }

    }
  );



/* ==========================================================
   SHARE
========================================================== */

document
  .getElementById(
    "shareBuzz"
  )
  .addEventListener(
    "click",
    async function () {

      const text =
        "🐝 MOLECULAR BEE • WEEKLY BUZZWORD #001"
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
   INITIALIZE
========================================================== */

updatePlayer();

renderBuzz();

updateSpellingFormula();

updateQueenFormula();

resetWorker();

resetPollination();


});
