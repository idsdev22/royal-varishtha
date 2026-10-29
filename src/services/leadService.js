/**
 * Royal Varishtaa Website Enquiry Service
 *
 * Direct Architecture:
 * 1. Firebase CRM Cloud Function (Direct POST with CORS) -> Instant CRM Sync
 * 2. Google Apps Script Web App (POST mode: no-cors) -> Google Sheets + Email Notification
 */

export const CRM_API_URL =
  'https://us-central1-karthick-crm.cloudfunctions.net/newDvmAPi';

export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxeyE8NTVxZWHlAWHVfmhQU-2Nmp-OwO4yCB11FB9ZuOG9T7MzRsOP05M_-oI8trWwi/exec';

export const PROJECT_NAME = 'Royal Varishtaa';
export const LEAD_SOURCE = 'Google Ads';

/**
 * Submit enquiry to both Firebase CRM and Google Apps Script.
 *
 * @param {Object} leadData
 * @param {string} leadData.name - Full Name
 * @param {string} leadData.phone - Mobile number
 * @param {string} [leadData.city] - City
 * @param {string} [leadData.address] - Address
 *
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function submitLead(leadData = {}) {
  const name = String(
    leadData?.name ||
    leadData?.fullName ||
    ''
  ).trim();

  const rawPhone = String(
    leadData?.phone ||
    leadData?.phoneNumber ||
    ''
  ).trim();

  const city = String(leadData?.city || '').trim();
  const address = String(leadData?.address || city || 'No address').trim();
  const leadSource = LEAD_SOURCE;

  // Validate required fields
  if (!name) {
    return {
      success: false,
      error: 'Please enter your name.'
    };
  }

  if (!rawPhone) {
    return {
      success: false,
      error: 'Please enter your phone number.'
    };
  }

  // Normalize Indian mobile number format (+91XXXXXXXXXX)
  let cleanPhone = rawPhone.replace(/[\s()-]/g, '');
  if (/^[6-9]\d{9}$/.test(cleanPhone)) {
    cleanPhone = '+91' + cleanPhone;
  } else if (/^91[6-9]\d{9}$/.test(cleanPhone)) {
    cleanPhone = '+' + cleanPhone;
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const timestamp = new Date().toISOString();

  // 1. CRM Payload (matches newDvmAPi expectations)
  const crmPayload = {
    fullName: name,
    phoneNumber: cleanPhone,
    address: address,
    projectName: PROJECT_NAME,
    leadSource: leadSource
  };

  // 2. Google Sheets & Email Payload
  const sheetsPayload = {
    name: name,
    fullName: name,
    phone: cleanPhone,
    phoneNumber: cleanPhone,
    city: city,
    address: address,
    source: leadSource,
    leadSource: leadSource,
    projectName: PROJECT_NAME,
    pageUrl: pageUrl,
    timestamp: timestamp
  };

  try {
    // Send to both destinations in parallel
    const [crmResult, sheetsResult] = await Promise.allSettled([
      // A. Direct call to Firebase Cloud Function (CORS is enabled)
      fetch(CRM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(crmPayload)
      }).then(async (res) => {
        const text = await res.text();
        return { ok: res.ok, status: res.status, body: text };
      }),

      // B. Call to Google Apps Script (Handles Sheets + Email)
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(sheetsPayload)
      })
    ]);

    if (crmResult.status === 'fulfilled' && crmResult.value.ok) {
      console.log('CRM synced successfully:', crmResult.value.body);
    } else {
      console.warn('CRM direct submission issue:', crmResult);
    }

    if (sheetsResult.status === 'rejected') {
      console.warn('Sheets submission issue:', sheetsResult.reason);
    }

    return {
      success: true,
      message: 'Enquiry submitted successfully.'
    };

  } catch (error) {
    console.error('Enquiry submission failed:', error);
    return {
      success: false,
      error: 'Unable to submit enquiry. Please try again.'
    };
  }
}
