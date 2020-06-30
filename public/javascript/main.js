$(".editButton").on("click", function() {
	$(this).siblings(".editForm").toggle("shown");
	$(".editForm").remove("shown");
});