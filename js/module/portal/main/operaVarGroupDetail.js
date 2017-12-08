define([ 'util/requestUtil', 'core/base', 'util/sessionUtil', 'util/domUtil',
		'portal/main/config', '../../../lib/ace/ace'], function(requestUtil, Base,
		sessionUtil, domUtil, config) {
	var operaVarGroupDetail = function() {
	};

	operaVarGroupDetail.prototype = new Base();
	// 页面初始化
	operaVarGroupDetail.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_operaVarGroupDetail");
		me.initAceEditor();
		me.bindInitEvent();
	};

	//提交内容
	operaVarGroupDetail.prototype.postContent = function() {
		var me = this;
		var url = "/derivedGroup";
		var groupName = me.find(".groupName").val();
		var description = me.find(".description").val();
		var queryIface = me.find(".queryIface").val();
		// 验证标题与内容
		if (groupName | groupName.length <= 0) {
            alert('请填写变量组名称');
            me.find(".groupName").focus();
            return;
        }
        if (queryIface | queryIface.length <= 0) {
            alert('请填写接口服务名称');
            me.find(".queryIface").focus();
            return;
        }
		var data = {
			"varGroupId" : me.find("#varGroupId").val(),
			"groupName" : groupName,
			"description" : description,
			"queryIface" : queryIface
		};
		requestUtil.post(url, data).then(function(result) {
			if (result.code == 200) {
				me.find("#varGroupId").val(result.data.data);
                alert("保存成功");
                me.moveTo('operaVarGroupList');
			} else {
                alert(result.data.message);
			}
		});
	};

	operaVarGroupDetail.prototype.bindInitEvent = function() {
		var me = this;
		me.find('.default-btn').on('click', function() {
			var postStatus = me.find('.default-btn').attr('deployStatus');
			me.postContent(postStatus);
		});
	};

	// 重新显示 绑定数据后绑定点击事件（暂时这么做）
	operaVarGroupDetail.prototype.show = function() {
		var me = this;
		me.renderPage();
	};

	operaVarGroupDetail.prototype.renderPage = function() {
		var me = this;
	};

	// 清空数据
	operaVarGroupDetail.prototype.clearList = function() {
		var me = this;
	};

	// 页面隐藏
	operaVarGroupDetail.prototype.hide = function() {
		var me = this;
	};

	// 页面弹窗
	operaVarGroupDetail.prototype.popupWindow = function() {
		var me = this;

	};

	// 初始化ace
	operaVarGroupDetail.prototype.initAceEditor = function() {
		var me = this;
		//如果有ID则填充内容
		if(me.parameter.varGroupId){
        	var url = "/derivedGroup/"+me.parameter.varGroupId;
        	requestUtil.get(url,null).then(function(result) {
				if (result.code == 200) {
					var varGroupId = result.data.varGroupId;
					var groupName = result.data.groupName;
					var description = result.data.description;
					var queryIface = result.data.queryIface;
					me.find("#varGroupId").val(varGroupId);
					me.find(".groupName").val(groupName);
					me.find(".description").val(description);
					me.find(".queryIface").val(queryIface);
				}else{
				}
			});
        }
	};

	return new operaVarGroupDetail();
})