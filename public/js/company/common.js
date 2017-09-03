/**
 * Created by Administrator on 2016/11/7.
 */
// 接口地址
var postAdd = {
    "companySort":"/Home/Company/companyType",//公司类型接口
    "cooperateSort":"/Home/Organ/cooperate",//合作类型接口
    "companyList":"/Home/Company/companyListAjax",//公司列表接口
    "delCompany":"/Home/Company/delCompany/id/",//删除公司接口
    "freazeCompany":"/Home/Company/companyAvailable/id/"//删除公司接口
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