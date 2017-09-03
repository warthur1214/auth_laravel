/** 
 * @功能说明：美化window弹窗,扩展了弹窗内容格式(支持字符串,表单，视频，音频等等)，新增表单弹窗,支持弹窗自定义宽度，标题，弹出位置这三个属性
 * @调用说明
 * Alert( title, options ) title必填，option选填
 * AlertHide( title, options, call ) 1S消失的弹窗；title必填，option选填, call()必填: 窗口关闭之后的回调
 * Confirm( title, options, call ) title必填，option选填: 弹窗相关配置项, call(res)选填: 点确定或者取消按钮之后的回调，res值为true | false
 * Prompt( title, options, call ) title必填，option选填: 弹窗相关配置项, call(res)选填: 点确定或者取消按钮之后的回调，res值为表单数据 | false 
 *
 * @开发 Guilin yu 
 * @版本 1.0
 * @创建时间 2016-08-05 17:44
 */

var Alert = Modal().createAlert; //实例化Alert窗口
var AlertHide = Modal().createAlertHide; //实例化Alert窗口
var Confirm = Modal().createConfirm; //实例化 Confirm 窗口
var Prompt = Modal().createPrompt; //实例化 Confirm 窗口

function Modal(opts) {
    var defaults = {
        width: 200,
        title: '',
        position: 'center' //目前仅支持左上topLeft，中上topCenter，右上topRight，中心center，右下bottomRight
    };
    var _opts = $.extend(defaults, opts);
    var _Modal = {
        _options: {},
        $wrap: null, //弹出窗结构
        _modaltitle: ['提示', '确认', '输入'],
        _posArry: ['topLeft', 'topCenter', 'topRight', 'middleLeft', 'center', 'middleRight', 'bottomLeft', 'bottomCenter', 'bottomRight'],
        _init: function(opts) {
            var me = _Modal;
            var _html = '<div role="modal-cus" class="modal-cus"><div class="box box-info box-solid">' +
                '<div class="box-header with-border">' +
                '<h3 role="modal-title" class="box-title">Removable</h3>' +
                '<div class="box-tools pull-right">' +
                '<button type="button" role="close" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>' +
                '</div>' +
                '</div>' +
                '<div role="modal-body" class="box-body"></div>' +
                '<div role="modal-foot" class="box-foot">' +
                '<button type="button" role="ok" class="btn btn-sm btn-info btn-ok">确定</button>' +
                '<button type="button" role="cancle" class="btn btn-sm btn-default">取消</button>' +
                '</div>' +
                '</div></div>';
            me.$wrap = $(_html);
            $.extend(me._options, opts);
        },
        /*===========================创建弹出窗口遮罩*/
        _createFade: function() {
            var _fade = '<div role="modal-fade" class="modal-backdrop fade"></div>';
            $(_fade).appendTo(top.document.body);
        },
        /*===========================创建 Alert 弹出窗口*/
        createAlert: function(str, opts, call) {
            var me = _Modal;
            var _$wrap = me.$wrap;
            var options = $.extend({}, me._options);

            _$wrap.find('[role="modal-body"]').html(str);
            _$wrap.find('[role="cancle"]').remove();
            _$wrap.appendTo(top.document.body);

            me._createFade();

            if (arguments[1] && typeof(arguments[1]) == "object") {
                options = arguments[1];
                me.bindEvent(call);

            } else {
                me.bindEvent(arguments[1]);
            };
            me.setOptions(options);

        },
        /*===========================创建 Alert 弹出窗口*/
        createAlertHide: function(str, opts, call ) {
            var me = _Modal;
            var _$wrap = me.$wrap;
            var options = $.extend({}, me._options);
            var callback = null;

            _$wrap.find('[role="modal-body"]').html(str);
            _$wrap.find('.box-foot .btn').remove();
            _$wrap.appendTo(top.document.body);

            me._createFade();

            if (arguments[1] && typeof(arguments[1]) == "object") {
                options = arguments[1]; 
                callback = call;
            }else{
                callback = arguments[1]; 
            };
            me.setOptions(options);

            setTimeout(function() {
                me.hideModal();
                if( callback ){
                    callback(); 
                }; 
            }, 800);

        },
        /*===========================创建 Confirm 弹出窗口*/
        createConfirm: function(str, opts, call) {
            var me = _Modal;
            var _$wrap = me.$wrap;
            var options = $.extend({}, me._options);

            _$wrap.find('[role="modal-body"]').html(str);
            _$wrap.appendTo(top.document.body);

            me._createFade();

            if (arguments[1] && typeof(arguments[1]) == "object") {

                options = arguments[1];
                me.bindEvent(call);
            } else {
                me.bindEvent(arguments[1]);
            };
            me.setOptions(options);

        },
        /*===========================创建 Prompt 表单窗口*/
        createPrompt: function(str, opts, call) {
            var me = _Modal;
            var _$wrap = me.$wrap;
            var options = $.extend({}, me._options);

            _$wrap.find('[role="modal-body"]').html('<form></form>');
            _$wrap.find('[role="modal-body"] > form').html( str );
            _$wrap.appendTo(top.document.body);


            me._createFade();

            if (arguments[1] && typeof(arguments[1]) == "object") {

                options = arguments[1];
                me.bindPromptEvent(call);
            } else {
                me.bindPromptEvent(arguments[1]);
            };
            me.setOptions(options);

        },
        /*============================用户自定义弹窗属性*/
        setOptions: function(options) { 
            var me = _Modal;
            var _$wrap = me.$wrap;
            var _newoption = $.extend({}, me._options, options); 
            var _width = _newoption.width;
            var _title = _newoption.title || me._modaltitle[0];
            var _pos = _newoption.position;

            _$wrap.css({ 'width': _width + "px" });
            _$wrap.find('[role="modal-title"]').html(_title);
            me.showModal(_pos);
            // /me._initCheck( _newoption );

        },
        /*============================Prompt点击事件*/
        bindPromptEvent: function(call) {
            var me = _Modal;
            var _$wrap = me.$wrap;

            _$wrap.find('[role="close"]').bind('click', function() {

                me.hideModal();
            });

            _$wrap.find('[role="cancle"]').bind('click', function() {
                me.hideModal();

                if (call) {
                    call(false);
                };
            });
            _$wrap.find('[role="ok"]').bind('click', function() {
                if (call) {
                    var $form = me.$wrap.find('form');

                    var validForm = InitValidateForm($form); 
                    if (validForm.validnew()) {

                        call($.extend({}, validForm.serializeObject()));

                        me.hideModal();
                    };

                };
            });
        },
        /*============================Alert 、 Confirm点击事件*/
        bindEvent: function(call) {
            var me = _Modal;
            var _$wrap = me.$wrap;

            _$wrap.find('[role="close"]').bind('click', function() {

                me.hideModal();
            });

            _$wrap.find('[role="cancle"]').bind('click', function() {
                me.hideModal();

                if (call) {
                    call(false);
                };
            });
            _$wrap.find('[role="ok"]').bind('click', function() {
                me.hideModal();

                if (call) {
                    call(true);
                };
            });
        },
        /*===========================隐藏弹出窗口*/
        hideModal: function() {
            var me = _Modal;
            var _$wrap = me.$wrap; 

            me.$wrap.next('[role="modal-fade"]').remove();
            me.$wrap.remove();
        },
        _initCheck: function( _newoption ) {
            var me = _Modal;
            var _$wrap = me.$wrap;
            _$wrap.find('input:visible').iCheck({
                checkboxClass: 'icheckbox_minimal-blue',
                radioClass: 'iradio_minimal-blue',
                increaseArea: '20%' // optional
            });
            _$wrap.find('input:visible').on('ifChecked', function(event) {
                _newoption.onChecked( $(this) );
            });
        },
        onChecked: function(){ 
        },
        /*===========================显示弹出窗口*/
        showModal: function(pos) {
            var me = _Modal;
            var _$wrap = me.$wrap;
            var _left = _$wrap.width() / 2;
            var _top = _$wrap.height() / 2;

            switch (pos) {
                case me._posArry[4]: //中间
                    _$wrap.css({
                        "margin-left": -_left + "px",
                        "margin-top": -_top + "px"
                    });
                    break;
                case me._posArry[0]: //左上
                    _$wrap.css({
                        "top": 0,
                        "left": 0
                    });
                    break;
                case me._posArry[1]: //中上
                    _$wrap.css({
                        "margin-left": -_left + "px",
                        "top": 0
                    });
                    break;
                case me._posArry[8]: //右下
                    _$wrap.css({
                        "top": "auto",
                        "left": "auto",
                        "bottom": 0,
                        "right": 0
                    });
                    break;
                default:
                    _$wrap.css({
                        "margin-left": -_left + "px",
                        "margin-top": -_top + "px"
                    });
                    break;
            };

        }
    };
    _Modal._init(_opts);

    return _Modal;
};
