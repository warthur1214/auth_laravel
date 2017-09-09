@extends("public.base")

@section("js")
	<script src="{{asset("/js/login/login.js")}}"></script>
@endsection

@section("body")
	<body class="hold-transition login-page login">
	<div class="login-box">
		<div class="login-logo">
			<b>通用权限平台登录</b>
		</div>
		<div class="login-box-body">
			<p class="login-box-msg"></p>

			<div class="alert alert-error" style="display:none;">

				<span>请输入用户登录信息</span>

			</div>

			<form action="" method="post" id="login_form">
				{{ csrf_field() }}
				<div class="form-group has-feedback">
					<input type="text" class="form-control" placeholder="账号" name="account_name" id="account_name">
					<span class="glyphicon glyphicon-envelope form-control-feedback"></span>
				</div>
				<div class="form-group has-feedback">
					<input type="password" class="form-control" placeholder="密码" name="password" id="password">
					<span class="glyphicon glyphicon-lock form-control-feedback"></span>
				</div>
			</form>
			<button type="submit" class="btn btn-info btn-block" id="submit">登录</button>

		</div>
	</div>
	</body>
@endsection