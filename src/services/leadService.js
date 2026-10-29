
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxc20XhXongjUZhCoMz48NnKJprP8dMT1Za8rbk-RAMhwDuqkiglLgj9VgshaD4duFt/exec';

/**
 * Submit a lead to Google Sheets, Firebase CRM,
 * and trigger an email notification via Apps Script.
 */
export async function submitLead(leadData) {
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

    // With no-cors, the actual server response cannot be read.
    // This only confirms that fetch did not throw an error.
    return {
      success: true,
      message: 'Enquiry submitted.'
    };
  } catch (error) {
    console.error('Failed to submit website enquiry:', error);

    return {
      success: false,
      message: 'Unable to submit your enquiry. Please try again.'
    };
  }
}
