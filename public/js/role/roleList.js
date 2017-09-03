$(function() {

    var mytable;
    var _treeHeight = $('html,body').height() - $('.content-header').height() - 85;
    var initOrgTree = InitRoleTree( {
        $el: $('#roleTree'),
        url: '/Home/Son/sonParentList',
        textKey: 'organ_name',
        valKey: 'organ_id',
        childrenKey: 'son',
        className: 'tree-list-cus'
    });

    initOrgTree.onClickNode = function( $el ){  
        var id = $el.parent('li').attr('data-id'); 
        mytable.reloadByParam({ "organ_id": id });
    };
    $('#roleTree').css({
        height: _treeHeight,
        overflow: 'auto'
    });
    mytable = InitDataTable({
        $el: $('#myTable'), //表格dom选择器
        url: "/Home/Role/roleListAjax", //表格列表数据 
        ajaxdata: {},
        tableOpts: {
            data: {
                "role_name": { title: "角色名称" },
                "desc": { title: "角色描述" },
                "organ_name": { title: "角色归属" }
            },
            operate: {
                "title": '操作', //自定义操作列 
                render: function(data, type, row, meta) {
                    var _data = JSON.stringify(row);
                    var _text = ('<a href="/Home/Role/editRole?id=' + row.role_id + '" class="btn btn-xs btn-info">编辑</a> ' +
                        '<span data-id="' + row.role_id + '" onclick="deleteRecord( this )" class="btn btn-xs btn-danger">删除</span> ');

                    return _text;
                }
            }
        }
    });
});

/*删除该条记录*/
function deleteRecord(el) {
    
    var $el = $(el);

    Confirm('确定删除该条记录吗？', function(res) {
        if (res) {
            AjaxJson('/Home/Role/delRole/id/' + $el.attr('data-id'), function(res) {
                AlertHide(res.msg);

                if (res.status == 1) {
                    $el.parents('tr').remove();
                    mytable.refresh();

                };
            });
        };
    });
};
