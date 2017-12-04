define(['util/requestUtil', 'core/base', 'util/formatUtil',
    'util/sessionUtil', 'util/domUtil', 'util/dateUtil', 'mobiscroll', 'portal/main/config','widget/table', 'bootstrapTable'], function (requestUtil, Base, formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll,config,Table) {

    var decisionDetail = function () {

    };
    decisionDetail.prototype = new Base();

    var sessionId;

    decisionDetail.prototype.queryParams = function () {
        var me = this;
        var sessionIdParameter = sessionId;
        var temp = { //
            sessionId: sessionIdParameter,
        };
        return temp;
    };

    // 页面初始化
    decisionDetail.prototype.create = function () {
        var me = this;
        me.renderMainContent("tpl_decisionDetail");
        me.renderPage();
        me.bindEvent();
    };

    decisionDetail.prototype.renderPage = function () {
        var me = this;
        var operateEvents = {
            'click #QueryDetail': function (e, value, row, index) {
                me.moveTo('staticQueryDetail',{
                    'id' : value
                });
            }
        };
        var url = "/QueryLog/getQueryList"
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
    decisionDetail.prototype.clearList = function () {
        var me = this;
    };


    // 重新显示
    decisionDetail.prototype.show = function () {

    };

    //页面点击
    decisionDetail.prototype.bindEvent = function () {
        var me = this;

        me.find("a[name='searchBtn']").click(function () {
            me.renderPage()
        });

    };

    // 页面隐藏
    decisionDetail.prototype.hide = function () {

    };

    return new decisionDetail();
});