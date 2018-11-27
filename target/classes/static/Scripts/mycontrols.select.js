var MyControls = MyControls || {};
MyControls.StuTeaUserControl = MyControls.StuTeaUserControl || {};
; (function (nameSpace) {
    nameSpace.loadSpecialData = function (isStudent, id) {
        var requestDataUrl = nameSpace.RequestDataUrl;
        var content = "";
        if (id == "myteacher") {
            content = nameSpace.Teacher;
        } else if (id == "secondTeacher") {
            content = nameSpace.SecondTeacher;
        }
        var serCtrlId = content.ServerControlId;
        var leftDataId = content.LeftDataId;
        if (isStudent) {
            serCtrlId = nameSpace.Student.ServerControlId;
            leftDataId = nameSpace.Student.LeftDataId;
        }
        $("#" + serCtrlId + "_selectSpecial").empty();
        $("#" + leftDataId).empty();
        var pms = {
            action: "GetSpecialList",
            xybh: $("#" + serCtrlId + "_selectAcademy").val()
        };
        $.get(requestDataUrl,
            pms,
            function (result) {
                if (result == null)
                    return;
                var dlArr = [];
                var optionArr = [];
                if (result.isSuccess) {
                    $.each(result.rows, function (index, item) {
                        optionArr.push("<option value='" + item.value + "'>" + item.text + "</option>");
                        if (item.value != "-1") {
                            dlArr.push("<dl class='optDl optClosed'><dt><em class='dott'></em><span value='" + item.value + "'>" + item.text + "</span></dt></dl>");
                        }
                    });
                }
                $("#" + serCtrlId + "_selectSpecial").append(optionArr.join(""));
                $("#" + leftDataId).append(dlArr.join(" "));
                dlArr.length = 0;
                optionArr.length = 0;
                nameSpace.setControlDisabled(true, nameSpace.Student.IsDisabled, id);
                dlArr.length = 0;
            },
            "json");
    };
    nameSpace.addChoiceData = function (isStudent, value, text, id) {
        var rightDataId = id + "_HasChoiceData";
        var leftDataId = id + "_NotChoiceData";
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
    nameSpace.clearSelectedResult = function (isStudent,id) {
        var rigthDataId = id + "_HasChoiceData";
        if (isStudent) {
            rigthDataId = nameSpace.Student.RightDataId;
        }
        $("#" + rightDataId + " li span").empty();
    };
    nameSpace.setSeletedResult = function (isStudent, resArr,id) {
        if (resArr == null)
            return;
        if (!nameSpace.checkParamsIsBoolean(isStudent)) {
            isStudent = true;
        }
        for (var i = 0, len = resArr.length; i < len; i++) {
            var arr = resArr[i].split("$");
            nameSpace.addChoiceData(isStudent, arr[0], arr[1],id);
        };
    };
    nameSpace.getSelectedResult = function (isStudent, id, isText) {
        if (typeof isText !== "boolean")
            isText = false;
        var rightDataId = id + "_HasChoiceData";
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
    nameSpace.clearAll = function (isStudent, id) {
        var serverCtrId = id;
        var leftDataId = serverCtrId + "_NotChoiceData";
        var rightDataId = serverCtrId + "_HasChoiceData";
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
    nameSpace.loadAcademyData = function (isStudent, sel_academy_id, id) {
        var serCtrlId = id;
        if (isStudent) {
            serCtrlId = nameSpace.Student.ServerControlId;
        }
        nameSpace.clearAll(isStudent,id);
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
                     if (result.isSuccess) {
                         $.each(result.rows, function (index, item) {
                             if (sel_academy_id != undefined && item.value == sel_academy_id) {
                                 optionArr.push("<option value='" + item.value + "' selected='selected'>" + item.text + "</option>");
                             }
                             else {
                                 optionArr.push("<option value='" + item.value + "'>" + item.text + "</option>");
                             }
                         });
                     }
                     $("#" + serCtrlId + "_selectAcademy").append(optionArr.join(""));
                     optionArr.length = 0;
                     if (isStudent) {
                         nameSpace.loadSpecialData(isStudent, id);
                     }
                     else if (id == "myteacher") {
                         nameSpace.searchTeacher(id);
                     }
                     else {
                         nameSpace.searchSecondTeacher(id,1);
                     }
                 }
                 , "json");
        $("#" + serCtrlId + "_selectAcademy").unbind("change");
        $("#" + serCtrlId + "_selectAcademy").change(function () {
            if (isStudent) {
                nameSpace.loadSpecialData(isStudent, id);
            }
            else if (id == "myteacher") {
                nameSpace.searchTeacher(id);
            }
            else{
                nameSpace.searchSecondTeacher(id,1);
            }

        });
    };
    nameSpace.getAcademySpecialResult = function (isStudent, isAcademy, id) {
        var serverCtlId = id;
        if (isStudent) {
            serverCtlId = nameSpace.Student.ServerControlId;
        }
        var selectId = serverCtlId + "_selectAcademy";
        if (isAcademy) {
            selectId = serverCtlId + "_selectSpecial";
        }
        return $("#" + selectId).val();
    };
    // 禁用选择框
    nameSpace.setControlDisabled = function (isStudent, isDisabled , id) {
        //alert("ddd");
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
            if (id == "myteacher") {
                nameSpace.Teacher.IsDisabled = isDisabled;
            } else if (id == "secondTeacher") {
                nameSpace.SecondTeacher.IsDisabled = isDisabled;
            }
        }
        var serverCtlId = id;
        //if (isStudent) {
        //    serverCtlId = nameSpace.Student.ServerControlId + "info";
        //}
        $("#" + serverCtlId+"info")[isDisabled ? "addClass" : "removeClass"]("stuteaDisabled");
        //$("#" + serverCtlId + " :input").each(function (index, ctl) {
        //    $(ctl)[isDisabled ? "hide" : "show"]();
        //});
        //$("#" + serverCtlId + " span[class='optSpan']").each(function (index, ctl) {
        //    $(ctl)[isDisabled ? "hide" : "show"]();
        //});
        //$("#" + serverCtlId + " span[class='Addcareer']").each(function (index, ctl) {
        //    $(ctl)[isDisabled ? "hide" : "show"]();
        //});
        var leftDataId = serverCtlId + "_NotChoiceData";
        var rightDataId = serverCtlId + "_HasChoiceData";
        var selectorId = leftDataId + " .optDdOl>li";
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
    nameSpace.loadData = function (isStudent, sel_academy_id, id) {
        nameSpace.loadAcademyData(isStudent, sel_academy_id, id);
    };
    // ========== 团队教师 ==========
    nameSpace.Teacher = nameSpace.Teacher || {};
    nameSpace.RequestDataUrl = "../Handler/MyControlSelectStuTeaHandler.ashx";
    nameSpace.Teacher.ServerControlId = "myteacher";
    nameSpace.Teacher.LeftDataId = nameSpace.Teacher.ServerControlId + "_NotChoiceData";
    nameSpace.Teacher.RightDataId = nameSpace.Teacher.ServerControlId + "_HasChoiceData";
    nameSpace.Teacher.IsDisabled = false;
    nameSpace.Teacher.Init = function (id) {
        if (id != undefined && id != "")
           nameSpace.Teacher.ServerControlId = id;
    }
    nameSpace.searchTeacher = function (id) {
        var params = {
            action: "GetTeacherList",
            jsxm: $("#" + id + "_teacherText").val(),
            xybh: $("#" + id + "_selectAcademy").val(),
            rd: Math.random()
        };
        $("#" + nameSpace.Teacher.LeftDataId).empty();
        $.get(
      nameSpace.RequestDataUrl,
                 params,
                 function (result) {
                     if (result == null)
                         return;
                     var teaArr = ["<dd><ol class='optDdOl'>"];
                     if (result.isSuccess) {
                         $.each(result.rows, function (index, item) {
                             teaArr.push("<li value='" + item.value + "' onclick='MyControls.StuTeaUserControl.addChoiceData(false,\"" + item.value + "\",\"" + item.text + "\",\"" + id + "\");'>" + item.text + "</li>");
                         });
                     }
                     teaArr.push("</ol></dd>");
                     $("#" + nameSpace.Teacher.LeftDataId).append(teaArr.join(""));
                     teaArr.length = 0;
                     nameSpace.setControlDisabled(false, nameSpace.Teacher.IsDisabled, id);
                 },
                'json');
        //close_loading();
    };
    // ========== 第二导师 ==========
    nameSpace.SecondTeacher = nameSpace.SecondTeacher || {};
    nameSpace.RequestDataUrl = "../Handler/MyControlSelectStuTeaHandler.ashx";
    nameSpace.SecondTeacher.ServerControlId = "secondTeacher";
    nameSpace.SecondTeacher.LeftDataId = nameSpace.SecondTeacher.ServerControlId + "_NotChoiceData";
    nameSpace.SecondTeacher.RightDataId = nameSpace.SecondTeacher.ServerControlId + "_HasChoiceData";
    nameSpace.SecondTeacher.IsDisabled = false;
    nameSpace.SecondTeacher.Init = function (id) {
        if (id != undefined && id != "")
            nameSpace.SecondTeacher.ServerControlId = id;
    }
    nameSpace.searchSecondTeacher = function (id, type) {
        var params = {
            action: "GetTeacherList",
            jsxm: $("#" + id + "_teacherText").val(),
            xybh: $("#" + id + "_selectAcademy").val(),
            type: type,
            rd: Math.random()
        };
        $("#" + nameSpace.SecondTeacher.LeftDataId).empty();
        $.get(
      nameSpace.RequestDataUrl,
                 params,
                 function (result) {
                     if (result == null)
                         return;
                     var teaArr = ["<dd><ol class='optDdOl'>"];
                     if (result.isSuccess) {
                         $.each(result.rows, function (index, item) {
                             teaArr.push("<li value='" + item.value + "' onclick='MyControls.StuTeaUserControl.addChoiceData(false,\"" + item.value + "\",\"" + item.text + "\",\"" + id + "\");'>" + item.text + "</li>");
                         });
                     }
                     teaArr.push("</ol></dd>");
                     $("#" + nameSpace.SecondTeacher.LeftDataId).append(teaArr.join(""));
                     teaArr.length = 0;
                     nameSpace.setControlDisabled(false, nameSpace.SecondTeacher.IsDisabled, id);
                 },
                'json');
        //close_loading();
    };
    // ========== 学生 ==========
    nameSpace.Student = nameSpace.Student || {};
    nameSpace.RequestDataUrl = "../Handler/MyControlSelectStuTeaHandler.ashx";
    nameSpace.Student.ServerControlId = "mystudent";
    nameSpace.Student.LeftDataId = nameSpace.Student.ServerControlId + "_NotChoiceData";
    nameSpace.Student.RightDataId = nameSpace.Student.ServerControlId + "_HasChoiceData";
    nameSpace.Student.IsDisabled = false;
    nameSpace.Student.Init = function (id) {
        if (id != undefined && id != "")
            nameSpace.Student.ServerControlId = id;
    }
    nameSpace.searchStudent = function (specialNo, $dl) {
        if (specialNo == null) {
            specialNo = $("#" + nameSpace.Student.ServerControlId + "_selectSpecial").val();
        }
        if (specialNo == -1) {
            $("#" + nameSpace.Student.LeftDataId).empty();
            nameSpace.loadSpecialData(true);
            return;
        }
        if ($dl == null) {
            $("#" + nameSpace.Student.LeftDataId).empty();
            $dl = $("<dl class='optDl'></dl>");
            var specialText = $("#" + nameSpace.Student.ServerControlId + "_selectSpecial option[value='" + specialNo + "']").text();
            $dl.append("<dt><em class='dott'></em><span value='" + specialNo + "'>" + specialText + "</span></dt>");
            $("#" + nameSpace.Student.LeftDataId).append($dl);
        }
        var params = {
            action: "GetStudentList",
            xsxm: $("#" + nameSpace.Student.ServerControlId + "_studentText").val(),
            xsxh: $("#" + nameSpace.Student.ServerControlId + "_studentNumberText").val(),
            xybh: $("#" + nameSpace.Student.ServerControlId + "_selectAcademy").val(),
            zybh: specialNo,
            rd: Math.random()
        };
        $.get(
      nameSpace.RequestDataUrl,
                 params,
                 function (result) {
                     if (result == null) {
                         alert("网络错误");
                         return;
                     }
                     var $ol = $("<ol class='optDdOl'></ol>");
                     $ol.hide();
                     if (result.isSuccess) {
                         $.each(result.rows, function (index, item) {
                             var $li = $("<li></li>").text(item.text).click(function () {
                                 MyControls.StuTeaUserControl.addChoiceData(true, item.value, item.text, "mystudent");
                             });
                             $ol.append($li);
                         });
                     }
                     $ol.show();
                     var $dd = $("<dd></dd>");
                     $dd.append($ol);
                     $dl.append($dd);

                 },
                'json');
    };
})(MyControls.StuTeaUserControl);