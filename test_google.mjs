import fs from 'fs';
import crypto from 'crypto';

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function testGoogle() {
  try {
    const keyContent = fs.readFileSync('google_key.php', 'utf8');
    
    // Quick regex to extract from PHP array
    const clientEmailMatch = keyContent.match(/"client_email"\s*=>\s*"([^"]+)"/);
    const privateKeyMatch = keyContent.match(/"private_key"\s*=>\s*"([^"]+)"/);
    
    if (!clientEmailMatch || !privateKeyMatch) {
      console.error("Could not parse google_key.php");
      return;
    }
    
    const clientEmail = clientEmailMatch[1];
    // Fix escaped newlines in the private key string
    const privateKey = privateKeyMatch[1].replace(/\\n/g, '\n');

    const header = JSON.stringify({ alg: 'RS256', typ: 'JWT' });
    const now = Math.floor(Date.now() / 1000);
    const claim = JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    });

    const b64Header = base64url(header);
    const b64Claim = base64url(claim);

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(b64Header + '.' + b64Claim);
    const signature = sign.sign(privateKey, 'base64');
    const b64Signature = signature.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    const jwt = b64Header + '.' + b64Claim + '.' + b64Signature;

    // Get token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    const tokenData = await tokenRes.json();
    console.log("Token response:", tokenData);

    if (!tokenData.access_token) {
      console.log("Failed to get token");
      return;
    }

    // Append row
    const spreadsheetId = '1t3OElFyO6HlUm7qtf8ASE5PTEk5qAq6IzALsaV4XSA0';
    const range = encodeURIComponent('간편상담CARE');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const sheetRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [
          [new Date().toISOString(), '테스트 경로', '테스트 이름']
        ]
      })
    });

    const sheetData = await sheetRes.json();
    console.log("Sheet status:", sheetRes.status);
    console.log("Sheet response:", sheetData);

  } catch (err) {
    console.error("Error:", err);
  }
}

testGoogle();
