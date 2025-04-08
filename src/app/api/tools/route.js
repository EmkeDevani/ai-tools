import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = '1ePvAJldz0LboCtMLtBsrgWPCb4cPb5qaPY8l_OXYxSM';
const RANGE = 'Blad1!A2:H';
const SUBJECTS_RANGE = 'Blad2!A2:A';

export async function GET() {
  try {
    // Create a JWT client using the service account credentials
    const client = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth: client });
    
    // Fetch tools data
    const toolsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    // Fetch subjects data
    const subjectsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SUBJECTS_RANGE,
    });

    const rows = toolsResponse.data.values;
    const subjectRows = subjectsResponse.data.values || [];
    
    if (!rows || rows.length === 0) {
      return Response.json({ tools: [], subjects: [] });
    }

    const tools = rows.map((row) => ({
      tool: row[0] || '',
      url: row[1] || '',
      addedBy: row[2] || '',
      date: row[3] || '',
      subject: row[4] || '',
      description: row[5] || '',
      capabilities: row[6] || '',
      rating: row[7] || '',
    }));

    // Extract unique subjects and remove empty values
    const subjects = [...new Set(subjectRows.flat().filter(Boolean))];

    return Response.json({ tools, subjects }, {
      headers: {
        'Cache-Control': 'public, max-age=900',
        'Expires': new Date(Date.now() + 900000).toUTCString()
      }
    });
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return Response.json({ 
      tools: [], 
      subjects: [], 
      error: error.message,
      details: {
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length
      }
    }, { status: 500 });
  }
} 