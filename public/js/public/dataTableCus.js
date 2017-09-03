/*!  
 * ================
 * datatable插件二次封装
 * @Author  Yugl   
 */
function InitDataTable(opts, callinitdatatable ) {
    var detaults = {
        $el: '', //表格dom
        url: '', //表格数据地址
        tableOpts: '' //表格岑姝配置项
    };

    var _opts = $.extend({}, detaults, opts);
    var _initDataTable = {
        _dataTable: null,
        _orderable: false,
        _aaSorting: [], //初始化时候的列排序规则
        tabledatasource: null,
        ajaxdata: {},
        _paramdata: {},
        _init: function(options) {
            var me = this;
            $.extend(me, options);

            me._initTable(me._transferData());
        },
        _transferData: function() {
            var me = _initDataTable;
            var _source = $.extend({}, _initDataTable.tableOpts);
            var _desc = {};
            var _columns = [];
            var _columnsDef = [];
            var num = 0;

            for (var i in _source.data) {

                var _d = _source.data[i];
                var _colObj = {};
                var _coldefObj = {};

                if (_d.orderable) {
                    me._orderable = true;
                } else {
                    _d.orderable = false;
                };

                _colObj.data = i;
                _colObj.name = i;
                _columns.push(_colObj);

                _coldefObj = $.extend({}, _d);
                _coldefObj.targets = num;
                _columnsDef.push(_coldefObj);

                if (_d.aaSorting) {
                    me._aaSorting.push([num, _d.aaSorting]);
                };
                num++;
            };

            if (_source.operate) {
                _source.operate.orderable = false;
                _columnsDef.push($.extend({ targets: num }, _source.operate));
            };


            _desc._columns = _columns;
            _desc._columnsDef = _columnsDef;
            return _desc;
        },
        _initTable: function(data) {
            var me = _initDataTable;
            var _flag = true;
            var columnsDef = data._columnsDef;
            var _tableConfig = {
                "initComplete": function(settings, json) {
                    me.setDatatableSource( json.data ); 
                    me._bindEvent(); 
                    
                    if( callinitdatatable ){
                        callinitdatatable();
                    };
                    
                },
                "ajax": {
                    "url": me.url, 
                    "type": "POST",
                    "data": me.ajaxdata
                }, 
                "columns": data._columns,
                "columnDefs": columnsDef,
                "ordering": me._orderable,
                "language": {
                    "lengthMenu": "每页 _MENU_ 条记录",
                    "zeroRecords": "没有找到记录",
                    "info": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    "infoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "infoPostFix": "",
                    "infoFiltered": "(从 _MAX_ 条记录过滤)",
                    "paginate": {
                        "first": "首页",
                        "previous": "上页",
                        "next": "下页"
                    }
                }

            }; 
            if (me._aaSorting.length > 0) {
                _tableConfig = $.extend({}, _tableConfig, { "aaSorting": me._aaSorting });
            };
            me._dataTable = me.$el.DataTable(_tableConfig);
        },  
        setDatatableSource: function( data ){ 
            this.tabledatasource = data;
        },
        getDatatableSource: function(){ 
            return this.tabledatasource;
        },
        refresh: function(){
            var me = this; 
            me.reloadByParam( me._paramdata );
        },
        /** 刷新table 
         */
        reloadByParam: function( param ) {
            var me = _initDataTable;
            var oTable = me.$el.DataTable();
               
            me._paramdata = param;
            oTable.settings()[0].ajax.data = param;
            oTable.ajax.reload(); 
        },
        /** 事件绑定
         */
        _bindEvent: function() {
            var me = _initDataTable;
            var $el = me.$el;
            me.selectAll();
            $el.on('page.dt', function() {
                $el.find('[type="checkbox"]').prop("checked", false);
            });
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
                var _val = $($tbchk[i]).val();
                _dataArry.push(_val);
            };
            return _dataArry.join(',');
        },
        /** 销毁table 
         */
        destroy: function() {
            var me = _initDataTable;
            me.$el.DataTable().destroy(); 
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
