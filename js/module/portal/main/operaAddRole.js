define([ 'util/requestUtil', 'core/base', 'util/sessionUtil', 'util/domUtil',
    'portal/main/config', '../../../lib/ace/ace','../../../lib/bootstrap.min','../../../lib/transfer','../../../lib/jquery.treeview','../../../lib/jquery.easyui.min'], function(requestUtil, Base,
                                                                                                                                                                                 sessionUtil, domUtil, config) {
    var OperaAddUser = function() {
    };

    var state ="UNKNOW";
    OperaAddUser.prototype = new Base();
    // 页面初始化
    OperaAddUser.prototype.create = function() {
        var me = this;
        me.renderMainContent("tpl_operaAddUser");
        me.initAceEditor();

    };
    //根据传入的状态设置右上角按钮文字及传入后台的内容
    OperaAddUser.prototype.switchState = function(state) {
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
    OperaAddUser.prototype.postContent = function(state) {
        var me = this;
        var url = "manageUser/addRole";
        var userRoleName = me.find(".userRoleName").val();
        var roleDsc = me.find(".roleDsc").val();
        var usid =  me.parameter.roleId;
        var authMenu = $("#authMenu").val();
        // var testDemo = editorDemo.getValue();
        // 验证标题与内容
        if (userRoleName.length <= 0) {
            alert('请填写角色名');
            return;
        }
        if (roleDsc.length <= 0) {
            alert('请填写角色描述');
            me.find(".roleDsc").focus();
            return;
        }
        var data = {
            "roleName" : userRoleName,
            "comments" : roleDsc,
            "id":usid,
            "authMenu":authMenu

        };
        if(state == 'SAVED')
        {
            var sl ="";
            $('input[name="chkbox"]:checked').each(function(){
                sl =$(this).val()+"-";
            });
            alert(sl);
            $('#authMenu').val(sl);
            //alert("save");
            url = "/manageUser/addRole";
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    //me.find("#ruleGroupId").val(result.data);
                    alert("保存成功");
                    me.moveTo('operaRoleList');
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
            var usid =  me.parameter.roleId;

            url = "/manageUser/updateRole";
            requestUtil.post(url, data).then(function(result) {
                if (result.code == 200) {
                    //me.find("#ruleGroupId").val(result.data);
                    alert("修改成功");
                    me.moveTo('operaRoleList');
                } else {
                    alert("修改失败");
                }
            });
        }

    };

    OperaAddUser.prototype.bindInitEvent = function() {

        // $(function(){


        $("[name=chkbox]").click(function(){

            //var selectChks = $("input[type=checkbox][name=productItem]:checked");
            //alert("???");
            //当选中或取消一个权限时，也同时选中或取消所有的下级权限
            $(this).siblings("ul").find("input").attr("checked",this.checked);

            //当选中一个权限时，也要选中所有的直接上级权限
            if(this.checked ==true){
                $(this).parents("li").children("input").attr("checked",true);
            }

            //当某一个父权限下的子权限都不选中时，该父权限也不选中
            var elements=$(this).parent("li").parent("ul").find("input");
            var num=elements.length;
            /*alert(num);*/
            var a=0;
            for(var i=0;i<num;i++){
                if(elements[i].checked==false){
                    a++;
                }
            }
            if(a==num){
                $(this).parent("li").parent("ul").siblings("input").attr("checked",false);
            }

            var sl ="";
            $('input[name="chkbox"]:checked').each(function(){
                sl =sl+$(this).val()+"-";
            });
            alert(sl);
            alert(sl.replace('on-',''));
            $('#authMenu').val(sl.replace('on-',''));
        });
        //});

        var me = this;
        me.find('.default-btn').on('click', function() {
            var x =  me.parameter.roleId;
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
    OperaAddUser.prototype.show = function() {
        var me = this;
        me.renderPage();
    };

    OperaAddUser.prototype.renderPage = function() {
        var me = this;
    };

    // 清空数据
    OperaAddUser.prototype.clearList = function() {
        var me = this;
    };

    // 页面隐藏
    OperaAddUser.prototype.hide = function() {
        var me = this;
    };

    // 页面弹窗
    OperaAddUser.prototype.popupWindow = function() {
        var me = this;

    };

    // 初始化ace
    OperaAddUser.prototype.initAceEditor = function() {
        //系统菜单拼接start
        var url = "/system/menutree?limit=100&offset=0";
        requestUtil.get(url).then(function (result) {
            if (result.success) {
                alert("拼接");
                var data = result.data;
                for (var v in data) {

                    var subMenuHtml="";
                    for (var b in data[v].subMenuList) {
                        //alert(data[v].subMenuList[b].id);-++
                        subMenuHtml =subMenuHtml+ "<ul>\n" +
                            " <li><input type=\"checkbox\" id=\"cb"+data[v].subMenuList[b].id+'"'+ " value="+data[v].subMenuList[b].id+" name=\"chkbox\">\n" +
                            " <label for=\"cb11\">"+data[v].subMenuList[b].moduleTitle+"</label></li>";
                    }

                    $('#appendtree').append(" <li>\n" +
                        "<input type=\"checkbox\" id=\"cb"+data[v].parentMenu.id+'"'+ "value="+data[v].parentMenu.id+"  name=\"chkbox\">\n" +
                        "<label for=\"cb1\">"+data[v].parentMenu.moduleTitle+"</label>"+"<ul>"+subMenuHtml+"</ul></li>");

                }
                me.bindInitEvent();
            }
        });

        //系统菜单拼接end


        $("#tree").treeview();

        function getChecked(){
            var nodes = $('#tt').tree('getChecked');
            var s = '';
            for(var i=0; i<nodes.length; i++){
                if (s != '') s += ',';
                s += nodes[i].text;
            }
            //alert(s);
        }

        /*  $(document).ready(function(){
              $("#browser").treeview({
                  toggle: function() {
                      console.log("%s was toggled.", $(this).find(">span").text());
                  }
              });

              $("#add").click(function() {
                  alert("add");
                  var branches = $("<li><span class='folder'>New Sublist</span><ul>" +
                      "<li><span class='file'>Item1</span></li>" +
                      "<li><span class='file'>Item2</span></li></ul></li>").appendTo("#browser");
                  $("#browser").treeview({
                      add: branches
                  });
              });
          });*/
        var me = this;
        //alert(me.parameter.roleId);
        //如果有ID则填充内容
        if(me.parameter.roleId){

            //alert("详情")
            //var url = "/manageUser/role/"+me.parameter.roleId;
            var url ="/manageUser/role/"+me.parameter.roleId
            requestUtil.get(url,null).then(function(result) {
                if (result.code == 200) {
                    //alert(result.data.systemRole.roleName);
                    var userRoleName = result.data.systemRole.roleName;
                    var comments = result.data.systemRole.comments;
                    me.find(".userRoleName").val(userRoleName);
                    me.find(".roleDsc").val(comments);

                    for (var b in result.data.retuList) {
                        var o = "cb"+result.data.retuList[b].moduleId;
                        $("#"+o).attr("checked",true);

                    }

                }else{

                }
            });
        }

    };


    return new OperaAddUser();
})