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


  document
    .getElementById(
      id
    )
    .classList
    .add(
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
    function (
      button
    ) {

      button.addEventListener(
        "click",
        function () {

          showScreen(
            button.getAttribute(
              "data-screen"
            )
          );

        }
      );

    }
  );


/* ==========================================================
   HELPERS
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


  const small =
    document.createElement(
      "small"
    );


  small.textContent =
    label ||
    "Atom";


  const strong =
    document.createElement(
      "strong"
    );


  strong.textContent =
    symbol;


  hex.appendChild(
    small
  );


  hex.appendChild(
    strong
  );


  return hex;

}


/* ==========================================================
   BUZZWORD DATABASE
========================================================== */

const buzzwords = [

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
      "Complete the carbon dioxide molecular hive.",

    hint:
      "The revealed carbon center needs two oxygen honeycombs.",

    why:
      "Carbon dioxide contains one carbon atom and two oxygen atoms.",

    fact:
      "Plants use carbon dioxide during photosynthesis.",

    pieceCount:
      3
  },


  {
    number:
      "002",

    name:
      "Water",

    formula:
      "H₂O",

    center:
      "O",

    centerName:
      "Oxygen",

    type:
      "Covalent Molecule",

    slots:
      [
        null,
        null,
        "H",
        "H",
        null,
        null
      ],

    tiles:
      [
        "H",
        "H",
        "C",
        "N",
        "Na",
        "Cl"
      ],

    prompt:
      "Complete the water molecular hive.",

    hint:
      "Two hydrogen honeycombs belong around oxygen.",

    why:
      "Water contains two hydrogen atoms for every one oxygen atom.",

    fact:
      "Water's bent geometry contributes to its polarity.",

    pieceCount:
      3
  },


  {
    number:
      "003",

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
      "Complete the ammonia molecular hive.",

    hint:
      "Three hydrogen honeycombs belong around nitrogen.",

    why:
      "Ammonia contains one nitrogen atom and three hydrogen atoms.",

    fact:
      "Ammonia is important in fertilizer production.",

    pieceCount:
      4
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
        "Na⁺",
        "SO₄²⁻"
      ],

    prompt:
      "Complete the calcium nitrate ionic hive.",

    hint:
      "The +2 center requires two −1 nitrate ions.",

    why:
      "Two nitrate ions contribute −2 total charge, balancing Ca²⁺.",

    fact:
      "Calcium nitrate is commonly used in fertilizers.",

    pieceCount:
      3
  }

];


/* ==========================================================
   DAILY BUZZWORD
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


const buzzwordNumber =
  document.getElementById(
    "buzzwordNumber"
  );


const buzzwordPrompt =
  document.getElementById(
    "buzzwordPrompt"
  );


const buzzHint =
  document.getElementById(
    "buzzHint"
  );


const buzzTiles =
  document.getElementById(
    "buzzTiles"
  );


const buzzCells =
  Array.from(
    document.querySelectorAll(
      "[data-buzz-slot]"
    )
  );


const buzzFeedback =
  document.getElementById(
    "buzzFeedback"
  );


const buzzAttempts =
  document.getElementById(
    "buzzAttempts"
  );


const buzzStreak =
  document.getElementById(
    "buzzStreak"
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


  buzzwordNumber.textContent =
    "Molecule of the Day • #"
    +
    activeBuzz.number;


  buzzwordPrompt.textContent =
    activeBuzz.prompt;


  buzzHint.textContent =
    activeBuzz.hint;


  buzzAttempts.textContent =
    "0";


  buzzStreak.textContent =
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


  renderBuzzPieces();

}


/* ==========================================================
   BUZZWORD PIECES
========================================================== */

function renderBuzzPieces() {

  buzzTiles.innerHTML =
    "";


  activeBuzz.tiles.forEach(
    function (
      symbol,
      index
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "buzz-piece";


      button.textContent =
        symbol;


      button.dataset.symbol =
        symbol;


      button.dataset.piece =
        index;


      button.addEventListener(
        "click",
        function () {

          if (
            button.classList.contains(
              "used"
            )
          ) {

            return;

          }


          document
            .querySelectorAll(
              ".buzz-piece"
            )
            .forEach(
              function (
                piece
              ) {

                piece.classList.remove(
                  "selected"
                );

              }
            );


          button.classList.add(
            "selected"
          );


          selectedBuzzPiece =
            symbol;


          selectedBuzzButton =
            button;

        }
      );


      buzzTiles.appendChild(
        button
      );

    }
  );

}


/* ==========================================================
   BUZZ CELL INTERACTION
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


        if (
          cell.classList.contains(
            "filled"
          )
        ) {

          const originalPieceIndex =
            cell.dataset.pieceIndex;


          if (
            originalPieceIndex !==
            undefined
          ) {

            const original =
              buzzTiles.querySelector(
                '[data-piece="'
                +
                originalPieceIndex
                +
                '"]'
              );


            if (
              original
            ) {

              original.classList.remove(
                "used"
              );

            }

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


      buzzAttempts.textContent =
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
            actual !==
            expected
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
          "Not quite — some molecular honeycombs are in the wrong part of the hive.";

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


  buzzStreak.textContent =
    player.streak;

}


/* ==========================================================
   RESET BUZZWORD
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
   SHARE IMAGE
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
   BUILD SHARE CARD
========================================================== */

async function buildBuzzShareImage() {

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


  ctx.font =
    "76px Arial";


  ctx.fillStyle =
    "#29261f";


  ctx.fillText(
    "🐝",
    540,
    500
  );


  ctx.fillStyle =
    "#29261f";


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
        await buildBuzzShareImage();


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
   SPELLING BEE
========================================================== */

const spellingChallenges = [

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


let formulaPreview =
  null;


const spellingBuild =
  document.getElementById(
    "spellingBuild"
  );


const spellingTiles =
  document.getElementById(
    "spellingTiles"
  );


const spellingFeedback =
  document.getElementById(
    "spellingFeedback"
  );


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
        "div"
      );


    slot.className =
      "honey-slot";


    slot.dataset.slot =
      i;


    spellingBuild.appendChild(
      slot
    );

  }


  if (
    formulaPreview
  ) {

    formulaPreview.remove();

  }


  formulaPreview =
    document.createElement(
      "div"
    );


  formulaPreview.className =
    "formula-preview empty";


  formulaPreview.textContent =
    "Chemical formula will appear here";


  spellingBuild
    .parentNode
    .insertBefore(
      formulaPreview,
      spellingBuild.nextSibling
    );

}


function getSpellingBuild() {

  return Array.from(
    spellingBuild
      .querySelectorAll(
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


  let result =
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

      result +=
        current;


      if (
        count >
        1
      ) {

        result +=
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


  return result;

}


function updateSpellingFormula() {

  const sequence =
    getSpellingBuild();


  if (
    sequence.length ===
    0
  ) {

    formulaPreview.textContent =
      "Chemical formula will appear here";


    formulaPreview.classList.add(
      "empty"
    );


    return;

  }


  formulaPreview.classList.remove(
    "empty"
  );


  formulaPreview.textContent =
    formulaFromSequence(
      sequence
    );

}


function placeSpellingAtom(
  symbol
) {

  const slot =
    spellingBuild.querySelector(
      ".honey-slot:not(.filled)"
    );


  if (
    !slot
  ) {

    return false;

  }


  slot.classList.add(
    "filled"
  );


  slot.dataset.symbol =
    symbol;


  slot.appendChild(
    createHex(
      symbol,
      "Atom"
    )
  );


  updateSpellingFormula();


  return true;

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


  buildSpellingGrid();


  spellingTiles.innerHTML =
    "";


  challenge.tiles.forEach(
    function (
      symbol
    ) {

      const hex =
        createHex(
          symbol,
          "Atom"
        );


      hex.addEventListener(
        "click",
        function () {

          if (
            placeSpellingAtom(
              symbol
            )
          ) {

            hex.remove();

          }

        }
      );


      spellingTiles.appendChild(
        hex
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

      const slots =
        spellingBuild.querySelectorAll(
          ".honey-slot.filled"
        );


      if (
        slots.length ===
        0
      ) {

        return;

      }


      const last =
        slots[
          slots.length -
          1
        ];


      last.innerHTML =
        "";


      last.classList.remove(
        "filled"
      );


      delete last.dataset.symbol;


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


      if (
        getSpellingBuild()
          .join(
            ""
          )
        ===
        challenge.required
          .join(
            ""
          )
      ) {

        spellingFeedback.textContent =
          "✓ Correct! "
          +
          challenge.formula
          +
          " completed.";


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
          "Not quite. Check the molecular formula.";

      }

    }
  );


/* ==========================================================
   QUEEN BEE
========================================================== */

const queenChallenges = [

  {
    central:
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
    central:
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
    central:
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


function buildQueenHive() {

  queenHive.innerHTML =
    "";


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
        "div"
      );


    slot.className =
      "queen-slot slot-"
      +
      i;


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


  const queen =
    createHex(
      queenChallenges[
        queenIndex
      ].central,
      "👑 Queen"
    );


  center.appendChild(
    queen
  );


  grid.appendChild(
    center
  );


  queenHive.appendChild(
    grid
  );

}


function placeQueenAtom(
  symbol
) {

  const slot =
    queenHive.querySelector(
      ".queen-slot:not(.center-slot):not(.filled)"
    );


  if (
    !slot
  ) {

    return false;

  }


  slot.classList.add(
    "filled"
  );


  slot.dataset.symbol =
    symbol;


  slot.appendChild(
    createHex(
      symbol,
      "Worker"
    )
  );


  return true;

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
      " around the Queen.";


  queenFeedback.textContent =
    "";


  buildQueenHive();


  queenTiles.innerHTML =
    "";


  challenge.tiles.forEach(
    function (
      symbol
    ) {

     
