@extends("public.base")

@section("link")
    <link rel="stylesheet" href="{{asset("/css/style/style.css")}}">
    <script src="{{asset("/js/public/app.min.js")}}"></script>
    <link href="{{asset("/js/public/plugins/iCheck/minimal/_all.css")}}" rel="stylesheet">
    <script src="{{asset("/js/public/plugins/iCheck/icheck.min.js")}}"></script>
    <script src="{{asset("/js/public/modal.js")}}"></script>
    <!-- AdminLTE App -->
    <script src="{{asset("/js/public/app.min.js")}}"></script>
    <!-- radio checkbox 美化-->
    <link href="{{asset("/js/public/plugins/iCheck/minimal/_all.css")}}" rel="stylesheet">
    <script src="{{asset("/js/public/plugins/iCheck/icheck.min.js")}}"></script>

    <script src="{{asset("/js/organ/checkOrgan.js")}}"></script>
@endsection

@section('body')
<body>
<section class="content-header">
    <h1>
        企业信息
    </h1>
</section>
<div class="box box-cus box-cus-form">
    <!-- /.box-header -->
    <div class="box-body">
        <div class="alert alert-error" style="display:none;">
            <span>信息不能为空，请输入</span>
        </div>
        <form id="info_form" novalidate="novalidate">
            <input type="hidden" id="organId" value="{{$organId}}">
        </form>
    </div>
    <!-- /.box-body -->
    <div class="box-footer clearfix text-center">
        <!--<button type="button" class="btn btn-primary" id="submit"><i class="fa fa-save"></i>  编辑</button>-->
        <a href="javascript:void (0)" id="editMsg" class="btn btn-primary"><i class="fa fa-save"></i> 编辑</a>
        <a href="javascript:window.history.go(-1);" class="btn btn-default"><i class="fa fa-arrow-left"></i> 返回</a>
    </div>
</div>

</body>
@endsection

