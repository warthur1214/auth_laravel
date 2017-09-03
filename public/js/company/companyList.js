
$(function(){
	/*select公司类型*/
	$.ajax({
			url:'/Home/Organ/organType',
			dataType:'json',
			type:'post',
			data:'',
			success:function (res) {
				var sortStr = '';
				sortStr += '<option value="">全部</option>';
				for(var i=0,len=res.length;i<len;i++){
					sortStr +=	'<option value="'+res[i].type_id+'">'+res[i].type_name+'</option>';
				}
				$("#car_status").html(sortStr);
			}
    });
	/*合作类型*/
    $.ajax({
		url:'/Home/Organ/cooperate',
		dataType:'json',
		type:'post',
		data:'',
		success:function (res) {
			var sortStr = '';
			sortStr += '<option value="">全部</option>';
			for(var i=0,len=res.length;i<len;i++){
				sortStr +=	'<option value="'+res[i].cooperate_id+'">'+res[i].cooperate_type+'</option>';
			}
			$("#car_group").html(sortStr);
		},
		error:function () {
		}
	});



	/*获取公司列表*/
	mytable = InitDataTable({
		$el: $('#list'), //表格dom选择器
		url: "/Home/Company/CompanyListAjax", //表格列表数据
		ajaxdata: {},
		tableOpts: {
			data: {
				"organ_id": { title: "公司编号",orderable: true,"aaSorting": "desc"}, //不需要显示的列定义visible： false
				"organ_name": { title: "公司名称" }, //不需要排序的列定义 orderable: false
				"address": { title: "公司地址" },
				"parent_name": { title: "公司归属" } //初始化表格的时候，指定列的排序规则 "aaSorting": asc | desc

			},
			operate: {
				"title": '操作', //自定义操作列
				render: function(data, type, row, meta) {
                    var str = '';
                    var _selected = false;
                    if(row.is_available==1){
                        _selected = true;
                        str += '<a href="checkCompany?id='+row.organ_id+'" class="checkDefault btn btn-xs btn-info">查看</a> '
                            +'<span class="checkDefault btn btn-xs btn-danger dele" deleId="'+row.organ_id+'">删除</span> '
                            +'<select  class="btn btn-xs btn-success" onchange="selectItem(this)" freazeId="'+row.organ_id+'">'
                            +'<option class="btn btn-xs btn-default" selected="'+_selected+'" value="1">生效</option>'
                            +'<option class="btn btn-xs btn-default"  value="0">冻结</option>'
                            +'</select>';
                        return str;
                    }
                    else{
                        _selected = 'selected';
                        str += '<a href="checkCompany?id='+row.organ_id+'" class="checkDefault btn btn-xs btn-info">查看</a> '
                            +'<span class="checkDefault btn btn-xs btn-danger dele" deleId="'+row.organ_id+'">删除</span> '
                            +'<select  class="btn btn-xs btn-warning" onchange="selectItem(this)" freazeId="'+row.organ_id+'">'
                            +'<option class="btn btn-xs btn-default" value="1">生效</option>'
                            +'<option class="btn btn-xs btn-default" selected="'+_selected+'" value="0">冻结</option>'
                            +'</select>';
                        return str;
                    }
				}
			}
		}
	});


    //公司归属
    var $roleTree = $('#roleTree'); //企业或者机构树元素
    var $organId = $('#organ_id'); //企业或者机构id
    //初始化企业或者机构树实例
    var initOrgTree = InitRoleTree({
        $el: $roleTree,
        url: '/Home/Company/organList',
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
    $organId.bind('focus', function() { //点选角色归属
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
        console.log(paramsData);
        mytable.reloadByParam(paramsData);
    });
    /*删除公司*/
    $("#list").on("click",".dele",function () {
        var deleId = $(this).attr('deleId');
        var that = $(this);
        Confirm('确实要删除该公司吗?', function(flag) {
            if (flag) {
                $.ajax({
                    url:'/Home/Company/delCompany/id/'+deleId,
                    dataType:'json',
                    type:'post',
                    data:'',
                    success:function (res) {
                        if(res.status){
                            AlertHide("删除成功");
                            that.parent().parent().fadeOut(200);
                            mytable.refresh();
                        }
                        else{
                            AlertHide("删除失败！"+ res.msg);
                        }
                    }
                });
            };
        });

    });
});
/*冻结公司选项函数*/
function selectItem(evt){
    var statusNum = $(evt).children('option:selected').val();
    // alert(statusNum);
    var freazeId = $(evt).attr('freazeId');
    $.ajax({
        url:'/Home/Company/companyAvailable/id/'+freazeId,
        dataType:'json',
        type:'post',
        data:'is_available='+statusNum,
        success:function (res) {
            if(res.status){
                window.location.href=("companyList");
            }
            else{
                Alert("操作失败")
            }
        }
    });
}




