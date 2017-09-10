@extends("public.base")

@section("link")
    <link rel="stylesheet" href="{{asset("/css/style/style.css")}}">
    <script src="{{asset("/js/public/app.min.js")}}"></script>
    <link href="{{asset("/js/public/plugins/iCheck/minimal/_all.css")}}" rel="stylesheet">
    <script src="{{asset("/js/public/plugins/iCheck/icheck.min.js")}}"></script>
    <script src="{{asset("/js/public/modal.js")}}"></script>
@endsection

@section("body")
<body class="hold-transition skin-blue sidebar-mini" style="padding: 0;">
    <div class="wrapper">
        <!-- sidebar: style can be found in sidebar.less -->
        <section class="sidebar">
            <!-- sidebar menu: : style can be found in sidebar.less -->
            <ul class="sidebar-menu">
                @foreach($menuList as $menu)
                    @if(count($menu->menu_two) != 0)
                        <li class="treeview">
                            <a href="{{$menu->module_url}}">
                                <span>{{$menu->module_name}}</span> <i class="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul class="treeview-menu">
                                @foreach($menu->menu_two as $child)
                                    <li>
                                        <a href="{{$child->module_url}}" target="myFrame">
                                            <i class="fa fa-circle-o"></i>
                                            {{$child->module_name}}
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </li>
                    @endif
                @endforeach
            </ul>
        </section>
    </div>
</body>
@endsection

@section("script")
    <script type="text/javascript">
        $(function() {

            var $firstMenu = $('.sidebar-menu').children('li');
            var menuIco = ["fa-automobile","fa-location-arrow","fa-credit-card","fa-search","fa-wrench","fa-users","fa-database","fa-edit","fa-gears"];

            $firstMenu.each(function(i) {
                var $this = $(this);
                $this.children('a').prepend('<i class="fa '+ menuIco[ i ] +'"></i> ');
            });
            $('.treeview-menu').find('a').click(function() {
                var li = $(this).parent();
                li.addClass('active');
                li.siblings().removeClass('active');
            })
        })
    </script>
@endsection