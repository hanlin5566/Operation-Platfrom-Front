define([ 'util/requestUtil', 'core/base','util/formatUtil',
		'util/sessionUtil', 'util/domUtil','util/dateUtil','mobiscroll', 'portal/main/config','widget/table', 'bootstrapTable'], function(
		requestUtil, Base,formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll,config,Table) {
	
	var decisionList = function() {
		
	};

	decisionList.prototype = new Base();
	
	var sessionId;
	
	decisionList.prototype.queryParams = function(params) {
        var me = this;
        var sessionIdParameter = sessionId;
        var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit : params.limit, // 页面大小
            offset : params.offset, // 页码
            sessionId : sessionIdParameter,
        };
        var taskId = me.find("#taskId").val();
        if(taskId.length > 0){
        	 temp.taskId =taskId;
        }
        var idCard = me.find("#idCard").val();
        if(idCard.length > 0){
        	temp.idCard = idCard;
        }

        var decisionType = me.find("#decisionType").val();
        if(decisionType.length > 0){
        	temp.decisionType = decisionType;
        }
        var startTime = me.find("#startTime").val();
        if(startTime.length > 0){
        	 temp.startTime = startTime;
        }
        var endTime = me.find("#endTime").val();
        if(endTime.length > 0){
            temp.endTime = endTime;
        }
        return temp;
    };
	
	// 页面初始化
	decisionList.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_decisionList");
		me.renderPage();
		me.bindEvent();
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
	};
	
	decisionList.prototype.renderPage = function() {
		var me=this;
        var operateEvents = {
            'click #decisionDetail': function (e, value, row, index) {
                me.moveTo('decisionDetail',{
                    'taskId' : row.taskId,
                    'decisionType' : row.decisionType
                });
            }
        };
		var url = "/AppOrder/getList"
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
								field: 'taskId',
								title: '订单号'
							},
					      {
					    	  field: 'idCard',
		                      title: '身份证'
					      },
							{
								field: 'timeUsed',
								title: '用时（s）'
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
					      {
					    	  field: 'id',
		                      title: '操作',
		                      events: operateEvents,
		                      formatter: function (value, row, index) {
                                  return '<a class="state-link" id="decisionDetail" varId="'+value+'">详情</a>' +
									  '<a class="state-link" id="reDecision" varId="'+value+'">重新决策</a>';
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
	decisionList.prototype.clearList = function() {
        var me = this;
    };
    
    
	// 重新显示
	decisionList.prototype.show = function() {
		
	};
	
	//页面点击
	decisionList.prototype.bindEvent = function() {
		var me = this;

		me.find("a[name='searchBtn']").click(function() {
			me.find('#tb_app_order_list').bootstrapTable('refresh', me.queryParams);
		});

	};
	
	// 页面隐藏
	decisionList.prototype.hide = function() {
		
	};

	return new decisionList();
});