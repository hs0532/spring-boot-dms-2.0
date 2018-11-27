
/**
 * 查询审核信息，提交审核结果
 */
var co_audit;
(function (audit) {

    //#region 自定义变量
    /**
     * 参数集合
     * tableElement:绑定Table
     * projectId:课题编号
     * queryUrl:查询请求URL
     * queryParams:查询请求参数集合
     * entrust:委托人角色
     * submitUrl:提交审核结果URL
     * submitData:除审核结果、审核意见、课题编号、审核日志ID外，补充提交数据
     */
    var audit_options = {};

    /**
     * 审核成功后回调函数
     */
    var audit_callback;
    /**
     * 获取详情后回调函数
     */
    var detail_callback;
    /**
     * OperationLogType
     */
    var opeType = -1;

    /**
     * 上传实例
     */
    var audit_swf;
    //#endregion

    /**
     * 提交审核
     * @returns {} 
     */
    var audit_submit = function () {
        //var currentTab = getCurrentTab();
        //if (!currentTab) {
        //    alert("请在网站内执行操作！");
        //    return;
        //}

        //指导教师审核指导记录，可以上传附件，所以需要判断有无附件

        var opeKeyId = $(audit_options.tableElement).find("#btnSubmit").parent().parent().parent().parent().find("#hdOpeKeyId").val();
        var projectId = $(audit_options.tableElement).find("#hdProjectId").val();
        var auditState = $(audit_options.tableElement).find("input[name='rdoAudit']:checked").val();
        var auditSuggest = $(audit_options.tableElement).find("#txtAuditSuggest").val();

        if (checkValIsUndefinedOrNull(auditSuggest)) {
            alert("审核意见不能为空");
            return;
        }
        if (auditState != 1 && auditState != -1) {
            alert("请选择审核结果");
            return;
        }

        var pdata = audit_options.submitData || {};
        pdata["opeKeyId"] = opeKeyId;
        pdata["projectId"] = projectId;
        pdata["auditState"] = auditState;
        pdata["suggestion"] = replaceUnequa(auditSuggest);
        pdata["entrust"] = audit_options.entrust;
        pdata["recheck"] = 0;

        var fileId = $(audit_options.tableElement).find("#hdFileIdOfAudit").val();
        //var fileName = $(audit_options.tableElement).find("#txtFileNameOfAudit").val();
        open_loading();
        if (audit_swf && !checkValIsUndefinedOrNull(fileId)) {
            pdata["ASPSESSID"] = getid();
            pdata["fileCount"] = 1;
            audit_swf.setPostParams(pdata);
            audit_swf.startUpload(fileId);
            //document.getElementById("divFileProgressContainer").style.display = "";
            $(audit_options.tableElement).find("#divFileProgressContainer").show();
        } else {
            pdata["fileCount"] = 0;
            $.ajax({
                url: audit_options.submitUrl,
                type: "post",
                data: pdata,
                dataType: "json",
                success: function(data) {
                    if (data) {
                        if (data.isSuccess) {
                            var retData = data.dataList;
                            var html = "<tr><td rowspan='2' width='75px' class='gxf_table_left'>" + retData.RoleName + "审核意见"
                                + "<input type='hidden' id='hdOpeKeyId' value='" + opeKeyId + "' roleType='" + retData.RoleType + "' />"
                                + "</td>";
                            html += "<td  style='height:30px;'>审核状态：<span class='" + getAuditCss(retData.AuditState) + "'>"
                                + getAuditStateText(retData.AuditState, opeType) + "</span></td></tr>";
                            html += "<tr><td  class='clearfix'><p>审核意见：<span>" + replaceBr(auditSuggest) + "</span></p>";
                            html += "<p class='text-right'><span>审核人：" + retData.Auditor + "</span>  <span>审核时间：" + retData.AuditTime
                                + "</span></p></td></tr>";

                            $(audit_options.tableElement).find("#btnSubmit").parent().parent().parent().parent()
                                .prop('outerHTML', html);

                            if (audit_callback) {
                                audit_callback.call(this, retData);
                            }

                            alert("审核成功");

                            //刷新前一个页面
                            var prevTitle = getUrlParam("prevTitle");
                            refreshTab(prevTitle);

                            //关闭当前页
                            closeCurTab();
                        } else {
                            alert(data.message);
                        }
                    }
                },
                error: function(err) {
                    if (console && console.log) {
                        console.log(err.statusText);
                    }
                },
                complete: function () {
                    close_loading();
                }
            });
        }
    };

    /**
     * 修改审核意见
     */
    var audit_update = function () {
        //alert("修改审核意见");
        var parent = $(this).parent();
        parent.hide();
        var p_suggestion = parent.siblings(".examinationReport");
        if (!p_suggestion) {
            return;
        }

        var opeKeyId = p_suggestion.siblings("#hdOpeKeyId").val();
        var oldSuggestion = p_suggestion.find("span").html();
        var html = "<div>审核意见：";
        html += "<textarea id='txtNewSuggestion' cols='100' rows='5'></textarea></div>";
        html += "<div><input type='button' id='btnSave' value='保存' class='formBtn' style='margin: 10px auto 10px 90px ' /></div>";
        p_suggestion.prop("outerHTML", html);

        oldSuggestion = retrieveBr(oldSuggestion);
        $(audit_options.tableElement).find("#txtNewSuggestion").html(oldSuggestion);

        $(audit_options.tableElement).find("#btnSave").on("click", function() {
            var postUrl = audit_options.queryUrl.toLowerCase();
            var index = postUrl.indexOf("handler/");
            if (index >= 0) {
                postUrl = postUrl.substr(0, index + 8);
            } else {
                postUrl = "../Handler/";
            }
            postUrl += "CommonHandler.ashx";

            var suggestion = $(audit_options.tableElement).find("#txtNewSuggestion").val();
            if (checkValIsUndefinedOrNull(suggestion)) {
                alert("审核意见不能为空");
                return;
            }

            $.ajax({
                url: postUrl,
                type: "post",
                data: {
                    action: "UpdateAuditLog",
                    opeKeyId: opeKeyId,
                    suggestion: suggestion
                },
                dataType: "json"
            }).done(function (data) {
                if (data.isSuccess) {
                    alert("修改成功");

                    //刷新当前页
                    var curTab = getCurrentTab();
                    refreshTab2(curTab);
                } else {
                    alert(data.message);
                }
            }).fail(function () {
                alert("修改审核意见请求异常");
            });
        });
    }

    /**
     * 修改审核状态
     */
    var audit_recheck = function () {

        if (!confirm("您确定要修改审核状态吗？")) {
            return;
        }

        var p_suggestion = $(this).parent().siblings(".examinationReport");
        if (!p_suggestion) {
            return;
        }
        
        var pdata = audit_options.submitData || {};
        pdata["opeKeyId"] = p_suggestion.siblings("#hdOpeKeyId").val();;
        pdata["projectId"] = p_suggestion.siblings("#hdProjectId").val();;
        pdata["auditState"] = -1;
        pdata["suggestion"] = "recheck"; //随意写的，没有具体作用
        pdata["entrust"] = audit_options.entrust;
        pdata["fileCount"] = 0;
        pdata["recheck"] = 1;

        $.ajax({
            url: audit_options.submitUrl,
            type: "post",
            data: pdata,
            dataType: "json"
        }).done(function(data) {
            if (data.isSuccess) {
                alert("修改成功");

                //刷新前一个页面
                var prevTitle = getUrlParam("prevTitle");
                refreshTab(prevTitle);

                //刷新当前页
                var curTab = getCurrentTab();
                refreshTab2(curTab);

            } else {
                alert(data.message);
            }
        }).fail(function(err) {
            if (console && console.log) {
                console.log(err);
            }
            alert("修改审核状态请求异常");
        });
    }

    /**
     * 解析审核信息
     * @param {any} auditDetail
     */
    var audit_parse = function (auditDetail) {
        
        var html = "";
        var currentRole = get_current_role();
        var entrust = audit_options.entrust;
        if (currentRole == 3) { //指导教师
            if (!checkValIsUndefinedOrNull(entrust)) { //委托审核，用委托人的角色
                currentRole = entrust;
            }
        } else if (currentRole == 1) { //管理员
            currentRole = 1000;
        }

        var canUpload = false; //是否可以上传附件
        if (auditDetail && auditDetail.OperationLogs && auditDetail.OperationLogs.length > 0) {
            opeType = auditDetail.OperationLogs[0].OpeType;
            for (var i = 0; i < auditDetail.OperationLogs.length; i++) {
                var operationLog = auditDetail.OperationLogs[i];
                var opeKeyId = operationLog.Id;
                var state = operationLog.State;
                var projectId = operationLog.ProjectId;
                var auditTime = operationLog.AuditTime || "          ";
                var auditSuggest = replaceBr(operationLog.Suggestion);
                var auditor = operationLog.AuditorName || "      ";
                var roleType = operationLog.RoleType;
                var roleName = operationLog.RoleName;
                var auditCss = getAuditCss(state);
                var auditText = getAuditStateText(state, opeType);

                if (checkValIsUndefinedOrNull(roleName)) { //系统自动审核，不显示审核人
                    auditor = "      ";
                    auditTime = "          ";
                }

                //附件
                var fileName = operationLog.Attachment || "";
                var fileLink = operationLog.AttachmentUrl || "";
                var fileDownText = ""; //下载附件
                if (!checkValIsUndefinedOrNull(fileName) && !checkValIsUndefinedOrNull(fileLink)) {
                    fileDownText = "<div>相关附件：<span>" + fileName + "</span>&nbsp;&nbsp;&nbsp;"
                        + "<a class='listA' href='" + fileLink + "' download='" + fileName + "'>点击下载</a></div>";
                }

                //历史记录
                var historyHtml = "";
                if (operationLog.HistoryLogs && operationLog.HistoryLogs.length > 0) {
                    historyHtml += "<tr><td><table>";
                    for (var h = 0; h < operationLog.HistoryLogs.length; h++) {
                        var historyLog = operationLog.HistoryLogs[h];
                        historyHtml += "<tr><td valign='top' style='border: none; width: 90px;'>";
                        historyHtml += "<span>" + historyLog.HistoryTime + "</span>";
                        historyHtml += "</td><td style='border: none;'>";
                        historyHtml += "<span>" + replaceBr(historyLog.Suggestion) + "</span>";
                        historyHtml += "</td></tr>";
                    }
                    historyHtml += "</table></td></tr>";
                }

                var rowspan = 2;
                if (!checkValIsUndefinedOrNull(historyHtml)) {
                    rowspan = 3;
                }

                //是否可以修改审核状态
                var canRecheck = operationLog.CanRecheck || false;

                if (state == 1) { //审核通过
                    html += "<tr><td rowspan='" + rowspan + "' width='75px' class='gxf_table_left'>" + roleName + "审核意见</td>";
                    html += "<td  style='height:30px;'>审核状态：<span class='" + auditCss + "'>" + auditText + "</span></td></tr>";
                    html += "<tr><td class='clearfix'>";
                    if (!checkValIsUndefinedOrNull(fileDownText)) {
                        html += fileDownText;
                    }
                    html += "<input type='hidden' id='hdOpeKeyId' value='" + opeKeyId + "' roleType='" + roleType + "' />";
                    html += "<input type='hidden' id='hdProjectId' value='" + projectId + "' />";
                    html += "<p class='examinationReport'><i style='vertical-align:top;'>审核意见：</i><span>" + auditSuggest + "</span></p>";
                    if (auditDetail.CurrentTid > 0
                        && auditDetail.CurrentTid == operationLog.Auditor
                        && currentRole > 0
                        && currentRole == roleType) { //审核通过，可以修改审核意见
                        html += "<div class='updata_check_detail'><a id='linkUpdateAuditLog' class='listA' href='javascript:void(0);'>修改审核意见</a>";

                        if (canRecheck) {
                            html += " | <a id='linkRecheck' class='listA' href='javascript:void(0);'>修改审核状态</a>";
                        }
                        html += "</div>";
                    }
                    html += "<p class='text-right'><span>审核人：" + auditor + "</span>  <span>审核时间：" + auditTime + "</span></p></td>";
                    html += "</tr>";
                    html += historyHtml;
                } else if (state == -1) { //审核不通过
                    html += "<tr><td rowspan='" + rowspan + "' width='75px' class='gxf_table_left'>" + roleName + "审核意见</td>";
                    html += "<td  style='height:30px;'>审核状态：<span class='" + auditCss + "'>" + auditText + "</span></td></tr>";
                    html += "<tr><td  class='clearfix'>";
                    if (!checkValIsUndefinedOrNull(fileDownText)) {
                        html += fileDownText;
                    }
                    html += "<input type='hidden' id='hdOpeKeyId' value='" + opeKeyId + "' roleType='" + roleType + "' />";
                    html += "<p class='examinationReport'><i style='vertical-align:top;'>审核意见：</i><span>" + auditSuggest + "</span></p>";
                    html += "<p class='text-right'><span>审核人：" + auditor + "</span>  <span>审核时间：" + auditTime + "</span></p></td>";
                    html += "</tr>";
                    html += historyHtml;
                    break;
                } else if (state == 0) { //等待审核
                    if (currentRole != roleType) {
                        html += "<tr><td rowspan='" + rowspan + "' width='75px' class='gxf_table_left'>" + roleName + "审核意见</td>";
                        html += "<td  style='height:30px;'>审核状态：<span class='" + auditCss + "'>" + auditText + "</span></td></tr>";
                        html += "<tr><td  class='clearfix'>";
                        html += "<input type='hidden' id='hdOpeKeyId' value='" + opeKeyId + "' roleType='" + roleType + "' />";
                        html += "<p class='examinationReport'><i style='vertical-align:top;'>审核意见：</i><span></span></p>";
                        html += "<p class='text-right'><span>审核人：      </span>  <span>审核时间：          </span></p></td></tr>";
                    } else if (currentRole != 0) {
                        html += "<tr><td width='75px' class='gxf_table_left'>" + roleName + "审核意见</td>";
                        html += "<td><div><input type='hidden' id='hdProjectId' value='" + projectId + "' /><div>审核状态：";
                        html += "<input type='radio' id='rdoPass' name='rdoAudit' value='1' /><label for='rdoPass'>通过</label>";
                        //var temp = getAuditStateText(-1, opeType);
                        //temp = temp.replace(/审核/g, '');
                        html += "&nbsp;&nbsp;<input type='radio' id='rdoUnPass' name='rdoAudit' value='-1' /><label for='rdoUnPass'>" + getAuditStateText(-1, opeType).replace(/审核/g, '') + "</label>";
                        html += "</div>";
                        html += "<input type='hidden' id='hdOpeKeyId' value='" + opeKeyId + "' roleType='" + roleType + "' />";
                        html += "<div>审核意见：";
                        html += "<textarea id='txtAuditSuggest' cols='100' rows='5'></textarea></div>";

                        //审核 上传附件
                        canUpload = true;
                        html += "<div>添加附件：";
                        if (!checkValIsUndefinedOrNull(fileDownText)) {
                            html += "<span class='statement' id='spanAtt'>已有关附件 ";
                            html += "<a style='color: #ff6632' href='" + fileLink + "' download='" + fileName + "'>" + fileName + "</a>";
                            html += "，上传新的附件将替换已有附件，支持附件格式为 doc，docx，pdf，wps，rar，zip</span>";
                        } else {
                            html += "<span class='statement' id='spanAtt'>上传有关附件，支持附件格式为 doc，docx，pdf，wps，rar，zip</span>";
                        }
                        html += "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                        html += "<input id='txtFileNameOfAudit' class='easyui-textbox' style='width: 258px;' data-options='readonly:true' />";
                        html += "<span id= 'spanButtonPlaceholder'></span>";
                        html += "<div id='divFileProgressContainerOfAudit' style=''></div>";
                        html += "<input type='hidden' id='hdFileIdOfAudit' value='' />";
                        html += "</div>";
                        
                        html += "<div><input type='button' id='btnSubmit' value='提交' class='formBtn' style='margin: 10px auto 10px 90px ' />";
                        html += "</div></div></td></tr>";
                    }
                }
            }

            $(audit_options.tableElement).html(html);
            $.parser.parse(audit_options.tableElement); //重新渲染EasyUI
            $(audit_options.tableElement).find("#btnSubmit").click(audit_submit);
            $(audit_options.tableElement).find("#linkUpdateAuditLog").on("click", audit_update);
            $(audit_options.tableElement).find("#linkRecheck").on("click", audit_recheck);
        }

        if (canUpload) {
            var url = audit_options.submitUrl;
            var params = {};
            var fileType = "*.doc;*.docx;*.pdf;*.wps;*.rar;*.zip;";
            var config = {
                file_queued_handler: fileQueued_Audit,
                custom_settings: {
                    upload_target: "divFileProgressContainerOfAudit"
                }
            };
            audit_swf = swfinit(url, params, fileType, config);
        }
    };

    /**
     * 查询审核信息
     */
    var audit_query = function() {
        var projectId = audit_options.projectId;
        $.ajax({
            url: audit_options.queryUrl,
            type: "post",
            data: audit_options.queryParams,
            dataType: "json",
            success: function(data) {
                if (data) {
                    if (data.isSuccess) {
                        audit_parse(data.dataList);

                        if (detail_callback) {
                            detail_callback.call(this, data);
                        }
                    } else {
                        alert(data.message);
                    }
                }
            },
            error: function(err) {
                if (console && console.log) {
                    console.log(err.statusText);
                }
            }
        });
    };
    
    /**
     * 绑定
     * @param {} options 参数集合
     * @param {callback} auditCallback 审核成功后回调函数
     * @param {callback} detailCallback 获取详情后回调函数
     * @returns {} 
     */
    audit.bind = function (options, auditCallback, detailCallback) {
        audit_options = options || {};
        audit_callback = auditCallback;
        detail_callback = detailCallback;
        opeType = -1;
        audit_swf = null;
        audit_query();
    }

})(co_audit || (co_audit = {}));