/*!  
 * ================
 * datatable插件二次封装
 * @Author  Yugl   
 */
function InitDataTable(opts, callinitdatatable) {
    var detaults = {
        $el: '', //表格dom
        url: '', //表格数据地址
        tableOpts: '', //表格岑姝配置项
        checkbox: false
    };

    var _opts = $.extend({}, detaults, opts);
    var _initDataTable = {
        _dataTable: null,
        _orderable: false,
        _aaSorting: [], //初始化时候的列排序规则 
        ajaxdata: {},
        _paramdata: {},
        _orderData: [], //排序数据
        _init: function(options) {
            var me = this;
            $.extend(me, options);
            
            me.$el.wrap('<div class="table-cus-box"></div>');
            me.$el.html('<thead></thead><tbody></tbody><tfoot></tfoot>');
            me.$el.find('thead').before( me.renderThead().colHtml );
            me.$el.find('thead').html( me.renderThead().theadHtml );
            me.refresh();
        },
        /** 渲染表头
         */
        renderThead: function() {
            var me = this;
            var _source = $.extend({}, _initDataTable.tableOpts);
            var _theadHtml = '';
            var _colHtml = '';
            var _colspan = 0;

            for (var j in _source.data) {
                var _jval = _source.data[j];
                var _width = _jval.width ? 'width="'+ _jval.width +'"' : '';
                if (_jval.orderable) {
                    var _sortStr = j + ' ' + _jval.aaSorting;
                    me._orderData.push(_sortStr);

                    _theadHtml += '<th data-key="' + j + '" role="' + _jval.aaSorting + '" class="order sorting_' + _jval.aaSorting + '">' + _jval.title + '</th>';
                } else {
                    _theadHtml += '<th>' + _jval.title + '</th>';
                };
                _colHtml += '<col '+ _width +'/>';
                _colspan++;
            };
            if( _source.operate ){
                var _width = _source.operate.width ? 'width="'+ _source.operate.width +'"' : '';
                _colHtml += '<col '+ _width +'/>'
                _theadHtml += '<th>' + _source.operate.title + '</th>';
                _colspan++;    
            };
            

            _theadHtml = '<tr>' + _theadHtml + '</tr>';

            me.setColumnNum(_colspan); //设置表格的列数 
            me.setOrderData(me._orderData);
            me.setAjaxData($.extend(me.getOrderData(), me.getAjaxData())); //设置初始化时候的请求数据

            return { theadHtml: _theadHtml, colHtml: _colHtml };
        },
        /** 初始化table内容+分页部分
         */
        renderTbodyTfoot: function(data) {
            var me = this;

            if (data.data.length == 0) {
                me.$el.find('tbody').html(me.renderNodataTbody());
                me.$el.find('tfoot').html('');
                return;
            };
            me.$el.find('tbody').html(me.renderTbody(data.data));

            var $tfoot = me.$el.find('tfoot');
            $tfoot.html(me.renderTfoot(data.page));
            $tfoot.find('span,a').appendTo($tfoot.find('.pager-list')); 
        },
        /** 没有数据的时候，显示的内容
         */
        renderNodataTbody: function() {
            var _tbodyHtml = '<tr><td colspan="' + this.getColumnNum() + '">暂无信息</td></tr>';
            return _tbodyHtml;
        },
        /** 有数据的时候，显示的内容
         */
        renderTbody: function(data) {
            var _source = $.extend({}, _initDataTable.tableOpts);
            var _tbodyHtml = '';
            var _tfootHtml = '';
            var _colspan = 0;
            var _idkey = this.valKey;

            for (var i = 0, l = data.length; i < l; i++) {
                var _d = data[i];
                var _dataid = ( _d[_idkey] ? 'data-id="'+ _d[_idkey] +'"' : '')
                _tbodyHtml += '<tr '+ _dataid +'>';

                for (var j in _source.data) {
                    var  _tdhtml = ( _source.data[j].render ? _source.data[j].render( _d[j], '', _d, '') : _d[j]);
                    _tbodyHtml += '<td>' + _tdhtml + '</td>';
                };

                if( _source.operate ){
                    _tbodyHtml += '<td>' + _source.operate.render('', '', _d, '') + '</td>';
                };
                
                _tbodyHtml += '</tr>';
            };
            return _tbodyHtml;
        },
        /** 渲染table底部
         */
        renderTfoot: function(data) {
            var _tbodyHtml = '<tr><td colspan="' + this.getColumnNum() + '"><div class="clearfix"><div class="pager-list"></div>' + data + '</div></td></tr>';
            return _tbodyHtml;
        },
        /** 刷新table
         */
        refresh: function() {
            this.loadData(this.url);
        },
        /** 加载table数据
         */
        loadData: function(url) {
            var me = this;
            var $ajaxHtml = $('<div class="modal fade in modal-ajax" style="display: block;"><i class="fa fa-refresh fa-spin"></i></div>');
            $ajaxHtml.appendTo(top.document.body);

            $.ajax({
                url: url,
                dataType: 'json',
                type: 'POST',
                data: me.getAjaxData(),
                success: function(res) {
                    $ajaxHtml.remove();
                    me.renderTbodyTfoot(res);
                    me.renderCheckbox();
                    me._bindEvent();
                },
                error: function(res) {
                    $ajaxHtml.remove();
                    Alert('请求失败');
                }
            });
        },
        /*是否需要勾选*/
        renderCheckbox: function(){
            var me = this;

            if( me.checkbox ){ 
                if( me.$el.find('thead [role="thchk"]').length == 0 ){
                    me.$el.find('thead tr').prepend('<th role="thchk"><input type="checkbox"></th>');
                    me.$el.find('col:first-child').before('<col />')
                }else{
                    me.$el.find('thead [role="thchk"] input').prop("checked", false);
                };

                var _num = me.$el.find('thead th').length;
                if( me.$el.find('tbody td[colspan]').length == 1 ){
                    me.$el.find('tbody td').attr('colspan', _num);
                }else{ 
                    me.$el.find('tbody tr').prepend('<td role="thchk"><input type="checkbox"></td>');  
                };
                me.$el.find('tfoot td').attr('colspan', _num);  
            };
        },
        /** 搜索table 
         */
        reloadByParam: function(param) {
            this.setAjaxData( $.extend(param, this.getOrderData()) );
            this.refresh();
        },
        /** 事件绑定
         */
        _bindEvent: function() {
            var me = _initDataTable;
            var $el = me.$el;
            me.selectAll();

            me.$el.find('tfoot a').bind('click', function(e) { //点击页码
                e.preventDefault();
                var _href = $(this).attr('href');
                me.loadData(_href);
            });

            me.$el.find('thead .order').unbind('click').bind('click', function(e) {
                var $this = $(this);  
                switch ($this.attr('role')) {
                    case 'desc':
                        $this.attr({
                            'class': 'order sorting_asc',
                            'role': 'asc'
                        });
                        break;
                    case 'asc':
                        $this.attr({
                            'class': 'order sorting_desc',
                            'role': 'desc'
                        });
                        break;
                    case 'sorting':
                        $this.attr({
                            'class': 'order sorting_asc',
                            'role': 'asc'
                        });
                        break;
                };
                $this.siblings('.order').attr({
                    'class': 'order sorting',
                    'role': 'sorting'
                });

                var _key = $this.attr('data-key') + ' ' + $this.attr('role');
                
                me.setOrderData([_key]);
                delete me.getAjaxData().order;
                me.setAjaxData($.extend( me.getOrderData(), me.getAjaxData())); //设置初始化时候的请求数据
                me.refresh();
            });
        },
        /*设置排序的参数*/
        setOrderData: function(data) {
            var _newData = {};

            if (data.length > 0) { //默认有排序功能的时候，初始化需要传排序相关的参数给后台 
                _newData.order = data.join(',');
            };
            this._orderdata = _newData;
        },
        /*获取排序的参数*/
        getOrderData: function() {
            return this._orderdata;
        },
        /*设置表的列数*/
        setAjaxData: function(param) {
            this.ajaxdata = param;
        },
        /*获取表的列数*/
        getAjaxData: function() {
            return this.ajaxdata;
        },
        /*设置表的列数*/
        setColumnNum: function(num) {
            this._columnNum = num;
        },
        /*获取表的列数*/
        getColumnNum: function() {
            return this._columnNum;
        },
        /** 获取被勾选的行的id
         * @return[String] 返回所有被勾选的行的id字符串
         */
        getSelected: function() {
            var me = _initDataTable;
            var $el = me.$el;
            var $tbchk = $el.find('tbody [type="checkbox"]').filter(':checked');
            var _dataArry = [];

            for (var i = 0, l = $tbchk.length; i < l; i++) {
                var _val = $($tbchk[i]).parent().parent().attr('data-id');
                _dataArry.push(_val);
            };
            return _dataArry.join(',');
        },
        /** 销毁table 
         */
        destroy: function() {
            var me = _initDataTable;
            console.info('来源——dataTableCusV2.js');
        },
        /** 全选反选checkbox 
         */
        selectAll: function() {
            var $el = _initDataTable.$el;
            var $checkbox = $el.find('[type="checkbox"]');
            var $thcheckbox = $el.find('thead [type="checkbox"]');

            $checkbox.bind('click', function() {
                var $this = $(this);
                var _checked = $this.prop("checked");

                if ($this.parent('th').length > 0) { //点击的是表头内的复选框

                    if (_checked) { //勾选

                        $checkbox.prop("checked", true);
                    } else { //取消勾选

                        $checkbox.prop("checked", false);
                    };
                } else { //点击的是普通行内的复选框

                    if (_checked) { //勾选 

                        if ($checkbox.not(":checked").not($thcheckbox).length == 0) {
                            $thcheckbox.prop("checked", true);
                        };
                    } else { //取消勾选

                        $thcheckbox.prop("checked", false);
                    };
                };
            });
        }
    };
    _initDataTable._init(_opts);
    return _initDataTable;
};
