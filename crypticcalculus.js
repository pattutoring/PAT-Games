document.addEventListener(
  "DOMContentLoaded",
  function () {


/* ==========================================================
   CRYPTIC-CALCULUS OPERATION DATABASE

   Later, mascot image paths can be added to each object.
========================================================== */

const operations = [

  {

    id:
      "approximation",

    title:
      "Approximation / Homophone",

    symbol:
      "≈",

    category:
      "SOUND OPERATION",

    mascot:
      "🔈 ≈",

    subtitle:
      "Different spelling. Similar sound.",

    formula:
      "sound(A) ≈ sound(B)",

    description:
      "Treat one spoken form as approximately equivalent to another. The written forms differ, but the clue permits a collapse through sound.",

    exampleInput:
      "SOX",

    exampleOperation:
      "Homophone / Approximation",

    exampleMiddle:
      "SOX ≈ SOCKS",

    exampleResult:
      "SOCKS",

    note:
      "Approximation does not claim literal equality. It represents a sound-near equivalence useful for homophone wordplay."

  },


  {

    id:
      "superposition",

    title:
      "Superposition",

    symbol:
      "⊕",

    category:
      "MEANING OPERATION",

    mascot:
      "🔴 ↔ 🔵",

    subtitle:
      "Two meanings. One answer.",

    formula:
      "meaning₁(x) ⊕ meaning₂(x) → answer",

    description:
      "Hold two valid meanings in play at the same time until one answer satisfies both. This is the Cryptic-Calculus model for a double definition.",

    exampleInput:
      "Pulling a rabbit out three times is the goal.",

    exampleOperation:
      "Magic meaning ⊕ Sport meaning",

    exampleMiddle:
      "hat trick ⊕ hat trick",

    exampleResult:
      "HAT-TRICK",

    note:
      "The answer behaves like the shared state where both meanings are simultaneously valid."

  },


  {

    id:
      "container",

    title:
      "Container",

    symbol:
      "⊂",

    category:
      "STRUCTURE OPERATION",

    mascot:
      "📦",

    subtitle:
      "Put one unit inside another.",

    formula:
      "Container(outer, inner) = outer(inner)",

    description:
      "One letter or word is placed inside another. Indicators can include around, holding, containing, swallowing, embracing or housing.",

    exampleInput:
      "A holds B",

    exampleOperation:
      "Container(A, B)",

    exampleMiddle:
      "A(B)",

    exampleResult:
      "B inserted inside A",

    note:
      "Container indicators encode spatial structure. The clue tells you which material becomes the outside and which becomes the inside."

  },


  {

    id:
      "composition",

    title:
      "Composition",

    symbol:
      "∘",

    category:
      "FUNCTION OPERATION",

    mascot:
      "f ∘ g",

    subtitle:
      "Apply one transformation after another.",

    formula:
      "(f ∘ g)(x) = f(g(x))",

    description:
      "Many cryptic clues require chained operations. First transform the clue material with one function, then feed the result into another.",

    exampleInput:
      "WORD",

    exampleOperation:
      "Reverse ∘ Delete",

    exampleMiddle:
      "Delete(WORD) → Reverse(result)",

    exampleResult:
      "A two-step transformation",

    note:
      "Composition lets the clue be modeled as a sequence rather than a single operation."

  },


  {

    id:
      "deletion",

    title:
      "Deletion",

    symbol:
      "−",

    category:
      "LETTER OPERATION",

    mascot:
      "✂️",

    subtitle:
      "Remove specified material.",

    formula:
      "A − B",

    description:
      "Subtract a letter, sound, prefix, suffix or other specified unit from the source material.",

    exampleInput:
      "SPEED − E",

    exampleOperation:
      "Deletion",

    exampleMiddle:
      "SPD",

    exampleResult:
      "Remaining material",

    note:
      "Indicators can include losing, without, headless, tailless, dropping, minus or removing."

  },


  {

    id:
      "reversal",

    title:
      "Reversal",

    symbol:
      "↔",

    category:
      "ORDER OPERATION",

    mascot:
      "↩️",

    subtitle:
      "Reverse the sequence.",

    formula:
      "R(A₁A₂...Aₙ) = Aₙ...A₂A₁",

    description:
      "Reverse the order of letters or another lexical sequence. Directional indicators determine when the operation applies.",

    exampleInput:
      "NO",

    exampleOperation:
      "Reverse",

    exampleMiddle:
      "NO → ON",

    exampleResult:
      "ON",

    note:
      "Common indicators include back, reversed, returned, rising or reflected depending on clue orientation."

  },


  {

    id:
      "anagram",

    title:
      "Anagram",

    symbol:
      "⟳",

    category:
      "PERMUTATION OPERATION",

    mascot:
      "🔀",

    subtitle:
      "Rearrange the components.",

    formula:
      "Permute(A) → A′",

    description:
      "Reorder the letters of the supplied material while preserving the same component set.",

    exampleInput:
      "LISTEN",

    exampleOperation:
      "Anagram",

    exampleMiddle:
      "Permute(LISTEN)",

    exampleResult:
      "SILENT",

    note:
      "Anagram indicators often suggest disorder, movement, corruption, mixing or change."

  },


  {

    id:
      "rebus",

    title:
      "Rebus Bus",

    symbol:
      "🚌",

    category:
      "VISUAL OPERATION",

    mascot:
      "🚌 ABC",

    subtitle:
      "Read arrangement as meaning.",

    formula:
      "layout(x) → lexical interpretation",

    description:
      "Treat spatial arrangement itself as clue information. Position, enclosure, repetition or direction becomes part of the operation.",

    exampleInput:
      "MAN\nBOARD",

    exampleOperation:
      "Read vertical arrangement",

    exampleMiddle:
      "MAN over BOARD",

    exampleResult:
      "MAN OVERBOARD",

    note:
      "The Rebus Bus carries visual structure into language. The placement is part of the clue, not decoration."

  },


  {

    id:
      "redfish",

    title:
      "Red-Fish Blue-Shift",

    symbol:
      "⇠🐟⇢",

    category:
      "SEMANTIC SHIFT",

    mascot:
      "🔴🐟🔵",

    subtitle:
      "Shift interpretation toward or away.",

    formula:
      "Shift(m, ±Δcontext)",

    description:
      "Move interpretation through semantic space. A blue-shift compresses toward a target meaning; a red-shift expands or moves away into a broader interpretation.",

    exampleInput:
      "SOX / SOCKS",

    exampleOperation:
      "Blue-shift toward sound identity",

    exampleMiddle:
      "Spelling difference decreases",

    exampleResult:
      "Homophone relation",

    note:
      "This is a Cryptic-Calculus visualization rather than a conventional cryptic-crossword operator. It models how context can pull two interpretations closer or farther apart."

  }

];



/* ==========================================================
   ELEMENTS
========================================================== */

const operationBank =
  document.getElementById(
    "operationBank"
  );


const operationCategory =
  document.getElementById(
    "operationCategory"
  );


const operationTitle =
  document.getElementById(
    "operationTitle"
  );


const operationSymbol =
  document.getElementById(
    "operationSymbol"
  );


const mascotPlaceholder =
  document.getElementById(
    "mascotPlaceholder"
  );


const operationFormula =
  document.getElementById(
    "operationFormula"
  );


const operationDescription =
  document.getElementById(
    "operationDescription"
  );


const exampleInput =
  document.getElementById(
    "exampleInput"
  );


const exampleOperation =
  document.getElementById(
    "exampleOperation"
  );


const exampleMiddle =
  document.getElementById(
    "exampleMiddle"
  );


const exampleResult =
  document.getElementById(
    "exampleResult"
  );


const operationNote =
  document.getElementById(
    "operationNote"
  );


const firstOperation =
  document.getElementById(
    "firstOperation"
  );


const secondOperation =
  document.getElementById(
    "secondOperation"
  );


const compositionFormula =
  document.getElementById(
    "compositionFormula"
  );


const compositionExplanation =
  document.getElementById(
    "compositionExplanation"
  );


const referenceGrid =
  document.getElementById(
    "referenceGrid"
  );



/* ==========================================================
   BUILD OPERATION BANK
========================================================== */

function buildOperationBank() {

  operationBank.innerHTML =
    "";


  operations.forEach(
    function (
      operation,
      index
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "operation-card";


      button.dataset.operationId =
        operation.id;


      button.innerHTML =
        '<div class="operation-card-symbol">'
        +
        operation.symbol
        +
        '</div>'
        +
        '<div>'
        +
        '<span class="operation-card-title">'
        +
        operation.title
        +
        '</span>'
        +
        '<span class="operation-card-subtitle">'
        +
        operation.subtitle
        +
        '</span>'
        +
        '</div>';


      button.addEventListener(
        "click",
        function () {

          showOperation(
            operation.id
          );

        }
      );


      operationBank.appendChild(
        button
      );


      if (
        index === 0
      ) {

        button.classList.add(
          "active"
        );

      }

    }
  );

}



/* ==========================================================
   SHOW OPERATION
========================================================== */

function showOperation(
  id
) {

  const operation =
    operations.find(
      function (
        item
      ) {

        return (
          item.id ===
          id
        );

      }
    );


  if (
    !operation
  ) {

    return;

  }


  document
    .querySelectorAll(
      ".operation-card"
    )
    .forEach(
      function (
        card
      ) {

        card.classList.remove(
          "active"
        );

      }
    );


  const activeCard =
    document.querySelector(
      '[data-operation-id="'
      +
      id
      +
      '"]'
    );


  if (
    activeCard
  ) {

    activeCard.classList.add(
      "active"
    );

  }


  operationCategory.textContent =
    operation.category;


  operationTitle.textContent =
    operation.title;


  operationSymbol.textContent =
    operation.symbol;


  mascotPlaceholder.innerHTML =
    '<div>'
    +
    operation.mascot
    +
    '</div>'
    +
    '<small>'
    +
    'Mascot artwork can replace this later.'
    +
    '</small>';


  operationFormula.textContent =
    operation.formula;


  operationDescription.textContent =
    operation.description;


  exampleInput.textContent =
    operation.exampleInput;


  exampleOperation.textContent =
    operation.exampleOperation;


  exampleMiddle.textContent =
    operation.exampleMiddle;


  exampleResult.textContent =
    operation.exampleResult;


  operationNote.textContent =
    operation.note;

}



/* ==========================================================
   COMPOSITION SELECTS
========================================================== */

function buildCompositionSelectors() {

  firstOperation.innerHTML =
    "";


  secondOperation.innerHTML =
    "";


  operations.forEach(
    function (
      operation
    ) {

      const optionOne =
        document.createElement(
          "option"
        );


      optionOne.value =
        operation.id;


      optionOne.textContent =
        operation.symbol
        +
        " "
        +
        operation.title;


      firstOperation.appendChild(
        optionOne
      );


      const optionTwo =
        document.createElement(
          "option"
        );


      optionTwo.value =
        operation.id;


      optionTwo.textContent =
        operation.symbol
        +
        " "
        +
        operation.title;


      secondOperation.appendChild(
        optionTwo
      );

    }
  );


  firstOperation.value =
    "deletion";


  secondOperation.value =
    "reversal";


  updateComposition();

}



/* ==========================================================
   COMPOSITION OUTPUT
========================================================== */

function updateComposition() {

  const first =
    operations.find(
      function (
        operation
      ) {

        return (
          operation.id ===
          firstOperation.value
        );

      }
    );


  const second =
    operations.find(
      function (
        operation
      ) {

        return (
          operation.id ===
          secondOperation.value
        );

      }
    );


  if (
    !first
    ||
    !second
  ) {

    return;

  }


  compositionFormula.textContent =
    second.symbol
    +
    " ∘ "
    +
    first.symbol
    +
    " (x)";


  compositionExplanation.textContent =
    "Apply "
    +
    first.title
    +
    " first, then feed that result into "
    +
    second.title
    +
    ". The output of the first operation becomes the input of the second.";

}



firstOperation
  .addEventListener(
    "change",
    updateComposition
  );


secondOperation
  .addEventListener(
    "change",
    updateComposition
  );



/* ==========================================================
   QUICK REFERENCE
========================================================== */

function buildReferenceGrid() {

  referenceGrid.innerHTML =
    "";


  operations.forEach(
    function (
      operation
    ) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "reference-card";


      card.innerHTML =
        '<div class="reference-symbol">'
        +
        operation.symbol
        +
        '</div>'
        +
        '<h3>'
        +
        operation.title
        +
        '</h3>'
        +
        '<p>'
        +
        operation.subtitle
        +
        '</p>';


      referenceGrid.appendChild(
        card
      );

    }
  );

}



/* ==========================================================
   START
========================================================== */

buildOperationBank();

buildCompositionSelectors();

buildReferenceGrid();

showOperation(
  operations[0].id
);


});
