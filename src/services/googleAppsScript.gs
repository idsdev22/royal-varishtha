/**
 * Royal Varishtaa Website Enquiry Integration
 *
 * Website -> Google Apps Script
 *   -> Google Sheets
 *   -> Firebase CRM
 *   -> Email notification
 */

// =====================================================
// CONFIGURATION
// =====================================================

const NOTIFICATION_EMAIL =
  "idstechdev@gmail.com,reachmr.karthick@gmail.com";

const CRM_API_URL =
  "https://us-central1-karthick-crm.cloudfunctions.net/newDvmAPi";

const LEAD_SOURCE = "Google Ads";
const PROJECT_NAME = "Royal Varishtaa";
const TIME_ZONE = "Asia/Kolkata";


// =====================================================
// GET: TEST DEPLOYMENT
// =====================================================

function doGet() {
  return jsonResponse({
    status: "success",
    message: "Royal Varishtaa enquiry API is running.",
    projectName: PROJECT_NAME,
    leadSource: LEAD_SOURCE
  });
}


// =====================================================
// POST: PROCESS ENQUIRY
// =====================================================

function doPost(e) {
  let crmStatus = "not_attempted";
  let crmHttpCode = null;
  let crmResponseText = "";

  try {
    // 1. Validate request
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Request body is empty.");
    }

    const data = JSON.parse(e.postData.contents);

    const name = String(
      data.name ||
      data.fullName ||
      data.full_name ||
      data.customerName ||
      data.customer_name ||
      ""
    ).trim();

    const phone = String(
      data.phone ||
      data.phoneNumber ||
      data.phone_number ||
      data.mobile ||
      ""
    ).trim();

    const city = String(data.city || "").trim();

    const address = String(
      data.address || city || "No address"
    ).trim();

    const pageUrl = String(
      data.pageUrl || data.page_url || ""
    ).trim();

    const leadSource = String(
      data.source || data.leadSource || LEAD_SOURCE
    ).trim();

    if (!name || !phone) {
      return jsonResponse({
        status: "error",
        message: "Name and phone number are required."
      });
    }

    // 2. Normalize Indian mobile number
    let crmPhone = phone.replace(/[\s()-]/g, "");

    if (/^[6-9]\d{9}$/.test(crmPhone)) {
      crmPhone = "+91" + crmPhone;
    } else if (/^91[6-9]\d{9}$/.test(crmPhone)) {
      crmPhone = "+" + crmPhone;
    } else if (!/^\+91[6-9]\d{9}$/.test(crmPhone)) {
      return jsonResponse({
        status: "error",
        message: "Enter a valid Indian mobile number."
      });
    }

    const timestamp = Utilities.formatDate(
      new Date(),
      TIME_ZONE,
      "dd-MM-yyyy HH:mm:ss"
    );

    // 3. Save to Google Sheets
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) {
      throw new Error(
        "Spreadsheet not found. Open this script from Extensions > Apps Script inside your Google Sheet."
      );
    }

    // Always append to the first sheet
    const sheet = spreadsheet.getSheets()[0] || spreadsheet.getActiveSheet();

    sheet.appendRow([
      timestamp,
      name,
      crmPhone,
      city,
      leadSource,
      PROJECT_NAME,
      pageUrl
    ]);

    console.log("Google Sheets save completed.");

    // 4. Prepare CRM payload
    const crmPayload = {
      fullName: name,
      phoneNumber: crmPhone,
      address: address,
      projectName: PROJECT_NAME,
      leadSource: leadSource
    };

    // 5. Send to Firebase CRM
    try {
      const crmResponse = UrlFetchApp.fetch(
        CRM_API_URL,
        {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify(crmPayload),
          muteHttpExceptions: true
        }
      );

      crmHttpCode = crmResponse.getResponseCode();
      crmResponseText = crmResponse.getContentText();

      console.log("CRM HTTP status: " + crmHttpCode);
      console.log("CRM response: " + crmResponseText);

      let responseData = null;
      try {
        responseData = JSON.parse(crmResponseText);
      } catch (parseError) {
        responseData = null;
      }

      if (crmHttpCode < 200 || crmHttpCode >= 300) {
        crmStatus = "failed";
      } else if (
        responseData &&
        (responseData.status === "error" || responseData.success === false)
      ) {
        crmStatus = "failed";
      } else if (
        crmResponseText.indexOf("Data saved successfully with ID:") !== -1
      ) {
        crmStatus = "success";
      } else {
        crmStatus = "http_success_unverified";
      }

    } catch (crmError) {
      crmStatus = "failed";
      crmResponseText = String(crmError);

      console.error("CRM request failed: " + crmResponseText);
    }

    // 6. Send email notification
    try {
      const emailBody = [
        "New Royal Varishtaa Website Enquiry",
        "",
        "Lead Source: " + leadSource,
        "Project: " + PROJECT_NAME,
        "Name: " + name,
        "Phone: " + crmPhone,
        "City: " + (city || "N/A"),
        "Address: " + address,
        "Received At: " + timestamp,
        "CRM Sync Status: " + crmStatus,
        "CRM HTTP Status: " + (crmHttpCode || "Unavailable"),
        "CRM Response: " + crmResponseText,
        "Website Page: " + (pageUrl || "N/A")
      ].join("\n");

      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: "New Website Enquiry - " + PROJECT_NAME,
        body: emailBody
      });

      console.log("Email notification sent.");

    } catch (emailError) {
      console.error(
        "Email notification failed: " + String(emailError)
      );
    }

    // 7. Return result
    return jsonResponse({
      status: "success",
      message: "Enquiry processed.",
      projectName: PROJECT_NAME,
      leadSource: leadSource,
      crmStatus: crmStatus,
      crmHttpCode: crmHttpCode,
      crmError: crmResponseText
    });

  } catch (error) {
    console.error("Enquiry failed: " + String(error));

    return jsonResponse({
      status: "error",
      message: String(error),
      crmStatus: crmStatus,
      crmHttpCode: crmHttpCode,
      crmError: crmResponseText || String(error)
    });
  }
}


// =====================================================
// JSON RESPONSE HELPER
// =====================================================

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


// =====================================================
// STANDALONE TEST FUNCTION (RUN IN EDITOR TO AUTHORIZE)
// =====================================================
/**
 * CRITICAL STEP:
 * 1. Open your Apps Script editor.
 * 2. Select 'testCRMIntegration' in the function dropdown at top.
 * 3. Click 'Run'.
 * 4. Google will ask for 'Authorization Required'. Click 'Review permissions'
 *    and grant access so UrlFetchApp can send requests to external URLs.
 */
function testCRMIntegration() {
  const testPayload = {
    fullName: "Test Lead Verification",
    phoneNumber: "+919876543210",
    address: "Bangalore",
    projectName: PROJECT_NAME,
    leadSource: LEAD_SOURCE
  };

  Logger.log("Testing CRM URL: " + CRM_API_URL);
  Logger.log("Sending payload: " + JSON.stringify(testPayload));

  try {
    const response = UrlFetchApp.fetch(CRM_API_URL, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(testPayload),
      muteHttpExceptions: true
    });

    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();

    Logger.log("CRM Status Code: " + statusCode);
    Logger.log("CRM Response: " + responseText);

    return {
      success: statusCode >= 200 && statusCode < 300,
      statusCode: statusCode,
      response: responseText
    };
  } catch (err) {
    Logger.log("CRM Fetch Exception: " + err);
    return {
      success: false,
      error: String(err)
    };
  }
}