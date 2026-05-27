<?php
$host = "localhost";
$dbname = "nciame_care";
$username = "nciame_care";
$password = "V?nPPYwGOscw=dIm";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 테이블 컬럼 추가
    $query = "ALTER TABLE simple_consult ADD COLUMN consult_time_type VARCHAR(20) AFTER term_marketing, ADD COLUMN consult_time VARCHAR(20) AFTER consult_time_type";
    
    $conn->exec($query);
    echo "Columns added successfully.";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Columns already exist.";
    } else {
        echo "DB Error: " . $e->getMessage();
    }
}
?>
