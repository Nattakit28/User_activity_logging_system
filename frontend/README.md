# 📋 Activity Logger System - Frontend (React)

ส่วน Frontend ของระบบบันทึกกิจกรรม (Activity Logger)

## ✨ ฟีเจอร์

- ✅ หน้าเข้าสู่ระบบ (Login)
- ✅ หน้าสมัครสมาชิก (Register)
- ✅ หน้าหลัก (Home) - แสดงรายชื่อกิจกรรม
- ✅ เพิ่มกิจกรรมใหม่ (Modal Form)
- ✅ แก้ไขกิจกรรม (Modal Form)
- ✅ ลบกิจกรรม (Confirmation)
- ✅ ตรวจสอบสิทธิ์ด้วย JWT Token

## 📋 ความต้องการของระบบ

- Node.js (v14 หรือสูงกว่า)
- npm หรือ yarn

## 🛠️ วิธีการติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
cd my-react-app
npm install
```

### 2. เรียกใช้ Development Server

```bash
npm run dev
```

Frontend จะทำงานที่ `http://localhost:5173` (หรือหมายเลขพอร์ตอื่นขึ้นอยู่กับการตั้งค่า Vite)

## 📱 หน้าต่างๆของแอปพลิเคชัน

### หน้าเข้าสู่ระบบ (`/login`)
- ป้อนชื่อผู้ใช้ (Username)
- ป้อนรหัสผ่าน (Password)
- ปุ่ม "เข้าสู่ระบบ"
- ลิงก์ไปยังหน้าสมัครสมาชิก

### หน้าสมัครสมาชิก (`/register`)
- ป้อนชื่อผู้ใช้ (Username)
- ป้อนอีเมล (Email)
- ป้อนรหัสผ่าน (Password)
- ยืนยันรหัสผ่าน (Confirm Password)
- ปุ่ม "สมัครสมาชิก"
- ลิงก์ไปยังหน้าเข้าสู่ระบบ

### หน้าหลัก (`/home`)
ต้องเข้าสู่ระบบก่อน

#### ส่วนประกอบ:
1. **Header**
   - ชื่อแอปพลิเคชัน
   - สัญญาณต้อนรับผู้ใช้
   - ปุ่มออกจากระบบ

2. **ตาราง (Table)**
   - คอลัมน์: ชื่อกิจกรรม, วันที่, เวลา, ตัวเลือก
   - แสดงรายชื่อกิจกรรมทั้งหมด

3. **ปุ่มเพิ่มกิจกรรมใหม่**
   - เปิด Modal สำหรับเพิ่มกิจกรรม

4. **ปุ่มแก้ไขและลบ** (สำหรับแต่ละรายการ)
   - แก้ไข: เปิด Modal พร้อมข้อมูลเดิม
   - ลบ: ยืนยันการลบ

### Modal เพิ่ม/แก้ไขกิจกรรม
- ชื่อกิจกรรม (ข้อความ)
- วันที่ (Date Picker)
- เวลา (Time Picker)
- ปุ่มบันทึก
- ปุ่มยกเลิก

## 📁 โครงสร้างโปรเจค

```
my-react-app/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # หน้าเข้าสู่ระบบ
│   │   ├── Register.jsx       # หน้าสมัครสมาชิก
│   │   └── Home.jsx           # หน้าหลัก
│   ├── components/
│   │   └── ActivityModal.jsx  # Modal เพิ่ม/แก้ไขกิจกรรม
│   ├── services/
│   │   └── api.js             # API Integration (Axios)
│   ├── styles/
│   │   ├── Auth.css           # CSS สำหรับหน้า Auth
│   │   ├── Home.css           # CSS สำหรับหน้า Home
│   │   └── Modal.css          # CSS สำหรับ Modal
│   ├── App.jsx                # Component หลัก + Routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies
├── vite.config.js            # Vite configuration
└── index.html                # HTML entry point
```

## 🔧 ตัวแปรสภาพแวดล้อม

ในไฟล์ [src/services/api.js](src/services/api.js):

```javascript
const API_URL = 'http://localhost:5000/api';
```

หากเซิร์ฟเวอร์ทำงานที่พอร์ตอื่น ให้เปลี่ยนค่า API_URL

## 💾 LocalStorage

แอปพลิเคชันใช้ localStorage เก็บ:
- **token**: JWT Token สำหรับตรวจสอบสิทธิ์
- **user**: ข้อมูลผู้ใช้ (JSON)

## 🔐 ขั้นตอนการเข้าสู่ระบบ

1. ผู้ใช้ป้อนชื่อผู้ใช้และรหัสผ่าน
2. Frontend ส่ง POST request ไปยัง `/api/auth/login`
3. Backend ส่ง token กลับมา
4. Frontend เก็บ token ใน localStorage
5. Token จะถูกใช้ในทุก request ที่ต้องการสิทธิ์

## 🚦 Routing

| Route | Component | สถานะ |
|-------|-----------|-------|
| `/` | Redirect to `/login` | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/home` | Home | Protected |

Protected routes จะ redirect ไปที่ `/login` ถ้าไม่มี token

## 🎨 ตัวจัดแต่งทำนอง

- **สี**: สีประกอบหลัก #667eea, #764ba2
- **ฟอนต์**: Segoe UI
- **Responsive**: ออกแบบมาสำหรับมือถือ, แท็บเล็ต, และเดสก์ทอป

## ✋ วิธีการใช้งาน

### 1. สมัครสมาชิก
```
1. ไปที่ /register
2. กรอกข้อมูล (ชื่อผู้ใช้, อีเมล, รหัสผ่าน)
3. คลิก "สมัครสมาชิก"
4. Redirect ไปที่หน้าเข้าสู่ระบบ
```

### 2. เข้าสู่ระบบ
```
1. ไปที่ /login (ค่าเริ่มต้น)
2. กรอกชื่อผู้ใช้และรหัสผ่าน
3. คลิก "เข้าสู่ระบบ"
4. Redirect ไปที่ /home
```

### 3. เพิ่มกิจกรรม
```
1. คลิก "+ เพิ่มกิจกรรมใหม่"
2. กรอกชื่อกิจกรรม, วันที่, เวลา
3. คลิก "บันทึก"
4. กิจกรรมจะปรากฏในตาราง
```

### 4. แก้ไขกิจกรรม
```
1. คลิก "✏️ แก้ไข" บนแถวของกิจกรรม
2. แก้ไขข้อมูล
3. คลิก "บันทึก"
```

### 5. ลบกิจกรรม
```
1. คลิก "🗑️ ลบ" บนแถวของกิจกรรม
2. ยืนยันการลบ
3. กิจกรรมจะถูกลบออกจากตาราง
```

### 6. ออกจากระบบ
```
1. คลิก "ออกจากระบบ" ที่ Header
2. Redirect ไปที่หน้าเข้าสู่ระบบ
3. Token จะถูกลบออกจาก localStorage
```

## 🐛 Troubleshooting

### ข้อผิดพลาด: "Cannot connect to server"
- ตรวจสอบว่า backend server ทำงานที่ `http://localhost:5000`
- ตรวจสอบ API_URL ในไฟล์ `src/services/api.js`

### ข้อผิดพลาด: "Token expired"
- ลบ localStorage
- เข้าสู่ระบบใหม่

### ข้อผิดพลาด: "Module not found"
- ลบโฟลเดอร์ `node_modules`
- รัน `npm install` อีกครั้ง

## 📞 การติดต่อสำหรับปัญหา

หากมีปัญหา:
1. ตรวจสอบ console (F12) สำหรับข้อความแสดงข้อผิดพลาด
2. ตรวจสอบ Network tab เพื่อดูข้อมูล API request/response
3. ตรวจสอบว่า backend server ทำงานอยู่

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
