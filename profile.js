/* ==========================================================
   PAT LEARNING LAB
   SHARED PROFILE SYSTEM

   VERSION 1

   Handles:
   - Player profile
   - Free / Plus plan state
   - XP
   - Global streak
   - Per-game streaks
   - Completion history
   - Archive access
   - Shared localStorage

   Later:
   - Replace localStorage with real accounts
   - Connect Stripe / server-side subscription access
========================================================== */



/* ==========================================================
   STORAGE
========================================================== */

const PAT_PROFILE_STORAGE_KEY =
  "patLearningLabProfileV1";



/* ==========================================================
   GAME DEFINITIONS
========================================================== */

const PAT_GAMES = {

  contronym: {
    id: "contronym",
    name: "Contronym",
    icon: "±",
    xpPerCompletion: 25
  },

  cluecards: {
    id: "cluecards",
    name: "Cryptic Clue-Cards",
    icon: "🧩",
    xpPerCompletion: 25
  },

  koan_crossword: {
    id: "koan_crossword",
    name: "KOAN~KAON",
    icon: "✣",
    xpPerCompletion: 30
  },

  koan_cryptic: {
    id: "koan_cryptic",
    name: "KOAN~KAON Cryptic",
    icon: "◈",
    xpPerCompletion: 30
  },

  buzzword: {
    id: "buzzword",
    name: "Buzzword",
    icon: "🐝",
    xpPerCompletion: 25
  }

};



/* ==========================================================
   DEFAULT PROFILE
========================================================== */

function createDefaultPATProfile() {

  return {

    version:
      1,

    username:
      "Guest",

    avatar:
      "🧪",

    plan:
      "free",

    xp:
      0,

    createdAt:
      new Date()
        .toISOString(),

    lastActiveDate:
      null,

    globalStreak:
      0,

    streaks: {

      contronym:
        0,

      cluecards:
        0,

      koan_crossword:
        0,

      koan_cryptic:
        0,

      buzzword:
        0

    },

    lastPlayed: {

      contronym:
        null,

      cluecards:
        null,

      koan_crossword:
        null,

      koan_cryptic:
        null,

      buzzword:
        null

    },

    completed: {

      contronym:
        [],

      cluecards:
        [],

      koan_crossword:
        [],

      koan_cryptic:
        [],

      buzzword:
        []

    },

    achievements:
      []

  };

}



/* ==========================================================
   LOAD PROFILE
========================================================== */

function loadPATProfile() {

  const stored =
    localStorage.getItem(
      PAT_PROFILE_STORAGE_KEY
    );


  if (
    !stored
  ) {

    const fresh =
      createDefaultPATProfile();


    savePATProfile(
      fresh
    );


    return fresh;

  }


  try {

    const parsed =
      JSON.parse(
        stored
      );


    return migratePATProfile(
      parsed
    );

  }

  catch (
    error
  ) {

    console.warn(
      "PAT profile was corrupted. Creating a new profile.",
      error
    );


    const fresh =
      createDefaultPATProfile();


    savePATProfile(
      fresh
    );


    return fresh;

  }

}



/* ==========================================================
   MIGRATION / SAFETY
========================================================== */

function migratePATProfile(
  profile
) {

  const defaults =
    createDefaultPATProfile();


  const merged =
    {

      ...defaults,

      ...profile,

      streaks: {

        ...defaults.streaks,

        ...(profile.streaks || {})

      },

      lastPlayed: {

        ...defaults.lastPlayed,

        ...(profile.lastPlayed || {})

      },

      completed: {

        ...defaults.completed,

        ...(profile.completed || {})

      }

    };


  if (
    !Array.isArray(
      merged.achievements
    )
  ) {

    merged.achievements =
      [];

  }


  Object.keys(
    PAT_GAMES
  )
  .forEach(
    function (
      gameId
    ) {

      if (
        !Array.isArray(
          merged.completed[
            gameId
          ]
        )
      ) {

        merged.completed[
          gameId
        ] =
          [];

      }

    }
  );


  savePATProfile(
    merged
  );


  return merged;

}



/* ==========================================================
   SAVE PROFILE
========================================================== */

function savePATProfile(
  profile
) {

  localStorage.setItem(

    PAT_PROFILE_STORAGE_KEY,

    JSON.stringify(
      profile
    )

  );

}



/* ==========================================================
   DATE HELPERS
========================================================== */

function getPATDateString(
  date = new Date()
) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    )
    .padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    )
    .padStart(
      2,
      "0"
    );


  return (
    year
    +
    "-"
    +
    month
    +
    "-"
    +
    day
  );

}



function getYesterdayPATDateString() {

  const yesterday =
    new Date();


  yesterday.setDate(
    yesterday.getDate() - 1
  );


  return getPATDateString(
    yesterday
  );

}



/* ==========================================================
   GLOBAL STREAK
========================================================== */

function updateGlobalPATStreak(
  profile
) {

  const today =
    getPATDateString();


  const yesterday =
    getYesterdayPATDateString();


  if (
    profile.lastActiveDate ===
    today
  ) {

    return;

  }


  if (
    profile.lastActiveDate ===
    yesterday
  ) {

    profile.globalStreak++;

  }

  else {

    profile.globalStreak =
      1;

  }


  profile.lastActiveDate =
    today;

}



/* ==========================================================
   GAME STREAK
========================================================== */

function updateGamePATStreak(
  profile,
  gameId
) {

  const today =
    getPATDateString();


  const yesterday =
    getYesterdayPATDateString();


  const lastPlayed =
    profile.lastPlayed[
      gameId
    ];


  if (
    lastPlayed ===
    today
  ) {

    return;

  }


  if (
    lastPlayed ===
    yesterday
  ) {

    profile.streaks[
      gameId
    ]++;

  }

  else {

    profile.streaks[
      gameId
    ] =
      1;

  }


  profile.lastPlayed[
    gameId
  ] =
    today;

}



/* ==========================================================
   COMPLETE ACTIVITY
========================================================== */

function completePATActivity(
  gameId,
  activityId,
  options = {}
) {

  const game =
    PAT_GAMES[
      gameId
    ];


  if (
    !game
  ) {

    console.warn(
      "Unknown PAT Learning Lab game:",
      gameId
    );


    return null;

  }


  const profile =
    loadPATProfile();


  updateGlobalPATStreak(
    profile
  );


  updateGamePATStreak(
    profile,
    gameId
  );


  const completionId =
    String(
      activityId
    );


  const alreadyCompleted =
    profile.completed[
      gameId
    ]
    .includes(
      completionId
    );


  let xpEarned =
    0;


  if (
    !alreadyCompleted
  ) {

    profile.completed[
      gameId
    ]
    .push(
      completionId
    );


    xpEarned =
      Number(
        options.xp
      )
      ||
      game.xpPerCompletion;


    profile.xp +=
      xpEarned;

  }


  savePATProfile(
    profile
  );


  return {

    profile:
      profile,

    alreadyCompleted:
      alreadyCompleted,

    xpEarned:
      xpEarned,

    game:
      game

  };

}



/* ==========================================================
   MARK GAME PLAYED

   Useful when a user opens or attempts something
   but has not completed it yet.
========================================================== */

function markPATGamePlayed(
  gameId
) {

  if (
    !PAT_GAMES[
      gameId
    ]
  ) {

    return null;

  }


  const profile =
    loadPATProfile();


  updateGlobalPATStreak(
    profile
  );


  updateGamePATStreak(
    profile,
    gameId
  );


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   SUBSCRIPTION ACCESS
========================================================== */

function PATCanAccessArchive() {

  const profile =
    loadPATProfile();


  return (
    profile.plan ===
    "plus"
    ||
    profile.plan ===
    "admin"
  );

}



/* ==========================================================
   PLAN
========================================================== */

function setPATPlan(
  plan
) {

  const allowed =
    [
      "free",
      "plus",
      "admin"
    ];


  if (
    !allowed.includes(
      plan
    )
  ) {

    console.warn(
      "Invalid PAT plan:",
      plan
    );


    return false;

  }


  const profile =
    loadPATProfile();


  profile.plan =
    plan;


  savePATProfile(
    profile
  );


  return true;

}



/* ==========================================================
   USERNAME
========================================================== */

function setPATUsername(
  username
) {

  const profile =
    loadPATProfile();


  const cleaned =
    String(
      username || ""
    )
    .trim()
    .slice(
      0,
      30
    );


  profile.username =
    cleaned
    ||
    "Guest";


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   AVATAR
========================================================== */

function setPATAvatar(
  avatar
) {

  const profile =
    loadPATProfile();


  profile.avatar =
    avatar
    ||
    "🧪";


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   PROFILE STATS
========================================================== */

function getPATProfileStats() {

  const profile =
    loadPATProfile();


  const completedByGame =
    {};


  let totalCompleted =
    0;


  Object.keys(
    PAT_GAMES
  )
  .forEach(
    function (
      gameId
    ) {

      const count =
        profile.completed[
          gameId
        ]
        .length;


      completedByGame[
        gameId
      ] =
        count;


      totalCompleted +=
        count;

    }
  );


  return {

    username:
      profile.username,

    avatar:
      profile.avatar,

    plan:
      profile.plan,

    xp:
      profile.xp,

    globalStreak:
      profile.globalStreak,

    streaks:
      {
        ...profile.streaks
      },

    totalCompleted:
      totalCompleted,

    completedByGame:
      completedByGame

  };

}



/* ==========================================================
   RESET PROFILE
   DEVELOPMENT ONLY
========================================================== */

function resetPATProfile() {

  const fresh =
    createDefaultPATProfile();


  savePATProfile(
    fresh
  );


  return fresh;

}



/* ==========================================================
   GLOBAL API

   Every Learning Lab page can now use:

   PATProfile.get()
   PATProfile.complete(...)
   PATProfile.markPlayed(...)
   PATProfile.canAccessArchive()
   PATProfile.stats()
========================================================== */

window.PATProfile = {

  get:
    loadPATProfile,

  save:
    savePATProfile,

  stats:
    getPATProfileStats,

  complete:
    completePATActivity,

  markPlayed:
    markPATGamePlayed,

  canAccessArchive:
    PATCanAccessArchive,

  setPlan:
    setPATPlan,

  setUsername:
    setPATUsername,

  setAvatar:
    setPATAvatar,

  reset:
    resetPATProfile,

  games:
    PAT_GAMES

};



/* ==========================================================
   READY EVENT

   Pages can listen for:

   window.addEventListener(
     "pat-profile-ready",
     function () {}
   );
========================================================== */

window.dispatchEvent(

  new CustomEvent(
    "pat-profile-ready",
    {

      detail:
        loadPATProfile()

    }
  )

);
