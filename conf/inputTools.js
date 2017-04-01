/**
 * 工具类
 */

var inputTools = {
	a: "▄︻┻═┳一",
	b: "↖(▔▽▔)↗",
	/*a:"",
	b:",",*/
	getInputValue: function(type, number, name, length) {
		var value = null;
		if(type == "radio") {
			value = $('input[type=' + type + '][name="' + name + '"]:checked').val();
			//如果类型2那么最后一个是其他
			if(number == 2) {
				if(value == length) {
					value = this.a + $("#" + name).val();
				}
			}
		}
		if(type == "checkbox") {
			if(number == 1) {
				value = this.chk(name).join(this.b);
			} else if(number == 2) {
				value = this.chk(name);
				if(this.contains(value, length)) {
					value.splice(this.indexOf(value, length), 1, this.a + $("#" + name).val());
				}
				value = value.join(this.b)
			} else if(number == 3) {
				var str = "";
				value = this.chk(name);
				for(i in value) {
					//str += value[i] + this.a + $("#" + name + value[i]).val();
					if(value[i] != 1) {
						str += value[i] + this.a + $("#" + name + value[i]).val();
					}else{
						str+= value[i] + this.a + $("#" + name + value[i]+"_1").val()+ this.a + $("#" + name + value[i]+"_2").val();
					}

					if(i != value.length - 1) {
						str += this.b
					}
				}
				value = str;
			}
		}
		if(value == undefined) {
			value = "";
		}

		return value;
	},

	echoValue: function(type, number, name, value, length) {
		if(type == "radio") {
			if(number == 1) {
				$("input[type=radio][name='" + name + "'][value='" + value + "']").attr("checked", 'checked');
			} else if(number == 2) {
				if(value.substring(0, this.a.length) == this.a) {
					$("input[type=radio][name='" + name + "'][value='" + length + "']").attr("checked", 'checked');
					$("#" + name).val(value.substring(this.a.length));
				} else {
					$("input[type=radio][name='" + name + "'][value='" + value + "']").attr("checked", 'checked');
				}
			}
		}
		if(type == "checkbox") {
			value = value.split(this.b);
			if(number == 1) {
				for(i in value) {
					$("input[type=checkbox][name='" + name + "'][value='" + value[i] + "']").attr("checked", 'checked');
				}
			} else if(number == 2) {
				for(i in value) {
					if(!isNaN(value[i])) {
						$("input[type=checkbox][name='" + name + "'][value='" + value[i] + "']").attr("checked", 'checked');
					} else {
						$("input[type=checkbox][name='" + name + "'][value='" + length + "']").attr("checked", 'checked');
						$("#" + name).val(value[i].substring(this.a.length));
					}
				}
			} else if(number == 3) {
				for(i in value) {
					var entry = value[i].split(this.a);
					var key = entry[0];
					var val = entry[1];

					$("input[type=checkbox][name='" + name + "'][value='" + key + "']").attr("checked", 'checked');
					$("#" + name + key).val(val);
					if(entry[2]!=null){
						$("#" + name + key+"_1").val(val);
						$("#" + name + key+"_2").val(entry[2]);
					}
					

				}
			}
		}
	},
	chk: function(checkBoxName) { //jquery获取复选框值 
		var chk_value = [];
		$('input[name="' + checkBoxName + '"]:checked').each(function() {
			chk_value.push($(this).val());
		});
		return chk_value;
	},

	contains: function(arr, obj) {
		for(i in arr) {
			if(arr[i] == obj) {
				return true;
			}
		}
		return false;
	},

	indexOf: function(arr, obj) {
		for(i in arr) {
			if(arr[i] == obj) {
				return i;
			}
		}
		return -1;
	},

}