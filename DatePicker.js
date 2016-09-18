/**
 * 微贷网 日历组件 base
 */

function DatePicker(selector, data, func) {
    this.$container = document.getElementById(selector);
    this.beginDayInWeek = 0; //0-6起始天，0为周日

    this.activeDom = '';
    this.prevDom = '';
    this.nextDom = '';

    this.speed = 500; //移动速度 ms
    this.timer = null; //定时器

    this.curDate = {}; //今天所在月份
    this.slideDate = {}; //显示层所在月份,用来切换的日期

    this.monthStyle = '';//特殊样式

    this.func = func;//切换日期触发函数
    this.renderdata = [];//当月数据

    this.canChange = true;

    this.init(data);
}

DatePicker.prototype = {
    //初始化
    init: function(data) {
        var d = new Date()

        this.curDate.day = d.getDate();
        this.curDate.month = d.getMonth() + 1;
        this.curDate.year = d.getFullYear();

        this.slideDate.month = d.getMonth() + 1;
        this.slideDate.year = d.getFullYear();

        this.datepicker = document.createElement('div');
        this.datepicker.className = 'weidai-datepicker';
        this.datepicker.style.width = '100%';
        this.datepicker.style.height = '100%';
        this.datepicker.style.position = 'relative';
        this.datepicker.style.overflow = 'hidden';

        this.render(this.curDate.year, this.curDate.month, data);
    },

    //生成日历数组
    creatDayArray: function(year, month) {
        //日历数组
        var dayArr = [];

        var d = new Date(year, month - 1, 1);
        var weekindex = d.getDay();

        var lenspace = weekindex - this.beginDayInWeek;
        var lenday = this.getDaysByYM(year, month);

        if (lenday + lenspace > 35) {
            this.monthStyle = 'specialMonth';
        } else {
            this.monthStyle = '';
        }

        //填充数组空位
        for (var i = 0; i < lenspace; i++) {
            dayArr.push('');
        }

        //填充数组日期
        for (var i = 0; i < lenday; i++) {
            dayArr.push(i + 1);
        }

        console.log(dayArr)
        return dayArr;
    },

    //创建 月 View
    creatViewMonth: function(year, month, data) {
        var datepickerMonth = document.createElement('div');
        datepickerMonth.className = 'weidai-datepicker-month';
        datepickerMonth.style.width = '100%';
        datepickerMonth.style.height = '100%';
        datepickerMonth.style.position = 'absolute';

        var dayArr = this.creatDayArray(year, month);
        var week = '<div class="weidai-datepicker-week">' +
            '<span>日</span>' +
            '<span>一</span>' +
            '<span>二</span>' +
            '<span>三</span>' +
            '<span>四</span>' +
            '<span>五</span>' +
            '<span>六</span>' +
            '</div>';
        var dayBox = '<div class="weidai-datepicker-day">';

        this.renderdata = data ? data.slice(0) : [];
        var dataLen = this.renderdata.length;

        var len = dayArr.length;
        for (var i = 0; i < len; i++) {
            if (dayArr[i]) {

                //是否有数据
                var ifhasDate = '';

                //数据索引
                var dataIndex = 'data-index=';

                if (dataLen > 0) {
                    for (var j = 0; j < dataLen; j++) {
                        if (this.renderdata[j].day == dayArr[i]) {
                            ifhasDate = 'hasdata';
                            dataIndex += '"'+j+'"';
                            break;
                        }
                    }
                }

                //是否是今天
                var iftoday = dayArr[i] == this.curDate.day && this.curDate.year == year && this.curDate.month == month;
                var todayClass = iftoday ? 'today' : '';
                var daystr = iftoday ? '今' : dayArr[i];

                //class
                var spanClass = this.monthStyle;

                if (todayClass) {
                    spanClass += (' ' + todayClass);
                }

                if (ifhasDate) {
                    spanClass += (' ' + ifhasDate);
                }

                dayBox += '<span class="' + this.monthStyle + '" data-class="' + spanClass + '"'+dataIndex+'><i></i><a>' + daystr + '</a></span>';
            } else {
                dayBox += '<span class="' + this.monthStyle + '"></span>';
            }
        }
        dayBox += '</div>';

        datepickerMonth.innerHTML = week + dayBox;

        return datepickerMonth;
    },

    //生成日历View
    render: function(year, month, data) {
        var _this = this;

        _this.canChange = true;

        _this.activeDom = _this.creatViewMonth(year, month, data);
        _this.activeDom.style.left = '0';

        _this.prevDom = _this.creatPrevMonth();
        _this.prevDom.style.left = '-100%';

        _this.nextDom = _this.creatNextMonth();
        _this.nextDom.style.left = '100%';

        _this.datepicker.innerHTML = '';
        _this.datepicker.appendChild(_this.activeDom);
        _this.datepicker.appendChild(_this.prevDom);
        _this.datepicker.appendChild(_this.nextDom);

        _this.$container.appendChild(_this.datepicker);

        clearTimeout(_this.timer);

        _this.timer = setTimeout(function() {
            _this.showDayState();
        }, 500)

    },

    //显示day状态
    showDayState: function() {
        del_ff(this.activeDom);
        var daydivArr = this.activeDom.childNodes;
        var daydiv = daydivArr[1];
        del_ff(daydiv);

        var dayspan = daydiv.childNodes;
        var len = dayspan.length;
        for (var i = 0; i < len; i++) {
            var newclass = dayspan[i].getAttribute('data-class');
            if (newclass) {
                dayspan[i].className = newclass;
            }

        }

        function del_ff(elem) {
            var elem_child = elem.childNodes;
            for (var i = 0; i < elem_child.length; i++) {
                if (elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue)) {
                    elem.removeChild(elem_child)
                }
            }
        }
    },

    //根据年月获取该月天数, month为正常月
    getDaysByYM: function(year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
    },

    //去某年某月View
    toNewYearAndMonth: function(year, month) {
        this.slideDate.month = month;
        this.slideDate.year = year;

        //锁住切换
        this.canChange = false;

        //更新数据
        this.func(this.slideDate.year, this.slideDate.month, this.render);
    },

    //前一月View
    creatPrevMonth: function() {
        var prevYear = this.slideDate.year;
        var prevMonth = this.slideDate.month - 1;
        var prevMonthDom = this.creatViewMonth(prevYear, prevMonth);

        return prevMonthDom;
    },

    //后一月View
    creatNextMonth: function() {
        var nextYear = this.slideDate.year;
        var nextMonth = this.slideDate.month + 1;
        var nextMonthDom = this.creatViewMonth(nextYear, nextMonth);

        return nextMonthDom;
    },

    //去前一月
    toPrevMonth: function() {
        var _this = this;

        if(!_this.canChange){
            return;
        }

        //锁住切换
        this.canChange = false;

        clearTimeout(_this.timer);

        this.slideDate.month--;
        if (this.slideDate.month == 0) {
            this.slideDate.month = 12;
            this.slideDate.year--;
        }

        this.prevDom.style.transition = 'left ' + (this.speed / 1000) + 's ease 0s';
        this.prevDom.style.left = '0';

        this.activeDom.style.transition = 'left ' + (this.speed / 1000) + 's ease 0s';
        this.activeDom.style.left = '100%';

        this.timer = setTimeout(function() {

            _this.datepicker.removeChild(_this.nextDom);

            //重新设置 当月，下月
            var dom = _this.activeDom;
            _this.activeDom = _this.prevDom;
            _this.nextDom = dom;

            //重新设置 上月
            _this.prevDom = _this.creatPrevMonth();
            _this.prevDom.style.left = '-100%';
            _this.datepicker.appendChild(_this.prevDom);

            //更新数据
            _this.func(_this.slideDate.year, _this.slideDate.month, _this.render);

        }, _this.speed);
    },

    //去下一月
    toNextMonth: function() {
        var _this = this;

        if(!_this.canChange){
            return;
        }

        //锁住切换
        this.canChange = false;

        clearTimeout(_this.timer);

        this.slideDate.month++;
        if (this.slideDate.month == 13) {
            this.slideDate.month = 1;
            this.slideDate.year++;
        }

        this.nextDom.style.transition = 'left ' + (this.speed / 1000) + 's ease 0s';
        this.nextDom.style.left = '0';

        this.activeDom.style.transition = 'left ' + (this.speed / 1000) + 's ease 0s';
        this.activeDom.style.left = '-100%';

        this.timer = setTimeout(function() {

            _this.datepicker.removeChild(_this.prevDom);

            //重新设置 上月，当月
            var dom = _this.activeDom;
            _this.activeDom = _this.nextDom;
            _this.prevDom = dom;

            //重新设置 下月
            _this.nextDom = _this.creatNextMonth();
            _this.nextDom.style.left = '100%';
            _this.datepicker.appendChild(_this.nextDom);

            //更新数据
            _this.func(_this.slideDate.year, _this.slideDate.month, _this.render);

        }, _this.speed);
    }
};
