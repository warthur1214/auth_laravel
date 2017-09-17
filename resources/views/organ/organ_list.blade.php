@extends("public.base")

@section("link")
	<link rel="stylesheet" href="{{asset("/css/style/style.css")}}">
	<script src="{{asset("/js/public/app.min.js")}}"></script>
	<link href="{{asset("/js/public/plugins/iCheck/minimal/_all.css")}}" rel="stylesheet">
	<script src="{{asset("/js/public/plugins/iCheck/icheck.min.js")}}"></script>
	<script src="{{asset("/js/public/modal.js")}}"></script>
	<script src="{{asset("/js/organ/organList.js")}}"></script>

	<link rel="stylesheet" href="{{asset("/js/public/plugins/datatables/dataTables.bootstrap.css")}}">
	<script src="{{asset("/js/public/plugins/datatables/jquery.dataTables.min.js")}}"></script>
	<script src="{{asset("/js/public/dataTableCus.js")}}"></script>
@endsection

@section("body")
	<body>
	<section class="content-header">
        <span class="pull-right">
        <a href="{{url("organ/addOrgan")}}" class="btn btn-sm btn-info"> <i class="fa fa-plus"></i> 添加企业</a>
      </span>
		<h1>
			企业列表
		</h1>
	</section>
	<div class="box marginB0">
		<form class="form-horizontal padding10" role="form" id="submit_form">
			<div class="form-group">
				<label for="name" class="col-sm-1 control-label">企业名称</label>
				<div class="col-sm-3">
					<input type="text" class="form-control" id="organ_name" name="organ_name" placeholder="请输入企业简称或者全称">
				</div>
				<label for="organ_type_id" class="col-sm-1 control-label">企业类型</label>
				<div class="col-sm-3">
					<select class="form-control" id="organ_type_id" name="organ_type_id">

					</select>
				</div>
				<label for="coop_type_id" class="col-sm-1 control-label">合作类型</label>
				<div class="col-sm-3">
					<select class="form-control" id="coop_type_id" name="coop_type_id">

					</select>
				</div>
			</div>
			<div class="text-center">
				<a href="javascript:;" id="searchBtn" class="btn btn-sm btn-info selectInfo"><i
							class="fa fa-search"></i> 搜索</a>
			</div>
		</form>
		<div class="box-body">
			<table id="list" class="table table-bordered table-hover">
				<thead>
				<tr>
					<th>企业编号</th>
					<th>企业简称</th>
					<th>企业全称</th>
					<th>企业类型</th>
					<th>合作类型</th>
					<th>操作</th>
				</tr>
				</thead>
				<tbody id="infoList">

				</tbody>
			</table>
			<div class="box-footer clearfix page">

			</div>
		</div>
	</div>
	</body>

@endsection
