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

		}
	});

	function validate() {
		var list = [];
		if ($('#policy').val().length == 0) {
			list.push('Policy is empty.')
		}
		if ($('#secret-access-key').val().length == 0) {
			list.push('Secret access key is empty.')
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