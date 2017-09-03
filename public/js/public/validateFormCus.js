/*!  
 * ================
 * 表单校验二次封装，并提供返回功能
 * @Author  Yugl   
 * @param[jQuery] $el form的jquery选择器对象
 * ======
 * @Method validnew() //校验有效性 return boolean
 * @Method serializeObject() //返回表单的值 return object
 * @Method assignForm( Obj ) //给表单赋值 
 * ======
 * @return[Object] validator 表单校验对象；提供了serializeObject()获取表单数组数据
 */
function InitValidateForm($el) {
    var $td = $el.find('td');

    if ($td.length > 0) { //新建或者编辑界面中的表单校验 
        $td.wrapInner('<div class="form-group"></div>');
    };
    var $datepicker = $el.find('[data-type="datepicker"]');
    if ($datepicker.length > 0) { //初始化日期插件

        $datepicker.parents('.form-group').addClass('calendar-box');
        $datepicker.datepicker({
            dateFormat: "yy-mm-dd",
            onSelect: function() {
                var $this = $(this);
                var $nextDate = $datepicker.filter('[name="' + $this.attr('data-next-name') + '"]');

                if ($nextDate.length > 0) {
                    var _val = $this.val();
                    $nextDate.datepicker("option", "minDate", _val);
                };
            }
        });
    };
    /*$el.find('input:visible').iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass: 'iradio_minimal-blue',
        increaseArea: '20%' // optional
    });
*/
    var validator = $el.validate({
        errorElement: 'label', //default input error message container
        errorClass: 'text-red', // default input error message class
        focusInvalid: false, // do not focus the last invalid input 
        invalidHandler: function(event, validator) { //display error alert on form submit   
            $('.alert-error').show();
        },
        highlight: function(element) { // hightlight error inputs
            $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        success: function(label) {
            $('.alert-error').hide();
            label.prev('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function(error, element) {
            error.addClass('text-red').insertAfter(element.closest('.form-group'));
        },
        submitHandler: function(form) {
            $('.alert-error').hide();
            $('.alert-success').show();
        }
    });

    /* 给表单赋值 
     * @param [Json] data: 表单数据
     */
    validator.assignForm = function(data) {
        var _dataObj = data;

        for (var i in _dataObj) {
            var $input = $('[name="' + i + '"]', $el);
            if ($input.length == 0) {
                continue;
            }; 
            switch ($input.attr('type')) {

                case "radio":
                case "checkbox":
                    var $icheck = $input.filter('[value="' + data[i] + '"]');
                    $icheck.iCheck('check');
                    $icheck.trigger('ifChecked');
                    break;
                default:
                    $input.val(data[i]);
                    break;
            }; 
        };
    };

    /* 校验是否通过
     * @return[Boolean] 返回校验结果
     */
    validator.validnew = function() {
        return $el.valid();
    };
    /* 序列化表单
     * @return[Json] 以json对象的形式返回表单数据 
     */
    validator.serializeObject = function() {
        var _arry = $el.serializeArray();
        var _formObj = {};

        for (var i = 0, l = _arry.length; i < l; i++) {
            var _d = _arry[i];
            var _name = _d.name;
            var _value = _d.value;

            if( !_formObj[_name] ){
                _formObj[_name] = _value;  
            }else{
                
                if( typeof _formObj[_name] == "string"){
                    _formObj[_name] = _formObj[_name].split(',');
                };
                _formObj[_name].push( _value );       
            };
            
        };
        return _formObj;
    };
    return validator;
};

/*======================================
 * 实时搜索二次封装
 * @param obj.dataSource //数据源
 * @param obj.$el //jQuery选择器 
 * @param obj.valueKey //真实值对应的字段
 * @param obj.labelKey //显示值对应的字段 
 */
function InitAutocomplete(obj) {
    var _defaults = {
        dataSource: '', //数据源
        $el: '', //jQuery选择器 
        valueKey: '', //真实值对应的字段
        labelKey: '' //显示值对应的字段 
    };
    var _initAutocomplete = {
        _init: function(opts) {
            var me = this;
            for (var i in opts) {
                me[i] = opts[i];
            };
            me.initAutoComplete();
        },
        initAutoComplete: function() {
            var me = this;
            var _data = me.dataSource;
            var _label = me.labelKey;
            var _value = me.valueKey;
            var _autodata = $(_data).map(function(idx, item) {
                return {
                    label: item[_label],
                    value: item[_label],
                    valuereal: item[_value]
                }
            }).toArray();

            me.$el.autocomplete({
                source: _autodata,
                select: function(event, ui) { 
                    me.$el.val( ui.item.value ); 
                    $('[name="' + _value + '"]').val(ui.item.valuereal);
                    return false;
                }
            })
        }
    };
    var _opts = $.extend({}, _defaults, obj);
    _initAutocomplete._init(_opts);
    return _initAutocomplete;
};
