<?php
// CORS 설정: 모든 도메인에서의 요청 허용 (실서비스 시에는 특정 도메인으로 제한 권장)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// OPTIONS 요청(Preflight)에 대한 처리
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 닷홈 DB 연결 정보
$servername = "localhost";
$username = "ncia";
$password = "Skycastle77!";
$dbname = "ncia";

// 에러 리포팅 설정
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // DB 연결
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");

    // 테이블이 없으면 생성하는 쿼리 (최초 1회 실행용)
    $createTableQuery = "
        CREATE TABLE IF NOT EXISTS insurance_inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            inquiry_type VARCHAR(50) NOT NULL,
            name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            birthdate VARCHAR(10) NOT NULL,
            gender VARCHAR(10) NOT NULL,
            claim_reason VARCHAR(255),
            hospital_name VARCHAR(255),
            current_premium VARCHAR(255),
            target_coverage VARCHAR(255),
            concern_point VARCHAR(255),
            check_request VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    $conn->query($createTableQuery);

    // JSON 본문 읽기
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        throw new Exception("잘못된 요청 데이터입니다.");
    }

    // 데이터 추출 및 안전한 바인딩 준비
    $inquiry_type = $data['inquiry_type'] ?? '';
    $name = $data['name'] ?? '';
    $phone = $data['phone'] ?? '';
    $birthdate = $data['birthdate'] ?? '';
    $gender = $data['gender'] ?? '';
    $claim_reason = $data['claim_reason'] ?? '';
    $hospital_name = $data['hospital_name'] ?? '';
    $current_premium = $data['current_premium'] ?? '';
    $target_coverage = $data['target_coverage'] ?? '';
    $concern_point = $data['concern_point'] ?? '';
    $check_request = $data['check_request'] ?? '';

    // INSERT 쿼리 준비
    $stmt = $conn->prepare("
        INSERT INTO insurance_inquiries (
            inquiry_type, name, phone, birthdate, gender,
            claim_reason, hospital_name, current_premium, target_coverage, concern_point, check_request
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "sssssssssss",
        $inquiry_type, $name, $phone, $birthdate, $gender,
        $claim_reason, $hospital_name, $current_premium, $target_coverage, $concern_point, $check_request
    );

    // 실행
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "신청이 성공적으로 저장되었습니다.", "id" => $stmt->insert_id]);
    } else {
        throw new Exception("저장 실패");
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
