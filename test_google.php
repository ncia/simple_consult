<?php
$keyData = require __DIR__ . '/google_key.php';

$header = json_encode(['alg' => 'RS256', 'typ' => 'JWT']);
$now = time();
$claim = json_encode([
    'iss' => $keyData['client_email'],
    'scope' => 'https://www.googleapis.com/auth/spreadsheets',
    'aud' => 'https://oauth2.googleapis.com/token',
    'exp' => $now + 3600,
    'iat' => $now
]);

$base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
$base64UrlClaim = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($claim));

$signature = '';
openssl_sign($base64UrlHeader . '.' . $base64UrlClaim, $signature, $keyData['private_key'], 'SHA256');
$base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

$jwt = $base64UrlHeader . '.' . $base64UrlClaim . '.' . $base64UrlSignature;

$ch = curl_init('https://oauth2.googleapis.com/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    'assertion' => $jwt
]));

$response = curl_exec($ch);
curl_close($ch);

echo "Token Response: " . $response . "\n";

$result = json_decode($response, true);
$accessToken = $result['access_token'] ?? null;

if ($accessToken) {
    $spreadsheetId = '1t3OElFyO6HlUm7qtf8ASE5PTEk5qAq6IzALsaV4XSA0';
    $range = '간편상담CARE';
    $url = "https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}/values/" . urlencode($range) . ":append?valueInputOption=USER_ENTERED";

    $values = ["Test", "Data", "123"];
    $postData = json_encode(['values' => [$values]]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json'
    ]);
    
    $sheetResponse = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "Sheet HTTP Code: " . $httpcode . "\n";
    echo "Sheet Response: " . $sheetResponse . "\n";
} else {
    echo "Failed to get access token.\n";
}
?>
