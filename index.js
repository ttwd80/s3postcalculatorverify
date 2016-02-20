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
			var label = $("<div>Step 1</div>");
			var explanation = $("<div>we start with the base64 encoding of the policy</div>");
			var content = $("<div></div>").append($('#policy').val());
			$("#steps").append(label);
			$("#steps").append(explanation);
			$("#steps").append(content);
			$("#steps").append("<br/>");
		}

		function step_2() {
			var label = $("<div>Step 2</div>");
			var plaintext = "AWS4" + $("#secret-access-key").val();
			var content = $("<div></div>").append(plaintext);
			var explanation1 = $("<div></div>").append(
					'Step 2 is not related to step 1');
			var explanation2 = $("<div></div>").append(
					'We join "AWS4" and the secret access key');
			var explanation3 = $("<div></div>").append(
					'In this example, the secret access key is ['
							+ $("#secret-access-key").val() + ']');
			var explanation4 = $("<div></div>").append(
					'The joined string is [AWS4'
							+ $("#secret-access-key").val() + ']');
			var explanation5 = $("<div></div>")
					.append(
							'The output will always be 4 characters longer than the input.');
			var explanation6 = $("<div></div>").append(
					'The input is a string '
							+ $("#secret-access-key").val().length
							+ ' chacter(s) in length');
			var explanation7 = $("<div></div>").append(
					'The output is a string '
							+ ($("#secret-access-key").val().length + 4)
							+ ' chacters in length');
			var explanation8 = $("<div></div>").append(
					'The input for this step is ['
							+ $("#secret-access-key").val() + ']');
			var explanation9 = $("<div></div>").append(
					'The output for this step is :');
			$("#steps").append(label);
			$("#steps").append(explanation1);
			$("#steps").append(explanation2);
			$("#steps").append(explanation3);
			$("#steps").append(explanation4);
			$("#steps").append(explanation5);
			$("#steps").append(explanation6);
			$("#steps").append(explanation7);
			$("#steps").append(explanation8);
			$("#steps").append(explanation9);
			$("#steps").append(content);
			$("#steps").append("<br/>");
			return plaintext;
		}

		function step_3(last_value) {
			var label = $("<div>Step 3</div>");
			var value = $("#date-stamp").val();
			value = CryptoJS.HmacSHA256(value, last_value);
			var content = $("<div></div>").append(
					value.toString(CryptoJS.enc.Hex));
			var explanation1 = $("<div></div>").append(
					'Step 3 depends on step 2');
			var explanation2 = $("<div></div>")
					.append(
							'we take the result from step 2 and use it as the key for the HmacSHA256 function');
			var explanation3 = $("<div></div>")
					.append(
							'HmacSHA256 function requires 2 parameters, a key and a message');
			var explanation4 = $("<div></div>").append(
					'HmacSHA256 returns a byte array');
			var explanation5 = $("<div></div>")
					.append(
							'In this case we will call the HmacSHA256 with [x] as the key and [y] as the message');
			$("#steps").append(label);
			$("#steps").append(content);
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