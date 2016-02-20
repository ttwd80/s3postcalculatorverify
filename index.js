$(function() {
	$('#link-timestamp-today-utc').click(function() {
		var now = moment.utc();
		var value = now.format("YYYYMMDD");
		$('#date-stamp').val(value);
	});

	$('#button-calculate').click(function() {
		var errors = validate();
		if (errors.length > 0) {
			display_error_messages(errors);
		} else {
			show_steps();
		}
	});

	function show_steps() {
		$("#steps").empty();
		step_1();
		step_2();
	}

	function step_1() {
		var label = $("<div>Step 1</div>");
		var content = $("<div></div>").append($('#policy').val());
		$("#steps").append(label);
		$("#steps").append(content);
	}

	function step_2() {
		var label = $("<div>Step 2</div>");
		var plaintext = "AWS4" + $("#secret-access-key").val();
		var array = CryptoJS.enc.Utf8.parse(plaintext);
		var text = CryptoJS.enc.Hex.stringify(array);
		var content = $("<div></div>").append(text);
		$("#steps").append(label);
		$("#steps").append(content);
	}

	function validate() {
		var list = [];
		if ($('#policy').val().length == 0) {
			list.push('Policy is empty.')
		}
		if ($('#secret-access-key').val().length == 0) {
			list.push('Secret access key is empty.')
		}
		if ($('#date-stamp').val().length == 0) {
			list.push('Date stamp is empty.')
		}
		if ($('#region').val().length == 0) {
			list.push('Region is empty.')
		}
		if ($('#service').val().length == 0) {
			list.push('Region is empty.')
		}
		return list;
	}

	function display_error_messages(list) {
		var message = list.join("\n");
		alert(message);
	}
});