define([ 'util/requestUtil', 'core/base', 'util/sessionUtil', 'util/domUtil',
		'portal/main/config', '../../../lib/ace/ace','../../../lib/bootstrap.min'], function(requestUtil, Base,
		sessionUtil, domUtil, config) {
	var OperaRuleDetail = function() {
	};

	OperaRuleDetail.prototype = new Base();
	// 页面初始化
	OperaRuleDetail.prototype.create = function() {
		var me = this;
		me.renderMainContent("tpl_operaRuleDetail");
		me.initAceEditor();
		me.bindInitEvent();
	};

	//提交内容
	OperaRuleDetail.prototype.postContent = function() {
		var me = this;
		var url = "/Rules";
        var ruleName = me.find(".ruleName").val();
        var ruleDescribe = me.find(".ruleDescribe").val();
        var ruleKey = me.find(".ruleKey").val();
        var score = me.find(".score").val();
        var ruleType = me.find("#ruleType").val();
        var content = editor.getValue();
        // 验证标题与内容
        if (ruleName | ruleName.length <= 0) {
            alert('请填写规则标识');
            me.find(".ruleName").focus();
            return;
        }
        if (ruleDescribe | ruleDescribe.length <= 0) {
            alert('请填写规则描述');
            me.find(".ruleDescribe").focus();
            return;
        }
        if (ruleKey | ruleKey.length <= 0) {
            alert('请填写规则对应变量');
            me.find(".ruleKey").focus();
            return;
        }
        if (!score>0) {
            alert('请填写评分');
            me.find(".score").focus();
            return;
        }
        if (content | content.length <= 0) {
            editor.focus();
            alert('请填写规则代码');
            return;
        }
		var data = {
			"id" : me.find("#id").val(),
			"ruleName" : ruleName,
			"ruleDescribe" : ruleDescribe,
            "ruleKey" : ruleKey,
			"score" : score,
			"type":ruleType,
			"content" : content
		};
        requestUtil.post(url, data).then(function(result) {
            if (result.code == 200) {
                me.find("#id").val(result.data.id);
                alert("保存成功");
            } else {
                alert("保存失败:"+result.message);
            }
        });

	};


    OperaRuleDetail.prototype.bindInitEvent = function() {
        var me = this;
        me.find('.default-btn').on('click', function() {
            me.postContent();
        });

        // me.find('.back-btn').on('click', function() {
        //     me.postContent();
        // });

        me.find('#createTestDemo').on('click', function() {
            //me.prePostContent();
            var ruleName = me.find(".ruleName").val();
            var ruleDescribe = me.find(".ruleDescribe").val();
            var ruleKey = me.find(".ruleKey").val();
            var score = me.find(".score").val();
            var ruleType = me.find("#ruleType").val();
            if (ruleName | ruleName.length <= 0) {
                alert('请填写规则标识');
                me.find(".ruleName").focus();
                return;
            }
            if (ruleDescribe | ruleDescribe.length <= 0) {
                alert('请填写规则描述');
                me.find(".ruleDescribe").focus();
                return;
            }
            if (ruleKey | ruleKey.length <= 0) {
                alert('请填写规则对应变量');
                me.find(".ruleKey").focus();
                return;
            }
            if (!score>0) {
                alert('请填写评分');
                me.find(".score").focus();
                return;
            }
        	var code ='import java.util.Map'+"\r\n"
            +'import com.huizhongcf.bean.CommonMessage'+"\r\n"
            +'global  java.util.List messageList;//全局变量'+"\r\n"
			+'dialect "mvel'+"\r\n"
			+'rule "'+ruleKey+'"'+"\r\n"
            +'salience 1'+"\r\n"
            +'lock-on-active true'+"\r\n"
            +'enabled true //规则是否可用 false＝不可用'+"\r\n"
            +'when $factMap: Map(此处填写条件)'+"\r\n"
            +'then'+"\r\n"
            +'CommonMessage commonMessage = new CommonMessage();'+"\r\n"
			+'commonMessage.setType("'+ruleType+'");'+"\r\n"
                +'commonMessage.setRuleDescribe("'+ruleDescribe+'");'+"\r\n"
                +'commonMessage.setRuleName("'+ruleDescribe+'");'+"\r\n"
                +'commonMessage.setRuleId("'+ruleKey+'");'+"\r\n"
                +'commonMessage.setScore(100);'+"\r\n"
                +'messageList.add(commonMessage);'+"\r\n"
                +'end'+"\r\n";
            editor.setValue(code);
        });
    };


	// 重新显示 绑定数据后绑定点击事件（暂时这么做）
	OperaRuleDetail.prototype.show = function() {
		var me = this;
		me.renderPage();
	};

	OperaRuleDetail.prototype.renderPage = function() {
		var me = this;
	};

	// 清空数据
	OperaRuleDetail.prototype.clearList = function() {
		var me = this;
	};

	// 页面隐藏
	OperaRuleDetail.prototype.hide = function() {
		var me = this;
	};

	// 页面弹窗
	OperaRuleDetail.prototype.popupWindow = function() {
		var me = this;

	};

	// 初始化ace
	OperaRuleDetail.prototype.initAceEditor = function() {
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

		//分组选项
                if(me.parameter.id){
                    var url = "/Rules/"+me.parameter.id;
                    requestUtil.get(url,null).then(function(result) {
                        if (result.code == 200) {
                            var ruleName = result.data.ruleName;
                            var ruleDescribe = result.data.ruleDescribe;
                            var ruleKey = result.data.ruleKey;
                            var score = result.data.score;
                            var ruleType = result.data.type;
                            var content = result.data.content;
                            me.find("#id").val(me.parameter.id);
                            me.find(".ruleName").val(ruleName);
                            me.find(".ruleDescribe").val(ruleDescribe);
                            me.find(".ruleKey").val(ruleKey);
                            me.find("#ruleType").val(ruleType);
                            me.find(".score").val(score);
                            editor.setValue(content);
                        }else{
                        }
                    });
                }

	};

	return new OperaRuleDetail();
})