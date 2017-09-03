
$(function(){
    //获取机构列表
    mytable = InitDataTable({
        $el: $('#list'), //表格dom选择器
        url: "/Home/Son/sonListAjax", //表格列表数据
        ajaxdata: {},
        tableOpts: {
            data: {
                "organ_id": { title: "机构编号",orderable: true,"aaSorting": "desc"},
                "organ_short_name": { title: "机构简称" },
                "organ_name": { title: "机构名称" },
                "organ_area": { title: "机构地址" },
                "level_name": { title: "机构级别" },
                "organ_parent": { title: "机构归属" }
            },
            operate: {
                "title": '操作', //自定义操作列
                render: function(data, type, row, meta) {
                    var str = '';
                    var _selected = false;
                    if(row.is_available==1){
                        _selected = true;
                        str += '<a href="checkSon?id='+row.organ_id+'" class="checkDefault btn btn-xs btn-info">查看</a> '
                            +'<span class="checkDefault btn btn-xs btn-danger dele" deleId="'+row.organ_id+'">删除</span> '
                            +'<select  class="btn btn-xs btn-success isFrozen" onchange="selectItem(this)" freazeId="'+row.organ_id+'">'
                            +'<option class="btn btn-xs btn-default" selected="'+_selected+'" value="1">生效</option>'
                            +'<option class="btn btn-xs btn-default"  value="0">冻结</option>'
                            +'</select>';
                        return str;
                    }
                    else{
                        _selected = 'selected';
                        str += '<a href="checkSon?id='+row.organ_id+'" class="checkDefault btn btn-xs btn-info">查看</a> '
                            +'<span class="checkDefault btn btn-xs btn-danger dele" deleId="'+row.organ_id+'">删除</span> '
                            +'<select  class="btn btn-xs btn-warning isFrozen" onchange="selectItem(this)" freazeId="'+row.organ_id+'">'
                            +'<option class="btn btn-xs btn-default" value="1">生效</option>'
                            +'<option class="btn btn-xs btn-default" selected="'+_selected+'" value="0">冻结</option>'
                            +'</select>';
                        return str;
                    }


                }
            }
        }
    });
    // 机构级别
    $.ajax({
        url:'/Home/Son/organLv',
        dataType:'json',
        type:'post',
        data:'',
        success:function (res) {
            var sortStr = '';
            sortStr += '<option value="">全部</option>';
            for(var i=0,len=res.length;i<len;i++){
                sortStr +=	'<option value="'+res[i].level_id+'">'+res[i].level_name+'</option>';
            }
            $("#organ_lev").html(sortStr);
        }
    });


    var $roleTree = $('#roleTree'); //企业或者机构树元素
    var $organId = $('#organ_id'); //企业或者机构id

    var initOrgTree = InitRoleTree({//初始化企业或者机构树实例
        $el: $roleTree,
        url: '/Home/Son/sonParentList',
        textKey: 'organ_name',
        valKey: 'organ_id',
        childrenKey: 'son',
        className: 'tree-list-default'
    });
    initOrgTree.onClickNode = function($el) { //点击企业或机构树节点
        var id = $el.parent('li').attr('data-id');
        $('[name="p_id"]').val(id);
        $organId.val($el.text());
        $roleTree.addClass('hide');

    };
    $organId.bind('focus', function() { //点选归属
        $roleTree.removeClass('hide');
    }).bind('click', function(e) {
        e.stopPropagation();
    });
    $(document).bind('click', function() {
        $roleTree.addClass('hide');
    });

    /*点击搜索*/
    var status = false;
    $('#searchBtn').bind('click', function(){
        status = true;
        var _data = $('#submit_form').serialize();
        data= decodeURIComponent(_data,true);
        var paramsData = conveterParamsToJson(data);
        mytable.reloadByParam(paramsData);
    });
    //删除机构
    $("#list").on("click",".dele",function () {
        var deleId = $(this).attr('deleId');
        var that = $(this);
        Confirm('确实要删除该机构吗?', function(flag) {
            if (flag) {
                $.ajax({
                    url:'/Home/Son/delSon/id/'+deleId,
                    dataType:'json',
                    type:'post',
                    data:'',
                    success:function (res) {
                        if(res.status){
                            AlertHide("删除成功")
                            that.parent().parent().fadeOut(200);
                            mytable.refresh();

                        }
                        else{
                            AlertHide(res.msg);
                        }
                    }
                });
            };
        });

    });
    //冻结机构
    $('.isFrozen').on("change",function () {

        var statusNum;
        if($(this).text()=="生效")
        {
            statusNum = 1;

        }
        if($(this).text()=="冻结")
        {
            statusNum = 0;
        }
        var freazeId = $(this).attr('freazeId');
        $.ajax({
            url:'/Home/Son/sonAvailable/id/'+freazeId,
            dataType:'json',
            type:'post',
            data:'is_available='+statusNum,
            success:function (res) {
                if(res.status){
                    Alert("删除成功")
                    that.parent().parent().fadeOut(200);
                }
                else{
                    Alert("删除失败")
                }
            }
        });
    });

});
//冻结机构函数
function selectItem(evt){
    var statusNum = $(evt).children('option:selected').val();
    var freazeId = $(evt).attr('freazeId');
    $.ajax({
        url:'/Home/Son/sonAvailable/id/'+freazeId,
        dataType:'json',
        type:'post',
        data:'is_available='+statusNum,
        success:function (res) {
            if(res.status){
                window.location.href=("sonList");
            }
            else{
                Alert("操作失败")
            }
        }
    });
}
//表单序列化后转成对象
function conveterParamsToJson(paramsAndValues) {
    var jsonObj = {};
    var param = paramsAndValues.split("&");
    for ( var i = 0; param != null && i < param.length; i++) {
        var para = param[i].split("=");
        jsonObj[para[0]] = para[1];
    }
    return jsonObj;
}

