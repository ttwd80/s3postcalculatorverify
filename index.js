$(function() {
	load_from_url_if_any();
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
		return false;
	});

	function show_steps() {
		$("#steps").empty();
		var last_value;
		step_1();
		last_value = step_2();
		last_value = step_3(last_value);
		last_value = step_4(last_value);
		last_value = step_5(last_value);
	}

	function step_1() {
		var label = $("<div>Step 1</div>");
		var content = $("<div></div>").append($('#policy').val());
		$("#steps").append(label);
		$("#steps").append(content);
		$("#steps").append("<br/>");
	}

	function step_2() {
		var label = $("<div>Step 2</div>");
		var plaintext = "AWS4" + $("#secret-access-key").val();
		var array = CryptoJS.enc.Utf8.parse(plaintext);
		var text = CryptoJS.enc.Hex.stringify(array);
		var content = $("<div></div>").append(text);
		$("#steps").append(label);
		$("#steps").append(content);
		$("#steps").append("<br/>");
		return plaintext;
	}

	function step_3(last_value) {
		var label = $("<div>Step 3</div>");
		var value = $("#date-stamp").val();
		value = CryptoJS.HmacSHA256(value, last_value);
		var content = $("<div></div>").append(value.toString(CryptoJS.enc.Hex));
		$("#steps").append(label);
		$("#steps").append(content);
		$("#steps").append("<br/>");
		return value;
	}

	function step_4(last_value) {
		var label = $("<div>Step 4</div>");
		var value = $("#region").val();
		value = CryptoJS.HmacSHA256(value, last_value);
		var content = $("<div></div>").append(value.toString(CryptoJS.enc.Hex));
		$("#steps").append(label);
		$("#steps").append(content);
		$("#steps").append("<br/>");
		return value;
	}

	function step_5(last_value) {
		var label = $("<div>Step 5</div>");
		var value = $("#service").val();
		value = CryptoJS.HmacSHA256(value, last_value);
		var content = $("<div></div>").append(value.toString(CryptoJS.enc.Hex));
		$("#steps").append(label);
		$("#steps").append(content);
		$("#steps").append("<br/>");
		return value;
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

	function load_from_url_if_any() {
		// TODO
	}
});