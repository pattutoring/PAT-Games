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


function reward(
  amount
) {

  player.xp +=
    amount;


  localStorage.setItem(
    "molecularBeePlayer",
    JSON.stringify(
      player
    )
  );


  updatePlayer();

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



/* ==========================================================
   CHEMISTRY HELPERS
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

  S:
    "Sulfur",

  Cl:
    "Chlorine",

  F:
    "Fluorine",

  Br:
    "Bromine",

  I:
    "Iodine"

};


const subscripts = {

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


function formulaFromSequence(
  sequence
) {

  if (
    sequence.length ===
    0
  ) {

    return "";

  }


  let output =
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

      output +=
        current;


      if (
        count > 1
      ) {

        output +=
          subscripts[count]
          ||
          count;

      }


      current =
        sequence[i];


      count =
        1;

    }

  }


  return output;

}



/* ==========================================================
   DRAG ENGINE
========================================================== */

let activeDrag =
  null;


function registerDrag(
  element,
  payload
) {

  element.addEventListener(
    "pointerdown",
    function (
      event
    ) {

      if (
        event.pointerType ===
        "mouse"
        &&
        event.button !==
        0
      ) {

        return;

      }


      event.preventDefault();


      const rect =
        element.getBoundingClientRect();


      activeDrag = {

        source:
          element,

        payload:
          payload,

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

    },
    {
      passive:
        false
    }
  );

}


document.addEventListener(
  "pointermove",
  function (
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


    if (
      !activeDrag.moving
      &&
      distance <
      6
    ) {

      return;

    }


    event.preventDefault();


    if (
      !activeDrag.moving
    ) {

      activeDrag.moving =
        true;


      activeDrag.ghost =
        activeDrag.source
          .cloneNode(
            true
          );


      activeDrag.ghost
        .classList
        .add(
          "drag-ghost"
        );


      const rect =
        activeDrag.source
          .getBoundingClientRect();


      activeDrag.ghost.style.width =
        rect.width +
        "px";


      activeDrag.ghost.style.height =
        rect.height +
        "px";


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


    clearDragHover();


    const target =
      findDropTarget(
        event.clientX,
        event.clientY,
        activeDrag.payload
      );


    if (
      target
    ) {

      target.classList.add(
        "drag-hover"
      );

    }

  },
  {
    passive:
      false
  }
);


document.addEventListener(
  "pointerup",
  function (
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
      drag.moving
      ?
        findDropTarget(
          event.clientX,
          event.clientY,
          drag.payload
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


    clearDragHover();


    activeDrag =
      null;


    if (
      drag.moving
      &&
      target
    ) {

      handleDrop(
        drag.source,
        drag.payload,
        target
      );


      return;

    }


    if (
      !drag.moving
    ) {

      handleTap(
        drag.source,
        drag.payload
      );

    }

  }
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


    clearDragHover();

  }
);


function clearDragHover() {

  document
    .querySelectorAll(
      ".drag-hover"
    )
    .forEach(
      function (
        item
      ) {

        item.classList.remove(
          "drag-hover"
        );

      }
    );

}


function pointInside(
  x,
  y,
  element
) {

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


function findDropTarget(
  x,
  y,
  payload
) {

  if (
    payload.game ===
    "spelling"
  ) {

    const slots =
      Array.from(
        document.querySelectorAll(
          ".spelling-drop:not(.filled)"
        )
      );


    return (
      slots.find(
        function (
          slot
        ) {

          return pointInside(
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


  if (
    payload.game ===
    "queen"
  ) {

    const slots =
      Array.from(
        document.querySelectorAll(
          ".queen-slot:not(.queen-center):not(.filled)"
        )
      );


    return (
      slots.find(
        function (
          slot
        ) {

          return pointInside(
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


  if (
    payload.game ===
    "worker"
  ) {

    if (
      payload.particle ===
      "electron"
    ) {

      const inner =
        document.getElementById(
          "innerShell"
        );


      const outer =
        document.getElementById(
          "outerShell"
        );


      if (
        pointInside(
          x,
          y,
          inner
        )
      ) {

        return inner;

      }


      if (
        pointInside(
          x,
          y,
          outer
        )
      ) {

        return outer;

      }

    }

    else {

      const nucleus =
        document.getElementById(
          "nucleus"
        );


      if (
        pointInside(
          x,
          y,
          nucleus
        )
      ) {

        return nucleus;

      }

    }

  }


  if (
    payload.game ===
    "pollination"
  ) {

    const flowers =
      Array.from(
        document.querySelectorAll(
          ".flower"
        )
      );


    return (
      flowers.find(
        function (
          flower
        ) {

          return pointInside(
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


function handleDrop(
  source,
  payload,
  target
) {

  if (
    payload.game ===
    "spelling"
  ) {

    placeSpelling(
      source,
      payload.symbol,
      target
    );

  }


  if (
    payload.game ===
    "queen"
  ) {

    placeQueen(
      source,
      payload.symbol,
      target
    );

  }


  if (
    payload.game ===
    "worker"
  ) {

    placeWorkerParticle(
      payload.particle,
      target
    );

  }


  if (
    payload.game ===
    "pollination"
  ) {

    pollinate(
      source,
      payload.ion,
      target
    );

  }

}


function handleTap(
  source,
  payload
) {

  if (
    payload.game ===
    "spelling"
  ) {

    const target =
      document.querySelector(
        ".spelling-drop:not(.filled)"
      );


    if (
      target
    ) {

      placeSpelling(
        source,
        payload.symbol,
        target
      );

    }

  }


  if (
    payload.game ===
    "queen"
  ) {

    const target =
      document.querySelector(
        ".queen-slot:not(.queen-center):not(.filled)"
      );


    if (
      target
    ) {

      placeQueen(
        source,
        payload.symbol,
        target
      );

    }

  }


  if (
    payload.game ===
    "worker"
  ) {

    if (
      payload.particle ===
      "electron"
    ) {

      const target =
        workerElectrons <
        2
        ?
          document.getElementById(
            "innerShell"
          )
        :
          document.getElementById(
            "outerShell"
          );


      placeWorkerParticle(
        "electron",
        target
      );

    }

    else {

      placeWorkerParticle(
        payload.particle,
        document.getElementById(
          "nucleus"
        )
      );

    }

  }


  if (
    payload.game ===
    "pollination"
  ) {

    const flower =
      document.querySelector(
        '[data-flower-ion="'
        +
        payload.ion
        +
        '"]'
      );


    if (
      flower
    ) {

      pollinate(
        source,
        payload.ion,
        flower
      );

    }

  }

}



/* ==========================================================
   BUZZWORD
========================================================== */

const buzzHiveElements =
  [
    "Cl",
    "H",
    "O",
    "N",
    "C",
    "S",
    "Na"
  ];


const buzzAnswers =
  [

    {
      sequence:
        [
          "C",
          "O"
        ],

      formula:
        "CO",

      name:
        "Carbon Monoxide"
    },


    {
      sequence:
        [
          "C",
          "O",
          "O"
        ],

      formula:
        "CO₂",

      name:
        "Carbon Dioxide"
    },


    {
      sequence:
        [
          "C",
          "H",
          "H",
          "H",
          "H"
        ],

      formula:
        "CH₄",

      name:
        "Methane"
    },


    {
      sequence:
        [
          "C",
          "S",
          "S"
        ],

      formula:
        "CS₂",

      name:
        "Carbon Disulfide"
    },


    {
      sequence:
        [
          "C",
          "Cl",
          "Cl",
          "Cl",
          "Cl"
        ],

      formula:
        "CCl₄",

      name:
        "Carbon Tetrachloride"
    },


    {
      sequence:
        [
          "H",
          "C",
          "N"
        ],

      formula:
        "HCN",

      name:
        "Hydrogen Cyanide"
    },


    {
      sequence:
        [
          "H",
          "H",
          "C",
          "O",
          "O",
          "O"
        ],

      formula:
        "H₂CO₃",

      name:
        "Carbonic Acid"
    },


    {
      sequence:
        [
          "Na",
          "Na",
          "C",
          "O",
          "O",
          "O"
        ],

      formula:
        "Na₂CO₃",

      name:
        "Sodium Carbonate"
    }

  ];


let buzzSequence =
  [];


let buzzFound =
  [];


document
  .querySelectorAll(
    "[data-buzz]"
  )
  .forEach(
    function (
      button
    ) {

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


  if (
    buzzSequence.length ===
    0
  ) {

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


document
  .getElementById(
    "buzzUndo"
  )
  .addEventListener(
    "click",
    function () {

      buzzSequence.pop();


      renderBuzz();

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


      renderBuzz();

    }
  );


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
        !buzzSequence.includes(
          "C"
        )
      ) {

        feedback.textContent =
          "👑 Every Buzzword compound must use Carbon, the gold center element.";


        return;

      }


      const answer =
        buzzAnswers.find(
          function (
            item
          ) {

            return (
              item.sequence.join(
                "|"
              )
              ===
              buzzSequence.join(
                "|"
              )
            );

          }
        );


      if (
        !answer
      ) {

        feedback.textContent =
          "That combination is not one of this week's accepted compounds.";


        return;

      }


      const duplicate =
        buzzFound.some(
          function (
            item
          ) {

            return (
              item.formula ===
              answer.formula
            );

          }
        );


      if (
        duplicate
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
        " found!";


      reward(
        10
      );


      const moleculargram =
        buzzHiveElements.every(
          function (
            symbol
          ) {

            return buzzSequence.includes(
              symbol
            );

          }
        );


      if (
        moleculargram
      ) {

        document
          .getElementById(
            "moleculargram"
          )
          .classList
          .add(
            "visible"
          );


        feedback.textContent =
          "🐝👑 MOLECULARGRAM! Every hive element was used!";


        reward(
          25
        );

      }


      buzzSequence =
        [];


      renderBuzz();


      renderBuzzFound();

    }
  );


function renderBuzzFound() {

  const list =
    document.getElementById(
      "buzzFound"
    );


  list.innerHTML =
    "";


  document
    .getElementById(
      "buzzFoundCount"
    )
    .textContent =
      buzzFound.length;


  if (
    buzzFound.length ===
    0
  ) {

    list.innerHTML =
      "<em>Your discoveries will appear here.</em>";


    return;

  }


  buzzFound.forEach(
    function (
      answer
    ) {

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


      list.appendChild(
        row
      );

    }
  );

}



/* ==========================================================
   SPELLING BEE
========================================================== */

const spellingChallenges =
  [

    {
      name:
        "water",

      answer:
        [
          "H",
          "H",
          "O"
        ],

      bank:
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

      answer:
        [
          "C",
          "O",
          "O"
        ],

      bank:
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
        [
          "N",
          "H",
          "H",
          "H"
        ],

      bank:
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

      answer:
        [
          "C",
          "H",
          "H",
          "H",
          "H"
        ],

      bank:
        [
          "C",
          "H",
          "H",
          "H",
          "H",
          "O",
          "N"
        ]
    }

  ];


let spellingIndex =
  0;


function createAtomTile(
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
    "atom-hex";


  tile.dataset.sourceId =
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
      elementNames[
        symbol
      ]
      ||
      symbol
    )
    +
    "</small>";


  registerDrag(
    tile,
    {
      game:
        game,

      symbol:
        symbol
    }
  );


  return tile;

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
      "Build "
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


  slots.innerHTML =
    "";


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
        "spelling-drop";


      slot.dataset.slot =
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


  bank.innerHTML =
    "";


  challenge.bank.forEach(
    function (
      symbol,
      index
    ) {

      bank.appendChild(
        createAtomTile(
          symbol,
          "spelling",
          "spelling-"
          +
          index
        )
      );

    }
  );


  updateSpellingFormula();

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


function returnSpelling(
  slot
) {

  const source =
    document.querySelector(
      '[data-source-id="'
      +
      slot.dataset.sourceId
      +
      '"]'
    );


  if (
    source
  ) {

    source.style.visibility =
      "";

  }


  slot.classList.remove(
    "filled"
  );


  slot.dataset.symbol =
    "";


  slot.dataset.sourceId =
    "";


  slot.textContent =
    "";


  updateSpellingFormula();

}


function getSpellingSequence() {

  return Array
    .from(
      document.querySelectorAll(
        ".spelling-drop"
      )
    )
    .map(
      function (
        slot
      ) {

        return slot.dataset.symbol
          ||
          "";

      }
    )
    .filter(
      Boolean
    );

}


function updateSpellingFormula() {

  const sequence =
    getSpellingSequence();


  const preview =
    document.getElementById(
      "spellingFormula"
    );


  if (
    sequence.length ===
    0
  ) {

    preview.textContent =
      "Chemical formula";


    preview.classList.add(
      "empty"
    );


    return;

  }


  preview.textContent =
    formulaFromSequence(
      sequence
    );


  preview.classList.remove(
    "empty"
  );

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


      if (
        filled.length
      ) {

        returnSpelling(
          filled[
            filled.length -
            1
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

      const challenge =
        spellingChallenges[
          spellingIndex
        ];


      if (
        getSpellingSequence()
          .join(
            "|"
          )
        ===
        challenge.answer
          .join(
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
            formulaFromSequence(
              challenge.answer
            )
            +
            "!";


        reward(
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
          1000
        );

      }

      else {

        document
          .getElementById(
            "spellingFeedback"
          )
          .textContent =
            "Not quite. Rearrange the atom honeycombs and try again.";

      }

    }
  );



/* ==========================================================
   QUEEN BEE
========================================================== */

const queenChallenges =
  [

    {
      center:
        "O",

      name:
        "water",

      formula:
        "H₂O",

      answer:
        [
          "H",
          "H"
        ],

      bank:
        [
          "H",
          "H",
          "C",
          "N",
          "Na"
        ]
    },


    {
      center:
        "C",

      name:
        "carbon dioxide",

      formula:
        "CO₂",

      answer:
        [
          "O",
          "O"
        ],

      bank:
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

      answer:
        [
          "H",
          "H",
          "H"
        ],

      bank:
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

      answer:
        [
          "H",
          "H",
          "H",
          "H"
        ],

      bank:
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
      " around Queen "
      +
      (
        elementNames[
          challenge.center
        ]
        ||
        challenge.center
      )
      +
      ".";


  document
    .getElementById(
      "queenFeedback"
    )
    .textContent =
      "";


  document
    .querySelectorAll(
      ".queen-slot:not(.queen-center)"
    )
    .forEach(
      function (
        slot
      ) {

        slot.classList.remove(
          "filled"
        );


        slot.dataset.symbol =
          "";


        slot.dataset.sourceId =
          "";


        slot.textContent =
          "";

      }
    );


  document
    .getElementById(
      "queenCenter"
    )
    .innerHTML =
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
      index
    ) {

      bank.appendChild(
        createAtomTile(
          symbol,
          "queen",
          "queen-"
          +
          index
        )
      );

    }
  );


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


document
  .querySelectorAll(
    ".queen-slot:not(.queen-center)"
  )
  .forEach(
    function (
      slot
    ) {

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


          const source =
            document.querySelector(
              '[data-source-id="'
              +
              slot.dataset.sourceId
              +
              '"]'
            );


          if (
            source
          ) {

            source.style.visibility =
              "";

          }


          slot.classList.remove(
            "filled"
          );


          slot.dataset.symbol =
            "";


          slot.dataset.sourceId =
            "";


          slot.textContent =
            "";


          updateQueenFormula();

        }
      );

    }
  );


function getQueenAtoms() {

  return Array
    .from(
      document.querySelectorAll(
        ".queen-slot.filled:not(.queen-center)"
      )
    )
    .map(
      function (
        slot
      ) {

        return slot.dataset.symbol;

      }
    )
    .filter(
      Boolean
    );

}


function updateQueenFormula() {

  const challenge =
    queenChallenges[
      queenIndex
    ];


  const atoms =
    getQueenAtoms();


  const preview =
    document.getElementById(
      "queenFormula"
    );


  if (
    atoms.length ===
    0
  ) {

    preview.textContent =
      "Build around Queen "
      +
      challenge.center;


    preview.classList.add(
      "empty"
    );


    return;

  }


  preview.textContent =
    challenge.center
    +
    " + "
    +
    atoms.join(
      " • "
    );


  preview.classList.remove(
    "empty"
  );

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
        getQueenAtoms()
          .slice()
          .sort();


      const expected =
        queenChallenges[
          queenIndex
        ].answer
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
            "👑 Correct — "
            +
            queenChallenges[
              queenIndex
            ].formula
            +
            "!";


        reward(
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
          1000
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

const workerChallenges =
  [

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


let workerIndex =
  0;


let workerProtons =
  0;


let workerNeutrons =
  0;


let workerElectrons =
  0;


document
  .querySelectorAll(
    ".particle-source"
  )
  .forEach(
    function (
      source
    ) {

      registerDrag(
        source,
        {
          game:
            "worker",

          particle:
            source.dataset.particle
        }
      );

    }
  );


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


  updateWorkerCounts();

}


function updateWorkerCounts() {

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


function placeWorkerParticle(
  particle,
  target
) {

  if (
    particle ===
    "proton"
  ) {

    if (
      target.id !==
      "nucleus"
    ) {

      return;

    }


    workerProtons++;


    addNucleusParticle(
      "p⁺",
      "proton-particle"
    );

  }


  if (
    particle ===
    "neutron"
  ) {

    if (
      target.id !==
      "nucleus"
    ) {

      return;

    }


    workerNeutrons++;


    addNucleusParticle(
      "n⁰",
      "neutron-particle"
    );

  }


  if (
    particle ===
    "electron"
  ) {

    workerElectrons++;


    addElectronParticle(
      target
    );

  }


  updateWorkerCounts();

}


function addNucleusParticle(
  text,
  className
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
    className;


  particle.textContent =
    text;


  const index =
    layer.children.length;


  const angle =
    index *
    2.3;


  const radius =
    35;


  particle.style.left =
    (
      58
      +
      Math.cos(
        angle
      )
      *
      radius
    )
    +
    "px";


  particle.style.top =
    (
      58
      +
      Math.sin(
        angle
      )
      *
      radius
    )
    +
    "px";


  layer.appendChild(
    particle
  );

}


function addElectronParticle(
  shell
) {

  const layer =
    shell.querySelector(
      ".particle-layer"
    );


  const particle =
    document.createElement(
      "span"
    );


  particle.className =
    "placed-particle electron-particle";


  particle.textContent =
    "e⁻";


  const index =
    layer.children.length;


  const angle =
    index
    *
    (
      Math.PI /
      3
    );


  const radius =
    shell.clientWidth /
    2
    -
    22;


  particle.style.left =
    (
      shell.clientWidth /
      2
      +
      Math.cos(
        angle
      )
      *
      radius
      -
      14
    )
    +
    "px";


  particle.style.top =
    (
      shell.clientHeight /
      2
      +
      Math.sin(
        angle
      )
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


        reward(
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
          1000
        );

      }

      else {

        document
          .getElementById(
            "workerFeedback"
          )
          .textContent =
            challenge.name
            +
            " needs "
            +
            challenge.protons
            +
            " protons, "
            +
            challenge.neutrons
            +
            " neutrons and "
            +
            challenge.electrons
            +
            " electrons.";

      }

    }
  );



/* ==========================================================
   POLLINATION
========================================================== */

const pollinationChallenges =
  [

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
        "MgCl₂",

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
        "Na₂O",

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
        "CaF₂",

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
        "Al₂O₃",

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
        "Li₃N",

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


let pollinationIndex =
  0;


let cationDelivered =
  0;


let anionDelivered =
  0;


function loadPollination() {

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  cationDelivered =
    0;


  anionDelivered =
    0;


  document
    .getElementById(
      "pollinationPrompt"
    )
    .textContent =
      "Grow "
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


  const pollenBank =
    document.getElementById(
      "pollenBank"
    );


  pollenBank.innerHTML =
    "";


  const pollenOptions =
    [

      challenge.cation,
      challenge.cation,
      challenge.cation,

      challenge.anion,
      challenge.anion,
      challenge.anion,

      "K⁺",
      "Br⁻"

    ];


  pollenOptions.forEach(
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
        "pollen-"
        +
        index;


      registerDrag(
        pollen,
        {
          game:
            "pollination",

          ion:
            ion
        }
      );


      pollenBank.appendChild(
        pollen
      );

    }
  );


  const garden =
    document.getElementById(
      "flowerGarden"
    );


  garden.innerHTML =
    "";


  const flowers =
    [

      {
        ion:
          challenge.cation,

        role:
          "cation",

        name:
          challenge.cation
      },


      {
        ion:
          challenge.anion,

        role:
          "anion",

        name:
          challenge.anion
      },


      {
        ion:
          "K⁺",

        role:
          "distractor",

        name:
          "K⁺"
      },


      {
        ion:
          "Br⁻",

        role:
          "distractor",

        name:
          "Br⁻"
      }

    ];


  flowers.forEach(
    function (
      data,
      index
    ) {

      const flower =
        document.createElement(
          "div"
        );


      flower.className =
        "flower";


      flower.dataset.flowerIon =
        data.ion;


      flower.dataset.role =
        data.role;


      flower.innerHTML =
        '<div class="flower-emoji">'
        +
        (
          index %
          2 ===
          0
          ?
            "🌼"
          :
            "🌸"
        )
        +
        '</div>'
        +
        '<strong>'
        +
        data.name
        +
        '</strong>'
        +
        '<div class="flower-count">'
        +
        '0 pollen'
        +
        '</div>';


      garden.appendChild(
        flower
      );

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

}


function pollinate(
  source,
  ion,
  flower
) {

  if (
    flower.dataset.flowerIon !==
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
        "That flower is not part of this compound.";


    return;

  }


  if (
    flower.dataset.role ===
    "cation"
  ) {

    cationDelivered++;

  }


  if (
    flower.dataset.role ===
    "anion"
  ) {

    anionDelivered++;

  }


  source.style.visibility =
    "hidden";


  const count =
    flower.querySelector(
      ".flower-count"
    );


  count.textContent =
    (
      flower.dataset.role ===
      "cation"
      ?
        cationDelivered
      :
        anionDelivered
    )
    +
    " pollen";


  updatePollinationFormula();

}


function updatePollinationFormula() {

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  const preview =
    document.getElementById(
      "pollinationFormula"
    );


  if (
    cationDelivered ===
    challenge.cationCount
    &&
    anionDelivered ===
    challenge.anionCount
  ) {

    preview.textContent =
      challenge.formula;

  }

  else {

    preview.textContent =
      cationDelivered
      +
      " × "
      +
      challenge.cation
      +
      "   +   "
      +
      anionDelivered
      +
      " × "
      +
      challenge.anion;

  }


  preview.classList.remove(
    "empty"
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


      if (
        cationDelivered ===
        challenge.cationCount
        &&
        anionDelivered ===
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
            "!";


        reward(
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
          1200
        );

      }

      else {

        document
          .getElementById(
            "pollinationFeedback"
          )
          .textContent =
            "The ion ratio does not balance the charge yet.";

      }

    }
  );



/* ==========================================================
   BUZZWORD SHARE
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
            +
            "\n"
            +
            window.location.href
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
   START
========================================================== */

updatePlayer();


renderBuzz();


renderBuzzFound();


loadSpelling();


loadQueen();


loadWorker();


loadPollination();


});
