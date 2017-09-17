/**
 * Created by Administrator on 2016/10/26.
 */
$(function(){
    var _id = $("#organId").val();
    var htmlStr = '';
    AjaxJson(APP_URL + '/organ/getInfoById/' + _id, function( res ){
        if (res.status === 0) {
            htmlStr += '<table class="table table-bordered">'
                +'<tbody>'
                +'<tr>'
                +'<td class="title" colspan="6"><i class="fa fa fa-info-circle"></i> 企业信息</td>'
                +'</tr>'
                +'<tr>'
                +'<th>企业名称</th>'
                +'<td>'+res.data.organ_name+'</td>'
                +'<th>企业简称</th>'
                +'<td>'+res.data.organ_short_name+'</td>'
                +'<th>企业类型</th>'
                +'<td>'+res.data.organ_type_name+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>企业地址</th>'
                +'<td>'+res.data.prov_name + res.data.city_name + res.data.address+'</td>'
                +'<th>联系人</th>'
                +'<td>'+res.data.contact_person+'</td>'
                +'<th>联系电话</th>'
                +'<td>'+res.data.contact_phone+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>联系邮箱</th>'
                +'<td>'+res.data.contact_email+'</td>'
                +'<th>合作类型</th>'
                +'<td>'+res.data.organ_type_name+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>channel_id</th>'
                +'<td>'+res.data.channel_id+'</td>'
                +'<th>channel_secret</th>'
                +'<td>'+res.data.channel_secret+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>企业信息备注</th>'
                +'<td colspan="5">'+res.data.comment+'</td>'
                +'</tr>'
                +'</tbody>'
                +'</table>';
        }
        $("#info_form").html(htmlStr);
    });
    $("#editMsg").click(function () {
        window.location.href = APP_URL + '/organ/editOrgan/'+_id
    })
});