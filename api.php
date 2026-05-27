<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$dbname = "nciame_care";
$username = "nciame_care";
$password = "V?nPPYwGOscw=dIm";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 테이블이 없으면 자동 생성
    $createTableQuery = "
        CREATE TABLE IF NOT EXISTS simple_consult (
            id INT AUTO_INCREMENT PRIMARY KEY,
            path VARCHAR(50) NOT NULL,
            name VARCHAR(50) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            birthdate VARCHAR(10) NOT NULL,
            gender VARCHAR(10) NOT NULL,
            province VARCHAR(50),
            district VARCHAR(50),
            claim_reason VARCHAR(255),
            hospital_name VARCHAR(100),
            current_premium VARCHAR(100),
            target_coverage VARCHAR(255),
            concern_point VARCHAR(255),
            check_request VARCHAR(255),
            analysis_interest VARCHAR(255),
            analysis_company VARCHAR(255),
            term_privacy TINYINT(1) DEFAULT 0,
            term_marketing TINYINT(1) DEFAULT 0,
            status VARCHAR(20) DEFAULT '대기중',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    $conn->exec($createTableQuery);

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data) {
        $inquiry_type = $data['inquiry_type'] ?? '';
        $path = '';
        if ($inquiry_type === 'item1') $path = '보험분석 상담';
        else if ($inquiry_type === 'item2') $path = '보험 리모델링';
        else if ($inquiry_type === 'item3') $path = '보험금 청구';
        else if ($inquiry_type === 'item4') $path = '내보험 점검';
        else $path = '기타';

        $stmt = $conn->prepare("
            INSERT INTO simple_consult (
                path, name, phone, birthdate, gender, province, district,
                claim_reason, hospital_name, current_premium, target_coverage, concern_point, check_request,
                analysis_interest, analysis_company, term_privacy, term_marketing
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $path,
            $data['name'] ?? '',
            $data['phone'] ?? '',
            $data['birthdate'] ?? '',
            $data['gender'] ?? '',
            $data['province'] ?? '',
            $data['district'] ?? '',
            $data['claim_reason'] ?? null,
            $data['hospital_name'] ?? null,
            $data['current_premium'] ?? null,
            $data['target_coverage'] ?? null,
            $data['concern_point'] ?? null,
            $data['check_request'] ?? null,
            $data['analysis_interest'] ?? null,
            $data['analysis_company'] ?? null,
            isset($data['term_privacy']) && $data['term_privacy'] ? 1 : 0,
            isset($data['term_marketing']) && $data['term_marketing'] ? 1 : 0
        ]);
        
        echo json_encode(["status" => "success", "message" => "신청이 성공적으로 저장되었습니다."]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "잘못된 요청 데이터입니다."]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "DB 오류: " . $e->getMessage()]);
}
?>
