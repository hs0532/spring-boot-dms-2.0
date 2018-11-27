/**
 * 创建一个rangy帮助类
 * var rangyHelper = RangyHelper.createNew();
 */
var RangyHelper = {
    /**
     * 创建的实例
     */
    instance: {},
    /**
     * 已创建实例的个数
     */
    instanceCount: 0,
    /**
     * 批注，评论
     * @param {String} remarkElementId 划词div元素的ID
     * @param {String} articlePartId 论文段落ID，非论文时为空
     * @param {number} operandId 文件ID
     * @param {number} checkFileType 检测文件类型
     * @param {number} tableModelId 自定义ID， 不是自定义时为空
     */
    createNew: function(remarkElementId, articlePartId, operandId, checkFileType, tableModelId) {

        //#region 自定义变量

        /**
         * 自定义属性名称
         */
        var attrArticleRemarkId = "articleRemarkId";
        /**
         * 标记实例
         */
        var highlighter;
        /**
         * 标记样式
         */
        var highlightStyleClass = "highlight";
        /**
         * 占位，没有具体的样式
         */
        var noStyleClass = "noStyle";
        /**
         * 占位实例
         */
        var noStyleLighter;
        //var outTimer = null; //超时计时器，单击和双击事件并存解决方案
        /**
         * 是否支持Range
         */
        var isSupportRange = true;
        //var arId = $("#hdArticleRemarkId").val();
        /**
         * 原文，添加批注前的原文
         */
        var redContentHtml = "";
        /**
         * 参数
         */
        var options = {};
        /**
         * 类的实例
         */
        var rangyHelper = {};
        //#endregion

        //#region 初始化
        options["remarkElementId"] = remarkElementId || "";
        options["articlePartId"] = articlePartId || "";
        options["operandId"] = operandId || "0";
        options["checkFileType"] = checkFileType || "0";
        options["tableModelId"] = tableModelId || "0";

        if (checkValIsUndefinedOrNull(options.remarkElementId) ||
            (checkValIsUndefinedOrNull(options.articlePartId) &&
                (options.operandId <= 0 || options.checkFileType <= 0))) {
            //alert("绑定划词评论功能失败，参数有误");
            if (console && console.error) {
                console.error("绑定划词评论功能失败，参数有误");
            }
            return false;
        } else {
            rangyRemark();
        }

        /**
         * 初始化
         */
        function rangyRemark() {

            redContentHtml = $("#" + options.remarkElementId).html();

            //初始化工具类rangy
            initRangy();

            //鼠标选择文本事件
            //bindMouseUpAndDown(remarkElementId);

            //初始化数据
            initArticleRemark();

        }
        
        //#endregion

        //#region 弹出评论编辑框
        /**
         * 划词后显示“评论”按钮
         * @param {any} pageX 鼠标位置
         * @param {any} pageY 鼠标位置
         */
        function showTooltip(pageX, pageY) {
            $("#hdSerializedSelection").val("");
            $("#hdSelectedText").val("");

            var x = 10;
            var y = 10;

            var selectedText = "";
            var serializedSelectionStr = "";
            try {
                selectedText = rangy.getSelection().toString(); //选中的文本
                if (selectedText != "") {
                    serializedSelectionStr = serializeSelection(options.remarkElementId); //确认选中区的位置
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
                        "top": (pageY + y) + "px",
                        "left": (pageX + x) + "px",
                        "position": "absolute"
                    }).show("fast");
            }
            return isSupportRange;
        }

        /**
         * 判断所选区域是否包含已经标记的区域，或是重叠区域
         * 1:所选区域包含整个已标记区域
         * 2:开始点或结束点在已标记区域内
         */
        function hasOverlap() {
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
                var checkParentNodes = function(iNode, iRootNode) {
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
                var rootNode = document.getElementById(options.remarkElementId);
                if (checkParentNodes(range.startContainer, rootNode) ||
                    checkParentNodes(range.endContainer, rootNode)) {
                    has = 2;
                }
            }
            return has;
        }

        /**
         * 查看详情
         * @param {Number} arId 评论主键ID
         */
        function openDetailDialog(arId) {
            $('#maxredBox').dialog({
                title: '评论',
                buttons: [
                    {
                        text: '确定',
                        handler: function() {
                            if (role == 1 || role == 2) {
                                $('#maxredBox').dialog("close");
                                return;
                            }

                            var saveXhr = saveRemark(arId);
                            saveXhr.done(function(data) {
                                if (data.isSuccess) {
                                    // 关闭弹框
                                    $('#maxredBox').dialog('close');

                                    //var ssTemp = $("#hdSerializedSelection").val(); //临时保存划词位置
                                    var arIdNew = data.message;
                                    if (data.rows && data.rows.length > 0) {
                                        if (!checkValIsUndefinedOrNull(arId) && arId > 0) { //更新
                                            updateRemarkOfRigthList(data.rows[0]);
                                        } else { //插入
                                            deserializeSelection(data.rows[0]["SerializedSelection"]);
                                            var selectedText = rangy.getSelection().toString(); //选中的文本 SelectedText
                                            if (selectedText == data.rows[0]["SelectedText"] && hasOverlap() <= 0) {
                                                highlightSelectedText(highlightStyleClass);
                                                processSelectedText(arIdNew, data.rows[0]["Num"]);
                                                addNewRemark2RightList(data.rows[0]);
                                            }
                                        }
                                    }
                                } else {
                                    alert(data.message);
                                }
                            }).fail(function() {
                                alert("保存失败，请求异常");
                            });
                        }
                    }, {
                        text: '删除',
                        handler: function() {
                            if (role == 1 || role == 2) {
                                alert("您没有权限执行操作！");
                                return;
                            }

                            $("#delModelBox").text("你确定要删除这条评论吗？");
                            $('#delModelBox').dialog({
                                title: '删除评论',
                                buttons: [
                                    {
                                        text: '确定',
                                        handler: function() {
                                            var delXhr = delRemark(arId);
                                            delXhr.done(function(data) {
                                                if (data.isSuccess) {
                                                    //取消页面黄色部分,清除占位标记
                                                    //var arData = parseJson(data.message);
                                                    //var arList = arData.arList;
                                                    //if (arList && arList.length > 0) {
                                                    //    //清除标记
                                                    //    removeHighlightFromSelectedText(id);
                                                    //} else {
                                                    //    removeHighlightFromSelectedText(arData.arIds);
                                                    //}

                                                    //刷新
                                                    document.getElementById(options.remarkElementId).innerHTML =
                                                        redContentHtml;
                                                    initArticleRemark();

                                                    $("#delModelBox").dialog("close");
                                                    $("#maxredBox").dialog("close");
                                                } else {
                                                    alert(data.message);
                                                }
                                            }).fail(function() {
                                                alert("删除失败，请求异常");
                                            });
                                        }
                                    }, {
                                        text: '取消',
                                        handler: function() {
                                            $('#delModelBox').dialog("close");
                                        }
                                    }
                                ]
                            });
                            $("#delModelBox").dialog("open");
                            $('#delModelBox').window('center');
                        }
                    }, {
                        text: '取消',
                        handler: function() {
                            $('#maxredBox').dialog("close");
                        }
                    }
                ],
                onBeforeOpen: function() {
                    //初始化
                    $("#hdArticleRemarkId").val("");
                    $("#txtRemark").textbox("setValue", "");
                    $("#lblCreatorName").text("---");
                    $("#lblDatetime").text("");
                    if (!checkValIsUndefinedOrNull(arId) && arId > 0) {
                        $("#postilDetailContent").html("");
                    } else {
                        $("#postilDetailContent").html($("#hdSelectedText").val());
                    }

                    // 非教师只有查看的权限 不能修改
                    if (role == 1 || role == 2) {
                        $("#txtRemark").textbox("disable");
                    } else {
                        $("#txtRemark").textbox('enable');
                    }

                    //隐藏"删除"按钮
                    if (checkValIsUndefinedOrNull(arId) || arId <= 0 || role == 1 || role == 2) {
                        var buttons = $("#maxredBox").siblings(".dialog-button").find("a");
                        if (buttons && buttons.length > 0) {
                            $.each(buttons,
                                function(index, btn) {
                                    if ($(btn).find(".l-btn-text").text() == "删除") {
                                        $(btn).hide();
                                        return false;
                                    }
                                });
                        }
                    }

                    //获取详情
                    if (!checkValIsUndefinedOrNull(arId) && arId > 0) {
                        var getXhr = getRemark(arId);
                        getXhr.done(function(data) {
                            if (data.isSuccess) {
                                if (data.dataList) {
                                    var ar = data.dataList;
                                    $("#hdArticleRemarkId").val(ar.Id);
                                    $("#txtRemark").textbox("setValue", decodeURIComponent(ar.Remark));
                                    $("#hdSerializedSelection").val(ar.SerializedSelection);
                                    $("#hdSelectedText").val(decodeURIComponent(ar.SelectedText));
                                    $("#lblCreatorName").text(ar.CreatorName);
                                    $("#lblDatetime").text(ar.LastEditTime);
                                    $("#postilDetailContent").html(decodeURIComponent(ar.SelectedText));

                                    //不是自己添加的不能修改
                                    if (!ar.CanEdit) {
                                        $("#txtRemark").textbox("disable");
                                        var buttons = $("#maxredBox").siblings(".dialog-button").find("a");
                                        if (buttons && buttons.length > 0) {
                                            $.each(buttons,
                                                function(index, btn) {
                                                    var btnText = $(btn).find(".l-btn-text").text();
                                                    if (btnText == "删除" || btnText == "确定") {
                                                        $(btn).hide();
                                                    }
                                                });
                                        }
                                    }
                                }
                            } else {
                                alert(data.message);
                            }
                        }).fail(function() {
                            alert("获取详细信息失败，请求异常");
                        });
                    }

                    $('#txtRemark').next('span').find('textarea').focus();
                }
            });
            $('#maxredBox').dialog("open");
            $('#maxredBox').window('center');
        }
        //#endregion

        //#region 处理标记文本

        /**
         * 初始化评论标记
         */
        function initArticleRemark() {
            var getXhr = getRemarkList();
            getXhr.done(function(data) {
                if (data.isSuccess) {
                    if (data.rows && data.rows.length > 0) {
                        $.each(data.rows,
                            function(index, item) {
                                try {
                                    deserializeSelection(item.SerializedSelection);
                                    var selectedText = rangy.getSelection().toString(); //选中的文本 SelectedText
                                    if (selectedText == item.SelectedText && hasOverlap() <= 0) {
                                        if (item.IsDeleted == 0) {
                                            highlightSelectedText(highlightStyleClass);
                                            processSelectedText(item.Id, item.Num);
                                        } else {
                                            highlightSelectedText(noStyleClass);
                                            addHiddenNum(item.Id, item.Num);
                                        }
                                    }
                                } catch (ex) {
                                    console.log(ex.message);
                                }
                            });
                        deserializeSelection("0:0,0:0");
                    }
                    initRightList(data.rows);
                } else {
                    alert(data.message);
                }
            }).fail(function() {
                alert("请求评论数据失败！");
            });
        }

        /**
         * 处理标记文本
         * @param {Number} arId 评论主键ID，如果指定ID，则先选中元素然后再删除标记，并且解除绑定事件；如果未指定ID，则删除默认选中区的标记
         * @param {Number} num 序号
         */
        function processSelectedText(arId, num) {
            var spanList = $("#" + options.remarkElementId + " span[class~='" + highlightStyleClass + "']:not([" + attrArticleRemarkId + "])");
            if (spanList.length > 0) {
                $.each(spanList,
                    function(index, element) {
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

                    });
            }
        }

        /**
         * 添加隐藏序号
         * @param {Number} arId
         * @param {Number} num
         */
        function addHiddenNum(arId, num) {
            var spanList = $("#" + options.remarkElementId + " span[class~='" + noStyleClass + "']:not([" + attrArticleRemarkId + "])");
            if (spanList.length > 0) {
                $.each(spanList,
                    function (index, element) {
                        if (index == 0) {
                            $(element).prepend("<sup style='color: #f00; font-size:0px;'>[" + num + "]</sup>");
                        }
                        $(element).attr(attrArticleRemarkId, arId);
                    });
            }
        }

        /**
         * 加载右侧列表
         * @param {any} dataList 数据集
         */
        function initRightList(dataList) {
            if (dataList && dataList.length > 0) {
                var html = '<ul id="right_' + options.remarkElementId + '" class="gxf_openReport_title" style="overflow: hidden;overflow-y: initial;">';
                $.each(dataList,
                    function(index, value) {
                        if (value["IsDeleted"] == 0) {
                            html += '<li data-id = "' +
                                value["Id"] +
                                '">' +
                                '<div class="statement">' +
                                '<span style="color:#f00; font-weight:bold;">[' +
                                value["Num"] +
                                ']</span>' +
                                '<span class="margl">' +
                                value["姓名"] +
                                '</span>' +
                                '<span class="margl">' +
                                value["LastEditTime"] +
                                '</span></div>' +
                                '<div><span class="detadil_txt_right">' +
                                value["Remark"] +
                                '</span> ' +
                                '<a class="listA margl" href="javascript:void(0);" arId="' +
                                value["Id"] +
                                '">查看详情</a></div>' +
                                '</li>';
                        }
                    });
                html += '</ul>';
                $("#" + options.remarkElementId).parent().siblings("td.rightText").html(html);
            } else {
                var margt = "";
                if (role != 1 && role != 2) {
                    margt = '<p class="margt">如需添加批注，请选中内容添加</p>';
                };
                $("#" + options.remarkElementId).parent().siblings("td.rightText")
                    .html('<div><ul id="right_' +
                        options.remarkElementId +
                        '" class="gxf_openReport_title" style="overflow: hidden;overflow-y: initial;"><li><div style="text-align: center;"><p style="font-size: 20px;">暂无批注内容</p>' +
                        margt +
                        '</div></li>');
            }

            // 设置右边ID
            $("#right_" + options.remarkElementId).css("min-height", "54px");
            $("#right_" + options.remarkElementId).height($("#" + options.remarkElementId).height());

        }

        /**
         * 添加新评论到右侧列表
         * @param {any} data 数据集
         */
        function addNewRemark2RightList(data) {
            var arId = data.Id;
            if (!checkValIsUndefinedOrNull(arId)) {
                var rightLi = $("#right_" + options.remarkElementId + " li[data-id='" + arId + "']");
                if (rightLi && rightLi.length > 0) { //已经存在则更新
                    updateRemarkOfRigthList(data);
                    return;
                }

                var rightHtml = $("#right_" + options.remarkElementId).find("li");
                if (checkValIsUndefinedOrNull(rightHtml.attr("data-id"))) {
                    $("#right_" + options.remarkElementId).empty(); //第一次添加，去除说明
                }

                var html = '<li data-id = "' +
                    data["Id"] +
                    '">' +
                    '<div class="statement"><span style="color:#f00; font-weight:bold;">[' +
                    data["Num"] +
                    ']</span>' +
                    '<span class="margl">' +
                    data["姓名"] +
                    '</span>' +
                    '<span class="margl">' +
                    data["LastEditTime"] +
                    '</span></div>' +
                    '<div><span class="detadil_txt_right">' +
                    data["Remark"] +
                    '</span> ' +
                    '<a class="listA margl" href="javascript:void(0);" arId="' +
                    data["Id"] +
                    '">查看详情</a></div>' +
                    '</li>';

                $("#right_" + options.remarkElementId).append(html);

                // 设置右边ID
                $("#right_" + options.remarkElementId).css("min-height", "54px");
                $("#right_" + options.remarkElementId).height($("#" + options.remarkElementId).height());
            }
        }

        /**
         * 更新右侧列表中的数据
         * @param {any} data 数据集
         */
        function updateRemarkOfRigthList(data) {
            var arId = data.Id;
            if (!checkValIsUndefinedOrNull(arId)) {
                var html = '<div class="statement"><span style="color:#f00; font-weight:bold;">[' +
                    data["Num"] +
                    ']</span>' +
                    '<span class="margl">' +
                    data["姓名"] +
                    '</span>' +
                    '<span class="margl">' +
                    data["LastEditTime"] +
                    '</span></div>' +
                    '<div><span class="detadil_txt_right">' +
                    data["Remark"] +
                    '</span> ' +
                    '<a class="listA margl" href="javascript:void(0);" arId="' +
                    data["Id"] +
                    '">查看详情</a></div>';
                $("#right_" + options.remarkElementId + " li[data-id='" + arId + "']").html(html);
            }
        }

        /**
         * 删除选中文本的已有标记
         * @param {Number} arId 评论主键ID
         */
        function removeHighlightFromSelectedText(arId) {
            if (arId && arId.length > 0) {
                // 删除右侧列表
                var rightLiList = $("#right_" + options.remarkElementId).find("li");
                if (rightLiList && rightLiList.length > 0) {
                    for (var r = (rightLiList.length - 1); r >= 0; r--) {
                        var dataId = $(rightLiList[r]).attr("data-id");
                        if (dataId == arId) {
                            $(rightLiList[r]).remove();
                        }
                    }
                }

                // 删除左边文字黄色标记
                var spanList = $("#" + options.remarkElementId + " span[class~='" + highlightStyleClass + "'][" + attrArticleRemarkId + "='" + arId + "']");
                if (spanList && spanList.length > 0) {
                    //先删除标记序号
                    $.each(spanList,
                        function(index, item) {
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
                        unhighlightSelection(highlightStyleClass);

                        //取消标记，可能会把其他的节点的标记也取消了，所以要重新加上，否则不能正常删除span标签
                        for (var j = 0; j < i; j++) {
                            if (!$(spanList[j]).hasClass(highlightStyleClass)) {
                                range.selectNode(spanList[j]);
                                range.select();
                                highlightSelectedText(highlightStyleClass);
                            }
                        }

                        //紧挨着当前结点的其他标记也会受影响
                        $.each(spanSiblings,
                            function(index, item) {
                                if (!$(item).hasClass(highlightStyleClass)) {
                                    range.selectNode(item);
                                    range.select();
                                    highlightSelectedText(highlightStyleClass);
                                }
                            });
                    }
                }
            } else {
                unhighlightSelection(highlightStyleClass);
            }

            deserializeSelection("0:0,0:0"); //什么都不选中
        }

        //#endregion

        //#region 评论：增删改AJAX
        /**
         * 保存评论，返回jqXHR
         * @param {Number} arId 评论主键ID
         */
        function saveRemark(arId) {
            var jqxhr = $.ajax({
                url: "../Handler/ArticleRemarkRangyHandler.ashx",
                type: "post",
                dataType: "json",
                data: {
                    action: "SaveArticleRemark",
                    id: arId,
                    articlePartId: options.articlePartId,
                    serializedSelection: encodeURIComponent($("#hdSerializedSelection").val()), //如果不编码，冒号会被过滤
                    remark: encodeURIComponent($("#txtRemark").textbox("getValue")),
                    selectedText: encodeURIComponent($("#hdSelectedText").val()), //选中的文本
                    operandId: options.operandId,
                    operandType: -(options.checkFileType),
                    tableModelId: (!checkValIsUndefinedOrNull(options.tableModelId) && options.tableModelId > 0)
                        ? options.tableModelId
                        : (-(options.checkFileType))
                },
                beforeSend: function() {
                    open_loading();
                }
            }).always(function() {
                close_loading();
            });
            return jqxhr;
        }

        /**
         * 删除评论，返回jqXHR
         * @param {Number} arId 评论主键ID
         */
        function delRemark(arId) {
            var num = 1; //序号
            var sup = $("#" + options.remarkElementId + " span[class~='" + highlightStyleClass + "'][" + attrArticleRemarkId + "='" + arId + "']:eq(0)").find("sup");
            if (sup && sup.length > 0) {
                var supText = $(sup).text();
                if (!checkValIsUndefinedOrNull(supText) && supText.length >= 3) {
                    supText = supText.substring(1, supText.length - 1);
                    if (isNumber(supText) && supText > 0) {
                        num = supText;
                    }
                }
            }
            var jqxhr = $.ajax({
                url: "../Handler/ArticleRemarkRangyHandler.ashx",
                type: "post",
                dataType: "json",
                data: {
                    action: "DelArticleRemark",
                    id: arId,
                    articlePartId: options.articlePartId,
                    serializedSelection: encodeURIComponent($("#hdSerializedSelection").val()), //如果不编码，冒号会被过滤
                    operandId: options.operandId,
                    operandType: -(options.checkFileType),
                    tableModelId: (!checkValIsUndefinedOrNull(options.tableModelId) && options.tableModelId > 0)
                        ? options.tableModelId
                        : (-(options.checkFileType)),
                    num: num
                },
                beforeSend: function() {
                    open_loading();
                }
            }).always(function() {
                close_loading();
            });
            return jqxhr;
        }

        /**
         * 获取评论详情，返回jqXHR
         * @param {Number} arId 评论主键ID
         */
        function getRemark(arId) {
            var jqxhr = $.ajax({
                url: "../Handler/ArticleRemarkRangyHandler.ashx",
                data: {
                    action: "GetArticleRemark",
                    id: arId
                },
                type: "post",
                dataType: "json",
                beforeSend: function() {
                    open_loading();
                }
            }).always(function() {
                close_loading();
            });
            return jqxhr;
        }

        /**
         * 获取所有评论数据，返回jqXHR
         */
        function getRemarkList() {
            var jqxhr = $.ajax({
                    url: "../Handler/ArticleRemarkRangyHandler.ashx",
                    data: {
                        action: "GetArticleRemarkList",
                        articlePartId: options.articlePartId, //getUrlParam("sectionId"),
                        operandId: options.operandId,
                        operandType: -(options.checkFileType),
                        tableModelId: (!checkValIsUndefinedOrNull(options.tableModelId) && options.tableModelId > 0)
                            ? options.tableModelId
                            : (-(options.checkFileType))
                    },
                    type: "post",
                    dataType: "json",
                    beforeSend: function() {
                        open_loading();
                    }
                })
                .always(function() {
                    close_loading();
                });
            return jqxhr;
        }
        //#endregion

        //#region 工具类rangy
        /**
         * 初始化工具类rangy
         */
        function initRangy() {
            try {
                rangy.init();
                highlighter = rangy.createHighlighter();
                highlighter.addClassApplier(rangy.createClassApplier(highlightStyleClass,
                    {
                        ignoreWhiteSpace: true,
                        tagNames: ["span"]
                    }));
                noStyleLighter = rangy.createHighlighter();
                noStyleLighter.addClassApplier(rangy.createClassApplier(noStyleClass,
                    {
                        ignoreWhiteSpace: true,
                        tagNames: ["span"]
                    }));
            } catch (ex) {
                isSupportRange = false;
            }
        }

        /**
         * 解析JSON字符串
         * @param {String} jsonStr
         */
        function parseJson(jsonStr) {
            try {
                return JSON.parse(jsonStr);
            } catch (ex) {
                alert("当前浏览器不支持解析JSON字符串功能，请更新至最新版本或更换为其他浏览器后重试。");
                return [];
            }
        }

        /**
         * 选中区序列化
         */
        function serializeSelection() {
            var ss = rangy.serializeSelection(null, true, document.getElementById(options.remarkElementId));
            return ss;
        }

        /**
         * 反序列化，选中文本
         * @param {String} serializedValue 已经序列化后的位置
         */
        function deserializeSelection(serializedValue) {
            return rangy.deserializeSelection(serializedValue, document.getElementById(options.remarkElementId));
        }

        /**
         * 标记选中文本
         * @param {String} styleClassName CSS样式
         */
        function highlightSelectedText(styleClassName) {
            if (styleClassName == highlightStyleClass) {
                highlighter.highlightSelection(styleClassName, { containerElementId: options.remarkElementId });
            } else if (styleClassName == noStyleClass) {
                noStyleLighter.highlightSelection(styleClassName, { containerElementId: options.remarkElementId });
            }
        }

        /**
         * 删除选中文本的标记
         * @param {String} styleClassName CSS样式
         */
        function unhighlightSelection(styleClassName) {
            if (styleClassName == highlightStyleClass) {
                highlighter.unhighlightSelection();
            } else if (styleClassName == noStyleClass) {
                noStyleLighter.unhighlightSelection();
            }
        }

        //#endregion

        //#region 接口
        rangyHelper.irangyRemark = rangyRemark;
        rangyHelper.ideserializeSelection = deserializeSelection;
        rangyHelper.ishowTooltip = showTooltip;
        rangyHelper.iopenDetailDialog = openDetailDialog;
        rangyHelper.ihasOverlap = hasOverlap;
        //#endregion

        //保存创建的实例
        if (RangyHelper.instanceCount <= 0) {
            RangyHelper.bindMouseup();
        }
        RangyHelper.instance[options.remarkElementId] = rangyHelper;
        RangyHelper.instanceCount++;
        return rangyHelper;
    },
    /**
     * 点击评论事件
     */
    bindMouseup: function () {

        var isSupportRangeOfTooltip = true;
        var rangyHelperOfTooltip = null;
        //划词
        $("body").off('mouseup', 'table p').on("mouseup", "table p", function(e) {
            
            // 点击盒子的id
            var remarkElementId = $(this).parent().prop("id");
            if (checkValIsUndefinedOrNull(remarkElementId)) {
                return;
            }

            try {
                rangyHelperOfTooltip = RangyHelper.instance[remarkElementId];
            } catch (ex) {
                if (console && console.error) {
                    console.error(ex);
                }
            }
            if (!rangyHelperOfTooltip) {
                return;
            }

            isSupportRangeOfTooltip = rangyHelperOfTooltip.ishowTooltip(e.pageX, e.pageY); //显示"评论"按钮
            
        }).off('mousedown', 'table p').on('mousedown', 'table p', function() {
            var tooltip = $("#tooltip");
            if (tooltip && tooltip.length > 0) {
                tooltip.remove();
            }
        });

        // 评论点击事件
        $("body").off('click', '#tooltip').on("click", "#tooltip", function () {
            var tooltip = $("#tooltip");
            if (tooltip && tooltip.length > 0) {
                tooltip.remove();
            }
            //权限
            if (role == 1 || role == 2) {
                alert("您没有权限执行此操作！");
                return;
            }
            //提示浏览器是否支持Range
            if (!isSupportRangeOfTooltip) {
                alert("当前浏览器不支持划句评论功能，请更新至最新版本或更换为其他浏览器后重试。");
                return;
            }
            if (rangyHelperOfTooltip) {
                //重叠判断
                rangyHelperOfTooltip.ideserializeSelection($("#hdSerializedSelection").val());
                if (rangyHelperOfTooltip.ihasOverlap() > 0) {
                    alert("请不要选择与已标记区域重叠的区域。");
                    return;
                }
                //弹窗
                rangyHelperOfTooltip.iopenDetailDialog(-1);
            }
        });
        
        // 点击黄色区域
        $("body").off('click', '.highlight').on("click", ".highlight", function () {
            var arId = $(this).attr("articleremarkid");
            var rangyHelper = null;
            var eleId = $(this).closest("div[id]").prop("id");
            if (!checkValIsUndefinedOrNull(eleId)) {
                try {
                    rangyHelper = RangyHelper.instance[eleId];
                } catch (ex) {
                    if (console && console.error) {
                        console.error(ex);
                    }
                }
            }
            
            if (!checkValIsUndefinedOrNull(arId) && arId > 0 && rangyHelper) {
                rangyHelper.iopenDetailDialog(arId);
            }
        });

        //点击“查看详情”
        $("body").off('click', '.rightText a[arId]').on("click", ".rightText a[arId]", function () {
            var arId = $(this).attr("arId");
            var rangyHelper = null;
            var eleId = $(this).closest("ul[id]").prop("id");
            if (!checkValIsUndefinedOrNull(eleId) && eleId.indexOf('_') >= 0) {
                var temps = eleId.split('_');
                temps.shift();
                eleId = temps.join('_');
                rangyHelper = RangyHelper.instance[eleId];
            }
            if (!checkValIsUndefinedOrNull(eleId)) {
                try {
                    rangyHelper = RangyHelper.instance[eleId];
                } catch (ex) {
                    if (console && console.error) {
                        console.error(ex);
                    }
                }
            }
            if (!checkValIsUndefinedOrNull(arId) && arId > 0 && rangyHelper) {
                rangyHelper.iopenDetailDialog(arId);
            }
        });
    }
};

