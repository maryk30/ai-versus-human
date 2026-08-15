# Uncanny Valley of Authorship

A small jsPsych study: on each trial, participants see two short sentences about
the same topic — one written by a human, one written by an AI — and pick which
one they think a person wrote, under a hard time limit.

## How it runs

- `index.html` loads jsPsych 7.3.4 (via CDN) plus the `html-keyboard-response`,
  `instructions`, and `preload` plugins, then `stimuli.js` and `experiment.js`.
- `experiment.js` builds the timeline: welcome/instructions → one practice
  trial → the real trials (each pair shuffled, side randomized) → debrief.
- Each trial: a 500ms fixation cross, then the pair shown side by side
  (`F` = left, `J` = right) with a shrinking timer bar, for
  `FAST_TRIAL_DURATION_MS` (currently 8000ms). No response within that window
  is logged as a timeout, not an error.
- `on_finish` (in the top-level `initJsPsych` call) posts all collected trial
  data to `DATA_ENDPOINT_URL` and shows a "Data saved" message. There's no
  local CSV fallback — if the endpoint is unreachable, the data isn't saved
  anywhere else, so keep the deployment healthy before collecting real data.

To try it locally, just open `index.html` in a browser — no build step, no
server required.

## Stimuli (`stimuli.js`)

Each entry in `STIMULUS_PAIRS` is:

```js
{
  id: "p01_money",       // stable id, used in exported data — don't change once you've piloted with it
  human: "...",          // written by a person, from memory, cold — no source open
  ai: "...",             // written by an LLM in a fresh chat, given only the bare topic
}
```

Guidelines for adding pairs:
- Same topic on both sides — the only thing that should differ is who wrote it.
- Similar length and reading difficulty, so length/vocabulary isn't a tell on
  its own.
- The AI side should come from a fresh chat with no visibility into the human
  sentence, so it isn't inadvertently mimicking or summarizing it.

`PRACTICE_PAIRS` is a separate, obviously-distinct pair shown once before the
real trials (not included in analysis) just to confirm participants
understand the task.

## Data pipeline: Google Apps Script → Google Sheets

`apps-script.gs` is the server-side handler. Deploy it like this:

1. Open the Google Sheet you want responses written to, then
   **Extensions → Apps Script**. (It must be created this way — a *bound*
   script — not as a standalone project at script.google.com, since
   `doPost` uses `SpreadsheetApp.getActiveSpreadsheet()`.)
2. Paste in the contents of `apps-script.gs`.
3. **Deploy → New deployment → Web app**, with:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Copy the resulting `/exec` URL into `DATA_ENDPOINT_URL` at the top of
   `experiment.js`.
5. Whenever you edit the Apps Script code afterward, you need to push a
   **new deployment version** (Deploy → Manage deployments → edit → New
   version) — saving the script alone does not update the live URL's
   behavior.

Each submission appends one row per response trial (fixation/instruction
screens are filtered out) with a shared `participant_id` (a UUID generated
per submission), plus `block`, `pair_id`, `human_on_left`, `response`, `rt`,
`selected` (`"human"` or `"ai"`, whichever the participant picked, or blank
on a timeout), `chose_human`, and `timed_out`. A header row is added
automatically on the first write if the sheet is empty.

### Debugging "nothing shows up in the Sheet"

- Check **Executions** in the Apps Script editor (clock icon) after a run —
  if there's no execution logged at all, the request isn't reaching your
  script (wrong/stale deployment URL, or access isn't set to "Anyone").
  A 200 response in the browser Network tab with *no* matching execution
  usually means Google returned a sign-in/permission page instead of running
  `doPost`.
- If an execution *is* logged but errored, the error message there is
  authoritative — more useful than anything the client can tell you, since
  `experiment.js` only `console.warn`s on fetch failure and never surfaces
  errors to the participant.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell, loads jsPsych + plugins + the two scripts below |
| `stimuli.js` | Stimulus pairs and practice pair |
| `experiment.js` | Timeline construction, trial logic, data submission |
| `styles.css` | Visual styling for the trial layout |
| `apps-script.gs` | Server-side handler, paste into a Sheet-bound Apps Script project |
