// 验证码
function load_checkcode() {
    $("#checkcode_img").attr("src", "Handler/LoginHandler.ashx?action=checkcode&" + Math.random());
};

//登录前使用
function school_Init() {
    var rs = false;
    $.ajax({
        url: "../Handler/LoginHandler.ashx",
        data: { "action": "imgurl" },
        async: false,
        dataType: "json",
        type: "POST",
        success: function (data) {
            $("#wait_main").hide();
            if (data.isSuccess == true) {
                load_checkcode();
                //如果学校的logo和名字有值才显示
                if (data.rows[0]["图片路径"] && data.rows[0]["学校名称"]) {
                    $("#school_logo,#school_name").show();
                };
                $("#school_logo").attr("src", data.rows[0]["图片路径"]);
                $("#school_name").text(data.rows[0]["学校名称"]);
                $("#xtmc").text(data.rows[0]["系统名称"]);
                $("#login_main").removeAttr("style");
                $("#login").click(login);
                //$("body").keydown(function () {
                //    if (event.keyCode == "13") {//keyCode=13是回车键
                //        $("#login").click();
                //    }
                //});
                rs = true;
            } else {
                if (data.total == 0) {
                    $("#no_main").show();
                    $("body").attr("style", "background-color:#f1f9ee;");
                };
            };
        }
    });
    return rs;
};
// 登录
function login_click() {
    var sel = $("#role input[name='usertype']:checked").val();
    var username = $("#username").val();
    var password = $("#password").val();
    var checkcode = $("#checkcode").val();
    if (username == "") {
        alert("请输入用户名！");
        $("#username").focus();
        return;
    };
    if (password == "") {
        alert("请输入密码！");
        $("#password").focus();
        return;
    };
    if (checkcode == "") {
        alert("请输入验证码！");
        $("#checkcode").focus();
        return;
    };
    $.cookie("login_usr_role", sel, { expires: 30 });//记录下用户的角色
    $.ajax({
        url: "../Handler/LoginHandler.ashx",
        data: { "action": "login", "yhm": username, "mm": password, "yzm": checkcode, "js": sel },
        dataType: "json",
        beforeSend: function () {
            open_loading();
        },
        type: "POST",
        success: function (data) {
            if (data.isSuccess) {
                if (data.errorCode == 980) {
                    window.location = "PhoneBinding.html?r=" + (+new Date());
                } else {
                    switch (sel) {
                        case "1":
                        case "2":
                        case "3":
                            window.location = "Role.html?r=" + (new Date()).getTime();
                            break;
                    };
                }
            } else {
                alert(data.message);
            };
        },
        error: function (err) {
            console.log(err);
        },
        complete: function () {
            load_checkcode();
            close_loading();
        }
    });
};