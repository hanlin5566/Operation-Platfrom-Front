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
            url = "/antiFraud/test";
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    if(result.data.message!="success")
                    {
                        alert(result.data.message);
                    }else{
                        $('#myModal').modal('show');
                        $('#myModal').find(".modal-title").html("反欺诈测试成功");
                        $('#myModal').find(".modal-body").html("查看详情请点击以下链接");
                        $('#myModal').find(".modal-footer").html( '<a class="state-link" id="antiFraudDetail">查看反欺诈测试详情</a>');
                        me.bindInitEvent();
                        console.log("here");
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
                        $("#logId").val(result.data.data.logId);
                    }
                } else {
                    alert("系统异常");
                }
            });
		}

	};

    antiFraudTest.prototype.bindInitEvent = function() {
		var me = this;
		me.find('.submitDemo').on('click', function() {
            var x =  me.parameter.useId;
			if (x>0){
                var postStatus = "update";
                me.postContent(postStatus);
            }else {
                var postStatus = "SAVED";
                me.postContent(postStatus);
            }
		});

        me.find('.testDemo').on('click', function() {
            me.find(".taskId").val("AP6002281993061926"+Math.ceil(Math.random()*100));
            me.find(".name").val("测试");
            me.find(".mobile").val("15800692393");
            me.find(".idCard").val("220204197711162428");
            me.find(".birthday").val("1988-08-11");
            me.find(".race").val("汉");
            me.find(".idCardAddress").val("江西南昌");
            me.find(".idCardValidDate").val("2001.11.12-2020.11.12");
            me.find(".idCardLegality").val("1");
            me.find(".thresholdsIdcard").val("0.01");
            me.find(".thresholdsFace").val("0.01");
            me.find(".idAttacked").val("2");
            me.find(".domicile").val("北京北京市东城区地坛北里8楼2门201号");
            me.find(".homeAddr").val("北京北京市东城区地坛北里8楼2门201号");
            me.find(".companyAddr").val("北京北京市东城区地坛北里8楼2门201号");
            me.find(".company").val("北京公共交通总公司保修分公司一厂");
            me.find(".relativeName").val("李娜");
            me.find(".relativeMobile").val("13466332078");
            me.find(".nonRelativeName").val("李娜");
            me.find(".nonRelativeMobile").val("13466332078");
            me.find(".bankCard").val("62202110344885777");
        });

        $(document).on('click', '#antiFraudDetail', function() {
            var tskid = $("#taskId").val();
            var logid = $("#logId").val();
            var decType = $("#decType").val();
            me.moveTo('decisionDetail',{
                'taskId' :tskid,
                'logId' :logid,
                'decisionType' : decType
            });
        });

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

        
    };


	return new antiFraudTest();
})