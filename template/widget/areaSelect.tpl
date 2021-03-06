<script id="area-select-template" type="text/x-jsrender">
<div class="popover area-select-list-popover" role="tooltip">
	<div class="arrow"></div>
  <h3 class="popover-title"></h3>
  <div class="popover-content">
	</div>
</div>
</script>

<script id="area-select-content-template" type="text/x-jsrender">
<div class="area-select-list" id="{{:uid}}">
	<ul class="nav nav-tabs" role="tablist">
		<li><a id="tabcontent-province-tab" href="javascript:void(0)" data-target="#{{:uid}} #tabcontent-province">省份</a></li>
		<li><a id="tabcontent-city-tab" href="javascript:void(0)" data-target="#{{:uid}} #tabcontent-city">市区</a></li>
		<li><a id="tabcontent-area-tab" href="javascript:void(0)" data-target="#{{:uid}} #tabcontent-area">区域</a></li>
	</ul>
	<div class="tab-content clearfix">
		<div class="tab-pane fade clearfix" level="province" title="省份" nextId="tabcontent-city" id="tabcontent-province"></div>
		<div class="tab-pane fade clearfix" level="city" title="市区" nextId="tabcontent-area" id="tabcontent-city"></div>
		<div class="tab-pane fade clearfix" level="area" title="区域" id="tabcontent-area"></div>
	</div>
</div>
</script>

<script id="area-select-item-template" type="text/x-jsrender">  
  <ul class="clearfix">
    {{for items}}
			<li><a areaId='{{:areaId}}' href="javascript:void(0)">{{:name}}</a></li>
  	{{/for}}
  </ul>
</script>
