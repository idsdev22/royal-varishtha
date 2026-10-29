export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzkjiHB2ZtZNxhwwKO7zyN1ZwDktnYGGwabm2jGnH0rp-PxMYQmdistZNEPXizmP7S3/exec';

/**
 * Submit a website enquiry to Google Sheets,
 * Firebase CRM, and the email notification workflow.
 *
 * @param {Object} leadData
 * @param {string} leadData.name - Customer full name
 * @param {string} leadData.phone - Indian mobile number
 * @param {string} [leadData.city] - Customer city
 * @param {string} [leadData.source] - Enquiry source
 *
 * @returns {Promise<Object>}
 */
export async function submitLead(leadData) {
  const payload = {
    name: leadData.name?.trim() || '',
    phone: leadData.phone?.trim() || '',
    city: leadData.city?.trim() || '',
    source: leadData.source || 'General Enquiry',
    pageUrl: window.location.href,
    timestamp: new Date().toISOString()
  };

  // Basic client-side validation.
  if (!payload.name || !payload.phone) {
    return {
      success: false,
      error: 'Name and phone number are required.'
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

    return { success: true };

  } catch (error) {
    console.error('Failed to submit website enquiry:', error);

    return {
      success: false,
      error: error
    };
  }
}