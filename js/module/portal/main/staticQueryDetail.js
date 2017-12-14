define(['util/requestUtil', 'core/base', 'util/formatUtil',
    'util/sessionUtil', 'util/domUtil', 'util/dateUtil', 'mobiscroll', 'portal/main/config','widget/table',
    'bootstrapTable','../../../lib/transfer','../../../lib/bootstrap.min'], function (requestUtil, Base, formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll,config,Table) {

    var staticQueryDetail = function () {


    };
    staticQueryDetail.prototype = new Base();

    var sessionId;

    staticQueryDetail.prototype.queryParams = function (params) {
        var me = this;
        var sessionIdParameter = sessionId;
        var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit : params.limit, // 页面大小
            offset : params.offset, // 页码
            sessionId : sessionIdParameter,
        };

        temp.orderNo = me.parameter.taskId;
        return temp;
    };

    // 页面初始化
    staticQueryDetail.prototype.create = function () {
        var me = this;
        //alert("ert");
        me.renderMainContent("tpl_staticQueryList");
        me.renderPage();
        me.bindEvent();
    };

    staticQueryDetail.prototype.renderPage = function () {

        var me = this;
       // alert("*"+me.parameter.id)
        //决策详情  /antiFraud/test
        var url = "/antiFraud/intefDetail/"+me.parameter.id;
        /**
         *  var url ="/manageUser/role/"+me.parameter.roleId
         requestUtil.get(url,null).then(function(result) {
         */
        requestUtil.get(url,null).then(function(result) {
            if (result.code == 200) {
                //alert(result.data.state);
                var interfaceRecordEntity = result.data;
                //alert("*-*:"+interfaceRecordEntity.results);
                //'<a class="state-link" id="reDecision" varId="'+value+'">重新决策</a>'; +"..>>更多"
                me.find("#queryParam").text(interfaceRecordEntity.queryParams.substring(0, 20));
                //me.find("#queryParam").text(interfaceRecordEntity.queryParams.substring(0, interfaceRecordEntity.queryParams.length()-20>0?20:interfaceRecordEntity.queryParams.length()-1));
                $("#hidMsg").val(interfaceRecordEntity.queryParams);
                me.find("#buleBtn").text("..>>更多");
                me.find("#beginTime").text(interfaceRecordEntity.queryTime);
                me.find("#endTime").text(interfaceRecordEntity.returnTime);
                var staMsg="";
                if(interfaceRecordEntity.state=="0") {
                    staMsg="异常";
                }
                if(interfaceRecordEntity.state=="1"){
                    staMsg="异常";
                }
                if(interfaceRecordEntity.state=="2"){
                    staMsg="正常有数据";
                }
                if(interfaceRecordEntity.state=="3") {
                    staMsg="正常无数据";
                }
                if(interfaceRecordEntity.state=="4"){
                    staMsg="历史数据";
                }

                me.find("#state").text(staMsg);
                me.find("#results").text(interfaceRecordEntity.results);
                $("#resultMsg").val(JSON.stringify(interfaceRecordEntity.results));
                //me.find("#resultBtn").text("..>>更多");


            } else {
                alert("fail");
                alert(result.data.message);
            }
        });

        var operateEvents = {
            'click #QueryDetail': function (e, value, row, index) {
                me.moveTo('staticQueryDetail',{
                    'id' : value
                });
            }
        };
         url = "/QueryLog/getQueryList"
        var $table = new Table(
            me.find("#tb_query_list"),
            {
                url: url,// 请求后台的URL（*）
                queryParams: $.proxy(me.queryParams, this),//传递参数（*）
                sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）假数据用client
                uniqueId: "id", // 每一行的唯一标识，一般为主键列
                columns:[
                    {
                        field: 'interfaceType',
                        title: '接口名称'
                    },
                    {
                        field: 'queryTime',
                        title: '访问时间'
                    },
                    {
                        field: 'timeUsed',
                        title: '用时（ms）'
                    },
                    {
                        field: 'state',
                        title: '访问状态',
                        formatter: function (value, row, index) {
                            if(value=="0") return "异常";
                            if(value=="1") return "异常";
                            if(value=="2") return "正常有数据";
                            if(value=="3") return "正常无数据";
                            if(value=="4") return "历史数据";
                        }
                    },
                    {
                        field: 'id',
                        title: '操作',
                        events: operateEvents,
                        formatter: function (value, row, index) {
                            return '<a class="state-link" id="QueryDetail" varId="'+value+'">详情</a>';
                        }
                    },
                ],
                responseHandler:function(res){
                    //在ajax获取到数据，渲染表格之前，修改数据源
                    res.total = res.pageInfo.totalCount;
                    res.rows = res.data;
                    return res;
                },
            }
        );
    };

    //清空数据
    staticQueryDetail.prototype.clearList = function () {
        var me = this;
    };


    // 重新显示
    staticQueryDetail.prototype.show = function () {

    };

    //页面点击
    staticQueryDetail.prototype.bindEvent = function () {
        var me = this;

        me.find("a[name='searchBtn']").click(function () {
            me.renderPage()
        });

        $("#buleBtn").click(function () {
            //alert("rr");
            me.find('#myModal').modal('show');
            me.find('#myModal').find(".modal-title").html("queryParams详情");
            me.find('#myModal').find(".modal-body").html(":"+JSON.stringify($("#hidMsg").val()));
        });

    };

    // 页面隐藏
    staticQueryDetail.prototype.hide = function () {

    };

    return new staticQueryDetail();
});