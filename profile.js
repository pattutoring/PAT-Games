/* ==========================================================
   PAT LEARNING LAB
   SHARED PROFILE SYSTEM

   VERSION 2

   ONE PROFILE ACROSS THE ENTIRE LEARNING LAB

   Supports:
   - Username
   - Email
   - Avatar
   - Free / Plus / Admin plan
   - XP
   - Overall Learning Lab streak
   - Selected game/series streaks
   - Completion history
   - Game progress
   - Unlocks
   - Achievements
   - Archive access
   - Future subscription integration

   CURRENT STORAGE:
   localStorage

   FUTURE:
   Real authentication + cloud database + subscriptions
========================================================== */



/* ==========================================================
   STORAGE
========================================================== */

const PAT_PROFILE_STORAGE_KEY =
  "patLearningLabProfileV2";


const PAT_OLD_PROFILE_KEYS =
  [
    "patLearningLabProfileV1"
  ];



/* ==========================================================
   LEARNING LAB WORLDS

   These are the main areas currently represented
   in the Learning Lab.

   usesStreak determines whether simply completing
   that game's normal activity contributes to a
   dedicated streak.

   Some games, such as Molecular Bee and KOAN~KAON,
   contain particular MODES that have streaks.
========================================================== */

const PAT_GAMES = {


  /* ========================================================
     CHEMISTRY
  ======================================================== */

  molecular_farm: {

    id:
      "molecular_farm",

    name:
      "Molecular Farm",

    icon:
      "🌾",

    xpPerCompletion:
      25,

    usesStreak:
      false

  },


  molecular_bee: {

    id:
      "molecular_bee",

    name:
      "Molecular Bee",

    icon:
      "🐝",

    xpPerCompletion:
      25,

    usesStreak:
      false

  },



  /* ========================================================
     LANGUAGE / WORDPLAY
  ======================================================== */

  contronym: {

    id:
      "contronym",

    name:
      "Contronym",

    icon:
      "±",

    xpPerCompletion:
      25,

    usesStreak:
      true,

    defaultStreakKey:
      "contronym"

  },


  cluecards: {

    id:
      "cluecards",

    name:
      "Cryptic Clue-Cards",

    icon:
      "🧩",

    xpPerCompletion:
      25,

    usesStreak:
      true,

    defaultStreakKey:
      "cluecards"

  },


  koan_kaon: {

    id:
      "koan_kaon",

    name:
      "KOAN~KAON",

    icon:
      "✣",

    xpPerCompletion:
      30,

    usesStreak:
      false

  },


  cryptic_calculus: {

    id:
      "cryptic_calculus",

    name:
      "Cryptic-Calculus",

    icon:
      "∫",

    xpPerCompletion:
      25,

    usesStreak:
      false

  },



  /* ========================================================
     MATHEMATICS
  ======================================================== */

  candy_calculus: {

    id:
      "candy_calculus",

    name:
      "Oberlander! Candy-Calculus",

    icon:
      "🍬",

    xpPerCompletion:
      20,

    usesStreak:
      false

  },



  /* ========================================================
     MEANING / NARRATIVE SYSTEMS
  ======================================================== */

  meaning_graphs: {

    id:
      "meaning_graphs",

    name:
      "Meaning Graphs",

    icon:
      "📈",

    xpPerCompletion:
      20,

    usesStreak:
      false

  },


  mythopoetic_diagrams: {

    id:
      "mythopoetic_diagrams",

    name:
      "Mythopoetic Diagrams",

    icon:
      "📖",

    xpPerCompletion:
      20,

    usesStreak:
      false

  },


  wordsmith: {

    id:
      "wordsmith",

    name:
      "Wordsmith",

    icon:
      "✒️",

    xpPerCompletion:
      15,

    usesStreak:
      false

  },


  sentence_standard_model: {

    id:
      "sentence_standard_model",

    name:
      "Sentence Standard Model",

    icon:
      "⚛️",

    xpPerCompletion:
      20,

    usesStreak:
      false

  },


  twain_editor: {

    id:
      "twain_editor",

    name:
      "Twain Editor",

    icon:
      "⌨️",

    xpPerCompletion:
      10,

    usesStreak:
      false

  }

};



/* ==========================================================
   STREAK SERIES

   These are intentionally separate from the main
   Learning Lab worlds.

   Example:
   Buzzword lives inside Molecular Bee, but Buzzword
   can have its own streak without forcing the entire
   Molecular Bee app to use one.

   KOAN~KAON can likewise have two independent puzzle
   series.
========================================================== */

const PAT_STREAK_SERIES = {


  contronym: {

    id:
      "contronym",

    name:
      "Contronym",

    icon:
      "±",

    parentGame:
      "contronym"

  },


  cluecards: {

    id:
      "cluecards",

    name:
      "Clue-Cards",

    icon:
      "🧩",

    parentGame:
      "cluecards"

  },


  koan_one: {

    id:
      "koan_one",

    name:
      "KOAN~KAON I",

    icon:
      "✣",

    parentGame:
      "koan_kaon"

  },


  koan_two: {

    id:
      "koan_two",

    name:
      "KOAN~KAON II",

    icon:
      "◈",

    parentGame:
      "koan_kaon"

  },


  buzzword: {

    id:
      "buzzword",

    name:
      "Buzzword",

    icon:
      "🐝",

    parentGame:
      "molecular_bee"

  }

};



/* ==========================================================
   DEFAULT PROFILE
========================================================== */

function createDefaultPATProfile() {

  const completed =
    {};


  const progress =
    {};


  const lastPlayed =
    {};


  Object.keys(
    PAT_GAMES
  )
  .forEach(
    function (
      gameId
    ) {

      completed[
        gameId
      ] =
        [];


      progress[
        gameId
      ] =
        {};


      lastPlayed[
        gameId
      ] =
        null;

    }
  );


  const streaks =
    {};


  const streakLastPlayed =
    {};


  Object.keys(
    PAT_STREAK_SERIES
  )
  .forEach(
    function (
      streakId
    ) {

      streaks[
        streakId
      ] =
        0;


      streakLastPlayed[
        streakId
      ] =
        null;

    }
  );


  return {

    version:
      2,


    /* ======================================================
       ACCOUNT
    ====================================================== */

    username:
      "Guest",

    email:
      "",

    avatar:
      "🧪",

    profileCreated:
      false,


    /* ======================================================
       SUBSCRIPTION

       free
       plus
       admin
    ====================================================== */

    plan:
      "free",


    /* ======================================================
       PLAYER STATS
    ====================================================== */

    xp:
      0,

    globalStreak:
      0,

    lastActiveDate:
      null,


    /* ======================================================
       PER-SERIES STREAKS
    ====================================================== */

    streaks:
      streaks,

    streakLastPlayed:
      streakLastPlayed,


    /* ======================================================
       GAME ACTIVITY
    ====================================================== */

    lastPlayed:
      lastPlayed,

    completed:
      completed,

    progress:
      progress,


    /* ======================================================
       CONTENT
    ====================================================== */

    unlocks:
      [],

    achievements:
      [],


    /* ======================================================
       ACCOUNT DATES
    ====================================================== */

    createdAt:
      new Date()
        .toISOString(),

    updatedAt:
      new Date()
        .toISOString()

  };

}



/* ==========================================================
   SAVE
========================================================== */

function savePATProfile(
  profile
) {

  profile.updatedAt =
    new Date()
      .toISOString();


  localStorage.setItem(

    PAT_PROFILE_STORAGE_KEY,

    JSON.stringify(
      profile
    )

  );


  window.dispatchEvent(

    new CustomEvent(
      "pat-profile-updated",
      {

        detail:
          profile

      }
    )

  );


  return profile;

}



/* ==========================================================
   OLD PROFILE DISCOVERY
========================================================== */

function findOldPATProfile() {

  for (
    const key
    of
    PAT_OLD_PROFILE_KEYS
  ) {

    const saved =
      localStorage.getItem(
        key
      );


    if (
      saved
    ) {

      try {

        return JSON.parse(
          saved
        );

      }

      catch (
        error
      ) {

        console.warn(
          "Could not read old PAT profile:",
          key
        );

      }

    }

  }


  return null;

}



/* ==========================================================
   MIGRATION
========================================================== */

function migratePATProfile(
  oldProfile
) {

  const fresh =
    createDefaultPATProfile();


  if (
    !oldProfile
  ) {

    return fresh;

  }


  fresh.username =
    oldProfile.username
    ||
    fresh.username;


  fresh.email =
    oldProfile.email
    ||
    "";


  fresh.avatar =
    oldProfile.avatar
    ||
    fresh.avatar;


  fresh.profileCreated =
    Boolean(
      oldProfile.profileCreated
      ||
      oldProfile.email
      ||
      (
        oldProfile.username
        &&
        oldProfile.username !==
        "Guest"
      )
    );


  fresh.plan =
    oldProfile.plan
    ||
    "free";


  fresh.xp =
    Number(
      oldProfile.xp
      ||
      0
    );


  fresh.globalStreak =
    Number(
      oldProfile.globalStreak
      ||
      0
    );


  fresh.lastActiveDate =
    oldProfile.lastActiveDate
    ||
    null;


  fresh.createdAt =
    oldProfile.createdAt
    ||
    fresh.createdAt;



  /* ========================================================
     COMPLETIONS
  ======================================================== */

  if (
    oldProfile.completed
  ) {

    Object.keys(
      fresh.completed
    )
    .forEach(
      function (
        gameId
      ) {

        if (
          Array.isArray(
            oldProfile.completed[
              gameId
            ]
          )
        ) {

          fresh.completed[
            gameId
          ] =
            [
              ...oldProfile.completed[
                gameId
              ]
            ];

        }

      }
    );

  }



  /* ========================================================
     PROGRESS
  ======================================================== */

  if (
    oldProfile.progress
  ) {

    Object.keys(
      fresh.progress
    )
    .forEach(
      function (
        gameId
      ) {

        if (
          oldProfile.progress[
            gameId
          ]
          &&
          typeof oldProfile.progress[
            gameId
          ] ===
          "object"
        ) {

          fresh.progress[
            gameId
          ] =
            {

              ...oldProfile.progress[
                gameId
              ]

            };

        }

      }
    );

  }



  /* ========================================================
     GAME LAST PLAYED
  ======================================================== */

  if (
    oldProfile.lastPlayed
  ) {

    Object.keys(
      fresh.lastPlayed
    )
    .forEach(
      function (
        gameId
      ) {

        if (
          oldProfile.lastPlayed[
            gameId
          ]
        ) {

          fresh.lastPlayed[
            gameId
          ] =
            oldProfile.lastPlayed[
              gameId
            ];

        }

      }
    );

  }



  /* ========================================================
     OLD STREAKS

     Preserves names from our previous prototype.
  ======================================================== */

  if (
    oldProfile.streaks
  ) {

    if (
      oldProfile.streaks.contronym
      !==
      undefined
    ) {

      fresh.streaks.contronym =
        Number(
          oldProfile.streaks.contronym
          ||
          0
        );

    }


    if (
      oldProfile.streaks.cluecards
      !==
      undefined
    ) {

      fresh.streaks.cluecards =
        Number(
          oldProfile.streaks.cluecards
          ||
          0
        );

    }


    if (
      oldProfile.streaks.buzzword
      !==
      undefined
    ) {

      fresh.streaks.buzzword =
        Number(
          oldProfile.streaks.buzzword
          ||
          0
        );

    }


    /*
      Previous prototype names
    */

    if (
      oldProfile.streaks.koan_crossword
      !==
      undefined
    ) {

      fresh.streaks.koan_one =
        Number(
          oldProfile.streaks.koan_crossword
          ||
          0
        );

    }


    if (
      oldProfile.streaks.koan_cryptic
      !==
      undefined
    ) {

      fresh.streaks.koan_two =
        Number(
          oldProfile.streaks.koan_cryptic
          ||
          0
        );

    }

  }



  /* ========================================================
     OLD ACHIEVEMENTS / UNLOCKS
  ======================================================== */

  if (
    Array.isArray(
      oldProfile.achievements
    )
  ) {

    fresh.achievements =
      [
        ...oldProfile.achievements
      ];

  }


  if (
    Array.isArray(
      oldProfile.unlocks
    )
  ) {

    fresh.unlocks =
      [
        ...oldProfile.unlocks
      ];

  }


  return fresh;

}



/* ==========================================================
   LOAD
========================================================== */

function loadPATProfile() {

  const current =
    localStorage.getItem(
      PAT_PROFILE_STORAGE_KEY
    );


  if (
    current
  ) {

    try {

      const parsed =
        JSON.parse(
          current
        );


      const migrated =
        migratePATProfile(
          parsed
        );


      savePATProfile(
        migrated
      );


      return migrated;

    }

    catch (
      error
    ) {

      console.warn(
        "PAT profile could not be read.",
        error
      );

    }

  }


  const oldProfile =
    findOldPATProfile();


  if (
    oldProfile
  ) {

    const migrated =
      migratePATProfile(
        oldProfile
      );


    savePATProfile(
      migrated
    );


    return migrated;

  }


  const fresh =
    createDefaultPATProfile();


  savePATProfile(
    fresh
  );


  return fresh;

}



/* ==========================================================
   DATE HELPERS

   Uses the user's LOCAL calendar day.

   This is important for streaks.
========================================================== */

function getPATDateString(
  date =
    new Date()
) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth()
      +
      1
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



function getPATYesterdayString() {

  const date =
    new Date();


  date.setDate(
    date.getDate()
    -
    1
  );


  return getPATDateString(
    date
  );

}



/* ==========================================================
   GLOBAL LEARNING LAB STREAK
========================================================== */

function updatePATGlobalStreak(
  profile
) {

  const today =
    getPATDateString();


  const yesterday =
    getPATYesterdayString();


  if (
    profile.lastActiveDate ===
    today
  ) {

    return false;

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


  return true;

}



/* ==========================================================
   DEDICATED STREAK
========================================================== */

function updatePATSeriesStreak(
  profile,
  streakKey
) {

  if (
    !PAT_STREAK_SERIES[
      streakKey
    ]
  ) {

    return false;

  }


  const today =
    getPATDateString();


  const yesterday =
    getPATYesterdayString();


  const lastPlayed =
    profile.streakLastPlayed[
      streakKey
    ];


  /*
    Already counted today.
  */

  if (
    lastPlayed ===
    today
  ) {

    return false;

  }


  if (
    lastPlayed ===
    yesterday
  ) {

    profile.streaks[
      streakKey
    ]++;

  }

  else {

    profile.streaks[
      streakKey
    ] =
      1;

  }


  profile.streakLastPlayed[
    streakKey
  ] =
    today;


  return true;

}



/* ==========================================================
   MARK GAME PLAYED

   This updates:
   - global activity streak
   - last played date

   It DOES NOT automatically update a dedicated
   puzzle streak unless a streakKey is supplied.
========================================================== */

function markPATGamePlayed(
  gameId,
  options =
    {}
) {

  const game =
    PAT_GAMES[
      gameId
    ];


  if (
    !game
  ) {

    console.warn(
      "Unknown PAT game:",
      gameId
    );


    return null;

  }


  const profile =
    loadPATProfile();


  const today =
    getPATDateString();


  updatePATGlobalStreak(
    profile
  );


  profile.lastPlayed[
    gameId
  ] =
    today;


  let streakKey =
    options.streakKey
    ||
    null;


  if (
    !streakKey
    &&
    game.usesStreak
    &&
    game.defaultStreakKey
  ) {

    streakKey =
      game.defaultStreakKey;

  }


  if (
    streakKey
  ) {

    updatePATSeriesStreak(
      profile,
      streakKey
    );

  }


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   COMPLETE ACTIVITY

   Examples:

   CONTRONYM:

   PATProfile.complete(
     "contronym",
     "002"
   );


   BUZZWORD:

   PATProfile.complete(
     "molecular_bee",
     "buzzword-004",
     {
       streakKey:
         "buzzword"
     }
   );


   KOAN PUZZLE ONE:

   PATProfile.complete(
     "koan_kaon",
     "001",
     {
       streakKey:
         "koan_one"
     }
   );
========================================================== */

function completePATActivity(
  gameId,
  activityId,
  options =
    {}
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


  const today =
    getPATDateString();


  updatePATGlobalStreak(
    profile
  );


  profile.lastPlayed[
    gameId
  ] =
    today;


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


  /*
    XP is awarded once per unique activity.
  */

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
      Number(
        game.xpPerCompletion
      )
      ||
      0;


    profile.xp +=
      xpEarned;

  }



  /* ========================================================
     STREAK

     A dedicated streak advances when the activity
     is completed, not merely viewed.
  ======================================================== */

  let streakKey =
    options.streakKey
    ||
    null;


  if (
    !streakKey
    &&
    game.usesStreak
    &&
    game.defaultStreakKey
  ) {

    streakKey =
      game.defaultStreakKey;

  }


  let streakAdvanced =
    false;


  if (
    streakKey
  ) {

    streakAdvanced =
      updatePATSeriesStreak(
        profile,
        streakKey
      );

  }


  savePATProfile(
    profile
  );


  return {

    profile:
      profile,

    game:
      game,

    activityId:
      completionId,

    alreadyCompleted:
      alreadyCompleted,

    xpEarned:
      xpEarned,

    streakKey:
      streakKey,

    streakAdvanced:
      streakAdvanced

  };

}



/* ==========================================================
   SAVE GAME PROGRESS

   Use this for games that do not need streaks.

   Examples:

   PATProfile.setProgress(
     "molecular_farm",
     "speciesDiscovered",
     8
   );

   PATProfile.setProgress(
     "meaning_graphs",
     "graphsBuilt",
     3
   );
========================================================== */

function setPATGameProgress(
  gameId,
  key,
  value
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


  if (
    !profile.progress[
      gameId
    ]
  ) {

    profile.progress[
      gameId
    ] =
      {};

  }


  profile.progress[
    gameId
  ][
    key
  ] =
    value;


  savePATProfile(
    profile
  );


  return profile.progress[
    gameId
  ];

}



/* ==========================================================
   GET GAME PROGRESS
========================================================== */

function getPATGameProgress(
  gameId,
  key
) {

  const profile =
    loadPATProfile();


  if (
    !profile.progress[
      gameId
    ]
  ) {

    return undefined;

  }


  if (
    key ===
    undefined
  ) {

    return profile.progress[
      gameId
    ];

  }


  return profile.progress[
    gameId
  ][
    key
  ];

}



/* ==========================================================
   UNLOCKS
========================================================== */

function unlockPATContent(
  unlockId
) {

  const profile =
    loadPATProfile();


  const id =
    String(
      unlockId
    );


  if (
    !profile.unlocks.includes(
      id
    )
  ) {

    profile.unlocks.push(
      id
    );


    savePATProfile(
      profile
    );

  }


  return profile;

}



function hasPATUnlock(
  unlockId
) {

  const profile =
    loadPATProfile();


  return profile.unlocks.includes(
    String(
      unlockId
    )
  );

}



/* ==========================================================
   ACHIEVEMENTS
========================================================== */

function awardPATAchievement(
  achievementId
) {

  const profile =
    loadPATProfile();


  const id =
    String(
      achievementId
    );


  if (
    !profile.achievements.includes(
      id
    )
  ) {

    profile.achievements.push(
      id
    );


    savePATProfile(
      profile
    );


    return true;

  }


  return false;

}



/* ==========================================================
   PROFILE DETAILS
========================================================== */

function updatePATAccount(
  data =
    {}
) {

  const profile =
    loadPATProfile();


  if (
    data.username !==
    undefined
  ) {

    const username =
      String(
        data.username
        ||
        ""
      )
      .trim()
      .slice(
        0,
        30
      );


    profile.username =
      username
      ||
      "Guest";

  }


  if (
    data.email !==
    undefined
  ) {

    profile.email =
      String(
        data.email
        ||
        ""
      )
      .trim()
      .toLowerCase()
      .slice(
        0,
        150
      );

  }


  if (
    data.avatar !==
    undefined
  ) {

    profile.avatar =
      String(
        data.avatar
        ||
        "🧪"
      );

  }


  profile.profileCreated =
    Boolean(
      profile.email
      &&
      profile.username
      &&
      profile.username !==
      "Guest"
    );


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   USERNAME
========================================================== */

function setPATUsername(
  username
) {

  return updatePATAccount(
    {

      username:
        username

    }
  );

}



/* ==========================================================
   EMAIL
========================================================== */

function setPATEmail(
  email
) {

  return updatePATAccount(
    {

      email:
        email

    }
  );

}



/* ==========================================================
   AVATAR
========================================================== */

function setPATAvatar(
  avatar
) {

  return updatePATAccount(
    {

      avatar:
        avatar

    }
  );

}



/* ==========================================================
   PLAN / SUBSCRIPTION

   IMPORTANT:

   This is only prototype state.

   Once real subscriptions exist, plan status should be
   supplied by a secure backend rather than trusted from
   localStorage.
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


  return profile;

}



/* ==========================================================
   ARCHIVE ACCESS
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
   SUBSCRIPTION CHECK
========================================================== */

function PATHasPlan(
  plan
) {

  const profile =
    loadPATProfile();


  if (
    plan ===
    "free"
  ) {

    return true;

  }


  if (
    plan ===
    "plus"
  ) {

    return (
      profile.plan ===
      "plus"
      ||
      profile.plan ===
      "admin"
    );

  }


  if (
    plan ===
    "admin"
  ) {

    return (
      profile.plan ===
      "admin"
    );

  }


  return false;

}



/* ==========================================================
   PROFILE STATS
========================================================== */

function getPATProfileStats() {

  const profile =
    loadPATProfile();


  let totalCompleted =
    0;


  const completedByGame =
    {};


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

    email:
      profile.email,

    avatar:
      profile.avatar,

    profileCreated:
      profile.profileCreated,

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
      completedByGame,

    achievements:
      [
        ...profile.achievements
      ],

    unlocks:
      [
        ...profile.unlocks
      ]

  };

}



/* ==========================================================
   COMPLETION CHECK
========================================================== */

function hasPATCompleted(
  gameId,
  activityId
) {

  const profile =
    loadPATProfile();


  if (
    !profile.completed[
      gameId
    ]
  ) {

    return false;

  }


  return profile.completed[
    gameId
  ]
  .includes(
    String(
      activityId
    )
  );

}



/* ==========================================================
   PROFILE CREATED / SIGNED IN

   For now "signed in" means that the user has created
   a local Learning Lab profile with username + email.

   Later this function can be swapped to real
   authentication without changing game pages.
========================================================== */

function PATIsSignedIn() {

  const profile =
    loadPATProfile();


  return Boolean(
    profile.profileCreated
    &&
    profile.username
    &&
    profile.username !==
    "Guest"
    &&
    profile.email
  );

}



/* ==========================================================
   SIGN OUT

   Because this is currently local-only, sign out does
   NOT erase progress.

   It only removes identity fields.

   Real account behavior can replace this later.
========================================================== */

function PATSignOut() {

  const profile =
    loadPATProfile();


  profile.username =
    "Guest";


  profile.email =
    "";


  profile.profileCreated =
    false;


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   RESET EVERYTHING

   DEVELOPMENT / TESTING ONLY
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
   PUBLIC API

   AVAILABLE FROM EVERY PAGE AFTER:

   <script src="profile.js"></script>
========================================================== */

window.PATProfile = {


  /* ACCOUNT */

  get:
    loadPATProfile,

  save:
    savePATProfile,

  updateAccount:
    updatePATAccount,

  setUsername:
    setPATUsername,

  setEmail:
    setPATEmail,

  setAvatar:
    setPATAvatar,

  isSignedIn:
    PATIsSignedIn,

  signOut:
    PATSignOut,


  /* SUBSCRIPTION */

  setPlan:
    setPATPlan,

  hasPlan:
    PATHasPlan,

  canAccessArchive:
    PATCanAccessArchive,


  /* GAME ACTIVITY */

  complete:
    completePATActivity,

  hasCompleted:
    hasPATCompleted,

  markPlayed:
    markPATGamePlayed,

  setProgress:
    setPATGameProgress,

  getProgress:
    getPATGameProgress,


  /* CONTENT */

  unlock:
    unlockPATContent,

  hasUnlock:
    hasPATUnlock,

  awardAchievement:
    awardPATAchievement,


  /* STATS */

  stats:
    getPATProfileStats,


  /* CONFIG */

  games:
    PAT_GAMES,

  streakSeries:
    PAT_STREAK_SERIES,


  /* DEV */

  reset:
    resetPATProfile

};



/* ==========================================================
   INITIALIZE
========================================================== */

const initializedPATProfile =
  loadPATProfile();



/* ==========================================================
   READY EVENT

   Any page may listen for:

   window.addEventListener(
     "pat-profile-ready",
     function(event) {
       console.log(event.detail);
     }
   );
========================================================== */

window.dispatchEvent(

  new CustomEvent(
    "pat-profile-ready",
    {

      detail:
        initializedPATProfile

    }
  )

);
