// 添加ajax全局事件处理。
(function () {
    $(document).ajaxStart(function (e) {
        //alert("start");
    }).ajaxSend(function (e, xhr, opts) {
        //alert("send");
        
        //Token令牌
        try {
            var authToken = getAuthToken();
            if (!checkValIsUndefinedOrNull(authToken)) {
                if (!checkValIsUndefinedOrNull(opts.data)) {
                    var postDataStr = opts.data || "";
                    if (checkValIsUndefinedOrNull(postDataStr)) {
                        postDataStr = "authToken=" + authToken;
                    } else {
                        postDataStr += "&authToken=" + authToken;
                    }
                    opts.data = postDataStr;
                } else {
                    if (!checkValIsUndefinedOrNull(opts.url)) {
                        var urlTemp = opts.url || "";
                        if (urlTemp.indexOf("?") >= 0) {
                            urlTemp += "&";
                        } else {
                            urlTemp += "?";
                        }
                        urlTemp += "authToken=" + authToken;
                        opts.url = urlTemp;
                    }
                }
            }
        } catch (ex) {
            if (console && console.log) {
                console.log(ex);
            }
        }
    }).ajaxError(function (e, xhr, opts) {
        //alert("error");
    }).ajaxSuccess(function (e, xhr, opts) {
        //alert("success");
    }).ajaxComplete(function (e, xhr, opts) {
        //alert("complete");
        if (xhr.responseJSON) {
            var retData = xhr.responseJSON;
            if (!retData.isSuccess) {
                //999没有登录、998没有毕设资格、997重复登录跳转、984用户信息被修改，唯一标识清空
                if (retData.errorCode == 999 || retData.errorCode == 998 || retData.errorCode == 997 || retData.errorCode == 984) {                 
                    if (self.frameElement && self.frameElement.tagName == "IFRAME") {                    
                        window.parent.location.href = "../Login.html";
                    } else {
                    
                        window.location.href = "Login.html";
                    }
                    alert(retData.message);
                }
            }
        }
    }).ajaxStop(function (e) {
        //alert("stop");
    });
})();