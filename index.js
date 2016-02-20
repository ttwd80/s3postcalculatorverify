$(function() {
	init();
	$('#link-timestamp-today-utc').click(function() {
		var now = moment.utc();
		var value = now.format("YYYYMMDD");
		$('#date-stamp').val(value);
	});

	$('#button-calculate').click(
			function() {
				var errors = validate();
				if (errors.length > 0) {
					display_error_messages(errors);
				} else {
					var policy_in_base_64 = $('#policy').val();
					var secret_key = $('#secret-access-key').val();
					var date_stamp = $('#date-stamp').val();
					var region = $('#region').val();
					var service = $('#service').val()
					calculate(policy_in_base_64, secret_key, date_stamp,
							region, service);
					show_steps();
				}
				return false;
			});

	function calculate(policy_in_base_64, secret_key, date_stamp, region,
			service) {
		var step_1 = policy_in_base_64;
		var step_2 = "AWS4" + secret_key;
		var step_3 = CryptoJS.HmacSHA256(date_stamp, step_2);
		var step_4 = CryptoJS.HmacSHA256(region, step_3);
		var step_5 = CryptoJS.HmacSHA256(service, step_4);
		var step_6 = CryptoJS.HmacSHA256("aws4_request", step_5);
		var step_7 = CryptoJS.HmacSHA256(policy_in_base_64, step_6);
		var result = step_7.toString(CryptoJS.enc.Hex);
		$('#result').val(result);
	}

	$('#show-hide-steps').click(function() {
		$("#steps").toggle();
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
		last_value = step_6(last_value);
		step_7(last_value);

		function step_1() {
			$("#steps").append($("#explanation-section > .step1").clone());
			$("#steps > .step1 > .step1value").text($('#policy').val());
			$("#steps").append("<br/>");
		}

		function step_2() {
			$("#steps").append($("#explanation-section > .step2").clone());
			$("#steps").append("<br/>");
			var secret = $('#secret-access-key').val();
			var value = "AWS4" + $('#secret-access-key').val();
			$("#steps .step2 .step2secret").text(secret);
			$("#steps .step2 .step2secretlength").text(secret.length);
			$("#steps .step2 .step2value").text(value);
			$("#steps .step2 .step2valuelength").text(value.length);
			$("#steps").append("<br/>");
			return value;
		}

		function step_3(last_value) {
			var array = CryptoJS.enc.Utf8.parse(last_value);
			var hex_last_value = CryptoJS.enc.Hex.stringify(array);

			$("#steps").append($("#explanation-section > .step3").clone());
			$("#steps").append("<br/>");
			var datestamp = $("#date-stamp").val();
			var value = CryptoJS.HmacSHA256(datestamp, last_value);

			$("#steps .step3 .step3datestamp").text(datestamp);
			$("#steps .step3 .step3datestamplength").text(datestamp.length);
			$("#steps .step3 .step2valuelength").text(last_value.length);
			$("#steps .step3 .step2hex").text(hex_last_value)
			$("#steps .step3 .step2hexvaluelength").text(hex_last_value.length);
			$("#steps .step3 .step3hexvalue").text(
					value.toString(CryptoJS.enc.Hex));
			$("#steps").append("<br/>");
			return value;
		}

		function step_4(last_value) {
			var label = $("<div>Step 4</div>");
			var value = $("#region").val();
			value = CryptoJS.HmacSHA256(value, last_value);
			var content = $("<div></div>").append(
					value.toString(CryptoJS.enc.Hex));
			$("#steps").append(label);
			$("#steps").append(content);
			$("#steps").append("<br/>");
			return value;
		}

		function step_5(last_value) {
			var label = $("<div>Step 5</div>");
			var value = $("#service").val();
			value = CryptoJS.HmacSHA256(value, last_value);
			var content = $("<div></div>").append(
					value.toString(CryptoJS.enc.Hex));
			$("#steps").append(label);
			$("#steps").append(content);
			$("#steps").append("<br/>");
			return value;
		}

		function step_6(last_value) {
			var label = $("<div>Step 6</div>");
			var value = 'aws4_request';
			value = CryptoJS.HmacSHA256(value, last_value);
			var content = $("<div></div>").append(
					value.toString(CryptoJS.enc.Hex));
			$("#steps").append(label);
			$("#steps").append(content);
			$("#steps").append("<br/>");
			return value;
		}

		function step_7(last_value) {
			var label = $("<div>result</div>");
			var value = $('#policy').val();
			value = CryptoJS.HmacSHA256(value, last_value);
			var hex_value = value.toString(CryptoJS.enc.Hex);
			var content = $("<div></div>").append(hex_value);
			$("#steps").append(label);
			$("#steps").append(content);
		}

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
		var params = $.deserialize(location.search.substring(1));
		if (params['policy']) {
			$('#policy').val(params['policy']);
		}
		if (params['datestamp']) {
			$('#date-stamp').val(params['datestamp']);
		}
		if (params['region']) {
			$('#region').val(params['region']);
		}
		$('#result').val('');
	}

	function init() {
		load_from_url_if_any();
		$("#steps").hide();
	}
});