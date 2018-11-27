

/**
*
 * 划词功能 addPostil(submitid, thesisId, articlePartId, checkFileType, tableModelId)
 * 参数： submitid:文件ID;  thesisId:划词div的ID;  articlePartId:(论文段落ID，非论文时为空); checkFileType:检测文件类型checkFileType对应; tableModelId:（自定义ID， 不是自定义时为空）;
 *
 */

// 批注开始
var role = get_current_role();
var attrArticleRemarkId = "articleRemarkId"; //自定义属性
var highlighter; //标记实例
var highlightStyleClass = "highlight"; //标记样式
var noStyleClass = "noStyle"; //占位，没有具体的样式
var noStyleLighter;
var outTimer = null; //超时计时器，单击和双击事件并存解决方案
var isSupportRange = true; //是否支持Range
//var arId = $("#hdArticleRemarkId").val();
var redContentHtml = {}; //原文
//var tableModelId = "";

// 添加批注
function addPostil(submitid, thesisId, articlePartId, checkFileType, tableModelId) {

    //redContentHtml[thesisId] == $("#" + thesisId).html();
    redContentHtml[thesisId] = $("#" + thesisId).html();

    //初始化工具类rangy
    initRangy();

    //鼠标选择文本事件
    bindMouseUpAndDown(thesisId);
    //初始化数据
    initArticleRemark(submitid, thesisId, articlePartId, checkFileType, tableModelId);

    //获取thesisId 和 articlePartId
    $("body").off('click', 'table p').on("click", "table p", function () {
        $("#tooltip").remove();
        // 点击盒子的id
        var thesisId = $(this).parent().prop("id");
        if (articlePartId && thesisId != "contentBlock") {
            articlePartId = thesisId.split("-")[1];
        }

        if (thesisId) {
            var tableModelId = $(this).parent().attr("tablemodelid");
            //console.log(tableModelId);
            if (!tableModelId) {
                tableModelId = "";
            }
            if (thesisId == "mudi") {
                checkFileType = 4;
            } else if (thesisId == "fangan") {
                checkFileType = 5;
            } else if (thesisId == "fangfa") {
                checkFileType = 6;
            } else if (thesisId == "jihua") {
                checkFileType = 7;
            }

            // 评论点击事件
            $("body").off('click', '#tooltip').on("click", "#tooltip", function () {
                //console.log(tableModelId);
                var tooltip = $("#tooltip");
                if (tooltip && tooltip.length > 0) {
                    tooltip.remove();
                }
                //提示浏览器是否支持Range
                if (!isSupportRange) {
                    alert("当前浏览器不支持划句评论功能，请更新至最新版本或更换为其他浏览器后重试。");
                    return;
                }

                var arId = $("#hdArticleRemarkId").val();
                if (!arId || arId.length <= 0) { //单击事件不需要检查，划选事件需要
                    deserializeSelection($("#hdSerializedSelection").val(), thesisId);
                    if (hasOverlap(thesisId) > 0) {
                        alert("请不要选择与已标记区域重叠的区域。");
                        return;
                    }
                }
                if (role == 1 || role == 2) {
                    alert("您没有权限执行此操作！");
                    return;
                }
                //初始化
                $("#hdArticleRemarkId").val("");
                $("#txtRemark").textbox("setValue", "");
                $("#lblCreatorName").text("---");
                $("#lblDatetime").text("");
                $('#maxredBox').dialog({
                    title: '评论',
                    buttons: [
                        {
                            text: '确定',
                            handler: function () {
                                $("#postilDetailContent").html("");
                                $.ajax({
                                    url: "../Handler/ArticleRemarkRangyHandler.ashx",
                                    type: "post",
                                    dataType: "json",
                                    data: {
                                        action: "SaveArticleRemark",
                                        id: $("#hdArticleRemarkId").val(),
                                        articlePartId: articlePartId,
                                        serializedSelection: encodeURIComponent($("#hdSerializedSelection").val()), //如果不编码，冒号会被过滤
                                        remark: encodeURIComponent($("#txtRemark").textbox("getValue")),
                                        selectedText: encodeURIComponent($("#hdSelectedText").val()), //选中的文本
                                        operandId: submitid,
                                        operandType: -checkFileType,
                                        tableModelId: (!checkValIsUndefinedOrNull(tableModelId) && tableModelId > 0) ? tableModelId : (-checkFileType)
                                    },
                                    success: function (data) {
                                        if (data.isSuccess) {
                                            var ssTemp = decodeURIComponent(encodeURIComponent($("#hdSerializedSelection").val()));
                                            var arId = data.message;
                                            // 关闭弹框
                                            $("#maxredBox").dialog('close');
                                            //刷新
                                            //document.getElementById(thesisId).innerHTML = redContentHtml[thesisId];
                                            //initArticleRemark(submitid, thesisId, articlePartId, checkFileType, tableModelId);
                                            //deserializeSelection(ssTemp, thesisId);
                                            if (data.rows.length > 0) {
                                                //highlightSelectedText(highlightStyleClass, thesisId);

                                                deserializeSelection(data.rows[0]["SerializedSelection"], thesisId);

                                                var selectedText = rangy.getSelection().toString(); //选中的文本 SelectedText
                                                if (selectedText == data.rows[0]["SelectedText"] && hasOverlap(thesisId) <= 0) {
                                                    if (data.rows[0]["IsDeleted"] == 0) {
                                                        highlightSelectedText(highlightStyleClass, thesisId);
                                                        bindSelectedText(arId, thesisId, data.rows[0]["Num"]);

                                                        addThesisPostilDetail(data.rows[0], submitid, thesisId, articlePartId, checkFileType, tableModelId);
                                                    } else {
                                                        highlightSelectedText(noStyleClass, thesisId);
                                                        addHiddenNum(arId, thesisId, data.rows[0]["Num"]);
                                                    }
                                                }

                                            } else {
                                                //新增的情况下 保存成功后标记选中文本
                                                if (arId != $("#hdArticleRemarkId").val()) {
                                                    //highlightSelectedText(highlightStyleClass,thesisId);
                                                    //刷新
                                                    document.getElementById(thesisId).innerHTML = redContentHtml[thesisId];
                                                    initArticleRemark(submitid, thesisId, articlePartId, checkFileType, tableModelId);
                                                    deserializeSelection(ssTemp, thesisId);
                                                }
                                            }

                                        } else {
                                            alert(data.message);
                                        }
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                });
                            }
                        }, {
                            text: '取消',
                            handler: function () {
                                $("#maxredBox").dialog("close");
                                $('#list').datagrid("clearSelections");
                            }
                        }
                    ]
                });
                $("#postilDetailContent").html($("#hdSelectedText").val());
                $("#maxredBox").dialog("open");
                $('#maxredBox').window('center');
                $('#txtRemark').next('span').find('textarea').focus();
                //$('#txtRemark').textbox().next('span').find('textarea').focus();
            });


            // 点击黄色区域
            $("body").off('click', '.highlight').on("click", ".highlight", function () {
                $("#postilDetailContent").html("");
                if (thesisId) {
                    var id = $(this).attr("articleremarkid");
                    clickYellow(submitid, thesisId, articlePartId, checkFileType, tableModelId, id)
                }
            });

        }
    });

};

//判断所选区域是否包含已经标记的区域，或是重叠区域
//1:所选区域包含整个已标记区域
//2:开始点或结束点在已标记区域内
function hasOverlap(thesisId) {
    var has = 0;
    //1.所选区域包含整个已标记区域
    var selectedHtml = rangy.getSelection().toHtml();
    if (selectedHtml && selectedHtml.length > 0) {
        var regex = /class\s*=\s*['\"]([^'\"]+)['\"]/gi; //获取class值
        var matchs = selectedHtml.match(regex);
        if (matchs && matchs.length > 0) {
            for (var i = 0; i < matchs.length; i++) {
                if (matchs[i].indexOf(highlightStyleClass) >= 0) {
                    has = 1;
                    break;
                }
            }
        }
    }

    if (has <= 0) {
        //2.开始点或结束点在已标记区域内
        //判断父节点
        var checkParentNodes = function (iNode, iRootNode) {
            var iHas = false;
            if (!iNode) {
                return iHas;
            }

            while (iNode != iRootNode) {
                if (iNode.attributes) {
                    var attr = iNode.getAttribute("class") || "";
                    if (attr.indexOf(highlightStyleClass) >= 0) {
                        iHas = true;
                        break;
                    }
                }
                iNode = iNode.parentNode;
            }
            return iHas;
        };

        var range = rangy.getSelection().getRangeAt(0);
        var rootNode = document.getElementById(thesisId);
        if (checkParentNodes(range.startContainer, rootNode) || checkParentNodes(range.endContainer, rootNode)) {
            has = 2;
        }
    }
    return has;
};

//初始化工具类rangy
function initRangy() {
    try {
        rangy.init();
        highlighter = rangy.createHighlighter();
        highlighter.addClassApplier(rangy.createClassApplier(highlightStyleClass, {
            ignoreWhiteSpace: true,
            tagNames: ["span"]
        }));
        noStyleLighter = rangy.createHighlighter();
        noStyleLighter.addClassApplier(rangy.createClassApplier(noStyleClass, {
            ignoreWhiteSpace: true,
            tagNames: ["span"]
        }));
    } catch (ex) {
        isSupportRange = false;
    }
};

//鼠标选择文本事件
function bindMouseUpAndDown(thesisId) {
    $("#" + thesisId).mouseup(function (e) {
        var x = 10;
        var y = 10;

        var selectedText = "";
        var serializedSelectionStr = "";
        try {
            selectedText = rangy.getSelection().toString(); //选中的文本
            if (selectedText != "") {
                serializedSelectionStr = serializeSelection(thesisId); //确认选中区的位置
            }
        } catch (ex) {
            isSupportRange = false;
        }

        if (selectedText != "" || !isSupportRange) {

            $("#hdSerializedSelection").val(serializedSelectionStr);
            $("#hdSelectedText").val(selectedText);

            var tip = "评论";
            var tooltip =
                "<input type='button' id='tooltip' class='formBtn' value='" + tip + "' />";
            if (role != 1 && role != 2) {
                $("body").append(tooltip);
            }

            $("#tooltip")
                .css({
                    "top": (e.pageY + y) + "px",
                    "left": (e.pageX + x) + "px",
                    "position": "absolute"
                })
                .show("fast");
        } else {
            $("#hdSerializedSelection").val("");
            $("#hdSelectedText").val("");
        }

    }).mousedown(function () {
        var tooltip = $("#tooltip");
        if (tooltip && tooltip.length > 0) {
            tooltip.remove();
        }
    });
};


//初始化标记区域
function initArticleRemark(submitid, thesisId, articlePartId, checkFileType, tableModelId) {
    $.ajax({
        url: "../Handler/ArticleRemarkRangyHandler.ashx",
        data: {
            action: "GetArticleRemarkList",
            articlePartId: articlePartId, //getUrlParam("sectionId"),
            operandId: submitid,
            operandType: -checkFileType,
            tableModelId: (!checkValIsUndefinedOrNull(tableModelId) && tableModelId > 0) ? tableModelId : (-checkFileType)
        },
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data.isSuccess) {
                if (data.message.length > 0) {
                    var arList = parseJson(data.message);
                    $.each(arList, function (index, item) {
                        try {
                            deserializeSelection(item.SerializedSelection, thesisId);
                            var selectedText = rangy.getSelection().toString(); //选中的文本 SelectedText
                            if (selectedText == item["SelectedText"] && hasOverlap(thesisId) <= 0) {
                                if (item.IsDeleted == 0) {
                                    highlightSelectedText(highlightStyleClass, thesisId);
                                    bindSelectedText(item.Id, thesisId, item.Num);
                                } else {
                                    highlightSelectedText(noStyleClass, thesisId);
                                    addHiddenNum(item.Id, thesisId, item.Num);
                                }
                            }
                        } catch (ex) {
                            console.log(ex.message);
                        }
                    });
                    deserializeSelection("0:0,0:0", thesisId);
                    getThesisPostilDetail(arList, submitid, thesisId, articlePartId, checkFileType, tableModelId)
                }
            } else {
                alert(data.message);
            }
        },
        error: function () {
            alert("AJAX获取评论数据失败！");
        }
    });
};
//解析JSON字符串
function parseJson(jsonStr) {
    try {
        return JSON.parse(jsonStr);
    } catch (ex) {
        alert("当前浏览器不支持解析JSON字符串功能，请更新至最新版本或更换为其他浏览器后重试。");
        return [];
    }
};

//选中区序列化
function serializeSelection(thesisId) {
    var ss = rangy.serializeSelection(null, true, document.getElementById(thesisId));
    return ss;
};

//反序列化，选中文本
function deserializeSelection(serializedValue, thesisId) {
    return rangy.deserializeSelection(serializedValue, document.getElementById(thesisId));
};

//标记选中文本
function highlightSelectedText(styleClassName, thesisId) {
    if (styleClassName == highlightStyleClass) {
        highlighter.highlightSelection(styleClassName, { containerElementId: thesisId });
    }
    else if (styleClassName == noStyleClass) {
        noStyleLighter.highlightSelection(styleClassName, { containerElementId: thesisId });
    }
};

//删除选中文本的标记
function unhighlightSelection(styleClassName) {
    if (styleClassName == highlightStyleClass) {
        highlighter.unhighlightSelection();
    }
    else if (styleClassName == noStyleClass) {
        noStyleLighter.unhighlightSelection();
    }
};

//添加隐藏序号
function addHiddenNum(arId, thesisId, num) {
    var spanList = $("#" + thesisId + " span[class~='" + noStyleClass + "']");
    if (spanList.length > 0) {
        $.each(spanList,
            function (index, element) {
                if (index == 0) {
                    $(element).prepend("<sup style='display:none;'>[" + num + "]</sup>");
                }
            });
    }
};

//绑定事件
function bindSelectedText(arId, thesisId, num) {
    var spanList = $("#" + thesisId + " span[class~='" + highlightStyleClass + "']:not([" + attrArticleRemarkId + "])");
    if (spanList.length > 0) {
        $.each(spanList, function (index, element) {
            if (index == 0) {
                $(element).prepend("<sup style='color: #f00; font-size:12px;'>[" + num + "]</sup>");
            }
            $(element).attr(attrArticleRemarkId, arId);

            var eleTitle = element.title || "";
            var titleStr = "单击鼠标左键，查看该段文字的评论或标注";
            if (eleTitle.indexOf(titleStr) < 0) {
                if (eleTitle.length > 0) {
                    eleTitle += '&#13;';
                }
                eleTitle += titleStr;
                element.title = eleTitle;
            }

            $(element)
                .bind('click',
                    function () {
                        //showRemarkDialog(arId);
                    });
        });
    }
};

//删除选中文本的已有标记
//arId:评论ID。如果指定ID，则先选中元素然后再删除标记，并且解除绑定事件；如果未指定ID，则删除默认选中区的标记。
function removeHighlightFromSelectedText(arId, thesisId) {
    if (arId && arId.length > 0) {
        // 删除右侧列表
        var rightLiList = $("#right_" + thesisId).find("li");
        if (rightLiList && rightLiList.length > 0) {
            for (var r = (rightLiList.length - 1) ; r >= 0 ; r--) {
                var dataId = $(rightLiList[r]).attr("data-id");
                if (dataId == arId) {
                    $(rightLiList[r]).remove();
                }
            }
        }

        // 删除左边文字黄色标记
        var spanList = $("#" + thesisId + " span[class~='" + highlightStyleClass + "'][" + attrArticleRemarkId + "='" + arId + "']");
        if (spanList && spanList.length > 0) {
            //先删除标记序号
            $.each(spanList, function (index, item) {
                $(item).find("sup").remove();
            });

            var range = rangy.createRange();
            for (var i = spanList.length - 1; i >= 0; i--) {
                var span = $(spanList[i]);
                //$(span).find("sup").remove();
                var spanSiblings = $(span).siblings("span[class][" + attrArticleRemarkId + "]");
                span.unbind('click'); //取消单击事件
                span.removeAttr(attrArticleRemarkId); //删除自定义属性
                var titleValue = span.attr("title"); //恢复title属性
                var titleIndex = titleValue.indexOf("单击鼠标左键");
                if (titleIndex <= 0) {
                    span.removeAttr("title");
                } else {
                    var tempIndex = titleValue.indexOf("&#13;");
                    if (tempIndex >= 0) {
                        titleIndex = tempIndex;
                    }
                    span.attr("title", titleValue.substring(0, titleIndex));
                }

                range.selectNode(spanList[i]);
                range.select();
                //$(span).find("sup").remove();
                //spanList[i] = null;
                unhighlightSelection(highlightStyleClass);

                //取消标记，可能会把其他的节点的标记也取消了，所以要重新加上，否则不能正常删除span标签
                for (var j = 0; j < i; j++) {
                    if (!$(spanList[j]).hasClass(highlightStyleClass)) {
                        //$(spanList[j]).addClass(highlightStyleClass);
                        range.selectNode(spanList[j]);
                        range.select();
                        highlightSelectedText(highlightStyleClass, thesisId);
                    }
                }

                //紧挨着当前结点的其他标记也会受影响
                //var spanSiblings = $(span).siblings("span[class][" + attrArticleRemarkId + "]");
                $.each(spanSiblings,
                    function (index, item) {
                        if (!$(item).hasClass(highlightStyleClass)) {
                            //$(spanList[j]).addClass(highlightStyleClass);
                            range.selectNode(item);
                            range.select();
                            highlightSelectedText(highlightStyleClass, thesisId);
                        }
                    });
            }
        }
    } else {
        unhighlightSelection(highlightStyleClass);
    }

    deserializeSelection("0:0,0:0", thesisId); //什么都不选中
};

// 右侧对应列表---初始化时
function getThesisPostilDetail(dataArrList, submitid, thesisId, articlePartId, checkFileType, tableModelId) {
    if (dataArrList.length > 0) {
        var html = '';
        html += '<ul id="right_' + thesisId + '" class="gxf_openReport_title" style="overflow: hidden;overflow-y: initial;">';
        $.each(dataArrList, function (index, value) {
            if (value["IsDeleted"] == 0) {
                html += '<li data-id = "' + value["Id"] + '">'
                    + '<div class="statement"><span style="color:#f00; font-weight:bold;">[' + value["Num"] + ']</span><span class="margl">' + value["姓名"] + '</span><span class="margl">' + value["LastEditTime"] + '</span></div>'
                    + '<div><span class="detadil_txt_right">' + value["Remark"] + '</span> <a class="listA margl" href="javascript:;" onclick="showPostilDetail(\'' + value["Id"] + '\',\'' + submitid + '\', \'' + thesisId + '\', \'' + articlePartId + '\', \'' + checkFileType + '\', \'' + tableModelId + '\')">查看详情</a></div>'
                    + '</li>';
            }
        });
        html += '</ul>';
        $("#" + thesisId).parent().parent().find("td.rightText").html(html)
    } else {
        if (role == 1 || role == 2) {
            $("#" + thesisId).parent().parent().find("td.rightText").html('<div><ul id="right_' + thesisId + '" class="gxf_openReport_title" style="overflow: hidden;overflow-y: initial;"><li><div style="text-align: center;"><p style="font-size: 20px;">暂无批注内容</p></div></li>')
        } else {
            $("#" + thesisId).parent().parent().find("td.rightText").html('<div><ul id="right_' + thesisId + '" class="gxf_openReport_title" style="overflow: hidden;overflow-y: initial;"><li><div style="text-align: center;"><p style="font-size: 20px;">暂无批注内容</p><p class="margt">如需添加批注，请选中内容添加</p></div></li>')
        };

    }

    // 设置右边ID
    $("#right_" + thesisId).css("min-height", "54px");
    $("#right_" + thesisId).height($("#" + thesisId).height());

};

// 添加时 右侧对应添加
function addThesisPostilDetail(dataArrList, submitid, thesisId, articlePartId, checkFileType, tableModelId) {

    var rightHtml = $("#right_" + thesisId).find("li");
    //console.log(rightHtml.attr("data-id"));
    if (rightHtml.attr("data-id")) {
        var html = '<li data-id = "' + dataArrList["Id"] + '">'
            + '<div class="statement"><span style="color:#f00; font-weight:bold;">[' + dataArrList["Num"] + ']</span><span class="margl">' + dataArrList["姓名"] + '</span><span class="margl">' + dataArrList["LastEditTime"] + '</span></div>'
            + '<div><span class="detadil_txt_right">' + dataArrList["Remark"] + '</span> <a class="listA margl" href="javascript:;" onclick="showPostilDetail(\'' + dataArrList["Id"] + '\',\'' + submitid + '\', \'' + thesisId + '\', \'' + articlePartId + '\', \'' + checkFileType + '\', \'' + tableModelId + '\')">查看详情</a></div>'
            + '</li>';

        $("#right_" + thesisId).append(html);
    } else {
        $("#right_" + thesisId).empty();
        var newHtml = '<li data-id = "' + dataArrList["Id"] + '">'
            + '<div class="statement"><span style="color:#f00; font-weight:bold;">[' + dataArrList["Num"] + ']</span><span class="margl">' + dataArrList["姓名"] + '</span><span class="margl">' + dataArrList["LastEditTime"] + '</span></div>'
            + '<div><span class="detadil_txt_right">' + dataArrList["Remark"] + '</span> <a class="listA margl" href="javascript:;" onclick="showPostilDetail(\'' + dataArrList["Id"] + '\',\'' + submitid + '\', \'' + thesisId + '\', \'' + articlePartId + '\', \'' + checkFileType + '\', \'' + tableModelId + '\')">查看详情</a></div>'
            + '</li>';
        $("#right_" + thesisId).append(newHtml);
    }

    // 设置右边ID
    $("#right_" + thesisId).css("min-height", "54px");
    $("#right_" + thesisId).height($("#" + thesisId).height());
};


// 查看批注详情
function showPostilDetail(articleremarkid, submitid, thesisId, articlePartId, checkFileType, tableModelId) {
    $("#postilDetailContent").html("");

    if (thesisId == "mudi") {
        checkFileType = 4;
    } else if (thesisId == "fangan") {
        checkFileType = 5;
    } else if (thesisId == "fangfa") {
        checkFileType = 6;
    } else if (thesisId == "jihua") {
        checkFileType = 7;
    }

    clickYellow(submitid, thesisId, articlePartId, checkFileType, tableModelId, articleremarkid)

};

// 点击黄色区域 或者 右边查看详情
function clickYellow(submitid, thesisId, articlePartId, checkFileType, tableModelId, articleremarkid) {

    $.ajax({
        url: "../Handler/ArticleRemarkRangyHandler.ashx",
        data: {
            action: "GetArticleRemark",
            id: articleremarkid
        },
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data.isSuccess) {
                if (data.message.length > 0) {
                    var ar = parseJson(data.message);
                    $("#txtRemark").textbox("setValue", decodeURIComponent(ar.Remark));
                    $("#hdArticleRemarkId").val(ar.Id);
                    $("#hdSerializedSelection").val(ar.SerializedSelection);
                    $("#hdSelectedText").val(decodeURIComponent(ar.SelectedText));
                    $("#lblCreatorName").text(ar.CreatorName);
                    $("#lblDatetime").text(ar.LastEditTime);
                    $("#postilDetailContent").html(decodeURIComponent(ar.SelectedText));
                    //console.log(decodeURIComponent(ar.SelectedText));
                    // 非教师只有查看的权限 不能修改
                    if (role == 1 || role == 2) {
                        $("#txtRemark").textbox("disable");
                    }
                }
            } else {
                alert(data.message);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
    $('#maxredBox').dialog({
        title: '评论',
        buttons: [
            {
                text: '确定',
                handler: function () {
                    if (role == 1 || role == 2) {
                        $("#maxredBox").dialog("close");
                        return;
                    }
                    $.ajax({
                        url: "../Handler/ArticleRemarkRangyHandler.ashx",
                        type: "post",
                        dataType: "json",
                        data: {
                            action: "SaveArticleRemark",
                            id: articleremarkid,
                            articlePartId: articlePartId,
                            serializedSelection: encodeURIComponent($("#hdSerializedSelection").val()), //如果不编码，冒号会被过滤
                            remark: encodeURIComponent($("#txtRemark").textbox("getValue")),
                            selectedText: encodeURIComponent($("#hdSelectedText").val()), //选中的文本
                            operandId: submitid,
                            operandType: -checkFileType,
                            tableModelId: (!checkValIsUndefinedOrNull(tableModelId) && tableModelId > 0) ? tableModelId : (-checkFileType)
                        },
                        success: function (data) {
                            //console.log(data);
                            if (data.isSuccess) {
                                $("#tooltip").remove();

                                //刷新
                                document.getElementById(thesisId).innerHTML = redContentHtml[thesisId];
                                initArticleRemark(submitid, thesisId, articlePartId, checkFileType, tableModelId);
                                deserializeSelection("0:0,0:0", thesisId);

                                $("#maxredBox").dialog("close");
                            } else {
                                alert(data.message);
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
            }, {
                text: '删除',
                handler: function () {
                    if (role == 1 || role == 2) {
                        alert("您没有权限执行此操作！");
                        return;
                    }
                    $("#delModelBox").text("你确定要删除这条评论吗？");
                    $('#delModelBox').dialog({
                        title: '删除评论',
                        buttons: [
                            {
                                text: '确定',
                                handler: function () {
                                    $.ajax({
                                        url: "../Handler/ArticleRemarkRangyHandler.ashx",
                                        type: "post",
                                        dataType: "json",
                                        data: {
                                            action: "DelArticleRemark",
                                            id: articleremarkid,
                                            articlePartId: articlePartId,
                                            serializedSelection: encodeURIComponent($("#hdSerializedSelection").val()), //如果不编码，冒号会被过滤
                                            operandId: submitid,
                                            operandType: -checkFileType,
                                            tableModelId: (!checkValIsUndefinedOrNull(tableModelId) && tableModelId > 0) ? tableModelId : (-checkFileType)
                                        },
                                        success: function (data) {
                                            //console.log(data);
                                            if (data.isSuccess) {
                                                $("#tooltip").remove();
                                                //取消页面黄色部分
                                                //清除占位标记
                                                //var arData = parseJson(data.message);
                                                //var arList = arData.arList;
                                                //if (arList && arList.length > 0) {
                                                //    //清除标记
                                                //    removeHighlightFromSelectedText(id, thesisId);
                                                //} else {
                                                //    removeHighlightFromSelectedText(arData.arIds, thesisId);
                                                //}
                                                //刷新
                                                document.getElementById(thesisId).innerHTML = redContentHtml[thesisId];
                                                initArticleRemark(submitid, thesisId, articlePartId, checkFileType, tableModelId);
                                                deserializeSelection("0:0,0:0", thesisId);

                                                $("#delModelBox").dialog("close");
                                                $("#maxredBox").dialog("close");
                                            } else {
                                                alert(data.message);
                                            }
                                        },
                                        error: function (err) {
                                            console.log(err);
                                        }
                                    });
                                }
                            }, {
                                text: '取消',
                                handler: function () {
                                    $("#tooltip").remove();
                                    $("#delModelBox").dialog("close");
                                    $("#maxredBox").dialog("close");
                                }
                            }
                        ]
                    });
                    $("#delModelBox").dialog("open");
                    $('#delModelBox').window('center');
                }
            }]
    });
    $("#maxredBox").dialog("open");
    $('#maxredBox').window('center');
    $('#txtRemark').next('span').find('textarea').focus();
};

// 批注结束