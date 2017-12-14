define(["model/menu", "core/navigation", "util/utils", "util/requestUtil",'util/dataUtil'],
    function (Menu, navigation, utils, requestUtil,dataUtil) {

        var Config = function () {
            var me = this;
            navigation.registerConfig(me);

            me.DEFAULT_PAGE = "";
            var pageTree = new Menu({
        		pageCode: "__ROOT__"
        	});
            me.pageTree = pageTree;
            me.getPageMapping();
            // layout与页面对应关系，每个layout都显示哪些widget，粗匹配，如果涉及到西匹配，这个配置要移动到每个页面内部配置（pageList）
            me.layoutPageMapping = {
                layout_work: [
                    "header",
                    "navbar",
                    "notice",
                    "timetable",
                    "workNavbar",
                    "messageNavbar"
                ],
                layout_manage: [
                    "header",
                    "navbar"
                ]
            }

            // 全部可组合layout container
            me.allLayout = ["layout_header", "layout_navbar", "layout_work", "layout_rightPanel", "layout_manage"];

            // 定制layout，用于配合allLayout控制显示隐藏只有在存在的才显示
            me.layoutMapping = {
                layout_work: [
                    "layout_header",
                    "layout_navbar",
                    "layout_work",
                    "layout_rightPanel"
                ],
                layout_manage: [
                    "layout_header",
                    "layout_navbar",
                    "layout_manage"
                ]
            }
        };

        Config.prototype.getPageMapping = function () {
            var me = this;
            var pageMapping = me.pageTree.exportChildMapping();
            /***********通用页面追加，以下widget均不与地址栏pageCode产生交互************/
            pageMapping["header"] = new Menu({
                // 上部菜单
                pageCode: "header",
                positionId: "layout_header",
                layoutId: "layout_work",
            });

            pageMapping["navbar"] = new Menu({
                // 左侧导航
                pageCode: "navbar",
                positionId: "layout_navbar",
                layoutId: "layout_work",
            });
            // 把page列表映射为Menu对象
            me.pageMapping = pageMapping;
        };

        /**
         * pageCode
         */
        Config.prototype.refreshLayout = function (para) {
            var me = this;
            return me.getPageInfo(para.pageCode)
                .then(function (page) {
                    if (!page) {
                        return;
                    }
                    var layout = me.layoutMapping[page.layoutId];
                    if (!layout) {
                        // TODO
                        alert("no layout found");
                        return;
                    }

                    for (var k in me.allLayout) {
                        var val = me.allLayout[k];
                        var flag = utils.inArr(layout, val);
                        $("#" + val)[flag ? "show" : "hide"]();
                    }
                });
        };

        Config.prototype.refreshPages = function (para) {
            var me = this;
            return me.getPageInfo(para.pageCode)
                .then(function (page) {
                    var pageArr = me.layoutPageMapping[page.layoutId];
                    if (!pageArr) {
                        return;
                    }

                    pageArr = pageArr.concat(para.pageCode);

                    var oldPageList = me.curPageList;

                    // 发送hide通知
                    if (oldPageList) {
                        for (var k in oldPageList) {
                            var page = oldPageList[k];
                            if (!utils.inArr(pageArr, page)) {
                                page.baseHide();
                            }
                        }
                    }

                    me.curPageList = [];

                    // 发送show通知
                    for (var k in pageArr) {
                        var pageCode = pageArr[k];
                        var pageConfig = me.getPageInfo(pageCode)
                            .then(function (pageConfig) {
                                me.loadPage(pageCode, pageConfig, para, loadCb);
                            });
                    }
                });

            function loadCb(widget) {
                me.curPageList.push(widget);
            };
        };
        
        Config.prototype.setMenu = function(menu){
        	// 页面列表，这里配置多于实际页面数，例如消息列表页分为三种pageCode但是共用一个js文件，所以scriptPath相同pageCode不同
        	// 如果scriptPath不设置，默认为和pageCode一致
        	
        	//alert("inc");
        	/**
        	 * nodeHeader ：主header
        	 * nodeNavbar : 左侧导航
        	 * level1 : 一级页面
        	 * level2 : 二级页面
        	 * level3 : 三级页面
        	 */
        	var me = this;
        	for(var h in  menu){
                var parentMenu = menu[h].parentMenu;
                //头部一级菜单
                var nodeHeader = new Menu({
                    pageCode: parentMenu.moduleCode,
                    label: parentMenu.moduleTitle,
                    isMenu: true
                });
                var nodeNavbar = new Menu({pageCode: parentMenu.moduleCode+"_main",isMenu: true});
                for (var j in  menu[h].subMenuList){
                    if(j == "0"){
                        me.DEFAULT_PAGE = menu[h].subMenuList[j].moduleCode+"List";
                    }
                    //TODO:拼装二级和三级页面，以后需要将三级页面也纳入管理范围。
                    level1 = new Menu({
                        pageCode: menu[h].subMenuList[j].moduleCode+"List",
                        positionId: "layout_manage",
                        layoutId: "layout_manage",
                        label: menu[h].subMenuList[j].moduleTitle
                    });
                    level2 = new Menu({
                        pageCode: menu[h].subMenuList[j].moduleCode+"Detail",
                        positionId: "layout_manage",
                        layoutId: "layout_manage",
                        label: menu[h].subMenuList[j].moduleTitle+"详情"
                    });
                    level1.addChild(level2);
                    nodeNavbar.addChild(level1);//右侧导航显示
                }
                nodeHeader.addChild(nodeNavbar);
                me.pageTree.addChild(nodeHeader);
        	}
        	me.getPageMapping();
        }
        
        Config.prototype.getMenu = function(menu){
        	var  url = "/platfrom/userSubMenu";
        	var me = this;
        	//同步请求菜单
        	//url, param, skipValidation,useCache,async
            requestUtil.post(url, null,null,null,false).then(function(result) {
            	me.setMenu(result.data);
            });
        }

        Config.prototype.loadPage = function (pageCode, pageConfig, para, callback) {
            var me = this;
            if (!pageCode) {
                alert("config loadPage pageCode undefined");
                return;
            }

            var reqArr = [];
            reqArr.push('portal/' + requestUtil.setting.appCode + "/" + pageConfig.scriptPath);
            reqArr.push('text!../../template/portal/' + requestUtil.setting.appCode + "/" + pageConfig.scriptPath + ".html");
            if (pageConfig && pageConfig.hasCss) {
                reqArr.push('css!../../theme/default/css/' + requestUtil.setting.appCode + "/" + pageConfig.scriptPath);
            }
            requirejs(reqArr, function (widgt, tpl) {
                widgt.pageCode = pageCode;
                widgt.config = pageConfig;
                widgt.parameter = para;
                widgt.$template = $(tpl);
                widgt.baseShow();
                callback(widgt);
            });
        };

        Config.prototype.getMenuMapping = function (code) {
            var me = this;
            return me.layoutPageMapping[code];
        };

        Config.prototype.getPageInfo = function (pageCode) {
            var me = this;
            var def = new $.Deferred();
            //菜单未初始化则从local读取
            if(me.pageTree.children.length == 0){
            	sysMenu = dataUtil.get(dataUtil.KEY_MENU);
            	me.setMenu(sysMenu);
            }
            var page = me.pageMapping[pageCode];
            if (page && (!(page.isMenu && !page.children.length) || page.triggerCode)) {
            	return def.resolve(page).promise();
            }
        	alert("您无访问此页的权限！pageCode:" + pageCode);
			window.location.href = requestUtil.setting.LOGIN_URI + "&type=skipauto";
            return def.promise();
        };
        
        
        Config.prototype.getHeaderMenu = function () {
            var me = this;
            var def = new $.Deferred();
            //菜单未初始化则从local读取
            if(me.pageTree.children.length == 0){
            	sysMenu = dataUtil.get(dataUtil.KEY_MENU);
            	me.setMenu(sysMenu);
            }
            
            var headerMenu = me.pageTree.children;
            if (headerMenu && headerMenu.length > -1) {
            	return def.resolve(headerMenu).promise();
            }
            alert("您无访问此页的权限！");
			window.location.href = requestUtil.setting.LOGIN_URI + "&type=skipauto";
            return def.promise();
        };
        
        return new Config();
    });