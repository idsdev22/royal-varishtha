/**
 * Royal Varishtaa Website Enquiry Integration
 *
 * Website -> Google Apps Script -> Google Sheets
 *                             -> Firebase CRM
 *                             -> Email notification
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
// POST: PROCESS WEBSITE ENQUIRY
// =====================================================

function doPost(e) {
  let crmStatus = "not_attempted";
  let crmResponseText = "";

  try {
    // -------------------------------------------------
    // 1. Validate incoming request
    // -------------------------------------------------

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
      data.pageUrl ||
      data.page_url ||
      ""
    ).trim();

    // Fixed values for this website.
    const projectName = PROJECT_NAME;
    const leadSource = LEAD_SOURCE;

    if (!name || !phone) {
      return jsonResponse({
        status: "error",
        message: "Name and phone number are required."
      });
    }

    // -------------------------------------------------
    // 2. Normalize Indian mobile number
    // -------------------------------------------------

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

    // -------------------------------------------------
    // 3. Save enquiry to Google Sheets
    // -------------------------------------------------

    const spreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) {
      throw new Error(
        "Spreadsheet not found. Open Apps Script from your Google Sheet."
      );
    }

    const sheet = spreadsheet.getActiveSheet();

    // Property Type has been removed.
    sheet.appendRow([
      timestamp,
      name,
      crmPhone,
      city,
      leadSource,
      projectName,
      pageUrl
    ]);

    console.log("Website enquiry saved to Google Sheets.");

    // -------------------------------------------------
    // 4. Prepare Firebase CRM payload
    // -------------------------------------------------

    const crmPayload = {
      fullName: name,
      phoneNumber: crmPhone,
      address: address,
      projectName: projectName,
      leadSource: leadSource
    };

    // Avoid logging the customer's phone number.
    console.log(
      "CRM payload: " +
      JSON.stringify({
        fullName: crmPayload.fullName,
        phoneNumber: "[REDACTED]",
        address: crmPayload.address,
        projectName: crmPayload.projectName,
        leadSource: crmPayload.leadSource
      })
    );

    // -------------------------------------------------
    // 5. Send enquiry to Firebase CRM
    // -------------------------------------------------

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

      const httpCode = crmResponse.getResponseCode();

      crmResponseText = crmResponse.getContentText();

      console.log("CRM HTTP status: " + httpCode);

      if (httpCode >= 200 && httpCode < 300) {
        let responseData = null;

        try {
          responseData = JSON.parse(crmResponseText);
        } catch (parseError) {
          responseData = null;
        }

        if (
          responseData &&
          (
            responseData.status === "error" ||
            responseData.success === false
          )
        ) {
          crmStatus = "failed";
        } else if (
          crmResponseText.indexOf(
            "Data saved successfully with ID:"
          ) !== -1
        ) {
          crmStatus = "success";
        } else {
          crmStatus = "http_success_unverified";
        }
      } else {
        crmStatus = "failed";
      }

    } catch (apiError) {
      crmStatus = "failed";
      crmResponseText = String(apiError);

      console.error(
        "Firebase CRM request failed: " + crmResponseText
      );
    }

    // -------------------------------------------------
    // 6. Send email notification
    // -------------------------------------------------

    try {
      const emailBody = [
        "New Royal Varishtaa Website Enquiry",
        "",
        "Lead Source: " + leadSource,
        "Project: " + projectName,
        "Name: " + name,
        "Phone: " + crmPhone,
        "City: " + (city || "N/A"),
        "Address: " + address,
        "Received At: " + timestamp,
        "CRM Sync Status: " + crmStatus,
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

    // -------------------------------------------------
    // 7. Return processing result
    // -------------------------------------------------

    return jsonResponse({
      status: "success",
      message: "Enquiry processed.",
      projectName: PROJECT_NAME,
      leadSource: LEAD_SOURCE,
      crmStatus: crmStatus
    });

  } catch (error) {
    console.error(
      "Enquiry processing failed: " + String(error)
    );

    return jsonResponse({
      status: "error",
      message: String(error),
      crmStatus: crmStatus
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

