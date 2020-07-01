$(".editButton").on("click", function() {
	$(this).siblings(".editForm").slideToggle();
});

$("#avatarButton").on("click", function() {
	$(this).siblings("#avatarForm").slideToggle();
})