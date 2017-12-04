define(['util/requestUtil', 'core/base', 'util/formatUtil',
    'util/sessionUtil', 'util/domUtil', 'util/dateUtil', 'mobiscroll', 'portal/main/config', 'echarts'], function (requestUtil, Base, formatUtil, sessionUtil, domUtil, dateUtil, mobiscroll, config, ec) {

    var staticQueryLog = function () {

    };
    staticQueryLog.prototype = new Base();

    var sessionId;

    staticQueryLog.prototype.queryParams = function () {
        var me = this;
        var sessionIdParameter = sessionId;
        var temp = { //
            sessionId: sessionIdParameter,
        };
        var startTime = me.find("#calendar").val();
        if (startTime.length > 0) {
            temp.startTime = startTime;
            temp.endTime = "";
        }
        return temp;
    };

    // 页面初始化
    staticQueryLog.prototype.create = function () {
        var me = this;
        me.renderMainContent("tpl_staticQueryLog");
        me.renderPage();
        me.bindEvent();
        me.find('#calendar').mobiscroll().calendar({
            theme: 'mobiscroll',
            lang: 'zh',
            display: 'bubble',
            buttons: [],
            showOnFocus: false,
            mode: 'clickpick',
            dateFormat: 'yy-mm-dd',
            onDayChange: function (day, inst) {
                date = dateUtil.dateFormat(dateUtil.DATE_PATTERN, day.date);
                me.find("#calendar").val(date);
                inst.hide();
            }
        });
    };

    staticQueryLog.prototype.renderPage = function () {
        var me = this;
        var url = "/QueryLog"
        requestUtil.post(url + "/getStaticsByHi", me.queryParams()).then(function (result) {
            if (result.success) {
                var data = result.data;
                me.createEchartsE1(result.data);
            }
        });
        requestUtil.post(url + "/staticByTimeUsed", me.queryParams()).then(function (result) {
            if (result.success) {
                var data = result.data;
                me.createEchartsE2(result.data);
            }
        });
        requestUtil.post(url + "/staticState", me.queryParams()).then(function (result) {
            if (result.success) {
                var data = result.data;
                me.createEchartsE3(result.data);
            }
        });
    };

    //渲染图表
    staticQueryLog.prototype.createEchartsE1 = function (option) {
        var me = this;
        var e_1 = ec.init(document.getElementById('e_1'),'shine');
        option_1 ={
            title: {
                text: '数据平台访问趋势图（分）',
                subtext:'默认当天/查询时段',
                x:"center"
            },
            color:['#277EAB'],
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: option.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'调用统计',
                    type:'line',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data:option.series
                }
            ]
        };
        e_1.setOption(option_1);
    };

    staticQueryLog.prototype.createEchartsE2 = function (option) {
        var e_2 = ec.init(document.getElementById('e_2'),'shine');
        option_2 = {
            title : {
                text: '数据平台访问用时分布',
                subtext: '默认当天/查询时段',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series : [
                {
                    name: '响应时间',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:option.series,
                    itemStyle: {
                        normal: {
                            label:{
                                show:true,
                                formatter:'{b} : {c} ({d}%)'
                            }},
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        e_2.setOption(option_2);
    }

    staticQueryLog.prototype.createEchartsE3 = function (option) {
        var e_3 = ec.init(document.getElementById('e_3'),'shine');
        option_3 = {
            title : {
                text: '数据平台访问状态分布',
                subtext: '默认当天/查询时段',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series : [
                {
                    name: '数据状态',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:option.series,
                    itemStyle: {
                        normal: {
                            label:{
                                show:true,
                                formatter:'{b} : {c} ({d}%)'
                            }},
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        e_3.setOption(option_3);
    }
    //清空数据
    staticQueryLog.prototype.clearList = function () {
        var me = this;
    };


    // 重新显示
    staticQueryLog.prototype.show = function () {

    };

    //页面点击
    staticQueryLog.prototype.bindEvent = function () {
        var me = this;

        me.find("a[name='searchBtn']").click(function () {
            me.renderPage()
        });

    };

    // 页面隐藏
    staticQueryLog.prototype.hide = function () {

    };

    return new staticQueryLog();
});