define([ 'util/requestUtil', 'core/base','util/formatUtil',
    'util/sessionUtil', 'util/domUtil','util/dateUtil','mobiscroll', 'portal/main/config','widget/table', 'bootstrapTable','../../../lib/transfer','../../../lib/bootstrap.min'], function(
    requestUtil, Base,formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll,config,Table) {

    var ruleExecu = function() {

    };

    ruleExecu.prototype = new Base();

    var sessionId;

    ruleExecu.prototype.queryParams = function(params) {
        var me = this;
        //var sessionIdParameter = sessionId;
        var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit : params.limit, // 页面大小
            offset : params.offset, // 页码
            ruleId : me.parameter.id,
        };
        var taskId = me.parameter.id;

        return temp;
    };

    // 页面初始化
    ruleExecu.prototype.create = function() {
        var me = this;
        me.renderMainContent("tpl_ruleExecu");
        me.renderPage();
        //me.bindEvent();
        me.find('#startTime').mobiscroll().calendar({
            theme: 'mobiscroll',
            lang: 'zh',
            display: 'bubble',
            buttons:[],
            showOnFocus: false,
            mode:'clickpick',
            dateFormat: 'yy-mm-dd hh:ii:ss',
            onDayChange : function(day, inst) {
                date = dateUtil.dateFormat(dateUtil.DATE_PATTERN, day.date);
                me.find("#startTime").val(date);
                inst.hide();
            }
        });
        me.find('#endTime').mobiscroll().calendar({
            theme: 'mobiscroll',
            lang: 'zh',
            display: 'bubble',
            buttons:[],
            showOnFocus: false,
            mode:'clickpick',
            dateFormat: 'yy-mm-dd  hh:ii:ss',
            onDayChange : function(day, inst) {
                date = dateUtil.dateFormat(dateUtil.DATE_PATTERN, day.date);
                me.find("#endTime").val(date);
                inst.hide();
            }
        });
        me.bindEvent();
    };

    ruleExecu.prototype.renderPage = function() {
        var me=this;
        var operateEvents = {
            'click #reDecisionPa': function (e, value, row, index) {
                
                    me.find('#myModal').modal('show');
                    me.find('#myModal').find(".modal-title").html("results详情");
                   me.find('#myModal').find(".modal-body").html(":"+JSON.stringify(row.results));

                /*me.moveTo('decisionDetail',{
                    'taskId' : row.taskId,
                    'logId' : row.logId,
                    'decisionType' : row.decisionType
                });*/
            }
        };
        var operateEvents2 = {
            'click #reDecisionQu': function (e, value, row, index) {
                me.find('#myModal').modal('show');
                me.find('#myModal').find(".modal-title").html("QueryParam详情");
                me.find('#myModal').find(".modal-body").html(":"+JSON.stringify(row.queryParams));
                /*me.moveTo('decisionDetail',{
                    'taskId' : row.taskId,
                    'logId' : row.logId,
                    'decisionType' : row.decisionType
                });*/
            }
        };
        //  /AppOrder/getList
        var url = "/antiFraud/ruleExecu"
        var $table = new Table(
            me.find("#tb_app_order_list"),
            {
                url: url,// 请求后台的URL（*）
                toolbar: me.find('#toolbar'), // 工具按钮用哪个容器
                queryParams: $.proxy(me.queryParams, this),//传递参数（*）
                sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）假数据用client
                uniqueId: "id", // 每一行的唯一标识，一般为主键列
                columns:[
                    {
                        field: 'interfaceParentType',
                       /* field: 'interfaceType',*/
                        title: '接口名称',
                        formatter: function (value, row, index) {
                            return   row.interfaceParentType+"-"+row.interfaceType;

                        }
                    },
                    {
                        field: 'results',
                        title: '返回结果',
                        events: operateEvents,
                        formatter: function (value, row, index) {
                            if(row.results.length>20) {
                                return '<a class="state-link"  id="reDecisionPa" varId="' + row.results + '">' + row.results.substr(0,20)+"..." + '</a>';
                            }else{
                                return '<a class="state-link"  id="reDecisionPa" varId="' + row.results + '">' + row.results + '</a>';
                            }
                        }
                    },
                    {
                        field: 'queryParams',
                        title: '查询参数',
                        events: operateEvents2,
                        formatter: function (value, row, index) {
                           if (row.queryParams.length>20) {
                               return '<a class="state-link" id="reDecisionQu" varId="' + row.queryParams + '">' + row.queryParams.substr(0,20)+"..." + '</a>';
                           }else {

                               return '<a class="state-link"  id="reDecisionQu" varId="' + row.queryParams + '">';
                           }
                        }
                    },
                    {
                        field: 'decisionType',
                        title: '决策状态',
                        formatter: function (value, row, index) {
                            if(value=="0") return "未知";
                            if(value=="1") return "不通过";
                            if(value=="2") return "通过";
                            if(value=="3") return "异常";
                        }
                    },

                ],

                responseHandler:function(res){
                    //在ajax获取到数据，渲染表格之前，修改数据源
                    //res.total = res.pageInfo.totalCount;
                    me.bindEvent();
                    res.rows = res.data;
                    return res;
                },
            }
        );


    };

    //清空数据
    ruleExecu.prototype.clearList = function() {
        var me = this;
    };


    // 重新显示
    ruleExecu.prototype.show = function() {

    };

    //页面点击
    ruleExecu.prototype.bindEvent = function() {
        var me = this;

        me.find("a[name='reDecision']").click(function() {
           
            //me.find('#tb_app_order_list').bootstrapTable('refresh', me.queryParams);
        });

    };

    // 页面隐藏
    ruleExecu.prototype.hide = function() {

    };

    return new ruleExecu();
});