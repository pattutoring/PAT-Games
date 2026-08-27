/* ==========================================================
   PAT LEARNING LAB
   SHARED PROFILE SYSTEM

   VERSION 3

   ONE PROFILE ACROSS THE ENTIRE LEARNING LAB

   Supports:
   - Username
   - Email
   - Avatar
   - Free / Plus / Admin plan
   - Shared XP
   - Learning Lab Level
   - Weekly overall Learning Lab streak
   - Release-based puzzle streaks
   - Completion history
   - Duplicate reward protection
   - Game progress
   - Mastery counters
   - Unlocks
   - Achievements / badges
   - Archive access
   - Future subscription integration

   CURRENT STORAGE:
   localStorage

   FUTURE:
   Real authentication
   Cloud database
   Subscription backend
========================================================== */



/* ==========================================================
   STORAGE
========================================================== */

const PAT_PROFILE_STORAGE_KEY =
  "patLearningLabProfileV3";


const PAT_OLD_PROFILE_KEYS = [

  "patLearningLabProfileV2",

  "patLearningLabProfileV1"

];



/* ==========================================================
   LEVEL SYSTEM

   Level 1:
   0–99 XP

   Level 2:
   100–199 XP

   etc.

   Easy to rebalance later.
========================================================== */

const PAT_XP_PER_LEVEL =
  100;



/* ==========================================================
   LEARNING LAB WORLDS
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
     MEANING / NARRATIVE
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
   RELEASE-BASED STREAK SERIES

   These do NOT care whether someone solved the
   puzzle yesterday.

   Instead:

   #001 → #002 → #003 = streak 3

   Missing #003 and solving #004 resets the series
   streak to 1.

   Replaying older archive puzzles does not destroy
   the player's current streak.
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
      "KOAN~KAON SU(1)",

    icon:
      "✣",

    parentGame:
      "koan_kaon"

  },


  koan_two: {

    id:
      "koan_two",

    name:
      "KOAN~KAON SU(2)",

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
   CREATE EMPTY GAME STRUCTURES
========================================================== */

function createPATGameObject(
  defaultValueFactory
) {

  const object =
    {};


  Object.keys(
    PAT_GAMES
  )
  .forEach(
    function (
      gameId
    ) {

      object[
        gameId
      ] =
        defaultValueFactory();

    }
  );


  return object;

}



/* ==========================================================
   DEFAULT PROFILE
========================================================== */

function createDefaultPATProfile() {

  const completed =
    createPATGameObject(
      function () {

        return [];

      }
    );


  const progress =
    createPATGameObject(
      function () {

        return {};

      }
    );


  const mastery =
    createPATGameObject(
      function () {

        return {};

      }
    );


  const lastPlayed =
    createPATGameObject(
      function () {

        return null;

      }
    );


  const streaks =
    {};


  const streakLastPlayed =
    {};


  const streakLastActivity =
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


      streakLastActivity[
        streakId
      ] =
        null;

    }
  );


  return {

    version:
      3,


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
    ====================================================== */

    plan:
      "free",


    /* ======================================================
       PLAYER
    ====================================================== */

    xp:
      0,

    globalStreak:
      0,

    globalStreakLastWeek:
      null,

    lastActiveDate:
      null,


    /* ======================================================
       RELEASE STREAKS
    ====================================================== */

    streaks:
      streaks,

    streakLastPlayed:
      streakLastPlayed,

    streakLastActivity:
      streakLastActivity,


    /* ======================================================
       GAME ACTIVITY
    ====================================================== */

    lastPlayed:
      lastPlayed,

    completed:
      completed,

    completionHistory:
      [],

    progress:
      progress,

    mastery:
      mastery,


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
   INTERNAL STORAGE SAVE

   dispatchEvent = false is used during migration so simply
   READING a profile does not create an event loop.
========================================================== */

function persistPATProfile(
  profile,
  dispatchEvent =
    true
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


  if (
    dispatchEvent
  ) {

    window.dispatchEvent(

      new CustomEvent(
        "pat-profile-updated",
        {

          detail:
            profile

        }
      )

    );

  }


  return profile;

}



/* ==========================================================
   PUBLIC SAVE
========================================================== */

function savePATProfile(
  profile
) {

  return persistPATProfile(
    profile,
    true
  );

}



/* ==========================================================
   DATE HELPERS
========================================================== */

function getPATDateString(
  date =
    new Date()
) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() +
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
    year +
    "-" +
    month +
    "-" +
    day
  );

}



/* ==========================================================
   WEEK KEY

   Week begins Monday.

   Result is the local date of that week's Monday.

   Example:

   2026-08-27
   becomes
   2026-08-24
========================================================== */

function getPATWeekKey(
  date =
    new Date()
) {

  const copy =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );


  const day =
    copy.getDay();


  const distanceFromMonday =
    day ===
    0
    ?
      6
    :
      day -
      1;


  copy.setDate(
    copy.getDate() -
    distanceFromMonday
  );


  return getPATDateString(
    copy
  );

}



/* ==========================================================
   PREVIOUS WEEK
========================================================== */

function getPATPreviousWeekKey(
  weekKey
) {

  if (
    !weekKey
  ) {

    return null;

  }


  const parts =
    weekKey
      .split(
        "-"
      )
      .map(
        Number
      );


  if (
    parts.length !==
    3
  ) {

    return null;

  }


  const date =
    new Date(

      parts[0],

      parts[1] -
      1,

      parts[2]

    );


  date.setDate(
    date.getDate() -
    7
  );


  return getPATDateString(
    date
  );

}



/* ==========================================================
   ACTIVITY SEQUENCE NUMBER

   Extracts the final number from IDs such as:

   002
   clue-002
   buzzword-004
   su1-003
   mini-015

   Used for release streak continuity.
========================================================== */

function getPATActivitySequence(
  activityId
) {

  const text =
    String(
      activityId
    );


  const match =
    text.match(
      /(\d+)(?!.*\d)/
    );


  if (
    !match
  ) {

    return null;

  }


  return Number(
    match[1]
  );

}



/* ==========================================================
   FIND HIGHEST COMPLETION

   Used during migration to reconstruct release streak state.
========================================================== */

function findHighestPATCompletion(
  completions,
  filter
) {

  if (
    !Array.isArray(
      completions
    )
  ) {

    return null;

  }


  let best =
    null;


  let bestSequence =
    -1;


  completions.forEach(
    function (
      activityId
    ) {

      const text =
        String(
          activityId
        );


      if (
        filter
        &&
        !filter(
          text
        )
      ) {

        return;

      }


      const sequence =
        getPATActivitySequence(
          text
        );


      if (
        sequence !==
        null
        &&
        sequence >
        bestSequence
      ) {

        best =
          text;


        bestSequence =
          sequence;

      }

    }
  );


  return best;

}



/* ==========================================================
   NORMALIZE / MIGRATE PROFILE
========================================================== */

function migratePATProfile(
  oldProfile
) {

  const fresh =
    createDefaultPATProfile();


  if (
    !oldProfile
    ||
    typeof oldProfile !==
    "object"
  ) {

    return fresh;

  }



  /* ========================================================
     ACCOUNT
  ======================================================== */

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


  if (
    [
      "free",
      "plus",
      "admin"
    ]
    .includes(
      oldProfile.plan
    )
  ) {

    fresh.plan =
      oldProfile.plan;

  }



  /* ========================================================
     PLAYER STATS
  ======================================================== */

  fresh.xp =
    Math.max(
      0,
      Number(
        oldProfile.xp
        ||
        0
      )
    );


  fresh.globalStreak =
    Math.max(
      0,
      Number(
        oldProfile.globalStreak
        ||
        0
      )
    );


  fresh.globalStreakLastWeek =
    oldProfile.globalStreakLastWeek
    ||
    null;


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
    &&
    typeof oldProfile.completed ===
    "object"
  ) {

    Object.keys(
      PAT_GAMES
    )
    .forEach(
      function (
        gameId
      ) {

        const oldArray =
          oldProfile.completed[
            gameId
          ];


        if (
          Array.isArray(
            oldArray
          )
        ) {

          fresh.completed[
            gameId
          ] =
            [
              ...new Set(
                oldArray.map(
                  String
                )
              )
            ];

        }

      }
    );

  }



  /* ========================================================
     COMPLETION HISTORY
  ======================================================== */

  if (
    Array.isArray(
      oldProfile.completionHistory
    )
  ) {

    fresh.completionHistory =
      oldProfile.completionHistory
        .filter(
          function (
            entry
          ) {

            return (
              entry
              &&
              typeof entry ===
              "object"
            );

          }
        )
        .map(
          function (
            entry
          ) {

            return {

              ...entry

            };

          }
        );

  }



  /* ========================================================
     PROGRESS
  ======================================================== */

  if (
    oldProfile.progress
    &&
    typeof oldProfile.progress ===
    "object"
  ) {

    Object.keys(
      PAT_GAMES
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
          &&
          !Array.isArray(
            oldProfile.progress[
              gameId
            ]
          )
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
     MASTERY
  ======================================================== */

  if (
    oldProfile.mastery
    &&
    typeof oldProfile.mastery ===
    "object"
  ) {

    Object.keys(
      PAT_GAMES
    )
    .forEach(
      function (
        gameId
      ) {

        if (
          oldProfile.mastery[
            gameId
          ]
          &&
          typeof oldProfile.mastery[
            gameId
          ] ===
          "object"
        ) {

          fresh.mastery[
            gameId
          ] =
            {

              ...oldProfile.mastery[
                gameId
              ]

            };

        }

      }
    );

  }



  /* ========================================================
     LAST PLAYED
  ======================================================== */

  if (
    oldProfile.lastPlayed
    &&
    typeof oldProfile.lastPlayed ===
    "object"
  ) {

    Object.keys(
      PAT_GAMES
    )
    .forEach(
      function (
        gameId
      ) {

        fresh.lastPlayed[
          gameId
        ] =
          oldProfile.lastPlayed[
            gameId
          ]
          ||
          null;

      }
    );

  }



  /* ========================================================
     STREAK COUNTS
  ======================================================== */

  if (
    oldProfile.streaks
    &&
    typeof oldProfile.streaks ===
    "object"
  ) {

    Object.keys(
      PAT_STREAK_SERIES
    )
    .forEach(
      function (
        streakId
      ) {

        if (
          oldProfile.streaks[
            streakId
          ] !==
          undefined
        ) {

          fresh.streaks[
            streakId
          ] =
            Math.max(
              0,
              Number(
                oldProfile.streaks[
                  streakId
                ]
                ||
                0
              )
            );

        }

      }
    );



    /* OLD KOAN NAMES */

    if (
      oldProfile.streaks.koan_crossword !==
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
      oldProfile.streaks.koan_cryptic !==
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
     STREAK LAST PLAYED
  ======================================================== */

  if (
    oldProfile.streakLastPlayed
    &&
    typeof oldProfile.streakLastPlayed ===
    "object"
  ) {

    Object.keys(
      PAT_STREAK_SERIES
    )
    .forEach(
      function (
        streakId
      ) {

        fresh.streakLastPlayed[
          streakId
        ] =
          oldProfile.streakLastPlayed[
            streakId
          ]
          ||
          null;

      }
    );

  }



  /* ========================================================
     EXISTING RELEASE STREAK STATE
  ======================================================== */

  if (
    oldProfile.streakLastActivity
    &&
    typeof oldProfile.streakLastActivity ===
    "object"
  ) {

    Object.keys(
      PAT_STREAK_SERIES
    )
    .forEach(
      function (
        streakId
      ) {

        fresh.streakLastActivity[
          streakId
        ] =
          oldProfile.streakLastActivity[
            streakId
          ]
          ||
          null;

      }
    );

  }



  /* ========================================================
     RECONSTRUCT RELEASE STREAK STATE WHEN MIGRATING V2
  ======================================================== */

  if (
    !fresh.streakLastActivity.contronym
  ) {

    fresh.streakLastActivity.contronym =
      findHighestPATCompletion(
        fresh.completed.contronym
      );

  }


  if (
    !fresh.streakLastActivity.cluecards
  ) {

    fresh.streakLastActivity.cluecards =
      findHighestPATCompletion(
        fresh.completed.cluecards
      );

  }


  if (
    !fresh.streakLastActivity.buzzword
  ) {

    fresh.streakLastActivity.buzzword =
      findHighestPATCompletion(

        fresh.completed.molecular_bee,

        function (
          activity
        ) {

          return /buzzword/i.test(
            activity
          );

        }

      );

  }


  if (
    !fresh.streakLastActivity.koan_one
  ) {

    fresh.streakLastActivity.koan_one =
      findHighestPATCompletion(

        fresh.completed.koan_kaon,

        function (
          activity
        ) {

          return (
            /su1/i.test(
              activity
            )
            ||
            /koan[_-]?one/i.test(
              activity
            )
          );

        }

      );

  }


  if (
    !fresh.streakLastActivity.koan_two
  ) {

    fresh.streakLastActivity.koan_two =
      findHighestPATCompletion(

        fresh.completed.koan_kaon,

        function (
          activity
        ) {

          return (
            /su2/i.test(
              activity
            )
            ||
            /mini/i.test(
              activity
            )
            ||
            /koan[_-]?two/i.test(
              activity
            )
          );

        }

      );

  }



  /* ========================================================
     UNLOCKS
  ======================================================== */

  if (
    Array.isArray(
      oldProfile.unlocks
    )
  ) {

    fresh.unlocks =
      [
        ...new Set(
          oldProfile.unlocks.map(
            String
          )
        )
      ];

  }



  /* ========================================================
     ACHIEVEMENTS
  ======================================================== */

  if (
    Array.isArray(
      oldProfile.achievements
    )
  ) {

    fresh.achievements =
      [
        ...new Set(
          oldProfile.achievements.map(
            String
          )
        )
      ];

  }


  return fresh;

}



/* ==========================================================
   FIND OLD PROFILE
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
      !saved
    ) {

      continue;

    }


    try {

      return {

        key:
          key,

        profile:
          JSON.parse(
            saved
          )

      };

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


  return null;

}



/* ==========================================================
   LOAD PROFILE

   IMPORTANT:

   Reading the profile does NOT dispatch
   pat-profile-updated.

   This prevents render → get → update → render loops.
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


      /*
        Already V3.
        Normalize in memory to make future additions safe.
      */

      if (
        parsed.version ===
        3
      ) {

        return migratePATProfile(
          parsed
        );

      }


      const migrated =
        migratePATProfile(
          parsed
        );


      persistPATProfile(
        migrated,
        false
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



  const old =
    findOldPATProfile();


  if (
    old
  ) {

    const migrated =
      migratePATProfile(
        old.profile
      );


    persistPATProfile(
      migrated,
      false
    );


    return migrated;

  }



  const fresh =
    createDefaultPATProfile();


  persistPATProfile(
    fresh,
    false
  );


  return fresh;

}



/* ==========================================================
   WEEKLY GLOBAL LEARNING LAB STREAK

   Advances ONLY on a NEW meaningful completion.

   Merely opening a game does not count.

   One or more completions within the same week
   count as one streak week.
========================================================== */

function updatePATGlobalStreak(
  profile
) {

  const thisWeek =
    getPATWeekKey();


  const lastWeek =
    profile.globalStreakLastWeek;


  if (
    lastWeek ===
    thisWeek
  ) {

    return false;

  }


  if (
    lastWeek
    &&
    getPATPreviousWeekKey(
      thisWeek
    ) ===
    lastWeek
  ) {

    profile.globalStreak =
      Math.max(
        0,
        Number(
          profile.globalStreak
          ||
          0
        )
      )
      +
      1;

  }

  else {

    profile.globalStreak =
      1;

  }


  profile.globalStreakLastWeek =
    thisWeek;


  profile.lastActiveDate =
    getPATDateString();


  return true;

}



/* ==========================================================
   RELEASE-BASED SERIES STREAK

   Examples:

   clue-001 → clue-002
   = streak increases

   clue-002 → clue-004
   = skipped #003, streak resets to 1

   clue-004 → clue-001
   = archive replay, current streak unchanged
========================================================== */

function updatePATSeriesStreak(
  profile,
  streakKey,
  activityId
) {

  if (
    !PAT_STREAK_SERIES[
      streakKey
    ]
  ) {

    return false;

  }


  const currentActivity =
    String(
      activityId
    );


  const previousActivity =
    profile.streakLastActivity[
      streakKey
    ];


  /*
    Same release already handled.
  */

  if (
    previousActivity ===
    currentActivity
  ) {

    return false;

  }


  const currentSequence =
    getPATActivitySequence(
      currentActivity
    );


  const previousSequence =
    previousActivity
    ?
      getPATActivitySequence(
        previousActivity
      )
    :
      null;



  /* ========================================================
     FIRST RELEASE RECORDED
  ======================================================== */

  if (
    previousActivity ===
    null
  ) {

    if (
      profile.streaks[
        streakKey
      ] <=
      0
    ) {

      profile.streaks[
        streakKey
      ] =
        1;

    }


    profile.streakLastActivity[
      streakKey
    ] =
      currentActivity;


    profile.streakLastPlayed[
      streakKey
    ] =
      getPATDateString();


    return true;

  }



  /* ========================================================
     NUMBERED SERIES
  ======================================================== */

  if (
    currentSequence !==
    null
    &&
    previousSequence !==
    null
  ) {


    /*
      NEXT RELEASE
    */

    if (
      currentSequence ===
      previousSequence +
      1
    ) {

      profile.streaks[
        streakKey
      ] =
        Math.max(
          0,
          Number(
            profile.streaks[
              streakKey
            ]
            ||
            0
          )
        )
        +
        1;


      profile.streakLastActivity[
        streakKey
      ] =
        currentActivity;


      profile.streakLastPlayed[
        streakKey
      ] =
        getPATDateString();


      return true;

    }



    /*
      SKIPPED ONE OR MORE RELEASES
    */

    if (
      currentSequence >
      previousSequence +
      1
    ) {

      profile.streaks[
        streakKey
      ] =
        1;


      profile.streakLastActivity[
        streakKey
      ] =
        currentActivity;


      profile.streakLastPlayed[
        streakKey
      ] =
        getPATDateString();


      return true;

    }



    /*
      OLDER ARCHIVE PUZZLE.

      Do not damage current streak.
    */

    if (
      currentSequence <
      previousSequence
    ) {

      return false;

    }

  }



  /* ========================================================
     FALLBACK FOR NON-NUMBERED SERIES
  ======================================================== */

  profile.streaks[
    streakKey
  ] =
    Math.max(
      1,
      Number(
        profile.streaks[
          streakKey
        ]
        ||
        0
      )
      +
      1
    );


  profile.streakLastActivity[
    streakKey
  ] =
    currentActivity;


  profile.streakLastPlayed[
    streakKey
  ] =
    getPATDateString();


  return true;

}



/* ==========================================================
   MARK GAME PLAYED

   Records activity.

   DOES NOT:
   - award XP
   - advance global streak
   - advance dedicated streak

   This keeps opening a page from counting as learning.
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


  profile.lastPlayed[
    gameId
  ] =
    getPATDateString();


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   APPLY MASTERY INCREMENTS

   Example:

   mastery: {
     graphsBuilt: 1,
     transformationsMapped: 2
   }
========================================================== */

function applyPATMasteryChanges(
  profile,
  gameId,
  masteryChanges
) {

  if (
    !masteryChanges
    ||
    typeof masteryChanges !==
    "object"
  ) {

    return;

  }


  if (
    !profile.mastery[
      gameId
    ]
  ) {

    profile.mastery[
      gameId
    ] =
      {};

  }


  Object.keys(
    masteryChanges
  )
  .forEach(
    function (
      key
    ) {

      const amount =
        Number(
          masteryChanges[
            key
          ]
          ||
          0
        );


      const current =
        Number(
          profile.mastery[
            gameId
          ][
            key
          ]
          ||
          0
        );


      profile.mastery[
        gameId
      ][
        key
      ] =
        current +
        amount;

    }
  );

}



/* ==========================================================
   COMPLETE ACTIVITY

   The central progression function.

   A UNIQUE completion may:
   - award XP
   - advance weekly Lab streak
   - advance release streak
   - increment mastery
   - award achievements
   - write history

   Replaying the SAME activity:
   - awards no XP
   - advances no streak
   - adds no duplicate history
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


  const completionId =
    String(
      activityId
    );


  profile.lastPlayed[
    gameId
  ] =
    getPATDateString();


  if (
    !profile.completed[
      gameId
    ]
  ) {

    profile.completed[
      gameId
    ] =
      [];

  }


  const alreadyCompleted =
    profile.completed[
      gameId
    ]
    .includes(
      completionId
    );


  let xpEarned =
    0;


  let globalStreakAdvanced =
    false;


  let streakAdvanced =
    false;


  let streakKey =
    options.streakKey
    ||
    null;



  /* ========================================================
     DEFAULT GAME STREAK
  ======================================================== */

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



  /* ========================================================
     UNIQUE COMPLETION ONLY
  ======================================================== */

  if (
    !alreadyCompleted
  ) {

    profile.completed[
      gameId
    ]
    .push(
      completionId
    );



    /* XP */

    if (
      options.xp ===
      0
    ) {

      xpEarned =
        0;

    }

    else {

      xpEarned =
        Number(
          options.xp
        );


      if (
        !Number.isFinite(
          xpEarned
        )
      ) {

        xpEarned =
          Number(
            game.xpPerCompletion
            ||
            0
          );

      }

    }


    xpEarned =
      Math.max(
        0,
        xpEarned
      );


    profile.xp +=
      xpEarned;



    /* WEEKLY LAB STREAK */

    globalStreakAdvanced =
      updatePATGlobalStreak(
        profile
      );



    /* RELEASE STREAK */

    if (
      streakKey
    ) {

      streakAdvanced =
        updatePATSeriesStreak(

          profile,

          streakKey,

          completionId

        );

    }



    /* MASTERY */

    if (
      options.mastery
    ) {

      applyPATMasteryChanges(

        profile,

        gameId,

        options.mastery

      );

    }



    /* ACHIEVEMENTS */

    if (
      Array.isArray(
        options.achievements
      )
    ) {

      options.achievements
        .forEach(
          function (
            achievement
          ) {

            const id =
              String(
                achievement
              );


            if (
              !profile.achievements
                .includes(
                  id
                )
            ) {

              profile.achievements
                .push(
                  id
                );

            }

          }
        );

    }



    /* HISTORY */

    profile.completionHistory
      .push(
        {

          gameId:
            gameId,

          gameName:
            game.name,

          activityId:
            completionId,

          xpEarned:
            xpEarned,

          streakKey:
            streakKey,

          completedAt:
            new Date()
              .toISOString(),

          date:
            getPATDateString(),

          weekKey:
            getPATWeekKey()

        }
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
      streakAdvanced,

    globalStreakAdvanced:
      globalStreakAdvanced

  };

}



/* ==========================================================
   SET GAME PROGRESS

   Flexible save storage for game-specific state.
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

    console.warn(
      "Unknown PAT game:",
      gameId
    );


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

    return {

      ...profile.progress[
        gameId
      ]

    };

  }


  return profile.progress[
    gameId
  ][
    key
  ];

}



/* ==========================================================
   INCREMENT MASTERY

   Example:

   PATProfile.incrementMastery(
     "meaning_graphs",
     "graphsBuilt",
     1
   );
========================================================== */

function incrementPATMastery(
  gameId,
  key,
  amount =
    1
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
    !profile.mastery[
      gameId
    ]
  ) {

    profile.mastery[
      gameId
    ] =
      {};

  }


  const current =
    Number(
      profile.mastery[
        gameId
      ][
        key
      ]
      ||
      0
    );


  profile.mastery[
    gameId
  ][
    key
  ] =
    current +
    Number(
      amount
      ||
      0
    );


  savePATProfile(
    profile
  );


  return profile.mastery[
    gameId
  ][
    key
  ];

}



/* ==========================================================
   SET MASTERY
========================================================== */

function setPATMastery(
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
    !profile.mastery[
      gameId
    ]
  ) {

    profile.mastery[
      gameId
    ] =
      {};

  }


  profile.mastery[
    gameId
  ][
    key
  ] =
    value;


  savePATProfile(
    profile
  );


  return value;

}



/* ==========================================================
   GET MASTERY
========================================================== */

function getPATMastery(
  gameId,
  key
) {

  const profile =
    loadPATProfile();


  const gameMastery =
    profile.mastery[
      gameId
    ]
    ||
    {};


  if (
    key ===
    undefined
  ) {

    return {

      ...gameMastery

    };

  }


  return gameMastery[
    key
  ];

}



/* ==========================================================
   UNLOCK CONTENT
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
    !profile.unlocks
      .includes(
        id
      )
  ) {

    profile.unlocks
      .push(
        id
      );


    savePATProfile(
      profile
    );

  }


  return profile;

}



/* ==========================================================
   CHECK UNLOCK
========================================================== */

function hasPATUnlock(
  unlockId
) {

  const profile =
    loadPATProfile();


  return profile.unlocks
    .includes(
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
    profile.achievements
      .includes(
        id
      )
  ) {

    return false;

  }


  profile.achievements
    .push(
      id
    );


  savePATProfile(
    profile
  );


  return true;

}



/* ==========================================================
   CHECK ACHIEVEMENT
========================================================== */

function hasPATAchievement(
  achievementId
) {

  const profile =
    loadPATProfile();


  return profile.achievements
    .includes(
      String(
        achievementId
      )
    );

}



/* ==========================================================
   UPDATE ACCOUNT
========================================================== */

function updatePATAccount(
  data =
    {}
) {

  const profile =
    loadPATProfile();



  /* USERNAME */

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
      .replace(
        /^@+/,
        ""
      )
      .slice(
        0,
        30
      );


    profile.username =
      username
      ||
      "Guest";

  }



  /* EMAIL */

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



  /* AVATAR */

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



  /* PROFILE CREATED */

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

   PROTOTYPE ONLY.

   Real paid access must eventually be verified
   by a secure backend.
========================================================== */

function setPATPlan(
  plan
) {

  const allowed = [

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
   PLAN CHECK
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
   LEVEL CALCULATION
========================================================== */

function getPATLevelData(
  xp
) {

  const safeXP =
    Math.max(
      0,
      Number(
        xp
        ||
        0
      )
    );


  const level =
    Math.floor(
      safeXP /
      PAT_XP_PER_LEVEL
    )
    +
    1;


  const currentLevelStart =
    (
      level -
      1
    )
    *
    PAT_XP_PER_LEVEL;


  const nextLevelXP =
    level *
    PAT_XP_PER_LEVEL;


  const xpIntoLevel =
    safeXP -
    currentLevelStart;


  const xpNeeded =
    nextLevelXP -
    safeXP;


  const percent =
    Math.min(
      100,
      Math.max(
        0,
        (
          xpIntoLevel /
          PAT_XP_PER_LEVEL
        )
        *
        100
      )
    );


  return {

    level:
      level,

    xp:
      safeXP,

    xpIntoLevel:
      xpIntoLevel,

    xpPerLevel:
      PAT_XP_PER_LEVEL,

    nextLevelXP:
      nextLevelXP,

    xpNeeded:
      xpNeeded,

    levelPercent:
      percent

  };

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
        Array.isArray(
          profile.completed[
            gameId
          ]
        )
        ?
          profile.completed[
            gameId
          ].length
        :
          0;


      completedByGame[
        gameId
      ] =
        count;


      totalCompleted +=
        count;

    }
  );


  const levelData =
    getPATLevelData(
      profile.xp
    );


  const recentCompletions =
    profile.completionHistory
      .slice()
      .sort(
        function (
          a,
          b
        ) {

          return new Date(
            b.completedAt
          )
          -
          new Date(
            a.completedAt
          );

        }
      )
      .slice(
        0,
        10
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


    /* XP / LEVEL */

    xp:
      profile.xp,

    level:
      levelData.level,

    xpIntoLevel:
      levelData.xpIntoLevel,

    xpPerLevel:
      levelData.xpPerLevel,

    xpNeeded:
      levelData.xpNeeded,

    nextLevelXP:
      levelData.nextLevelXP,

    levelPercent:
      levelData.levelPercent,


    /* STREAKS */

    globalStreak:
      profile.globalStreak,

    globalStreakLastWeek:
      profile.globalStreakLastWeek,

    streaks:
      {

        ...profile.streaks

      },

    streakLastActivity:
      {

        ...profile.streakLastActivity

      },


    /* COMPLETIONS */

    totalCompleted:
      totalCompleted,

    completedByGame:
      completedByGame,

    recentCompletions:
      recentCompletions,


    /* MASTERY */

    mastery:
      JSON.parse(
        JSON.stringify(
          profile.mastery
        )
      ),


    /* CONTENT */

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
   COMPLETION HISTORY
========================================================== */

function getPATCompletionHistory(
  gameId
) {

  const profile =
    loadPATProfile();


  if (
    !gameId
  ) {

    return profile.completionHistory
      .slice();

  }


  return profile.completionHistory
    .filter(
      function (
        entry
      ) {

        return entry.gameId ===
          gameId;

      }
    );

}



/* ==========================================================
   SIGNED IN

   LOCAL PROTOTYPE:

   username + email = local profile created.

   Real authentication can replace this later
   without changing game APIs.
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

   Current prototype keeps all progress on device
   but removes local identity.

   Cloud behavior can replace this later.
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
   RESET

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

   Existing pages remain compatible.

   <script src="profile.js"></script>
========================================================== */

window.PATProfile = {


  /* ========================================================
     ACCOUNT
  ======================================================== */

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


  /* ========================================================
     SUBSCRIPTION
  ======================================================== */

  setPlan:
    setPATPlan,

  hasPlan:
    PATHasPlan,

  canAccessArchive:
    PATCanAccessArchive,


  /* ========================================================
     GAME ACTIVITY
  ======================================================== */

  complete:
    completePATActivity,

  hasCompleted:
    hasPATCompleted,

  history:
    getPATCompletionHistory,

  markPlayed:
    markPATGamePlayed,

  setProgress:
    setPATGameProgress,

  getProgress:
    getPATGameProgress,


  /* ========================================================
     MASTERY
  ======================================================== */

  incrementMastery:
    incrementPATMastery,

  setMastery:
    setPATMastery,

  getMastery:
    getPATMastery,


  /* ========================================================
     CONTENT
  ======================================================== */

  unlock:
    unlockPATContent,

  hasUnlock:
    hasPATUnlock,

  awardAchievement:
    awardPATAchievement,

  hasAchievement:
    hasPATAchievement,


  /* ========================================================
     STATS
  ======================================================== */

  stats:
    getPATProfileStats,

  getLevel:
    function () {

      const profile =
        loadPATProfile();


      return getPATLevelData(
        profile.xp
      );

    },


  /* ========================================================
     DATE HELPERS
  ======================================================== */

  date:
    getPATDateString,

  week:
    getPATWeekKey,


  /* ========================================================
     CONFIG
  ======================================================== */

  games:
    PAT_GAMES,

  streakSeries:
    PAT_STREAK_SERIES,

  xpPerLevel:
    PAT_XP_PER_LEVEL,


  /* ========================================================
     DEV
  ======================================================== */

  reset:
    resetPATProfile

};



/* ==========================================================
   INITIALIZE

   This migrates V1 / V2 silently.

   It DOES NOT fire pat-profile-updated merely
   because a page requested the profile.
========================================================== */

const initializedPATProfile =
  loadPATProfile();



/* ==========================================================
   READY EVENT
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
