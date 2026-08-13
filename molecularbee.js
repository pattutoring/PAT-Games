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


  player.streak++;


  savePlayer();


  updatePlayerDisplay();

}


/* ==========================================================
   NAVIGATION
========================================================== */

function showScreen(
  id
) {

  const targetScreen =
    document.getElementById(
      id
    );


  if (
    !targetScreen
  ) {

    console.log(
      "Screen not found:",
      id
    );

    return;

  }


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


  targetScreen.classList.add(
    "active"
  );


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
   BUZZWORD HOME BUTTON

   Dedicated listener so the entire Buzzword card
   always opens the game.
========================================================== */

const buzzwordFeature =
  document.getElementById(
    "buzzwordFeature"
  );


if (
  buzzwordFeature
) {

  buzzwordFeature.addEventListener(
    "click",
    function (
      event
    ) {

      event.preventDefault();


      showScreen(
        "buzzwordScreen"
      );

    }
  );

}


/* ==========================================================
   NORMAL MODE NAVIGATION
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
        function (
          event
        ) {

          event.preventDefault();


          const target =
            button.getAttribute(
              "data-screen"
            );


          if (
            target
          ) {

            showScreen(
              target
            );

          }

        }
      );

    }
  );


/* ==========================================================
   CREATE HONEYCOMB TILE
========================================================== */

function createHex(
  symbol,
  label
) {

  const hex =
    document.createElement(
      "button"
    );


  hex.type =
    "button";


  hex.className =
    "hex";


  const strong =
    document.createElement(
      "strong"
    );


  strong.textContent =
    symbol;


  hex.appendChild(
    strong
  );


  if (
    label
  ) {

    const small =
      document.createElement(
        "small"
      );


    small.textContent =
      label;


    hex.appendChild(
      small
    );

  }


  return hex;

}


/* ==========================================================
   BUZZWORD DATABASE
========================================================== */

const buzzwords =
  [

    {
      number:
        "001",

      name:
        "Carbon Dioxide",

      formula:
        "CO₂",

      center:
        "C",

      centerName:
        "Carbon",

      type:
        "Covalent Molecule",

      slots:
        [
          "O",
          "O",
          null,
          null,
          null,
          null
        ],

      tiles:
        [
          "O",
          "O",
          "H",
          "N",
          "Cl",
          "Na"
        ],

      prompt:
        "Complete today's molecular hive around carbon.",

      hint:
        "The revealed carbon center needs two oxygen honeycombs.",

      why:
        "Carbon dioxide contains one carbon atom and two oxygen atoms, giving the molecular formula CO₂.",

      fact:
        "Plants absorb carbon dioxide during photosynthesis and use its carbon when constructing sugars.",

      pieceCount:
        3
    },


    {
      number:
        "002",

      name:
        "Ammonia",

      formula:
        "NH₃",

      center:
        "N",

      centerName:
        "Nitrogen",

      type:
        "Covalent Molecule",

      slots:
        [
          "H",
          "H",
          "H",
          null,
          null,
          null
        ],

      tiles:
        [
          "H",
          "H",
          "H",
          "O",
          "C",
          "Cl"
        ],

      prompt:
        "Complete the ammonia molecular hive around nitrogen.",

      hint:
        "Three hydrogen honeycombs complete the molecule.",

      why:
        "Ammonia contains one nitrogen atom and three hydrogen atoms, producing NH₃.",

      fact:
        "Ammonia is an important starting material in fertilizer production.",

      pieceCount:
        4
    },


    {
      number:
        "003",

      name:
        "Methane",

      formula:
        "CH₄",

      center:
        "C",

      centerName:
        "Carbon",

      type:
        "Covalent Molecule",

      slots:
        [
          "H",
          "H",
          "H",
          "H",
          null,
          null
        ],

      tiles:
        [
          "H",
          "H",
          "H",
          "H",
          "O",
          "N"
        ],

      prompt:
        "Build methane around its revealed carbon center.",

      hint:
        "Four hydrogen honeycombs belong around carbon.",

      why:
        "Methane contains one carbon atom and four hydrogen atoms, producing CH₄.",

      fact:
        "Methane is the simplest hydrocarbon.",

      pieceCount:
        5
    },


    {
      number:
        "004",

      name:
        "Calcium Nitrate",

      formula:
        "Ca(NO₃)₂",

      center:
        "Ca²⁺",

      centerName:
        "Calcium ion",

      type:
        "Ionic / Polyatomic",

      slots:
        [
          "NO₃⁻",
          "NO₃⁻",
          null,
          null,
          null,
          null
        ],

      tiles:
        [
          "NO₃⁻",
          "NO₃⁻",
          "Cl⁻",
          "OH⁻",
          "SO₄²⁻",
          "Na⁺"
        ],

      prompt:
        "Complete the calcium nitrate ionic hive.",

      hint:
        "The +2 center requires two −1 nitrate ions.",

      why:
        "Two nitrate ions contribute −2 total charge, balancing one Ca²⁺ ion.",

      fact:
        "Calcium nitrate is commonly used in fertilizers.",

      pieceCount:
        3
    },


    {
      number:
        "005",

      name:
        "Sulfuric Acid",

      formula:
        "H₂SO₄",

      center:
        "S",

      centerName:
        "Sulfur",

      type:
        "Molecular Compound",

      slots:
        [
          "H₂",
          "O",
          "O",
          "O",
          "O",
          null
        ],

      tiles:
        [
          "H₂",
          "O",
          "O",
          "O",
          "O",
          "N"
        ],

      prompt:
        "Complete the sulfuric acid hive around sulfur.",

      hint:
        "Account for two hydrogen atoms and four oxygen atoms.",

      why:
        "Sulfuric acid contains two hydrogen atoms, one sulfur atom and four oxygen atoms.",

      fact:
        "Sulfuric acid is one of the world's most widely produced industrial chemicals.",

      pieceCount:
        7
    },


    {
      number:
        "006",

      name:
        "Ammonium Sulfate",

      formula:
        "(NH₄)₂SO₄",

      center:
        "SO₄²⁻",

      centerName:
        "Sulfate ion",

      type:
        "Ionic / Polyatomic",

      slots:
        [
          "NH₄⁺",
          "NH₄⁺",
          null,
          null,
          null,
          null
        ],

      tiles:
        [
          "NH₄⁺",
          "NH₄⁺",
          "Na⁺",
          "Ca²⁺",
          "H⁺",
          "Cl⁻"
        ],

      prompt:
        "Balance the sulfate center to complete ammonium sulfate.",

      hint:
        "The −2 sulfate center requires two +1 ammonium ions.",

      why:
        "Two NH₄⁺ ions provide +2 total charge and balance SO₄²⁻.",

      fact:
        "Ammonium sulfate is commonly used as a nitrogen-rich fertilizer.",

      pieceCount:
        3
    }

  ];


/* ==========================================================
   DAILY BUZZWORD SELECTION
========================================================== */

const buzzStartDate =
  new Date(
    "2026-08-13T00:00:00"
  );


const buzzToday =
  new Date();


buzzToday.setHours(
  0,
  0,
  0,
  0
);


const buzzDaysPassed =
  Math.max(
    0,
    Math.floor(
      (
        buzzToday -
        buzzStartDate
      )
      /
      86400000
    )
  );


const buzzIndex =
  buzzDaysPassed %
  buzzwords.length;


const activeBuzz =
  buzzwords[
    buzzIndex
  ];


/* ==========================================================
   BUZZWORD STATE
========================================================== */

let selectedBuzzPiece =
  null;


let selectedBuzzButton =
  null;


let buzzAttemptCount =
  0;


let buzzSolved =
  false;


/* ==========================================================
   BUZZWORD ELEMENTS
========================================================== */

const buzzCenter =
  document.getElementById(
    "buzzCenter"
  );


const buzzCells =
  Array.from(
    document.querySelectorAll(
      "[data-buzz-slot]"
    )
  );


const buzzTiles =
  document.getElementById(
    "buzzTiles"
  );


const buzzFeedback =
  document.getElementById(
    "buzzFeedback"
  );


const buzzReveal =
  document.getElementById(
    "buzzReveal"
  );


/* ==========================================================
   LOAD BUZZWORD
========================================================== */

function loadBuzzword() {

  selectedBuzzPiece =
    null;


  selectedBuzzButton =
    null;


  buzzAttemptCount =
    0;


  buzzSolved =
    false;


  buzzCenter.textContent =
    activeBuzz.center;


  document
    .getElementById(
      "buzzwordNumber"
    )
    .textContent =
      "Molecule of the Day • #"
      +
      activeBuzz.number;


  document
    .getElementById(
      "homeBuzzwordTitle"
    )
    .textContent =
      "Buzzword #"
      +
      activeBuzz.number
      +
      " • Molecule of the Day";


  document
    .getElementById(
      "buzzwordPrompt"
    )
    .textContent =
      activeBuzz.prompt;


  document
    .getElementById(
      "buzzHint"
    )
    .textContent =
      activeBuzz.hint;


  document
    .getElementById(
      "buzzAttempts"
    )
    .textContent =
      "0";


  document
    .getElementById(
      "buzzStreak"
    )
    .textContent =
      player.streak;


  buzzFeedback.textContent =
    "";


  buzzReveal.classList.remove(
    "visible"
  );


  buzzCells.forEach(
    function (
      cell
    ) {

      cell.classList.remove(
        "filled"
      );


      cell.dataset.symbol =
        "";


      delete cell.dataset.pieceIndex;


      cell.innerHTML =
        "<span>?</span>";

    }
  );


  renderBuzzTiles();

}


/* ==========================================================
   BUZZWORD TILES
========================================================== */

function renderBuzzTiles() {

  buzzTiles.innerHTML =
    "";


  activeBuzz.tiles.forEach(
    function (
      symbol,
      index
    ) {

      const tile =
        document.createElement(
          "button"
        );


      tile.type =
        "button";


      tile.className =
        "buzz-piece";


      tile.textContent =
        symbol;


      tile.dataset.symbol =
        symbol;


      tile.dataset.piece =
        index;


      tile.addEventListener(
        "click",
        function () {

          if (
            tile.classList.contains(
              "used"
            )
          ) {

            return;

          }


          buzzTiles
            .querySelectorAll(
              ".buzz-piece"
            )
            .forEach(
              function (
                other
              ) {

                other.classList.remove(
                  "selected"
                );

              }
            );


          tile.classList.add(
            "selected"
          );


          selectedBuzzPiece =
            symbol;


          selectedBuzzButton =
            tile;

        }
      );


      buzzTiles.appendChild(
        tile
      );

    }
  );

}


/* ==========================================================
   BUZZWORD CELL INTERACTION
========================================================== */

buzzCells.forEach(
  function (
    cell
  ) {

    cell.addEventListener(
      "click",
      function () {

        if (
          buzzSolved
        ) {

          return;

        }


        /*
          Remove an existing piece.
        */

        if (
          cell.classList.contains(
            "filled"
          )
        ) {

          const pieceIndex =
            cell.dataset.pieceIndex;


          const originalTile =
            buzzTiles.querySelector(
              '[data-piece="'
              +
              pieceIndex
              +
              '"]'
            );


          if (
            originalTile
          ) {

            originalTile.classList.remove(
              "used"
            );

          }


          cell.classList.remove(
            "filled"
          );


          cell.dataset.symbol =
            "";


          delete cell.dataset.pieceIndex;


          cell.innerHTML =
            "<span>?</span>";


          return;

        }


        if (
          !selectedBuzzPiece ||
          !selectedBuzzButton
        ) {

          buzzFeedback.textContent =
            "Select a molecular honeycomb first.";


          return;

        }


        cell.classList.add(
          "filled"
        );


        cell.dataset.symbol =
          selectedBuzzPiece;


        cell.dataset.pieceIndex =
          selectedBuzzButton
            .dataset
            .piece;


        cell.innerHTML =
          "<span>"
          +
          selectedBuzzPiece
          +
          "</span>";


        selectedBuzzButton
          .classList
          .remove(
            "selected"
          );


        selectedBuzzButton
          .classList
          .add(
            "used"
          );


        selectedBuzzPiece =
          null;


        selectedBuzzButton =
          null;


        buzzFeedback.textContent =
          "";

      }
    );

  }
);


/* ==========================================================
   CHECK BUZZWORD
========================================================== */

document
  .getElementById(
    "buzzCheck"
  )
  .addEventListener(
    "click",
    function () {

      if (
        buzzSolved
      ) {

        return;

      }


      buzzAttemptCount++;


      document
        .getElementById(
          "buzzAttempts"
        )
        .textContent =
          buzzAttemptCount;


      let correct =
        true;


      activeBuzz.slots.forEach(
        function (
          expected,
          index
        ) {

          const actual =
            buzzCells[
              index
            ].dataset.symbol
            ||
            null;


          if (
            expected !==
            actual
          ) {

            correct =
              false;

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
          "Not quite — some honeycombs are buzzing in the wrong cells.";

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


  activeBuzz.slots.forEach(
    function (
      expected,
      index
    ) {

      const cell =
        buzzCells[
          index
        ];


      if (
        expected
      ) {

        cell.classList.add(
          "filled"
        );


        cell.innerHTML =
          "<span>"
          +
          expected
          +
          "</span>";

      }

      else {

        cell.classList.remove(
          "filled"
        );


        cell.innerHTML =
          "";

      }

    }
  );


  document
    .getElementById(
      "buzzFormula"
    )
    .textContent =
      activeBuzz.formula;


  document
    .getElementById(
      "buzzName"
    )
    .textContent =
      activeBuzz.name;


  document
    .getElementById(
      "buzzType"
    )
    .textContent =
      activeBuzz.type;


  document
    .getElementById(
      "buzzAnchorInfo"
    )
    .textContent =
      activeBuzz.centerName;


  document
    .getElementById(
      "buzzPieceCount"
    )
    .textContent =
      activeBuzz.pieceCount;


  document
    .getElementById(
      "buzzWhy"
    )
    .textContent =
      activeBuzz.why;


  document
    .getElementById(
      "buzzFact"
    )
    .textContent =
      activeBuzz.fact;


  buzzReveal.classList.add(
    "visible"
  );


  rewardPlayer(
    25
  );


  document
    .getElementById(
      "buzzStreak"
    )
    .textContent =
      player.streak;

}


/* ==========================================================
   BUZZWORD RESET
========================================================== */

document
  .getElementById(
    "buzzReset"
  )
  .addEventListener(
    "click",
    loadBuzzword
  );


/* ==========================================================
   SHARE CARD HEX DRAWING
========================================================== */

function drawShareHex(
  ctx,
  x,
  y,
  radius,
  center
) {

  ctx.beginPath();


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
      i === 0
    ) {

      ctx.moveTo(
        px,
        py
      );

    }

    else {

      ctx.lineTo(
        px,
        py
      );

    }

  }


  ctx.closePath();


  ctx.fillStyle =
    center
      ?
        "#d8a72f"
      :
        "#fff3c7";


  ctx.fill();


  ctx.lineWidth =
    4;


  ctx.strokeStyle =
    "#99711f";


  ctx.stroke();

}


/* ==========================================================
   CREATE BUZZWORD SHARE IMAGE
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
    "bold 70px Georgia";


  ctx.fillText(
    "MOLECULAR BEE",
    540,
    110
  );


  ctx.fillStyle =
    "#99711f";


  ctx.font =
    "bold 38px Georgia";


  ctx.fillText(
    "BUZZWORD #"
    +
    activeBuzz.number,
    540,
    170
  );


  const radius =
    88;


  const surrounding =
    [
      [460, 335],
      [620, 335],
      [380, 475],
      [700, 475],
      [460, 615],
      [620, 615]
    ];


  surrounding.forEach(
    function (
      point
    ) {

      drawShareHex(
        ctx,
        point[0],
        point[1],
        radius,
        false
      );

    }
  );


  drawShareHex(
    ctx,
    540,
    475,
    radius,
    true
  );


  ctx.fillStyle =
    "#29261f";


  ctx.font =
    "76px Arial";


  ctx.fillText(
    "🐝",
    540,
    500
  );


  ctx.font =
    "bold 42px Georgia";


  ctx.fillText(
    buzzAttemptCount ===
    1
      ?
        "Hive completed in 1 attempt"
      :
        "Hive completed in "
        +
        buzzAttemptCount
        +
        " attempts",
    540,
    790
  );


  ctx.fillText(
    "🔥 "
    +
    player.streak
    +
    "-day Buzz Streak",
    540,
    850
  );


  ctx.fillStyle =
    "#765638";


  ctx.font =
    "italic 34px Georgia";


  ctx.fillText(
    "Can you complete today's hive?",
    540,
    925
  );


  ctx.font =
    "bold 30px Georgia";


  ctx.fillText(
    "PAT Learning Lab",
    540,
    980
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
              activeBuzz.number
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
   SHARE BUZZ
========================================================== */

document
  .getElementById(
    "shareBuzzButton"
  )
  .addEventListener(
    "click",
    async function () {

      const text =
        "🐝 MOLECULAR BEE • BUZZWORD #"
        +
        activeBuzz.number
        +
        "\n\nHive completed in "
        +
        buzzAttemptCount
        +
        " attempt"
        +
        (
          buzzAttemptCount ===
          1
            ?
              ""
            :
              "s"
        )
        +
        "\n🔥 "
        +
        player.streak
        +
        "-day Buzz Streak"
        +
        "\n\nCan you complete today's molecular hive?"
        +
        "\n\nPAT Learning Lab";


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
                "Molecular Bee Buzzword #"
                +
                activeBuzz.number,

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
                "Molecular Bee Buzzword #"
                +
                activeBuzz.number,

              text:
                text,

              url:
                window.location.href
            }
          );


          return;

        }


        await navigator.clipboard.writeText(
          text
          +
          "\n\n"
          +
          window.location.href
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
  );


/* ==========================================================
   SPELLING BEE DATABASE
========================================================== */

const spellingChallenges =
  [

    {
      name:
        "water",

      formula:
        "H₂O",

      required:
        [
          "H",
          "H",
          "O"
        ],

      tiles:
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

      formula:
        "CO₂",

      required:
        [
          "C",
          "O",
          "O"
        ],

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

      formula:
        "NH₃",

      required:
        [
          "N",
          "H",
          "H",
          "H"
        ],

      tiles:
        [
          "N",
          "H",
          "H",
          "H",
          "O"
        ]
    },


    {
      name:
        "methane",

      formula:
        "CH₄",

      required:
        [
          "C",
          "H",
          "H",
          "H",
          "H"
        ],

      tiles:
        [
          "C",
          "H",
          "H",
          "H",
          "H",
          "O"
        ]
    }

  ];


let spellingIndex =
  0;


const spellingBuild =
  document.getElementById(
    "spellingBuild"
  );


const spellingTiles =
  document.getElementById(
    "spellingTiles"
  );


const spellingFormula =
  document.getElementById(
    "spellingFormula"
  );


const spellingFeedback =
  document.getElementById(
    "spellingFeedback"
  );


/* ==========================================================
   SPELLING FORMULA HELPER
========================================================== */

function formulaFromSequence(
  sequence
) {

  if (
    sequence.length ===
    0
  ) {

    return "";

  }


  const subscripts =
    {
      2: "₂",
      3: "₃",
      4: "₄",
      5: "₅",
      6: "₆"
    };


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
        count >
        1
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
   SPELLING GRID
========================================================== */

function buildSpellingGrid() {

  spellingBuild.innerHTML =
    "";


  spellingBuild.classList.add(
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


        const symbol =
          slot.dataset.symbol;


        slot.classList.remove(
          "filled"
        );


        slot.dataset.symbol =
          "";


        slot.textContent =
          "";


        addSpellingTile(
          symbol
        );


        updateSpellingFormula();

      }
    );


    spellingBuild.appendChild(
      slot
    );

  }

}


/* ==========================================================
   SPELLING TILES
========================================================== */

function addSpellingTile(
  symbol
) {

  const tile =
    createHex(
      symbol,
      "Atom"
    );


  tile.addEventListener(
    "click",
    function () {

      const slot =
        spellingBuild.querySelector(
          ".honey-slot:not(.filled)"
        );


      if (
        !slot
      ) {

        return;

      }


      slot.classList.add(
        "filled"
      );


      slot.dataset.symbol =
        symbol;


      slot.textContent =
        symbol;


      tile.remove();


      updateSpellingFormula();

    }
  );


  spellingTiles.appendChild(
    tile
  );

}


function getSpellingSequence() {

  return Array.from(
    spellingBuild.querySelectorAll(
      ".honey-slot.filled"
    )
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

  const sequence =
    getSpellingSequence();


  if (
    sequence.length ===
    0
  ) {

    spellingFormula.textContent =
      "Chemical formula will appear here";


    spellingFormula.classList.add(
      "empty"
    );


    return;

  }


  spellingFormula.classList.remove(
    "empty"
  );


  spellingFormula.textContent =
    formulaFromSequence(
      sequence
    );

}


function loadSpellingChallenge() {

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


  spellingFeedback.textContent =
    "";


  spellingTiles.innerHTML =
    "";


  buildSpellingGrid();


  challenge.tiles.forEach(
    function (
      symbol
    ) {

      addSpellingTile(
        symbol
      );

    }
  );


  updateSpellingFormula();

}


/* ==========================================================
   SPELLING BUTTONS
========================================================== */

document
  .getElementById(
    "spellingBackspace"
  )
  .addEventListener(
    "click",
    function () {

      const filled =
        spellingBuild.querySelectorAll(
          ".honey-slot.filled"
        );


      if (
        filled.length ===
        0
      ) {

        return;

      }


      const last =
        filled[
          filled.length -
          1
        ];


      const symbol =
        last.dataset.symbol;


      last.classList.remove(
        "filled"
      );


      last.dataset.symbol =
        "";


      last.textContent =
        "";


      addSpellingTile(
        symbol
      );


      updateSpellingFormula();

    }
  );


document
  .getElementById(
    "spellingReset"
  )
  .addEventListener(
    "click",
    loadSpellingChallenge
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


      const actual =
        getSpellingSequence();


      if (
        actual.join(
          "|"
        )
        ===
        challenge.required.join(
          "|"
        )
      ) {

        spellingFeedback.textContent =
          "🐝 Correct — "
          +
          challenge.formula
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


            loadSpellingChallenge();

          },
          1100
        );

      }

      else {

        spellingFeedback.textContent =
          "Not quite. Check the atom order and ratio.";

      }

    }
  );


/* ==========================================================
   QUEEN BEE DATABASE
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
          "N"
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
          "O"
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
          "O"
        ]
    }

  ];


let queenIndex =
  0;


const queenHive =
  document.getElementById(
    "queenHive"
  );


const queenTiles =
  document.getElementById(
    "queenTiles"
  );


const queenFeedback =
  document.getElementById(
    "queenFeedback"
  );


/* ==========================================================
   QUEEN GRID
========================================================== */

function buildQueenHive() {

  queenHive.innerHTML =
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
    i <= 6;
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
          !slot.classList.contains(
            "filled"
          )
        ) {

          return;

        }


        const symbol =
          slot.dataset.symbol;


        slot.classList.remove(
          "filled"
        );


        slot.dataset.symbol =
          "";


        slot.textContent =
          "?";


        addQueenTile(
          symbol
        );

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


  queenHive.appendChild(
    grid
  );

}


/* ==========================================================
   QUEEN TILES
========================================================== */

function addQueenTile(
  symbol
) {

  const tile =
    createHex(
      symbol,
      "Worker"
    );


  tile.addEventListener(
    "click",
    function () {

      const slot =
        queenHive.querySelector(
          ".queen-slot:not(.center-slot):not(.filled)"
        );


      if (
        !slot
      ) {

        return;

      }


      slot.classList.add(
        "filled"
      );


      slot.dataset.symbol =
        symbol;


      slot.textContent =
        symbol;


      tile.remove();

    }
  );


  queenTiles.appendChild(
    tile
  );

}


function loadQueenChallenge() {

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


  queenFeedback.textContent =
    "";


  queenTiles.innerHTML =
    "";


  buildQueenHive();


  challenge.tiles.forEach(
    function (
      symbol
    ) {

      addQueenTile(
        symbol
      );

    }
  );

}


document
  .getElementById(
    "queenReset"
  )
  .addEventListener(
    "click",
    loadQueenChallenge
  );


document
  .getElementById(
    "queenCheck"
  )
  .addEventListener(
    "click",
    function () {

      const challenge =
        queenChallenges[
          queenIndex
        ];


      const actual =
        Array.from(
          queenHive.querySelectorAll(
            ".queen-slot.filled:not(.center-slot)"
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
        challenge.required
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

        queenFeedback.textContent =
          "👑 Hive complete — "
          +
          challenge.formula
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


            loadQueenChallenge();

          },
          1100
        );

      }

      else {

        queenFeedback.textContent =
          "Not quite. Check the Queen's surrounding atoms.";

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


const workerFeedback =
  document.getElementById(
    "workerFeedback"
  );


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


function loadWorkerChallenge() {

  const challenge =
    workerChallenges[
      workerIndex
    ];


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
      challenge.name
      +
      " atom.";


  workerFeedback.textContent =
    "";


  updateWorkerDisplay();

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


            loadWorkerChallenge();

          },
          1100
        );

      }

      else {

        workerFeedback.textContent =
          "Not quite. Check the nucleus and electron count.";

      }

    }
  );


/* ==========================================================
   POLLINATION DATABASE
========================================================== */

const pollinationChallenges =
  [

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
        "sodium chloride"
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
        "sodium oxide"
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
        "potassium sulfide"
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
        "lithium nitride"
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
        "magnesium chloride"
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
        "calcium fluoride"
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
        "aluminum chloride"
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
        "magnesium oxide"
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
        "calcium oxide"
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
        "aluminum nitride"
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
        "potassium bromide"
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
        "lithium iodide"
    }

  ];


let pollinationIndex =
  0;


let deliveredPollenPieces =
  [];


const pollenBank =
  document.getElementById(
    "pollenBank"
  );


const flowerIon =
  document.getElementById(
    "flowerIon"
  );


const deliveredPollen =
  document.getElementById(
    "deliveredPollen"
  );


const pollinationResult =
  document.getElementById(
    "pollinationResult"
  );


const pollinationFeedback =
  document.getElementById(
    "pollinationFeedback"
  );


/* ==========================================================
   LOAD POLLINATION
========================================================== */

function loadPollinationChallenge() {

  deliveredPollenPieces =
    [];


  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];


  flowerIon.textContent =
    challenge.flower;


  document
    .getElementById(
      "pollinationPrompt"
    )
    .textContent =
      "Pollinate "
      +
      challenge.flower
      +
      " with enough "
      +
      challenge.pollen
      +
      " to grow "
      +
      challenge.name
      +
      ".";


  pollenBank.innerHTML =
    "";


  deliveredPollen.innerHTML =
    "";


  pollinationResult.textContent =
    "";


  pollinationFeedback.textContent =
    "";


  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const pollen =
      document.createElement(
        "button"
      );


    pollen.type =
      "button";


    pollen.className =
      "pollen-piece";


    pollen.textContent =
      challenge.pollen;


    pollen.addEventListener(
      "click",
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


        deliveredPollenPieces.push(
          challenge.pollen
        );


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

      }
    );


    pollenBank.appendChild(
      pollen
    );

  }

}


/* ==========================================================
   POLLINATION BUTTONS
========================================================== */

document
  .getElementById(
    "pollinationReset"
  )
  .addEventListener(
    "click",
    loadPollinationChallenge
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
        deliveredPollenPieces.length ===
        challenge.needed
      ) {

        pollinationResult.textContent =
          "🌼 "
          +
          challenge.formula;


        pollinationFeedback.textContent =
          "✓ Charges balance. "
          +
          challenge.name
          +
          " formed.";


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
          1300
        );

      }

      else if (
        deliveredPollenPieces.length <
        challenge.needed
      ) {

        pollinationFeedback.textContent =
          "Not enough charge yet. Add more pollen.";

      }

      else {

        pollinationFeedback.textContent =
          "Too much charge. Reset and try fewer pollen pieces.";

      }

    }
  );


/* ==========================================================
   START MOLECULAR BEE
========================================================== */

updatePlayerDisplay();


loadBuzzword();


loadSpellingChallenge();


loadQueenChallenge();


loadWorkerChallenge();


loadPollinationChallenge();


});
