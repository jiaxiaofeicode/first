var complete = {

	/**验证是否计算结果
	 * names 是数组 存放表单名称 例如 roof
	 * type 1房屋完损鉴定结论 2房屋危险等级结论 3维修处理建议
	 * @param {Object} names
	 */
	checkForm: function(names, type) {

		var tmp = 0;
		for(var i = 0; i < names.length; i++) {
			if($("input[name='" + names[i] + "']:checked").val()) {
				tmp++;
			}
		}

		if(tmp == names.length) {
			if(type == 1) {
				complete.setValueForIsBreak(names, 'expert_conclusion');
				complete.setValueForAdvice('advice',type);
			}
			/*if(type == 2) {
				complete.setValueForLevel(names, 'conclusion', names.length - 1);
				complete.setValueForAdvice('advice');
			}*/
			if(type == 3) {
				complete.setValueForLevel(names, 'conclusion', names.length - 1);
				complete.setValueForAdvice('advice',type);
			}

		} else {
			return false;
		}

	},

	/**
	 * 根据name取值
	 * @param {Object} name
	 */
	getValue: function(name) {

		return $("input[name='" + name + "']:checked").val();
	},
	/**
	 * 
	 * @param {Object} names主要需要验证的参数
	 * @param {Object} otherBindNames 其他只需绑定事件的参数
	 * @param {Object} type 类型 3种逻辑
	 */
	bindCheck: function(names,type,otherBindNames) {
		var oldNames=names;
		if(otherBindNames!=null){
			names=names.concat(otherBindNames);
		}
		for(var a = 0; a < names.length; a++) {
			var che_arr = document.getElementsByName(names[a]);
			for(var i = 0; i < che_arr.length; i++) {
				che_arr[i].addEventListener("change", function() {
					complete.checkForm(oldNames, type);
				});
			}
		}

	},

	/**
	 * names六项check的name，tar_name完损鉴定结论check的name
	 * 房屋完损鉴定结果赋值
	 */
	setValueForIsBreak: function(names, tar_name) {

		var a = new Array(6);

		for(var i = 0; i < names.length; i++) {
			a[i] = complete.getValue(names[i]);
		}
		var count = [0, 0, 0, 0];
		for(i in a) {
			if(a[i] == 1) {
				count[0] = count[0] + 1;
			}
			if(a[i] == 2) {
				count[1] = count[1] + 1;
			}
			if(a[i] == 3) {
				count[2] = count[2] + 1;
			}
			if(a[i] == 4) {
				count[3] = count[3] + 1;
			}
		}
		//完好
		if(count[0] >= 4 && count[1] <= 2 && count[2] < 1 && count[3] < 1) {
			$("input[type=radio][name='" + tar_name + "'][value='1']")[0].checked = true;
		}
		//基本完好
		else if(count[2] <= 2 && count[3] < 1) {
			$("input[type=radio][name='" + tar_name + "'][value='2']")[0].checked = true;
		}
		//一般损坏
		else if(count[3] <= 2) {
			$("input[type=radio][name='" + tar_name + "'][value='3']")[0].checked = true;
		}
		//严重损坏
		else if(count[3] > 2) {
			$("input[type=radio][name='" + tar_name + "'][value='4']")[0].checked = true;
		}
		/*//分类1
		if(a[0]==1&&a[1]==1&&a[2]==1&&a[3]==1&&a[4]==1&&a[5]==1){
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
			//$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
			return;
		}
		//分类2
		if(a[0]==1&&a[1]==1&&complete.compare(1,3,2,1,a,2)){
	
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
		}
		
		//分类3
		if(a[0]==1&&a[1]==1&&a[2]==1&&a[3]==1&&a[4]==1&&a[5]==1){
	
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
		}
		else if(a[0]==1&&a[1]==1&&complete.compare(1,3,2,1,a,2)){
			
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
		
		}else if(complete.compare(3,0,4,0,a,0)){

			$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
		}
		
		//分类4
		if(a[0]!=3&&a[0]!=4&&a[1]!=4&&complete.compare(3,1,4,0,a,2)){
			
			$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
		}
		
		//分类5
		if(a[0]==1&&a[1]==1&&a[2]==1&&a[3]==1&&a[4]==1&&a[5]==1){
			
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
		}
		else if(a[0]==1&&a[1]==1&&complete.compare(1,3,2,1,a,2)){
			
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
		
		}else if(complete.compare(3,0,4,0,a,0)){
			
			$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
			
		}else if(a[0]!=3&&a[0]!=4&&a[1]!=4&&complete.compare(3,1,4,0,a,2)){
			
			$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
		}
		else if(a[0]!=4&&a[1]!=4&&a[2]!=4&&a[3]!=4&&a[4]!=4&&a[5]!=4){
			
			$("input[type=radio][name='"+tar_name+"'][value='3']")[0].checked=true;
		}
		
		//分类6
		if(a[0]!=4&&complete.compareSingel(4,1,a,2)){
			$("input[type=radio][name='"+tar_name+"'][value='3']")[0].checked=true;
		}
		
		//分类7
		if(a[0]==1&&a[1]==1&&a[2]==1&&a[3]==1&&a[4]==1&&a[5]==1){
			
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
		}
		else if(a[0]==1&&a[1]==1&&complete.compare(1,3,2,1,a,2)){
			
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
		
		}else if(complete.compare(3,0,4,0,a,0)){
			
			$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
			
		}else if(a[0]!=3&&a[0]!=4&&a[1]!=4&&complete.compare(3,1,4,0,a,2)){
			
			$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
		}
		else if(a[0]!=4&&a[1]!=4&&a[2]!=4&&a[3]!=4&&a[4]!=4&&a[5]!=4){
			
			$("input[type=radio][name='"+tar_name+"'][value='3']")[0].checked=true;
		}else if(a[0]!=4&&complete.compareSingel(4,1,a,2)){
			$("input[type=radio][name='"+tar_name+"'][value='3']")[0].checked=true;
		}else{
			
			$("input[type=radio][name='"+tar_name+"'][value='4']")[0].checked=true;
		}*/

	},
	/**
	 * 
	 * @param {Object} 数值
	 * @param {Object} 等于的个数
	 * @param {Object} 数组
	 * @param {Object} 从第几个元素开始,0开始
	 */
	compareSingel: function(val1, count1, arr, z) {

		var a1 = 0;

		for(var i = z; i < arr.length; i++) {

			if(arr[i] == val1) {
				a1++;
			}
		}

		if(a1 == count1) {

			return true;
		} else {
			return false;
		}
	},

	/**
	 * 
	 * @param {Object} val1 
	 * @param {Object} count1 
	 * @param {Object} val2
	 * @param {Object} count2
	 * @param {Object} arr 目标数组
	 * @param {Object} z 第几个元素开始
	 */
	compare: function(val1, count1, val2, count2, arr, z) {

		var a1 = 0;
		var a2 = 0;

		for(var i = z; i < arr.length; i++) {

			if(arr[i] == val1) {
				a1++;
			}
			if(arr[i] == val2) {
				a2++;
			}
		}

		if(a1 == count1 && a2 == count2) {

			return true;
		} else {
			return false;
		}
	},

	compareForCount: function(val1, arr, z) {

		var a1 = 0;

		for(var i = z; i < arr.length; i++) {

			if(arr[i] == val1) {
				a1++;
			}
		}

		return a1;
	},

	/**
	 * 整体机构危险构建综合比例
	 * @param {Object} names
	 * @param {Object} tar_name
	 * @param {Object} level_c
	 */
	setValueForLevel: function(names, tar_name, level_c) {

		var a = new Array(names.length);
		for(var i = 0; i < names.length; i++) {
			a[i] = complete.getValue(names[i]);
		}
		//Du级层数
		var c = complete.compareForCount(4, a, 2);
		var proportion = $("input[name='proportion']:checked").val();

		//地基危险性等级为危险状态
		if($("input[name='danger_level']:checked").val() == 2) {
			$("input[type=radio][name='" + tar_name + "'][value='4']")[0].checked = true;
		} else if(proportion == 1) {
			$("input[type=radio][name='" + tar_name + "'][value='1']")[0].checked = true;
		} else if(complete.compareSingel(4, 0, a, 2) && proportion == 2) {
			$("input[type=radio][name='" + tar_name + "'][value='2']")[0].checked = true;
		}

		/*	else if(!complete.compareSingel(4,0,a,2)&&proportion==2){
				$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
			}*/
		else if(c > 0 && proportion == 2) {
			$("input[type=radio][name='" + tar_name + "'][value='3']")[0].checked = true;
		} else if(proportion == 3 && c <= Math.ceil(level_c / 3)) {

			$("input[type=radio][name='" + tar_name + "'][value='3']")[0].checked = true;
		} else if(proportion == 3 && c > Math.ceil(level_c / 3)) {
			$("input[type=radio][name='" + tar_name + "'][value='4']")[0].checked = true;
		} else if(proportion == 4) {
			$("input[type=radio][name='" + tar_name + "'][value='4']")[0].checked = true;
		}
	},

	setValueForAdvice: function(tar_name, type) {
			//取消默认选中
			for(var i = 1; i < 5; i++) {
				$("input[type=radio][name='" + tar_name + "'][value='" + (i) + "']").removeAttr("checked");
			}
		if(type == 1) {
		
			//房屋完损鉴定结论
			var expert_conclusion = $("input[name='expert_conclusion']:checked").val();
			//危险点查勘情况
			var wxdckqk = $("input[name='wxdckqk']:checked").val();
			if(wxdckqk==2&&expert_conclusion!=4){
				$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
			}
			else if(wxdckqk==2&&expert_conclusion==4){
				$("input[type=radio][name='"+tar_name+"'][value='3']")[0].checked=true;
			}
			else if(wxdckqk==1&&expert_conclusion==4){
				$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
			}
		}
		if(type == 3) {
			var conclusion = $("input[name='conclusion']:checked").val();
			if(conclusion!=4){
				mui.alert("房屋危险部位应该为整体危险,逻辑错误无法保存,请修改");
				$("#next").attr('disabled','false');
			}else{
				$("#next").removeAttr("disabled");
				$("input[type=radio][name='"+tar_name+"'][value='4']")[0].checked=true;
			}
		}
		
		
		
		//var conclusion = $("input[name='conclusion']:checked").val();
		/*if(conclusion==4){
			$("input[type=radio][name='"+tar_name+"'][value='4']")[0].checked=true;
		}
		
		else if(conclusion==3&&expert_conclusion!=4){
			$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
		}
		
		else if(conclusion==2&&expert_conclusion!=4){
			
			$("input[type=radio][name='"+tar_name+"'][value='2']")[0].checked=true;
		}
		
		else if(conclusion==2&&expert_conclusion==4){
			
			$("input[type=radio][name='"+tar_name+"'][value='1']")[0].checked=true;
		}
		
		else if(conclusion==3&&expert_conclusion==4){
			
			$("input[type=radio][name='"+tar_name+"'][value='3']")[0].checked=true;
		}*/
	}
}