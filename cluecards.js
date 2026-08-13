/* ==========================================================
   KOAN~KAON CLUE-CARDS
   PAT LEARNING LAB

   ADD FUTURE CLUE-CARDS TO THE DATABASE BELOW.

   THE LAST ENTRY AUTOMATICALLY BECOMES THE CURRENT CLUE.

   ALL PREVIOUS ENTRIES AUTOMATICALLY APPEAR IN THE ARCHIVE.
========================================================== */


/* ==========================================================
   CLUE-CARD DATABASE
========================================================== */


const clueCards = [


  /* ========================================================
     CLUE-CARD #001
     HAT-TRICK
  ======================================================== */

  {

    number:
      "001",

    title:
      "Hat-Trick",

    clue:
      "Pulling a rabbit out three times is the goal.",

    enumeration:
      "(3-5)",

    type:
      "Double-Play",

    mechanism:
      "Double Definition / Superposition",

    mechanismDescription:
      "One answer satisfies two different meanings at the same time.",


    /* ------------------------------------------------------
       ORIGINAL CLUE RELEASE

       Display order from your original release:

       IMG_0202
       IMG_0200
       IMG_0201
       IMG_0203
    ------------------------------------------------------ */

    clueSlides: [

      "images/cluecards/001/IMG_0202.jpeg",

      "images/cluecards/001/IMG_0200.jpeg",

      "images/cluecards/001/IMG_0201.jpeg",

      "images/cluecards/001/IMG_0203.jpeg"

    ],


    /* ------------------------------------------------------
       ANSWER RELEASE

       The original clue card is deliberately reused first.

       Then:

       IMG_0204
       IMG_0206
       IMG_0205
    ------------------------------------------------------ */

    solutionSlides: [

      "images/cluecards/001/IMG_0202.jpeg",

      "images/cluecards/001/IMG_0204.jpeg",

      "images/cluecards/001/IMG_0206.jpeg",

      "images/cluecards/001/IMG_0205.jpeg"

    ],


    answer:
      "HAT-TRICK",

    senseA:
      "Magic: pulling a rabbit out of a hat.",

    senseB:
      "Sport: scoring three goals.",

    difficulty:
      "Easy"

  }


  /*
  ==========================================================
  FUTURE CLUE #002 EXAMPLE

  When #002 is ready:

  1. Put its images inside:

     images/cluecards/002/

  2. Add a comma after the closing brace of #001.

  3. Add another object like this:


  ,

  {

    number:
      "002",

    title:
      "Your Answer",

    clue:
      "Your clue here.",

    enumeration:
      "(4)",

    type:
      "Approximation",

    mechanism:
      "Homophone",

    mechanismDescription:
      "Two sounds collapse toward one answer.",

    clueSlides: [

      "images/cluecards/002/IMG_0001.jpeg",

      "images/cluecards/002/IMG_0002.jpeg"

    ],

    solutionSlides: [

      "images/cluecards/002/IMG_0001.jpeg",

      "images/cluecards/002/IMG_0003.jpeg"

    ],

    answer:
      "ANSWER",

    senseA:
      "First meaning.",

    senseB:
      "Second meaning.",

    difficulty:
      "Easy"

  }

  ==========================================================
  */


];



/* ==========================================================
   STATE
========================================================== */


const currentClue =
  clueCards[
    clueCards.length - 1
  ];


let activeClue =
  currentClue;


let phase =
  "clue";


let slideIndex =
  0;


let solutionUnlocked =
  false;



/* ==========================================================
   ELEMENTS
========================================================== */


const currentTab =
  document.getElementById(
    "currentTab"
  );


const archiveTab =
  document.getElementById(
    "archiveTab"
  );


const playView =
  document.getElementById(
    "playView"
  );


const archiveView =
  document.getElementById(
    "archiveView"
  );


const clueNumber =
  document.getElementById(
    "clueNumber"
  );


const clueTitle =
  document.getElementById(
    "clueTitle"
  );


const clueText =
  document.getElementById(
    "clueText"
  );


const enumeration =
  document.getElementById(
    "enumeration"
  );


const cluePhaseButton =
  document.getElementById(
    "cluePhaseButton"
  );


const solutionPhaseButton =
  document.getElementById(
    "solutionPhaseButton"
  );


const phaseLabel =
  document.getElementById(
    "phaseLabel"
  );


const slideCounter =
  document.getElementById(
    "slideCounter"
  );


const clueImage =
  document.getElementById(
    "clueImage"
  );


const previousButton =
  document.getElementById(
    "previousButton"
  );


const nextButton =
  document.getElementById(
    "nextButton"
  );


const dots =
  document.getElementById(
    "dots"
  );


const revealBox =
  document.getElementById(
    "revealBox"
  );


const bigRevealButton =
  document.getElementById(
    "bigRevealButton"
  );


const solutionInfo =
  document.getElementById(
    "solutionInfo"
  );


const answerTitle =
  document.getElementById(
    "answerTitle"
  );


const senseA =
  document.getElementById(
    "senseA"
  );


const senseB =
  document.getElementById(
    "senseB"
  );


const mechanism =
  document.getElementById(
    "mechanism"
  );


const mechanismDescription =
  document.getElementById(
    "mechanismDescription"
  );


const archiveList =
  document.getElementById(
    "archiveList"
  );



/* ==========================================================
   GET CURRENT SLIDES
========================================================== */


function getSlides() {

  if (
    phase ===
    "solution"
  ) {

    return activeClue.solutionSlides;

  }


  return activeClue.clueSlides;

}



/* ==========================================================
   LOAD CLUE DATA
========================================================== */


function loadClue(card) {

  activeClue =
    card;


  phase =
    "clue";


  slideIndex =
    0;


  solutionUnlocked =
    false;


  clueNumber.textContent =
    `CLUE-CARD #${card.number}`;


  clueTitle.textContent =
    card.title;


  clueText.textContent =
    `"${card.clue}"`;


  enumeration.textContent =
    card.enumeration;


  answerTitle.textContent =
    card.answer;


  senseA.textContent =
    card.senseA;


  senseB.textContent =
    card.senseB;


  mechanism.textContent =
    `${card.type} • ${card.mechanism}`;


  mechanismDescription.textContent =
    card.mechanismDescription;


  solutionInfo
    .classList
    .remove(
      "visible"
    );


  revealBox.style.display =
    "block";


  cluePhaseButton
    .classList
    .add(
      "active"
    );


  solutionPhaseButton
    .classList
    .remove(
      "active"
    );


  solutionPhaseButton.textContent =
    "🔒 Reveal Solution";


  renderSlide();

}



/* ==========================================================
   RENDER SLIDE
========================================================== */


function renderSlide() {

  const slides =
    getSlides();


  clueImage.src =
    slides[
      slideIndex
    ];


  clueImage.alt =
    `Koan Kaon Clue-Card #${activeClue.number} slide ${slideIndex + 1}`;


  slideCounter.textContent =
    `${slideIndex + 1} / ${slides.length}`;


  phaseLabel.textContent =
    phase === "clue"

    ? "CLUE RELEASE"

    : "SOLUTION RELEASE";


  previousButton.disabled =
    slideIndex === 0;


  nextButton.disabled =
    slideIndex ===
    slides.length - 1;


  buildDots();

}



/* ==========================================================
   DOT NAVIGATION
========================================================== */


function buildDots() {

  dots.innerHTML =
    "";


  const slides =
    getSlides();


  slides.forEach(
    (
      slide,
      index
    ) => {


      const dot =
        document.createElement(
          "button"
        );


      dot.className =
        "dot";


      if (
        index ===
        slideIndex
      ) {

        dot
          .classList
          .add(
            "active"
          );

      }


      dot.addEventListener(
        "click",

        () => {

          slideIndex =
            index;

          renderSlide();

        }
      );


      dots.appendChild(
        dot
      );

    }
  );

}



/* ==========================================================
   PREVIOUS / NEXT
========================================================== */


previousButton
  .addEventListener(

    "click",

    () => {

      if (
        slideIndex >
        0
      ) {

        slideIndex--;

        renderSlide();

      }

    }

  );


nextButton
  .addEventListener(

    "click",

    () => {

      const slides =
        getSlides();


      if (
        slideIndex <
        slides.length - 1
      ) {

        slideIndex++;

        renderSlide();

      }

    }

  );



/* ==========================================================
   CLUE PHASE
========================================================== */


cluePhaseButton
  .addEventListener(

    "click",

    () => {

      phase =
        "clue";


      slideIndex =
        0;


      cluePhaseButton
        .classList
        .add(
          "active"
        );


      solutionPhaseButton
        .classList
        .remove(
          "active"
        );


      renderSlide();

    }

  );



/* ==========================================================
   SOLUTION PHASE
========================================================== */


function revealSolution() {

  solutionUnlocked =
    true;


  phase =
    "solution";


  slideIndex =
    0;


  solutionPhaseButton.textContent =
    "🔓 Solution";


  solutionPhaseButton
    .classList
    .add(
      "active"
    );


  cluePhaseButton
    .classList
    .remove(
      "active"
    );


  solutionInfo
    .classList
    .add(
      "visible"
    );


  revealBox.style.display =
    "none";


  renderSlide();

}



solutionPhaseButton
  .addEventListener(

    "click",

    () => {

      if (
        !solutionUnlocked
      ) {

        revealSolution();

        return;

      }


      phase =
        "solution";


      slideIndex =
        0;


      solutionPhaseButton
        .classList
        .add(
          "active"
        );


      cluePhaseButton
        .classList
        .remove(
          "active"
        );


      renderSlide();

    }

  );


bigRevealButton
  .addEventListener(

    "click",

    revealSolution

  );



/* ==========================================================
   ARCHIVE
========================================================== */


function buildArchive() {

  archiveList.innerHTML =
    "";


  const archived =
    clueCards
      .slice(
        0,
        -1
      )
      .reverse();


  if (
    archived.length ===
    0
  ) {

    archiveList.innerHTML = `

      <div class="empty-archive">

        Clue-Card #001 is currently live.

        <br><br>

        When #002 is released,
        #001 will automatically move here.

      </div>

    `;


    return;

  }


  archived.forEach(
    card => {


      const archiveCard =
        document.createElement(
          "div"
        );


      archiveCard.className =
        "archive-card";


      archiveCard.innerHTML = `

        <div class="archive-top">

          <span class="archive-number">

            CLUE-CARD #${card.number}

          </span>

          <span>

            ${card.difficulty}

          </span>

        </div>


        <div class="archive-title">

          ${card.title}

        </div>


        <div class="archive-clue">

          "${card.clue}"

          ${card.enumeration}

        </div>


        <button
          class="archive-play-button"
        >

          Play Archived Clue

        </button>

      `;


      archiveCard
        .querySelector(
          ".archive-play-button"
        )
        .addEventListener(

          "click",

          () => {

            loadClue(
              card
            );


            playView
              .classList
              .add(
                "active"
              );


            archiveView
              .classList
              .remove(
                "active"
              );


            currentTab
              .classList
              .add(
                "active"
              );


            archiveTab
              .classList
              .remove(
                "active"
              );


            window.scrollTo(
              {
                top: 0,
                behavior: "smooth"
              }
            );

          }

        );


      archiveList.appendChild(
        archiveCard
      );

    }
  );

}



/* ==========================================================
   TOP NAVIGATION
========================================================== */


currentTab
  .addEventListener(

    "click",

    () => {

      loadClue(
        currentClue
      );


      playView
        .classList
        .add(
          "active"
        );


      archiveView
        .classList
        .remove(
          "active"
        );


      currentTab
        .classList
        .add(
          "active"
        );


      archiveTab
        .classList
        .remove(
          "active"
        );

    }

  );


archiveTab
  .addEventListener(

    "click",

    () => {

      buildArchive();


      playView
        .classList
        .remove(
          "active"
        );


      archiveView
        .classList
        .add(
          "active"
        );


      currentTab
        .classList
        .remove(
          "active"
        );


      archiveTab
        .classList
        .add(
          "active"
        );

    }

  );



/* ==========================================================
   SWIPE SUPPORT FOR IPHONE / IPAD
========================================================== */


let touchStartX =
  0;


let touchEndX =
  0;


const imageFrame =
  document.getElementById(
    "imageFrame"
  );


imageFrame
  .addEventListener(

    "touchstart",

    event => {

      touchStartX =
        event
          .changedTouches[0]
          .screenX;

    },

    {
      passive: true
    }

  );


imageFrame
  .addEventListener(

    "touchend",

    event => {

      touchEndX =
        event
          .changedTouches[0]
          .screenX;


      handleSwipe();

    },

    {
      passive: true
    }

  );



function handleSwipe() {

  const difference =
    touchEndX -
    touchStartX;


  if (
    Math.abs(
      difference
    )
    <
    50
  ) {

    return;

  }


  const slides =
    getSlides();


  if (
    difference <
    0
    &&
    slideIndex <
    slides.length - 1
  ) {

    slideIndex++;

    renderSlide();

  }


  if (
    difference >
    0
    &&
    slideIndex >
    0
  ) {

    slideIndex--;

    renderSlide();

  }

}



/* ==========================================================
   START
========================================================== */


loadClue(
  currentClue
);
