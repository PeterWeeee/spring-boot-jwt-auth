$(document).ready(function() {
    // Chuyển đổi qua lại giữa form Đăng nhập và Đăng ký
    $('#showRegister').click(function() {
        $('#loginCard').addClass('d-none');
        $('#registerCard').removeClass('d-none');
    });

    $('#showLogin').click(function() {
        $('#registerCard').addClass('d-none');
        $('#loginCard').removeClass('d-none');
    });

    // Cho phép nhấn Enter để submit Login
    $('#email, #password').keypress(function(e) {
        if (e.which === 13) {
            $('#login').click();
        }
    });

    // Cho phép nhấn Enter để submit Register
    $('#regFullName, #regEmail, #regPassword').keypress(function(e) {
        if (e.which === 13) {
            $('#register').click();
        }
    });

    // Hiển thị thông tin người dùng đăng nhập thành công (Slide 33)
    if (window.location.pathname.includes('/user/profile')) {
        $.ajax({
            type: 'GET',
            url: '/users/me',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: function (data) {
                var json = JSON.stringify(data, null, 4);
                // $('#profile').html(json);
                $('#profile').html(data.fullName + " (" + data.email + ")");
                if (data.images) {
                    $('#images').attr('src', '/images/' + data.images);
                }
                console.log("SUCCESS : ", data);
            },
            error: function (e) {
                console.log("ERROR : ", e);
                alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Đang chuyển về trang Login...");
                localStorage.clear();
                window.location.href = "/login";
            }
        });
    }

    // Hàm đăng xuất (Slide 33)
    $('#logout').click(function() {
        localStorage.clear();
        window.location.href = "/login";
    });

    // Hàm Login (Slide 33)
    $('#login').click(function() {
        var email = document.getElementById('email').value.trim();
        var password = document.getElementById('password').value;

        if (!email || !password) {
            alert("Vui lòng nhập đầy đủ Email và Password");
            return;
        }

        var basicInfo = JSON.stringify({
            email: email,
            password: password
        });

        $.ajax({
            type: "POST",
            url: "/auth/login",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: basicInfo,
            success: function (data) {
                localStorage.token = data.token;
                // alert('Got a token from the server! Token: ' + data.token);
                window.location.href = "/user/profile";
            },
            error: function (xhr) {
                var message = "Đăng nhập thất bại (Login Failed)";
                try {
                    if (xhr.responseJSON && xhr.responseJSON.description) {
                        message += ": " + xhr.responseJSON.description;
                    } else if (xhr.responseJSON && xhr.responseJSON.detail) {
                        message += ": " + xhr.responseJSON.detail;
                    }
                } catch(e) {}
                alert(message);
            }
        });
    });

    // Hàm Register trực tiếp trên web
    $('#register').click(function() {
        var fullName = document.getElementById('regFullName').value.trim();
        var email = document.getElementById('regEmail').value.trim();
        var password = document.getElementById('regPassword').value;

        if (!fullName || !email || !password) {
            alert("Vui lòng nhập đầy đủ Họ tên, Email và Password");
            return;
        }

        var regData = JSON.stringify({
            fullName: fullName,
            email: email,
            password: password
        });

        $.ajax({
            type: "POST",
            url: "/auth/signup",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: regData,
            success: function (data) {
                alert("Đăng ký thành công cho tài khoản " + data.email + "! Vui lòng đăng nhập.");
                document.getElementById('email').value = data.email;
                document.getElementById('password').value = "";
                $('#showLogin').click();
            },
            error: function (xhr) {
                var message = "Đăng ký thất bại";
                try {
                    if (xhr.responseJSON && xhr.responseJSON.description) {
                        message += ": " + xhr.responseJSON.description;
                    } else if (xhr.responseJSON && xhr.responseJSON.detail) {
                        message += ": " + xhr.responseJSON.detail;
                    }
                } catch(e) {}
                alert(message);
            }
        });
    });
});
