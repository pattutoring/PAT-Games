/* ==========================================================
   PAT LEARNING LAB
   SHARED PROFILE SYSTEM

   VERSION 5

   ONE PROFILE ACROSS THE ENTIRE LEARNING LAB

   SUPPORTS:
   - Supabase cloud accounts
   - Cross-device cloud progress
   - Local fallback / instant gameplay
   - Username
   - Email
   - Avatar
   - Free / Plus / Admin
   - XP
   - Levels
   - Daily Learning Lab streak
   - Weekly completion streak
   - Release-based puzzle streaks
   - Completion history
   - Game progress
   - Molecular Farm progress
   - Mastery
   - Unlocks
   - Achievements
   - Archive access
   - V1 / V2 / V3 / V4 migration

   ARCHITECTURE:

   GAME
     ↓
   PATProfile
     ↓
   localStorage
     ↕
   Supabase

   IMPORTANT:

   Gameplay remains immediate because localStorage
   saves synchronously.

   When a Supabase user is signed in,
   changes are also synchronized to the cloud.
========================================================== */



/* ==========================================================
   STORAGE
========================================================== */

const PAT_PROFILE_STORAGE_KEY =
  "patLearningLabProfileV5";


const PAT_OLD_PROFILE_KEYS = [

  "patLearningLabProfileV4",

  "patLearningLabProfileV3",

  "patLearningLabProfileV2",

  "patLearningLabProfileV1"

];



/* ==========================================================
   CLOUD TABLE

   SUPABASE TABLE EXPECTED:

   pat_profiles

   COLUMNS:

   user_id uuid primary key
   profile jsonb
   updated_at timestamptz
========================================================== */

const PAT_CLOUD_PROFILE_TABLE =
  "pat_profiles";



/* ==========================================================
   LEVEL SYSTEM
========================================================== */

const PAT_XP_PER_LEVEL =
  100;



/* ==========================================================
   LEARNING LAB WORLDS
========================================================== */

const PAT_GAMES = {


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
   INTERNAL CLOUD STATE
========================================================== */

let PATCloudSyncTimer =
  null;


let PATCloudSyncRunning =
  false;


let PATCloudBootstrapRunning =
  false;


let PATCloudApplyingRemote =
  false;



/* ==========================================================
   HELPERS
========================================================== */

function clonePATValue(
  value
) {

  return JSON.parse(
    JSON.stringify(
      value
    )
  );

}



function createPATGameObject(
  factory
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
        factory();

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
      5,


    /* ACCOUNT */

    username:
      "Guest",

    email:
      "",

    avatar:
      "🧪",

    profileCreated:
      false,


    /* CLOUD */

    userId:
      null,

    authProvider:
      "local",

    cloudEnabled:
      false,

    cloudLastSyncedAt:
      null,

    cloudUpdatedAt:
      null,


    /* SUBSCRIPTION */

    plan:
      "free",


    /* XP */

    xp:
      0,


    /* DAILY STREAK */

    dailyStreak:
      0,

    dailyStreakLastDate:
      null,


    /* WEEKLY STREAK */

    globalStreak:
      0,

    globalStreakLastWeek:
      null,


    /* ACTIVITY */

    lastActiveDate:
      null,

    lastActivityAt:
      null,


    /* RELEASE STREAKS */

    streaks:
      streaks,

    streakLastPlayed:
      streakLastPlayed,

    streakLastActivity:
      streakLastActivity,


    /* GAME DATA */

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


    /* CONTENT */

    unlocks:
      [],

    achievements:
      [],


    /* DATES */

    createdAt:
      new Date()
        .toISOString(),

    updatedAt:
      new Date()
        .toISOString()

  };

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



function parsePATDateString(
  value
) {

  if (
    !value
  ) {

    return null;

  }


  const parts =
    String(
      value
    )
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


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return date;

}



function getPATPreviousDateString(
  value =
    getPATDateString()
) {

  const date =
    parsePATDateString(
      value
    );


  if (
    !date
  ) {

    return null;

  }


  date.setDate(
    date.getDate() -
    1
  );


  return getPATDateString(
    date
  );

}



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


  const distance =
    day ===
    0
    ?
      6
    :
      day -
      1;


  copy.setDate(
    copy.getDate() -
    distance
  );


  return getPATDateString(
    copy
  );

}



function getPATPreviousWeekKey(
  weekKey
) {

  const date =
    parsePATDateString(
      weekKey
    );


  if (
    !date
  ) {

    return null;

  }


  date.setDate(
    date.getDate() -
    7
  );


  return getPATDateString(
    date
  );

}



/* ==========================================================
   ACTIVITY SEQUENCE
========================================================== */

function getPATActivitySequence(
  activityId
) {

  const match =
    String(
      activityId
    )
    .match(
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


  let highest =
    -1;


  completions.forEach(
    function (
      activity
    ) {

      const text =
        String(
          activity
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
        highest
      ) {

        best =
          text;


        highest =
          sequence;

      }

    }
  );


  return best;

}



/* ==========================================================
   MIGRATION / NORMALIZATION
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



  /* ACCOUNT */

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



  /* CLOUD */

  fresh.userId =
    oldProfile.userId
    ||
    null;


  fresh.authProvider =
    oldProfile.authProvider
    ||
    (
      fresh.userId
      ?
        "supabase"
      :
        "local"
    );


  fresh.cloudEnabled =
    Boolean(
      oldProfile.cloudEnabled
    );


  fresh.cloudLastSyncedAt =
    oldProfile.cloudLastSyncedAt
    ||
    null;


  fresh.cloudUpdatedAt =
    oldProfile.cloudUpdatedAt
    ||
    null;



  /* PLAN */

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



  /* STATS */

  fresh.xp =
    Math.max(
      0,
      Number(
        oldProfile.xp
        ||
        0
      )
    );


  fresh.dailyStreak =
    Math.max(
      0,
      Number(
        oldProfile.dailyStreak
        ||
        0
      )
    );


  fresh.dailyStreakLastDate =
    oldProfile.dailyStreakLastDate
    ||
    oldProfile.lastActiveDate
    ||
    null;


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


  fresh.lastActivityAt =
    oldProfile.lastActivityAt
    ||
    null;


  fresh.createdAt =
    oldProfile.createdAt
    ||
    fresh.createdAt;


  fresh.updatedAt =
    oldProfile.updatedAt
    ||
    fresh.updatedAt;



  /* GAME ARRAYS / OBJECTS */

  Object.keys(
    PAT_GAMES
  )
  .forEach(
    function (
      gameId
    ) {


      if (
        oldProfile.completed
        &&
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
            ...new Set(
              oldProfile.completed[
                gameId
              ]
              .map(
                String
              )
            )
          ];

      }


      if (
        oldProfile.progress
        &&
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
          clonePATValue(
            oldProfile.progress[
              gameId
            ]
          );

      }


      if (
        oldProfile.mastery
        &&
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
          clonePATValue(
            oldProfile.mastery[
              gameId
            ]
          );

      }


      if (
        oldProfile.lastPlayed
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

    }
  );



  /* HISTORY */

  if (
    Array.isArray(
      oldProfile.completionHistory
    )
  ) {

    fresh.completionHistory =
      oldProfile.completionHistory
        .filter(
          function (
            item
          ) {

            return (
              item
              &&
              typeof item ===
              "object"
            );

          }
        )
        .map(
          function (
            item
          ) {

            return clonePATValue(
              item
            );

          }
        );

  }



  /* RELEASE STREAKS */

  Object.keys(
    PAT_STREAK_SERIES
  )
  .forEach(
    function (
      streakId
    ) {

      if (
        oldProfile.streaks
        &&
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


      if (
        oldProfile.streakLastPlayed
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


      if (
        oldProfile.streakLastActivity
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

    }
  );



  /* OLD KOAN STREAK NAMES */

  if (
    oldProfile.streaks
  ) {

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



  /* RECONSTRUCT RELEASE POINTERS */

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



  /* UNLOCKS */

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



  /* ACHIEVEMENTS */

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


  fresh.version =
    5;


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


  return null;

}



/* ==========================================================
   LOAD LOCAL PROFILE
========================================================== */

function loadPATProfile() {

  const saved =
    localStorage.getItem(
      PAT_PROFILE_STORAGE_KEY
    );


  if (
    saved
  ) {

    try {

      return migratePATProfile(
        JSON.parse(
          saved
        )
      );

    }

    catch (
      error
    ) {

      console.warn(
        "Could not read PAT V5 profile.",
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
        old
      );


    persistPATProfile(
      migrated,
      false,
      false
    );


    return migrated;

  }


  const fresh =
    createDefaultPATProfile();


  persistPATProfile(
    fresh,
    false,
    false
  );


  return fresh;

}



/* ==========================================================
   LOCAL SAVE
========================================================== */

function persistPATProfile(
  profile,
  dispatchEvent =
    true,
  queueCloud =
    true
) {

  profile.version =
    5;


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
            clonePATValue(
              profile
            )

        }
      )

    );

  }


  if (
    queueCloud
    &&
    !PATCloudApplyingRemote
  ) {

    schedulePATCloudSync();

  }


  return profile;

}



function savePATProfile(
  profile
) {

  return persistPATProfile(
    profile,
    true,
    true
  );

}



/* ==========================================================
   SUPABASE AVAILABLE?
========================================================== */

function PATCloudAvailable() {

  return Boolean(

    window.PATCloud

    &&
    window.PATCloud.client

    &&
    typeof window.PATCloud.getUser ===
    "function"

  );

}



/* ==========================================================
   GET AUTH USER
========================================================== */

async function getPATAuthenticatedUser() {

  if (
    !PATCloudAvailable()
  ) {

    return null;

  }


  try {

    return await window
      .PATCloud
      .getUser();

  }

  catch (
    error
  ) {

    console.warn(
      "PAT cloud user lookup failed.",
      error
    );


    return null;

  }

}



/* ==========================================================
   CLOUD ROW
========================================================== */

async function getPATCloudProfileRow(
  userId
) {

  if (
    !PATCloudAvailable()
    ||
    !userId
  ) {

    return null;

  }


  const {
    data,
    error
  } =
    await window
      .PATCloud
      .client
      .from(
        PAT_CLOUD_PROFILE_TABLE
      )
      .select(
        "user_id, profile, updated_at"
      )
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();


  if (
    error
  ) {

    console.error(
      "Could not read cloud profile:",
      error
    );


    return null;

  }


  return data || null;

}



/* ==========================================================
   WRITE CLOUD PROFILE
========================================================== */

async function writePATCloudProfile(
  profile,
  user
) {

  if (
    !PATCloudAvailable()
    ||
    !user
    ||
    !user.id
  ) {

    return false;

  }


  const cloudProfile =
    migratePATProfile(
      profile
    );


  cloudProfile.userId =
    user.id;


  cloudProfile.email =
    user.email
    ||
    cloudProfile.email;


  cloudProfile.authProvider =
    "supabase";


  cloudProfile.cloudEnabled =
    true;


  cloudProfile.cloudLastSyncedAt =
    new Date()
      .toISOString();


  cloudProfile.cloudUpdatedAt =
    cloudProfile.cloudLastSyncedAt;



  const {
    error
  } =
    await window
      .PATCloud
      .client
      .from(
        PAT_CLOUD_PROFILE_TABLE
      )
      .upsert(
        {

          user_id:
            user.id,

          profile:
            cloudProfile,

          updated_at:
            cloudProfile.cloudUpdatedAt

        },
        {

          onConflict:
            "user_id"

        }
      );


  if (
    error
  ) {

    console.error(
      "PAT cloud save failed:",
      error
    );


    return false;

  }



  PATCloudApplyingRemote =
    true;


  try {

    persistPATProfile(
      cloudProfile,
      true,
      false
    );

  }

  finally {

    PATCloudApplyingRemote =
      false;

  }


  window.dispatchEvent(

    new CustomEvent(
      "pat-cloud-synced",
      {

        detail: {

          direction:
            "upload",

          userId:
            user.id

        }

      }
    )

  );


  return true;

}



/* ==========================================================
   CLOUD SYNC QUEUE
========================================================== */

function schedulePATCloudSync() {

  if (
    PATCloudApplyingRemote
  ) {

    return;

  }


  clearTimeout(
    PATCloudSyncTimer
  );


  PATCloudSyncTimer =
    setTimeout(
      function () {

        syncPATProfileToCloud();

      },

      350
    );

}



/* ==========================================================
   SYNC LOCAL → CLOUD
========================================================== */

async function syncPATProfileToCloud() {

  if (
    PATCloudSyncRunning
    ||
    !PATCloudAvailable()
  ) {

    return false;

  }


  PATCloudSyncRunning =
    true;


  try {

    const user =
      await getPATAuthenticatedUser();


    if (
      !user
    ) {

      return false;

    }


    const profile =
      loadPATProfile();


    profile.userId =
      user.id;


    profile.email =
      user.email
      ||
      profile.email;


    profile.authProvider =
      "supabase";


    profile.cloudEnabled =
      true;


    return await writePATCloudProfile(
      profile,
      user
    );

  }

  catch (
    error
  ) {

    console.error(
      "PAT cloud sync failed:",
      error
    );


    return false;

  }

  finally {

    PATCloudSyncRunning =
      false;

  }

}



/* ==========================================================
   APPLY CLOUD PROFILE
========================================================== */

function applyPATCloudProfile(
  cloudProfile,
  user
) {

  const normalized =
    migratePATProfile(
      cloudProfile
    );


  normalized.userId =
    user.id;


  normalized.email =
    user.email
    ||
    normalized.email;


  normalized.authProvider =
    "supabase";


  normalized.cloudEnabled =
    true;


  normalized.profileCreated =
    Boolean(

      normalized.username

      &&
      normalized.username !==
      "Guest"

      &&
      normalized.email

    );


  normalized.cloudLastSyncedAt =
    new Date()
      .toISOString();


  PATCloudApplyingRemote =
    true;


  try {

    persistPATProfile(
      normalized,
      true,
      false
    );

  }

  finally {

    PATCloudApplyingRemote =
      false;

  }


  window.dispatchEvent(

    new CustomEvent(
      "pat-cloud-synced",
      {

        detail: {

          direction:
            "download",

          userId:
            user.id

        }

      }
    )

  );


  return normalized;

}



/* ==========================================================
   CLOUD BOOTSTRAP

   RULES:

   1. New device + cloud row exists:
      download cloud profile.

   2. Existing local profile belonging to SAME account
      and local is newer:
      upload local.

   3. Cloud account has no row:
      upload current local progress into account.

   This lets a player create an account AFTER playing
   locally without losing their existing progress.
========================================================== */

async function bootstrapPATCloudProfile() {

  if (
    PATCloudBootstrapRunning
    ||
    !PATCloudAvailable()
  ) {

    return null;

  }


  PATCloudBootstrapRunning =
    true;


  try {

    const user =
      await getPATAuthenticatedUser();


    if (
      !user
    ) {

      return null;

    }


    const localProfile =
      loadPATProfile();


    const cloudRow =
      await getPATCloudProfileRow(
        user.id
      );



    /* ======================================================
       NO CLOUD SAVE YET

       Attach current local progress to this account.
    ====================================================== */

    if (
      !cloudRow
      ||
      !cloudRow.profile
    ) {

      localProfile.userId =
        user.id;


      localProfile.email =
        user.email
        ||
        localProfile.email;


      localProfile.username =
        localProfile.username !==
        "Guest"
        ?
          localProfile.username
        :
          (
            user.user_metadata
            &&
            user.user_metadata.username
            ?
              user.user_metadata.username
            :
              "Explorer"
          );


      localProfile.authProvider =
        "supabase";


      localProfile.cloudEnabled =
        true;


      localProfile.profileCreated =
        true;


      persistPATProfile(
        localProfile,
        true,
        false
      );


      await writePATCloudProfile(
        localProfile,
        user
      );


      return localProfile;

    }



    const cloudProfile =
      migratePATProfile(
        cloudRow.profile
      );


    const localBelongsToUser =
      localProfile.userId ===
      user.id;


    const localUpdated =
      Date.parse(
        localProfile.updatedAt
        ||
        ""
      )
      ||
      0;


    const cloudUpdated =
      Date.parse(
        cloudRow.updated_at
        ||
        cloudProfile.cloudUpdatedAt
        ||
        cloudProfile.updatedAt
        ||
        ""
      )
      ||
      0;



    /* ======================================================
       SAME ACCOUNT + LOCAL NEWER
    ====================================================== */

    if (
      localBelongsToUser

      &&
      localUpdated >
      cloudUpdated
    ) {

      localProfile.userId =
        user.id;


      localProfile.email =
        user.email
        ||
        localProfile.email;


      localProfile.authProvider =
        "supabase";


      localProfile.cloudEnabled =
        true;


      await writePATCloudProfile(
        localProfile,
        user
      );


      return localProfile;

    }



    /* ======================================================
       OTHERWISE CLOUD WINS

       Important on a new phone/tablet/computer.
    ====================================================== */

    return applyPATCloudProfile(
      cloudProfile,
      user
    );

  }

  catch (
    error
  ) {

    console.error(
      "PAT cloud bootstrap failed:",
      error
    );


    return null;

  }

  finally {

    PATCloudBootstrapRunning =
      false;

  }

}



/* ==========================================================
   DAILY STREAK
========================================================== */

function updatePATDailyStreak(
  profile
) {

  const today =
    getPATDateString();


  const previous =
    profile.dailyStreakLastDate;


  if (
    previous ===
    today
  ) {

    return false;

  }


  const yesterday =
    getPATPreviousDateString(
      today
    );


  if (
    previous ===
    yesterday
  ) {

    profile.dailyStreak =
      Math.max(
        0,
        Number(
          profile.dailyStreak
          ||
          0
        )
      )
      +
      1;

  }

  else {

    profile.dailyStreak =
      1;

  }


  profile.dailyStreakLastDate =
    today;


  return true;

}



/* ==========================================================
   WEEKLY LAB STREAK
========================================================== */

function updatePATGlobalStreak(
  profile
) {

  const thisWeek =
    getPATWeekKey();


  const previousWeek =
    profile.globalStreakLastWeek;


  if (
    previousWeek ===
    thisWeek
  ) {

    return false;

  }


  if (
    previousWeek
    &&
    getPATPreviousWeekKey(
      thisWeek
    ) ===
    previousWeek
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


  return true;

}



/* ==========================================================
   RELEASE STREAK
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


  const current =
    String(
      activityId
    );


  const previous =
    profile.streakLastActivity[
      streakKey
    ];


  if (
    previous ===
    current
  ) {

    return false;

  }


  const currentSequence =
    getPATActivitySequence(
      current
    );


  const previousSequence =
    previous
    ?
      getPATActivitySequence(
        previous
      )
    :
      null;



  if (
    previous ===
    null
  ) {

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
      );


    profile.streakLastActivity[
      streakKey
    ] =
      current;


    profile.streakLastPlayed[
      streakKey
    ] =
      getPATDateString();


    return true;

  }



  if (
    currentSequence !==
    null
    &&
    previousSequence !==
    null
  ) {


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
        current;


      profile.streakLastPlayed[
        streakKey
      ] =
        getPATDateString();


      return true;

    }



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
        current;


      profile.streakLastPlayed[
        streakKey
      ] =
        getPATDateString();


      return true;

    }



    if (
      currentSequence <
      previousSequence
    ) {

      return false;

    }

  }



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
    current;


  profile.streakLastPlayed[
    streakKey
  ] =
    getPATDateString();


  return true;

}



/* ==========================================================
   RECORD ACTIVITY
========================================================== */

function recordPATActivity(
  profile,
  gameId
) {

  if (
    gameId
    &&
    PAT_GAMES[
      gameId
    ]
  ) {

    profile.lastPlayed[
      gameId
    ] =
      getPATDateString();

  }


  profile.lastActiveDate =
    getPATDateString();


  profile.lastActivityAt =
    new Date()
      .toISOString();


  return {

    dailyStreakAdvanced:
      updatePATDailyStreak(
        profile
      )

  };

}



/* ==========================================================
   MARK GAME PLAYED
========================================================== */

function markPATGamePlayed(
  gameId
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


  const activity =
    recordPATActivity(
      profile,
      gameId
    );


  savePATProfile(
    profile
  );


  return {

    profile:
      profile,

    game:
      game,

    dailyStreakAdvanced:
      activity.dailyStreakAdvanced

  };

}



/* ==========================================================
   MASTERY CHANGES
========================================================== */

function applyPATMasteryChanges(
  profile,
  gameId,
  changes
) {

  if (
    !changes
    ||
    typeof changes !==
    "object"
  ) {

    return;

  }


  Object.keys(
    changes
  )
  .forEach(
    function (
      key
    ) {

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
        current
        +
        Number(
          changes[
            key
          ]
          ||
          0
        );

    }
  );

}



/* ==========================================================
   COMPLETE ACTIVITY
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
      "Unknown PAT game:",
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


  const activity =
    recordPATActivity(
      profile,
      gameId
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


  let globalStreakAdvanced =
    false;


  let streakAdvanced =
    false;


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
    !alreadyCompleted
  ) {

    profile.completed[
      gameId
    ]
    .push(
      completionId
    );



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



    globalStreakAdvanced =
      updatePATGlobalStreak(
        profile
      );



    if (
      streakKey
      &&
      PAT_STREAK_SERIES[
        streakKey
      ]
    ) {

      streakAdvanced =
        updatePATSeriesStreak(

          profile,

          streakKey,

          completionId

        );

    }



    if (
      options.mastery
    ) {

      applyPATMasteryChanges(

        profile,

        gameId,

        options.mastery

      );

    }



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

    dailyStreakAdvanced:
      activity.dailyStreakAdvanced,

    streakKey:
      streakKey,

    streakAdvanced:
      streakAdvanced,

    globalStreakAdvanced:
      globalStreakAdvanced

  };

}



/* ==========================================================
   PROGRESS
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


  recordPATActivity(
    profile,
    gameId
  );


  profile.progress[
    gameId
  ][
    key
  ] =
    clonePATValue(
      value
    );


  savePATProfile(
    profile
  );


  return clonePATValue(
    profile.progress[
      gameId
    ]
  );

}



function mergePATGameProgress(
  gameId,
  values
) {

  if (
    !PAT_GAMES[
      gameId
    ]
    ||
    !values
    ||
    typeof values !==
    "object"
    ||
    Array.isArray(
      values
    )
  ) {

    return null;

  }


  const profile =
    loadPATProfile();


  recordPATActivity(
    profile,
    gameId
  );


  profile.progress[
    gameId
  ] =
    {

      ...profile.progress[
        gameId
      ],

      ...clonePATValue(
        values
      )

    };


  savePATProfile(
    profile
  );


  return clonePATValue(
    profile.progress[
      gameId
    ]
  );

}



function getPATGameProgress(
  gameId,
  key
) {

  const profile =
    loadPATProfile();


  const gameProgress =
    profile.progress[
      gameId
    ];


  if (
    !gameProgress
  ) {

    return undefined;

  }


  if (
    key ===
    undefined
  ) {

    return clonePATValue(
      gameProgress
    );

  }


  return clonePATValue(
    gameProgress[
      key
    ]
  );

}



function clearPATGameProgress(
  gameId
) {

  if (
    !PAT_GAMES[
      gameId
    ]
  ) {

    return false;

  }


  const profile =
    loadPATProfile();


  profile.progress[
    gameId
  ] =
    {};


  savePATProfile(
    profile
  );


  return true;

}



/* ==========================================================
   MASTERY
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


  recordPATActivity(
    profile,
    gameId
  );


  profile.mastery[
    gameId
  ][
    key
  ] =
    Number(
      profile.mastery[
        gameId
      ][
        key
      ]
      ||
      0
    )
    +
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


  recordPATActivity(
    profile,
    gameId
  );


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



function getPATMastery(
  gameId,
  key
) {

  const profile =
    loadPATProfile();


  const mastery =
    profile.mastery[
      gameId
    ]
    ||
    {};


  if (
    key ===
    undefined
  ) {

    return clonePATValue(
      mastery
    );

  }


  return mastery[
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



function hasPATUnlock(
  unlockId
) {

  return loadPATProfile()
    .unlocks
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



function hasPATAchievement(
  achievementId
) {

  return loadPATProfile()
    .achievements
    .includes(
      String(
        achievementId
      )
    );

}



/* ==========================================================
   ACCOUNT
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



  if (
    data.userId !==
    undefined
  ) {

    profile.userId =
      data.userId
      ?
        String(
          data.userId
        )
      :
        null;

  }



  if (
    data.authProvider !==
    undefined
  ) {

    profile.authProvider =
      String(
        data.authProvider
        ||
        "local"
      );

  }



  profile.profileCreated =
    Boolean(

      profile.username

      &&
      profile.username !==
      "Guest"

      &&
      profile.email

    );


  savePATProfile(
    profile
  );


  return profile;

}



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
   CLOUD METADATA
========================================================== */

function setPATCloudAccount(
  data =
    {}
) {

  const profile =
    loadPATProfile();


  if (
    data.userId !==
    undefined
  ) {

    profile.userId =
      data.userId
      ?
        String(
          data.userId
        )
      :
        null;

  }


  if (
    data.authProvider !==
    undefined
  ) {

    profile.authProvider =
      String(
        data.authProvider
        ||
        "local"
      );

  }


  if (
    data.cloudEnabled !==
    undefined
  ) {

    profile.cloudEnabled =
      Boolean(
        data.cloudEnabled
      );

  }


  if (
    data.cloudLastSyncedAt !==
    undefined
  ) {

    profile.cloudLastSyncedAt =
      data.cloudLastSyncedAt;

  }


  if (
    data.cloudUpdatedAt !==
    undefined
  ) {

    profile.cloudUpdatedAt =
      data.cloudUpdatedAt;

  }


  savePATProfile(
    profile
  );


  return profile;

}



/* ==========================================================
   PLAN
========================================================== */

function setPATPlan(
  plan
) {

  if (
    ![
      "free",
      "plus",
      "admin"
    ]
    .includes(
      plan
    )
  ) {

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



function PATCanAccessArchive() {

  const plan =
    loadPATProfile()
      .plan;


  return (
    plan ===
    "plus"
    ||
    plan ===
    "admin"
  );

}



function PATHasPlan(
  plan
) {

  const current =
    loadPATProfile()
      .plan;


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
      current ===
      "plus"
      ||
      current ===
      "admin"
    );

  }


  if (
    plan ===
    "admin"
  ) {

    return current ===
      "admin";

  }


  return false;

}



/* ==========================================================
   LEVELS
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


  const start =
    (
      level -
      1
    )
    *
    PAT_XP_PER_LEVEL;


  const next =
    level
    *
    PAT_XP_PER_LEVEL;


  const intoLevel =
    safeXP -
    start;


  return {

    level:
      level,

    xp:
      safeXP,

    xpIntoLevel:
      intoLevel,

    xpPerLevel:
      PAT_XP_PER_LEVEL,

    nextLevelXP:
      next,

    xpNeeded:
      next -
      safeXP,

    levelPercent:
      Math.min(
        100,
        Math.max(
          0,
          (
            intoLevel /
            PAT_XP_PER_LEVEL
          )
          *
          100
        )
      )

  };

}



/* ==========================================================
   STATS
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


  const level =
    getPATLevelData(
      profile.xp
    );


  const recent =
    profile.completionHistory
      .slice()
      .sort(
        function (
          a,
          b
        ) {

          return (
            new Date(
              b.completedAt
            )
            -
            new Date(
              a.completedAt
            )
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

    userId:
      profile.userId,

    authProvider:
      profile.authProvider,

    cloudEnabled:
      profile.cloudEnabled,

    cloudLastSyncedAt:
      profile.cloudLastSyncedAt,

    plan:
      profile.plan,


    xp:
      profile.xp,

    level:
      level.level,

    xpIntoLevel:
      level.xpIntoLevel,

    xpPerLevel:
      level.xpPerLevel,

    xpNeeded:
      level.xpNeeded,

    nextLevelXP:
      level.nextLevelXP,

    levelPercent:
      level.levelPercent,


    dailyStreak:
      profile.dailyStreak,

    dailyStreakLastDate:
      profile.dailyStreakLastDate,

    globalStreak:
      profile.globalStreak,

    globalStreakLastWeek:
      profile.globalStreakLastWeek,


    streaks:
      clonePATValue(
        profile.streaks
      ),

    streakLastActivity:
      clonePATValue(
        profile.streakLastActivity
      ),


    lastActiveDate:
      profile.lastActiveDate,

    lastActivityAt:
      profile.lastActivityAt,

    lastPlayed:
      clonePATValue(
        profile.lastPlayed
      ),


    totalCompleted:
      totalCompleted,

    completedByGame:
      completedByGame,

    recentCompletions:
      recent,


    progress:
      clonePATValue(
        profile.progress
      ),

    mastery:
      clonePATValue(
        profile.mastery
      ),


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
   COMPLETION HELPERS
========================================================== */

function hasPATCompleted(
  gameId,
  activityId
) {

  const profile =
    loadPATProfile();


  return Boolean(

    profile.completed[
      gameId
    ]

    &&
    profile.completed[
      gameId
    ]
    .includes(
      String(
        activityId
      )
    )

  );

}



function getPATCompletionHistory(
  gameId
) {

  const history =
    loadPATProfile()
      .completionHistory;


  if (
    !gameId
  ) {

    return history.slice();

  }


  return history.filter(
    function (
      item
    ) {

      return item.gameId ===
        gameId;

    }
  );

}



/* ==========================================================
   SIGN-IN STATE
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



function PATIsCloudSignedIn() {

  const profile =
    loadPATProfile();


  return Boolean(

    profile.userId

    &&
    profile.cloudEnabled

    &&
    profile.authProvider ===
    "supabase"

  );

}



/* ==========================================================
   CLOUD SIGN UP
========================================================== */

async function PATCloudSignUp(
  email,
  password,
  username
) {

  if (
    !PATCloudAvailable()
  ) {

    throw new Error(
      "Supabase has not loaded yet."
    );

  }


  const result =
    await window
      .PATCloud
      .signUp(

        email,

        password,

        username

      );


  if (
    result
    &&
    result.user
  ) {

    const profile =
      loadPATProfile();


    profile.username =
      username;


    profile.email =
      email;


    profile.userId =
      result.user.id;


    profile.authProvider =
      "supabase";


    profile.cloudEnabled =
      true;


    profile.profileCreated =
      true;


    persistPATProfile(
      profile,
      true,
      false
    );


    if (
      result.session
    ) {

      await bootstrapPATCloudProfile();

    }

  }


  return result;

}



/* ==========================================================
   CLOUD SIGN IN
========================================================== */

async function PATCloudSignIn(
  email,
  password
) {

  if (
    !PATCloudAvailable()
  ) {

    throw new Error(
      "Supabase has not loaded yet."
    );

  }


  const result =
    await window
      .PATCloud
      .signIn(

        email,

        password

      );


  await bootstrapPATCloudProfile();


  return result;

}



/* ==========================================================
   SIGN OUT

   IMPORTANT:

   Cloud data is NOT deleted.

   We only detach the current browser from the account.
========================================================== */

async function PATSignOut() {

  if (
    PATCloudAvailable()
  ) {

    try {

      await window
        .PATCloud
        .signOut();

    }

    catch (
      error
    ) {

      console.warn(
        "Cloud sign out failed.",
        error
      );

    }

  }


  const profile =
    loadPATProfile();


  profile.username =
    "Guest";


  profile.email =
    "";


  profile.profileCreated =
    false;


  profile.userId =
    null;


  profile.authProvider =
    "local";


  profile.cloudEnabled =
    false;


  profile.cloudLastSyncedAt =
    null;


  persistPATProfile(
    profile,
    true,
    false
  );


  return profile;

}



/* ==========================================================
   MANUAL CLOUD SYNC
========================================================== */

async function PATSyncNow() {

  const user =
    await getPATAuthenticatedUser();


  if (
    !user
  ) {

    return {

      success:
        false,

      reason:
        "not_signed_in"

    };

  }


  await bootstrapPATCloudProfile();


  return {

    success:
      true,

    profile:
      loadPATProfile()

  };

}



/* ==========================================================
   RESET
========================================================== */

function resetPATProfile() {

  const fresh =
    createDefaultPATProfile();


  persistPATProfile(
    fresh,
    true,
    false
  );


  return fresh;

}



/* ==========================================================
   PUBLIC API
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

  setCloudAccount:
    setPATCloudAccount,

  isSignedIn:
    PATIsSignedIn,

  isCloudSignedIn:
    PATIsCloudSignedIn,

  signUp:
    PATCloudSignUp,

  signIn:
    PATCloudSignIn,

  signOut:
    PATSignOut,



  /* CLOUD */

  sync:
    PATSyncNow,

  upload:
    syncPATProfileToCloud,

  bootstrapCloud:
    bootstrapPATCloudProfile,



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

  history:
    getPATCompletionHistory,

  markPlayed:
    markPATGamePlayed,

  setProgress:
    setPATGameProgress,

  mergeProgress:
    mergePATGameProgress,

  getProgress:
    getPATGameProgress,

  clearProgress:
    clearPATGameProgress,



  /* MASTERY */

  incrementMastery:
    incrementPATMastery,

  setMastery:
    setPATMastery,

  getMastery:
    getPATMastery,



  /* CONTENT */

  unlock:
    unlockPATContent,

  hasUnlock:
    hasPATUnlock,

  awardAchievement:
    awardPATAchievement,

  hasAchievement:
    hasPATAchievement,



  /* STATS */

  stats:
    getPATProfileStats,

  getLevel:
    function () {

      return getPATLevelData(
        loadPATProfile()
          .xp
      );

    },



  /* DATES */

  date:
    getPATDateString,

  week:
    getPATWeekKey,



  /* CONFIG */

  games:
    PAT_GAMES,

  streakSeries:
    PAT_STREAK_SERIES,

  xpPerLevel:
    PAT_XP_PER_LEVEL,

  cloudTable:
    PAT_CLOUD_PROFILE_TABLE,



  /* VERSION */

  version:
    5,



  /* DEV */

  reset:
    resetPATProfile

};



/* ==========================================================
   INITIALIZE LOCAL PROFILE
========================================================== */

const initializedPATProfile =
  loadPATProfile();



/* ==========================================================
   PROFILE READY
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



/* ==========================================================
   SUPABASE READY

   If supabase.js loads after profile.js,
   this catches it.
========================================================== */

window.addEventListener(
  "pat-cloud-ready",
  function () {

    bootstrapPATCloudProfile();

  }
);



/* ==========================================================
   AUTH CHANGES
========================================================== */

window.addEventListener(
  "pat-cloud-auth-changed",
  function (
    event
  ) {

    const detail =
      event.detail
      ||
      {};


    const authEvent =
      detail.event;


    if (
      authEvent ===
      "SIGNED_IN"

      ||
      authEvent ===
      "TOKEN_REFRESHED"

      ||
      authEvent ===
      "INITIAL_SESSION"

      ||
      authEvent ===
      "USER_UPDATED"
    ) {

      if (
        detail.user
      ) {

        bootstrapPATCloudProfile();

      }

    }

  }
);



/* ==========================================================
   SUPABASE MAY ALREADY BE READY

   Handles script-order differences.
========================================================== */

if (
  PATCloudAvailable()
) {

  setTimeout(
    function () {

      bootstrapPATCloudProfile();

    },

    0
  );

}
