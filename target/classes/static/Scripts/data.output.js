function showOutputList() {
    var box = $("#output_div");
    if (box.html() == undefined || box.html() == "") {
        box = $("<div id=\"output_div\" ><div style=\"overflow-x:hidden; overflow-y:auto !important; height: 413px;\"><div style=\"margin-left: 5px;\"><span>提示：导出文档的下载有效期是24个小时，过期需要重新生成导出文档后才能下载！</span></div><div id=\"output_div_content\" class=\"main\"></div></div></div>");
        $("body").append(box);
        box.dialog({
            title: '文档导出列表',
            width: 840,
            height: 450,
            closed: true,
            modal: true
        });
    };

    var list = $("#output_list");
    var list_div = $("#output_div_content");

    if (list_div.html() == undefined || list_div.html() == "") {

    } else {
        list_div.empty();
    };

    list = $("<table id=\"output_list\"></table>");
    list_div.append(list);

    var url = "../Handler/WordHandler.ashx";
    var paramsData = { action: "GetExportWordTask" };
    var idField = "下载文件名";

    var columnData = [[
        { field: '任务名称', align: 'center', title: '任务名称', width: 50 },
        { field: '文件类型Text', align: 'center', title: '文件类型', width: 30 },
        { field: '提交时间', align: 'center', title: '提交时间', width: 30 },
        {
            field: '处理结果', align: 'center', title: '处理结果', width: 30,
            formatter: function (value, row, index) {
                return (row["处理结果"] || "等待处理");
            }
        },
        {
            field: '下载文件名', title: '下载', align: 'center', width: 30,
            formatter: function (value, row, index) {
                return (value == null || value == "") ? "" : ('<a class="listA" href="' + value + '">下载</a>');
            }
        }
    ]];

    box.dialog("open");
    GteTable(list, url, columnData, paramsData, idField);
};
function showButtonBox(type,buttonBoxId) {
    $.ajax({
        url: "../Handler/WordHandler.ashx",
        data: { action: "HasTemplate",lx:type },
        dataType: "json",
        type: "POST",
        success: function (data) {
            if (data.isSuccess == true) {
                $("#" + buttonBoxId).show();
            } else {
                $("#" + buttonBoxId).hide();
            };
        }
    });
}
// 导出报告单
function showDownloadList() {
    var box = $("#download_div");
    if (box.html() == undefined || box.html() == "") {
        box = $("<div id=\"download_div\" ><div style=\"overflow-x:hidden; overflow-y:auto !important; height: 413px;\"><div style=\"margin-left: 5px;\"><span>提示：压缩包的解压密码为您登录本系统的<span class=\"txt_red\">账号</span>，如果账号中含有字母，请用小写字母！</span></div><div id=\"output_div_content\" class=\"main\"></div></div></div>");
        $("body").append(box);
        box.dialog({
            title: '报告单导出列表',
            width: 840,
            height: 450,
            closed: true,
            modal: true
        });
    };

    var list = $("#output_list");
    var list_div = $("#output_div_content");

    if (list_div.html() == undefined || list_div.html() == "") {

    } else {
        list_div.empty();
    }

    list = $("<table id=\"output_list\"></table>");

    list_div.append(list);

    var url = "../Handler/ReportFileHandler.ashx";
    var paramsData = { action: "GetExportReportTask" };
    var idField = "下载文件名";

    var columnData = [[
    { field: '报告单名', align: 'center', title: '报告单', width: 50 },
    { field: '提交时间', align: 'center', title: '提交时间', width: 30 },
    {
        field: '处理结果', align: 'center', title: '处理结果', width: 30,
        formatter: function (value, row, index) {
            return (row["处理结果"] || "等待处理");
        }
    },
    {
        field: '下载文件名', title: '下载', align: 'center', width: 30,
        formatter: function (value, row, index) {
            //console.log(value);
            var str = ""
            if (value == null || value == "") {
                str = "";
            } else {
                str = '<a class="listA" href="' + value + '">下载</a>';
            }
            return str;
        }
    }
    ]];

    box.dialog("open");
    GteTable(list, url, columnData, paramsData, idField);
};