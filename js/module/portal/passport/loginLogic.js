define(['util/requestUtil','util/utils', 'util/sessionUtil', 'util/dataUtil', 'util/codeUtil'],
  function(requestUtil,utils, sessionUtil, dataUtil, codeUtil){
  
  var LoginLogic = {};
  
  /**
   * 登录验证
   * 
   * @param $errEle
   * @param para
   * @returns
   */
  LoginLogic.authLogin = function(para) {
    me = this;
    //清空
    return requestUtil.post('/platfrom/userlogin', para).then(function(result) {
      if (result.code == "200") {
        dataUtil.set(dataUtil.KEY_LOGINVO, result.data); 
        sessionUtil.set(sessionUtil.KEY_USER_INFO, result.data); 
        return location.href = "./main.html";
      } else {
    	alert(result.message);
        return {result: false, msg: '登录失败，请确认信息后重新登录'};
      }
    });
  };
  
  LoginLogic.authLogout = function() {
	    me = this;
	    //清空
	    return requestUtil.post('auth/logout').then(function(result) {
	      if (result.code == "200") {
	    	dataUtil.clear(dataUtil.KEY_LOGINVO);
	    	sessionUtil.clear(sessionUtil.KEY_USER_INFO);
	    	window.location.href = requestUtil.setting.LOGIN_URI + "&type=logout";
	      } else {
	        return {result: false, msg: '退出失败'};
	      }
	    });
  };
  
  return LoginLogic;
});
