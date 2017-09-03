/*!  
 * ================
 * 多级联动下拉框
 * opts.level:  [{ el: '', url: '' }, { el: '', url: '' }]
 * @Author  Yugl   
 */
function RelationSelect(opts) {
    var defaults = {
        level: [{ el: '', url: '' }, { el: '', url: '' }]
    };
    var _relationSelect = {
        _cacheData: {},
        _optionHtml: '',
        _optionLevel: 0,
        _init: function(opts) {
            var me = this;
            for (var i in opts) {
                me[i] = opts[i];
            };
            me.initDom();
        },
        initDom: function() {
            var me = this;
            var _level = me.level;

            for (var i = 0, l = _level.length; i < l; i++) {

                var _d = _level[i];
                var _child = _level[i + 1];
                var _id = _d.el;

                var $el = $(_id);
                me._cacheData[_id] = _d;

                if (_child) {
                    $el.attr('level-child', $(_child.el).attr('id'));
                };
            };
            me.load($(me.level[0].el), me.level[0].url);
        },
        load: function($el, url) {
            var me = this;

            AjaxJson(url, function(res) {
                if( res ){
                    me.initSelect($el, res);
                }; 
            });
            $el.unbind('change').bind('change', function() {
                var _val = $(this).val(); 
                var _child = $(this).attr('level-child');

                if (_child) { //如果存在下一级联动，则加载下一级的数据
                    var _id = '#' + _child;
                    var _data = me._cacheData[_id];

                    me.load($(_data.el), _data.url + _val);
                };
            });
        },
        /*初始化下拉框*/
        initSelect: function($el, data) {
            var me = this;
            var _id = '#' + $el.attr('id');
            var _data = me._cacheData[_id];

            me._optionHtml = '';
            $el.find('option[dynamic]').remove();

            me.renderOption(data, _data);
            $el.append(me._optionHtml);
            me.initDefaultVal( $el, _data ); 
        },
        /*初始化默认值*/
        initDefaultVal: function( $el, data ){  
            $el.val( data.defaultval );
        },
        renderOption: function(data, _data) {
            var me = this;
            var _optionVal = _data.id;
            var _optionText = _data.name;
            var _optionChild = _data.children;

            for (var i = 0, l = data.length; i < l; i++) {
                var _d = data[i]; 
                var _split = '';

                if (_d[_optionChild]) {  
                    _split = '';
                    if( i == 0){
                        me._optionLevel++; 
                    }; 

                    for (var j = 0; j < me._optionLevel; j++) {
                        _split += '&nbsp;&nbsp;&nbsp;&nbsp;';
                    }; 
                    var _text = _split + _d[_optionText];
                    me._optionHtml += ('<option dynamic value="' + _d[_optionVal] + '">' + _text + '</option>');
                    me.renderOption(_d[_optionChild], _data);

                } else {
                    if (me._optionLevel > 0) { 
                        _split = '';

                        if( i == 0){
                            me._optionLevel++; 
                        };
                        
                        for (var j = 0; j < me._optionLevel; j++) {
                            _split += '&nbsp;&nbsp;&nbsp;&nbsp;';
                        }; 
                        if( i == data.length - 1 ){
                            me._optionLevel = 0;
                        }; 
                    }; 
                    var _text = _split + _d[_optionText];
                    me._optionHtml += ('<option dynamic value="' + _d[_optionVal] + '">' + _text + '</option>');
                };
            };
        }
    };
    var _opts = $.extend({}, defaults, opts);
    _relationSelect._init(_opts);
    return _relationSelect;
}; 
