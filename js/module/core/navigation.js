define([ 'util/requestUtil', 'util/utils', 'util/codeUtil',
				'util/domUtil', 'util/sessionUtil', 'util/dataUtil', 'model/menu',
				'portal/passport/loginLogic', 'jquery.history' ],
function(requestUtil, utils, codeUtil, domUtil, sessionUtil,
		dataUtil, Menu, loginLogic) {
	var Navigation = function() {
		this.navbar = null;
	};

	Navigation.prototype.init_ = function() {
		window.onstatechange = $.proxy(this.navigate, this);

		/**
		 * TODO
		 * 在util中调用页面模板，会引起循环引用，但是这些模板不需要进入history，所以另外新建逻辑处理这种情况，暂时不成熟
		 */
//		var me = this;
//		eventBus.bind('navigateNoHistory', function(event, data) {
//			me.navigateNoHistory(data);
//		});
	};

	/**
	 * TODO 在util中调用页面模板，会引起循环引用，但是这些模板不需要进入history，所以另外新建逻辑处理这种情况，暂时不成熟
	 */
	Navigation.prototype.navigateNoHistory = function(data) {
		if (!data || !data.pageCode) {
			return;
		}

//		var menu = this.getMenuByMenuCode(data.pageCode);
//		if (!menu) {
//			return;
//		}
//
//		para = $.extend(menu.getUserableObject(), data);

		var pageCode = data.pageCode;
		if (pageCode) {
			var reqArr = [];
			reqArr.push('portal/' + requestUtil.setting.appCode + "/" + pageCode);
			reqArr.push('text!../../template/portal/' + requestUtil.setting.appCode + "/" + pageCode);
//			if (menu.hasCss) {
//				reqArr.push('css!../../theme/default/css/' + requestUtil.setting.appCode + "/" + pageCode);
//			}
			requirejs(reqArr, function(widgt, tpl) {
				widgt._init(para, tpl);
			});
		}
	};

	Navigation.prototype.navigate = function() {
		var me = this;
		var para = utils.getUrlParam();
		if (!para.pageCode) {
			para.pageCode = this.config.DEFAULT_PAGE;
		}
		
		// 必须先显示，否则某些图表不能正确计算位置大小
		me.config.refreshLayout(para)
		.then(function() {
			me.config.refreshPages(para);
		});
		
//		eventBus.trigger('navigate', para);
	};

	Navigation.prototype.go = function(pageCode, para) {
		var me = this;
		if (!pageCode) {
			return;
		}

		me.config.getPageInfo(pageCode)
		.then(function(menu) {
			if (!menu) {
				return;
			}
			para = $.extend(para || {}, {pageCode : pageCode});
			me.validateAuth_(menu, function() {
				me.pushState(menu, para);
			});
		});
	};
	
	Navigation.prototype.replaceState = function(menu, para) {
		History.replaceState({
			pageCode : menu.pageCode
		}, menu.getTitle(), utils.createUrlParam(para));
	};
	
	Navigation.prototype.registerConfig = function(config) {
		this.config = config;
	};

	Navigation.prototype.pushState = function(menu, para, isInit) {
		if (!menu) {
			return;
		}
		var me = this;
		if (me.curPage) {
			if (me.curPage.pageCode != menu.pageCode && me.curPage.hide) {
//				me.curPage.hide(); // TODO 现在hide不能这里调用

				// 保存查询条件
				if (me.curPage.$html) {
					var vals = domUtil.getValuesByName(me.curPage.$html.find(".search-container:not(.disable-auto) form"));
					if (vals) {
						var searchPara = sessionUtil.get(dataUtil.KEY_SEARCH_CONDATION) || {};
						searchPara[me.curPage.pageCode] = vals;
						sessionUtil.set(dataUtil.KEY_SEARCH_CONDATION, searchPara);
					}
				}
			}
		}

		var pageCode = menu.pageCode;
		if (pageCode) {
			if (isInit) {
				// 第一次进入应用
				var oldState = History.getLastSavedState() || {};
				History.replaceState({
					pageCode : menu.pageCode
				}, menu.getTitle(), utils.createUrlParam(para));
				
				var newState = History.getLastSavedState() || {};

				if (oldState.id === newState.id) {
					me.navigate();
					// 解决地址栏刷新丢掉标题
					document.title = menu.getTitle();
				}
			} else {
				History.pushState({
					pageCode : menu.pageCode
				}, menu.getTitle(), utils.createUrlParam(para));
			}
		}
	};

	Navigation.prototype.validateAuth_ = function(menu, callback) {
		// TODO:临时注释，非在线域名，直接返回
//		if (document.domain != requestUtil.setting.SERVER_DOMAIN) {
//			callback();
//			return;
//		}

		var me = this;

		if (menu && menu.skipAuth) {// 非权限验证case
			// 其他页面，直接到请求页面
			callback();
			return;
		}
		//TODO:只判断了，localstroage和sessionstroage，并未判断cooike。如果需要单点登录工程，需要判断cooike并请求后端服务，查看是否在redis中存在。
		// 如果存在localstroage
		var loginVo = dataUtil.get(dataUtil.KEY_LOGINVO);
		//允许除了admin外的角色登录|| loginVo.userInfo.userType.name != 'ADMIN'
		if (!loginVo) {

			// 不存在到登录页
			sessionUtil.clear(sessionUtil.KEY_USER_INFO);
			window.location.href = requestUtil.setting.LOGIN_URI + "&type=skipauto";
			return;
		}

		var userInfo = sessionUtil.get(sessionUtil.KEY_USER_INFO);

		// 如果存在session
		if (!userInfo) {
			dataUtil.clear(dataUtil.KEY_LOGINVO);
			window.location.href = requestUtil.setting.LOGIN_URI + "&type=skipauto";
			return;
		}
		// 直接到请求页面
		callback();
		return;
	};

	Navigation.prototype.start = function() {
		var me = this;
		me.init_();
		
		var state = History.getState();
		if (state && state.data && state.data.code) {
			this.navigate();
			return;
		}

		var para = utils.getUrlParam();
		if (!para.pageCode) {
			para.pageCode = this.config.DEFAULT_PAGE;
			//默认页为空，则取local的第一条数据
			if(!para.pageCode){
				menu = dataUtil.get(dataUtil.KEY_MENU);
				if(menu && menu[0].subMenuList){
					 //TODO:拼装二级和三级页面，以后需要将三级页面也纳入管理范围。与config.js 163行有冗余代码，应该移到后端处理。
					para.pageCode = menu[0].subMenuList[0].moduleCode+"List";
				}
			}
		}
		this.config.getPageInfo(para.pageCode)
		.then(function(menu) {
			me.validateAuth_(menu, function() {
				me.pushState(menu, para, true);
			});
		});
	};

	return new Navigation();
});