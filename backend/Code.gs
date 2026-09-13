/**
 * RSVP backend for the wedding website.
 *
 * What this does:
 * - Runs inside a Google Sheet, under your own Google account.
 * - Receives POST requests from the static site's RSVP form.
 * - Appends one row per submission to a sheet called "RSVPs".
 *
 * Why this doesn't leak credentials:
 * - The public website never contains any Google account info, API key,
 *   or secret. It only knows the public "Web App URL" this script gets
 *   deployed to (something like https://script.google.com/macros/s/AKfycb.../exec).
 * - The script itself runs "as you" on Google's servers — guests never
 *   get access to your Sheet, your account, or this code. They can only
 *   trigger the doPost() function below, which just appends a row.
 * - There are no read endpoints here at all — this script can only
 *   write, never return existing data — so even the Web App URL being
 *   public doesn't expose your guest list.
 *
 * SETUP — do this once:
 * 1. Create a new Google Sheet (e.g. "Casamento — RSVPs").
 * 2. In the Sheet: Extensions → Apps Script.
 * 3. Delete any starter code in Code.gs and paste in this whole file.
 * 4. Click "Deploy" → "New deployment".
 *    - Type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 5. Deploy, then copy the Web App URL it gives you (ends in /exec).
 * 6. Paste that URL into js/config.js as `rsvpEndpoint`.
 * 7. Submit a test RSVP from the live site and check a new row appears
 *    in the Sheet. If you ever need to change the code, you must
 *    re-deploy ("Manage deployments" → edit → new version) for changes
 *    to take effect on the same URL.
 */

var SHEET_NAME = "RSVPs";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),                 // timestamp received by the server
      data.nome || "",
      data.presenca || "",
      data.restricoes || "",
      data.enviadoEm || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Recebido em", "Nome", "Presença", "Restrições alimentares", "Enviado em (cliente)"]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}
