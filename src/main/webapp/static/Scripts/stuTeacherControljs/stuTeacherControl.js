var MyControls = MyControls || {};
MyControls.StuTeaUserControl = MyControls.StuTeaUserControl || {};
; (function (nameSpace) {
    nameSpace.loadSpecialData = function (isStudent) {
        var requestDataUrl = nameSpace.RequestDataUrl;
        var serCtrlId = nameSpace.Teacher.ServerControlId;
        var leftDataId = nameSpace.Teacher.ServerControlId;
        if (isStudent) {
            serCtrlId = nameSpace.Student.ServerControlId;
            leftDataId = nameSpace.Student.LeftDataId;
        }
        $("#" + serCtrlId + "_selectSpecial").empty();
        var pms = {
            action: "GetSpecialList",
            acadeNo: $("#" + serCtrlId + "_selectAcademy").val()
        };
        $.get(requestDataUrl,
            pms,
            function (result) {
                if (result == null)
                    return;
                var dlArr = [];
                var optionArr = [];
                $.each(result.dataList, function (index, item) {
                    optionArr.push("<option value='" + item.value + "'>" + item.text + "</option>");
                    if (item.value != "-1") {
                        dlArr.push("<dl class='optDl optClosed'><dt><em class='dott'></em><span value='" + item.value + "'>" + item.text + "</span></dt></dl>");
                    }
                });
                $("#" + serCtrlId + "_selectSpecial").append(optionArr.join(""));
                $("#" + leftDataId).append(dlArr.join(" "));
                dlArr.length = 0;
                optionArr.length = 0;
                nameSpace.setControlDisabled(true, nameSpace.Student.IsDisabled);
                dlArr.length = 0;
            },
            "json");
    };
    nameSpace.addChoiceData = function (isStudent, value, text) {
        var rightDataId = nameSpace.Teacher.RightDataId;
        var leftDataId = nameSpace.Teacher.LeftDataId;
        if (isStudent) {
            leftDataId = nameSpace.Student.LeftDataId;
            rightDataId = nameSpace.Student.RightDataId;
        }
        var isExists = false;
        $("#" + rightDataId + " li span ").each(function () {
            isExists = false;
            if ($(this).attr("value") == value) {
                isExists = true;
                return false;
            }
        });
        if (isExists)
            return false;

        var em = $("<em class='optLiDel'></em>").click(function () {
            $(this).parent().remove();
        });
        var li = $("<li></li>");
        li.append(em);
        li.append("<span value='" + value + "'>" + text + "</span>");
        $("#" + rightDataId).append(li);
    };
    nameSpace.clearSelectedResult = function (isStudent) {
        var rigthDataId = nameSpace.Teacher.RightDataId;
        if (isStudent) {
            rigthDataId = nameSpace.Student.RightDataId;
        }
        $("#" + rightDataId + " li span").empty();
    };
    nameSpace.setSeletedResult = function (isStudent, resArr) {
        if (resArr == null)
            return;
        if (!nameSpace.checkParamsIsBoolean(isStudent)) {
            isStudent = true;
        }
        for (var i = 0, len = resArr.length; i < len; i++) {
            var arr = resArr[i].split("$");
            nameSpace.addChoiceData(isStudent, arr[0], arr[1]);
        };
    };
    nameSpace.getSelectedResult = function (isStudent, isText) {
        if (typeof isText !== "boolean")
            isText = false;
        var rightDataId = nameSpace.Teacher.RightDataId;
        if (isStudent) {
            rightDataId = nameSpace.Student.RightDataId;
        }
        var resValueArr = [];
        var resTextArr = [];
        $("#" + rightDataId + " li span").each(function (index, item) {
            resValueArr.push($(this).attr("value"));
            var text = $(this).text();
            var leftBracketIndex = text.indexOf("(");
            if (leftBracketIndex > -1) {
                text = text.substring(0, leftBracketIndex);
            }
            resTextArr.push(text);
        });
        if (isText)
            return resTextArr.join(",");
        return resValueArr.join(",");
    };
    nameSpace.clearAll = function (isStudent) {
        var serverCtrId = nameSpace.Teacher.ServerControlId;
        var leftDataId = nameSpace.Teacher.LeftDataId;
        var rightDataId = nameSpace.Teacher.RightDataId;
        if (isStudent) {
            serverCtrId = nameSpace.Student.ServerControlId;
            leftDataId = nameSpace.Student.LeftDataId;
            rightDataId = nameSpace.Student.RightDataId;
            $("#" + serverCtrId + "studentText").val("");
            $("#" + serverCtrId + "_selectSpecial").empty();
        }
        $("#" + serverCtrId + "_selectAcademy").empty();
        $("#" + leftDataId).empty();
        $("#" + rightDataId).empty();
    };
    nameSpace.loadAcademyData = function (isStudent) {
        var serCtrlId = nameSpace.Teacher.ServerControlId;
        if (isStudent) {
            serCtrlId = nameSpace.Student.ServerControlId;
        }
        nameSpace.clearAll(isStudent);
        var params = {
            action: "GetAcademyList",
            rd: Math.random()
        };

        $.get(
                 nameSpace.RequestDataUrl,
                 params,
                 function (result) {
                     if (result == null)
                         return;
                     var optionArr = [];
                     $.each(result.dataList, function (index, item) {
                         optionArr.push("<option value='" + item.value + "'>" + item.text + "</option>");
                     });
                     $("#" + serCtrlId + "_selectAcademy").append(optionArr.join(""));
                     optionArr.length = 0;
                     if (isStudent) {
                         nameSpace.loadSpecialData(isStudent);
                     }
                     else {
                         nameSpace.searchTeacher();
                     }
                 }
                 , "json");
        $("#" + serCtrlId + "_selectAcademy").unbind("change");
        $("#" + serCtrlId + "_selectAcademy").change(function () {
            nameSpace.loadSpecialData(isStudent);
        });
    };
    nameSpace.getAcademySpecialResult = function (isStudent, isAcademy) {
        var serverCtlId = nameSpace.Teacher.ServerControlId;
        if (isStudent) {
            serverCtlId = nameSpace.Student.ServerControlId;
        }
        var selectId = serverCtlId + "_selectAcademy";
        if (isAcademy) {
            selectId = serverCtlId + "_selectSpecial";
        }
        return $("#" + selectId).val();
    };
    nameSpace.setControlDisabled = function (isStudent, isDisabled) {
        if (!nameSpace.checkParamsIsBoolean(isStudent)) {
            isStudent = true;
        }
        if (!nameSpace.checkParamsIsBoolean(isDisabled)) {
            isDisabled = true;
        }
        if (isStudent) {
            nameSpace.Student.IsDisabled = isDisabled;
        }
        else {
            nameSpace.Teacher.IsDisabled = isDisabled;
        }
        var serverCtlId = nameSpace.Teacher.ServerControlId;
        if (isStudent) {
            serverCtlId = nameSpace.Student.ServerControlId;
        }
        $("#" + serverCtlId)[isDisabled ? "addClass" : "removeClass"]("stuteaDisabled");
        $("#" + serverCtlId + " :input,#" + serverCtlId + " span[class='optSpan']").each(function (index, ctl) {
            $(ctl)[isDisabled ? "hide" : "show"]();
        });
        var leftDataId = nameSpace.Teacher.LeftDataId;
        var rightDataId = nameSpace.Teacher.RightDataId;
        var selectorId = leftDataId + " li";
        if (isStudent) {
            leftDataId = nameSpace.Student.LeftDataId;
            rightDataId = nameSpace.Student.RightDataId;
            selectorId = leftDataId + " dt";
        }
        $("#" + selectorId).each(function (index, ctl) {
            if (isDisabled) {
                $(this).removeAttr("onclick").unbind();
            } else {
                $(ctl).click(function () {
                    if (!isStudent)
                        return false;
                    var $span = $(this).find("span");
                    var $dl = $(this).parent();
                    $dl.toggleClass("optClosed");
                    $(this).parent().parent().find("dl").each(function (index, item) {
                        if ($(this).find("span").attr("value") != $span.attr("value")) {
                            if (!$(this).hasClass("optClosed")) {
                                $(this).addClass('optClosed');
                            }
                        }
                    });
                    $(this).parent().find("dd").remove();
                    if ($dl.hasClass("optClosed")) {
                        return;
                    }
                    nameSpace.searchStudent($span.attr("value"), $dl);
                });
            }
        });
        $("#" + rightDataId + "  li em").each(function (index, ctl) {
            if (isDisabled) {
                $(this).removeAttr("onclick").unbind();
            } else {
                $(ctl).bind("click", function () {
                    $(this).parent().remove();
                });
            }
        });
    };
    nameSpace.checkParamsIsBoolean = function (value) {
        return typeof value === "boolean";
    };
    nameSpace.loadData = function (isStudent) {
        nameSpace.loadAcademyData(isStudent);
    };
})(MyControls.StuTeaUserControl);