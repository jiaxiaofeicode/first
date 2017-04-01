var ds = null;
var dx = null;
mui.plusReady(function() {
	if(location.href.indexOf("?xyz=") < 0) {
		location.href = location.href + "?xyz=" + Math.random();
	} else {
		var editId = localStorage.getItem("editId");
		if(editId != null) {
			initNavigationEdit();
			initForm(editId, 'edit');
			$("#next").click(function(event, path) {
				if($("input[name='conclusion']:checked").val() == 4) {
					var btnArray = ['否', '是'];
					mui.confirm('房屋为整体危房,请确定是否保存？', '提示', btnArray, function(e) {
						if(e.index == 1) {
							doEdit(editId, path);
						}
					});
				} else {
					doEdit(editId, path);
				}

			});
		} else {
			initNavigationAdd();
			initForm(localStorage.getItem("itemId"), 'add');
			$("#next").click(function() {
				if($("input[name='conclusion']:checked").val() == 4) {
					var btnArray = ['否', '是'];
					mui.confirm('房屋为整体危房,请确定是否保存？', '提示', btnArray, function(e) {
						if(e.index == 1) {
							doAdd();
						}
					});
				} else {
					doAdd();
				}

			});

		}
	}
});

function toEdit(editId, flag) {
	var url = ip + "/report.do?command=getById";
	var args = {};
	args["id"] = editId;
	plus.nativeUI.showWaiting("加载中...");
	mui.ajax(url, {
		data: args,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			var report = data.success;
			//判断json是否为空
			if(jQuery.isEmptyObject(report)) {
				plus.nativeUI.closeWaiting();
				return;
			}
			inputTools.echoValue("radio", 1, "roof", report.roof, 4);
			inputTools.echoValue("radio", 1, "floor", report.floor, 4);
			inputTools.echoValue("radio", 1, "doors_and_windows", report.doors_and_windows, 4);
			inputTools.echoValue("radio", 1, "eave", report.eave, 4);
			inputTools.echoValue("radio", 1, "roof_plastering", report.roof_plastering, 4);
			inputTools.echoValue("radio", 1, "ceiling", report.ceiling, 4);

			inputTools.echoValue("radio", 1, "expert_conclusion", report.expert_conclusion, 4);
			inputTools.echoValue("radio", 1, "danger_level", report.danger_level, 4);
			inputTools.echoValue("radio", 1, "base_danger_level", report.base_danger_level, 4);

			var ds_i_danger_level = report.ds_i_danger_level.split(inputTools.b);
			for(i in ds_i_danger_level) {
				$("input[type=radio][name='on_floor" + i + "'][value='" + ds_i_danger_level[i] + "']").attr("checked", 'checked');
			}
			var dx_i_danger_level = report.dx_i_danger_level.split(inputTools.b);
			for(i in dx_i_danger_level) {
				$("input[type=radio][name='underground" + i + "'][value='" + dx_i_danger_level[i] + "']").attr("checked", 'checked');
			}
			//房屋鉴定结论
			inputTools.echoValue("radio", 1, "proportion", report.proportion, 4);
			if(!flag) {
				inputTools.echoValue("radio", 1, "conclusion", report.conclusion, 4);
				inputTools.echoValue("radio", 1, "advice", report.advice, 4);
				//总危险面积与鉴定房屋比值
				inputTools.echoValue("radio", 1, "wxmjbz", report.wxmjbz, 4);
			}

			//危险点查勘情况
			//inputTools.echoValue("radio", 1, "wxdckqk", report.wxdckqk, 4);

			/*//建筑基本情况
			inputTools.echoValue("radio", 2, "plate_form", report.plate_form, 3);

			inputTools.echoValue("radio", 1, "wmxs", report.wmxs, 2);
			inputTools.echoValue("radio", 2, "jzcx", report.jzcx, 3);
			$("#snwgc").val(report.snwgc);
			//各层净高
			var on_floor_m = report.on_floor_m.split(inputTools.b);
			for(i in on_floor_m) {
				$("#on_floor_m" + i).val(on_floor_m[i]);
			}
			var underground_m = report.undergrand_m.split(inputTools.b);

			for(i in underground_m) {
				$("#underground_m" + i).val(underground_m[i]);
			}

			//地基处理
			$("#djcl").val(report.djcl);
			$("#jcxs").val(report.jcxs);
			$("#jcsd").val(report.jcsd);

			inputTools.echoValue("checkbox", 3, "sxczgj", report.sxczgj, 5);
			//梁
			inputTools.echoValue("checkbox", 2, "bridge", report.bridge, 3);

			//板
			inputTools.echoValue("checkbox", 2, "board", report.board, 5);

			//屋架
			inputTools.echoValue("checkbox", 2, "wj", report.wj, 4);

			$("#ytbg").val(report.ytbg);
			$("#gkj").val(report.gkj);
			$("#xsjg").val(report.xsjg);

			$("#zh").val(report.zh);
			$("#cgqk").val(report.cgqk);
			$("#czqk").val(report.czqk);
			inputTools.echoValue("checkbox", 2, "remark", report.remark, 3);*/
			plus.nativeUI.closeWaiting();
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.alert("网络异常,请稍后重试");
		}
	});
}

function doEdit(editId, path) {

	var url = ip + "/report.do?command=doEdit";
	var args = getValues();
	if(args == null) {
		return;
	}
	args["pro_item_id"] = editId;
	plus.nativeUI.showWaiting("加载中...");
	mui.ajax(url, {
		data: args,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			var success = data.success;
			if(path == null) {
				if(success != 0) {
					window.location.href = "sitePic.html";
				} else {
					mui.alert('修改失败', '提示');
				}
			} else {
				window.location.href = path;
			}
			plus.nativeUI.closeWaiting();
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.alert("网络异常,请稍后重试");
		}
	});
}

function initConclusionForm(item, type) {
	$("#build_name").text(item.build_name);
	ds = item.on_floor;
	dx = item.underground;
	var div = '';
	if(type == 1) {
		$("#jdyj").text("《房屋完损等级评定标准》 城住字（1984）第678号");
		div = type1Div;

	}
	if(type == 2) {
		$("#jdyj").text("《危险房屋鉴定标准》       JGJ 125-2016");
		div = type2Div;
	}
	if(type == 3) {
		$("#jdyj").text("《危险房屋鉴定标准》       JGJ 125-2016");
		div = type3Div;
	}
	$("#report_conclusion").append(div);
	if(type == 3) {
		for(var i = 0; i < ds; i++) {
			var name = "on_floor" + (i);
			var div = '<div class="mui-card padding-10"><div class="mui-table-view"><h5 class="mui-pull-left bottom-15 left-15">地上第' + (i + 1) + '层危险性等级：</div><div class="mui-clearfix"></div><span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50"><input name="' + name + '" type="radio" value="1">A<sub>u</sub>级</span><span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50"><input name="' + name + '" type="radio" value="2">B<sub>u</sub>级</span><span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50"><input name="' + name + '" type="radio" value="3">C<sub>u</sub>级</span><span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50"><input name="' + name + '" type="radio" value="4">D<sub>u</sub>级</span></div>';
			$("#on_floor").append(div);
		}
		for(var i = 0; i < dx; i++) {
			var name = "underground" + (i);
			var div = '<div class="mui-card padding-10"><div class="mui-table-view"><h5 class="mui-pull-left bottom-15 left-15">地下第' + (i + 1) + '层危险性等级：</div><div class="mui-clearfix"></div><span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50"><input name="' + name + '" type="radio" value="1">A<sub>u</sub>级</span><span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50"><input name="' + name + '" type="radio" value="2">B<sub>u</sub>级</span><span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50"><input name="' + name + '" type="radio" value="3">C<sub>u</sub>级</span><span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50"><input name="' + name + '" type="radio" value="4">D<sub>u</sub>级</span></div>';
			$("#underground").append(div);
		}
	}
	//加载计算规则
	initRule(ds, dx, type);
	plus.nativeUI.closeWaiting();
}

function initForm(itemId, type) {
	var url = ip + "/item.do?command=getFormTypeById";
	var args = {};
	args["id"] = itemId;
	var isNumArr = new Array();
	plus.nativeUI.showWaiting("加载中...");
	mui.ajax(url, {
		data: args,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if(data == null) {
				var btnArray = ['确定'];
				mui.confirm('房屋概况或查勘信息没有填写,请先填写后再写鉴定报告', '提示', btnArray, function(e) {
					if(e.index == 0) {
						window.location.href = "basic_information.html";
					}
				});

			} else {
				var item = data.item;
				var info = data.info;
				//若为第二种表单则强制该值
				var flag = false;
				if(info.ckyp == 2) {
					initConclusionForm(item, 1);
					//危险点查勘自动生成
					inputTools.echoValue("radio", 1, "wxdckqk", data.checkIsExistPoint, 2);
				} else if(info.ckyp == 1 && item.on_floor <= 2) {
					initConclusionForm(item, 2);
					flag = true;
				} else if(info.ckyp == 1 && item.on_floor > 2) {
					initConclusionForm(item, 3);
				}

				//加载数字表单验证
				isNumArr.push("snwgc");
				isNumArr.push("sxczgj1_1");
				isNumArr.push("sxczgj1_2");
				isNumArr.push("sxczgj2");
				isNumArr.push("sxczgj3");
				isNumArr.push("sxczgj4");
				validator.isNum(isNumArr);
				//若是修改,回显数据
				if(type == 'edit') {
					toEdit(itemId, flag);
				}
				//初始化表单是否可用
				initInputType();
			}

		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.alert("网络异常,请稍后重试");
		}
	});

}

function doAdd() {
	var url = ip + "/report.do?command=doAdd";
	var args = getValues();
	var itemId = localStorage.getItem("itemId");
	args["pro_item_id"] = itemId;
	plus.nativeUI.showWaiting("加载中...");
	mui.ajax(url, {
		data: args,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			var id = data.success;
			if(id != -1) {
				window.location.href = "sitePic.html";
			} else {
				mui.alert('保存失败,请重试', '提示');
			}
			plus.nativeUI.closeWaiting();
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.alert("网络异常,请稍后重试");
		}
	});
}

function getValues() {

	var json = {};
	json["roof"] = $("input[name='roof']:checked").val();
	json["floor"] = $("input[name='floor']:checked").val();
	json["doors_and_windows"] = $("input[name='doors_and_windows']:checked").val();
	json["eave"] = $("input[name='eave']:checked").val();
	json["roof_plastering"] = $("input[name='roof_plastering']:checked").val();
	json["ceiling"] = $("input[name='ceiling']:checked").val();
	//房屋完损鉴定结论
	json["expert_conclusion"] = $("input[name='expert_conclusion']:checked").val();
	json["danger_level"] = $("input[name='danger_level']:checked").val();
	json["base_danger_level"] = $("input[name='base_danger_level']:checked").val();
	var ds_i_danger_level = "";
	var on_floor_m = "";
	for(var i = 0; i < ds; i++) {
		var ds_level = $('input[name="on_floor' + i + '"]:checked').val();
		if(ds_level == undefined) {
			ds_level = "";
		}
		ds_i_danger_level += ds_level;
		if(i < ds - 1) {
			ds_i_danger_level += inputTools.b;
		}
	}

	var dx_i_danger_level = "";
	var underground_m = "";
	for(var i = 0; i < dx; i++) {
		var dx_level = $('input[name="underground' + i + '"]:checked').val();
		if(dx_level == undefined) {
			dx_level = "";
		}
		dx_i_danger_level += dx_level;
		if(i < dx - 1) {
			dx_i_danger_level += inputTools.b;
		}
	}
	json["ds_i_danger_level"] = ds_i_danger_level;
	json["dx_i_danger_level"] = dx_i_danger_level;

	json["proportion"] = $("input[name='proportion']:checked").val();

	//房屋危险鉴定结论(自动生成)
	json["conclusion"] = $("input[name='conclusion']:checked").val();
	//维修处理建议(自动生成)
	json["advice"] = $("input[name='advice']:checked").val();
	//危险点查勘情况
	json["wxdckqk"] = $("input[name='wxdckqk']:checked").val();
	//总危险面积与鉴定房屋比值
	json["wxmjbz"] = $("input[name='wxmjbz']:checked").val();

	/*json["plate_form"] = inputTools.getInputValue("radio", 2, "plate_form", 3);

	json["wmxs"] = $("input[name='wmxs']:checked").val();

	json["jzcx"] = inputTools.getInputValue("radio", 2, "jzcx", 3);

	json["snwgc"] = $("#snwgc").val();

	json["djcl"] = $("#djcl").val();
	json["jcxs"] = $("#jcxs").val();
	json["jcsd"] = $("#jcsd").val();

	json['sxczgj'] = inputTools.getInputValue("checkbox", 3, "sxczgj", 5);

	//桥
	json['bridge'] = inputTools.getInputValue("checkbox", 2, "bridge", 3);


	//梁
	json['board'] = inputTools.getInputValue("checkbox", 2, "board", 5);

	json['wj'] = inputTools.getInputValue("checkbox", 2, "wj", 4);

	json["ytbg"] = $("#ytbg").val();
	json["gkj"] = $("#gkj").val();
	json["xsjg"] = $("#xsjg").val();
	json["zh"] = $("#zh").val();
	json["cgqk"] = $("#cgqk").val();
	json["czqk"] = $("#czqk").val();
	json['remark'] = inputTools.getInputValue("checkbox", 2, "remark", 3);*/
	for(i in json) {
		if(json[i] == undefined) {
			json[i] = "";
		}
	}

	return json;

}

function chk(checkBoxName) { //jquery获取复选框值 
	var chk_value = [];
	$('input[name="' + checkBoxName + '"]:checked').each(function() {
		chk_value.push($(this).val());
	});
	return chk_value;
}
/**
 * 初始化计算规则
 */
function initRule(ds_, dx_, type) {
	if(type == 1) {
		var names = ["roof", "floor", "doors_and_windows", "eave", "roof_plastering", "ceiling"];
		//var otherBindNames = ["wxdckqk"];
		complete.bindCheck(names, type);
	}
	if(type == 2) {
		$("input[type=radio][name='wxmjbz'][value='4']")[0].checked = true;
		$("input[type=radio][name='conclusion'][value='4']")[0].checked = true;
		$("input[type=radio][name='advice'][value='4']")[0].checked = true;
	}
	if(type == 3) {
		var names = new Array();
		names.push("danger_level"); //地基危险等级
		names.push("proportion"); //整体结构危险构建综合比例
		names.push("base_danger_level"); //基础层
		for(var i = 0; i < ds_; i++) {
			names.push("on_floor" + i);
		}
		for(var i = 0; i < dx_; i++) {
			names.push("underground" + i);
		}
		complete.bindCheck(names, type);
	}

	/*var checkNames3 = new Array();
	checkNames3.push('conclusion');
	checkNames3.push('expert_conclusion');
	complete.bindCheck(checkNames3,3);*/
}
var type1Div = '﻿<h4 class="mui-content-padded">房屋组成部分鉴定结论</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<h5 class="mui-pull-left bottom-15 left-15">屋面：</div>' +
	'<div class="mui-clearfix"></div>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="roof" type="radio" value="1"> 完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="roof" type="radio" value="2">基本完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="roof" type="radio" value="3">一般损坏' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="roof" type="radio" value="4">严重损坏' +
	'</span>' +
	'</div>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<h5 class="mui-pull-left bottom-15 left-15">楼地面：</div>' +
	'<div class="mui-clearfix"></div>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input type="radio" name="floor"  value="1"> 完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input type="radio" name="floor"  value="2"> 基本完好' +
	'</span>' +
	'<label class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input type="radio" name="floor" value="3"> 一般损坏' +
	'</label>' +
	'<label class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="floor" type="radio" value="4">严重损坏' +
	'</label>' +
	'</div>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<h5 class="mui-pull-left bottom-15 left-15">门窗：</div>' +
	'<div class="mui-clearfix"></div>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="doors_and_windows" type="radio" value="1">完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="doors_and_windows" type="radio" value="2">基本完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="doors_and_windows" type="radio" value="3">一般损坏' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="doors_and_windows" type="radio" value="4">严重损坏' +
	'</span>' +
	'</div>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<h5 class="mui-pull-left bottom-15 left-15">外檐：</div>' +
	'<div class="mui-clearfix"></div>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="eave" type="radio" value="1">完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="eave" type="radio" value="2">基本完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="eave" type="radio" value="3">一般损坏' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="eave" type="radio" value="4">严重损坏' +
	'</span>' +
	'</div>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<h5 class="mui-pull-left bottom-15 left-15">内抹灰：</div>' +
	'<div class="mui-clearfix"></div>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="roof_plastering" type="radio" value="1">完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="roof_plastering" type="radio" value="2">基本完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="roof_plastering" type="radio" value="3">一般损坏' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="roof_plastering" type="radio" value="4">严重损坏' +
	'</span>' +
	'</div>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<h5 class="mui-pull-left bottom-15 left-15">顶棚：</div>' +
	'<div class="mui-clearfix"></div>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="ceiling" type="radio" value="1">完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="ceiling" type="radio" value="2">基本完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="ceiling" type="radio" value="3">一般损坏' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="ceiling" type="radio" value="4">严重损坏' +
	'</span>' +
	'</div>' +
	'' +
	'<h4 class="mui-content-padded">房屋完损鉴定结论*</h4>' +
	'<div class="mui-card  padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="expert_conclusion" type="radio" value="1">完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="expert_conclusion" type="radio" value="2">基本完好' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="expert_conclusion" type="radio" value="3">一般损坏' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="expert_conclusion" type="radio" value="4">严重损坏' +
	'</span>' +
	'</div>' +
	'</div>' +
	'' +
	'<h4 class="mui-content-padded">危险点查勘情况*</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="wxdckqk" type="radio" value="1">未发现危险点' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="wxdckqk" type="radio" value="2">发现危险点' +
	'</span>' +
	'</div>' +
	'</div>' +
	'' +
	'<h4 class="mui-content-padded">维修处理建议</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="1">综合维修' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="2">大修加固' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="3">大修加固后综合维修' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="4">翻修工程' +
	'</span>' +
	'</div>' +
	'</div>';

var type2Div =
	'<h4 class="mui-content-padded">总危险面积与鉴定房屋面积比值*</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="wxmjbz" type="radio" value="1">R=0' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="wxmjbz" type="radio" value="2">0&lt;R≤5%' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="wxmjbz" type="radio" value="3">5%&lt;R≤25%' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="wxmjbz" type="radio" value="4">R&gt;25%' +
	'</span>' +
	'</div>' +
	'</div>' +
	'' +
	'<h4 class="mui-content-padded">房屋危险等级结论*</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="conclusion" type="radio" value="1">A级:无危险点' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="conclusion" type="radio" value="2">B级:有危险点' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="conclusion" type="radio" value="3">C级:局部危险' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="conclusion" type="radio" value="4">D级:整体危险' +
	'</span>' +
	'</div>' +
	'</div>' +
	'<h4 class="mui-content-padded">维修处理建议</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="1">综合维修' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="2">大修加固' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="3">大修加固后综合维修' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="4">翻修工程' +
	'</span>' +
	'</div>' +
	'</div>';
var type3Div = '﻿<h4 class="mui-content-padded">地基危险性等级*</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="danger_level" type="radio" value="1">非危险状态' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="danger_level" type="radio" value="2">危险状态' +
	'</span>' +
	'</div>' +
	'</div>' +
	'' +
	'<h4 class="mui-content-padded">基础及上部结构楼层危险性等级*</h4>' +
	'' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<h5 class="mui-pull-left bottom-15 left-15">基础层危险性等级：</div>' +
	'<div class="mui-clearfix"></div>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="base_danger_level" type="radio" value="1">A<sub>u</sub>级' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="base_danger_level" type="radio" value="2">B<sub>u</sub>级' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="base_danger_level" type="radio" value="3">C<sub>u</sub>级' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="base_danger_level" type="radio" value="4">D<sub>u</sub>级' +
	'</span>' +
	'</div>' +
	'' +
	'<div id="on_floor"></div>' +
	'<div id="underground"></div>' +
	'' +
	'' +
	'<h4 class="mui-content-padded">整体结构危险构建综合比例*</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="proportion" type="radio" value="1">R=0' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="proportion" type="radio" value="2">0&lt;R&lt;5%' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="proportion" type="radio" value="3">5%≤R&lt;25%' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="proportion" type="radio" value="4">R≥25%' +
	'</span>' +
	'</div>' +
	'</div>' +
	'' +
	'<h4 class="mui-content-padded">房屋危险等级结论*</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="conclusion" type="radio" value="1">A级:无危险点' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="conclusion" type="radio" value="2">B级:有危险点' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="conclusion" type="radio" value="3">C级:局部危险' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="conclusion" type="radio" value="4">D级:整体危险' +
	'</span>' +
	'</div>' +
	'</div>' +
	'<h4 class="mui-content-padded">维修处理建议</h4>' +
	'<div class="mui-card padding-10">' +
	'<div class="mui-table-view">' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="1">综合维修' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="2">大修加固' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="3">大修加固后综合维修' +
	'</span>' +
	'<span class="mui-col-xs-3 mui-col-sm-3 mui-block mui-pull-left mui-radio mui-left left-50">' +
	'<input name="advice" type="radio" value="4">翻修工程' +
	'</span>' +
	'</div>' +
	'</div>';