define([ 'util/requestUtil', 'core/base', 'util/sessionUtil', 'util/domUtil',
		'portal/main/config', '../../../lib/ace/ace','../../../lib/bootstrap.min'], function(requestUtil, Base,
		sessionUtil, domUtil, config) {
	var OperaVarDetail = function() {
	};

	var state ="UNKNOW";
	OperaVarDetail.prototype = new Base();
	// 页面初始化
	OperaVarDetail.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_operaVarDetail");
		me.initAceEditor();
		me.bindInitEvent();
	};
	//根据传入的状态设置右上角按钮文字及传入后台的内容
	OperaVarDetail.prototype.switchState = function(state) {
		var me = this;
		//点击详情时如果为已发布则置为只读
		if ('PUBLISHED' == state) {
			me.find(".varRetName").attr("readonly", "readonly");
			me.find(".varRecName").attr("readonly", "readonly");
            me.find(".defaultValue").attr("readonly", "readonly");
			me.find("#varType").attr("readonly", "readonly");
            me.find("#varDataType").attr("readonly", "readonly");
			editor.setReadOnly(true);
			me.find('.default-btn').hide();
		} else if('SAVED' == state){
			//保存状态右上角应该为编译，可以修改
            me.find('.back-btn').css("display","inline-block");
			me.find('.default-btn').text("编译测试");
			me.find('.default-btn').attr("deployStatus","COMPILED");
		}else if('COMPILED' == state){
			//编译通过，则右上方按钮应该为发布，并且不能修改。
			me.find('.default-btn').text("发布");
			me.find('.default-btn').attr("deployStatus","PUBLISHED");
		}else{
			//新建
			me.find('.default-btn').attr("deployStatus","SAVED");
		}
	}
	//提交内容
	OperaVarDetail.prototype.postContent = function(state) {
		var me = this;
		var url = "/derived";
		var varRetName = me.find(".varRetName").val();
		var description = me.find(".description").val();
		var varType = me.find("#varType").val();
        var varDataType = me.find("#varDataType").val();
        var defaultValue = me.find(".defaultValue").val();
        var varGroupId = me.find("#varGroupId").val();
		var varRecName = me.find(".varRecName").val();
        var clazzPath = me.find(".clazzPath").val();
		var content = editor.getValue();
        var testDemo = editorDemo.getValue();
		// 验证标题与内容
		if (varRetName | varRetName.length <= 0) {
			alert('请填写变量名称');
			me.find(".varName").focus();
			return;
		}
		if (varType==0) {
			alert('请选择变量类型');
			me.find("#varDataType").focus();
			return;
		}

        if (varDataType==0) {
            alert('请选择变量数据类型');
            me.find("#varDataType").focus();
            return;
        }

        if (defaultValue | defaultValue.length <= 0) {
            alert('请选输入变量默认值');
            me.find(".defaultValue").focus();
            return;
        }

        if (varRecName.length <= 0 && varDataType==1) {
            alert('直接变量请填写变量数据源字段名称');
            me.find(".varRecName").focus();
            return;
        }

		if (varGroupId.length == 0) {
			alert('请选择数据源');
			me.find("#varGroupId").focus();
			return;
		}

		if (varDataType==2 &&(content | content.length <= 0)) {
			editor.focus();
			alert('请填写算法代码');
			return;
		}
        if (varDataType==2 &&(testDemo | testDemo.length <= 0)) {
            editorDemo.focus();
            alert('请填测试用例');
            return;
        }
		var data = {
			"varId" : me.find("#varId").val(),
			"varRetName" : varRetName,
			"varRecName" : varRecName,
			"description" : description,
            "varType" : varType,
			"varDataType" : varDataType,
			"defaultValue":defaultValue,
			"varGroupId" : varGroupId,
			"content" : content,
            "testDemo" : testDemo,
			"clazzPath" : clazzPath,
			"state" : state
		};
		if(state == 'SAVED')
		{
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    me.find("#varId").val(result.data);
                    alert("保存成功");
                    //保存成功将右上角和当前状态修改为编译
                    me.find('.default-btn').text("编译测试");
                    me.find('.default-btn').attr("deployStatus","COMPILED");
                    me.find('.back-btn').show();
                } else {
                    alert("保存失败");
                }
            });
		}
        if(state == 'COMPILED')
        {
        	url = "/derived/compile";
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    me.find('#myModal').modal('show');
                    me.find('#myModal').find(".modal-title").html("编译测试成功");
                    me.find('#myModal').find(".modal-body").html("输出变量键值为"+result.data)
                   // alert("测试成功：输出变量键值为："+result.data);
                    //保存成功将右上角和当前状态修改为编译
                    me.find('.default-btn').text("发布");
                    me.find('.default-btn').attr("deployStatus","PUBLISHED");
                } else {
                    me.find('#myModal').modal('show');
                    me.find('#myModal').find(".modal-title").html("编译测试失败");
                    me.find('#myModal').find(".modal-body").html(result.data)
                }
            });
        }
        if(state == 'PUBLISHED')
        {
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    me.find("#varId").val(result.data);
                    alert("发布成功");
                    me.moveTo('operaVarList');
                } else {
                    alert("发布失败");
                }
            });
        }

	};

	OperaVarDetail.prototype.bindInitEvent = function() {
		var me = this;
		me.find('.default-btn').on('click', function() {

			var postStatus = me.find('.default-btn').attr('deployStatus');
			me.postContent(postStatus);
		});

        me.find('.back-btn').on('click', function() {
            var postStatus = "SAVED";
            me.postContent(postStatus);
        });
	};

	// 重新显示 绑定数据后绑定点击事件（暂时这么做）
	OperaVarDetail.prototype.show = function() {
		var me = this;
		me.renderPage();
	};

	OperaVarDetail.prototype.renderPage = function() {
		var me = this;
	};

	// 清空数据
	OperaVarDetail.prototype.clearList = function() {
		var me = this;
	};

	// 页面隐藏
	OperaVarDetail.prototype.hide = function() {
		var me = this;
	};

	// 页面弹窗
	OperaVarDetail.prototype.popupWindow = function() {
		var me = this;

	};

	// 初始化ace
	OperaVarDetail.prototype.initAceEditor = function() {
		var me = this;
		// 初始化对象
		editor = ace.edit("aceEditor");
		// 设置风格和语言（更多风格和语言，请到github上相应目录查看）
//		theme = "clouds"
		theme = "twilight"
		language = "java"
		editor.setTheme("ace/theme/" + theme);
		editor.session.setMode("ace/mode/" + language);
		// 字体大小
		editor.setFontSize(18);
		// 设置只读（true时只读，用于展示代码）
		editor.setReadOnly(false);
		// 自动换行,设置为off关闭
		editor.setOption("wrap", "free")
        // 初始化对象
        editorDemo = ace.edit("demoEditor");
        // 设置风格和语言（更多风格和语言，请到github上相应目录查看）
//		theme = "clouds"
        theme = "twilight"
        language = "json"
        editorDemo.setTheme("ace/theme/" + theme);
        editorDemo.session.setMode("ace/mode/" + language);
        // 字体大小
        editorDemo.setFontSize(18);
        // 设置只读（true时只读，用于展示代码）
        editorDemo.setReadOnly(false);
        // 自动换行,设置为off关闭
        editorDemo.setOption("wrap", "free")
		//如果有ID则填充内容

		//分组选项
		var url = "/derivedGroup?limit=100&offset=0";
        requestUtil.get(url).then(function(result) {
            if(result.success){
                var data = result.data;
                for(var v in data)
                {
                    $('#varGroupId').append("<option value="+data[v].varGroupId+">"+data[v].groupName+"-"+data[v].description+"</option>");
                }

                if(me.parameter.varId){
                    var url = "/derived/"+me.parameter.varId;
                    requestUtil.get(url,null).then(function(result) {
                        if (result.code == 200) {
                            var varId = result.data.varId;
                            var varRetName = result.data.varRetName;
                            var description = result.data.description;
                            var varDataType = result.data.varDataType;
                            var varType = result.data.varType;
                            var defaultValue = result.data.defaultValue;
                            var varRecName = result.data.varRecName;
                            var varGroupId = result.data.varGroupId;
                            var clazzPath = result.data.clazzPath;
                            var content = result.data.content;
                            var testDemo = result.data.testDemo;
                            state = result.data.state.name;
                            me.switchState(state);
                            me.find("#varId").val(varId);
                            me.find(".varRetName").val(varRetName);
                            me.find(".description").val(description);
                            me.find(".defaultValue").val(defaultValue);
                            me.find("#varType").val(varType);
                            me.find("#varDataType").val(varDataType);
                            me.find("#varGroupId").val(varGroupId);
                            me.find(".varRecName").val(varRecName);
                            me.find(".clazzPath").val(clazzPath);
                            editor.setValue(content);
                            editorDemo.setValue(testDemo);
                        }else{
                        }
                    });
                }
            }
        });


	};

	return new OperaVarDetail();
})