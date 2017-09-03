function CarGroupPopup(opts) {
    var _defaults = {
        $textEl: '',
        $valueEl: '',
        url: '/Home/Public/organTree',
        showGroup: true, //是否需要隐藏车辆分组,默认显示
        showAll: false //是否显示“全部”勾选项
    };
    var _html = '';
    var _opts = $.extend({}, _defaults, opts);
    var _CarGroupPopup = {
        _$tree: '',
        _cacheGroupData: {},
        _cacheOrgData: {},
        init: function(opts) {
            var me = this;
            for (var i in opts) {
                me[i] = opts[i];
            };
            me.initDom();
        },
        initDom: function() {
            var me = this;
            me._$tree = $('<ul role="tree" class="car-group-tree hide"></ul>');
            me.$textEl.wrap('<div role="tree-box" class="relative"></div>');
            me.$textEl.after(me._$tree);
            me.$textEl.addClass('form-control-cargroup').prop('readonly', 'readonly');
            AjaxJson(me.url, function(res) {

                if (res) { 
                    me.renderTree(res);
                    me.addAllDom();
                    me.bindEvent();
                    me.hideGroupDom();
                };

            });
        },
        addAllDom: function(){
            var me = this;
            if( me.showAll ){ 
                var _icon = (me.showGroup ? '<i class="fa fa-car"></i>' : '<i class="fa fa-sitemap"></i>');
                me._$tree.prepend('<li><span id="all">'+ _icon +' 全部</span></li>');
            };
        },
        /*隐藏车辆分组dom*/
        hideGroupDom: function(){
            var me = this;
            if( !me.showGroup ){
                me._$tree.find('[role="group"]').parent('li').remove();

                var $org = me._$tree.find('[role="org"]');
                $org.siblings('ul').not(":has(li)").siblings('.fa-caret-down').remove();
            };
        },
        /*验证数组存在，且值不为空*/
        validateArry: function(data) {
            var _flag = (data && data.length > 0);
            return _flag;
        },
        renderTree: function(data) {
            var me = this;
            var _html = '';

            getCarData(data);
            me._$tree.html(_html);

            /*====获取公司下的车辆信息====*/
            function getCarData(data) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var _d = data[i];
                    var _id = _d.organ_id; 
                    me._cacheOrgData[_id] = _d;
                    _html += ('<li>' +
                        '<i role="expand" class="fa fa-caret-down text-default"></i>' +
                        ' <span role="org" id="'+ _id +'"><i class="fa fa-sitemap"></i> ' + _d.organ_name + '</span><ul>'); //渲染公司html


                    if (me.validateArry(_d.group)) { //公司下有车组 

                        _html += me.renderGroupHtml(_d.group); //渲染车组html 
                    };

                    if (me.validateArry(_d.son)) { //公司下有子公司  
                        getCarData(_d.son);
                    };
                    _html += '</ul></li>';
                };
            };
        },
        /*渲染车组列表*/
        renderGroupHtml: function(data) {
            var me = this;
            var _html = '';
            for (var i = 0, l = data.length; i < l; i++) {
                var _d = data[i];
                if (_d) {
                    var _id = _d.group_id;
                    me._cacheGroupData[_id] = _d;
                    _html += '<li>' +
                        ' <span role="group" id="' + _id + '"><i class="fa fa-car"></i> ' + _d.group_name + '</span></li>';
                };
            };
            return _html;
        },
        /*绑定事件*/
        bindEvent: function() {
            var me = this;

            me.$textEl.bind('focus', function() {
                me.showTree();
            }).bind('click', function(e) {
                e.stopPropagation();
            }).bind('change', function() {

                if ($(this).val() == "") {
                    me.hideTree();
                    me.$valueEl.val('');
                };
            });
            $(document).bind('click', function() {
                me.hideTree();
            });
            me._$tree.bind('click', function(e) {
                e.stopPropagation();
            });

            //点击收起展开图标
            me._$tree.find('[role="expand"]').bind('click', function() {
                var $ul = $(this).siblings("ul");
                $ul.slideToggle();
                $(this).parent('li').toggleClass("car-collapse");
            });

            //点击组织机构
            me._$tree.find('[role="org"]').bind('click', function() {
                if( !me.showGroup ){
                    var _id = $(this).attr('id');
                    me.hideTree();  
                    me.onClickOrg( me._cacheOrgData[_id] );
                }else{
                    Alert('请选择车组!');
                }; 
            });

            //点击车辆分组
            me._$tree.find('[role="group"]').bind('click', function() {
                var _id = $(this).attr('id');
                me.hideTree();

                me.onClickGroup(me._cacheGroupData[_id]);
            });
            me._$tree.find('#all').bind('click', function() { 
                me.hideTree(); 
                me.$textEl.val( '全部' );
                me.$valueEl.val( '' );
            });
        },
        showTree: function() {
            this._$tree.removeClass('hide');
        },
        hideTree: function() {
            this._$tree.addClass('hide');
        },
        onClickOrg: function( data ){  
            var me = this;  
            me.$textEl.val(data.organ_name);
            me.$valueEl.val(data.organ_id); 
        },
        onClickGroup: function(data) {
            var me = this;
            me.$textEl.val(data.group_name);
            me.$valueEl.val(data.group_id);
        }
    };
    _CarGroupPopup.init(_opts);
    return _CarGroupPopup;
};
