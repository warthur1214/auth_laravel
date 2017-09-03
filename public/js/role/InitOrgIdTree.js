function InitOrgIdTree(options) {
    var _defaults = {
        $inputId: '',
        $inputName: '',
        $tree: ''
    };
    var _InitOrgIdTree = {
        _init: function(opts) {
            var me = this;
            for (var i in opts) {
                me[i] = opts[i];
            };
            me.initTree();
            me.bindEvent();
        },
        initTree: function() {
            var me = this;
            me.initOrgTree = InitRoleTree({ //初始化企业或者机构树实例
                $el: me.$tree,
                url: '/Home/Son/sonParentList',
                textKey: 'organ_name',
                valKey: 'organ_id',
                childrenKey: 'son',
                className: 'tree-list-default'
            });
        },
        bindEvent: function() {
            var me = this;
            me.initOrgTree.onClickNode = function($el) { //点击企业或机构树节点 
                var id = $el.parent('li').attr('data-id');

                me.$inputId.val($el.text());
                me.$inputName.val(id);
                me.onClickTreeNode($el);

                me.$tree.addClass('hide');
            };

            me.$inputId.bind('focus', function() { //点选角色归属
                me.$tree.removeClass('hide');
            }).bind('click', function(e) {
                e.stopPropagation();
            });

            $(document).bind('click', function() {
                me.$tree.addClass('hide');
            });
        },
        onClickTreeNode: function($el) {}
    };
    var _options = $.extend({}, _defaults, options);
    _InitOrgIdTree._init(_options);

    return _InitOrgIdTree;
};
