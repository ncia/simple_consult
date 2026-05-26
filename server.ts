import express from 'express';
import cors from 'cors';
import pool from './src/config/db.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.post('/api/inquiries', async (req, res) => {
  try {
    const {
      inquiry_type,
      name,
      phone,
      birthdate,
      gender,
      claim_reason,
      hospital_name,
      current_premium,
      target_coverage,
      concern_point,
      check_request,
    } = req.body;

    const sql = `
      INSERT INTO insurance_inquiries (
        inquiry_type, name, phone, birthdate, gender, 
        claim_reason, hospital_name, current_premium, 
        target_coverage, concern_point, check_request
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      inquiry_type,
      name,
      phone,
      birthdate,
      gender,
      claim_reason || null,
      hospital_name || null,
      current_premium || null,
      target_coverage || null,
      concern_point || null,
      check_request || null,
    ];

    const [result] = await pool.query(sql, values);
    res.status(201).json({ success: true, message: 'Inquiry saved successfully', data: result });
  } catch (error) {
    console.error('Error inserting inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error saving inquiry' });
  }
});

// Initialize DB schema automatically
async function initializeDB() {
  try {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS insurance_inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        inquiry_type VARCHAR(50) NOT NULL COMMENT '상담유형 (item1: 보험분석, item2: 보험리모델링, item3: 보험금청구, item4: 내보험점검)',
        name VARCHAR(50) NOT NULL COMMENT '이름',
        phone VARCHAR(20) NOT NULL COMMENT '연락처',
        birthdate VARCHAR(8) NOT NULL COMMENT '생년월일(YYYYMMDD)',
        gender VARCHAR(10) NOT NULL COMMENT '성별',
        claim_reason VARCHAR(255) NULL COMMENT '청구 사유',
        hospital_name VARCHAR(100) NULL COMMENT '병원명',
        current_premium VARCHAR(100) NULL COMMENT '현재 보험료',
        target_coverage VARCHAR(255) NULL COMMENT '보장 목표',
        concern_point VARCHAR(255) NULL COMMENT '고민 사항',
        check_request VARCHAR(255) NULL COMMENT '점검 요청 사항',
        status VARCHAR(20) DEFAULT '대기중' COMMENT '진행 상태',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '신청 일시'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createTableSql);
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

app.listen(port, async () => {
  await initializeDB();
  console.log(`Server is running on port ${port}`);
});
