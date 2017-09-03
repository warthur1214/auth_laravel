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
                sortStr +=	'<option value="'+res[i].prov_code+'" >'+res[i].prov_name+'</option>';
            }
            $("#province_id").html(sortStr);
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
                    sortStr +=	'<option value="'+res[i].city_code+'">'+res[i].city_name+'</option>';
                }
                $("#city_id").html(sortStr);
            }
        });
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
                organ_short_name:{
                    required:true
                },
                organ_level_id:{
                    required:true
                },
                parent_organ_id:{
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
            if (form.valid() == false)
            {
                return false;
            }
            $.ajax({
                url : "/Home/Son/addSonAjax",
                type : "post",
                data : form.serialize(),
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
                        setTimeout(function(){window.location.href = 'sonList'},1500);
                    }

                }
            });
        });
    });
});

CarGroupPopup({
    $textEl: $('#organ_id'),
    $valueEl: $('[name="parent_organ_id"]'),
    showGroup: false,
    url: '/Home/Son/sonParentList'
    // showAll: true //是否显示“全部”勾选项
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
