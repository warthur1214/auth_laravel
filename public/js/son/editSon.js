
$(function(){
    // 获取默认机构信息
    var _id = location.href.split('id=')[1];
    AjaxJson('/Home/Son/getInfoById/id/' + _id, function( res ){
        $("#componyName").val(res.organ_name).attr("organ_id",res.organ_id);
        $("#componySimName").val(res.organ_short_name);
        $("#module_name").val(res.address);
        $("#contact_person").val(res.contact_person);
        $("#connect_tel").val(res.contact_phone);
        $("#connect_mail").val(res.contact_email);
        $("#comp_mark").val(res.comment);
        var defaultProID = res.prov_code;
        var defaultCityID = res.city_code;
        var compLv = res.organ_level;
        //默认选中 机构归属
        $("#hideVal").val(res.parent_organ_id);
        $("#organ_id").val(res.organ_parent);

        //默认选中 机构级别
        $.ajax({
            url:'/Home/Son/organLv',
            dataType:'json',
            type:'post',
            data:'',
            success:function (res) {
                var sortStr = '';
                sortStr += '<option value="">选择机构级别</option>';
                for(var i=0,len=res.length;i<len;i++){
                    if (compLv==res[i].organ_level_id){
                        sortStr +=	'<option selected value="'+res[i].level_id+'">'+res[i].level_name+'</option>';
                    }
                    else {
                        sortStr +=	'<option value="'+res[i].level_id+'">'+res[i].level_name+'</option>';
                    }
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
                    if(defaultProID == res[i].prov_code){
                        sortStr +=	'<option value="'+res[i].prov_code+'" selected>'+res[i].prov_name+'</option>';
                    }
                    else {
                        sortStr +=	'<option value="'+res[i].prov_code+'">'+res[i].prov_name+'</option>';
                    }
                }
                $("#province_id").html(sortStr);
                var proID = $("#province_id").children('option:selected').val();
                fillCity(proID);
            }
        });
    });

    //监听省份改变
    $('#province_id').change(function() {
        var proID = $(this).children('option:selected').val();
        fillCity(proID);
    });

});


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
            organ_short_name:{
                required:true
            },
            organ_level_id:{
                required:true
            },
            address:{
                required:true
            },
            prov_code:{
                required:true
            },
            city_code:{
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
        var hideData = "&organ_id=" + $("#componyName").attr("organ_id");
        if (form.valid() == false)
        {
            return false;
        }
        $.ajax({
            url : "/Home/Son/editSonAjax",
            type : "post",
            data : form.serialize()+hideData,
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
                    setTimeout(function(){window.location.href = 'sonList'},2000);
                }

            }
        });
    });
});

//填充city函数
function fillCity(prov){
    $.ajax({
        url:'/Home/Organ/getCityById/id/'+prov,
        dataType:'json',
        type:'post',
        data:'',
        success:function (res) {
            var sortStr = '';
            for(var i=0,len=res.length;i<len;i++){
                sortStr +=	'<option value="'+res[i].city_code+'">'+res[i].city_name+'</option>';
            }
            $("#city_id").html(sortStr);
        }
    });
}
CarGroupPopup({
    $textEl: $('#organ_id'),
    $valueEl: $('[name="parent_organ_id"]'),
    showGroup: false,
    url: '/Home/Son/sonParentList'
    // showAll: true //是否显示“全部”勾选项
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

