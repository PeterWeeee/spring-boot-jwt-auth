$(document).ready(function() {
    // Hiển thị thông tin người dùng đăng nhập thành công
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
            $('#profile').html(data.fullName);
            if (data.images) {
                $('#images').attr('src', '/images/' + data.images);
            }
            console.log("SUCCESS : ", data);
        },
        error: function (e) {
            console.log("ERROR : ", e);
            // alert("Sorry, you are not logged in.");
        }
    });

    // Hàm đăng xuất
    $('#logout').click(function() {
        localStorage.clear();
        window.location.href = "/login";
    });

    // Hàm Login
    $('#login').click(function() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
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
            error: function () {
                alert("Login Failed");
            }
        });
    });
});
