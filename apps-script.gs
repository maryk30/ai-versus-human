/**
 * Paste this into script.google.com (a new project), bound to a Google Sheet.
 * See README.md Step 3 for the full deploy walkthrough.
 *
 * This function receives the JSON array jsPsych sends and appends one row
 * per trial to the active sheet, creating a header row on first run.
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = JSON.parse(e.postData.contents);

  // Only keep the actual response trials, not fixation/instruction screens.
  const trials = rows.filter(function (r) {
    return r.task === "response";
  });

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "timestamp",
      "participant_id",
      "block",
      "pair_id",
      "human_on_left",
      "response",
      "rt_ms",
      "chose_human",
      "timed_out",
    ]);
  }

  const participantId = Utilities.getUuid(); // one id per submission batch

  trials.forEach(function (t) {
    sheet.appendRow([
      new Date().toISOString(),
      participantId,
      t.block,
      t.pair_id,
      t.human_on_left,
      t.response,
      t.rt,
      t.chose_human,
      t.timed_out,
    ]);
  });

  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", rows_written: trials.length })
  ).setMimeType(ContentService.MimeType.JSON);
}