﻿var iTime = ""; //intial time
var Timeleft = ""; //time left

//roundNumber found via google
function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

//minsec
function minsec(time, tempTime) {
    var ztime;
    if (time == "m") {
        ztime = Math.floor(tempTime / 60);
        if (ztime < 10) {
            ztime = "0" + ztime;
        }
    } else if (time == "s") {
        ztime = Math.ceil(tempTime % 60);
        if (ztime < 10) {
            ztime = "0" + ztime;
        }
    } else {
        ztime = "minsec error...";
    }
    return ztime;
}

function preLoad() {
    if (!this.support.loading) {
        alert("您需要安装 Flash Player 9.028 或者更高版本！");
        return false;
    }
}
function loadFailed() {
    alert("上传功能加载失败！");
}

function fileQueued(file) {

    var fn = file.name;
    var pos = fn.lastIndexOf(".");
    var lastname = fn.substring(pos, fn.length)

    document.getElementById("txtFileName").value = file.name;
    document.getElementById("file_id").value = file.id;

    $("#txtFileName").textbox("setText", file.name);
}

function fileQueued_Attachment(file) {

    document.getElementById("txtAttachmentName").value = file.name;
    document.getElementById("hdAttachmentId").value = file.id;

    $("#txtAttachmentName").textbox("setText", file.name);

}

/**
 * 审核时上传附件
 * @param {any} file
 */
function fileQueued_Audit(file) {

    document.getElementById("txtFileNameOfAudit").value = file.name;
    document.getElementById("hdFileIdOfAudit").value = file.id;

    $("#txtFileNameOfAudit").textbox("setText", file.name);

}

function fileDialogStart(file) {



}

function fileQueueError(file, errorCode, message) {
    try {

        var imageName = "选择文件非法！";
        //var errorName = "";
        if (errorCode === SWFUpload.errorCode_QUEUE_LIMIT_EXCEEDED) {
            imageName = "选择文件过多！";
        }

        switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                imageName = "文件大小为 零 ！";
                break;
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                imageName = "选择文件过大（已经超过3GB）！";
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
            default:
                //alert(imageName);
                break;
        }

        //addImage("images/" + imageName);
        alert(imageName);

    } catch (ex) {
        this.debug(ex);
    }

}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
    try {
        if (numFilesQueued > 0) {
            //this.startUpload();
        }
    } catch (ex) {
        this.debug(ex);
    }
}

function uploadStart(file) {
    try {
        /* I don't want to do any file validation or anything, I'll just update the UI and
        return true to indicate that the upload should start.
        It's important to update the UI here because in Linux no uploadProgress events are called. The best
        we can do is say we are uploading.
        */
        //Capture start time
        var currentTime = new Date()
        iTime = currentTime;
        //Set Timeleft to estimating
        Timeleft = "计算中...";

        var progress = new FileProgress(file, this.customSettings.progressTarget);
        progress.setStatus("上传准备中...");
        progress.toggleCancel(true, this);
    }
    catch (ex) { }

    return true;
}


function uploadProgress(file, bytesLoaded) {

    try {

        //        if (confirm("您上传的文件大小为：" + file.size + "字节，是否继续？")) {
        //		var percent = Math.ceil((bytesLoaded / file.size) * 100);

        //		var progress = new FileProgress(file,  this.customSettings.upload_target);
        //		progress.setProgress(percent);
        //		if (percent === 100) {
        //			progress.setStatus("文件解析中......");
        //			progress.toggleCancel(false, this);
        //		} else {
        //			progress.setStatus("上传中........进度"+percent+"%");
        //			progress.toggleCancel(true, this);
        //		}
        var currentTime = new Date()
        var percent = Math.ceil((bytesLoaded / file.size) * 100);

        if (percent > 100) {
            percent = 100;
        }

        var progress = new FileProgress(file, this.customSettings.upload_target);
        progress.setProgress(percent);

        if (percent === 100) {
            progress.setStatus("正在上传，请耐心等待......");
            progress.toggleCancel(false, this);
        } else {
            //progress.setStatus("上传中........进度"+percent+"%");
            //progress.toggleCancel(true, this);

            var tempTime = 0;
            //rndfilesize = round file size  
            var rndfilesize = roundNumber(((file.size / 1024) / 1024), 1);
            //uploaded = how much has been uploaded
            var uploaded = roundNumber(((bytesLoaded / 1024) / 1024), 1);
            //uTime = uploadTime (time spent uploading)
            var uTime = (Math.ceil(currentTime - iTime) / 1000);
            //uSpeed = uploadSpeed (40 kB/s)
            var uSpeed = Math.floor(roundNumber(((bytesLoaded / uTime) / 1024), 2));
            //tempTime = store time for following functions
            var tempTime = uTime;
            //uploadTime in min:sec
            uTime = "用时" + minsec("m", tempTime) + "分:" + minsec("s", tempTime) + "秒";
            //tempTime = reassign val
            tempTime = roundNumber(((((file.size - bytesLoaded) / uSpeed) / 60) / 10), 2);
            if (tempTime != "Infinity") {
                if (tempTime > 0) {
                    //if greater than 0
                    //Timeleft in min:sec
                    Timeleft = minsec("m", tempTime) + "分:" + minsec("s", tempTime) + '秒';
                } else {
                    Timeleft = "计算中...";
                }
            } else {
                Timeleft = "计算中...";
            }

            //Variables available
            //uSpeed = the rate of upload (40 kB/s)
            //uploaded = how much of the file has upload in MB
            //rndfilesize = file size in MB
            //uTime = how much time has been spent uploading in min:sec (xx:yy elapsed)
            //Timeleft = how much time is left in min:sec (xx:yy remain)
            //           progress.setStatus('<b><font color=red>' +uploaded + '</font></b>/' + rndfilesize + ' MB,上传速度: <b><font color=red>' + uSpeed + ' </font></b>KB/秒; 剩余时间: <b><font color=red>' 
            //                               + Timeleft + '</font></b>; 总进度 <b><font color=red>' + percent + '%</font></b>');
            progress.setStatus('进度...<b><font color=red>' + percent + '%</font></b>（上传速度: <b>' + uSpeed + '</b> KB/S , 已上传: <b>' + uploaded + '/' + rndfilesize + '</b> MB）');
            progress.toggleCancel(true, this);

        }
        //        }
        //        else {

        //        }

    } catch (ex) {
        this.debug(ex);
    }
}

function uploadSuccess(file, serverData) {
    try {
        //close_loading();
        var progress;
        var message = JSON.parse(serverData).message;
        var errorCode = JSON.parse(serverData).errorCode;

        //var PopUpMessage = "";
        switch (errorCode) {
            case 1000: //上传成功(通用)
                progress = new FileProgress(file, this.customSettings.upload_target);
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                if (uploadSuccessCallback && typeof(uploadSuccessCallback) === "function") {
                    uploadSuccessCallback();
                }
                break;
            case 10://学生论文上传成功
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                ReturnFresh();
                break;
            case 11://学生论文 上传附件
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                ReturnFresh();
                break;
            case 16://学生论文上传成功后上传附件
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                progress.toggleCancel(false);
                uploadAttachment();//论文上传成功后 上传附件
                //alert(message);
                break;
            case 100://课题
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                project_openframe();
                //window.location.href = "ProjectsList.aspx";
                break;
            case 101://学生excel导入
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                //alert(message);
                PreviewImportStuList();
                //window.location.href = "ProjectsList.aspx";
                break;
            case 102://教师excel导入
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                //alert(message);
                PreviewImportList();
                //window.location.href = "ProjectsList.aspx";
                break;
            case 103://学院专业excel导入
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                PreviewImportList();
                break;
            case 200://添加中期报告
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                Refresh();
                break;
            case 300://上传成功
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                break;
            case 301://添加指导记录成功
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                ReturnFresh();
                break;
            case 302://审核成功
                progress = new FileProgress(file, this.customSettings.upload_target);
                progress.setComplete();
                progress.setStatus(message);
                alert(message);

                //刷新前一个页面
                var prevTitle = getUrlParam("prevTitle");
                refreshTab(prevTitle);

                //关闭当前页
                closeCurTab();

                break;
            case 401://公告附件上传成功
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                AfterSuccess();
                break;
            case 500://添加开题报告
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                Refresh();
                break;
            case 700://添加文献综述
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                Refresh();
                break;
            case 800://添加任务书
                progress = new FileProgress(file, this.customSettings.upload_target);
                //progress.setError();
                progress.setComplete();
                progress.setStatus(message);
                alert(message);
                task_openframe();
                break;
            default:
                //alert("文件: " + file.name + " 上传失败(" + message + ")！");
                progress = new FileProgress(file, this.customSettings.upload_target);
                progress.setError();
                progress.setStatus("上传失败(" + message + ")！");
                // 关闭 正在加载弹框
                //close_loading();
                alert(message);
                break;
        }

    } catch (ex) {
        this.debug(ex);
    }
}

function uploadComplete(file) {
    try {
        close_loading();
        /*  I want the next upload to continue automatically so I'll call startUpload here */
        //		if (this.getStats().files_queued > 0) {
        //			this.startUpload();
        //		} else {
        //			var progress = new FileProgress(file,  this.customSettings.upload_target);
        //			progress.setComplete();
        //			progress.setStatus("上传成功.");
        //			progress.toggleCancel(false);

        //		}
    } catch (ex) {
        this.debug(ex);
    }
}

function uploadError(file, errorCode, message) {
    var imageName = "error.gif";
    var progress;
    //alert(file.name+"==" +message+"=="+errorCode);
    try {
        switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                try {
                    progress = new FileProgress(file, this.customSettings.upload_target);
                    progress.setCancelled();
                    progress.setStatus("Cancelled");
                    progress.toggleCancel(false);
                }
                catch (ex1) {
                    this.debug(ex1);
                }
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                try {
                    progress = new FileProgress(file, this.customSettings.upload_target);
                    progress.setCancelled();
                    progress.setStatus("Stopped");
                    progress.toggleCancel(true);
                }
                catch (ex2) {
                    this.debug(ex2);
                }
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                imageName = "uploadlimit.gif";
                break;
            default:
                //alert("文件: " + file.name + " 上传失败（" + errorCode + "）！");
                progress = new FileProgress(file, this.customSettings.upload_target);
                progress.setError();
                progress.setStatus("上传失败");
                break;
        }


    } catch (ex3) {
        this.debug(ex3);
    }

}


function addImage(src) {
    var newImg = document.createElement("img");
    newImg.style.margin = "5px";

    document.getElementById("thumbnails").appendChild(newImg);
    if (newImg.filters) {
        try {
            newImg.filters.item("DXImageTransform.Microsoft.Alpha").opacity = 0;
        } catch (e) {
            // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
            newImg.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + 0 + ')';
        }
    } else {
        newImg.style.opacity = 0;
    }

    newImg.onload = function () {
        fadeIn(newImg, 0);
    };
    newImg.src = src;
}

function fadeIn(element, opacity) {
    var reduceOpacityBy = 5;
    var rate = 30; // 15 fps


    if (opacity < 100) {
        opacity += reduceOpacityBy;
        if (opacity > 100) {
            opacity = 100;
        }

        if (element.filters) {
            try {
                element.filters.item("DXImageTransform.Microsoft.Alpha").opacity = opacity;
            } catch (e) {
                // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
                element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity + ')';
            }
        } else {
            element.style.opacity = opacity / 100;
        }
    }

    if (opacity < 100) {
        setTimeout(function () {
            fadeIn(element, opacity);
        }, rate);
    }
}



/* ******************************************
*	FileProgress Object
*	Control object for displaying file info
* ****************************************** */

function FileProgress(file, targetID) {
    //alert(targetID);
    this.fileProgressID = "divFileProgress";


    var progressWrappers = $("#" + targetID + " .progressWrapper");
    this.fileProgressWrapper = null;
    if (progressWrappers && progressWrappers.length > 0) {
        this.fileProgressWrapper = progressWrappers[0];
    }

    //this.fileProgressWrapper = document.getElementById(this.fileProgressID);
    if (!this.fileProgressWrapper) {
        this.fileProgressWrapper = document.createElement("div");
        this.fileProgressWrapper.className = "progressWrapper";
        this.fileProgressWrapper.id = this.fileProgressID;

        this.fileProgressElement = document.createElement("div");
        this.fileProgressElement.className = "progressContainer";

        var progressCancel = document.createElement("a");
        progressCancel.className = "progressCancel";
        progressCancel.href = "#";
        progressCancel.style.visibility = "hidden";
        progressCancel.appendChild(document.createTextNode(" "));

        var progressText = document.createElement("div");
        progressText.className = "progressName";
        progressText.appendChild(document.createTextNode(file.name));

        var progressBar = document.createElement("div");
        progressBar.className = "progressBarInProgress";

        var progressStatus = document.createElement("div");
        progressStatus.className = "progressBarStatus";
        progressStatus.innerHTML = "&nbsp;";

        this.fileProgressElement.appendChild(progressCancel);
        this.fileProgressElement.appendChild(progressText);
        this.fileProgressElement.appendChild(progressStatus);
        this.fileProgressElement.appendChild(progressBar);

        this.fileProgressWrapper.appendChild(this.fileProgressElement);

        document.getElementById(targetID).appendChild(this.fileProgressWrapper);
        fadeIn(this.fileProgressWrapper, 0);

    } else {
        this.fileProgressElement = this.fileProgressWrapper.firstChild;
        this.fileProgressElement.childNodes[1].firstChild.nodeValue = file.name;
    }

    this.height = this.fileProgressWrapper.offsetHeight;

}
FileProgress.prototype.setProgress = function (percentage) {
    this.fileProgressElement.className = "progressContainer green";
    this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
    this.fileProgressElement.childNodes[3].style.width = percentage + "%";
};
FileProgress.prototype.setComplete = function () {
    this.fileProgressElement.className = "progressContainer blue";
    this.fileProgressElement.childNodes[3].className = "progressBarComplete";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setError = function () {
    this.fileProgressElement.className = "progressContainer red";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setCancelled = function () {
    this.fileProgressElement.className = "progressContainer";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setStatus = function (status) {
    this.fileProgressElement.childNodes[2].innerHTML = status;
};

FileProgress.prototype.toggleCancel = function (show, swfuploadInstance) {
    this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
    if (swfuploadInstance) {
        var fileID = this.fileProgressID;
        this.fileProgressElement.childNodes[0].onclick = function () {
            swfuploadInstance.cancelUpload(fileID);
            return false;
        };
    }
};

/**
 * 创建上传实例
 * @param {String} url 上传接口
 * @param {any} params 上传参数
 * @param {String} file_type 上传文件类型
 * @param {any} config 自定义配置
 */
function swfinit(url, params, file_type, config) {

    if (!config) {
        config = {};
    }
    if (!config.custom_settings) {
        config.custom_settings = { upload_target: "divFileProgressContainer" };
    }

    return new SWFUpload({
        upload_url: url,
        post_params: params,
        file_size_limit: "3 GB",
        use_query_string: false,
        file_types: file_type,
        file_types_description: "文件类型",
        file_upload_limit: 0,
        swfupload_preload_handler: preLoad,
        swfupload_load_failed_handler: loadFailed,
        file_queued_handler: config.file_queued_handler || fileQueued,
        file_queue_error_handler: fileQueueError,
        file_dialog_complete_handler: fileDialogComplete,
        upload_progress_handler: uploadProgress,
        upload_error_handler: uploadError,
        upload_success_handler: uploadSuccess,
        upload_complete_handler: uploadComplete,
        file_dialog_start_handler: fileDialogStart,
        upload_start_handler: uploadStart,
        button_image_url: "../Themes/default/images/SwfButtonNoText_40x22.png",
        button_placeholder_id: "spanButtonPlaceholder",
        button_width: 40,
        button_height: 22,
        button_text: '<span class="button"></span></span>',
        button_text_style: '.button { font-family: Helvetica, Arial, sans-serif; font-size: 14pt; } .buttonSmall { font-size: 10pt; }',
        button_text_top_padding: 1,
        button_text_left_padding: 5,
        flash_url: "../Themes/default/images/swfupload.swf",
        flash9_url: "../Themes/default/images/swfupload_fp9.swf",
        custom_settings: config.custom_settings,
        debug: false
    });
}

//附件的上传（学生上传论文）
function swfinitAttachment(url, params, file_type) {
    return new SWFUpload({
        upload_url: url,
        post_params: params,
        file_size_limit: "3 GB",
        use_query_string: false,
        file_types: file_type,
        file_types_description: "文件类型",
        file_upload_limit: 0,
        swfupload_preload_handler: preLoad,
        swfupload_load_failed_handler: loadFailed,
        file_queued_handler: fileQueued_Attachment,
        file_queue_error_handler: fileQueueError,
        file_dialog_complete_handler: fileDialogComplete,
        upload_progress_handler: uploadProgress,
        upload_error_handler: uploadError,
        upload_success_handler: uploadSuccess,
        upload_complete_handler: uploadComplete,
        file_dialog_start_handler: fileDialogStart,
        upload_start_handler: uploadStart,
        button_image_url: "../Themes/default/images/SwfButtonNoText_40x22.png",
        button_placeholder_id: "spanAttachmentButtonPlaceholder",
        button_width: 40,
        button_height: 22,
        button_text: '<span class="button"></span></span>',
        button_text_style: '.button { font-family: Helvetica, Arial, sans-serif; font-size: 14pt; } .buttonSmall { font-size: 10pt; }',
        button_text_top_padding: 1,
        button_text_left_padding: 5,
        flash_url: "../Themes/default/images/swfupload.swf",
        flash9_url: "../Themes/default/images/swfupload_fp9.swf",
        custom_settings: {
            upload_target: "divAttachmentFileProgressContainer"
        },
        debug: false
    });
}
