var validator = {
	isNum: function(arr) {
		for(i in arr) {
			$("#" + arr[i]).change(function() {
				this.value = this.value.replace(/[^\d\.]/g, '');
			});
		}

	}
}