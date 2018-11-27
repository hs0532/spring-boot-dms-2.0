var CNKIPager;
if (CNKIPager == undefined) {
    CNKIPager = function (pagerid, pageSize) {
        var settings = {};
        //settings.pagerInstaceName = pagerInstaceName; //函数的实例名称
        settings.pagerid = pagerid; //分页容器的ID
        settings.pageIndex = 1; //当前页码
        if (this.checkCNKIPagerParameterDefaltValIsUndefinedOrEmptyOrNull(pageSize)) {
            pageSize = isNaN(parseInt(pageSize, 10)) ? 10 : parseInt(pageSize, 10);
        }
        settings.pageSize = pageSize; //每页显示的数目
        settings.totalRecords = 0; //总数据条数
        settings.total = (settings.totalRecords + settings.pageSize - 1) / settings.pageSize; //总页码
        settings.dataParams = null;
        settings.mode = "click"; //or link
        settings.isShowFirstPageBtn = true; //是否显示首页按钮
        settings.isShowLastPageBtn = true; //是否显示尾页按钮
        settings.isShowPrePageBtn = true; //是否显示上一页按钮
        settings.isShowNextPageBtn = true; //是否显示下一页按钮
        settings.isShowTotalPage = true; //是否显示总页数
        settings.isShowTotalRecords = true; //是否显示总记录数
        settings.isShowGoPage = false; //是否显示页码跳转输入框
        settings.hrefFormer = ""; //链接前部
        settings.hrefLatter = ""; //链接尾部
        settings.gopageWrapId = settings.pagerid + "_cnkipager_gopage_wrap";
        settings.gopageButtonId = settings.pagerid + "_cnkipager_btn_go";
        settings.gopageTextboxId = settings.pagerid + "_cnkipager_btn_go_input";
        settings.lang = {
            firstPageText: '首页',
            firstPageTipText: '首页',
            lastPageText: '尾页',
            lastPageTipText: '尾页',
            prePageText: '上一页',
            prePageTipText: '上一页',
            nextPageText: '下一页',
            nextPageTipText: '下一页',
            totalPageBeforeText: '共',
            totalPageAfterText: '页',
            totalRecordsAfterText: '条数据',
            gopageBeforeText: '转到',
            gopageButtonOkText: '确定',
            gopageAfterText: '页',
            buttonTipBeforeText: '第',
            buttonTipAfterText: '页'
        }
        //页码单击事件处理函数（当处于mode模式）,参数n为页码
        /*页码单击事件处理函数,参数n为页码
        使用方法为topPager.click=function(n){}
        一般情况click方法会和selectPage两者结合使用
        完整的使用如下：
        topPager.click = function(n) {
        topPager.selectPage(n);
        }*/

        this.click = function (n) {
            //这里自己实现
            //这里可以用this或者cnkipager访问cnkipager对象
            return false;
        }
        this.initCNKIPager(settings);
    }
};
//分页按钮控件初始化
CNKIPager.prototype.initCNKIPager = function (config) {
    // this.pagerInstaceName = config.pagerInstaceName;
    this.pageIndex = isNaN(config.pageIndex) ? 1 : parseInt(config.pageIndex, 10);
    this.pageSize = config.pageSize;
    this.totalRecords = isNaN(config.totalRecords) ? 0 : parseInt(config.totalRecords, 10);
    this.total = config.total = parseInt((parseInt(config.totalRecords, 10) + parseInt(config.pageSize, 10) - 1) / parseInt(config.pageSize, 10), 10);
    this.pagerid = config.pagerid;
    //if (config.pagerid) { this.pagerid = config.pagerid; }
    if (config.mode) { this.mode = config.mode; }
    this.dataParams = config.dataParams;
    if (config.gopageWrapId) { this.gopageWrapId = config.gopageWrapId; }
    if (config.gopageButtonId) { this.gopageButtonId = config.gopageButtonId; }
    if (config.gopageTextboxId) { this.gopageTextboxId = config.gopageTextboxId; }
    if (config.isShowFirstPageBtn != undefined) { this.isShowFirstPageBtn = config.isShowFirstPageBtn; }
    if (config.isShowLastPageBtn != undefined) { this.isShowLastPageBtn = config.isShowLastPageBtn; }
    if (config.isShowPrePageBtn != undefined) { this.isShowPrePageBtn = config.isShowPrePageBtn; }
    if (config.isShowNextPageBtn != undefined) { this.isShowNextPageBtn = config.isShowNextPageBtn; }
    if (config.isShowTotalPage != undefined) { this.isShowTotalPage = config.isShowTotalPage; }
    if (config.isShowTotalRecords != undefined) { this.isShowTotalRecords = config.isShowTotalRecords; }
    if (config.isShowGoPage != undefined) { this.isShowGoPage = config.isShowGoPage; }
    if (config.lang) {
        this.lang = config.lang;
    }
    this.hrefFormer = config.hrefFormer || "";
    this.hrefLatter = config.hrefLatter || "";
    if (config.getLink && typeof (config.getLink) == 'function') { this.getLink = config.getLink; }
    if (config.click && typeof (config.click) == 'function') { this.click = config.click; }
    if (config.getHref && typeof (config.getHref) == 'function') { this.getHref = config.getHref; }
    if (!this._config) {
        this._config = config;
    }
    //validate
    if (this.pageIndex < 1) this.pageIndex = 1;
    this.total = (this.total <= 1) ? 1 : this.total;
    if (this.pageIndex > this.total) this.pageIndex = this.total;
    this.prv = (this.pageIndex <= 2) ? 1 : (this.pageIndex - 1);
    this.next = (this.pageIndex >= this.total - 1) ? this.total : (this.pageIndex + 1);
    this.hasPrv = (this.pageIndex > 1);
    this.hasNext = (this.pageIndex < this.total);
    this.inited = false;
};
CNKIPager.prototype.checkCNKIPagerParameterDefaltValIsUndefinedOrEmptyOrNull = function (paramVal) {
    if (typeof (paramVal) == "undefined" || paramVal == "undefined") {
        return true;
    }
    if (paramVal == null || paramVal.length == 0)
        return true;
    return false;
};
//链接算法（当处于link模式）,参数n为页码
CNKIPager.prototype.getLink = function (n) {
    //这里的算法适用于比如：
    //hrefFormer=http://www.xx.com/news/20131212
    //hrefLatter=.html
    //那么首页（第1页）就是http://www.xx.com/news/20131212.html
    //第2页就是http://www.xx.com/news/20131212_2.html
    //第n页就是http://www.xx.com/news/20131212_n.html
    if (n == 1) {
        return this.hrefFormer + this.hrefLatter;
    }
    return this.hrefFormer + this.hrefLatter;
    //return this.hrefFormer + '_' + n + this.hrefLatter;
};
//获取href的值（当处于mode模式）,参数n为页码
CNKIPager.prototype.getHref = function (n) {
    //默认返回'#'
    return '#';
};
//不刷新页面直接手动调用选中某一页码
CNKIPager.prototype.selectPage = function (n) {
    this.pageIndex = n;
    this._config = this;
    this.generPageHtml(this._config, true);
};
//获取当前的页码
CNKIPager.prototype.getPageIndex = function () {
    return this.pageIndex;
};
/*
*获取总的记录数
*/
CNKIPager.prototype.getTotalRecords = function () {
    return this.totalRecords;
};
/*
*获取当前的页码
*为了确保更好的命名规范,此方法不再使用,请使用getPageIndex方法
*/
CNKIPager.prototype.currentPageIndex = function () {
    return this.pageIndex;
};
//获取每页显示的行数,
//如果需要每页显示的行数,直接调用这个方法即可。
//这样设计是为了以后如果修改了每页显示的行数,不必修改多个地方
CNKIPager.prototype.getPageSize = function () {
    return this.pageSize;
};
/*
*获取每页显示的行数,
*如果需要每页显示的行数,直接调用这个方法即可。
*这样设计是为了以后如果修改了每页显示的行数,不必修改多个地方
*为了确保更好的命名规范,此方法不再使用,请使用getPageSize方法
*/
CNKIPager.prototype.currentPageSize = function () {
    return this.pageSize;
};
//生成分页控件
CNKIPager.prototype.generPagerControl = function (config) {
    if (this.checkCNKIPagerParameterDefaltValIsUndefinedOrEmptyOrNull(config)) {
        config = this._config;
    }
    var total = this.getTotalRecords();
    var pn = this.getPageIndex();
    var ps = this.getPageSize();
    var lastPn = total / ps;
    if (lastPn == 0 || isNaN(lastPn)) {
        lastPn = 1;
    }
    lastPn = Math.ceil(lastPn);
    if (pn > lastPn) {
        config.isInitData = config.isInitData == null ? true : config.isInitData;
        if (config.isInitData) {
            this.click(lastPn);
        }
        return false;
    }
    
    this.generPageHtml(config, true);
};
//生成控件代码
CNKIPager.prototype.generPageHtml = function (config, enforceInit) {
    if (enforceInit || !this.inited) {
        this.initCNKIPager(config);
    }
    var str_first = '', str_prv = '', str_next = '', str_last = '';
    if (this.isShowFirstPageBtn) {
        if (this.hasPrv) {
            str_first = '<a ' + this.getHandlerStr(1) + ' title="'
						+ (this.lang.firstPageTipText || this.lang.firstPageText) + '">' + this.lang.firstPageText + '</a>';
        } else {
            str_first = '<span class="disabled">' + this.lang.firstPageText + '</span>';
        }
    }
    if (this.isShowPrePageBtn) {
        if (this.hasPrv) {
            str_prv = '<a ' + this.getHandlerStr(this.prv) + ' title="'
						+ (this.lang.prePageTipText || this.lang.prePageText) + '">' + this.lang.prePageText + '</a>';
        } else {
            str_prv = '<span class="disabled">' + this.lang.prePageText + '</span>';
        }
    }
    if (this.isShowNextPageBtn) {
        if (this.hasNext) {
            str_next = '<a ' + this.getHandlerStr(this.next) + ' title="'
						+ (this.lang.nextPageTipText || this.lang.nextPageText) + '">' + this.lang.nextPageText + '</a>';
        } else {
            str_next = '<span class="disabled">' + this.lang.nextPageText + '</span>';
        }
    }
    if (this.isShowLastPageBtn) {
        if (this.hasNext) {
            str_last = '<a ' + this.getHandlerStr(this.total) + ' title="'
						+ (this.lang.lastPageTipText || this.lang.lastPageText) + '">' + this.lang.lastPageText + '</a>';
        } else {
            str_last = '<span class="disabled">' + this.lang.lastPageText + '</span>';
        }
    }
    var str = '';
    var dot = '<span>...</span>';
    var total_info = '';
    if (this.isShowTotalPage || this.isShowTotalRecords) {
        total_info = '&nbsp;<span class="normalsize">' + this.lang.totalPageBeforeText;
        if (this.isShowTotalPage) {
            total_info += this.total + this.lang.totalPageAfterText;
            if (this.isShowTotalRecords) {
                total_info += '/';
            }
        }
        if (this.isShowTotalRecords) {
            total_info += this.totalRecords + this.lang.totalRecordsAfterText;
        }

        total_info += '</span>';
    }
    var gopage_info = '';
    if (this.isShowGoPage) {
        gopage_info = '&nbsp;' + this.lang.gopageBeforeText + '<span class="cnkipager_gopage_wrap" id="' + this.gopageWrapId + '">' +
					'<input type="button" class="cnkipager_btn_go"  id="' + this.gopageButtonId + '" value="'
						+ this.lang.gopageButtonOkText + '" />' +
					'<input type="text"  class="cnkipager_btn_go_input"  id="' + this.gopageTextboxId + '" value="' + this.next + '" /></span>' + this.lang.gopageAfterText;
    }
    //分页处理
    if (this.total <= 8) {
        for (var i = 1; i <= this.total; i++) {
            if (this.pageIndex == i) {
                str += '<span class="curr">' + i + '</span>';
            } else {
                str += '<a ' + this.getHandlerStr(i) + ' title="'
							+ this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText + '">' + i + '</a>';
            }
        }
    } else {
        if (this.pageIndex <= 5) {
            for (var i = 1; i <= 7; i++) {
                if (this.pageIndex == i) {
                    str += '<span class="curr">' + i + '</span>';
                } else {
                    str += '<a ' + this.getHandlerStr(i) + ' title="' +
								this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText + '">' + i + '</a>';
                }
            }
            str += dot;
        } else {
            str += '<a ' + this.getHandlerStr(1) + ' title="'
						+ this.lang.buttonTipBeforeText + '1' + this.lang.buttonTipAfterText + '">1</a>';
            str += '<a ' + this.getHandlerStr(2) + ' title="'
						+ this.lang.buttonTipBeforeText + '2' + this.lang.buttonTipAfterText + '">2</a>';
            str += dot;

            var begin = this.pageIndex - 2;
            var end = this.pageIndex + 2;
            if (end > this.total) {
                end = this.total;
                begin = end - 4;
                if (this.pageIndex - begin < 2) {
                    begin = begin - 1;
                }
            } else if (end + 1 == this.total) {
                end = this.total;
            }
            for (var i = begin; i <= end; i++) {
                if (this.pageIndex == i) {
                    str += '<span class="curr">' + i + '</span>';
                } else {
                    str += '<a ' + this.getHandlerStr(i) + ' title="'
								+ this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText + '">' + i + '</a>';
                }
            }
            if (end != this.total) {
                str += dot;
            }
        }
    }
    str = "&nbsp;" + str_first + str_prv + str + str_next + str_last + total_info + gopage_info;
    var pagerContainer = document.getElementById(this.pagerid);
    if (pagerContainer != undefined) {
        pagerContainer.innerHTML = str;
    }
    this.registerEventHandler();
};
CNKIPager.prototype.registerEventHandler = function () {
    var _this = this;
    if (this.isShowGoPage) {
        $('#' + this.gopageButtonId).click(function () {
            _this.gopage();
        });
        $('#' + this.gopageTextboxId).focus(function () {
            _this.focus_gopage();
        });
        $('#' + this.gopageTextboxId).keypress(function () {
            _this.keypress_gopage(event);
        });
        $('#' + this.gopageTextboxId).blur(function () {
            _this.blur_gopage();
        });
    }
    var n = 1;
    var pageText = "";
    $('#' + this.pagerid + ' a ').click(function () {
        pageText = $(this).text();
        if (pageText == _this.lang.firstPageText) {//首页处理
            n = 1;
        }
        else if (pageText == _this.lang.prePageText) {//上一页处理
            n = _this.prv;
        }
        else if (pageText == _this.lang.nextPageText) {//下一页处理
            n = _this.next;
        }
        else if (pageText == _this.lang.lastPageText) { //尾页处理
            n = _this.total;
        }
        else {
            n = parseInt(pageText, 10);
        }
        _this.clickHandler(n);
    });
};
//跳转框得到输入焦点时
CNKIPager.prototype.focus_gopage = function () {
    var btnGo = $('#' + this.gopageButtonId);
    $('#' + this.gopageTextboxId).attr('hideFocus', true);
    btnGo.show();
    btnGo.css('left', '0px');
    $('#' + this.gopageWrapId).css('border-color', '#6694E3');
    btnGo.animate({ left: '+=44' }, 50, function () {
        //$('#'+this.gopageWrapId).css('width','88px');
    });
};
//跳转框失去输入焦点时
CNKIPager.prototype.blur_gopage = function () {
    var _this = this;
    setTimeout(function () {
        var btnGo = $('#' + _this.gopageButtonId);
        btnGo.animate({
            left: '-=44'
        }, 100, function () {
            btnGo.css('left', '0px');
            btnGo.hide();
            $('#' + _this.gopageWrapId).css('border-color', '#DFDFDF');
        });
    }, 400);
};
//跳转输入框按键操作
CNKIPager.prototype.keypress_gopage = function () {
    var event = arguments[0] || window.event;
    var code = event.keyCode || event.charCode;
    //delete key
    if (code == 8) return true;
    //enter key
    if (code == 13) {
        this.gopage();
        return false;
    }
    //copy and paste
    if (event.ctrlKey && (code == 99 || code == 118)) return true;
    //only number key
    if (code < 48 || code > 57) return false;
    return true;
};
//跳转框页面跳转
CNKIPager.prototype.gopage = function () {
    var str_page = $('#' + this.gopageTextboxId).val();
    if (isNaN(str_page)) {
        $('#' + this.gopageTextboxId).val(this.next);
        return;
    }
    var n = parseInt(str_page, 10);
    if (n < 1) n = 1;
    if (n > this.total) n = this.total;
    if (this.mode == 'click') {
        this.clickHandler(n);
    } else {
        window.location = this.getLink(n);
    }
};
CNKIPager.prototype.getHandlerStr = function (n) {
    if (this.mode == 'click') {
        return 'href="' + this.getHref(n) + '"';
        //return 'href="' + this.getHref(n) + '" onclick="return ' + this.pagerInstaceName + '.clickHandler (' + n + ')"';
    }
    //link模式，也是默认的
    return 'href="' + this.getLink(n) + '"';
};
CNKIPager.prototype.clickHandler = function (n) {
    var res = false;
    if (this.click && typeof this.click == 'function') {
        res = this.click.call(this, n) || false;
    }
    return res;
};