CREATE TABLE IF NOT EXISTS insurance_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inquiry_type VARCHAR(50) NOT NULL COMMENT '상담유형 (item1: 보험분석, item2: 보험리모델링, item3: 보험금청구, item4: 내보험점검)',
    name VARCHAR(50) NOT NULL COMMENT '이름',
    phone VARCHAR(20) NOT NULL COMMENT '연락처',
    birthdate VARCHAR(8) NOT NULL COMMENT '생년월일(YYYYMMDD)',
    gender VARCHAR(10) NOT NULL COMMENT '성별',
    
    -- 보험금 청구 (item3) 전용 컬럼
    claim_reason VARCHAR(255) NULL COMMENT '청구 사유',
    hospital_name VARCHAR(100) NULL COMMENT '병원명',
    
    -- 보험 리모델링 (item2) 전용 컬럼
    current_premium VARCHAR(100) NULL COMMENT '현재 보험료',
    target_coverage VARCHAR(255) NULL COMMENT '보장 목표',
    
    -- 내보험 점검 (item4) 전용 컬럼
    concern_point VARCHAR(255) NULL COMMENT '고민 사항',
    check_request VARCHAR(255) NULL COMMENT '점검 요청 사항',
    
    -- 공통 관리 컬럼
    status VARCHAR(20) DEFAULT '대기중' COMMENT '진행 상태',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '신청 일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
