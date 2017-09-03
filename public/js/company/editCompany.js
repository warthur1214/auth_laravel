
$(function(){
    // 获取默认企业信息
    var _id = location.href.split('id=')[1];
    AjaxJson('/Home/Company/getInfoById/id/' + _id, function( res ){
        $("#componyName").val(res.organ_name);
        $("#componySimName").val(res.abbreviated_name);
        $("#module_name").val(res.address);
        $("#contact_person").val(res.contact_person);
        $("#connect_tel").val(res.contact_phone);
        $("#connect_mail").val(res.contact_email);
        $("#SDK_ID").val(res.organ_channel_id);
        $("#SDK_psd").val(res.organ_channel_secret);
        $("#comp_mark").val(res.comment);
        var coArray = res.cooperate_id;
        var defaultProID = res.prov_code;

        var compSort = res.parent_organ_id;

        // 获取默认省份
        $.ajax({
            url:'/Home/Organ/province',
            dataType:'json',
            type:'post',
            data:'',
            success:function (res) {
                var sortStr = '';
                sortStr += '<option value="">省份</option>';
                for(var i=0,len=res.length;i<len;i++){
                    if(defaultProID == res[i].p_id){
                        sortStr +=	'<option value="'+res[i].p_id+'" selected>'+res[i].province+'</option>';
                    }
                    else {
                        sortStr +=	'<option value="'+res[i].p_id+'">'+res[i].province+'</option>';
                    }
                }
                $("#province_id").html(sortStr);
                var proID = $("#province_id").children('option:selected').val();
                fillCity(proID);
            }
        });
        //默认选中 合作类型
        $.ajax({
            url:'/Home/Organ/cooperate',
            dataType:'json',
            type:'post',
            data:'',
            success:function (res) {
                var sortStr = '';
                for(var i=0,len=res.length;i<len;i++){
                    if(coArray.indexOf(res[i].cooperate_id) == -1){
                        sortStr += '<label><input name="checkbox_name" value="'+res[i].cooperate_id+'" type="checkbox">'+ res[i].cooperate_type+'</label>';
                    }
                    else {
                        sortStr += '<label><input name="checkbox_name" value="'+res[i].cooperate_id+'" checked type="checkbox">'+ res[i].cooperate_type+'</label>';
                    }
                }
                $("#cooperation").html(sortStr);
            }
        });
        //公司归属默认选中
        $.ajax({
            url:'/Home/Company/organList',
            dataType:'json',
            type:'post',
            data:'',
            success:function (res) {
                var sortStr = '';
                // sortStr += '<option value="">选择公司归属</option>';
                for(var i=0,len=res.length;i<len;i++){
                    if (compSort==res[i].organ_id){
                        sortStr +=	'<option selected="selected" value="'+res[i].organ_id+'">'+res[i].organ_name+'</option>';
                    }
                    else {
                        sortStr +=	'<option value="'+res[i].organ_id+'">'+res[i].organ_name+'</option>';
                    }
                }
                $("#organ_id").html(sortStr);

            }
        });
    });



    //监听省份改变
    $('#province_id').change(function() {
        var proID = $(this).children('option:selected').val();
        fillCity(proID);
    });
    //填充city
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
                address:{
                    required:true
                },
                organ_type:
                {
                    required: true
                },
                prov_code:
                {
                    required: true
                },
                city_code:
                {
                    required: true
                },
                checkbox_name:
                {
                    required: true
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
                url : "/Home/Company/editCompanyAjax",
                type : "post",
                data : serializeBox('cooperate_type')+'&'+form.serialize()+'&organ_id='+_id,
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
                        setTimeout(function(){window.location.href = 'companyList'},1000);
                    }

                }
            });
        });
    });
});