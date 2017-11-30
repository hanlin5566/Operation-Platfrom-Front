define([ 'util/requestUtil', 'core/base','util/formatUtil',
		'util/sessionUtil', 'util/domUtil','util/dateUtil','mobiscroll', 'portal/main/config','widget/table', 'bootstrapTable'], function(
		requestUtil, Base,formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll,config,Table) {
	
	var OperaRuleGroup = function() {
		
	};

	OperaRuleGroup.prototype = new Base();
	
	var sessionId;
	
	OperaRuleGroup.prototype.queryParams = function(params) {
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

        var groupKey = me.find("#groupKey").val();
        if(groupKey.length > 0){
            temp.groupKey = groupKey;
        }

        var groupDescribe = me.find("#groupDescribe").val();
        if(groupDescribe.length > 0){
            temp.groupDescribe = groupDescribe;
        }
        var state = me.find("#state").val();
        if(state.length > 0){
        	temp.state = state;
        }
        return temp;
    };
	
	// 页面初始化
	OperaRuleGroup.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_OperaRuleGroup");
		me.renderPage();
		me.bindEvent();
	};
	
	OperaRuleGroup.prototype.renderPage = function() {
		var me=this;
		var operateEvents = {
				'click #groupDetail': function (e, value, row, index) {
					me.moveTo('operaRuleGroupDetail',{
						'ruleGroupId' : value,
						'state': row.state.name
					});
				}
		};
		
		var url = "/ruleGroup"
		var $table = new Table(
				me.find("#tb_rule_group"),
				{
					url: url,// 请求后台的URL（*）
					toolbar: me.find('#toolbar'), // 工具按钮用哪个容器
					queryParams: $.proxy(me.queryParams, this),//传递参数（*）
					sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）假数据用client
					uniqueId: "id", // 每一行的唯一标识，一般为主键列
					columns:[
					      {
					    	  checkbox: true,
					      },
					      {
					    	  field: 'groupKey',
		                      title: '规则编码'
					      },
					      {
					    	  field: 'groupName',
		                      title: '规则名称'
					      },
                        {
                            field: 'sort',
                            title: '规则排序'
                        },
					      {
					    	  field: 'groupDescribe',
					    	  title: '规则描述'
					      },
					      {
					    	  field: 'state',
					    	  title: '状态',
					    	  formatter: function (value, row, index) {
		                            return value.text;
		                      }
					      },
					      {
					    	  field: 'id',
		                      title: '操作',
		                      events: operateEvents,
		                      formatter: function (value, row, index) {
                                  return '<a class="state-link" id="groupDetail" ruleGroupId="'+value+'">详情</a>';
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
	OperaRuleGroup.prototype.clearList = function() {
        var me = this;
    };
    
    
	// 重新显示
	OperaRuleGroup.prototype.show = function() {
		
	};
	
	//页面点击
	OperaRuleGroup.prototype.bindEvent = function() {
		var me = this;
		me.find("#remove").click(function() {
			var selections = $('#tb_var').bootstrapTable('getSelections');
			var varIds = new Array();
			for(var i in selections){
				varIds.push(selections[i].id);
            } 
			var url = "msg";
			requestUtil.del(url, varIds).then(function(result) {
				if(result.success){
             	   $('#tb_rule_group').bootstrapTable('refresh',me.queryParams);
                }
			});
		});
		me.find("a[name='searchBtn']").click(function() {
			me.find('#tb_var').bootstrapTable('refresh', me.queryParams);
		});
		
		me.find(".add").click(function() {
			me.moveTo('operaRuleGroupDetail');
		});

        me.find(".pub").click(function() {
            var selections = $('#tb_rule_group').bootstrapTable('getSelections');
            var groupIds="";
            for(var i in selections){
                groupIds += selections[i].id+"|"
            }
            if(groupIds.length==0)
			{
                alert('请选择已发布状态的规则集');
                return;
			}
            var data = {
                "groupIds" : groupIds
            };
            var url = "/ruleGroup/pub?groupIdStr="+groupIds;
            requestUtil.get(url).then(function(result) {
                if(result.success){
                   alert("发布成功");
                }else{
                    alert(result.message);
				}
            });
        });
	};
	
	// 页面隐藏
	OperaRuleGroup.prototype.hide = function() {
		
	};

	return new OperaRuleGroup();
});