document.addEventListener("DOMContentLoaded", function () {

/* ==========================================================
   PLAYER
========================================================== */

let player =
  JSON.parse(
    localStorage.getItem("molecularBeePlayer")
  ) || {
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
  document.getElementById("xpText").textContent =
    player.xp + " XP";

  document.getElementById("streakText").textContent =
    player.streak;
}

function rewardPlayer(amount) {
  player.xp += amount;
  player.streak++;
  savePlayer();
  updatePlayerDisplay();
}

function breakStreak() {
  player.streak = 0;
  savePlayer();
  updatePlayerDisplay();
}

/* ==========================================================
   NAVIGATION
========================================================== */

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach(function (screen) {
      screen.classList.remove("active");
    });

  document
    .getElementById(id)
    .classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document
  .querySelectorAll("[data-screen]")
  .forEach(function (button) {
    button.addEventListener("click", function () {
      showScreen(
        button.getAttribute("data-screen")
      );
    });
  });

/* ==========================================================
   HEX CREATOR
========================================================== */

function createHex(symbol, label) {
  const hex =
    document.createElement("button");

  hex.type =
    "button";

  hex.className =
    "hex";

  hex.dataset.symbol =
    symbol;

  const strong =
    document.createElement("strong");

  strong.textContent =
    symbol;

  const small =
    document.createElement("small");

  small.textContent =
    label || "Atom";

  hex.appendChild(strong);
  hex.appendChild(small);

  return hex;
}

/* ==========================================================
   POINTER DRAG ENGINE
========================================================== */

let activeDrag = null;

function makePointerDraggable(
  element,
  payload,
  validTargets,
  onDrop
) {

  element.addEventListener(
    "pointerdown",
    function (event) {

      if (
        element.classList.contains("used")
      ) {
        return;
      }

      event.preventDefault();

      element.setPointerCapture(
        event.pointerId
      );

      const rect =
        element.getBoundingClientRect();

      activeDrag = {
        element: element,
        payload: payload,
        pointerId: event.pointerId,
        offsetX:
          event.clientX - rect.left,
        offsetY:
          event.clientY - rect.top
      };

      element.classList.add(
        "dragging"
      );

      moveDraggedElement(
        event.clientX,
        event.clientY
      );

    }
  );

  element.addEventListener(
    "pointermove",
    function (event) {

      if (
        !activeDrag ||
        activeDrag.element !== element
      ) {
        return;
      }

      moveDraggedElement(
        event.clientX,
        event.clientY
      );

      highlightTarget(
        event.clientX,
        event.clientY,
        validTargets
      );

    }
  );

  element.addEventListener(
    "pointerup",
    function (event) {

      if (
        !activeDrag ||
        activeDrag.element !== element
      ) {
        return;
      }

      const target =
        findDropTarget(
          event.clientX,
          event.clientY,
          validTargets
        );

      cleanupTargetHighlights();

      element.classList.remove(
        "dragging"
      );

      element.style.left =
        "";

      element.style.top =
        "";

      if (target) {
        onDrop(
          payload,
          target,
          element
        );
      }

      activeDrag =
        null;

    }
  );
}

function moveDraggedElement(
  x,
  y
) {

  if (!activeDrag) {
    return;
  }

  activeDrag.element.style.left =
    (
      x -
      activeDrag.offsetX
    ) + "px";

  activeDrag.element.style.top =
    (
      y -
      activeDrag.offsetY
    ) + "px";
}

function findDropTarget(
  x,
  y,
  selector
) {

  const elements =
    document.querySelectorAll(
      selector
    );

  for (
    let i = 0;
    i < elements.length;
    i++
  ) {

    const rect =
      elements[i].getBoundingClientRect();

    if (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    ) {
      return elements[i];
    }
  }

  return null;
}

function highlightTarget(
  x,
  y,
  selector
) {

  cleanupTargetHighlights();

  const target =
    findDropTarget(
      x,
      y,
      selector
    );

  if (target) {
    target.classList.add(
      "drop-active"
    );
  }
}

function cleanupTargetHighlights() {
  document
    .querySelectorAll(
      ".drop-active"
    )
    .forEach(function (element) {
      element.classList.remove(
        "drop-active"
      );
    });
}

/* ==========================================================
   SPELLING-BEE
========================================================== */

const spellingChallenges = [
  {
    name: "water",
    formula: "H₂O",
    required: ["H", "H", "O"],
    tiles: ["H", "H", "O", "C", "N"]
  },

  {
    name: "carbon dioxide",
    formula: "CO₂",
    required: ["C", "O", "O"],
    tiles: ["C", "O", "O", "H", "N"]
  },

  {
    name: "ammonia",
    formula: "NH₃",
    required: ["N", "H", "H", "H"],
    tiles: ["N", "H", "H", "H", "O"]
  }
];

let spellingIndex =
  0;

let spellingBuild =
  [];

const spellingPrompt =
  document.getElementById(
    "spellingPrompt"
  );

const spellingTiles =
  document.getElementById(
    "spellingTiles"
  );

const spellingBuildZone =
  document.getElementById(
    "spellingBuild"
  );

const spellingFeedback =
  document.getElementById(
    "spellingFeedback"
  );

function buildSpellingGrid() {

  spellingBuildZone.innerHTML =
    "";

  spellingBuildZone.classList.add(
    "honey-grid"
  );

  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const slot =
      document.createElement("div");

    slot.className =
      "honey-slot";

    slot.dataset.slot =
      i;

    spellingBuildZone.appendChild(
      slot
    );
  }
}

function renderSpellingTiles() {

  spellingTiles.innerHTML =
    "";

  const challenge =
    spellingChallenges[
      spellingIndex
    ];

  challenge.tiles.forEach(
    function (symbol) {

      const hex =
        createHex(
          symbol,
          "Atom"
        );

      makePointerDraggable(
        hex,
        symbol,
        "#spellingBuild .honey-slot",
        function (
          payload,
          target,
          source
        ) {

          placeSpellingAtom(
            payload,
            target
          );

          source.remove();
        }
      );

      hex.addEventListener(
        "click",
        function () {

          const empty =
            spellingBuildZone
              .querySelector(
                ".honey-slot:not(.filled)"
              );

          if (!empty) {
            return;
          }

          placeSpellingAtom(
            symbol,
            empty
          );

          hex.remove();
        }
      );

      spellingTiles.appendChild(
        hex
      );

    }
  );
}

function placeSpellingAtom(
  symbol,
  slot
) {

  if (
    slot.classList.contains(
      "filled"
    )
  ) {
    return;
  }

  const hex =
    createHex(
      symbol,
      "Placed"
    );

  hex.style.cursor =
    "default";

  slot.classList.add(
    "filled"
  );

  slot.dataset.symbol =
    symbol;

  slot.appendChild(
    hex
  );

  spellingBuild.push(
    symbol
  );
}

function loadSpellingChallenge() {

  spellingBuild =
    [];

  const challenge =
    spellingChallenges[
      spellingIndex
    ];

  spellingPrompt.textContent =
    "Spell " +
    challenge.name +
    " using the honeycomb grid.";

  spellingFeedback.textContent =
    "";

  buildSpellingGrid();
  renderSpellingTiles();
}

document
  .getElementById(
    "spellingBackspace"
  )
  .addEventListener(
    "click",
    function () {

      const filled =
        spellingBuildZone
          .querySelectorAll(
            ".honey-slot.filled"
          );

      if (
        filled.length === 0
      ) {
        return;
      }

      const last =
        filled[
          filled.length - 1
        ];

      last.innerHTML =
        "";

      last.classList.remove(
        "filled"
      );

      delete last.dataset.symbol;

      spellingBuild.pop();
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
        Array.from(
          spellingBuildZone
            .querySelectorAll(
              ".honey-slot.filled"
            )
        )
        .map(
          function (slot) {
            return slot.dataset.symbol;
          }
        );

      if (
        actual.join("") ===
        challenge.required.join("")
      ) {

        spellingFeedback.textContent =
          "✓ Correct! " +
          challenge.formula +
          " is complete.";

        rewardPlayer(10);

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
          "Not quite. Check the atom pattern.";

        breakStreak();

      }

    }
  );

/* ==========================================================
   QUEEN-BEE
========================================================== */

const queenChallenges = [
  {
    central: "O",
    name: "water",
    molecule: "H₂O",
    required: ["H", "H"],
    tiles: ["H", "H", "C", "Na"]
  },

  {
    central: "C",
    name: "carbon dioxide",
    molecule: "CO₂",
    required: ["O", "O"],
    tiles: ["O", "O", "H", "N"]
  },

  {
    central: "N",
    name: "ammonia",
    molecule: "NH₃",
    required: ["H", "H", "H"],
    tiles: ["H", "H", "H", "O"]
  }
];

let queenIndex =
  0;

const queenPrompt =
  document.getElementById(
    "queenPrompt"
  );

const queenHive =
  document.getElementById(
    "queenHive"
  );

const queenTiles =
  document.getElementById(
    "queenTiles"
  );

const queenElement =
  document.getElementById(
    "queenElement"
  );

const queenFeedback =
  document.getElementById(
    "queenFeedback"
  );

function buildQueenGrid() {

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
      "queen-slot slot-" +
      i;

    grid.appendChild(
      slot
    );
  }

  const centerSlot =
    document.createElement(
      "div"
    );

  centerSlot.className =
    "queen-slot center-slot filled";

  const queenHex =
    createHex(
      queenChallenges[
        queenIndex
      ].central,
      "Queen"
    );

  queenHex.classList.add(
    "queen-hex"
  );

  const crown =
    document.createElement(
      "span"
    );

  crown.className =
    "queen-crown";

  crown.textContent =
    "👑";

  queenHex.prepend(
    crown
  );

  centerSlot.appendChild(
    queenHex
  );

  grid.appendChild(
    centerSlot
  );

  queenHive.appendChild(
    grid
  );
}

function renderQueenTiles() {

  queenTiles.innerHTML =
    "";

  const challenge =
    queenChallenges[
      queenIndex
    ];

  challenge.tiles.forEach(
    function (symbol) {

      const hex =
        createHex(
          symbol,
          "Worker"
        );

      makePointerDraggable(
        hex,
        symbol,
        "#queenHive .queen-slot:not(.center-slot)",
        function (
          payload,
          target,
          source
        ) {

          placeQueenAtom(
            payload,
            target
          );

          source.remove();
        }
      );

      hex.addEventListener(
        "click",
        function () {

          const empty =
            queenHive.querySelector(
              ".queen-slot:not(.center-slot):not(.filled)"
            );

          if (!empty) {
            return;
          }

          placeQueenAtom(
            symbol,
            empty
          );

          hex.remove();
        }
      );

      queenTiles.appendChild(
        hex
      );

    }
  );
}

function placeQueenAtom(
  symbol,
  slot
) {

  if (
    slot.classList.contains(
      "filled"
    )
  ) {
    return;
  }

  const hex =
    createHex(
      symbol,
      "Bonded"
    );

  hex.style.cursor =
    "default";

  slot.classList.add(
    "filled"
  );

  slot.dataset.symbol =
    symbol;

  slot.appendChild(
    hex
  );
}

function loadQueenChallenge() {

  const challenge =
    queenChallenges[
      queenIndex
    ];

  queenPrompt.textContent =
    "Build " +
    challenge.name +
    " (" +
    challenge.molecule +
    ") around the Queen.";

  queenElement.textContent =
    challenge.central;

  queenFeedback.textContent =
    "";

  buildQueenGrid();
  renderQueenTiles();
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
          function (slot) {
            return slot.dataset.symbol;
          }
        )
        .sort();

      const required =
        challenge.required
          .slice()
          .sort();

      if (
        actual.join("") ===
        required.join("")
      ) {

        queenFeedback.textContent =
          "✓ Hive complete! " +
          challenge.molecule +
          " formed.";

        rewardPlayer(15);

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
          1200
        );

      }

      else {

        queenFeedback.textContent =
          "Not quite. Check the Queen's surrounding atoms.";

        breakStreak();

      }

    }
  );

/* ==========================================================
   WORKER-BEE
========================================================== */

const workerChallenges = [
  {
    name: "Helium",
    protons: 2,
    neutrons: 2,
    electrons: 2
  },
  {
    name: "Lithium",
    protons: 3,
    neutrons: 4,
    electrons: 3
  },
  {
    name: "Beryllium",
    protons: 4,
    neutrons: 5,
    electrons: 4
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

const workerPrompt =
  document.getElementById(
    "workerPrompt"
  );

const workerFeedback =
  document.getElementById(
    "workerFeedback"
  );

function updateWorkerDisplay() {
  document.getElementById(
    "protonCount"
  ).textContent =
    workerProtons;

  document.getElementById(
    "neutronCount"
  ).textContent =
    workerNeutrons;

  document.getElementById(
    "innerElectronCount"
  ).textContent =
    Math.min(
      workerElectrons,
      2
    );

  document.getElementById(
    "outerElectronCount"
  ).textContent =
    Math.max(
      workerElectrons - 2,
      0
    );
}

function loadWorkerChallenge() {

  workerProtons =
    0;

  workerNeutrons =
    0;

  workerElectrons =
    0;

  const challenge =
    workerChallenges[
      workerIndex
    ];

  workerPrompt.textContent =
    "Build a neutral " +
    challenge.name +
    " atom.";

  workerFeedback.textContent =
    "";

  updateWorkerDisplay();
}

document.getElementById(
  "addProton"
).addEventListener(
  "click",
  function () {
    workerProtons++;
    updateWorkerDisplay();
  }
);

document.getElementById(
  "addNeutron"
).addEventListener(
  "click",
  function () {
    workerNeutrons++;
    updateWorkerDisplay();
  }
);

document.getElementById(
  "addElectron"
).addEventListener(
  "click",
  function () {
    workerElectrons++;
    updateWorkerDisplay();
  }
);

document.getElementById(
  "workerReset"
).addEventListener(
  "click",
  loadWorkerChallenge
);

document.getElementById(
  "workerCheck"
).addEventListener(
  "click",
  function () {

    const challenge =
      workerChallenges[
        workerIndex
      ];

    if (
      workerProtons ===
      challenge.protons &&
      workerNeutrons ===
      challenge.neutrons &&
      workerElectrons ===
      challenge.electrons
    ) {

      workerFeedback.textContent =
        "✓ Atom built correctly.";

      rewardPlayer(15);

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

      breakStreak();

    }

  }
);

/* ==========================================================
   POLLINATION
========================================================== */

const pollinationChallenges = [
  {
    flower: "Cl⁻",
    pollen: "Na⁺",
    neededPollen: 1,
    formula: "NaCl",
    available: 4
  },

  {
    flower: "O²⁻",
    pollen: "Na⁺",
    neededPollen: 2,
    formula: "Na₂O",
    available: 4
  },

  {
    flower: "Cl⁻",
    pollen: "Ca²⁺",
    neededPollen: 1,
    formula: "CaCl₂",
    available: 3
  }
];

let pollinationIndex =
  0;

let delivered =
  [];

const pollenBank =
  document.getElementById(
    "pollenBank"
  );

const flowerTarget =
  document.getElementById(
    "flowerTarget"
  );

const flowerIon =
  document.getElementById(
    "flowerIon"
  );

const deliveredPollen =
  document.getElementById(
    "deliveredPollen"
  );

const pollinationPrompt =
  document.getElementById(
    "pollinationPrompt"
  );

const pollinationFeedback =
  document.getElementById(
    "pollinationFeedback"
  );

const pollinationResult =
  document.getElementById(
    "pollinationResult"
  );

function renderPollenBank() {

  pollenBank.innerHTML =
    "";

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];

  for (
    let i = 0;
    i < challenge.available;
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

    makePointerDraggable(
      pollen,
      challenge.pollen,
      "#flowerTarget",
      function (
        payload,
        target,
        source
      ) {

        deliverPollen(
          payload
        );

        source.classList.add(
          "used"
        );
      }
    );

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

        deliverPollen(
          challenge.pollen
        );

        pollen.classList.add(
          "used"
        );

      }
    );

    pollenBank.appendChild(
      pollen
    );
  }
}

function deliverPollen(symbol) {

  delivered.push(
    symbol
  );

  renderDelivered();
}

function renderDelivered() {

  deliveredPollen.innerHTML =
    "";

  delivered.forEach(
    function (symbol) {

      const token =
        document.createElement(
          "span"
        );

      token.className =
        "delivered-token";

      token.textContent =
        symbol;

      deliveredPollen.appendChild(
        token
      );

    }
  );
}

function loadPollinationChallenge() {

  delivered =
    [];

  const challenge =
    pollinationChallenges[
      pollinationIndex
    ];

  flowerIon.textContent =
    challenge.flower;

  pollinationPrompt.textContent =
    "Carry enough " +
    challenge.pollen +
    " pollen to the " +
    challenge.flower +
    " flower.";

  pollinationFeedback.textContent =
    "";

  pollinationResult.textContent =
    "";

  renderDelivered();
  renderPollenBank();
}

document.getElementById(
  "pollinationReset"
).addEventListener(
  "click",
  loadPollinationChallenge
);

document.getElementById(
  "pollinationCheck"
).addEventListener(
  "click",
  function () {

    const challenge =
      pollinationChallenges[
        pollinationIndex
      ];

    if (
      delivered.length ===
      challenge.neededPollen
    ) {

      pollinationResult.textContent =
        "🌸 " +
        challenge.formula;

      pollinationFeedback.textContent =
        "✓ Charges balance. Compound formed.";

      rewardPlayer(15);

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

    else {

      pollinationFeedback.textContent =
        "Charge mismatch. Adjust the pollen count.";

      breakStreak();

    }

  }
);

/* ==========================================================
   START
========================================================== */

updatePlayerDisplay();
loadSpellingChallenge();
loadQueenChallenge();
loadWorkerChallenge();
loadPollinationChallenge();

});
