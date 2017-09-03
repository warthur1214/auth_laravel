/*!  
 * ================
 * 电子围栏区域绘制插件
 * @Author  Yugl   
 * @param centerpoint 地图中心点
 * ======
 * @Method clearAll() //清空地图上的遮罩
 * ======
 * @return[Object] drawingManagerCus 绘制中心点的对象
 */
function drawingManagerCus(centerpoint, mapId) {
    var map = new BMap.Map(mapId);
    var poi = centerpoint;
    var overlays = [];
    var drawingManager;
    var styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    };

    var _drawingManagerCus = {
        _overlayPoint: [],
        _typeArry: ["rectangle", "circle", "polygon", "boundary"],
        _init: function() {
            var me = this;

            map.centerAndZoom(poi, 16);
            map.enableScrollWheelZoom();
            me.initDrawing();
            me.bindEvent();

            me.drawingManager = drawingManager;
        },
        /* 初始化绘图插件
         **/
        initDrawing: function() {
            var me = this;
            //实例化鼠标绘制工具
            drawingManager = new BMapLib.DrawingManager(map, {
                isOpen: true, //是否开启绘制模式
                enableDrawingTool: false, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                },
                circleOptions: styleOptions, //圆的样式
                polylineOptions: styleOptions, //线的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            });
        },
        /* 事件处理器 
         */
        bindEvent: function() {
            var me = this;

            drawingManager.addEventListener('overlaycomplete', me.overlaycomplete);

            $(document).keyup(function(e) {

                if (e.keyCode == 46 && overlays.length > 0) {
                    me.clearAll();
                };
            });
        },
        /* 添加鼠标绘制工具监听事件，用于获取绘制结果  
         * @param e:被绘制的覆盖物对象
         */
        overlaycomplete: function(e) {
 
            drawingManager.close();
            overlays.push(e.overlay);

            _drawingManagerCus.setOverlayPoint(e.overlay);
        },
        /* 清理所有覆盖物并开启非行政区域的绘制
         */
        clearAll: function() {
            var me = this;
            me.clearAllOverlay();

            drawingManager.close();
            drawingManager.open();
        },
        /** 初始化渲染遮罩层数据
         * @param type[string]: 遮罩类型;"rectangle | circle | polygon | boundary"
         * @param data: 遮罩数据
         */
        initDrawOverlay: function( type, data ) {
            var me = this;
            var _sdata = data;
            var _edata;

            switch ( type ) {

                case me._typeArry[1]: //圆形  
                    _edata = JSON.parse( _sdata );
                    me.initDrawCircle( _edata );
                    break;
                case me._typeArry[3]: //行政区域 
                    _edata = _sdata;
                    me.drawingBoundary( _edata );
                    break;
                default:
                    _edata = JSON.parse( _sdata );
                    me.initDrawPolygon( _edata );
                    break;
            };
            me.setOverlayPoint( _edata ); 
        },
        /** 初始化绘制圆形遮罩
         * @param 圆形遮罩数据
         */
        initDrawCircle: function(data) { 
            var circle = new BMap.Circle( data[0], data[1], styleOptions); //创建圆
            map.addOverlay( circle );  
        },
        /** 初始化绘制矩形|自定义图形遮罩
         * @param 矩形|自定义图形遮罩数据
         */
        initDrawPolygon: function( data ) {
            var polygon = new BMap.Polygon( data, styleOptions ); //创建多边形
            map.addOverlay( polygon );  
        },
        /* 清理覆盖物
         */
        clearAllOverlay: function() {
            var me = this;
            for (var i = 0; i < overlays.length; i++) {
                map.removeOverlay(overlays[i]);
            };
            overlays.length = 0;
            map.clearOverlays(); //清除地图覆盖物  
        },
        /* 设置地图中心点
         * @param poi: 中心点名称或者坐标
         */
        setCenter: function(poi) {
            map.centerAndZoom(poi, 16);
        },
        /* 绘制行政区域
         * @param val: 行政区域名称
         */
        drawingBoundary: function(val) {
            var me = this;
            var bdary = new BMap.Boundary();

            me._drawingMode = me._typeArry[3];
            bdary.get(val, function(rs) { //获取行政区域 
                map.clearOverlays(); //清除地图覆盖物  
                var count = rs.boundaries.length; //行政区域的点有多少个 
                if (count === 0) {
                    alert('未能获取当前输入行政区域');
                    return;
                };
                var pointArray = [];
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(rs.boundaries[i], styleOptions); //建立多边形覆盖物
                    map.addOverlay(ply); //添加覆盖物
                    pointArray = pointArray.concat(ply.getPath());
                };

                me.setOverlayPoint(val);
                map.setViewport(pointArray); //调整视野            
            });
            drawingManager.close();
        },
        /** 返回当前绘制的遮罩数据
         * @return arry
         */
        getDrawingData: function() {
            var me = this;
            var _sdata = me.getOverlayPoint();
            var _edata = "";

            if( _sdata.length > 0 || !$.isEmptyObject( _sdata ) ){
                switch (me.getDrawingMode()) {

                    case me._typeArry[1]: //圆形 
                        _edata = _sdata.point ? [_sdata.point, _sdata.wa] : _sdata;
                        _edata = JSON.stringify( _edata );
                        break;
                    case me._typeArry[3]: //行政区域
                        _edata = _sdata; 
                        break;
                    default:
                        _edata = _sdata.getPath ? _sdata.getPath() : _sdata;
                        _edata = JSON.stringify( _edata );
                        break;
                };
            };
            
            return _edata;
        },
        /** 设置遮罩数据点坐标
         * @param arry: 点坐标数组 
         */
        setOverlayPoint: function(arry) { 
            this._overlayPoint = arry;
        },
        /** 获取遮罩数据点坐标
         * @return arry: 点坐标数组 
         */
        getOverlayPoint: function() { 
            return this._overlayPoint;
        },
        /** 设置当前绘图模式
         * @param val[string]: 绘图模式
         */
        setDrawingMode: function( val ) { 
            this._drawingMode = val;
            drawingManager.setDrawingMode(val);
        },
        /** 读取当前绘图模式
         * @return String: 绘图模式
         */
        getDrawingMode: function() {
            return this._drawingMode;
        }
    };
    _drawingManagerCus._init();
    return _drawingManagerCus;
};
