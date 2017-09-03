/*!  
 * ================
 * 周月年日期选择插件
 * @Author  Yugl   
 */ 
function DateRangeCus($el) {
    var $el = $el;
    var _dateRangeCus = {
        $el: $el,
        _year: null,
        _month: null,
        _day: null,
        _stateArry: ['week', 'month', 'year'],
        _currentState: 'week',
        _init: function() {
            var me = this;
            var _html = '<span role="prev" class="icon-operate">&lt;</span><span role="date" class="text-date"></span><span role="next" class="icon-operate">&gt;</span>';
            me.$el.html(_html);
            me._bindEvent();
        },
        _bindEvent: function() {
            var me = this;
            var _$el = me.$el;
            var $prev = _$el.find('[role="prev"]');
            var $next = _$el.find('[role="next"]');

            $prev.unbind('click').bind('click', function() { 
                me.clickPrev();
            });

            $next.unbind('click').bind('click', function() { 
                me.clickNext();
            });
        },
        /** 切换上一周或者上一月或者上一年 
         */
        clickPrev: function() {
            var me = this;
            var year = parseInt( me.getYear() );
            var month = parseInt( me.getMonth() );
            var day = parseInt( me.getDay() );
 
            switch (me.getDateState()) {

                case me._stateArry[0]: //周

                    var today = new Date(year, month - 1, day);
                    var prev = new Date(today.valueOf() - 7 * 24 * 60 * 60 * 1000);

                    me.setYear(me.getYearFromDate(prev));
                    me.setMonth(me.getMonthFromDate(prev));
                    me.setDay(me.getDayFromDate(prev));

                    break;
                case me._stateArry[1]: //月

                    var _month = month - 1;
                    
                    if (month == 1) {
                        _month = 12;
                        me.setYear(parseInt(year) - 1);
                    };
                    me.setMonth(_month);
                    break;
                case me._stateArry[2]: //年
                    me.setYear(parseInt(year) - 1);
                    break;
            }; 
            me.setDate(me.getYear(), me.getMonth(), me.getDay());
            me.onClickPrev();
        },
        onClickPrev: function(){

        },
        clickNext: function() {
            var me = this;
            var year = parseInt( me.getYear() );
            var month = parseInt( me.getMonth() );
            var day = parseInt( me.getDay() );


            switch (me.getDateState()) {

                case me._stateArry[0]: //周

                    var today = new Date(year, month - 1, day);
                    var prev = new Date(today.valueOf() + 7 * 24 * 60 * 60 * 1000);

                    me.setYear(me.getYearFromDate(prev));
                    me.setMonth(me.getMonthFromDate(prev));
                    me.setDay(me.getDayFromDate(prev));

                    break;
                case me._stateArry[1]: //月

                    var _month = month + 1;

                    if (month == 12) {
                        _month = 1;
                        me.setYear(parseInt(year) + 1);
                    };
                    me.setMonth(_month);
                    break;
                case me._stateArry[2]: //年
                    me.setYear(parseInt(year) + 1);
                    break;
            };
            me.setDate(me.getYear(), me.getMonth(), me.getDay());
            me.onClickNext();
        },
        onClickNext: function(){

        },
        /** 设置年月日格式的日期
         * @param year | month | day 年|月|日
         */
        setDate: function(year, month, day) {
            var me = this;
            var $date = me.$el.find('[role="date"]');

            me.setYear(year);
            me.setMonth(month);
            me.setDay(day);


            switch (me.getDateState()) {
                case me._stateArry[0]: //周 
                    $date.html(me.getThisWeek());
                    break;
                case me._stateArry[1]: //月 
                    $date.html(me.getThisMonth());
                    break;
                case me._stateArry[2]: //年 
                    $date.html(me.getThisYear());
                    break;
            };
        },
        getThisMonth: function() {
            var me = this;
            var _month = (me.getMonth().toString().length == 1 ? "0" + me.getMonth() : me.getMonth());
            return me.getYear() + "." + _month;
        },
        getThisYear: function() {
            var me = this;
            return me.getYear();
        },
        /** 获取当前周的时间区间
         * @param year | month | day 需要设置的年 | 月 | 日
         * @return 返回日期区间 
         */
        getThisWeek: function() {
            var me = this;
            var year = me.getYear();
            var month = me.getMonth();
            var day = me.getDay();
            var today = new Date(year, month - 1, day);
            var week = today.getDay();

            /*if (week == 0) { //周一到周日
                week = 7;
            };*/

            //周一到周日的计算方法
            var monday = new Date(today.valueOf() - (week - 1) * 24 * 60 * 60 * 1000);
            var sunday = new Date(monday.valueOf() + 6 * 24 * 60 * 60 * 1000);

            //周日到周六的计算方法
            var sunday_n = new Date(monday.valueOf() - 1 * 24 * 60 * 60 * 1000);
            var saturday_n = new Date(sunday.valueOf() - 1 * 24 * 60 * 60 * 1000);



            return me.getDateRange(sunday_n, saturday_n);
        },
        /** 设置周时间区间格式
         * @param sdate |  edate 需要设置的起始时间 | 截止时间
         * @return 返回日期区间 
         */
        getDateRange: function(sdate, edate) {
            var me = this;
            var _sdate = sdate;
            var _edate = edate;

            return me.getYearFromDate(sdate) + "." + me.getMonthFromDate(sdate) + "." + me.getDayFromDate(sdate) + " — " + me.getYearFromDate(edate) + "." + me.getMonthFromDate(edate) + "." + me.getDayFromDate(edate);
        },
        getYearFromDate: function(date) {
            return date.getFullYear();
        },
        getMonthFromDate: function(date) {
            var sdate = date;
            var _month = ((sdate.getMonth() + 1).toString().length == 1 ? ("0" + (sdate.getMonth() + 1)) : (sdate.getMonth() + 1));
            return _month;
        },
        getDayFromDate: function(date) {
            var sdate = date;
            var _day = (sdate.getDate().toString().length == 1 ? "0" + sdate.getDate() : sdate.getDate());
            return _day;
        },
        getPreviousWeek: function() {
            var me = this;
            var year = me.getYear();
            var month = me.getMonth();
            var day = me.getDay();
            var today = new Date(year, month - 1, day);
            var week = today.getDay();

            /*if (week == 0) {  //周一到周日
                week = 7;
            };*/

            var monday = new Date(today.valueOf() - (week + 6) * 24 * 60 * 60 * 1000);
            var sunday = new Date(monday.valueOf() + 6 * 24 * 60 * 60 * 1000);

            //周日到周六的计算方法
            var sunday_n = new Date(monday.valueOf() - 1 * 24 * 60 * 60 * 1000);
            var saturday_n = new Date(sunday.valueOf() - 1 * 24 * 60 * 60 * 1000);

            return me.getDateRange(sunday_n, saturday_n);
        },
        getNextWeek: function() {
            var me = this;
            var year = me.getYear();
            var month = me.getMonth();
            var day = me.getDay();
            var today = new Date(year, month - 1, day);
            var week = today.getDay();

            /*if (week == 0) {
                week = 7;
            };*/

            var monday = new Date(today.valueOf() - (week - 8) * 24 * 60 * 60 * 1000);
            var sunday = new Date(monday.valueOf() + 6 * 24 * 60 * 60 * 1000);

            //周日到周六的计算方法
            var sunday_n = new Date(monday.valueOf() - 1 * 24 * 60 * 60 * 1000);
            var saturday_n = new Date(sunday.valueOf() - 1 * 24 * 60 * 60 * 1000);

            return me.getDateRange(sunday_n, saturday_n);
        },
        setYear: function(y) {
            this._year = y;
        },
        setMonth: function(m) {
            this._month = m;
        },
        setDay: function(d) {
            this._day = d;
        },
        setDateState: function(state) {
            var me = this;
            me._currentState = state; 
            me.setDate(me.getYear(), me.getMonth(), me.getDay());
        },
        getYear: function() {
            return this._year;
        },
        getMonth: function() {
            return this._month;
        },
        getDay: function() {
            return this._day;
        },
        getDateState: function() {
            return this._currentState;
        }
    };
    _dateRangeCus._init();
    return _dateRangeCus;
};
