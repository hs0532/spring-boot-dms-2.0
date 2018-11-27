
function GteTable(objectId, url, columnData, paramsData, idField, showPagination, rownumbers) {
    if (showPagination == undefined) {
        showPagination = true;
    };
    if (rownumbers == undefined) {
        rownumbers = true;
    };
    var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
    $(objectId).datagrid({
        loadMsg: '正在加载数据，请稍等......',
        url: url,
        method: 'POST',
        queryParams: paramsData,
        lines: true,
        idField: idField,
        striped: true,
        fitColumns: true,
        rownumbers: rownumbers,
        pagination: showPagination,
        pageNumber: 1,
        nowrap: false,
        pageSize: 10,
        showFooter: true,
        checkOnSelect: true,
        columns: columnData,
        singleSelect: false,
        selectOnCheck: true,
        scrollbarSize: 0,
        onLoadSuccess: function (data) {
            if (data && !data.isSuccess) {
                if (console && console.error) {
                    console.error("错误代码：" + (data.errorCode || "") + "，错误消息：" + (data.message || ""));
                };
            };
            dtd.resolve(data); // 改变Deferred对象的执行状态，触发done()
        },
        onLoadError: function (data) {
            if (console && console.error) {
                console.error(data);
            };
            dtd.reject(data); // 改变Deferred对象的执行状态，触发fail()
        }
    });
    $(objectId).datagrid('getPager').pagination({
        showPageList: false,
        beforePageText: '当前是第',
        afterPageText: '页，共{pages}页',
        displayMsg: '当前显示从第{from}条到{to}条，共{total}条记录'
    });
    $(objectId).datagrid("clearSelections");
    return dtd.promise(); // 返回promise对象
};
function GteTable1(objectId, columnData) {
    $(objectId).datagrid({
        loadMsg: '正在加载数据，请稍等......',
        lines: true,
        idField: idField,
        striped: true,
        fitColumns: true,
        rownumbers: rownumbers,
        pagination: showPagination,
        nowrap: false,
        pageSize: paramsData.length,
        showFooter: true,
        checkOnSelect: true,
        columns: columnData,
        singleSelect: false,
        selectOnCheck: true,
        scrollbarSize: 0
    });
};

/**
 * loadData, 用JSON格式数据填充DataTable
 * @param {any} objectId
 * @param {any} columnData
 * @param {any} json
 * @param {any} fitColumns
 */
function GteTableJson(objectId, columnData, json, fitColumns, rownumbers) {
    if (fitColumns == undefined) {
        fitColumns = true;
    };
    if (rownumbers == undefined) {
        rownumbers = false;
    };
    $(objectId).datagrid({
        loadMsg: '正在加载数据，请稍等......',
        lines: true,
        striped: true,
        fitColumns: fitColumns,
        rownumbers: rownumbers,
        nowrap: false,
        showFooter: true,
        checkOnSelect: true,
        columns: columnData,
        singleSelect: false,
        selectOnCheck: true,
        scrollbarSize: 0
    });
    $(objectId).datagrid('loadData', json);
};

//function reloadList(listID) {
//    window.top["reload_Abnormal_Monitor"] = function (listID) {
//        $("#" + listID).datagrid('reload');
//        $('#' + listID).datagrid("clearSelections");
//    };
//};

// 刷新兄弟（title）页面列表
function reload(title, listID) {
    var iframe = window.parent.$('iframe');
    for (var i = 1; i < iframe.length; i++) {
        if (iframe[i].title == title) {
            if (window.parent.jumpToTabs(title)) {
                iframe[i].contentWindow.reloadList(listID);
            };
        };
    };
};
// 刷新列表
function reloadList(listID) {
    $('#' + listID).datagrid("clearSelections");
    $("#" + listID).datagrid('reload');
};


function delete_confrim(messgeid, gridid, index, key, show, del_fun) {
    var grid = $("#" + gridid);
    var rows = grid.datagrid("getData").rows;
    var title = "";
    if (show != "") {
        title = "(" + rows[index][show] + ")";
    };
    var message_str = "您是否要删除此数据" + title + "？";
    var box = $("#" + messgeid);
    box.text(message_str);
    box.dialog({
        title: '删除',
        modal: true,
        top: 50,
        buttons: [
            {
                text: '确定',
                handler: function () {
                    if (del_fun != undefined) {
                        del_fun(rows[index][key]);
                        $(box).dialog('close');
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    $(box).dialog('close');
                    grid.datagrid("clearSelections");
                }
            }
        ]
    });
    box.dialog('open').window('center');
};

function show_confrim(messgeid, messge, gridid, index, key, show, del_fun) {
    var grid = $("#" + gridid);
    var rows = grid.datagrid("getData").rows;
    var title = "";
    if (show != "") {
        title = "(" + rows[index][show] + ")";
    };
    var message_str = "您确定要" + messge + "(" + title + ")？";
    var box = $("#" + messgeid);
    box.text(message_str);
    box.dialog({
        title: messge,
        modal: true,
        buttons: [
            {
                text: '确定',
                handler: function () {
                    if (del_fun != undefined) {
                        del_fun(rows[index][key]);
                        $(box).dialog('close');
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    $(box).dialog('close');
                    grid.datagrid("clearSelections");
                }
            }
        ]
    });

    box.dialog('open').window('center');
};
function getid() {
    return $.ajax({
        url: "../Handler/CommonHandler.ashx?action=GetSessionID",
        async: false,
        dataType: "text",
        type: "POST"
    }).responseText;
};

//one=false才能打开多个窗口
function openframe(title, url, one, listID) {
    if (window.parent.addTab != undefined) {
        if (!checkValIsUndefinedOrNull(url) && url.indexOf("prevTitle") < 0) { //前一个页面
            var curTitle = getCurrentTabTitle();
            if (!checkValIsUndefinedOrNull(curTitle)) {
                //if ( listID) {
                //    var page = $("#" + listID).datagrid('getPager').data("pagination").options.pageNumber;
                //    $.cookie("role_" + get_current_role() + "_" + getCurrentTabTitle(), page);
                //}
                if (url.indexOf("?") >= 0) {
                    url += "&";
                } else {
                    url += "?";
                };
                url += "prevTitle=" + escape(curTitle);
            };
        };
        window.parent.addTab(title, url, one);
    } else {
        var temp = url.indexOf('/');
        var newurl = url.substring(temp + 1);
        window.open(newurl);
    };
};

/*
* 跳转到指定页码（id为列表id,  cookieValue为保存页码cookie的键）
*/
//var page = $.cookie ? ($.cookie("role_" + get_current_role() + "_" + getCurrentTabTitle()) || 1) : 1;
//$(objectId).datagrid('getPager').data("pagination").options.pageNumber = page;
//function RefreshPageNumber(id, cookieValue) {
//    //获取dataGrid的分页对象
//    var $getPager = $("#" + id).datagrid('getPager');
//    var $pagination = $($getPager).pagination("options");
//    if ($pagination != undefined) {
//        $pagination.pageNumber = $.cookie(cookieValue) || 1;
//    }
//}


/**
 * 获取当前Tab
 */
function getCurrentTab() {
    if (window.parent.getCurrentTab) {
        return window.parent.getCurrentTab();
    } else {
        return null;
    };
};

/**
 * 获取当前Tab标题
 */
function getCurrentTabTitle() {
    var curTab = getCurrentTab();
    var title = "";
    if (curTab) {
        title = curTab.panel('options').title;
    };
    return title;
};

/**
 * 刷新Tab
 * @param {string} title Tab标题
 */
function refreshTab(title) {
    if (!checkValIsUndefinedOrNull(title) && window.parent.refreshTab) {
        window.parent.refreshTab(title);
    };
};

/**
 * 刷新Tab
 * @param {any} tab 标签页面
 */
function refreshTab2(tab) {
    if (tab && window.parent.refreshTab2) {
        window.parent.refreshTab2(tab);
    };
};

/**
 * 关闭Tab
 * @param {string} title Tab标题
 */
function closeTab(title, id) {
    if (!checkValIsUndefinedOrNull(title) && window.parent.closeTab) {
        window.parent.closeTab(title, id);
    };
};

/**
 * 关闭当前Tab
 */
function closeCurTab() {
    if (window.parent.closeCurTab) {
        window.parent.closeCurTab();
    };
};
//导出excel方法
function download(url) {
    var temp = $("<div style='width:1px;height:1px;overflow:hiden;'><form id=\"frmExport\" name=\"frmExport\" method=\"post\" action=\"\"></form></div>");
    $("body").append(temp);
    $("#frmExport").attr("action", url);
    $("#frmExport").submit();
};
//导出excel方法
//function download(url) {
//    $.ajax({
//        url: url,
//        type: "post",
//        dataType: "json",
//        success: function (data) {
//            if (!data.isSuccess) {
//                myMessage(data.message)
//            };
//        }
//    });
//};
//从URL中提取参数值
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};
function getStringParam(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    if (url.indexOf("?") > -1) {
        url = url.substring((url.indexOf("?") + 1));
    };
    var r = url.match(reg);  //匹配目标参数 ===> url为？以及后面的部分
    if (r != null) return unescape(r[2]); return null; //返回参数值
};

//格式化日期
function dateFormat(dateString, format) {
    if (!dateString) return "";
    var dotIndex = dateString.indexOf(".");//IE下日期不支持后面的.
    if (dotIndex > 0) {
        dateString = dateString.substring(0, dotIndex);
    };
    if (format == null)
        format = "yyyy-MM-dd hh:mm";
    var time = new Date($.trim(dateString.replace(/-/g, '/').replace(/T|Z/g, ' ')));
    var o = {
        "M+": time.getMonth() + 1, //月份
        "d+": time.getDate(), //日
        "h+": time.getHours(), //小时
        "m+": time.getMinutes(), //分
        "s+": time.getSeconds(), //秒
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度
        "S": time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
};
//判断是否为空或NULL或Undefined
function checkValIsUndefinedOrNull(paramVal) {
    if (typeof (paramVal) == "number" || typeof (paramVal) == "boolean")
        return false;
    if (typeof (paramVal) == "undefined" || paramVal == "undefined") {
        return true;
    };
    if (paramVal == null || paramVal == "" || paramVal == "null") {
        return true;
    };
    return false;
};
//是否是数字
function isNumber(data) {
    var reg = new RegExp("^[0-9]+$");
    return reg.test(data);
};
//function myMessage(message) {
//    $.messager.alert({
//        title: '提示',
//        msg: message,
//        width: 400,
//        top: 50
//    });
//}
function myMessage(message) {
    $('<div id="tipsbox" class="easyui-dialog" style="text-align:center; padding: 10px;width:400px;height:200px" data-options="closed:true"></div>').appendTo('body');

    $('#tipsbox').text(message);
    $('#tipsbox').dialog({
        title: '提示',
        top: 50,
        left: 500,
        modal: true,
        buttons: [{
            text: '确定',
            handler: function () {
                $("#tipsbox").dialog("close");
                $("#tipsbox").remove();
            }
        }]
    });
    $("#tipsbox").dialog("open").window('center');
};
function open_loading() {
    var box = $("#loadingbox");
    //alert(box.html());
    if (box.html() == undefined || box.html() == "") {
        box = $('<div id="loadingbox" class="easyui-dialog" style="width:400px;height:200px" data-options="closed:true"><div id="loadingmessagebox">正在加载数据...</div></div>');
        box.appendTo('body');
    };
    $('#loadingbox').dialog({
        title: '提示',
        modal: true
    });
    $("#loadingbox").dialog("open").window('center');
};
function close_loading() {
    $("#loadingbox").dialog("close");
};
function UrlDecode(zipStr) {
    return decodeURIComponent(zipStr);
};

/**
 * 课题基本信息
 * @param {string} ktbh
 */
function getProjectInformation(ktbh, type) {
    if (checkValIsUndefinedOrNull(ktbh)) {
        ktbh = "";
    };
    if (checkValIsUndefinedOrNull(type)) {
        type = "";
    };
    // 课题基本信息 内容超出显示省略号 鼠标经过 显示全部
    $("body").on("mouseover", ".detadil_txt_right", function () {
        $(this).attr('title', $(this).html());
    });
    var proObj = {};
    $.ajax({
        url: "../Handler/Project.ashx",
        data: { "action": "GetProjectStuInfo", "ktbh": ktbh, "type": type },
        dataType: "json",
        type: "POST",
        async: false,
        success: function (data) {
            if (data.isSuccess == true) {
                proObj["isTrue"] = true;
                var item = data.rows[0];
                var html = '<div class="gxf_problem gxf_problem_detail">'
                                + '<div><h2><span></span>课题基本信息</h2></div>'
                                + '<div class="gxf_pro_content gxf_content_table">'
                                + '<ul class="clearfix gxf_project_detadil_ul">'
                                + '<li style="width:100%;"><span class="detadil_txt_left"> 课题题目：</span><span style="width:600px;" class="detadil_txt_right">' + item["课题题目"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 可选专业：</span><span class="detadil_txt_right">' + item["可选专业"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 课题申报时间：</span><span class="detadil_txt_right">' + item["课题申报时间"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 题目类型：</span><span class="detadil_txt_right">' + item["题目类型"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 题目来源：</span><span class="detadil_txt_right">' + item["题目来源"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 选择模式：</span><span class="detadil_txt_right">' + item["选择模式"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 课题所属专业：</span><span class="detadil_txt_right">' + item["课题面向专业"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 指导教师：</span><span class="detadil_txt_right">' + item["教师姓名"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 教师职称：</span><span class="detadil_txt_right">' + item["教师职称"] + '</span></li>'
                                //+ '<li><span class="detadil_txt_left"> 导师联系电话：</span><span class="detadil_txt_right">' + item["教师电话"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 导师联系邮箱：</span><span class="detadil_txt_right">' + item["教师邮箱"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 学生姓名：</span><span class="detadil_txt_right" >' + item["学生姓名"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 学生院系专业：</span><span class="detadil_txt_right">' + item["院系专业"] + '</span></li>';
                if (item["第二导师"]) {
                    html += '<li><span class="detadil_txt_left"> 第二导师：</span><span class="detadil_txt_right">' + item["第二导师"] + '</span></li>';
                };
                html += '</ul></div></div>';
                proObj["xybh"] = item["课题学院"];
                proObj["zybh"] = item["课题专业"];
                proObj["kttm"] = item["课题题目"];
                proObj["xgsq"] = item["修改申请"];
                $("#gxf-project-information").html(html);
            } else {
                proObj["isTrue"] = false;
            };
        },
        error: function (Error) {
            console.log(Error)
        }
    });
    return proObj;
};
function getClertkInformation(answerGroupId) {
    if (checkValIsUndefinedOrNull(answerGroupId)) {
        answerGroupId = "";
    };
    $("body").on("mouseover", ".detadil_txt_right", function () {
        $(this).attr('title', $(this).html());
    });
    $.ajax({
        url: "../Handler/Answer.ashx",
        data: { "action": "GetDetailAnswerGroupInfo", "answerGroupId": answerGroupId },
        dataType: "json",
        type: "POST",
        async: false,
        success: function (data) {
            if (data.isSuccess == true) {
                var item = data.rows[0];
                var obj = "";
                var arr = item["答辩组教师"].split(",");
                $.each(arr, function (index, item) {
                    if (arr[index] == "")
                        return true;
                    obj += arr[index].split("$")[0] + '；';
                });
                var html = '<div class="gxf_problem gxf_problem_detail">'
                                + '<div><h2><span></span>答辩组基本信息</h2></div>'
                                + '<div class="gxf_pro_content gxf_content_table">'
                                + '<ul class="clearfix gxf_project_detadil_ul">'
                                + '<li><span class="detadil_txt_left"> 答辩组：</span><span class="detadil_txt_right">' + item["答辩组名称"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 答辩地点：</span><span class="detadil_txt_right">' + item["答辩地点"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 答辩时间：</span><span class="detadil_txt_right">' + item["答辩日期"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 答辩组组长：</span><span class="detadil_txt_right">' + item["答辩组长姓名"] + '</span></li>'
                                + '<li><span class="detadil_txt_left"> 答辩组教师：</span><span class="detadil_txt_right">' + obj + '</span></li></ul></div></div>';
                $("#clerk-information").html(html);
            };
        }
    });
};
$(document).ready(function () {
    $(document).ajaxSend(function () { open_loading(); }).ajaxComplete(function () { close_loading(); });
});

//富文本框初始化   参数（richTextId） 为 富文本框id var editor = new Array();
var htmlEditor = new Array();;
function initKindEditor(richTextId) {
    if (htmlEditor.length > 0) {
        return;
    };
    var editorToolArry = [
        'preview', 'undo', 'redo', 'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist',
        'indent', 'outdent', 'subscript', 'superscript', '|',
        'quickformat', 'selectall', 'fontname', 'fontsize', '|',
        'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
        'image', 'multiimage', 'table', 'hr', 'link', 'unlink'
    ];
    var option = {
        items: editorToolArry,
        //pluginsPath: '../Scripts/kindeditor/plugins/',
        resizeType: 0, //2时可以拖动改变宽度和高度，1时只能改变高度，0时不能拖动
        uploadJson: "../Handler/UploadOfKindEditorHandler.ashx", //指定上传文件的服务器端程序
        extraFileUploadParams: { //上传图片、Flash、视音频、文件时，支持添加别的参数一并传到服务器
            action: "ReceiveImage",
            verifyUser: false //请求图片时是否要验证用户登录，公告不需要验证，其他的一般需要验证
        },
        filePostName: "Filedata", //指定上传文件form名称
        allowImageRemote: false, //true时显示网络图片标签，false时不显示
        imageFileTypes: '*.jpg;*.jpeg;*.gif;*.png;*.bmp;', //上传文件类型 '*.jpg;*.jpeg;*.gif;*.png;*.bmp;'
        imageSizeLimit: '10MB', //单个文件最大大小，只在批量上传时有效
        formatUploadUrl: false, //是否自动格式化上传后的URL
        afterBlur: function () {
            this.sync();
            KindEditor.ctrl(document, 13, function () {
                KindEditor('form[name=form1]')[0].submit();
            });
            KindEditor.ctrl(this.edit.doc, 13, function () {
                KindEditor('form[name=form1]')[0].submit();
            });
        },
        afterChange: function () {
            // console.log(this.edit.doc.body.innerText.length);
            $(this.edit.div).parent().siblings("p,h3").find(".writerText>i").html(" " + $(this.edit.doc.body).text().replace(/\s|\r|\n/g, "").length + " ");
        },
    };
    $.each(richTextId, function (index, value) {
        htmlEditor[index] = KindEditor.create("#" + value, option);
    });
    editorToolArry.length = 0;
    $(".ke-statusbar").remove();
    window.htmlEditor = htmlEditor;
};

// 输入时 显示字符数
var showWriteTextNumber = {
    createNew: function (divID, inputID) {
        $("#" + divID).keyup("#" + inputID, function () {
            $("#" + inputID).prev().find(".writerText>i").html(" " + $("#" + inputID).textbox("getText").replace(/\s|\r|\n/g, "").length + " ");
        });
    }
};


//验证一位小数
function verifyScore(value) {
    var reg = /[^0-9|^.]/;
    if (reg.test(value))
        return false;
    reg = /((^[1-9][0-9]{0,2})(.[0-9])?)$|^0$|^0.0|^(0.[0-9]{1,1})$/;
    if (!reg.test(value))
        return false;
    value = parseFloat(value).toFixed(1);
    return value >= 0.0 && value <= 100.0;
};

//最后一位审核人
function lastCheckRole(typeData) {
    var checkrole;
    if (checkValIsUndefinedOrNull(checkrole)) {
        $.ajax({
            url: "../Handler/CommonHandler.ashx",
            data: { "action": "GetLastAuditorRole", type: typeData },
            type: "POST",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.isSuccess) {
                    checkrole = data.rows[0]["角色"];
                };
            },
            error: function (err) {
                console.log(err);
            }
        });
    };
    return checkrole;
};

// 查看权重
function showWeightDetail(projectId,sid) {
    $.ajax({
        url: "../Handler/ReviewHandler.ashx",
        data: {
            action: "GetStudentScoringWeight",
            sid: sid,
            projectId: projectId,
        },
        dataType: "json",
        type: "POST"
    }).done(function (data) {
        if (data.isSuccess) { 
            //请求隐藏的项
            $.ajax({
                url: "../Handler/ReviewHandler.ashx",
                type: "post",
                data: {
                    action: 'GetReviewColumn'
                },
                dataType: "json",
                success: function (data_tow) {
                    if (data_tow.isSuccess) {
                        //横向显示
                        var rowweightHtml = "该学生的";
                        //竖排显示
                        var weightHtml=''
                        if (data_tow.dataList[0]["不显示指导成绩"] == 1) {
                            weightHtml += '<p id="weight_zhidao"><span style="display: inline-block; min-width: 120px; text-align: right;">“' + data.rows[0]["指导角色"] + '成绩” 权重：</span> ' + data.rows[0]["指导成绩"] + '</p>';
                            rowweightHtml += '“'+data.rows[0]["指导角色"] + "成绩”权重为 " + data.rows[0]["指导成绩"] + "；"
                        };
                        if (data_tow.dataList[0]["不显示答辩成绩"] == 1) {
                            weightHtml += '<p><span style="display: inline-block; min-width: 120px; text-align: right;">“答辩成绩” 权重：</span> ' + data.rows[0]["答辩成绩"] + '</p>';
                            rowweightHtml += "“答辩成绩”权重为 " + data.rows[0]["答辩成绩"] + '；';
                        };
                        if (data_tow.dataList[0]["不显示评阅专家成绩"] == 1) {
                            weightHtml += '<p><span style="display: inline-block; min-width: 120px; text-align: right;">“' + data.rows[0]["评阅角色"] + '成绩” 权重：</span> ' + data.rows[0]["评阅专家成绩"] + '</p>';
                            rowweightHtml += data.rows[0]["评阅角色"] + "成绩”权重为 " + data.rows[0]["评阅专家成绩"] + '；';
                        };
                        if (data_tow.dataList[0]["不显示专业负责人评阅成绩"] == 1) {
                            weightHtml += '<p><span style="display: inline-block; min-width: 120px; text-align: right;">“' + data.rows[0]["专负角色"] + '成绩” 权重：</span> ' + data.rows[0]["评阅成绩"] + '</p>';
                            rowweightHtml += data.rows[0]["专负角色"] + "成绩”权重为 " + data.rows[0]["评阅成绩"] + '；';
                        };
                        if (data_tow.dataList[0]["不显示规范审查成绩"] == 1) {
                            weightHtml += '<p><span style="display: inline-block; min-width: 120px; text-align: right;">“规范审查成绩” 权重：</span> ' + data.rows[0]["规范审查成绩"] + '</p>';
                            rowweightHtml += "“规范审查权重为”" + data.rows[0]["规范审查成绩"] + '；';
                        };
                        if (data_tow.dataList[0]["不显示中期考评成绩"] == 1) {
                            weightHtml += '<p><span style="display: inline-block; min-width: 120px; text-align: right;">“中期考评成绩” 权重：</span> ' + data.rows[0]["中期考评成绩"] + '</p>';
                            rowweightHtml += "“中期考评成绩”权重为 " + data.rows[0]["中期考评成绩"] + '。';
                        };    
                    };
                    //横排显示
                    $("#weight_detailes").html(rowweightHtml);
                    //竖排
                    $('#weightBox').html(weightHtml);
                    $('#weightBox').dialog({ title: '查看权重' });
                    $("#weightBox").dialog("open");
                    $('#weightBox').window('center');
                }
            });
        } else {
            alert(data.message);
            $("#weight_detailes").text(data.message);
        };
    }).fail(function (err) {
        console.log(err);
    });
};