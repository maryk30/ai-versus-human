/**
 * UNCANNY VALLEY OF AUTHORSHIP — pilot experiment
 * ==================================================
 * Fast, forced binary choice (time-pressured): for each pair of
 * human-written / AI-written text on the same topic, pick which one you
 * think a person wrote. See README.md for the design rationale and
 * analysis plan.
 */

const DATA_ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbzd66KI5NAHa_TBXTMTyNB74xdhZe-oYeWn9eTmRFIPqH9SuIiLEdvnUSb4X1t2Ezdx/exec"; // e.g. "https://script.google.com/macros/s/AKfycb.../exec"

const FAST_TRIAL_DURATION_MS = 8000; // hard time limit for Block A

/* ---------------------------------------------------------- helpers --- */

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Tapping an option (or an "any key" screen) dispatches a synthetic keydown
// for the matching key, which jsPsych's keyboard listener treats the same
// as a real keypress. This is what makes the study usable on phones/
// tablets, which have no F/J keys to press.
function tapKey(key) {
  return `document.dispatchEvent(new KeyboardEvent('keydown', { key: '${key}' }))`;
}

function buildStimulusHTML(leftText, rightText, { timed }) {
  const timerBar = timed
    ? `<div class="timer-track"><div class="timer-fill" style="animation-duration:${FAST_TRIAL_DURATION_MS}ms;"></div></div>`
    : "";
  return `
    ${timerBar}
    <div class="pair-wrap">
      <div class="option" onclick="${tapKey("f")}">
        <div class="key-label">F</div>
        <div class="option-text">${leftText}</div>
      </div>
      <div class="option" onclick="${tapKey("j")}">
        <div class="key-label">J</div>
        <div class="option-text">${rightText}</div>
      </div>
    </div>
    <div class="prompt-line">Which do you think a person wrote? (tap an option, or press F / J)</div>
  `;
}

/**
 * Builds one trial (fixation + response) for a given pair in a given block.
 * Left/right placement of the human-written version is randomized per trial.
 */
function buildTrial(pair, { block, timed }) {
  const humanOnLeft = Math.random() < 0.5;
  const leftText = humanOnLeft ? pair.human : pair.ai;
  const rightText = humanOnLeft ? pair.ai : pair.human;

  const fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div class="fixation">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500,
  };

  const response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: buildStimulusHTML(leftText, rightText, { timed }),
    choices: ["f", "j"],
    trial_duration: timed ? FAST_TRIAL_DURATION_MS : null,
    response_ends_trial: true,
    data: {
      task: "response",
      block: block,
      pair_id: pair.id,
      human_on_left: humanOnLeft,
    },
    on_finish: function (data) {
      if (data.response === null) {
        data.chose_human = null;
        data.selected = null;
        data.timed_out = true;
      } else {
        const chose_left = data.response === "f";
        data.chose_human = chose_left === humanOnLeft;
        data.selected = data.chose_human ? "human" : "ai";
        data.timed_out = false;
      }
    },
  };

  return [fixation, response];
}

/* ------------------------------------------------------- build timeline */

function buildTimeline() {
  const timeline = [];

  timeline.push({
    type: jsPsychPreload,
    auto_preload: true,
  });

  timeline.push({
    type: jsPsychInstructions,
    pages: [
      `<h2>Welcome</h2>
       <p>In this short study you'll see pairs of short sentences, side by
       side, on the same topic. One was written by a person, one by an AI
       system. Pick which one you think a <strong>person</strong> wrote.
       There are no right or wrong answers — just go with your first
       instinct.</p>
       <p>Your responses are anonymous. You may close this tab at any point
       to stop.</p>`,
      `<h2>Part 1</h2>
       <p>In the first part, you'll have <strong>a few seconds</strong> per
       pair. Tap the option you pick, or on a keyboard press
       <strong>F</strong> for the left option or <strong>J</strong> for the
       right option. If you don't answer in time, the trial just moves
       on — that's fine.</p>`,
      `<h2>Practice</h2>
       <p>Let's try a practice round first. This doesn't count.</p>`,
    ],
    show_clickable_nav: true,
  });

  // ---- Practice block (fast, with reassurance, not analyzed) ----
  shuffle(PRACTICE_PAIRS).forEach((pair) => {
    timeline.push(...buildTrial(pair, { block: "practice", timed: true }));
  });

  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <div class="tap-continue" onclick="${tapKey(" ")}">
        <p>Good — that's the idea. Press any key, or tap here, when you're
        ready to start the real first part.</p>
      </div>
    `,
    choices: "ALL_KEYS",
  });

  // ---- Block A: fast, forced, timed ----
  shuffle(STIMULUS_PAIRS).forEach((pair) => {
    timeline.push(...buildTrial(pair, { block: "fast", timed: true }));
  });

  // ---- Debrief ----
  // Data is submitted as soon as this screen loads (on_start), not gated on
  // the participant pressing/tapping a key — so it's saved even if they
  // close the tab right away instead of dismissing this screen.
  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    on_start: submitData,
    stimulus: `
      <div class="tap-continue" onclick="${tapKey(" ")}">
        <h2>Thank you</h2>
        <p>In each pair, one sentence was written by a person and one by an
        AI system, on the same topic. This study is looking at how well
        people can sense which is which under time pressure, going with
        their first instinct.</p>
        <p>Your responses have been saved. Press any key, or tap here, to
        finish.</p>
      </div>
    `,
    choices: "ALL_KEYS",
  });

  return timeline;
}

/* ------------------------------------------------------------- run it -- */

function submitData() {
  if (!DATA_ENDPOINT_URL) return;
  const allData = jsPsych.data.get().values();
  fetch(DATA_ENDPOINT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" }, // avoids CORS preflight for Apps Script
    body: JSON.stringify(allData),
  }).catch(function (err) {
    console.warn("Could not send data to endpoint.", err);
  });
}

const jsPsych = initJsPsych({
  on_finish: function () {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div style="text-align:center;padding:2rem;font-family:sans-serif;">
         Data saved. You can close this tab now.
       </div>`
    );
  },
});

jsPsych.run(buildTimeline());
