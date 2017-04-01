/**
 * 如果inputType==2,那么是查看状态
 * 默认是1
 */
function initInputType() {
	if(localStorage.getItem("inputType") == 2) {
		$("input").attr('disabled', 'false');
		$("button").attr('disabled', 'false');
	} else if(localStorage.getItem("inputType") == 1) {
		$("input").removeAttr("disabled");
		$("button").removeAttr("disabled");
		$('input[type=radio][name="expert_conclusion"]').attr('disabled', 'false');
		$('input[type=radio][name="conclusion"]').attr('disabled', 'false');
		$('input[type=radio][name="advice"]').attr('disabled', 'false');
		$('input[type=radio][name="wxmjbz"]').attr('disabled', 'false');
		$('input[type=radio][name="wxdckqk"]').attr('disabled', 'false');
	}
}

function save(path) {
	var btnArray = ['否', '是'];
	mui.confirm('是否需要保存?', '提示', btnArray, function(e) {
		if(e.index == 1) {
			$("#next").trigger("click", path);
		} else {
			window.location.href = path;
		}

	});

}

function initNavigationVerify() {
	var b = document.getElementById('basic');
	b.addEventListener("tap", function() {
		window.location.href = "basic_information.html";
	});
	var d = document.getElementById('drawing');
	d.addEventListener("tap", function() {
		window.location.href = "drawing.html";
	});
	var info=document.getElementById('info');
	info.addEventListener("tap", function() {
		window.location.href = "survey_information.html";
	});
	var r = document.getElementById('report');
	r.addEventListener("tap", function() {
		window.location.href = "authentication_report.html";
	});
	var sP = document.getElementById('sitePic');
	sP.addEventListener("tap", function() {
		window.location.href = "sitePic.html";
	});
}

function initNavigationEdit() {
	if(localStorage.getItem("inputType") == 2) {
		initNavigationVerify();
	} else {
		var b = document.getElementById('basic');
		b.addEventListener("tap", function() {
			save("basic_information.html");
			//window.location.href = "basic_information.html";
		});
		var d = document.getElementById('drawing');
		d.addEventListener("tap", function() {
			save("drawing.html");
			//window.location.href = "drawing.html";
		});
		var info = document.getElementById('info');
		info.addEventListener("tap", function() {
			save("survey_information.html");
		});
		var r = document.getElementById('report');
		r.addEventListener("tap", function() {
			save("authentication_report.html");
			//window.location.href = "authentication_report.html";
		});
		var sP = document.getElementById('sitePic');
		sP.addEventListener("tap", function() {
			save("sitePic.html");
			//window.location.href = "sitePic.html";
		});
	}

}

function initNavigationAdd() {
	var b = document.getElementById('basic');
	b.addEventListener("tap", function() {
		alert("请先保存之后再修改");
	});
	var d = document.getElementById('drawing');
	d.addEventListener("tap", function() {
		alert("请先保存之后再修改");
	});
	var info=document.getElementById('info');
	info.addEventListener("tap", function() {
		alert("请先保存之后再修改");
	});
	var r = document.getElementById('report');
	r.addEventListener("tap", function() {
		alert("请先保存之后再修改");
	});
	var sP = document.getElementById('sitePic');
	sP.addEventListener("tap", function() {
		alert("请先保存之后再修改");
	});
}

function networkError() {
	plus.nativeUI.closeWaiting();
	mui.alert("网络异常,请稍后重试");
}

function closeWaiting() {
	plus.nativeUI.closeWaiting();
}


/**
 * 网络异常,将本地编辑标志置为TRUE
 */
function networkErrorToLocal(){
	plus.nativeUI.closeWaiting();
	if(!localFlag){
		localFlag = true;	
		mui.alert("网络异常,数据将存至本机");	
	}else{
		console.log("网络异常,数据将存至本机");
	}
}

	/**
	 *map转json
	 * @param {Object} map
	 */
function mapToJson(map){
	var keys = map.keys();
	var soptPicJson = {};
	
	for(var i=0;i<keys.length;i++){ 
		soptPicJson[keys[i]]=map.get(keys[i]);
	}
	return soptPicJson;
}


function jsonStrToMap(jsonStr){
	var str2json = eval("("+jsonStr+")");  
	//console.log(JSON.stringify(str2json));
	var json2Map = new Map();
	for(var o in str2json){
		json2Map.put(o,str2json[o]);
	}
	return json2Map;
}


	/**
	 *双层map转json
	 * @param {Object} map
	 */
function deepMapToJson(map){
	var keys = map.keys();
	var soptPicJson = {};
	
	for(var i=0;i<keys.length;i++){
		//第二层map
		var mapInMap2Json = {}; 
		var keysIndeep = map.get(keys[i]).keys();
		console.log(keysIndeep);
		for(var j=0;j<keysIndeep.length;j++){
			console.log(keysIndeep[j]);
			var Indeep = map.get(keys[i]).get(keysIndeep[j]);
			mapInMap2Json[keysIndeep[j]] = Indeep;
		}
		soptPicJson[keys[i]]=mapInMap2Json;
	}
	console.log(JSON.stringify(soptPicJson));
	return soptPicJson;
}

/**
 * 双层json转双层map
 * @param {Object} jsonStr
 */
function jsonStrToDeepMap(jsonStr){
	var str2json = eval("("+jsonStr+")");  
	console.log(JSON.stringify(str2json));
	var json2Map = new Map();
	for(var o in str2json){
		var o2map = new Map();
		for(var e in str2json[o]){
			console.log(JSON.stringify(o));
			o2map.put(e,(str2json[o])[e]);
		}
		json2Map.put(o,o2map);
	}
	console.log(json2Map);
	return json2Map;
}

	/**
	 *3层map转json
	 * @param {Object} map
	 */
function thereMapToJson(map){
	var keys = map.keys();
	var soptPicJson = {};
	
	for(var i=0;i<keys.length;i++){
		//第二层map
		var mapInMap2Json = {}; 
		var keysIndeep = map.get(keys[i]).keys();
		for(var j=0;j<keysIndeep.length;j++){
			var deepObject = map.get(keys[i]).get(keysIndeep[j]);
			if(deepObject.elements==undefined){
				var Indeep = deepObject;
				mapInMap2Json[keysIndeep[j]] = Indeep;
			}else{
				//第三层map
				var json3 = mapToJson(deepObject);
				mapInMap2Json[keysIndeep[j]] = json3;
			}
		}
		soptPicJson[keys[i]]=mapInMap2Json;
	}
	return soptPicJson;
}
 /**
  * 
 * 3层json转双层map
 * @param {Object} jsonStr
 */
function thereJsonStrToDeepMap(jsonStr){
	var str2json = eval("("+jsonStr+")");  
//	console.log(JSON.stringify(str2json));
	var json2Map = new Map();
	for(var o in str2json){
		var o2map = new Map();
		//console.log(JSON.stringify(str2json[o]));
		for(var e in str2json[o]){
			var stmValue = (str2json[o])[e];
			//console.log(JSON.stringify(stmValue));
			if(isJson(stmValue)){
				//第三层
				var thereMap = jsonStrToMap(JSON.stringify(stmValue));
				o2map.put(e,thereMap);	
			}else{
				o2map.put(e,stmValue);
			}
		}
		
		json2Map.put(o,o2map);
	}
	return json2Map;
}

isJson = function(obj){
  var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
  return isjson;
}