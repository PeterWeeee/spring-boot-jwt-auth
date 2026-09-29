# Spring Boot 3 / Security 6 JWT Authentication Demo

Dự án Demo xác thực và phân quyền bằng JWT trên Spring Boot 3 / Spring Security 6 (tương thích Spring Boot 4.x và JDK 17+), kết nối cơ sở dữ liệu Microsoft SQL Server, hỗ trợ cả giao diện Web AJAX (Thymeleaf, jQuery, Bootstrap) và RESTful API.

## Cấu trúc dự án
- `vn.iotstar.entity.User`: Thực thể người dùng triển khai `UserDetails`.
- `vn.iotstar.models`: DTO request và response (`LoginUserModel`, `RegisterUserModel`, `LoginResponse`).
- `vn.iotstar.repository.UserRepository`: Spring Data JPA Repository thao tác với bảng `users`.
- `vn.iotstar.services`:
  - `JwtService`: Tạo, trích xuất và xác thực JWT token (sử dụng thư viện JJWT ở nhánh `main` và Nimbus JOSE+JWT ở nhánh `nimbus-jwt`).
  - `AuthenticationService`: Đăng ký tài khoản và chứng thực đăng nhập.
  - `UserService`: Lấy danh sách người dùng.
- `vn.iotstar.configs`:
  - `ApplicationConfiguration`: Cấu hình `UserDetailsService`, `PasswordEncoder` (BCrypt), `AuthenticationManager`, `AuthenticationProvider`.
  - `SecurityConfiguration`: Cấu hình `SecurityFilterChain` (Stateless session, phân quyền endpoint, CORS, CSRF).
  - `GlobalExceptionHandler`: Xử lý ngoại lệ bảo mật và trả về RFC 7807 `ProblemDetail`.
- `vn.iotstar.filter.JwtAuthenticationFilter`: Filter chặn mọi request để kiểm tra Bearer token.
- `vn.iotstar.controllers`:
  - `AuthenticationController`: API `/auth/signup` và `/auth/login`.
  - `UserController`: API bảo vệ `/users/me` và `/users`.
  - `AuthController`: Render giao diện `/login` và `/user/profile`.
- `database/init.sql`: Script khởi tạo cơ sở dữ liệu `jwt_springboot3`, bảng `users` và các bản ghi mẫu trên SQL Server.
- `templates/` & `static/`: Giao diện Web AJAX tương ứng.

## Cơ sở dữ liệu
- Hệ quản trị CSDL: Microsoft SQL Server (tài khoản: `sa` / `123456`)
- File script: `database/init.sql`
- Tên database: `jwt_springboot3`

## Hướng dẫn chạy và kiểm thử
1. Đảm bảo SQL Server đang chạy và đã thực thi `database/init.sql`.
2. Chạy ứng dụng:
   ```bash
   mvn spring-boot:run
   ```
3. Chạy toàn bộ bộ test tích hợp tự động:
   ```bash
   mvn test
   ```
4. Truy cập giao diện web:
   - Đăng nhập: `http://localhost:8005/login`
   - Thông tin cá nhân: `http://localhost:8005/user/profile`

## Các nhánh Git
- `main`: Yêu cầu 1 - Triển khai hoàn chỉnh bài giảng bằng thư viện JJWT (`io.jsonwebtoken:jjwt-api:0.12.6`).
- `nimbus-jwt` (nhánh hiện tại): Yêu cầu 2 - Thay thế hoàn toàn JJWT bằng thư viện Nimbus JOSE + JWT (`com.nimbusds:nimbus-jose-jwt:10.9.1`) cho các thao tác:
  - Khởi tạo Header JWS với thuật toán HS256 (`JWSAlgorithm.HS256`).
  - Xây dựng Claims (`JWTClaimsSet.Builder`) bao gồm `subject`, `issueTime`, `expirationTime` và `extraClaims`.
  - Ký token với MACSigner (`com.nimbusds.jose.crypto.MACSigner`).
  - Xác thực chữ ký và kiểm tra hạn sử dụng bằng MACVerifier (`com.nimbusds.jose.crypto.MACVerifier`).
  - Toàn bộ các API, Filter, Controller và View AJAX hoạt động tương thích 100%.
