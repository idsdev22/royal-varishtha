
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxeyE8NTVxZWHlAWHVfmhQU-2Nmp-OwO4yCB11FB9ZuOG9T7MzRsOP05M_-oI8trWwi/exec';

/**
 * Submit a Royal Varishtaa website enquiry.
 *
 * Google Apps Script handles:
 * - Google Sheets
 * - Firebase CRM
 * - Email notification
 *
 * Property Type is not included.
 */
export async function submitLead(leadData) {
  const payload = {
    name: String(leadData?.name || '').trim(),
    phone: String(leadData?.phone || '').trim(),
    city: String(leadData?.city || '').trim(),
    source: leadData?.source || 'General Enquiry',
    pageUrl: window.location.href,
    timestamp: new Date().toISOString()
  };

  // Validate required fields.

  if (!payload.name) {
    return {
      success: false,
      error: 'Please enter your name.'
    };
  }

  if (!payload.phone) {
    return {
      success: false,
      error: 'Please enter your phone number.'
    };
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    // no-cors does not expose the Apps Script response.
    // This does not confirm that the CRM saved the lead.

    return {
      success: true,
      message: 'Enquiry request submitted.'
    };

  } catch (error) {
    console.error('Enquiry submission failed:', error);

    return {
      success: false,
      error: 'Unable to submit enquiry. Please try again.'
    };
  }
}
