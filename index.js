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
			$("#steps").append($("#explanation-section > .step-1").clone());
			$("#steps > .step-1 > .step1value").text($('#policy').val());
			$("#steps").append("<br/>");
		}

		function step_2() {
			$("#steps").append($("#explanation-section > .step-2").clone());
			$("#steps").append("<br/>");
			var secret = $('#secret-access-key').val();
			var value = "AWS4" + $('#secret-access-key').val();
			$("#steps .step-2 .step2secret").text(secret);
			$("#steps .step-2 .step2secretlength").text(secret.length);
			$("#steps .step-2 .step2value").text(value);
			$("#steps .step-2 .step2valuelength").text(value.length);
			$("#steps").append("<br/>");
			return value;
		}

		function step_3(last_value) {
			var value = $('#date-stamp').val();
			return step_n(last_value, 3, value);
		}

		function step_4(last_value) {
			var value = $("#region").val();
			return step_n(last_value, 4, value);
		}

		function step_5(last_value) {
			var value = $("#service").val();
			return step_n(last_value, 5, value);
		}

		function step_6(last_value) {
			var value = 'aws4_request';
			return step_n(last_value, 6, value);
		}
		function step_7(last_value) {
			var value = $('#policy').val();
			var section = $("#explanation-section > .step-7").clone();
			var result = CryptoJS.HmacSHA256(value, last_value);
			var key_length = last_value.sigBytes;
			var hex_last_value = CryptoJS.enc.Hex.stringify(last_value);
			var result_hex = result.toString(CryptoJS.enc.Hex);

			$("#steps").append(section);
			$("#steps").append("<br/>");

			section.find(".value").text(value);
			section.find(".value-length").text(value.length);
			section.find(".key-length").text(key_length);
			section.find(".key-hex").text(hex_last_value);
			section.find(".key-hex-length").text(hex_last_value.length);
			section.find(".result-hex").text(result_hex);
			section.find(".result-hex-length").text(result_hex.length);
		}

		function step_n(last_value, n, value) {
			var array;
			var last_value_length;
			if (typeof (last_value) == 'string') {
				array = CryptoJS.enc.Utf8.parse(last_value);
				last_value_length = last_value.length;
			} else {
				array = last_value;
				last_value_length = last_value.sigBytes;
			}
			var hex_last_value = CryptoJS.enc.Hex.stringify(array);

			var section = $("#explanation-section > .step-n").clone();
			var result = CryptoJS.HmacSHA256(value, last_value);
			var result_hex = result.toString(CryptoJS.enc.Hex);

			section.attr("class", "step-" + n);

			$("#steps").append(section);
			$("#steps").append("<br/>");

			section.find(".n").text(n);
			section.find(".n-minus-1").text((n - 1));
			section.find(".value").text(value);
			section.find(".value-length").text(value.length);
			section.find(".key-length").text(last_value_length);
			section.find(".key-hex").text(hex_last_value);
			section.find(".key-hex-length").text(hex_last_value.length);
			section.find(".result-hex").text(result_hex);
			return result;
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