$(function() {
	$('#link-timestamp-today-utc').click(function() {
		var now = moment.utc();
		var value = now.format("dddd, MMMM Do YYYY, h:mm:ss a");
		$('#date-stamp').val(value);
	});
});