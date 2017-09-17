$(function () {
    /*select企业类型*/
    $.ajax({
        url: APP_URL + '/organ/organType',
        type: 'get',
        success: function (res) {
            var sortStr = '';
            if (res.status === 0) {
                sortStr += '<option value="">全部</option>';
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sortStr += '<option value="' + res.data[i].organ_type_id + '">' + res.data[i].organ_type_name +
                        '</option>';
                }
            }
            $("#organ_type_id").html(sortStr);
        }
    });
    /*合作类型*/
    $.ajax({
        url: APP_URL + '/organ/cooperate',
        type: 'get',
        success: function (res) {
            var sortStr = '';
            if (res.status === 0) {
                sortStr += '<option value="">全部</option>';
                for (var i = 0, len = res.data.length; i < len; i++) {
                    sortStr += '<option value="' + res.data[i].coop_type_id + '">' + res.data[i].coop_type + '</option>';
                }
            }
            $("#coop_type_id").html(sortStr);
        },
        error: function () {
        }
    });
    /*获取企业列表*/
    mytable = InitDataTable({
        $el: $('#list'), //表格dom选择器
        url: APP_URL + "/organ/organListAjax", //表格列表数据
        tableOpts: {
            data: {
                "organ_id": {title: "企业编号", orderable: true, "aaSorting": "desc"}, //不需要显示的列定义visible： false
                "organ_short_name": {title: "企业简称"}, //不需要排序的列定义 orderable: false
                "organ_name": {title: "企业全称"},
                "organ_type_name": {title: "企业类型"}, //初始化表格的时候，指定列的排序规则 "aaSorting": asc | desc
                "coop_type_id": {title: "合作类型"}
            },
            operate: {
                "title": '操作', //自定义操作列
                render: function (data, type, row, meta) {
                    var str = '';
                    var _selected = false;
                    if (row.is_available === 1) {
                        _selected = true;
                        str += '<a href="'+ APP_URL +'/organ/checkOrgan/' + row.organ_id + '" class="btn btn-xs btn-info">查看</a> '
                            + '<span class="btn btn-xs btn-danger dele" deleId="' + row.organ_id + '">删除</span> '
                            + '<select  class="btn btn-xs btn-success" onchange="selectItem(this)" freazeId="' + row.organ_id + '">'
                            + '<option class="btn btn-xs btn-default" selected="' + _selected + '" value="1">生效</option>'
                            + '<option class="btn btn-xs btn-default"  value="0">冻结</option>'
                            + '</select>';
                        return str;
                    } else {
                        _selected = 'selected';
                        str += '<a href="' + APP_URL + '/organ/checkOrgan/' + row.organ_id + '" class="btn btn-xs btn-info">查看</a> '
                            + '<span class="btn btn-xs btn-danger dele" deleId="' + row.organ_id + '">删除</span> '
                            + '<select  class="btn btn-xs btn-warning" onchange="selectItem(this)" freazeId="' + row.organ_id + '">'
                            + '<option class="btn btn-xs btn-default" value="1">生效</option>'
                            + '<option class="btn btn-xs btn-default" selected="' + _selected + '" value="0">冻结</option>'
                            + '</select>';
                        return str;
                    }
                }
            }
        }
    });

    /*点击搜索*/
    var status = false;
    $('#searchBtn').bind('click', function () {
        status = true;
        var _data = $('#submit_form').serialize();
        data = decodeURIComponent(_data, true);
        var paramsData = conveterParamsToJson(data);
        mytable.reloadByParam(paramsData);
    });
    /*删除企业*/
    $("#list").on("click", ".dele", function () {
        var deleId = $(this).attr('deleId');
        var that = $(this);
        Confirm('确实要删除该企业吗?', function (flag) {
            if (flag) {
                $.ajax({
                    url: APP_URL + '/organ/deleteOrgan/' + deleId,
                    dataType: 'json',
                    type: 'post',
                    data: '',
                    success: function (res) {
                        if (res.status) {
                            AlertHide("删除成功");
                            that.parent().parent().fadeOut(200);
                            mytable.refresh();
                        }
                        else {
                            AlertHide("删除失败！" + res.msg);
                        }
                    }
                });
            }
            ;
        });

    });
});

/*冻结企业选项函数*/
function selectItem(evt) {
    var statusNum = $(evt).children('option:selected').val();
    // alert(statusNum);
    var freazeId = $(evt).attr('freazeId');
    $.ajax({
        url: APP_URL + '/organ/organAvailable',
        dataType: 'json',
        type: 'post',
        data: {is_available:statusNum, organ_id: freazeId},
        success: function (res) {
            if (res.status) {
                window.location.href = ("organList");
            }
            else {
                Alert("操作失败")
            }
        }
    });
}

//表单序列化后转成对象
function conveterParamsToJson(paramsAndValues) {
    var jsonObj = {};
    var param = paramsAndValues.split("&");
    for (var i = 0; param != null && i < param.length; i++) {
        var para = param[i].split("=");
        jsonObj[para[0]] = para[1];
    }
    return jsonObj;
}


