/**
 * Created by Administrator on 2016/10/28.
 */
/**
 * Created by Administrator on 2016/10/26.
 */
$(function(){
    var _id = location.href.split('id=')[1];
    var htmlStr = '';
    AjaxJson('/Home/Son/getInfoById/id/' + _id, function( res ){
        htmlStr += '<table class="table table-bordered">'
            +'<tbody>'
            +'<tr>'
            +'<td class="title" colspan="6"><i class="fa fa fa-info-circle"></i> 机构信息</td>'
            +'</tr>'
            +'<tr>'
            +'<th>机构全称</th>'
            +'<td>'+res.organ_name+'</td>'
            +'<th>机构简称</th>'
            +'<td>'+res.organ_short_name+'</td>'
            +'<th>机构归属</th>'
            +'<td>'+res.organ_parent+'</td>'
            +'</tr>'
            +'<tr>'
            +'<th>机构级别</th>'
            +'<td>'+res.level_name+'</td>'
            +'<th>机构地址</th>'
            +'<td>'+res.prov_name+res.city_name+res.address+'</td>'
            +'<th>联系人</th>'
            +'<td>'+res.contact_person+'</td>'
            +'</tr>'
            +'<tr>'
            +'<th>联系电话</th>'
            +'<td>'+res.contact_phone+'</td>'
            +'<th>联系邮箱</th>'
            +'<td>'+res.contact_email+'</td>'
            +'</tr>'
            +'<tr>'
            +'</tr>'
            +'<tr>'
            +'<th>机构信息备注</th>'
            +'<td colspan="5">'+res.comment+'</td>'
            +'</tr>'
            +'</tbody>'
            +'</table>';
        $("#info_form").html(htmlStr);
    });
    $("#editMsg").click(function () {
        window.location.href = 'editSon?id='+_id
    })
});