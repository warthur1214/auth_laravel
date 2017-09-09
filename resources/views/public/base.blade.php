<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>通用企业及权限管理平台</title>
	<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
	<!-- Bootstrap 3.3.6 -->
	<link rel="stylesheet" href="{{asset("/css/public/bootstrap.min.css")}}">
	<!-- Theme style -->
	<link rel="stylesheet" href="{{asset("/css/public/AdminLTE.min.css")}}">
	<link rel="stylesheet" href="{{asset("/css/public/bootstrap.min.btn.css")}}">

	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
	<script src="{{asset("/js/public/plugins/jQuery/jQuery-2.2.0.min.js")}}"></script>
	<script src="{{asset("/js/public/plugins/jQuery/jquery.validate.min.js")}}"></script>
	<script src="{{asset("/js/public/plugins/jQuery/additional-methods.min.js")}}"></script>
	<script src="{{asset("/js/public/md5-min.js")}}"></script>
	<script src="{{asset("/js/public/public.js")}}"></script>
	<!-- Bootstrap 3.3.6 -->
	<script src="{{asset("/js/public/bootstrap.min.js")}}"></script>

	@yield("js")

	@yield("style")
</head>

@yield("body")

</html>

<script type="text/javascript">
    var APP_URL = "{{env('APP_URL')}}";
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
</script>
@yield("script")