define([ 'util/requestUtil', 'core/base', 'util/sessionUtil', 'util/domUtil',
		'portal/main/config', '../../../lib/ace/ace','../../../lib/bootstrap.min','../../../lib/transfer'], function(requestUtil, Base,
		sessionUtil, domUtil, config) {
	var OperaTwoMenuDetail = function() {
	};

	var state ="UNKNOW";
    OperaTwoMenuDetail.prototype = new Base();
	// 页面初始化
    OperaTwoMenuDetail.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_operaTwoMenuDetail");
		me.initAceEditor();
		me.bindInitEvent();
	};
	//根据传入的状态设置右上角按钮文字及传入后台的内容
    OperaTwoMenuDetail.prototype.switchState = function(state) {
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
    OperaTwoMenuDetail.prototype.postContent = function(state) {
		var me = this;
		var url = "system/MenuInfo";
        var menuName = me.find(".menuName").val();
        var menuUrl = me.find(".menuCode").val();
        var parentId = me.find(".belongMenu").val();
        alert("父菜单:"+parentId);
		var usid =  me.parameter.useId;

       // var testDemo = editorDemo.getValue();
		// 验证标题与内容
		if (menuName.length <= 0) {
			alert('请填写菜单名称');
			return;
		}
		if (menuUrl.length <= 0) {
            alert('请填写菜单地址');
            //me.find(".userPwd").focus();
            return;
        }
        if (parentId.length<=0){
		    alert("请选择所属菜单")
		    return;
        }

		var data = {
			"moduleTitle" : menuName,
			"moduleCode" : menuUrl,
            "parentId":parentId,
            "id":usid
		};
		if(state == 'SAVED')
		{
		    alert("save");
            url = "/system/MenuInfo";
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    me.find("#ruleGroupId").val(result.data);
                    alert("保存成功");
                    me.moveTo('operaMenuList');
                    //保存成功将右上角和当前状态修改为编译
                  /*  me.find('.default-btn').text("编译测试");
                    me.find('.default-btn').attr("deployStatus","COMPILED");
                    me.find('.back-btn').show();*/
                } else {
                    alert("保存失败");
                }
            });
		}
       /* if(state == 'COMPILED')
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
        }*/
        if(state == 'update')
        {
            //alert("up999");
            url = "/manageUser/updateUserInfo";
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    //me.find("#ruleGroupId").val(result.data);
                    alert("修改成功");
                    me.moveTo('operaUserList');
                } else {
                    alert("修改失败");
                }
            });
        }

	};

    OperaTwoMenuDetail.prototype.bindInitEvent = function() {
		var me = this;
		me.find('.default-btn').on('click', function() {
            var x =  me.parameter.useId;
			if (x>0){
			    //alert("update");
                var postStatus = "update";
                me.postContent(postStatus);
            }else {
			    //alert("add");
                //var postStatus = me.find('.default-btn').attr('deployStatus');
                var postStatus = "SAVED";
                me.postContent(postStatus);
            }
		});

        me.find("a[name='searchBtn']").click(function() {

            var url = "/Rules/all";
            var ruleName = me.find(".ruleName").val();
            var ruleKey = me.find(".ruleKey").val();
            var varGroupId = me.find("#varGroupId").val();

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

        me.find("#varGroupId").click(function() {
            //alert("二级菜单");
            var url = "/system/parentmenuInfo?limit=100&offset=0";
            var isRole  =$('#isRole').val();
           // $('#varGroupId').empty();
            if(isRole==0) {
                requestUtil.get(url).then(function (result) {
                    if (result.success) {
                        var data = result.data;
                        for (var v in data) {
                            $('#varGroupId').append("<option value=" + data[v].id + ">" + data[v].moduleTitle  + "</option>");
                        }
                        $('#isRole').val(1);
                       // $('#isRole').val(1);
                    }
                });
            }

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
            //editorDemo.setValue(demo);
        });

    };

	// 重新显示 绑定数据后绑定点击事件（暂时这么做）
    OperaTwoMenuDetail.prototype.show = function() {
		var me = this;
		me.renderPage();
	};

    OperaTwoMenuDetail.prototype.renderPage = function() {
		var me = this;
	};

	// 清空数据
    OperaTwoMenuDetail.prototype.clearList = function() {
		var me = this;
	};

	// 页面隐藏
    OperaTwoMenuDetail.prototype.hide = function() {
		var me = this;
	};

	// 页面弹窗
    OperaTwoMenuDetail.prototype.popupWindow = function() {
		var me = this;

	};

    // 初始化ace
    OperaTwoMenuDetail.prototype.initAceEditor = function() {
        
        var me = this;
        //如果有ID则填充内容
        if(me.parameter.useId){
            var url = "/manageUser/"+me.parameter.useId;
            requestUtil.get(url,null).then(function(result) {
                if (result.code == 200) {
                    var userName = result.data.userName;
                    var userPwd = result.data.userPwd;
                    var userPhone = result.data.userPhone;
                    me.find(".userName").val(userName);
                    me.find(".userPwd").val(userPwd);
                    me.find(".varMobile").val(userPhone);
                    me.find(".ciruserPwd").val(userPwd);
                }else{
                  
                }
            });
        }
        
    };


	return new OperaTwoMenuDetail();
})