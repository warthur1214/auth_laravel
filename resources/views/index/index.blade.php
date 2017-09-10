@extends("public.base")

@section("link")
	<link rel="stylesheet" href="{{asset("/css/style/style.css")}}">
	<script src="{{asset("/js/public/app.min.js")}}"></script>
	<link href="{{asset("/js/public/plugins/iCheck/minimal/_all.css")}}" rel="stylesheet">
	<script src="{{asset("/js/public/plugins/iCheck/icheck.min.js")}}"></script>
	<script src="{{asset("/js/public/modal.js")}}"></script>
@endsection

@section("body")
	<body class="hold-transition skin-blue sidebar-mini" style="overflow: hidden;padding: 0;">
	<div class="wrapper">
		<header class="main-header">
			<!-- Logo -->
			<a href="/" class="logo" target="_top">
				<span class="logo-mini"><b>{{env("APP_TITLE")}}</b></span>
				<span class="logo-lg"><b>{{env("APP_TITLE")}}</b></span>
			</a>
			<nav class="navbar navbar-static-top">
				<div class="navbar-custom-menu">
					<ul class="nav navbar-nav">
						<li class="dropdown user user-menu">
							<a href="{{url('/loginOut')}}" target="_top">
								<i class="fa fa-user"></i>
								<span class="hidden-xs">退出</span>
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</header>
		<aside class="main-sidebar">
			<iframe src="{{url('/index/menu')}}" width="100%" height="100%" scrolling="no" frameborder="0"></iframe>
		</aside>
		<!-- Content Wrapper. Contains page content -->
		<div id="content" class="content-wrapper">
			<iframe src="{{url('/index/main')}}" width="100%" height="100%" name="myFrame" scrolling="no"
					frameborder="0"></iframe>
		</div>
		<div class="control-sidebar-bg"></div>
	</div>

	</body>
@endsection

@section("script")
	<script type="text/javascript">
        $(function () {
            var _h = $('#content').outerHeight();
            $('iframe').outerHeight(_h);
        });
	</script>
@endsection
