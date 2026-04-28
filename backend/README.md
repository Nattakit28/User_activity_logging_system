# 🚀 Activity Logger System - Backend API

ระบบ API สำหรับบันทึกกิจกรรมของผู้ใช้งาน (Activity Logger)

## ✨ ฟีเจอร์

- ✅ ระบบสมัครสมาชิก (User Registration)
- ✅ ระบบเข้าสู่ระบบ (User Login) 
- ✅ API จัดการกิจกรรม (CRUD Operations)
- ✅ ตรวจสอบสิทธิ์ด้วย JWT Token
- ✅ ฐานข้อมูล SQLite

## 📋 ความต้องการของระบบ

- Node.js (v14 หรือสูงกว่า)
- npm หรือ yarn

## 🛠️ วิธีการติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
cd backend
npm install
```

### 2. กำหนดค่าสภาพแวดล้อม

สร้างไฟล์ `.env` (อยู่แล้ว) ในโฟลเดอร์ backend:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_this
DATABASE_PATH=./database.db
```

### 3. รันเซิร์ฟเวอร์

```bash
npm start
```

หรือ development mode:

```bash
npm run dev
```

เซิร์ฟเวอร์จะทำงานที่ `http://localhost:5000`

## 📚 API Endpoints

### Authentication

#### สมัครสมาชิก
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

#### เข้าสู่ระบบ
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Activities (ต้องมี Authorization Token)

ใช้ Header: `Authorization: Bearer <token>`

#### ดึงกิจกรรมทั้งหมด
```
GET /api/activities
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Team Meeting",
    "date": "2026-02-10",
    "time": "14:30",
    "created_at": "2026-02-04 10:00:00",
    "updated_at": "2026-02-04 10:00:00"
  }
]
```

#### ดึงกิจกรรมตามรหัส
```
GET /api/activities/1
Authorization: Bearer <token>
```

#### เพิ่มกิจกรรมใหม่
```
POST /api/activities
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Team Meeting",
  "date": "2026-02-10",
  "time": "14:30"
}
```

**Response (201):**
```json
{
  "message": "Activity created successfully",
  "id": 1
}
```

#### แก้ไขกิจกรรม
```
PUT /api/activities/1
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Meeting",
  "date": "2026-02-10",
  "time": "15:00"
}
```

**Response (200):**
```json
{
  "message": "Activity updated successfully"
}
```

#### ลบกิจกรรม
```
DELETE /api/activities/1
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Activity deleted successfully"
}
```

## 🧪 การทดสอบด้วย Postman

### นำเข้า Collection

1. เปิด Postman
2. คลิก **Import**
3. เลือก `Activity_Logger_API.postman_collection.json`
4. คลิก **Import**

### ขั้นตอนการทดสอบ

1. **Register**: ทดสอบการสมัครสมาชิก
   - ส่ง POST request ไปที่ `/api/auth/register`
   - ใส่ข้อมูล username, email, password

2. **Login**: เข้าสู่ระบบ
   - ส่ง POST request ไปที่ `/api/auth/login`
   - คัดลอก token จาก response

3. **Set Authorization**: 
   - ไปที่ **Authorization** tab
   - เลือก Type: **Bearer Token**
   - วาง token ลงในช่อง Token

4. **Test Activities**:
   - CREATE: POST /api/activities
   - READ: GET /api/activities
   - UPDATE: PUT /api/activities/{id}
   - DELETE: DELETE /api/activities/{id}

## 📁 โครงสร้างไฟล์

```
backend/
├── server.js                 # ไฟล์หลัก
├── database.js              # การตั้งค่าฐานข้อมูล
├── package.json            # Dependencies
├── .env                    # ตัวแปรสภาพแวดล้อม
├── routes/
│   ├── auth.js            # API สำหรับการตรวจสอบสิทธิ์
│   └── activities.js       # API สำหรับจัดการกิจกรรม
├── middleware/
│   └── auth.js            # Middleware ตรวจสอบ Token
└── database.db            # ฐานข้อมูล (จะสร้างอัตโนมัติ)
```

## 🐛 Troubleshooting

### ข้อผิดพลาด: "Port already in use"
เปลี่ยนค่า PORT ในไฟล์ `.env` เป็นหมายเลขอื่น

### ข้อผิดพลาด: "sqlite3 not found"
รัน: `npm install sqlite3`

### ข้อผิดพลาด: Token invalid
ตรวจสอบว่า:
- Token ยังไม่หมดอายุ (expires in 7 days)
- Authorization header ถูกต้อง: `Bearer <token>`

## 📝 ข้อมูลเพิ่มเติม

- **JWT Expiry**: 7 วัน
- **Database**: SQLite (file-based)
- **CORS**: เปิดใช้งาน (สำหรับ frontend)

## 📞 การติดต่อสำหรับปัญหา

หากมีปัญหา ให้ตรวจสอบ:
1. เซิร์ฟเวอร์ทำงานอยู่
2. ฐานข้อมูลสร้างสำเร็จแล้ว
3. ตรวจสอบ console สำหรับข้อความแสดงข้อผิดพลาด
