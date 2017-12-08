define([ 'util/requestUtil', 'core/base', 'util/sessionUtil', 'util/domUtil',
		'portal/main/config', '../../../lib/ace/ace','../../../lib/bootstrap.min','../../../lib/transfer'], function(requestUtil, Base,
		sessionUtil, domUtil, config) {
	var OperaRuleGroupDetail = function() {
	};

	var state ="UNKNOW";
	OperaRuleGroupDetail.prototype = new Base();
	// 页面初始化
	OperaRuleGroupDetail.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_OperaRuleGroupDetail");
		me.initAceEditor();
		me.bindInitEvent();
	};
	//根据传入的状态设置右上角按钮文字及传入后台的内容
	OperaRuleGroupDetail.prototype.switchState = function(state) {
		var me = this;
		//点击详情时如果为已发布则置为只读
		if ('PUBLISHED' == state) {
			me.find(".groupKey").attr("readonly", "readonly");
			me.find('.default-btn').hide();
		} else if('SAVED' == state){
			//保存状态右上角应该为编译，可以修改
            me.find('.back-btn').show();
			me.find('.default-btn').text("编译测试");
			me.find('.default-btn').attr("deployStatus","COMPILED");
		}else if('COMPILED' == state){
			//编译通过，则右上方按钮应该为发布，并且不能修改。
            me.find('.back-btn').show();
			me.find('.default-btn').text("发布");
			me.find('.default-btn').attr("deployStatus","PUBLISHED");
		}else{
			//新建
			me.find('.default-btn').attr("deployStatus","SAVED");
		}
	}
	//提交内容
	OperaRuleGroupDetail.prototype.postContent = function(state) {
		var me = this;
		var url = "/ruleGroup";
		var groupKey = me.find(".groupKey").val();
		var groupName = me.find(".groupName").val();
        var sort = me.find(".sort").val();
		var groupDescribe = me.find(".groupDescribe").val();
        var testDemo = editorDemo.getValue();
		// 验证标题与内容
		if (groupKey | groupKey.length <= 0) {
			alert('请填写规则组编码');
			me.find(".groupKey").focus();
			return;
		}
		if (groupName | groupName.length <= 0) {
            alert('请填写规则组名称');
            me.find(".groupName").focus();
            return;
        }
        if (!(sort >=0)) {
            alert('请输入正确规则排序');
            me.find(".sort").focus();
            return;
        }
        if (groupDescribe | groupDescribe.length <= 0) {
            alert('请填写规则描述');
            me.find(".groupDescribe").focus();
            return;
        }
        if (testDemo | testDemo.length <= 0) {
            editorDemo.focus();
            alert('请填测试用例');
            return;
        }
        //已选择的规则
        var selected =me.find("#selected").find(".tyue-checkbox-input");
		var ruleIds = [];
        selected.each(function(){
            var ruleId = $(this).data("id");
            ruleIds.push(ruleId);
        });

        if (ruleIds.length==0) {
            alert('请选择规则');
            return;
        }

		var data = {
			"id" : me.find("#ruleGroupId").val(),
			"groupKey" : groupKey,
            "sort" : sort,
			"groupName" : groupName,
            "groupDescribe" : groupDescribe,
            "testDemo" : testDemo,
            "ruleIds":ruleIds,
			"state" : state
		};
		if(state == 'SAVED')
		{
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    me.find("#ruleGroupId").val(result.data);
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
        	url = "/ruleGroup/compile";
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    me.find('#myModal').modal('show');
                    me.find('#myModal').find(".modal-title").html("编译测试成功");
                    me.find('#myModal').find(".modal-body").html("输出决策结果为："+result.data)
                   // alert("测试成功：输出变量键值为："+result.data);
                    //保存成功将右上角和当前状态修改为编译
                    me.find('.back-btn').show();
                    me.find('.default-btn').text("发布");
                    me.find('.default-btn').attr("deployStatus","PUBLISHED");
                } else {
                    me.find('#myModal').modal('show');
                    me.find('#myModal').find(".modal-title").html("编译测试失败");
                    me.find('#myModal').find(".modal-body").html(result.data.message)
                }
            });
        }
        if(state == 'PUBLISHED')
        {
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    me.find("#ruleGroupId").val(result.data);
                    alert("发布成功");
                    me.moveTo('operaRuleGroup');
                } else {
                    alert("发布失败");
                }
            });
        }

	};

	OperaRuleGroupDetail.prototype.bindInitEvent = function() {
		var me = this;
		me.find('.default-btn').on('click', function() {
			var postStatus = me.find('.default-btn').attr('deployStatus');
			me.postContent(postStatus);
		});

        me.find("a[name='searchBtn']").click(function() {

            var url = "/Rules/all";
            var ruleName = me.find(".ruleName").val()!="" ? me.find(".ruleName").val() : null;
            var ruleKey =  me.find(".ruleKey").val()!="" ? me.find(".ruleKey").val() : null;
            var varGroupId = me.find("#varGroupId").val()!="" ? me.find("#varGroupId").val() : null;
            var data = {
                "ruleName" : ruleName,
                "ruleKey" : ruleKey,
                "varGroupId" : varGroupId
            };
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    var ruleGroupList =result.data;
                    var noSelect="";
                    //排除已添加部分
                    var selected =me.find(".tyue-checkbox-input");
                    for(var o in ruleGroupList){
                            var isExist =false;
                            selected.each(function(){
                                var ruleKey = $(this).data("rulekey");
                                if(ruleKey == ruleGroupList[o].ruleKey ) isExist =true;
                            });


                            if(isExist)
                            {
                                noSelect = noSelect+'<li><div class="ty-tree-div"><label class="tyue-checkbox-wrapper"><span class="tyue-checkbox">'
                                    +'<input type="checkbox" class="tyue-checkbox-input"  data-rulekey="'+ruleGroupList[o].ruleKey+'"   data-id="'+ruleGroupList[o].id+'"   id="tyue-checkbox-blue" disabled="disabled"><span class="tyue-checkbox-circle"></span>'
                                    +'</span><span class="tyue-checkbox-txt" title="'+ruleGroupList[o].ruleKey+"-"+ruleGroupList[o].ruleDescribe+'">'
                                    +ruleGroupList[o].ruleKey+"-"+cutstr(ruleGroupList[o].ruleDescribe,30)+'</span></label></div></li>';

                            }else{
                                noSelect = noSelect+'<li><div class="ty-tree-div"><label class="tyue-checkbox-wrapper"><span class="tyue-checkbox">'
                                    +'<input type="checkbox" class="tyue-checkbox-input"  data-rulekey="'+ruleGroupList[o].ruleKey+'"  data-id="'+ruleGroupList[o].id+'"    id="tyue-checkbox-blue"><span class="tyue-checkbox-circle"></span>'
                                    +'</span><span class="tyue-checkbox-txt" title="'+ruleGroupList[o].ruleKey+"-"+ruleGroupList[o].ruleDescribe+'">'
                                    +ruleGroupList[o].ruleKey+"-"+cutstr(ruleGroupList[o].ruleDescribe,30)+'</span></label></div></li>';

                            }
                        }
                    me.find("#noSelect").html(noSelect);
                    //初始化按钮时间
                    $("#transfer").transferItem();
                } else {
                    alert("读取失败");
                }
            });
        });


        me.find('#sava-btn').on('click', function() {
            var postStatus = "SAVED";
            me.postContent(postStatus);
        });

        me.find("#createTestDemo").on('click', function() {
            var demo ="{"+"\r\n";
            var selected =me.find("#selected").find(".tyue-checkbox-input");
            var len=0;
            selected.each(function(){
                len ++;
                var ruleKey = $(this).data("rulekey");
                if(len<selected.size())
                {
                    demo = demo +'"'+ruleKey+'":"",'+"\r\n";
                }else{
                    demo = demo +'"'+ruleKey+'":""'+"\r\n"+'}';
                }

            });
            editorDemo.setValue(demo);
        });

    };

	// 重新显示 绑定数据后绑定点击事件（暂时这么做）
	OperaRuleGroupDetail.prototype.show = function() {
		var me = this;
		me.renderPage();
	};

	OperaRuleGroupDetail.prototype.renderPage = function() {
		var me = this;
	};

	// 清空数据
	OperaRuleGroupDetail.prototype.clearList = function() {
		var me = this;
	};

	// 页面隐藏
	OperaRuleGroupDetail.prototype.hide = function() {
		var me = this;
	};

	// 页面弹窗
	OperaRuleGroupDetail.prototype.popupWindow = function() {
		var me = this;

	};

	// 初始化ace
	OperaRuleGroupDetail.prototype.initAceEditor = function() {
		var me = this;
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

        //数据源选项
        requestUtil.get("/derivedGroup?limit=100&offset=0").then(function(result) {
            if(result.success) {
                var data = result.data;
                for (var v in data) {
                    $('#varGroupId').append("<option value="+data[v].varGroupId+">"+data[v].groupName+"-"+data[v].description+"</option>");
                }
              }
            });

        if(me.parameter.ruleGroupId){
            var url = "/ruleGroup/"+me.parameter.ruleGroupId;
            requestUtil.get(url,null).then(function(result) {
                if (result.code == 200) {
                    var ruleGroupId = result.data.id;
                    var groupKey = result.data.groupKey;
                    var sort = result.data.sort;
                    var groupName = result.data.groupName;
                    var groupDescribe = result.data.groupDescribe;
                    var testDemo = result.data.testDemo;
                    state = result.data.state.name;
                    me.switchState(state);
                    me.find("#ruleGroupId").val(ruleGroupId);
                    me.find(".groupKey").val(groupKey);
                    me.find(".sort").val(sort);
                    me.find(".groupName").val(groupName);
                    me.find(".groupDescribe").val(groupDescribe);
                    if(testDemo!=null)
                    {
                        editorDemo.setValue(testDemo);
                    }
                    //已选规则
                    var ruleGroupList =result.data.rules;
                    var selected="";
                    for(var o in ruleGroupList){

                        selected = selected+'<li><div class="ty-tree-div"><label class="tyue-checkbox-wrapper"><span class="tyue-checkbox">'
                            +'<input type="checkbox" class="tyue-checkbox-input"  data-rulekey="'+ruleGroupList[o].ruleKey+'" data-id="'+ruleGroupList[o].id+'"  id="tyue-checkbox-blue"><span class="tyue-checkbox-circle"></span>'
                            +'</span><span class="tyue-checkbox-txt" title=" '+ruleGroupList[o].ruleKey+"-"+ruleGroupList[o].ruleDescribe+'">'
                        +ruleGroupList[o].ruleKey+"-"+cutstr(ruleGroupList[o].ruleDescribe,30)+'</span></label></div></li>';
                    }
                    me.find("#selected").html(selected);
                   $("#transfer").transferItem();
                }else{
                }
            });
        }
	};

    function cutstr(str, len) {
        var str_length = 0;
        var str_len = 0;
        str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
            return str;
        }
    }

	return new OperaRuleGroupDetail();
})