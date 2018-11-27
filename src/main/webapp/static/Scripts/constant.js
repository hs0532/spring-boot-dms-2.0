//使用时value减少2
var sh = [
    { name: "全部", value: 0 },
    { name: "审核不通过", value: 1, css: "txt_red" },
    { name: "等待审核", value: 2, css: "txt_yellow" },
    { name: "等待指导教师审核", value: 5, css: "txt_yellow" },
    { name: "等待专业负责人审核", value: 6, css: "txt_yellow" },
    { name: "等待教学秘书审核", value: 7, css: "txt_yellow" },
    { name: "等待院长审核", value: 8, css: "txt_yellow" },
    { name: "等待管理员审核", value: 1002, css: "txt_yellow" },
    { name: "不审核", value: 1003, css: "" },
    { name: "审核通过", value: 3, css: "txt_green" }
];
//答疑安排星期
var dyxq = [
    { name: "请选择", value: '' },
    { name: "星期一", value: 1 },
    { name: "星期二", value: 2 },
    { name: "星期三", value: 3 },
    { name: "星期四", value: 4 },
    { name: "星期五", value: 5 },
    { name: "星期六", value: 6 },
    { name: "星期日", value: 7 },
];

var xzms = [
    { name: "全部", value: 0 },
    { name: "师生互选课题", value: 1 },
    { name: "指定学生课题", value: 2 },
    { name: "学生申报课题", value: 3 },
    { name: "团队课题", value: 4 }];

//1学生提交0教师提交
var taskstatic = [
    { name: "全部", value: "all", "selected": true },
    { name: "学生提交", value: "2" },
    { name: "教师提交", value: "1" },
    { name: "未提交", value: "0" }
];

//下发状态  1下发0未下发
var Taskxf = [
    { name: "全部", value: "all", "selected": true },
    { name: "已下发", value: "1" },
    { name: "未下发", value: "0" }
];

//审核状态   0z未审核,1审核通过,-1审核不通过
var Auditor = [
    { name: "全部", value: "", "selected": true },
    { name: "未审核", value: "0" },
    { name: "审核通过", value: "1" },
    { name: "审核不通过", value: "-1" }
];

// 委托状态 0为委托1已委托all全部
var entrust_state = [
        { name: "全部", value: "", "selected": true },
        { name: "未分配", value: "0" },
        { name: "已分配", value: "1" }
];

//使用时value减少2
var student_state = [
    { name: "全部", value: 0 },
    { name: "启用", value: 2 },
    { name: "暂停", value: 1 }];
// 角色
//-1:全部;6:院长;5:教学秘书;4:专业负责人;3:指导教师;8:督导专家;9:评阅专家;
// 使用时 value - 1
var teacher_role = [
    { name: "全部", value: 0 },
    { name: "院长", value: 7 },
    { name: "教学秘书", value: 6 },
    { name: "专业负责人", value: 5 },
    { name: "指导教师", value: 4 },
    { name: "督导专家", value: 9 },
    { name: "评阅专家", value: 10 }
];

// 教师类型
//1:兼职;2:全职
var teacher_type = [
    { name: "请选择", value: 0 },
    { name: "全职", value: 2 },
    { name: "兼职", value: 3 }
];
// 课题全责 已确定和未确定
var project_select = [
    { name: "请选择", value: 0 },
    { name: "已确定双选", value: 1 },
    { name: "等待确认过程中", value: 2 },
    { name: "未进行或未通过双选", value: 3 }
];
//学年模块  -1
var school_year = [
    { name: "请选择", value: 0 },
    { name: "申报课题", value: 1 },
    { name: "提交开题报告", value: 2 },
    { name: "提交中期检查", value: 3 },
    { name: "提交毕设论文", value: 4 },
    { name: "提交指导记录", value: 5 },
    { name: "提交文献综述", value: 6 },
    { name: "提交外文译文", value: 7 },
    { name: "评审和答辩", value: 8 },
    { name: "学生选题", value: 9 },
    { name: "提交任务书", value: 10 }
];

//导出文档类型 
var Export_type = [
    { name: "无需导出", value: -1 },
    { name: "WORD", value: 0 },
    { name: "PDF", value: 1 },
    { name: "WORD和PDF", value: 2 }
];

var Special_Type = [
    { name: "请选择", value: 0 },
    { name: "文科", value: 1 },
    { name: "理工科", value: 2 }
];
// 申报人角色
var declarant_role = [
    { name: "全部", value: "all", "selected": true },
    { name: "教师", value: 1 },
    { name: "学生", value: 0 }
];
//提交状态
var submitState = [
    { name: "全部", value: "all", "selected": true },
    { name: "未提交", value: 0 },
    { name: "已提交", value: 1 }
];
//审核状态
var auditor = [
    { name: "全部", value: "all", "selected": true },
    { name: "审核通过", value: 1 },
    { name: "等待审核", value: 0 },
    { name: "审核不通过", value: -1 }
];
//答辩成绩切换
var dbcj = [
    { name: "全部", value: "0", "selected": true },
    { name: "一辩成绩", value: 1 },
    { name: "二辩成绩", value: 2 }
];
//是否分配评阅专家
var pyzj = [
    { name: "全部", value: "-1", "selected": true },
    { name: "无评阅专家", value: 0 },
    { name: "已经安排评阅专家", value: 1 }
];
//学科门类/学位类型
var Special_DisciplineGenre = [
    { name: "请选择", value: 0 },
    { name: "哲学", value: 1 },
    { name: "经济学", value: 2 },
    { name: "法学", value: 3 },
    { name: "教育学", value: 4 },
    { name: "文学", value: 5 },
    { name: "历史学", value: 6 },
    { name: "理学", value: 7 },
    { name: "工学", value: 8 },
    { name: "农学", value: 9 },
    { name: "医学", value: 10 },
    { name: "军事学", value: 11 },
    { name: "管理学", value: 12 },
    { name: "艺术学", value: 13 }
];


// 成绩（指导、评阅、专家）
var answer_grade = [
    { name: "请选择", value: -1, "selected": true },
    { name: " >=60 ", value: 1 },
    { name: " >=70 ", value: 2 },
    { name: " >=80 ", value: 3 },
    { name: " >=90 ", value: 4 }
];
// 复制比
var answer_reproduction_ratio = [
    { name: "请选择", value: -1, "selected": true },
    { name: " <= 5% ", value: 1 },
    { name: " <= 10% ", value: 2 },
    { name: " <= 15% ", value: 3 },
    { name: " <= 20% ", value: 4 },
    { name: " <= 25% ", value: 5 },
    { name: " <= 30% ", value: 6 },
    { name: " <= 35% ", value: 7 },
    { name: " <= 40% ", value: 8 },
    { name: " <= 45% ", value: 9 },
    { name: " <= 50% ", value: 10 }
];

//登录前使用
function school_init() {
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
                //如果学校的logo和名字有值才显示
                if (data.rows[0]["图片路径"] && data.rows[0]["学校名称"]) {
                    $("#school_logo,#school_name").show();
                };
                $("#school_logo").attr("src", data.rows[0]["图片路径"]);
                $("#school_name").text(data.rows[0]["学校名称"]);
                if (data.rows[0]["系统名称"]) {
                    $("#xtmc").text(data.rows[0]["系统名称"]);
                };
                $("#xtmc").show();
                $("#login_main").removeAttr("style");
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

var cur_role_id = "";
//登录后调用
function school_load(show) {
    if (show == undefined) {
        show = true;
    };
    $.ajax({
        url: "../Handler/UserHandler.ashx",
        data: { "action": "GetUserRoleName" },
        async: false,
        dataType: "json",
        type: "POST",
        success: function (data) {
            if (data.isSuccess == true) {
                if (show) {
                    //用户信息
                    var userInfo = data.dataList.userInfo;
                    if (userInfo[0]["图片"]) {
                        $("#school_logo").show();
                    };
                    if (userInfo[0]["学校名称"]) {
                        $("#school_name").show();
                    };
                    if (userInfo[0]["系统名称"]) {
                        $("#R_xtmc").show();
                    };
                    //是否显示写作助手
                    if (userInfo[0]["开通写作助手"] == 1) {
                        $("#writingHelper").show();
                    } else {
                        $("#writingHelper").hide();
                    };

                    $("#school_logo").attr("src", userInfo[0]["图片"]);
                    $("#school_name").text(userInfo[0]["学校名称"]);
                    $("#R_xtmc").text(userInfo[0]["系统名称"]);
                    $(".role_name").text(userInfo[0]["角色名称"]);

                    if (!checkValIsUndefinedOrNull(userInfo[0]["姓名"])) {
                        $("#user_name").text(userInfo[0]["姓名"] + "(" + userInfo[0]["用户名"] + ")");
                    } else {
                        $("#user_name").text(userInfo[0]["用户名"]);
                    };

                    $("#plan_name").text(userInfo[0]["学年"]);
                    cur_role_id = userInfo[0]["角色ID"];
                    if (cur_role_id == "1") {
                        var show_title = $("#show_title");
                        if (show_title != null && show_title != undefined) {
                            show_title.text("选择学年");
                        };
                    } else if (cur_role_id == "2") {
                        var show_title = $("#show_title");
                        if (show_title != null && show_title != undefined) {
                            show_title.text("选择专业");
                        };
                        $("#school_year_select").hide();
                    };

                    //全部自定义角色
                    var userDefinedRoles = [];
                    var roleTypes = data.dataList.roleTypes;
                    if (roleTypes && roleTypes.length > 0) {
                        $.each(roleTypes, function (index, item) {
                            if (!checkValIsUndefinedOrNull(item.名称) && !checkValIsUndefinedOrNull(item.自定义编号)) {
                                var role = {};
                                role["name"] = item.名称;
                                role["value"] = item.自定义编号;
                                if ($.inArray(role, userDefinedRoles) < 0) {
                                    userDefinedRoles.push(role);
                                };
                            };
                        });
                    };
                    try {
                        var rolesText = JSON.stringify(userDefinedRoles);
                        $("#hdUserDefinedRoles").val(rolesText);
                    } catch (e) { }
                };
            };
        }
    });
};

/**
 * 获取所有用户自定义角色，school_load()赋值
 * [{name,value}]
 */
function getUserDefinedRoles() {
    if (window.parent.getUserDefinedRoles) {
        return window.parent.getUserDefinedRoles();
    } else {
        return [];
    };
};

/**
 * 获取AuthToken
 */
function getAuthToken() {
    var token = "";
    if (window.parent.getAuthTokenInMain) {
        token = window.parent.getAuthTokenInMain();
    };
    return token;
};

function get_current_role() {
    if (window.parent.cur_role_id != undefined && window.parent.cur_role_id != "") {
        return window.parent.cur_role_id;
    } else {
        school_load();
        return cur_role_id;
    };
};
function project_openframe() {
    var role = get_current_role();
    close_loading();
    if (role == "3") {
        refreshTab('教师申报课题');
        closeTab('添加课题', getUrlParam('id'));
        closeTab('课题详细信息', getUrlParam('id'));
        closeTab('修改课题', getUrlParam('id'));
    } else if (role == "2") {
        refreshTab('学生申报课题');
        refreshTab('首页');
        closeTab('课题详细信息', getUrlParam('id'));
        closeTab('录入课题', getUrlParam('id'));
        closeTab('修改课题', getUrlParam('id'));
    } else {
        //refreshTab('查看课题信息');
        //refreshTab('课题详细信息', getUrlParam('id'));
        reload('查看课题信息', 'list');
        closeTab('添加课题', getUrlParam('id'));
        closeTab('修改课题', getUrlParam('id'));
    };
};


function task_openframe() {
    var role = get_current_role();
    if (role == "3") {
        refreshTab('提交和下发任务书');
        closeTab('任务书详细信息', getUrlParam('id'));
        closeTab('提交任务书', getUrlParam('id'));
        closeTab('修改任务书', getUrlParam('id'));
    } else if (role == "2") {
        refreshTab('任务书信息');
        closeTab('查看任务书');
        //closeTab('任务书信息');
        closeTab('修改任务书');
        //refreshTab('任务书信息');
        //openframe('任务书信息', 'Task/Details.html',false);
    } else {
        refreshTab('查看任务书');
        closeTab('提交任务书', getUrlParam('id'));
        closeTab('修改任务书', getUrlParam('id'));
    };
};

function system_quit() {
    $.ajax({
        url: "../Handler/UserHandler.ashx",
        data: { "action": "ExitSystem" },
        async: false,
        dataType: "json",
        type: "POST",
        success: function (data) {
            if (data.isSuccess == true) {
                window.location = "Login.html";
            };
        }
    });
};

var cur_role_tid = "";
function get_current_role_tid() {
    if (window.parent.cur_role_tid != undefined && window.parent.cur_role_tid != "") {
        return window.parent.cur_role_tid;
    } else {
        role_tid();
        return cur_role_tid;
    };
};

function role_tid() {
    $.ajax({
        url: "../Handler/CommonHandler.ashx",
        data: { "action": "GetCurrentUserId" },
        async: false,
        dataType: "text",
        type: "POST",
        success: function (data) {
            if (data != null) {
                cur_role_tid = data;
            };
        }
    });
};


//任务书提交模式
var cur_task_type = "";
function get_task_type() {
    if (window.parent.cur_task_type != undefined && window.parent.cur_task_type != "") {
        return window.parent.cur_task_type;
    } else {
        tasktype();
        return cur_task_type;
    };
};

function tasktype() {
    $.ajax({
        url: "../Handler/CommonHandler.ashx",
        data: { "action": "GetTaskType" },
        async: false,
        dataType: "text",
        type: "POST",
        success: function (data) {
            if (data != null) {
                cur_task_type = data;
            };
        }
    });
};

//课题提交模式
var cur_project_type = "";
function get_project_type() {
    if (window.parent.cur_project_type != undefined && window.parent.cur_project_type != "") {
        return window.parent.cur_project_type;
    } else {
        projecttype();
        return cur_project_type;
    };
};

function projecttype() {
    $.ajax({
        url: "../Handler/CommonHandler.ashx",
        data: { "action": "GetProjectType" },
        async: false,
        dataType: "text",
        type: "POST",
        success: function (data) {
            if (data != null) {
                cur_project_type = data;
            };
        }
    });
};

/**
 * 获取审核状态对应的CSS
 * @param {number} state 
 */
function getAuditCss(state) {
    var auditCss = "";
    $.each(sh,
        function (index, item) {
            if (item.value - 2 == state) {
                auditCss = item.css;
                return false;
            };
        });
    return auditCss;
};

/**
 * 获取审核状态文本，IE8及以下需要引用json2.js
 * @param {number} state
 * @param {number} opeType 参考Model.OperationLogType
 */
function getAuditStateText(state, opeType) {
    var text = "";
    if (state == -1) {
        switch (+opeType) { // ==== 全等号
            case 1: //开题报告
            case 2: //外文译文
            case 3: //指导记录
            case 5: //中期报告
            case 7: //任务书
            case 10://文献综述
            case 14: //中期检查(学院)
            case 15: //中期检查(专业)
            case 16: //中期检查(班级)
                text = "返回修改";
                break;
            default:
                break;
        };
    };

    //用户自定义角色名称
    if (checkValIsUndefinedOrNull(text)) {
        //只找等待审核
        if (state != -1 && state != 1 && state != 1001) {
            var userDefinedRoles = getUserDefinedRoles();
            if (userDefinedRoles && userDefinedRoles.length > 0) {
                var roleState = state;
                if (state == 1000) { //等待管理员审核
                    roleState = 1;
                };
                $.each(userDefinedRoles, function (index, item) {
                    if (item.value == roleState) {
                        text = "等待" + item.name + "审核";
                        return false;
                    };
                });
            };
        };
    };

    //用户没有自定义角色名称
    if (checkValIsUndefinedOrNull(text)) {
        $.each(sh, function (index, item) {
            if (item.value - 2 == state) {
                text = item.name;
                return false;
            }
        });
    };
    return text;
};

function getsubcss(type) {
    var text = "";
    switch (+type) {
        case 0:
            text = "<span class='wd-nosub'>未提交</span>";
            break;
        case 1:
            text = "<span class='txt_green'>已提交</span>";
            break;
        default:
            break;
    };
    return text;
};

function getteacher(type) {
    var text = "";
    switch (+type) {
        case 0:
            text = "<span class='txt_yellow'>等待指导教师确认学生选题</span>";
            break;
        case 1:
            text = "<span class='txt_green'>指导教师确认通过学生选题</span>";
            break;
        case -1:
            text = "<span class='txt_red'>指导教师确认不通过学生选题</span>";
            break;
        default:
            break;
    };
    return text;
};


function getprojetype(type) {
    var text = "";
    switch (+type) {
        case 1:
            text = "师生互选课题";
            break;
        case 2:
            text = "指定学生课题";
            break;
        case 3:
            text = "学生提交课题";
            break;
        case 4:
            text = "团队课题";
            break;
        default:
            break;
    };
    return text;
};

/**
 * 获取角色名称
 * @param {Number} role 角色代码
 */
function getRoleName(role) {
    var roleName = "";
    var userDefinedRoles = getUserDefinedRoles();
    if (userDefinedRoles && userDefinedRoles.length > 0) {
        $.each(userDefinedRoles, function (index, item) {
            if (item.value == role) {
                roleName = item.name;
                return false;
            };
        });
    };
    return roleName;
};

/**
 * 获取当前角色学院编号
*/
var cur_role_academyId = "";
function get_role_academyId() {
    if (window.parent.cur_role_academyId != undefined && window.parent.cur_role_academyId != "") {
        return window.parent.cur_role_academyId;
    } else {
        role_academyId();
        return cur_role_academyId;
    };
};

function role_academyId() {
    $.ajax({
        url: "../Handler/CommonHandler.ashx",
        data: { "action": "GetCurrentAcademyId" },
        async: false,
        dataType: "text",
        type: "POST",
        success: function (data) {
            if (data != null) {
                cur_role_academyId = data;
            };
        }
    });
};

/**
 * 获取附件(有附件时显示/没附件时不显示)
 */
function getAttachment(opeType, projectId, sid, id) {
    $.ajax({
        url: "../Handler/OpenReport.ashx?action=GetAttachent",
        dataType: "json",
        type: "POST",
        data: {
            opeType: opeType,
            projectId: projectId,
            sid: sid,
            id: id
        },
        success: function (data) {
            if (data.isSuccess == true) {
                if (data.rows.length !== 0) {
                    if (data.rows[0]["文件名"] !== "" && data.rows[0]["附件"] !== "") {
                        $("#fujian").show();
                        $("#accessory>span").html(data.rows[0]["文件名"]);
                        $("#accessory>a").attr({ "href": data.rows[0]["附件"], download: data.rows[0]["文件名"] });
                    } else {
                        $("#fujian").hide();
                    };
                };
            };
        }
    });
};

function getAttachmenthisory(opeType, projectId, sid, id, isHistory) {
    $.ajax({
        url: "../Handler/OpenReport.ashx?action=GetAttachent",
        dataType: "json",
        type: "POST",
        data: {
            opeType: opeType,
            projectId: projectId,
            sid: sid,
            id: id,
            isHistory: isHistory
        },
        success: function (data) {
            if (data.isSuccess == true) {
                if (data.rows.length !== 0) {
                    if (data.rows[0]["文件名"] !== "" && data.rows[0]["附件"] !== "") {
                        $("#fujian").show();
                        $("#accessory>span").html(data.rows[0]["文件名"]);
                        $("#accessory>a").attr({ "href": data.rows[0]["附件"], download: data.rows[0]["文件名"] });
                    } else {
                        $("#fujian").hide();
                    };
                };
            };
        }
    });
};

function openstuhistoryfile(opeType, projectId, sid) {
    var text = "";
    switch (opeType) {
        case 1: //开题报告
            text = "开题报告历史纪录";
            break;
        case 2: //外文译文
            text = "外文译文历史纪录";
            break;
        case 5: //中期报告
            text = "中期报告历史纪录";
            break;
        case 10://文献综述
            text = "文献综述历史纪录";
            break;
        default:
            break;
    };
    //是否有历史记录
    $.ajax({
        url: "../Handler/OpenReport.ashx",
        data: {
            "action": "GetStuFileHistory",
            projectId: ktbh,
            sid: sid,
            opeType: opeType
        },
        dataType: "json",
        type: "POST",
        success: function (data) {
            if (data.isSuccess) {
                $("#distorylink").show();
                $("#distorylink").attr({
                    "href": 'javascript:openframe(\'' + text + '\', \'../Student/StuHistoryFile.html?projectId='
                        + projectId + '&sid=' + sid + '&opeType=' + opeType + '\',false)'
                });
            } else {
                $("#distorylink").hide();
            };
        },
        error: function (err) {
            console.log(err);
        }
    });
};

/**
 * 柱状图(百分比统计)
 */
function barChart(x, y, title, labelX, labelY) {
    var s1 = x;
    var ticks = y;
    var plot2b = $.jqplot('chart', [s1], {
        title: title,
        animate: !$.jqplot.use_excanvas,
        seriesColors: ["#ffc106", "#ff8d0e", "#f5660a", "#e12208", "#a1ad2a", "#6ca13a", "#3c7e36", "#385840", "#529baf", "#2e509d", "#3c329d", "#7e5ccb", "#952278", "#3c87af", "#6ea581", "#bb0a30", "#b19370", "#404c52", "#c17446", "#2aa387", "#48748f"],
        //seriesColors: ['#fec106', '#fe8c0f', '#f4670b', '#e12208', '#a0ad2a', '#6da03b', '#3c7e37', '#385841', '#529bae', '#2f509d', '#3c339c', '#7e5cca', '#952378', '#3d87ae', '#6ea580', '#bb0b31', '#b09270', '#414c52', '#c17447', '#2aa287', '#49758e'],
        seriesDefaults: {
            renderer: $.jqplot.BarRenderer,
            pointLabels: { show: true },
            rendererOptions: {
                varyBarColor: true,
                barDirection: 'horizontal',
                barWidth: 20
            }
        },
        axes: {
            xaxis: {
                label: labelX,
                tickOptions: {
                    show: true,
                    showLabel: true,
                    showMark: true,
                    showGridline: true,
                    formatString: '%.2f %'
                }
            },
            yaxis: {
                pad: 20,
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks,
                label: labelY
            }
        },
        highlighter: { show: true }
    });
};

//折线图(篇数)
function lineChartCount(chertId, x, y, title) {
    var ticks = y;
    var s1 = x;
    var plot2b = $.jqplot(chertId, [s1], {
        title: title,
        seriesDefaults: {
            pointLabels: { show: true },
            rendererOptions: {
                smooth: true//曲线
            }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: -45,//倾斜角度
                    fontSize: '10pt'
                },
                ticks: ticks
            },
            yaxis: {
                min: 0,
                tickOptions: {
                    formatString: "%'d篇"
                },
                rendererOptions: {
                    alignTicks: true,
                    forceTickAt0: true
                }
            }
        },
        highlighter: {//高亮
            show: true,
            showLabel: true,
            tooltipAxes: 'y',
            sizeAdjust: 7.5,
            tooltipOffset: 4,
            tooltipLocation: 'nw'
        }
    });
};

//折线图(百分比)
function lineChartPercent(chertId, x, y, title) {
    var ticks = y;
    var s1 = x;
    var plot2b = $.jqplot(chertId, [s1], {
        title: title,
        seriesDefaults: {
            pointLabels: { show: true },
            rendererOptions: {
                smooth: true//曲线
            }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: -45,//倾斜角度
                    fontSize: '10pt'
                },
                ticks: ticks
            },
            yaxis: {
                min: 0,
                tickOptions: {
                    formatString: "%'d%"
                },
                rendererOptions: {
                    forceTickAt0: true
                }
            }
        },
        highlighter: {//高亮
            show: true,
            showLabel: true,
            tooltipAxes: 'y',
            sizeAdjust: 7.5,
            tooltipOffset: 4,
            tooltipLocation: 'nw'
        }
    });
};
//饼状图(百分比;数字)
function pieChart(id, data, title) {
    var total = 0;
    $(data).map(function () { total += this[1]; });
    //var arrLabels = $.makeArray($(data).map(function () { return parseFloat(this[1] / total * 100).toFixed(2) + "%;" + this[1]; }));
    var arrLabels = $.makeArray($(data).map(function () { return Math.round(this[1] / total * 100) + "%;" + this[1]; }));
    var plot2b = $.jqplot(id, [data], {
        title: {
            text: title,//设置当前图的标题
            show: true//设置当前图的标题是否显示
        },
        seriesColors: ["#ffc106", "#ff8d0e", "#f5660a", "#e12208", "#a1ad2a", "#6ca13a", "#3c7e36", "#385840", "#529baf", "#2e509d", "#3c329d", "#7e5ccb", "#952278", "#3c87af", "#6ea581", "#bb0a30", "#b19370", "#404c52", "#c17446", "#2aa387", "#48748f"],
        grid: {
            drawBorder: false,
            drawGridlines: false,
            shadow: false
        },
        seriesDefaults: {
            renderer: $.jqplot.PieRenderer,
            rendererOptions: {
                sliceMargin: 0,// 饼的每个部分之间的距离
                fill: true,// 设置饼的每部分被填充的状态
                shadow: false,//为饼的每个部分的边框设置阴影，以突出其立体效果
                startAngle: -90,//开始位置(12点方向)
                dataLabels: arrLabels,
                dataLabelsFormatString: '%s',
                showDataLabels: true
            }
        },
        legend: {
            show: true,//分类名称框是否显示
            location: 'ne',// 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
            xoffset: 1,// 分类名称框距图表区域上边框的距离(单位px)
            yoffset: 1,// 分类名称框距图表区域左边框的距离(单位px)
            background: '#fafafa',//分类名称框距图表区域背景色  
            textColor: '#fafafa'//分类名称框距图表区域内字体颜色
        }
    });
}

// 检测结果样式处理
function WarningPicture_Long(copy) {
    if (copy < 0 || copy >= 1000) {
        return GetErrorWords(copy);
    } else {
        if (copy == null) {
            return "";
        } else if (copy >= 50) {
            return "<span class=\"per_r\" title=\"文字复制比\">" + copy + "%</span>";
        } else if (copy >= 40) {
            return "<span class=\"per_o\" title=\"文字复制比\">" + copy + "%</span>";
        } else if (copy > 0) {
            return "<span class=\"per_y\" title=\"文字复制比\">" + copy + "%</span>";
        } else {
            return "<span class=\"per_g\" title=\"文字复制比\">0%</span>";
        };
    };
};

function GetErrorWords(copy) {
    if (copy == -8) {
        return "<span style=\"color:#FF0000\">检测出错</span>";
    } else if (copy == -4) {
        return "<span style=\"color:#666666\">格式不符</span>";
    } else if (copy == -5) {
        return "<span style=\"color:#666666\">读取失败</span>";
    } else if (copy == -6) {
        return "<span style=\"color:#666666\">内容太长</span>";
    } else if (copy == -3) {
        return "<span style=\"color:#666666\">内容过短，不支持检测</span>";
    } else if (copy == -9) {
        return "<span style=\"color:#666666\">未检测</span>";
    } else if (copy == -7) {
        return "<span style=\"color:#666666\">正在解析</span>";
    } else if (copy == -10) {
        return "<span style=\"color:#666666\">文档解析失败</span>";
    } else if (copy == -11) {
        return "<span style=\"color:#666666\">解析失败</span>";
    } else if (copy == 1000) {
        return "<span style=\"color:#666666\">文件保存失败</span>";
    } else if (copy == 1100) {
        return "<span style=\"color:#666666\">内容过短，不支持检测</span>";
    } else if (copy == 1101) {
        return "<span style=\"color:#666666\">内容太长</span>";
    } else if (copy == 1102) {
        return "<span style=\"color:#666666\">格式不符</span>";
    } else if (copy == 1103) {
        return "<span style=\"color:#666666\">文件读取错误</span>";
    } else if (copy == 1104) {
        return "<span style=\"color:#666666\">压缩包部分文件未检测</span>";
    } else if (copy == 1105) {
        return "<span style=\"color:#666666\">压缩包内文件内容获取失败</span>";
    } else if (copy == 1106) {
        return "<span style=\"color:#666666\">未知错误</span>";
    } else if (copy == 1107) {
        return "<span style=\"color:#666666\">剩余检测篇数不足</span>";
    } else if (copy == 1108) {
        return "<span style=\"color:#666666\">今日上传数量已达上限</span>";
    } else if (copy == 1109) {
        return "<span style=\"color:#666666\">未付费文章数量已达上限</span>";
    } else {
        return "<span style=\"color:#FF0000\">处理中</span>";
    };
};

/**
 * 替换 <号为&lt;、 >号为 &gt;
 */
function replaceUnequa(data) {
    if (!checkValIsUndefinedOrNull(data)) {
        if (data.indexOf("<") !== -1) {
            data = data.replace(/</g, "&lt;");
        }
        if (data.indexOf(">") !== -1) {
            data = data.replace(/>/g, "&gt;");
        }
        if (data.indexOf("<=") !== -1) {
            data = data.replace(/<=/g, "&le;");
        }
        if (data.indexOf(">=") !== -1) {
            data = data.replace(/>=/g, "&ge;");
        }
    };
    return data;
};
/**
 * 替换 &lt;号为<、  &gt;号为>
 */
function retrieveUnequa(data) {
    if (!checkValIsUndefinedOrNull(data)) {
        if (data.indexOf("&lt;") !== -1) {
            data = data.replace(/&lt;/g, "<");
        };
        if (data.indexOf("&gt;") !== -1) {
            data = data.replace(/&gt;/g, ">");
        };
        if (data.indexOf("&le;") !== -1) {
            data = data.replace(/&le;/g, "<=");
        };
        if (data.indexOf("&ge;") !== -1) {
            data = data.replace(/&ge;/g, ">=");
        };
    };
    return data;
};
/**
 * 替换 <br />为换行符
 */
function retrieveBr(data) {
    if (!checkValIsUndefinedOrNull(data)) {
        data = data.replace(/(<br>)|(<br\/>)|(<br \/>)/g, "\n");
    }
    return data;
};
/**
 * 替换 换行符为<br />
 */
function replaceBr(data) {
    if (!checkValIsUndefinedOrNull(data)) {
        data = data.replace(/(\n\n\n\n)|(\n\n\n)|(\n\n)|\n/g, "<br />");
    };
    return data;
};

//判断是否在时间范围之内,funModelEnum 1开题报告，2中期报告，3论文，4指导记录，5文献综述，6中英文
function GetSetTimeRs(funModelEnum) {
    var rs = true;
    $.ajax({
        url: "../Handler/SuperAuthority.ashx",
        type: "post",
        dataType: "json",
        async: false,//同步处理
        data: {
            action: "GetSetTimeRs",
            funModelEnum: funModelEnum
        },
        success: function (result) {
            if (result.isSuccess == false) {
                rs = false; //为false的时候说明已经超出了设定时间
            }
        },
        error: function (err) {
            alert("获取数据失败");
        }
    });
    return rs;
};


// 审核状态
function getCheckState(opeType, checkedId) {
    $.ajax({
        url: "../Handler/Project.ashx",
        data: {
            action: "GetAllAuditState",
            opeType: opeType
        },
        dataType: "json",
        type: "POST",
        success: function (data) {
            if (data.isSuccess == true) {
                data.rows.unshift({ "StateValue": "all", "StateText": "全部", selected: true });
                $("#" + checkedId).combobox({
                    valueField: 'StateValue',
                    textField: 'StateText',
                    data: data.rows
                });
            };
        },
        error: function (err) {
            console.log(err);
        }
    });
};
