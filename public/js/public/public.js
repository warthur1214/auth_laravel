/*! 
 * (c) 2016 Guilin Yu 
 */


/*=========ajax请求方法============================
 *
 */
function AjaxJson(url, postdata, call) {
    var $ajaxHtml = $('<div class="modal fade in modal-ajax" style="display: block;"><i class="fa fa-refresh fa-spin"></i></div>'); 
    $ajaxHtml.appendTo( top.document.body ); 
    if (typeof postdata == "function") {
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            success: function(res) {
                $ajaxHtml.remove();
                if (postdata) {
                    postdata(res);
                };
            },
            error: function(res) {
                $ajaxHtml.remove();
                Alert('请求失败');
            }
        });
    } else {
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: postdata,
            success: function(res) {
                $ajaxHtml.remove();
                if (call) {
                    call(res);
                };
            },
            error: function(res) {
                $ajaxHtml.remove();
                Alert('请求失败');
            }
        });
    };

};

/*======================================
 * 返回指定时间对象的字符串
 * @param date: 指定日期对象
 * @return yyyy-mm-dd 
 **/
function getDateString( date ){
    var sdate = date;
    var _y = sdate.getFullYear(); 
    var _m = _month = ((sdate.getMonth() + 1).toString().length == 1 ? ("0" + (sdate.getMonth() + 1)) : (sdate.getMonth() + 1)); 
    var _d = (sdate.getDate().toString().length == 1 ? "0" + sdate.getDate() : sdate.getDate());

    return _y + '-' + _m + '-' + _d;
};

/*======== 页面跳转*/
function HrefTo(url) {
    location.href = url;
}; 

/*==================================================
 * 返回搜索表单值
 */
function getSearchData() {
    var _formdata = $('#submit_form').serializeArray();
    var _postdata = {};

    for (var i = 0, l = _formdata.length; i < l; i++) {
        var _d = _formdata[i];
        var _name = _d.name;
        _postdata[_name] = _d.value;
    }; 
    return _postdata;
};

/*给指定字符串进行md5加密*/
function newHexMd5( val ){
    return hex_md5( val + 'md5' );
};