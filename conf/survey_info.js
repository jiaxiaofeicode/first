var ds = null;
var dx = null;
mui.plusReady(function() {
	var editId = localStorage.getItem("editId");
	if(editId != null) {
		initNavigationEdit();
		initForm(editId, 'edit');
		$("#next").click(function(event, path) {
			doEdit(editId, path);
		});
	} else {
		initNavigationAdd();
		initForm(localStorage.getItem("itemId"), 'add');
		$("#next").click(function() {
			doAdd();
		});
	}
	//初始化检查规则

});

function toEdit(editId) {
	var url = ip + "/proInfo.do?command=getById";
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

			//建筑基本情况
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
			inputTools.echoValue("radio", 2, "djcl", report.djcl, 2);
			inputTools.echoValue("radio", 2, "jcxs", report.jcxs, 2);
			inputTools.echoValue("radio", 2, "jcsd", report.jcsd, 2);
			/*$("#djcl").val(report.djcl);
			$("#jcxs").val(report.jcxs);
			$("#jcsd").val(report.jcsd);*/

			inputTools.echoValue("checkbox", 3, "sxczgj", report.sxczgj, 5);
			//梁
			inputTools.echoValue("checkbox", 2, "bridge", report.bridge, 3);

			//板
			inputTools.echoValue("checkbox", 2, "board", report.board, 5);

			//屋架
			inputTools.echoValue("checkbox", 2, "wj", report.wj, 4);

		/*	$("#ytbg").val(report.ytbg);
			$("#gkj").val(report.gkj);
			$("#xsjg").val(report.xsjg);

			$("#zh").val(report.zh);
			$("#cgqk").val(report.cgqk);
			$("#czqk").val(report.czqk);*/
			inputTools.echoValue("radio", 2, "ytbg", report.ytbg, 2);
			inputTools.echoValue("radio", 2, "gkj", report.gkj, 2);
			inputTools.echoValue("radio", 2, "xsjg", report.xsjg, 2);
			inputTools.echoValue("radio", 2, "zh", report.zh, 2);
			inputTools.echoValue("radio", 2, "cgqk", report.cgqk, 2);
			inputTools.echoValue("radio", 2, "czqk", report.czqk, 2);
			
			inputTools.echoValue("radio", 1, "ckyp", report.ckyp, 2);
			inputTools.echoValue("checkbox", 2, "remark", report.remark, 3);
			plus.nativeUI.closeWaiting();
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.alert("网络异常,请稍后重试");
		}
	});
}

function doEdit(editId, path) {

	var url = ip + "/proInfo.do?command=doEdit";
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
					window.location.href = "authentication_report.html";
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

function initForm(itemId, type) {
	var url = ip + "/item.do?command=getById";
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
			var item = data.success;
			//房屋名称
			$("#build_name").text(item.build_name);
			ds = item.on_floor;
			dx = item.underground;
			//初始化表单
			for(var i = 0; i < item.on_floor; i++) {
				var name = "on_floor" + (i);
				var div1 = '<div class="mui-input-row"><label>地上' + (i + 1) + '层(m)</label><input type="text" class="mui-input-clear" placeholder="请输入高度..." id="on_floor_m' + i + '"></div>';
				$("#on_floor_m").append(div1);
				isNumArr.push("on_floor_m" + i);
			}
			for(var i = 0; i < item.underground; i++) {
				var name = "underground" + (i);
				var div1 = '<div class="mui-input-row"><label>地下' + (i + 1) + '层(m)</label><input type="text" class="mui-input-clear" placeholder="请输入高度..." id="underground_m' + i + '"></div>';
				$("#underground_m").append(div1);
				isNumArr.push("underground_m" + i);
			}

			//加载数字表单验证
			isNumArr.push("snwgc");
			isNumArr.push("sxczgj1_1");
			isNumArr.push("sxczgj1_2");
			isNumArr.push("sxczgj2");
			isNumArr.push("sxczgj3");
			isNumArr.push("sxczgj4");
			//isNumArr.push("sxczgj5");
			validator.isNum(isNumArr);
			//若是修改,回显数据
			if(type == 'edit') {
				toEdit(itemId);
			}
			//初始化表单是否可用
			initInputType();
			plus.nativeUI.closeWaiting();
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.alert("网络异常,请稍后重试");
		}
	});

}

function doAdd() {
	var url = ip + "/proInfo.do?command=doAdd";
	var args = getValues();
	if(args == null) {
		return;
	}
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
				window.location.href = "authentication_report.html";
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
	if($.trim(inputTools.getInputValue("radio", 1, "ckyp", 2)) == "") {
		mui.alert('查勘研判不得为空', '提示');
		return;
	}
	var json = {};
	var on_floor_m = "";
	for(var i = 0; i < ds; i++) {
		on_floor_m += $('input[id="on_floor_m' + i + '"]').val();
		if(i < ds - 1) {
			on_floor_m += inputTools.b;
		}
	}

	var underground_m = "";
	for(var i = 0; i < dx; i++) {
		underground_m += $('input[id="underground_m' + i + '"]').val();
		if(i < dx - 1) {
			underground_m += inputTools.b;
		}
	}
	json["on_floor_m"] = on_floor_m;
	json["undergrand_m"] = underground_m;

	json["plate_form"] = inputTools.getInputValue("radio", 2, "plate_form", 3);

	json["wmxs"] = $("input[name='wmxs']:checked").val();

	json["jzcx"] = inputTools.getInputValue("radio", 2, "jzcx", 3);

	json["snwgc"] = $("#snwgc").val();

/*	json["djcl"] = $("#djcl").val();
	json["jcxs"] = $("#jcxs").val();
	json["jcsd"] = $("#jcsd").val();*/
	json["djcl"] = inputTools.getInputValue("radio", 2, "djcl", 2);
	json["jcxs"] = inputTools.getInputValue("radio", 2, "jcxs", 2);
	json["jcsd"] = inputTools.getInputValue("radio", 2, "jcsd", 2);
	json['sxczgj'] = inputTools.getInputValue("checkbox", 3, "sxczgj", 5);

	//桥
	json['bridge'] = inputTools.getInputValue("checkbox", 2, "bridge", 3);

	//梁
	json['board'] = inputTools.getInputValue("checkbox", 2, "board", 5);

	json['wj'] = inputTools.getInputValue("checkbox", 2, "wj", 4);
	
	json["ytbg"] = inputTools.getInputValue("radio", 2, "ytbg", 2);
	json["gkj"] = inputTools.getInputValue("radio", 2, "gkj", 2);
	json["xsjg"] = inputTools.getInputValue("radio", 2, "xsjg", 2);
	json["zh"] = inputTools.getInputValue("radio", 2, "zh", 2);
	json["cgqk"] = inputTools.getInputValue("radio", 2, "cgqk", 2);
	json["czqk"] = inputTools.getInputValue("radio", 2, "czqk", 2);
	
	/*json["ytbg"] = $("#ytbg").val();
	json["gkj"] = $("#gkj").val();
	json["xsjg"] = $("#xsjg").val();
	json["zh"] = $("#zh").val();
	json["cgqk"] = $("#cgqk").val();
	json["czqk"] = $("#czqk").val();*/

	json["ckyp"] = inputTools.getInputValue("radio", 1, "ckyp", 2);
	json['remark'] = inputTools.getInputValue("checkbox", 2, "remark", 3);
	//把null值制空
	for(i in json) {
		if(json[i] == undefined) {
			json[i] = "";
		}

	}

	return json;

}