$(function() {
    var editData;
    var validateForm = InitValidateForm($('#info_form'));
    var _id = location.href.split('id=')[1];
    var chkGroupVm = new Vue({
        el: '#chkGroup'
    });

    InitOrgIdTree({
        $inputId: $('#belonged_organ_id'),
        $inputName: $('[name="belonged_organ_id"]'),
        $tree: $('#roleTree'),
        onClickTreeNode: function( $el ){ 
            var id = $el.parent('li').attr('data-id'); 
            
            loadRoleList( {belonged_organ_id: id});
        } 
    }); 

    AjaxJson('/Home/Account/getInfoById/id/' + _id, function(res) {
        validateForm.assignForm(res);  
        loadRoleList(res);
        editData = res;

        if( !res.belonged_organ_id || res.belonged_organ_id == "0" ){
            $('#belonged_organ_id').val('全部');
        };
        
        var roleTreeInterval = setInterval(function(){ 

            if( $('#roleTree').html() != ''){  
                var $treenode = $('#roleTree').find('li').filter('[data-id="'+ res.belonged_organ_id +'"]').children('.tree-node');

                if( $treenode.length > 0 ){ 
                    $('#belonged_organ_id').val( $treenode.text() );
                    $treenode.addClass('active'); 
                }; 
                 
                clearInterval( roleTreeInterval );
            }; 
        }, 200);
    });  


    $('#submit').bind('click', function() {
        if (validateForm.validnew()) {
            var postdata = validateForm.serializeObject();  
            
            postdata.password = ( postdata.password == editData.password ? editData.password : newHexMd5( postdata.password ) );  
            postdata.account_id = _id; 
            
            if( typeof(postdata.role_id) != 'string'){
                postdata.role_id = postdata.role_id.join(',')
            };
            
            AjaxJson('/Home/Account/editAccountAjax', postdata, function(res) {
                if (res.status == "1") {

                    AlertHide(res.msg, function() {

                        HrefTo("/Home/Account/accountList");
                    });
                } else {
                    AlertHide(res.msg);
                };
            });
        };
    });

    function loadRoleList(data) { 

        var organId = data.belonged_organ_id ? data.belonged_organ_id : data.organ_parent_id;
        AjaxJson('/Home/OrganAccount/getRoleById/id/' + organId, function(res) {
            if (res) {
                chkGroupVm.$data = {
                    items: res
                };   
                $('#chkGroup').removeClass('hide');
                setTimeout(function(){
                    initRoleId( data, 'role_id' ); 
                },0);
            };
        });
    };

    /*初始化角色*/
    function initRoleId(data, roleKey) {
        var roleIdData = data[roleKey]; 
        if (roleIdData) {
            for (var i = 0, l = roleIdData.length; i < l; i++) {
                var _d = roleIdData[i];
                $('[name="' + roleKey + '"][value="' + _d + '"]').prop('checked', 'checked'); 
            };
        };
    }
});
