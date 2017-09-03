$(document).ready(function() {

    //删除模块
    function delMoudle() {
        //处理删除用户事件
        var id = $(this).attr('index');
        var success = $('.alert_page_success');
        var error = $('.alert_page_error');

        if (confirm('确实要删除该模块吗?')) {
            $.ajax({
                url: '/Home/Module/delModule/id/' + id,
                type: "post",
                dataType: "json",
                success: function(result) {
                    if (result.status == 0) {
                        success.hide();
                        //设置msg
                        error.text(result.msg);
                        error.show();
                        setTimeout(function() { error.hide(); }, 3000);
                        return;
                    }
                    error.hide();
                    success.text(result.msg);
                    success.show();

                    //重新加载列表
                    table.ajax.reload();

                    setTimeout(function() {
                        success.hide();
                        error.hide();
                    }, 3000);
                }
            });
        }
    }
    //修改排序
    function getOrder() {
        if (isNaN($(this).html()) || $(this).html().length > 3) {
            alert("您输入有误，请输入最多三位有效数字");
            //重新加载列表
            table.ajax.reload();
            return;
        }
        var id = $(this).attr('index');
        $.ajax({
            url: '/Home/Module/editOther/id/' + id,
            type: "post",
            dataType: "json",
            data: { 'sort_no': $(this).html() },
            success: function(result) {
                if (result.status == 1) {
                    //重新加载列表
                    table.ajax.reload();
                }
            }
        });
    }
    //datatables 初始化
    var table = $('#example1').DataTable({
        "columnDefs": [
            { "searchable": false, "orderable": false, "targets": [0] },
            { "searchable": false, "orderable": false, "targets": [1] },
            { "searchable": false, "orderable": false, "targets": [2] },
            { "searchable": false, "orderable": false, "targets": [3] },
            { "searchable": false, "orderable": true, "targets": [4] },
            { "searchable": false, "orderable": false, "targets": [5] },
            { "searchable": false, "orderable": false, "targets": [6] }
        ],
        "paging": true,
        "lengthChange": false,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "ajax": {
            "url": "/Home/Module/moduleListAjax",
            "type": "POST"
        },
        "order": [
            [4, "desc"]
        ],
        "columns": [{
                "data": "module_id",
                "createdCell": function(td, cellData, rowData, row, col) {
                    var html = "<a data-toggle='collapse' href='#' class='parent'><i class='fa fa-plus-square'></i></a>";
                    $(td).html(html);
                    $(td).find('.parent').click(function() {
                        if ($(this).find('i').hasClass('fa-plus-square')) {
                            $(this).find('i').removeClass('fa-plus-square').addClass('fa-minus-square');
                            $.ajax({
                                url: '/Home/Module/getSonM/id/' + rowData.module_id,
                                type: "post",
                                dataType: "json",
                                success: function(result) {
                                    var data = result.data;

                                    var shtml = '<tr class="table-box-td"><td colspan="7"><table>';
                                    for (var i = 0; i < data.length; i++) {
                                        var show = (data[i]['is_visible'] == 0) ? '否' : '是';
                                        shtml += '<tr><th>模块名:</th><td>' + data[i]['module_name'] + '</td>';
                                        shtml += '<th>模块地址:</th><td>' + data[i]['module_url'] + '</td>';
                                        shtml += '<th>关键字:</th><td>' + data[i]['matched_key'] + '</td>';
                                        shtml += '<th>排序:</th><td><span contenteditable="true" class="col-xs-9 m_order" index="' + data[i]['module_id'] + '">' + data[i]['sort_no'] + '</td>';
                                        shtml += '<th>是否在列表显示:</th><td>' + show + '</td>';
                                        shtml += '<th><a href="/Home/Module/editModule/id/' + data[i]['module_id'] + '" class="btn btn-xs btn-info">修改</a></th> <th> <a href="javascript:;" class="btn btn-xs btn-danger deleteById" id="deleteById" index="' + data[i]['module_id'] + '">删除</a></th></tr>';

                                    }
                                    shtml += '</table></td></tr>';
                                    $(td).parent('tr').after(shtml);
                                }
                            });
                        } else {
                            $(this).find('i').removeClass('fa-minus-square').addClass('fa-plus-square');
                            $(td).parent('tr').next('.table-box-td').remove();
                        }
                    })
                }
            },
            { "data": "module_name" },
            { "data": "module_url" },
            { "data": "matched_key" }, {
                "data": "sort_no",
                "createdCell": function(td, cellData, rowData, row, col) {
                    var html = "<span contenteditable='true' class='col-xs-9 m_order' index='" + rowData.module_id + "'>" + rowData.sort_no + "</span>";
                    $(td).html(html);
                }
            }, {
                "data": "is_visible",
                "createdCell": function(td, cellData, rowData, row, col) {
                    var show = (rowData.is_visible == 0) ? '否' : '是';
                    $(td).html(show);
                }
            }, {
                "data": null,
                "createdCell": function(td, cellData, rowData, row, col) {
                    var html = $(td).html("<a href='/Home/Module/editModule/id/" + rowData.module_id + "' class='btn btn-xs btn-info'>修改</a> <a href='javascript:;' class='btn btn-xs btn-danger deleteById' id='deleteById' index='" + rowData.module_id + "'>删除</a>");
                }
            }
        ],
        "lengthMenu": [
            [50],
            [50] // change per page values here
        ],
        "language": {
            "emptyTable": "暂无数据",
            "lengthMenu": "_MENU_ 条/每页",
            "loadingRecords": "Please wait - loading...",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "paginate": {
                "first": "首页",
                "last": "末页",
                "next": "下一页",
                "previous": "上一页"
            }
        }
    });
    $("#platform_id").change(function() {
        var _val = $(this).val(); 
        reloadData({
            "platform_id": _val
        });
    });
    /*重新加载table*/
    function reloadData(param) {
        table.settings()[0].ajax.data = param;
        table.ajax.reload();
    };
    $('#example1').on('click', '#deleteById', delMoudle);
    $('#example1').on('blur', 'span.m_order', getOrder);
});
