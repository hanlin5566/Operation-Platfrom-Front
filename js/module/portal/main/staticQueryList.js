define([ 'util/requestUtil', 'core/base','util/formatUtil',
		'util/sessionUtil', 'util/domUtil','util/dateUtil','mobiscroll', 'portal/main/config','widget/table', 'bootstrapTable'], function(
		requestUtil, Base,formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll,config,Table) {
	
	var staticQueryList = function() {
		
	};

	staticQueryList.prototype = new Base();
	
	var sessionId;
	
	staticQueryList.prototype.queryParams = function(params) {
        var me = this;
        var sessionIdParameter = sessionId;
        var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit : params.limit, // 页面大小
            offset : params.offset, // 页码
            sessionId : sessionIdParameter,
        };
        var orderNo = me.find("#orderNo").val();
        if(orderNo.length > 0){
        	 temp.orderNo = orderNo;
        }
        var name = me.find("#name").val();
        if(name.length > 0){
        	temp.name = name;
        }

        var idCard = me.find("#idCard").val();
        if(idCard.length > 0){
            temp.idCard = idCard;
        }

        var mobile = me.find("#mobile").val();
        if(mobile.length > 0){
            temp.mobile = mobile;
        }
        var state = me.find("#state").val();
        if(state.length > 0){
        	temp.state = state;
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
	staticQueryList.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_staticQueryList");
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
	
	staticQueryList.prototype.renderPage = function() {
		var me=this;
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
					toolbar: me.find('#toolbar'), // 工具按钮用哪个容器
					queryParams: $.proxy(me.queryParams, this),//传递参数（*）
					sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）假数据用client
					uniqueId: "id", // 每一行的唯一标识，一般为主键列
					columns:[
							{
								field: 'orderNo',
								title: '订单号'
							},
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
	staticQueryList.prototype.clearList = function() {
        var me = this;
    };
    
    
	// 重新显示
	staticQueryList.prototype.show = function() {
		
	};
	
	//页面点击
	staticQueryList.prototype.bindEvent = function() {
		var me = this;

		me.find("a[name='searchBtn']").click(function() {
			me.find('#tb_var').bootstrapTable('refresh', me.queryParams);
		});

	};
	
	// 页面隐藏
	staticQueryList.prototype.hide = function() {
		
	};

	return new staticQueryList();
});