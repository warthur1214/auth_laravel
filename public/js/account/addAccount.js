$(function() {
	var validateForm = InitValidateForm($('#info_form'));  
    var chkGroupVm = new Vue({
        el: '#chkGroup'
    });  

    $('#submit').bind('click', function(){ 
    	if(validateForm.validnew()){
    		var postdata = validateForm.serializeObject();
            postdata.password = newHexMd5( postdata.password );  
            
            if( typeof(postdata.role_id) != 'string'){
                postdata.role_id = postdata.role_id.join(',')
            };
    		AjaxJson('/Home/Account/addAccountAjax', postdata, function( res ){ 
    			if( res.status == "1"){
    				
    				AlertHide( res.msg, function(){

    					HrefTo("/Home/Account/accountList");
    				});
    			}else{
    				AlertHide( res.msg );
    			}; 
    		});
    	}; 
    });

    InitOrgIdTree({
        $inputId: $('#organ_id'),
        $inputName: $('[name="organ_id"]'),
        $tree: $('#roleTree'),
        onClickTreeNode: function( $el ){ 
            var id = $el.parent('li').attr('data-id'); 
            loadRoleList( id );
        } 
    });  


    function loadRoleList(organId) { 
        AjaxJson('/Home/OrganAccount/getRoleById/id/' + organId, function(res) { 
            if (res) {
                chkGroupVm.$data = {
                	items: res
                };
                $('#chkGroup').removeClass('hide');
            };
        });
    }; 
});
