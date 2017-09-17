<!DOCTYPE html>
<html>

<head>
    <include file="Index:meta" />
    <include file="Index:css" />

</head>

<body>
<section class="content-header">
    <h1>
        编辑企业
    </h1>
</section>
<div class="box box-cus box-cus-form">
    <div class="alert alert-error" style="display:none;">
        <span>信息不能为空，请输入</span>
    </div>
    <div class="box-body">
        <form role="form-horizontal" id="info_form" novalidate="novalidate">
            <table class="table table-bordered">
                <tbody>
                <tr>
                    <td class="title" colspan="6"><i class="fa fa fa-info-circle"></i> 编辑企业信息</td>
                </tr>
                <tr class="form-group">
                    <th class="col-md-2"><span class="text-red">*</span> 企业全称</th>
                    <td class="col-md-4">
                        <div class="form-group"><input type="text" class="form-control" id="componyName" name="organ_name" placeholder="企业全称"></div>
                    </td>
                    <th class="col-md-2"><span class="text-red">*</span> 企业简称</th>
                    <td class="col-md-4">
                        <div class="form-group"><input type="text" class="form-control" id="componySimName" name="organ_short_name" placeholder="企业简称"></div>
                    </td>
                    <th class="col-md-2"><span class="text-red">*</span> 企业类型</th>
                    <td class="col-md-4">
                        <div class="form-group">
                            <select class="form-control" id="componySort" name="organ_type_id">
                                <option value="">选择企业类型</option>
                            </select>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th><span class="text-red">*</span> 企业地址</th>
                    <td class="form-inline">
                        <select class="form-control" id="province_id" name="prov_code">
                            <option value="">省份</option>
                        </select>
                        <select class="form-control" id="city_id" name="city_code">
                            <option value="">城市</option>
                        </select>
                    </td>
                    <th><span class="text-red">*</span> 详细地址</th>
                    <td><input type="text" class="form-control" id="module_name" name="address" placeholder="详细地址"></td>
                </tr>
                <tr class="form-group">
                    <th class="col-md-2">联系人</th>
                    <td class="col-md-4">
                        <div class="form-group"><input type="text" class="form-control" id="contact_person" name="contact_person" placeholder="联系人"></div>
                    </td>
                    <th class="col-md-2">联系电话</th>
                    <td class="col-md-4">
                        <div class="form-group"><input type="text" class="form-control" id="connect_tel" name="contact_phone" placeholder="联系电话"></div>
                    </td>
                    <th class="col-md-2">联系邮箱</th>
                    <td class="col-md-4">
                        <div class="form-group"><input type="text" class="form-control" id="connect_mail" name="contact_email" placeholder="联系邮箱"></div>
                    </td>
                </tr>
                <tr class="form-group">
                    <th><span class="text-red">*</span> 合作类型</th>
                    <td colspan="6">
                        <div class="checkbox" id="coop_type_id">

                        </div>
                    </td>
                </tr>
                <tr class="form-group">
                    <th class="col-md-2">channel_id</th>
                    <td class="col-md-4">
                        <div class="form-group"><input type="text" class="form-control" id="SDK_ID" name="channel_id" placeholder=""></div>
                    </td>
                    <th class="col-md-2">channel_secret</th>
                    <td class="col-md-4">
                        <div class="form-group"><input type="text" class="form-control" id="SDK_psd" name="channel_secret" placeholder=""></div>
                    </td>
                </tr>
                <tr class="form-group">
                    <th>企业备注</th>
                    <td colspan="6">
                        <div class="form-group"><textarea class="form-control" id="comp_mark" name="comment" placeholder="输入企业备注信息"></textarea></div>
                    </td>
                </tr>

                </tbody>
            </table>
        </form>
    </div>
    <div class="box-footer clearfix text-center">
        <button type="submit" class="btn btn-info" id="submit"><i class="fa fa-save"></i> 确认</button>
        <a href="organList" class="btn btn-default"><i class="fa fa-arrow-left"></i> 返回</a>
    </div>
</div>
<!-- /.box -->
<!-- jQuery 2.2.0 -->
<script src="/Public/plugins/jQuery/jQuery-2.2.0.min.js"></script>
<script src="/Public/plugins/jQuery/jquery-ui.js"></script>
<!-- Bootstrap 3.3.6 -->
<script src="/Public/js/public/bootstrap.min.js"></script>
<!-- AdminLTE App -->
<script src="/Public/js/public/app.min.js"></script>

<!-- radio checkbox 美化-->
<link href="/Public/plugins/iCheck/minimal/_all.css" rel="stylesheet">
<script src="/Public/plugins/iCheck/icheck.min.js"></script>

<!-- modal.js 封装过的提示框组件 -->
<script src="/Public/js/public/modal.js"></script>

<script src="/Public/js/public/public.js"></script>


<!-- DataTables -->
<script src="/Public/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="/Public/plugins/datatables/dataTables.bootstrap.min.js"></script>
<script src="/Public/plugins/jQuery/jquery.validate.min.js"></script>
<script src="/Public/plugins/jQuery/additional-methods.min.js"></script>
<!-- iCheck 1.0.1 -->
<script src="/Public/plugins/iCheck/icheck.min.js"></script>
<script src="/Public/js/organ/editOrgan.js"></script>

<script type="text/javascript">
    $(function() {
        //Flat red color scheme for iCheck
        $('input[type="radio"].flat-red').iCheck({
            radioClass: 'iradio_flat-green'
        });
        $('#system_id').change(function()
        {
            getModuleByVal($(this).val());
        })
    })
    function getModuleByVal(val)
    {
        $.ajax({
            'url':'/Home/Module/getModuleById/id/'+val,
            'dataType':'json',
            'type':'post',
            success:function(result)
            {
                var html = "<option value=''>请选择</option>";
                if(result.length > 0)
                {
                    for (var i = 0; i < result.length; i++)
                    {
                        html += "<option value='"+result[i]['module_id']+"'>"+result[i]['module_name']+"</option>";
                    };
                }
                $('#module_parent_id').html(html);
            }
        })
    }
</script>


</body>
</html>

