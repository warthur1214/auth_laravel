var mytable; //角色成员列表
$(function() {
    var validateForm = InitValidateForm($('#info_form'));
    var $roleTree = $('#roleTree'); //企业或者机构树元素
    var $organId = $('#organ_id'); //企业或者机构id
    var $roleOrganTree = $('#roleOrganTree'); //企业或者机构树元素
    var roleOrganTree; // 数据权限授权树实例
    var $roleAccountTree = $('#roleAccountTree'); //角色权限树元素
    var roleAccountTree; //角色权限树实例 
     
    InitOrgIdTree({
        $inputId: $organId,
        $inputName: $('[name="organ_id"]'),
        $tree: $roleTree,
        onClickTreeNode: function( $el ){ 
            var id = $el.parent('li').attr('data-id'); 
            initRoleAuthorization( id );
        }
    }); 

    var roleModuleTabVm = new Vue({ //功能权限模块
        el: '#roleModuleTab',
        methods: {
            checkItem: function(event) {
                var $target = $(event.target);
                var $ul = $target.parents('ul');

                if (event.target.checked && $ul.length > 0) {
                    $ul.siblings('.title').find(':checkbox').prop('checked', 'checked');
                };
            },
            checkItemSon: function(event) {
                var $target = $(event.target);
                var $ul = $target.parents('ul');

                if (event.target.checked && $ul.length > 0) {

                    $ul.find('li:first-child :checkbox').prop('checked', 'checked');
                    $ul.siblings('.title').find(':checkbox').prop('checked', 'checked');
                };
            },
            checkItemAll: function(event) {
                var $target = $(event.target);
                var $ul = $target.parents('ul');
                if (event.target.checked) {
                    $ul.find(':checkbox').prop('checked', 'checked');
                    $ul.siblings('.title').find(':checkbox').prop('checked', 'checked');
                } else {
                    $ul.find(':checkbox').prop('checked', '');
                    /*$ul.siblings('.title').find(':checkbox').prop('checked', '');*/
                };
            }
        }
    });  

    /*初始化角色模块复选框*/
    function initRoleCheckbox($el, val) {
        if (val) {
            var _arry = val.split(',');

            for (var i = 0, l = _arry.length; i < l; i++) {
                var _d = _arry[i];

                $el.filter('[value="' + _d + '"]').prop('checked', 'checked');
            };
        };
    };

    /*点击提交按钮*/
    $('#submit').bind('click', function() {

        if (validateForm.validnew()) {

            var postdata = $.extend({}, validateForm.serializeObject());
            delete postdata.myTable_length;

            postdata.role_module = transferToString(postdata.role_module);
            postdata.role_organ = transferToString(postdata.role_organ);

            AjaxJson('/Home/Role/addRoleAjax', postdata, function(res) {
                AlertHide(res.msg, function() {
                    if (res.status == '1') {
                        HrefTo('/Home/Role/roleList');
                    };
                });
            });
        };
    });

    /*点击添加本角色账号*/
    $('#AddRoleAccount').bind('click', function() {
        var $roleAccountTreePrompt = $roleAccountTree.clone(true);

        initRoleCheckbox($roleAccountTreePrompt.find('[name="account_id"]'), $('[name="role_account"]').val());
        $roleAccountTreePrompt.removeClass('hide');

        Prompt($roleAccountTreePrompt, {
            title: '添加角色账号',
            width: 400
        }, function(data) {

            if ($.isEmptyObject(data)) {
                return;
            };

            var postdata = {};
            postdata.account_id = transferToString(data.account_id);

            $('[name="role_account"]').val(postdata.account_id);

            if (!mytable) {
                initTable(postdata);
            } else {
                mytable.reloadByParam(postdata);
            }
        });
    }); 

    /*转换成字符串*/
    function transferToString(val) {
        if (val) {
            return (typeof val == "string" ? val : val.join(','));
        } else {
            return '';
        };
    };
    /*初始化表格*/
    function initTable(postdata) {
        mytable = InitDataTable({
            $el: $('#myTable'), //表格dom选择器
            url: "/Home/Role/getAccountById", //表格列表数据 
            ajaxdata: postdata,
            tableOpts: {
                data: {
                    "account_id": { title: "账号编号" },
                    "account_name": { title: "账号名称" },
                    "real_name": { title: "账号姓名" },
                    "organ_name": { title: "账号归属" }
                },
                operate: {
                    "title": '操作', //自定义操作列 
                    render: function(data, type, row, meta) {
                        var _data = JSON.stringify(row);
                        var _text = ('<span data-id="' + row.account_id + '" onclick="deleteRecord( this )" class="label label-danger">删除</span> ');

                        return _text;
                    }
                }
            }
        });
    };

    /*初始化角色授权tab*/
    function initRoleAuthorization(organId) {
        initRoleRrgan(organId);
        initRoleAccount(organId);
        initRoleModule();
    };

    //初始化数据权限模块
    function initRoleRrgan(organId) {

        roleOrganTree = InitRoleTree({ //初始化企业或者机构树
            $el: $roleOrganTree,
            url: '/Home/Son/sonParent/pid/' + organId,
            textKey: 'organ_name',
            valKey: 'organ_id',
            childrenKey: 'son',
            className: 'tree-list-default',
            checkbox: true,
            checkboxName: 'role_organ'
        });
    };

    //初始化功能权限
    function initRoleModule() {
        AjaxJson('/Home/Role/roleModuleList', function(res) {
            if (res) {
                roleModuleTabVm.$data = {
                    items: res
                };
            };
        });
    };

    //初始化角色权限账号
    function initRoleAccount(organId) {
        roleAccountTree = InitRoleAccountTreeNew({ //初始化企业或者机构树
            $el: $roleAccountTree,
            url: '/Home/Role/getAccountByOrgan/pid/' + organId,
            textKey: 'account_name',
            valKey: 'account_id',
            childrenKey: 'son',
            className: 'tree-list-default',
            checkbox: true,
            checkboxName: 'account_id'
        });
    };
});

/*角色成员列表——删除功能*/
function deleteRecord(el) {
    var $el = $(el);
    var _id = $el.attr('data-id');
    var _accountArry = $('[name="role_account"]').val().split(',');
    var _newArry = _accountArry.concat();

    for (var i in _accountArry) {
        if (_accountArry[i] == _id) {
            _newArry.splice(i, 1);
            break;
        };
    };

    $('[name="role_account"]').val(_newArry.join(','));
    $el.parents('tr').remove();
    
    mytable.reloadByParam({
        account_id: $('[name="role_account"]').val()
    });
};
