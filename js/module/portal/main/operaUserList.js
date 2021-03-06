define([ 'util/requestUtil', 'core/base','util/formatUtil',
		'util/sessionUtil', 'util/domUtil','util/dateUtil','mobiscroll', 'portal/main/config','widget/table', 'bootstrapTable'], function(
		requestUtil, Base,formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll,config,Table) {
	
	var OperaUserList = function() {
		
	};

	OperaUserList.prototype = new Base();
	
	var sessionId;

    OperaUserList.prototype.queryParams = function(params) {
        var me = this;
        var sessionIdParameter = sessionId;
        var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit : params.limit, // 页面大小
            offset : params.offset, // 页码
            sessionId : sessionIdParameter,
        };
        var userName = me.find("#varName").val();
        if(userName.length > 0){
        	 temp.userName = userName;
        }
        var userPhone = me.find("#varMobile").val();
        if (userPhone.length>0){
        	temp.userPhone =userPhone;
		}
        //var varGroupId = me.find("#varGroupId").val();
        //if(varGroupId.length > 0){
        //	temp.varGroupId = varGroupId;
        //}
       // var state = me.find("#state").val();
       // if(state.length > 0){
       // 	temp.state = state;
       // }
        var calendar = me.find("#calendar").val();
        //alert("时间:"+calendar);
        if(calendar.length > 0){
        	 temp.createTime = calendar;
        }
        return temp;
    };
	
	// 页面初始化
    OperaUserList.prototype.create = function() {
    	//alert("页面初始化！");
		var me = this;
		me.renderMainContent("tpl_operaUserList");
		me.renderPage();
		me.bindEvent();
		me.find('#calendar').mobiscroll().calendar({
			theme: 'mobiscroll',
			lang: 'zh', 
			display: 'bubble',
			buttons:[],
			showOnFocus: false,
			mode:'clickpick',
			dateFormat: 'yy-mm-dd',
			onDayChange : function(day, inst) {
				date = dateUtil.dateFormat(dateUtil.DATE_PATTERN, day.date);
				me.find("#calendar").val(date);
				inst.hide();
			}
		});
	};

    OperaUserList.prototype.renderPage = function() {
		var me=this;
		var operateEvents = {
				'click #DETAIL': function (e, value, row, index) {
					var url = "msg";
					var data = {
						"varId":value,
						"state":'PUBLISHED'
					};
					requestUtil.post(url, data).then(function(result) {
						alert("code:"+result.code);
						if(result.code==200){
							me.find('#tb_var').bootstrapTable('refresh', me.queryParams);
						}
					});
				},
				'click #varDetail': function (e, value, row, index) {
					me.moveTo('operaAddUser',{
						'useId' : value
					});
				}
		};
		
		var url = "/manageUser/queryUserInfo"
		var $table = new Table(
				me.find("#tb_var"),
				{
					url: url,// 请求后台的URL（*）
					toolbar: me.find('#toolbar'), // 工具按钮用哪个容器
					queryParams: $.proxy(me.queryParams, this),//传递参数（*）
					sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）假数据用client
					uniqueId: "varId", // 每一行的唯一标识，一般为主键列
					columns:[
					      {
					    	  checkbox: true,
					      },
					      {
					    	  field: 'userName',
		                      title: '名称'
					      },
					      {
					    	  field: 'apiName',
		                      title: '接口名称'
					      },
					      {
					    	  field: 'userEmail',
					    	  title: '邮箱'
					      },
					      {
					    	  field: 'userPhone',
					    	  title: '手机号'
					      },
					      {
					    	  field: 'createTime',
		                      title: '创建时间'
					      },
					      {
					    	  field: 'id',
		                      title: '操作',
		                      events: operateEvents,
		                      formatter: function (value, row, index) {
                                  return '<a class="state-link" id="varDetail" useId="'+value+'">详情</a>';
					    	  	//return '<a class="state-link" id="PUBLISHED" varId="'+value+'">详情</a>' +  '<a class="state-link" id="varDetail" useId="'+value+'">详情</a>';
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
    OperaUserList.prototype.clearList = function() {
        var me = this;
    };
    
    
	// 重新显示
    OperaUserList.prototype.show = function() {
		
	};
	
	//页面点击
    OperaUserList.prototype.bindEvent = function() {
		var me = this;
		me.find("#remove").click(function() {
			alert("del");
			var selections = $('#tb_var').bootstrapTable('getSelections');
			var varIds = new Array();
			for(var i in selections){
				alert(selections[i].id);
				varIds.push(selections[i].id);
            } 
			var url = "msg";
			requestUtil.del(url, varIds).then(function(result) {
				if(result.success){
             	   $('#tb_var').bootstrapTable('refresh',me.queryParams);
                }
			});
		});

       /* me.find("#varGroupId").click(function() {

            var url = "/derivedGroup";
            var loaded  =$('#isLoadedGrops').val();
            if(loaded==0)
			{
                requestUtil.get(url).then(function(result) {
                    if(result.success){
                        var data = result.data;
                        for(var v in data)
                        {
                            $('#varGroupId').append("<option value="+data[v].varGroupId+">"+data[v].description+"</option>");
                        }
                        $('#isLoadedGrops').val(1);
                    }
                });
			}

        });*/

		me.find("a[name='searchBtn']").click(function() {
			me.find('#tb_var').bootstrapTable('refresh', me.queryParams);
		});
		
		me.find(".add").click(function() {
			//alert("页面跳转");
			//页面跳转
			me.moveTo('operaAddUser');
		});
	};
	
	// 页面隐藏
    OperaUserList.prototype.hide = function() {
		
	};

	return new OperaUserList();
});