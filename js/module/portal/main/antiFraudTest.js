define([ 'util/requestUtil', 'core/base', 'util/sessionUtil', 'util/domUtil',
		'portal/main/config', '../../../lib/ace/ace','../../../lib/bootstrap.min','../../../lib/transfer'], function(requestUtil, Base,
		sessionUtil, domUtil, config) {
	var antiFraudTest = function() {
	};

	var state ="UNKNOW";
    antiFraudTest.prototype = new Base();
	// 页面初始化
    antiFraudTest.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_antiFraudTest");
		me.initAceEditor();
		me.bindInitEvent();
	};

	//提交内容
    antiFraudTest.prototype.postContent = function(state) {
        var me = this;
        var a = ["taskId","applicationType","birthday","gender","race","idCardAddress",
            "idCardValidDate","idCardLegality","thresholdsIdcard","thresholdsFace","idAttacked",
            "education","maritalStatus","domicile","homeAddr","residenceLength","industry","companyAddr",
            "workingHours","company","position","monthlyIncome","payrollDay","relativeType","relativeName",
            "relativeMobile","nonRelativeType","nonRelativeName","nonRelativeMobile","loanTerm",
            "loanAmount","loanUsage","otherChannelsInfo","bankCard","idCard","name","mobile"];
        //var a = ["name","mobile"];
        /* for(var x in a){
             var st = "."+a[x];
             //alert(me.find(st).val());
             if (me.find(st).val().length <= 0) {
                 alert("请填写必传参")
                 me.find(st).focus();
                 return;
             }
        }*/

		var data = {
			"taskId" : me.find(".taskId").val(),
			"applicationType" : me.find(".applicationType").val(),
            "birthday" : me.find(".birthday").val(),
            "gender" : me.find(".gender").val(),
            "race" : me.find(".race").val(),
            "idCard":me.find(".idCard").val(),
            "name":me.find(".name").val(),
            "mobile":me.find(".mobile").val(),
            "idCardAddress" : me.find(".idCardAddress").val(),
            "idCardValidDate" : me.find(".idCardValidDate").val(),
            "idCardLegality" : me.find(".idCardLegality").val(),
            "thresholdsIdcard" : me.find(".thresholdsIdcard").val(),
            "thresholdsFace" : me.find(".thresholdsFace").val(),
            "idAttacked" : me.find(".idAttacked").val(),
            "education" : me.find(".education").val(),
            "maritalStatus" : me.find(".maritalStatus").val(),
            "domicile" : me.find(".domicile").val(),
            "homeAddr" : me.find(".homeAddr").val(),
            "residenceLength" : me.find(".residenceLength").val(),
            "industry" : me.find(".industry").val(),
            "companyAddr" : me.find(".companyAddr").val(),
            "workingHours" : me.find(".workingHours").val(),
            "company" : me.find(".company").val(),
            "position" : me.find(".position").val(),
            "monthlyIncome" : me.find(".monthlyIncome").val(),
            "payrollDay" : me.find(".payrollDay").val(),
            "relativeType" : me.find(".relativeType").val(),
            "relativeName" : me.find(".relativeName").val(),
            "relativeMobile" : me.find(".relativeMobile").val(),
            "nonRelativeType" : me.find(".nonRelativeType").val(),
            "nonRelativeName" : me.find(".nonRelativeName").val(),
            "nonRelativeMobile" : me.find(".nonRelativeMobile").val(),
            "loanTerm" : me.find(".loanTerm").val(),
            "loanAmount" : me.find(".loanAmount").val(),
            "loanUsage" : me.find(".loanUsage").val(),
            "otherChannelsInfo" : me.find(".otherChannelsInfo").val(),
            "bankCard" : me.find(".bankCard").val()

		};
		if(state == 'SAVED')
		{
		    //alert("save");
            url = "/antiFraud/test";
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    me.find("#ruleGroupId").val(result.data.data.msg);
                   /* alert(""+result.data.data.message+"-");
                    var jc = "";
                    jc ="决策信息："+result.data.data.message+"\n";


                    var jcr = "";
                    jcr ="决策结果：" +result.data.data.decisionResult+"\n";

                    var jcscore = "";
                    jcscore= "决策分数："+result.data.data.totalScore+"\n";

                    var ruleHtml="";
                    for(var h in result.data.data.step){
                        alert("step:"+result.data.data.step[h].ruleGroup);
                        ruleHtml += "规则集:"+result.data.data.step[h].ruleGroup;
                    }*/

                    me.find('#myModal').modal('show');
                    me.find('#myModal').find(".modal-title").html("反欺诈测试成功");
                    me.find('#myModal').find(".modal-body").html("反欺诈测试结果:"+result.data.data.message);
                    me.find('#myModal').find(".modal-footer").html( '<a class="state-link" id="antiFraudDetail">查看反欺诈测试详情</a>');
                    var reMsg="success";
                    var decType =0;
                    if (result.data.message!=reMsg){
                        decType=3;
                    }else {
                        if (result.data.data.totalScore>0){
                            decType=1;
                        }else {
                            decType=2;
                        }
                    }
                    $("#decType").val(decType);
                    $("#taskId").val(result.data.data.taskId);
                    //alert(decType);
                    /*var appHtml = jc+jcr+jcscore;
                    editor.setValue(appHtml);*/
                    //me.moveTo('operaUserList');
                    //保存成功将右上角和当前状态修改为编译
                  /*  me.find('.default-btn').text("编译测试");
                    me.find('.default-btn').attr("deployStatus","COMPILED");
                    me.find('.back-btn').show();*/
                } else {
                    alert("保存失败");
                }
            });
		}

       /* if(state == 'update')
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
        }*/

	};

    antiFraudTest.prototype.bindInitEvent = function() {
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


      /*  me.find('#sava-btn').on('click', function() {
            var postStatus = "SAVED";
            me.postContent(postStatus);
        });*/

        $(document).on('click', '#antiFraudDetail', function() {
            var tskid = $("#taskId").val();
            var decType = $("#decType").val();
            //alert("id:"+tskid+"-decType:"+decType);
            me.moveTo('decisionDetail',{
                'taskId' :tskid,
                'decisionType' : decType
            });
        });

       /* me.find("#antiFraudDetail").click(function() {
            alert("详情");
        });*/

        /*me.find("#varGroupId").click(function() {
            var url = "/manageUser/queryRoleInfo?limit=100&offset=0";
            var isRole  =$('#isRole').val();
            //$('#varGroupId').empty();
            if(isRole==0) {
                requestUtil.get(url).then(function (result) {
                    if (result.success) {
                        var data = result.data;
                        for (var v in data) {
                            $('#varGroupId').append("<option value=" + data[v].id + ">" + data[v].roleName + "-" + data[v].comments + "</option>");
                        }
                        $('#isRole').val(1);
                    }
                });
            }

        });*/


       /* me.find("#createTestDemo").on('click', function() {
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
        });*/

    };

	// 重新显示 绑定数据后绑定点击事件（暂时这么做）
    antiFraudTest.prototype.show = function() {
		var me = this;
		me.renderPage();
	};

    antiFraudTest.prototype.renderPage = function() {
		var me = this;
	};

	// 清空数据
    antiFraudTest.prototype.clearList = function() {
		var me = this;
	};

	// 页面隐藏
    antiFraudTest.prototype.hide = function() {
		var me = this;
	};

	// 页面弹窗
    antiFraudTest.prototype.popupWindow = function() {
		var me = this;

	};

    // 初始化ace
    antiFraudTest.prototype.initAceEditor = function() {
        var me = this;

        //editor = ace.edit("aceEditor");
        //如果有ID则填充内容
       /* if(me.parameter.useId){
            var url = "/manageUser/"+me.parameter.useId;
            requestUtil.get(url,null).then(function(result) {
                if (result.code == 200) {
                    var userName = result.data.userName;
                    var userPwd = result.data.userPwd;
                    var userPhone = result.data.userPhone;
                    var userRoleId = result.data.userRoleId;
                    me.find(".userName").val(userName);
                    me.find(".userPwd").val(userPwd);
                    me.find(".varMobile").val(userPhone);
                    me.find(".ciruserPwd").val(userPwd);
                    me.find(".belongRole").val(userRoleId);
                }else{
                  
                }
            });
        }*/
        
    };


	return new antiFraudTest();
})