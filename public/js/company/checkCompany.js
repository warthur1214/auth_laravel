/**
 * Created by Administrator on 2016/10/26.
 */
$(function(){
    var _id = location.href.split('id=')[1];
    var htmlStr = '';
    AjaxJson('/Home/Company/getInfoById/id/' + _id, function( res ){
        htmlStr += '<table class="table table-bordered">'
                +'<tbody>'
                +'<tr>'
                +'<td class="title" colspan="6"><i class="fa fa fa-info-circle"></i> 公司信息</td>'
                +'</tr>'
                +'<tr>'
                +'<th>公司名称</th>'
                +'<td>'+res.organ_name+'</td>'
                +'<th>公司简称</th>'
                +'<td>'+res.abbreviated_name+'</td>'
                +'<th>公司归属</th>'
                +'<td>'+res.organ_parent+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>公司地址</th>'
                +'<td>'+res.province+res.city+res.address+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>联系人</th>'
                +'<td>'+res.contact_person+'</td>'
                +'<th>联系电话</th>'
                +'<td>'+res.contact_phone+'</td>'
                +'<th>联系邮箱</th>'
                +'<td>'+res.contact_email+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>合作类型</th>'
                +'<td>'+res.cooperate_type+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>channel_id</th>'
                +'<td>'+res.organ_channel_id+'</td>'
                +'<th>channel_secret</th>'
                +'<td>'+res.organ_channel_secret+'</td>'
                +'</tr>'
                +'<tr>'
                +'<th>公司信息备注</th>'
                +'<td colspan="5">'+res.comment+'</td>'
                +'</tr>'
                +'</tbody>'
                +'</table>';
        $("#info_form").html(htmlStr);
    });
    $("#editMsg").click(function () {
        window.location.href = 'editCompany?id='+_id
    })
});