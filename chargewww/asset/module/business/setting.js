require.config({
	paths: {
		jquery : "lib/jquery/jquery-2.1.4"
	}
});
require([
	"common/index",
	"common/table/avalon.table"
],function(Index){
	Index.top.curIndex = 3;
	var content = avalon.define({
		$id : "content",
		$userTbOpts : {
			title : "VIP用户列表",
			columns : [
				{title : "姓名",field : "customer_name"},
				{title : "类型",field : "vip_type",formatter : Index.getCarType},
				{title : "车牌号码",field : "car_license_number"},
				{title : "有效期",field : "date",
					formatter : function(v,r){
						return r.vip_begin_time + "~<br>" + r.vip_end_time;
					}
				},
				{title : "安保",field : "is_open_safe_mode",
					formatter : function(v){
						return v === "0" ? "<span class='fz2 text-danger'>×</span>" : 
							"<span class='fz2 text-success'>√</span>";
					}
				},
				{title : "操作",field : "oper",
					formatter : function(){
						return "<a href='javascript:void(0)'>编辑</a> <a href='javascript:void(0)'>删除</a>"
					}
				}
			],
			frontPageData : []
		},
		parkingName : '--',
		add : function(){
			avalon.vmodels.$step.open();
		},
		$stepOpts : {
			title : "",
			buttons : [{
				text : "上一步",
				theme : "default",
				handler : function(vmodel){
					vmodel.step--;
				}
			},{
				text : "下一步",
				theme : "default",
				handler : function(vmodel){
					vmodel.step++;
				}
			},{
				text : "确定",
				theme : "default",
				handler : function(vmodel){

				}
			},{
				text : "取消",
				theme : "default",
				close : true
			}],
			step : -1,
			afterShow : function(isInit,vmodel){
				if(isInit){
					Index.initWidget("auth","table,$auth,$authOpts",vmodel);
				}
				vmodel.step = 0;
			},
			//step0
			$authOpts : {
				title : "通道权限列表",
				chooseAuth : "",
				columns : [
					{title : "选择",field : 'checkbox',align : "center",
						formatter : function(){
							return "<label class='checkbox-x1'><input type='radio' name='auth' ms-duplex='chooseAuth'><label>";
						}
					},
					{title : '通道权限名字',field : "channel_permission_group_name"},
					{title : '通道详细',field : "channelNames"},
					{title : "操作",field : "oper",
						formatter : function(){
							return "<a href='javascript:void(0)' ms-click='edit(item)'>编辑</a> "+
							"<a href='javascript:void(0)' ms-click='del'>删除</a>";
						}
					}
				],
				edit : function(item){
					var win = avalon.vmodels.$authWin;
					win.title = "编辑通道权限";
					win.$editAuth = item;
					win.authName = item.channel_permission_group_name;
					var seqList = item.seqList;
					avalon.each(document.querySelectorAll("#authWin-channelList input"),function(i,v){
						for(var i=0,ii;ii=seqList[i++];){
							if(ii === v.value){
								v.checked = true;
								return;
							}
						}
						v.checked = false;
					});
					win.open();
				},
				del : function(){

				},
				onInit : function(){
					refreshAuth();
				}
			},
			addEntrance : function(){
				var win = avalon.vmodels.$authWin;
				win.title = "添加通道权限";
				win.$editAuth = null;
				win.open();
			}
		},
		$authWinOpts : {
			$editAuth : null,
			title : "",
			channelMes : "",
			authNameMes : "",
			entranceData : [],
			changeEntrance : function(){
				avalon.vmodels.$authWin.channelMes = '';
			},
			authName : "",
			changeAuthName : function(){
				avalon.vmodels.$authWin.authNameMes = '';
			},
			onClose : function(vmodel){
				vmodel.authName = '';
			},
			buttons : [{
				text : "确定",
				theme : "default",
				handler : function(vmodel){
					var entrance = [];
					avalon.each(document.querySelectorAll("#authWin-channelList input"),function(i,v){
						if(v.checked){
							entrance.push(v.value);
						}
					});
					var authWin = avalon.vmodels.$authWin;
					if(entrance.length === 0){
						return authWin.channelMes = "请勾选通道";
					}
					if(authWin.authName === ''){
						return authWin.authNameMes = "请输入权限名称";
					}
					var grpList = [];
					var mappingList = [];
					if(authWin.$editAuth){
						var grpSeq = authWin.$editAuth.channel_permission_group_seq;
					}else{
						grpSeq = String(setAuthData.maxGrpSeq + 1);
					}
					//获取新的channel_permission_group_mapping
					for(var i=0,ii=entrance.length;i<ii;i++){
						mappingList.push({
							channel_permission_group_mapping_seq : String(setAuthData.maxMappingSeq + i + 1),
							entrance_channel_seq : entrance[i],
							channel_permission_group_seq : grpSeq
						});
					}
					if(authWin.$editAuth){
						//编辑
						grpList.push({
							channel_permission_group_seq : grpSeq,
							channel_permission_group_name : authWin.authName
						});
						//先删除channel_permission_group_mapping_seq
						SYNCHRONIZATION_CUSTOMER({
							synchronization_type : '3',
							permission_group_mapping_list : authWin.$editAuth.$mappList
						},authWin.widgetElement,function(){
							//再增加
							SYNCHRONIZATION_CUSTOMER({
								synchronization_type : '4',
								permission_group_list : grpList,
								permission_group_mapping_list : mappingList
							},authWin.widgetElement,function(){
								Index.alert("操作成功");
								authWin.close();
								authWin.authName = '';
								refreshAuth();
							});
						});
					}else{
						//添加
						grpList.push({
							channel_permission_group_seq : grpSeq,
							channel_permission_group_name : authWin.authName
						});
						SYNCHRONIZATION_CUSTOMER({
							synchronization_type : '2',
							permission_group_list : grpList,
							permission_group_mapping_list : mappingList
						},authWin.widgetElement,function(){
							Index.alert("操作成功");
							authWin.close();
							authWin.authName = '';
							refreshAuth();
						});
					}
				}
			},{
				text : "取消",
				theme : "default",
				close : true
			}]
		}
	});
	avalon.scan();
	avalon.vmodels.$step.$watch("step",function(newVal){
		var arr = ["选择通道权限","选择用户","选择车辆"];
		var step = avalon.vmodels.$step;
		step.title = arr[newVal];
		var buttons = step.buttons;
		if(newVal === 0){
			buttons[0].visible = false;
			buttons[1].visible = true;
			buttons[2].visible = false;
		}else if(newVal === 1){
			buttons[0].visible = true;
			buttons[1].visible = true;
			buttons[2].visible = false;
		}else{
			buttons[0].visible = true;
			buttons[1].visible = false;
			buttons[2].visible = true;
		}
	});
	function SYNCHRONIZATION_CUSTOMER(content,el,func){
		Index.websocket.send({
			command : "SYNCHRONIZATION_CUSTOMER",
			biz_content : content
		},el,function(data){
			if(data.code === "0" && data.msg === "ok"){
				func && func();
			}
		});
	}
	function getList(func){
		Index.websocket.send({
			command : "GET_CUSTOMER_INFOR"
		},document.body,function(data){
			func(data);
		});
	}
	//刷新页面的车场名称
	function refreshUserTb(){
		getList(setUserTbData);
	}
	function setUserTbData(data){
		var vip_customer_list = data.vip_customer_list;
		var vip_car_list = data.vip_car_list;
		for(var i=0,ii;ii=vip_car_list[i++];){
			for(var j=0,jj;jj=vip_customer_list[j++];){
				if(jj.vip_customer_seq === ii.vip_customer_seq){
					avalon.mix(ii,jj);
					break;
				}
			}
		}
		avalon.vmodels.$userTb.loadFrontPageData(vip_car_list);
	}
	//刷新通道权限列表
	function refreshAuth(){
		getList(setAuthData);
	}
	function setAuthData(data){
		var permission_group_list = data.permission_group_list;
		var permission_group_mapping_list = data.permission_group_mapping_list;
		var maxGrpSeq = 0;
		var maxMappingSeq = 0;
		for(var i=0,ii;ii=permission_group_list[i++];){
			if(+ii.channel_permission_group_seq > maxGrpSeq){
				maxGrpSeq = +ii.channel_permission_group_seq;
			}
			var seqList = [];
			var nameList = [];
			var mappList = [];
			for(var j=0,jj;jj=permission_group_mapping_list[j++];){
				if(+jj.channel_permission_group_mapping_seq > maxMappingSeq){
					maxMappingSeq = +jj.channel_permission_group_mapping_seq;
				}
				if(jj.channel_permission_group_seq === ii.channel_permission_group_seq){
					seqList.push(jj.entrance_channel_seq);
					nameList.push(getChannelNameBySeq(jj.entrance_channel_seq));
					mappList.push(jj);
				}
			}
			ii.seqList = seqList;
			ii.channelNames = nameList.join(",");
			ii.$mappList = mappList;
		}
		setAuthData.maxGrpSeq = maxGrpSeq;
		setAuthData.maxMappingSeq = maxMappingSeq;
		avalon.vmodels.$auth.loadFrontPageData(permission_group_list);
	}
	function getChannelNameBySeq(seq){
		for(var i=0,ii;ii=Entrance_channel_list[i++];){
			if(ii.entrance_channel_seq === seq){
				return ii.entrance_name;
			}
		}
		return '';
	}
	var Entrance_channel_list = [];
	Index.websocket.send({
		command : "GET_PARKING_LOT_BASE_DATE",
		biz_content : {
			request_time : avalon.filters.date(new Date(),"yyyy-MM-dd HH:mm:ss")
		}
	},document.body,function(data){
		Index.init();
		if(data.code === '0' && data.msg === "ok"){
			Entrance_channel_list = data.entrance_channel_list;
			avalon.vmodels.$authWin.entranceData = Entrance_channel_list;
			content.parkingName = data.parking_lot_list[0].parking_lot_name;
			getList(function(data){
				setUserTbData(data);
			});
		}
	});
});