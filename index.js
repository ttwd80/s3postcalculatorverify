$(function() {
	$('#link-timestamp-today-utc').click(function() {
		var now = moment.utc();
		var value = now.format("YYYYMMDD");
		$('#date-stamp').val(value);
	});
});