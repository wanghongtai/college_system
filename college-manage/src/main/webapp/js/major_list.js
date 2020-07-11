var baseUrl = "http://localhost:8080/";
//定义全局模块
var table;
var layer;
var form;
var $;

layui.use(['table', 'layer', 'jquery'], function () {
    //初始化全局模块
    table = layui.table;
    layer = layui.layer;
    form = layui.form;
    $ = layui.jquery;
    //加载页面
    refreshTable();
    //监听工具条
    initTool();
    //初始化select框
    initSelect();
    //初始化事件
    initEvent();
});

//刷新分页table
function refreshTable() {
    var cid = $("#cidSelect_search").val();
    table.render({
        elem: '#demo'
        , height: 520
        , url: baseUrl + 'major/list' //数据接口
        , where: {cid: cid}
        , page: true //开启分页
        , toolbar: true //仅开启工具栏，不显示左侧模板
        , parseData: function (res) { //res 即为原始返回的数据
            var status = res.status == 200 ? 0 : res.status;
            return {
                "code": status, //解析接口状态
                "msg": res.msg, //解析提示文本
                "count": res.obj.total, //解析数据长度
                "data": res.obj.list //解析数据列表
            };
        }
        , cols: [[ //表头
            {field: 'mid', title: 'ID', width: 80, sort: true, fixed: 'left'}
            , {field: 'mname', title: '专业名称', width: 120}
            , {field: 'credit', title: '学分', width: 120, sort: true}
            , {field: 'lifeyear', title: '学制', width: 120}
            , {field: 'introduction', title: '专业简介', width: 177}
            , {field: 'cid', title: '学院Id', width: 120, sort: true}
            , {
                field: 'op',
                title: '操作',
                width: 200,
                toolbar: '#barDemo'
            }
        ]]
    });
}

//初始化工具条
function initTool() {
    table.on('tool(demo)', function (obj) {
        //注：tool 是工具条事件名，demo 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

        if (layEvent === 'detail') { //查看
            //do somehing
            showMajorInfo(data.mid);

        } else if (layEvent === 'del') { //删除
            layer.confirm('真的删除行么', function (index) {
                //向服务端发送删除指令
                deleteEditMajorInfo(data.mid);
                layer.close(index);
            });
        } else if (layEvent === 'edit') { //编辑
            //do something
            toEditMajorInfo(data.mid);
        }
    });
}
//查看专业信息
function showMajorInfo(majorId) {
    alert("查看专业id：" + majorId);

}
//编辑专业信息
function toEditMajorInfo(majorId) {
    alert("编辑专业id：" + majorId);
}
//删除专业信息
function deleteEditMajorInfo(majorId) {
    alert("删除专业id：" + majorId);

}
//初始化select框
function initSelect() {
    //获取学院列表
    $.ajax({
        type: "get",
        url: baseUrl + 'college/list',
        success: function (data) {
            console.log(data);
            if (data && data.obj) {
                var collegeList = data.obj;
                //更新select
                $("#cidSelect").html("<option value=\"0\">请选择学院</option>");
                for (var i = 0; i < collegeList.length; i++) {
                    var college = collegeList[i];
                    $("#cidSelect").append("<option value='" + college.cid + "'>" + college.cname + "</option>")
                }

                $("#cidSelect_search").html("<option value=\"0\">全部</option>");
                for (var i = 0; i < collegeList.length; i++) {
                    var college = collegeList[i];
                    $("#cidSelect_search").append("<option value='" + college.cid + "'>" + college.cname + "</option>")
                }
                //更新view， lay-filter="addForm" 所在容器内的全部 select 状态
                // form.render('select', 'majorListForm');
                // form.render('select', 'majorAddForm');
                form.render();//动态渲染
            }
        }
    });
}


//初始化事件
function initEvent() {
    //查询
    var $ = layui.jquery;
    $("#searchBtn").click(function () {
        refreshTable();
    })

    //弹出添加框
    var addIndex = 0;
    $("#toAddMajorBtn").click(function () {
        addIndex = layer.open({
            type: 1,    //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            area: '500px',
            title: "",
            content: $('#majorAddForm') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });
    })
    //提交添加表单
    form.on('submit(addMajorBtn)', function (data) {
        layer.msg(JSON.stringify(data.field));//弹出json格式所有表单的值
        // var mname = data.field.mname;
        // var credit = data.field.credit;
        var cid = data.field.cid;
        if (cid=="0") {
            layer.msg('请选择学院名称', {icon: 2});
            return false;
        }
        $.ajax({
            type: "post",
            url: baseUrl + 'major/add',
            data: $("#majorAddForm").serialize(),
            success: function (data) {
                if (data && data.status == 200) {
                    layer.msg("添加成功！");
                    layer.close(addIndex);//关闭指定层
                } else {
                    layer.msg("添加失败！");
                    //layer.close(addIndex);//关闭指定层
                }
            },
            fail: function (data) {
                alert("添加失败")
            }
        });
        return false;//不提交表单
    });

    /*$("#majorAddForm").click(function () {
     //校验字段省略......
     //操作dom提示错误信息
     console.log(form.verify());
     $.ajax({
     type: "post",
     url: baseUrl + 'major/add',
     data: $("#addMajorBtn").serialize(),
     success: function (data) {
     if(data && data.status==200) {
     layer.msg("添加成功！");
     layer.close(addIndex);//关闭指定层
     }else{
     layer.msg("添加失败！");
     //layer.close(addIndex);//关闭指定层
     }
     },
     fail: function (data) {
     alert("添加失败")
     }
     });
     })*/
}












