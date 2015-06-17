define(function(){
	function getText(list,v){
		for(var i=0,ii;ii=list[i++];){
			if(ii.v === v) return ii.t;
		}
		return "";
	}
	var DATA = {
		car_license_color : [
			{v : "0",t : "不支持"},{v : "1",t : "白"},{v : "2",t : "银"},{v : "3",t : "灰"},
			{v : "4",t : "黑"},{v : "5",t : "红"},{v : "6",t : "深蓝"},{v : "7",t : "蓝"},
			{v : "8",t : "黄"},{v : "9",t : "绿"},{v : "10",t : "棕"},{v : "11",t : "粉"},
			{v : "12",t : "紫"},{v : "13",t : "深灰"}
		],
		vip_type : [
			{v : "0",t : "未知"},{v : "1",t : "临时车"},{v : "2",t : "本地VIP"},
			{v : "3",t : "会员车/月租车"}
		],
		car_license_type : [
			{v : "0",t : "未定义"},{v : "1",t : "蓝牌白色"},{v : "2",t : "黄牌黑字"},
			{v : "3",t : "黑牌白字"},{v : "4",t : '白牌'}
		],
		car_type : [
			{v : "0",t : "未定义"},{v : "1",t : "轿车"},{v : "2",t : "货车"},
			{v : "3",t : "其它"}
		],
		car_logo : [
			{v : "0",t : "不支持"},{v : "1",t : "白"},{v : "2",t : "银"},{v : "3",t : "灰"},
			{v : "4",t : "黑"},{v : "5",t : "红"},{v : "6",t : "深蓝"},{v : "7",t : "蓝"},
			{v : "8",t : "黄"},{v : "9",t : "绿"},{v : "10",t : "棕"},{v : "11",t : "粉"},
			{v : "12",t : "紫"},{v : "13",t : "深灰"}
		],
		getVipType : function(type){
			return getText(DATA.vip_type,type);
		}
	};
	return DATA;
});