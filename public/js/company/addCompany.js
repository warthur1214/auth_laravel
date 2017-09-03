$(function(){
    //获取机构类型
    $.ajax({
        url:'/Home/Son/organLv',
        dataType:'json',
        type:'post',
        data:'',
        success:function (res) {
            var sortStr = '';
            sortStr += '<option value="">选择机构类型</option>';
            for(var i=0,len=res.length;i<len;i++){
                sortStr +=	'<option value="'+res[i].level_id+'">'+res[i].level_name+'</option>';
            }
            $("#componyLv").html(sortStr);
        }
    });


    // 获取省份
    $.ajax({
        url:'/Home/Organ/province',
        dataType:'json',
        type:'post',
        data:'',
        success:function (res) {
            var sortStr = '';
            sortStr += '<option value="">省份</option>';
            for(var i=0,len=res.length;i<len;i++){
                sortStr +=	'<option value="'+res[i].p_id+'" >'+res[i].province+'</option>';
            }
            $("#province_id").html(sortStr);
        }
    });
    var $roleTree = $('#roleTree'); //企业或者机构树元素
    var $organId = $('#organ_id'); //企业或者机构id
    /*//初始化企业或者机构树实例
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
        $('[name="parent_organ_id"]').val(id);
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
    });*/
    //公司归属默认选中
    $.ajax({
        url:'/Home/Company/organList',
        dataType:'json',
        type:'post',
        data:'',
        success:function (res) {
            var sortStr = '';
            sortStr += '<option value="">选择公司归属</option>';
            for(var i=0,len=res.length;i<len;i++){
                    sortStr +=	'<option value="'+res[i].organ_id+'">'+res[i].organ_name+'</option>';
            }
            $("#organ_id").html(sortStr);

        }
    });
    //监听省份改变
    $('#province_id').change(function() {
        var proID = $(this).children('option:selected').val();
        fillCity(proID);
    });
    //获取city
    function fillCity(prov){
        $.ajax({
            url:'/Home/Organ/getCityById/id/'+prov,
            dataType:'json',
            type:'post',
            data:'',
            success:function (res) {
                var sortStr = '';
                for(var i=0,len=res.length;i<len;i++){
                    sortStr +=	'<option value="'+res[i].c_id+'">'+res[i].city+'</option>';
                }
                $("#city_id").html(sortStr);
            }
        });
    }

    //合作类型
    $.ajax({
        url:'/Home/Organ/cooperate',
        dataType:'json',
        type:'post',
        data:'',
        success:function (res) {
            var sortStr = '';
            for(var i=0,len=res.length;i<len;i++){
                sortStr += '<label><input name="checkbox_name" value="'+res[i].cooperate_id+'" type="checkbox">'+ res[i].cooperate_type+'</label>';
            }
            $("#cooperation").html(sortStr);
        }
    });
    //序列化checkbox
    function serializeBox(key){
        var obj = $("#cooperation :checked");
        check_val = [];
        for(k in obj){
            if(obj[k].checked)
                check_val.push(obj[k].value);
        }
        var dataStr = '';
        dataStr = key+'='+check_val.join(',');
        return dataStr;
    }
    // 提交数据
    $(function() {
        var form = $('#info_form');
        form.find('.form-control').not('[nowrap="nowrap"]').wrap('<div class="form-group"></div>');
        form.validate({
            errorElement: 'label', //default input error message container
            errorClass: 'text-red', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules:
            {
                organ_name:{
                    required:true
                },
                abbreviated_name:{
                    required:true
                },
                prov_code:{
                    required:true
                },
                parent_organ_id:{
                    required:true
                },
                city_code:{
                    required:true
                },
                checkbox_name:{
                    required:true
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                $('.alert-error').show();
            },
            highlight: function (element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                $('.alert-error').hide();
                label.prev('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.addClass('text-red').insertAfter(element.closest('.form-group'));
            },
            submitHandler: function (form) {
                $('.alert-error').hide();
                $('.alert-success').show();
            }
        });

        $('#submit').click(function()
        {
            if (form.valid() == false)
            {
                return false;
            }
            $.ajax({
                url : "/Home/Company/addCompanyAjax",
                type : "post",
                data : serializeBox('cooperate_type')+'&'+form.serialize(),
                dataType :"json",
                success: function(result)
                {
                    $('.alert').html(result.msg);
                    if(result.status == 0)
                    {
                        $('.alert').show();
                    }
                    else
                    {
                        $('.alert').show().removeClass('alert-error').addClass('alert-success');
                        setTimeout(function(){window.location.href = 'companyList'},1500);
                    }

                }
            });
        });
    });
});
//冻结机构
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
