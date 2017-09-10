@extends("public.base")

@section("link")

	<link rel="stylesheet" href="{{asset("/css/style/style.css")}}">
	<script src="{{asset("/js/public/app.min.js")}}"></script>
	<link href="{{asset("/js/public/plugins/iCheck/minimal/_all.css")}}" rel="stylesheet">
	<script src="{{asset("/js/public/plugins/iCheck/icheck.min.js")}}"></script>
	<script src="{{asset("/js/public/modal.js")}}"></script>
@endsection

@section("body")
	<body class="hold-transition sidebar-mini">
	<div class="wrapper">
		<!-- Content Header (Page header) -->
		<section class="content-header">
			<h1>
				欢迎<strong>{{$display_name}}</strong>，现在是{{$date}}
			</h1>
			<ol class="breadcrumb">
			</ol>
		</section>

		<!-- Main content -->
		<section class="content">
			<!-- Small boxes (Stat box) -->
			<div class="row">
				<div class="col-lg-3 col-xs-6">
					<!-- small box -->
				</div>
				<!-- /.row -->
			</div>
		</section>
	</div>
	</body>

@endsection
