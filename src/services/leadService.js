
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwzWRmhednWTiRDwqka5b9slU3PYROX6xtQd3WrqPDYNY6cvC97wUH6F0hI4FcTIgU/exec';

/**
 * Submits lead data to Google Sheets & triggers automated email alert.
 * 
 * @param {Object} leadData
 * @param {string} leadData.name - Customer full name
 * @param {string} leadData.phone - 10-digit mobile number
 * @param {string} [leadData.city] - Customer city
 * @param {string} [leadData.source] - Lead source or enquiry context (e.g. Hero Banner, Brochure Download)
 */
export async function submitLead(leadData) {
  const payload = {
    name: leadData.name?.trim() || '',
    phone: leadData.phone?.trim() || '',
    city: leadData.city?.trim() || '',
    propertyType: leadData.propertyType || leadData.configuration || '',
    source: leadData.propertyType ? `${leadData.source || 'General Enquiry'} [${leadData.propertyType}]` : (leadData.source || 'General Enquiry'),
    pageUrl: window.location.href,
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

    return { success: true };
  } catch (error) {
    console.error('Failed to submit lead to Google Sheets:', error);
    return { success: false, error };
  }
}