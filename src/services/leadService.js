
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwzWRmhednWTiRDwqka5b9slU3PYROX6xtQd3WrqPDYNY6cvC97wUH6F0hI4FcTIgU/exec';

/**
 * Submit a lead to Google Sheets, Firebase CRM,
 * and email notifications through Google Apps Script.
 */
export async function submitLead(leadData = {}) {
  const payload = {
    name: String(leadData.name || '').trim(),
    phone: String(leadData.phone || '').trim(),
    city: String(leadData.city || '').trim()
  };

  if (!payload.name || !payload.phone) {
    return {
      success: false,
      message: 'Name and phone number are required.'
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
    // This does not guarantee that Sheets or CRM saved the lead.
    return {
      success: true,
      message: 'Your enquiry has been submitted.'
    };
  } catch (error) {
    console.error(
      'Failed to submit website enquiry:',
      error
    );

    return {
      success: false,
      message: 'Unable to submit your enquiry. Please try again.'
    };
  }
}
