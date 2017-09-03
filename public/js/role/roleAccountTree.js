function InitRoleAccountTree( opts ) {
    var _defaults = {
        $el: '',
        url: '',
        textKey: '',
        valKey: '',
        childrenKey: '',
        className: '',
        checkbox: false,
        checkboxName: ''
    }; 
    var _html = '';
    var _opts = $.extend({}, _defaults, opts );
    var _initOrgTree = {
        init: function( opts ) { 
            var me = this;
            for(var i in opts){
                me[i] = opts[i];
            };

            AjaxJson( me.url, function(res) {  
                if (res) { 
                    me.$el.html('');
                    me.renderList(res);
                    me.$el.html('<ul class="'+ me.className +'">' + _html + '</ul>');
                    me.bindEvent();
                };
            });
        },
        renderList: function(res) {
            var me = this;
            var _children = me.childrenKey;
            var _val = me.valKey;
            var _text = me.textKey; 

            if( !res ){
                return;
            };
            for (var i = 0, l = res.length; i < l; i++) {
                var _d = res[i];
 
                if ( _d[_children] || _d.account ) {
                    _html += '<li class="tree-parent" data-id="' + _d[_val] + '"><i class="fa fa-collapse fa-chevron-down"></i> <span class="tree-node">' + _d[_text] + '</span><ul>';
                    
                    me.renderAccount( _d.account );
                    me.renderList(_d[_children]);
                    _html += '</ul></li>';
                } else {
                    _html += '<li class="tree-leaf" data-id="' + _d[_val] + '"> <span class="tree-node">' + _d[_text] + '</span></li>';
                };
            };
        },
        renderAccount: function( data ){ 
            if( !data ){
                return;
            };
            var me = this;
            var _checkboxName = me.checkboxName;
            
            for(var i = 0, l = data.length; i < l; i++){
                var _d = data[i]; 
                var _checkbox = '<input type="checkbox" name="'+ _checkboxName +'" value="'+ _d.account_id +'" /> ';
                _html += '<li>' + _checkbox + _d.account_name +'</li>';
            };
        },
        bindEvent: function() { 
            var me = this;
            var $collapse = me.$el.find('.fa-collapse');
            var $treeNode = me.$el.find('.tree-node');
            $collapse.bind('click', function() {
                var $this = $(this);

                if ($this.hasClass('fa-chevron-down')) {
                    $this.removeClass('fa-chevron-down').addClass('fa-chevron-right');
                    $this.siblings('ul').slideUp();
                } else {
                    $this.removeClass('fa-chevron-right').addClass('fa-chevron-down');
                    $this.siblings('ul').slideDown();
                };
            });

            $treeNode.bind('click', function(){
                var $this = $(this);
                var _data = $this.parent('li').attr('data-id');

                me.$el.find('.active').removeClass('active');
                $this.addClass('active'); 

                me.onClickNode( $this );

            });

            if( me.checkbox ){
                var $checkbox = me.$el.find(':checkbox');

                $checkbox.filter('[role="all"]').bind('change', function(){

                    if( $(this).prop('checked') ){ //勾选 

                        $checkbox.prop('checked', 'checked');

                    }else{ //取消勾选
                        $checkbox.prop('checked', '');
                    }; 
                });
            };
        },
        onClickNode: function( $el ){

        }
    };
    _initOrgTree.init( _opts );
    return _initOrgTree;
};