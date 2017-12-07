define(['util/requestUtil', 'core/base', 'util/sessionUtil', 'util/domUtil',
        'portal/main/config','portal/passport/loginLogic', 'widget/dropDown', 'widget/table', 'bootstrapTable', 'icheck'],
    function (requestUtil, Base, sessionUtil, domUtil, config,loginLogic, dropDown, Table) {
        var Login = function () {
        };
        var homeworkId = '';

        Login.prototype = new Base();

        Login.prototype.create = function () {
            var me = this;
            this.renderMainContent("tpl_login");
            
            me.find(".login-btn").on("click", function() {
            	var para = {
            			userName: me.find(".cellphone").val(),
            			userPwd: me.find(".password").val()
            	};
            	
            	if (!para.userName || !para.userPwd) {
            		alert("请输入用户名或密码！");
            		return;
            	}
            	loginLogic.authLogin(para);
            });
            
        };

        // 重新显示
        Login.prototype.show = function () {
            var me = this;
            me.renderPage();
        };

        Login.prototype.renderPage = function () {
            var me = this;
        };

        // 页面隐藏
        Login.prototype.hide = function () {
        };

        return new Login();
    });