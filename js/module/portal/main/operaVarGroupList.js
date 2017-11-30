define([ 'util/requestUtil', 'core/base','util/formatUtil',
		'util/sessionUtil', 'util/domUtil','util/dateUtil','mobiscroll', 'portal/main/config','widget/table', 'bootstrapTable'], function(
		requestUtil, Base,formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll,config,Table) {
	
	var OperaVarGroupList = function() {
		
	};

    OperaVarGroupList.prototype = new Base();
	
	var sessionId;

    // 页面初始化
    OperaVarGroupList.prototype.create = function() {
        var me = this;
        me.renderMainContent("tpl_operaVarGroupList");
        me.renderPage();
        me.bindEvent();
    };

	//查询参数处理
    OperaVarGroupList.prototype.queryParams = function(params) {
        var me = this;
        var sessionIdParameter = sessionId;
        var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit : params.limit, // 页面大小
            offset : params.offset, // 页码
            sessionId : sessionIdParameter,
        };
        var groupName = me.find("#groupName").val();
        if(groupName.length > 0){
        	 temp.groupName = groupName;
        }
        var description = me.find("#description").val();
        if(description.length > 0){
            temp.description = description;
        }
        return temp;
    };
	


    //渲染数据
    OperaVarGroupList.prototype.renderPage = function() {
		var me=this;
		//table字段的事件绑定
		var operateEvents = {
				'click #varGroupDetail': function (e, value, row, index) {
					me.moveTo('operaVarGroupDetail',{
						'varGroupId' : value
					});
				}
		};

		//表格渲染
		var url = "/derivedGroup"
		var $table = new Table(
				me.find("#tb_var_group"),
				{
					url: url,// 请求后台的URL（*）
					toolbar: me.find('#toolbar'), // 工具按钮用哪个容器
					queryParams: $.proxy(me.queryParams, this),//传递参数（*）
					sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）假数据用client
					uniqueId: "varGroupId", // 每一行的唯一标识，一般为主键列
					columns:[
					      {
					    	  checkbox: true,
					      },
					      {
					    	  field: 'groupName',
		                      title: '数据商'
					      },
					      {
					    	  field: 'description',
		                      title: '数据接口'
					      },
					      {
					    	  field: 'queryIface',
					    	  title: '数据源服务标识'
					      },
					      {
					    	  field: 'varGroupId',
		                      title: '操作',
		                      events: operateEvents,
		                      formatter: function (value, row, index) {
                                  return '<a class="state-link" id="varGroupDetail" varGroupId="'+value+'">详情</a>';
		                      }
					      },
					],
					onCheck: function(){
						 if($("#remove").attr("disabled")){
							 $('#remove').removeAttr("disabled");
						 }
					 },
					 onUncheck: function(){
						 if($('#tb_student').bootstrapTable('getSelections').length == 0){
							 if(!$("#remove").attr("disabled")){
								 $('#remove').attr("disabled",'disabled');
							 }
						 }
					 },
					 onUncheckAll: function(){
						 if(!$("#remove").attr("disabled")){
							 $('#remove').attr("disabled",'disabled');
						 }
					 },
					 onCheckAll: function(){
						 if($("#remove").attr("disabled")){
							 $('#remove').removeAttr("disabled");
						 }
					 },
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
    OperaVarGroupList.prototype.clearList = function() {
        var me = this;
    };
    
    
	// 重新显示
    OperaVarGroupList.prototype.show = function() {
		
	};
	
	//页面事件
    OperaVarGroupList.prototype.bindEvent = function() {
		var me = this;
		me.find("#remove").click(function() {
			var selections = $('#tb_var').bootstrapTable('getSelections');
			var varIds = new Array();
			for(var i in selections){
				varIds.push(selections[i].varId);
            } 
			var url = "/derivedGroup";
			requestUtil.del(url, varIds).then(function(result) {
				if(result.success){
             	   $('#tb_var').bootstrapTable('refresh',me.queryParams);
                }
			});
		});
		
		me.find("a[name='searchBtn']").click(function() {
			me.find('#tb_var').bootstrapTable('refresh', me.queryParams);
		});
		
		me.find(".add").click(function() {
			me.moveTo('operaVarGroupDetail');
		});
	};
	
	// 页面隐藏
    OperaVarGroupList.prototype.hide = function() {
		
	};

	return new OperaVarGroupList();
});