-- Script tạo Database và bảng Users cho SQL Server
-- Tài khoản SQL Server: sa / 123456

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'jwt_springboot3')
BEGIN
    CREATE DATABASE jwt_springboot3;
END
GO

USE jwt_springboot3;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        images NVARCHAR(500) NOT NULL DEFAULT 'u1.jpg',
        password VARCHAR(255) NOT NULL,
        created_at DATETIME2 NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NULL DEFAULT GETDATE()
    );
END
GO

-- Mật khẩu chuẩn cho "123456" đã được mã hóa BCrypt chính xác 60 ký tự:
-- $2a$10$wLRzKeUQsnpepDUSakzTeuxRDnqOi2MB2xuby3LRzF3YxaeDQpFHG
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'trungnh@hcmute.edu.vn')
BEGIN
    INSERT INTO users (full_name, email, images, password, created_at, updated_at)
    VALUES (
        N'Nguyễn Hữu Trung',
        'trungnh@hcmute.edu.vn',
        'u1.jpg',
        '$2a$10$wLRzKeUQsnpepDUSakzTeuxRDnqOi2MB2xuby3LRzF3YxaeDQpFHG',
        GETDATE(),
        GETDATE()
    );
END
ELSE
BEGIN
    UPDATE users 
    SET password = '$2a$10$wLRzKeUQsnpepDUSakzTeuxRDnqOi2MB2xuby3LRzF3YxaeDQpFHG' 
    WHERE email = 'trungnh@hcmute.edu.vn';
END
GO

IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com')
BEGIN
    INSERT INTO users (full_name, email, images, password, created_at, updated_at)
    VALUES (
        N'Quản Trị Viên',
        'admin@example.com',
        'admin.jpg',
        '$2a$10$wLRzKeUQsnpepDUSakzTeuxRDnqOi2MB2xuby3LRzF3YxaeDQpFHG',
        GETDATE(),
        GETDATE()
    );
END
ELSE
BEGIN
    UPDATE users 
    SET password = '$2a$10$wLRzKeUQsnpepDUSakzTeuxRDnqOi2MB2xuby3LRzF3YxaeDQpFHG' 
    WHERE email = 'admin@example.com';
END
GO
