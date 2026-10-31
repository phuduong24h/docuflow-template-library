# DocuFlow — Nền Tảng Thư Viện Mẫu Tài Liệu Doanh Nghiệp (DOCX & PPTX)

> **Hệ thống thư viện mẫu văn bản (DOCX) và trình chiếu (PPTX) hiệu năng cao theo kiến trúc Modular Monolith, tuân thủ Clean Architecture, nguyên tắc SOLID và bảo mật OWASP Top 10.**

---

## 1. Hướng Dẫn Cài Đặt & Cách Chạy Hệ Thống

### 📋 Yêu Cầu Môi Trường (Prerequisites)
* **Node.js**: Phiên bản `v20.x` trở lên (Khuyến nghị `v20.19.x`)
* **npm**: Phiên bản `v10.x` trở lên
* **PostgreSQL**: PostgreSQL 16 (Cục bộ hoặc chạy qua Docker)
  * Cổng mặc định: `5432`
  * Tên database: `template_library`

---

### 🚀 Cách 1: Chạy Phát Triển Cục Bộ (Local Development - Khuyến nghị)

#### Bước 1: Cấu hình biến môi trường
Kiểm tra file `server/.env` (hoặc copy từ `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:123456@127.0.0.1:5432/template_library?schema=public"
STORAGE_ROOT="../storage"
CLIENT_URL="http://localhost:5173"
```
*(Lưu ý: Thay đổi mật khẩu `123456` cho khớp với mật khẩu PostgreSQL trên máy bạn)*.

#### Bước 2: Đồng bộ Database và nạp dữ liệu mẫu ban đầu
Từ thư mục gốc dự án:
```powershell
cd server
npx prisma db push
npm run seed
cd ..
```
*Lệnh seed sẽ tự động khởi tạo 5 tài liệu Word DOCX và 3 bài thuyết trình PPTX đạt chuẩn OpenXML ISO/IEC 29500 cùng toàn bộ SVG thumbnail vào thư mục `storage/`.*

#### Bước 3: Khởi chạy song song Backend và Frontend

* **Từ thư mục gốc (Root `d:/test`)**:
  * Mở **Terminal 1** (Backend):
    ```powershell
    npm run dev:server
    ```
    *API chạy tại: `http://localhost:5000` (Kiểm tra sức khỏe: `http://localhost:5000/api/v1/health`)*
  * Mở **Terminal 2** (Frontend):
    ```powershell
    npm run dev:client
    ```
    *Giao diện mở tại: `http://localhost:5173`*

* **Hoặc chạy trực tiếp từ từng thư mục**:
  * Backend: `cd server && npm run dev`
  * Frontend: `cd client && npm run dev`

---

### 🐳 Cách 2: Khởi Chạy Toàn Bộ Qua Docker Compose (One-Click)

Nếu máy đã cài sẵn Docker Desktop, chỉ cần chạy 1 lệnh duy nhất tại thư mục gốc:
```bash
docker-compose up --build -d
```
Hệ thống tự động dựng 3 container độc lập:
1. **`docuflow-postgres`**: PostgreSQL Database (cổng `5432`)
2. **`docuflow-api`**: Node.js + Express API (cổng `5000`)
3. **`docuflow-client`**: Nginx Web Server chạy React SPA (cổng `5173`)

👉 Truy cập ứng dụng tại: **`http://localhost:5173/`**

---

## 2. Mô Tả Hoạt Động & Đáp Ứng Tiêu Chí Đánh Giá

---

### Tiêu chí 1: Chức năng thực tế & Mức độ hoàn thành

Hệ thống hoàn thành 100% hai sản phẩm thử nghiệm với khả năng chạy thực tế:

#### 1. Sản Phẩm 1 — Thư viện mẫu văn bản (DOCX)
* **Duyệt & Tìm kiếm**: Hiển thị lưới mẫu kèm thumbnail sắc nét, phân loại danh mục (Business, Legal, Operations, Management, Communication) và thanh tìm kiếm tức thì.
* **5 Mẫu thử nghiệm thực tế**:
  1. *Business Proposal* (Đề xuất kinh doanh: Tóm tắt dự án, kế hoạch triển khai, bảng chi phí đầu tư).
  2. *Employment Contract* (Hợp đồng lao động: Điều khoản lương thưởng, trách nhiệm, sở hữu trí tuệ).
  3. *Meeting Minutes* (Biên bản cuộc họp: Danh sách tham dự, nội dung thảo luận, phân công công việc).
  4. *Project Status Report* (Báo cáo tiến độ: Chỉ số sức khỏe dự án, cột mốc, rủi ro).
  5. *Formal Business Letter* (Thư thương mại: Tiêu đề doanh nghiệp, thông tin người nhận, chữ ký).
* **Xem trước chân thực (Paper Preview)**: Tích hợp thư viện `mammoth` trích xuất nội dung HTML hiển thị trên mô phỏng trang giấy trắng khổ A4, không cần cài đặt phần mềm Office.
* **Tạo tài liệu mới & Tải xuống**: Người dùng chọn *"Use Template"*, đặt tên tài liệu mới và ghi chú. Hệ thống tự động nhân bản file và cho phép tải xuống file `.docx` nhị phân hợp lệ.

#### 2. Sản Phẩm 2 — Thư viện mẫu trình chiếu (PPTX)
* **Giao diện bài thuyết trình**: Tab riêng biệt chuyên dụng cho bài thuyết trình PowerPoint.
* **3 Bộ slide mẫu thử nghiệm**:
  1. *Business Pitch Deck* (Slide bìa, Vấn đề & Giải pháp, Tiềm năng thị trường & Lộ trình).
  2. *Company Profile* (Giới thiệu công ty, Dịch vụ cốt lõi, Giá trị lãnh đạo).
  3. *Project Presentation* (Kiến trúc hệ thống, Chuẩn OpenXML, Kế hoạch bàn giao).
* **Xem trước Carousel 16:9 Widescreen**: Mô phỏng khung chiếu slide tương tác, hỗ trợ bấm chuyển qua lại từng slide, bộ đếm slide hiện tại, xem chi tiết tiêu đề và các gạch đầu dòng dàn ý.
* **Tạo bản sao & Tải xuống PPTX**: Nhân bản thành tệp `.pptx` độc lập và stream tải về máy. File hoàn toàn tương thích và mở mượt mà trên Microsoft PowerPoint, Google Slides, Apple Keynote và LibreOffice.
* **Khu vực quản lý tệp cá nhân ("My Files")**: Quản lý tập trung mọi tài liệu DOCX và slide PPTX đã được tạo từ mẫu, hỗ trợ tải lại hoặc xóa tệp.

---

### Tiêu chí 2: Kiến trúc, chất lượng code & Khả năng bảo trì

```
                          ┌───────────────────────────┐
                          │   Frontend (React + Vite)  │
                          │   Tailwind CSS / Lucide   │
                          └─────────────┬─────────────┘
                                        │ HTTP / REST
                                        ▼
                          ┌───────────────────────────┐
                          │    API Layer (Express)    │
                          │  Helmet / CORS / Zod Val  │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
        ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
        │ Template Module │    │ Document Module │    │ Pres. Module    │
        └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
                 │                      │                      │
                 ▼                      ▼                      ▼
        ┌───────────────────────────────────────────────────────────────┐
        │                      Application Services                     │
        └───────────────────────┬───────────────────────────────┬───────┘
                                │                               │
                                ▼                               ▼
                 ┌─────────────────────────────┐  ┌─────────────────────────────┐
                 │    Database Layer (Prisma)  │  │    Storage Service (Local)  │
                 │      PostgreSQL Database    │  │    Path Traversal Prevention │
                 └─────────────────────────────┘  └─────────────────────────────┘
```

* **Kiến trúc Modular Monolith**: Tách biệt rõ ràng theo từng domain chức năng (`template`, `document`, `presentation`, `health`). Mỗi module độc lập và có ranh giới rõ ràng.
* **Clean Architecture & Phân lớp nghiêm ngặt**:
  1. *Presentation Layer (Routes & Controllers)*: Tiếp nhận HTTP request, validate tham số qua Zod, không chứa câu lệnh truy vấn database hay thao tác ổ đĩa trực tiếp.
  2. *Domain / Application Services*: Chịu trách nhiệm thực thi business logic, điều phối giữa việc nhân bản file và lưu trữ bản ghi metadata.
  3. *Persistence Layer (Repositories)*: Bao bọc Prisma ORM, quản lý truy vấn, phân trang và chỉ mục.
  4. *Infrastructure / Storage Service*: Trừu tượng hóa hoàn toàn việc đọc/ghi/stream file vật lý (`IStorageService`).
* **Khả năng mở rộng cao (Horizontal Extensibility)**: Thiết kế sẵn sàng mở rộng hỗ trợ thêm bảng tính Excel (`.xlsx`), file PDF, hoặc chuyển đổi từ lưu trữ cục bộ sang Cloud Storage (AWS S3, MinIO, Google Cloud Storage) chỉ bằng việc thay thế Storage Adapter mà không phải sửa logic nghiệp vụ.
* **Tuân thủ TypeScript Strict Mode**: 100% codebase được định kiểu chặt chẽ (Zero `any` bừa bãi), build kiểm tra kiểu dữ liệu thành công không có cảnh báo (`tsc --noEmit`).

---

### Tiêu chí 3: Xử lý template & Dữ liệu

#### 1. Chiến Lược Bảo Toàn Mẫu Gốc Tuyệt Đối (Immutable Source Strategy)
* Mọi file mẫu trong thư mục `storage/templates/` được phân quyền **Read-Only**.
* Khi người dùng tạo tài liệu mới, hệ thống kích hoạt **nhân bản vật lý (Physical Copy)** bằng luồng stream sang `storage/generated/` với tên file định danh là chuỗi **UUID v4** duy nhất (ví dụ: `e058ee01-bcd6-47bf...docx`).
* **Không bao giờ xảy ra tình trạng ghi đè** hay biến dạng file mẫu gốc của thư viện. Đã được kiểm chứng tự động bằng test suite kiểm tra kích thước byte file mẫu trước và sau khi clone.

#### 2. Định Dạng Chuẩn OpenXML
* Các tài liệu DOCX được khởi tạo qua thư viện chuẩn OpenXML với bảng biểu căn lề, heading, bullet, metadata tác giả.
* Các bài trình chiếu PPTX tuân thủ tỷ lệ 16:9 widescreen, thiết lập bảng màu doanh nghiệp, shape, icon và text formatting tương thích tuyệt đối với Microsoft Office.

#### 3. Mô Hình Dữ Liệu Quan Hệ (Database Schema)
* Thiết kế bảng `Template` và `Document` trong PostgreSQL với liên kết khóa ngoại (`templateId`), chỉ mục tối ưu hóa truy vấn (`type`, `category`, `name`, `slug`, `createdAt`).
* Hỗ trợ cơ chế `onDelete: SetNull` để nếu một template bị gỡ bỏ, các tài liệu người dùng đã tạo trước đó vẫn được lưu giữ an toàn, không bị xóa theo.

---

### Tiêu chí 4: Giao diện & Trải nghiệm người dùng

* **Modern Stack**: Xây dựng bằng React 18, Vite 5, Tailwind CSS và bộ icon vector Lucide.
* **Trải nghiệm Preview tối ưu**:
  * *DOCX Preview*: Tái hiện tài liệu trên nền giấy A4 có bóng đổ, căn lề và định dạng đoạn văn bản trực quan.
  * *PPTX Preview*: Trình chiếu slide tương tác 16:9 với hiệu ứng chuyển trang, hỗ trợ phím bấm điều hướng nhanh chóng.
* **Trạng thái giao diện đầy đủ (UI Feedback States)**:
  * *Loading Skeleton*: Hiệu ứng nhấp nháy mô phỏng khi đang tải danh sách template, không gây giật lag trang.
  * *Empty State*: Thông báo và nút làm mới khi không tìm thấy kết quả tìm kiếm hoặc danh mục trống.
  * *Error State*: Thông báo lỗi thân thiện kèm nút thử lại (Retry) khi mất kết nối mạng.
  * *Toast Notifications*: Thông báo tức thì góc màn hình khi tạo tài liệu thành công hoặc có lỗi xảy ra.

---

### Tiêu chí 5: Kiểm thử, xử lý lỗi & Bảo mật (10%)

#### 1. Kiểm Thử Tự Động (Automated Testing)
Hệ thống tích hợp bộ kiểm thử tích hợp (Integration Tests) hoàn chỉnh viết bằng **Vitest** và **Supertest** ([`src/__tests__/api.test.ts`](file:///d:/test/server/src/__tests__/api.test.ts)):
* **18/18 Tests Passed (100% Pass Rate)**:
  * Kiểm tra kiểm tra sức khỏe hệ thống (`GET /api/v1/health`).
  * Kiểm tra danh sách template, phân trang, lọc danh mục, tìm kiếm từ khóa.
  * Kiểm tra xem trước metadata và dàn ý slide PPTX.
  * Kiểm tra luồng nhân bản file từ template và tính độc lập của file mới.
  * Kiểm tra luồng tải file dạng nhị phân với đúng MIME-type và `Content-Disposition`.
  * Kiểm tra xác thực tính bất biến của template gốc trước và sau khi clone.
  * Kiểm tra bảo mật từ chối Path Traversal (`../../etc/passwd`, null-byte `\0`).

Chạy kiểm thử:
```powershell
cd server
npm run test
```

#### 2. Xử Lý Lỗi Tập Trung & Rollback Dữ Liệu
* Middleware xử lý lỗi tập trung ([`error.middleware.ts`](file:///d:/test/server/src/shared/middlewares/error.middleware.ts)) chuẩn hóa toàn bộ phản hồi lỗi theo format `{ success: false, message, error: { code, details } }`.
* **Cơ chế Rollback chống rác ổ đĩa (Anti-Orphan Cleanup)**: Trong trường hợp file vật lý đã được clone nhưng thao tác ghi vào PostgreSQL bị lỗi (mất kết nối DB, timeout), khối `catch` sẽ lập tức kích hoạt lệnh xóa file vừa clone (`fs.unlink`) để giữ ổ đĩa luôn sạch.

#### 3. Bảo Mật Hệ Thống (OWASP Top 10)
* **Chống Path Traversal**: Hàm `StorageService.resolveSafePath` phân giải đường dẫn dựa trên `STORAGE_ROOT`, chặn toàn bộ ký tự `..` và null byte (`\0`).
* **Bảo vệ Header**: Tích hợp middleware `helmet` thiết lập các tiêu đề HTTP an toàn (HSTS, Content-Security-Policy, X-Frame-Options).
* **CORS Whitelist**: Chỉ cho phép các domain frontend được chỉ định truy cập API.
* **Xác thực dữ liệu đầu vào**: 100% request payload được kiểm tra bằng Zod schema trước khi vào controller.

---

### Tiêu chí 6: Tài liệu bàn giao & Khả năng giải thích giải pháp (10%)

Bộ tài liệu kỹ thuật đầy đủ, chi tiết và minh bạch được đính kèm trong repository:
* [**`README.md`**](file:///d:/test/README.md): Hướng dẫn cài đặt, khởi chạy và tổng quan giải pháp.
* [**`ARCHITECTURE.md`**](file:///d:/test/ARCHITECTURE.md): Tài liệu kiến trúc phần mềm (Software Architecture Document - SAD), sơ đồ luồng dữ liệu (Data Flow Diagram) và thiết kế ERD.
* [**`API.md`**](file:///d:/test/API.md): Đặc tả chi tiết chuẩn RESTful API, mã trạng thái HTTP, query parameters và JSON response envelopes.
* [**`LIMITATIONS.md`**](file:///d:/test/LIMITATIONS.md): Báo cáo ranh giới phạm vi MVP, các quyết định đánh đổi kỹ thuật (Trade-offs) và lộ trình nâng cấp (Roadmap tích hợp bộ biên tập ONLYOFFICE / Canvas trong tương lai).
* [**`THIRD_PARTY_LICENSES.md`**](file:///d:/test/THIRD_PARTY_LICENSES.md): Bảng thống kê toàn bộ thư viện bên thứ ba cùng giấy phép mã nguồn mở tương ứng (MIT, Apache 2.0, BSD).

---

## 3. Cấu Trúc Thư Mục Dự Án

```
d:/test/
├── client/                     # Frontend Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/         # UI Components (Navbar, Sidebar, Modals, Cards, Filters)
│   │   ├── hooks/              # Custom Hooks (useTemplates, useDocuments)
│   │   ├── services/           # API Services (Axios HTTP client)
│   │   ├── types/              # TypeScript Interfaces & Types
│   │   ├── App.tsx             # Main App Shell
│   │   └── main.tsx            # React DOM Entry
│   ├── Dockerfile
│   └── package.json
├── server/                     # Backend API & Storage Engine (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Config & Environment Variables
│   │   ├── modules/            # Domain Modules (Template, Document, Presentation, Health)
│   │   ├── shared/             # Error Handling, Middlewares, Response Utilities
│   │   ├── storage/            # File Storage Service & Path Security Guard
│   │   ├── __tests__/          # Vitest Integration Test Suite (18 tests)
│   │   ├── app.ts              # Express App Factory
│   │   └── index.ts            # Server Bootstrap
│   ├── prisma/
│   │   ├── schema.prisma       # Database Relational Schema
│   │   └── seed.ts             # OpenXML Seed Generator (5 DOCX + 3 PPTX)
│   ├── Dockerfile
│   └── package.json
├── storage/                    # Local Physical Storage
│   ├── templates/              # Immutable Templates (5 DOCX, 3 PPTX)
│   ├── generated/              # User Cloned Documents (UUID-named files)
│   └── thumbnails/             # SVG Preview Thumbnails
├── ARCHITECTURE.md             # Software Architecture Document (SAD)
├── API.md                      # RESTful API Specification
├── LIMITATIONS.md              # Limitations & Engineering Roadmap
├── THIRD_PARTY_LICENSES.md     # Third-Party Dependencies & Open-Source Licenses
├── docker-compose.yml          # Multi-container Orchestration
└── package.json                # Monorepo Root Script Configuration
```

---

