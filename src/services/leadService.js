/**
 * Royal Varishtaa Website Enquiry Integration
 *
 * Architecture:
 * Website Frontend -> Google Apps Script -> Google Sheets
 *                                        -> Firebase CRM (https://us-central1-karthick-crm.cloudfunctions.net/newDvmAPi)
 *                                        -> Email notification (idstechdev@gmail.com, reachmr.karthick@gmail.com)
 */

export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzkjiHB2ZtZNxhwwKO7zyN1ZwDktnYGGwabm2jGnH0rp-PxMYQmdistZNEPXizmP7S3/exec';

export const PROJECT_NAME = 'Royal Varishtaa';
export const DEFAULT_LEAD_SOURCE = 'Google Ads';

/**
 * Submit an enquiry to Google Apps Script based on expected backend fields.
 *
 * Expected Fields by Google Apps Script doPost(e):
 * - name / fullName / customerName: Customer full name
 * - phone / phoneNumber / mobile: 10-digit Indian mobile number
 * - city: Customer city
 * - address: Customer address (falls back to city if not provided)
 * - pageUrl: URL where the enquiry was made
 * - projectName: "Royal Varishtaa"
 * - leadSource: "Google Ads" or custom campaign source
 *
 * @param {Object} leadData
 * @param {string} leadData.name - Full Name
 * @param {string} [leadData.fullName] - Full Name alias
 * @param {string} leadData.phone - Mobile number
 * @param {string} [leadData.phoneNumber] - Mobile number alias
 * @param {string} [leadData.city] - City
 * @param {string} [leadData.address] - Full address (defaults to city)
 * @param {string} [leadData.leadSource] - Campaign or lead source (e.g., 'Google Ads', 'Hero Banner')
 * @param {string} [leadData.source] - Alias for leadSource
 * @param {string} [leadData.pageUrl] - Page URL
 *
 * @returns {Promise<{success: boolean, message?: string, error?: any}>}
 */
export async function submitLead(leadData = {}) {
  const name = String(
    leadData.name ||
    leadData.fullName ||
    leadData.full_name ||
    leadData.customerName ||
    leadData.customer_name ||
    ''
  ).trim();

  const phone = String(
    leadData.phone ||
    leadData.phoneNumber ||
    leadData.phone_number ||
    leadData.mobile ||
    ''
  ).trim();

  const city = String(leadData.city || '').trim();
  const address = String(leadData.address || city || 'No address').trim();
  const leadSource = String(leadData.leadSource || leadData.source || DEFAULT_LEAD_SOURCE).trim();
  const projectName = PROJECT_NAME;
  const pageUrl = String(
    leadData.pageUrl ||
    leadData.page_url ||
    (typeof window !== 'undefined' ? window.location.href : '')
  ).trim();

  // 1. Client-side field validation
  if (!name || !phone) {
    return {
      success: false,
      message: 'Name and phone number are required.'
    };
  }

  // 2. Normalize Indian mobile number format to match Apps Script requirements
  let crmPhone = phone.replace(/[\s()-]/g, '');

  if (/^[6-9]\d{9}$/.test(crmPhone)) {
    crmPhone = '+91' + crmPhone;
  } else if (/^91[6-9]\d{9}$/.test(crmPhone)) {
    crmPhone = '+' + crmPhone;
  } else if (!/^\+91[6-9]\d{9}$/.test(crmPhone)) {
    return {
      success: false,
      message: 'Please enter a valid 10-digit Indian mobile number.'
    };
  }

  // 3. Construct unified payload containing all expected fields & aliases
  const payload = {
    name: name,
    fullName: name,
    phone: crmPhone,
    phoneNumber: crmPhone,
    city: city,
    address: address,
    projectName: projectName,
    leadSource: leadSource,
    source: leadSource,
    pageUrl: pageUrl,
    timestamp: new Date().toISOString()
  };

  try {
    // Note: mode: 'no-cors' is required for Google Apps Script Web Apps to prevent browser CORS blocks
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      message: 'Enquiry processed successfully.'
    };
  } catch (error) {
    console.error('Failed to submit website enquiry:', error);

    return {
      success: false,
      error: error,
      message: 'Failed to submit enquiry. Please try again.'
    };
  }
}
