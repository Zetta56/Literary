//Show & Hide Edit Comment Form
$(".editButton").on("click", function() {
	$(this).siblings(".editForm").slideToggle();
});

//Show & Hide Avatar Form
$("#avatarButton").on("click", function() {
	$(this).siblings("#avatarForm").slideToggle();
})

//Piece Tags
$("#tags").on("change", function(event) {
	alert("hello")
})

//Card Hover Effect
$(".indexCard").hover(function() {
	$(this).addClass("shaded");
	$(this).children("#bottomBar, #topBar").fadeIn(250);
}, function() {
	$(this).removeClass("shaded");
	$(this).children("#bottomBar, #topBar").fadeOut(250);
});

//Icons Hover Effect
$(".far").hover(function() {
	$(this).hide();
}, function() {
	$(this).show();
});

$(".far.fa-thumbs-up").hover(function() {
	$(this).siblings("a").find(".fas.fa-thumbs-up").show();
}, function() {
	$(this).siblings("a").find(".fas.fa-thumbs-up").hide();
});

$(".far.fa-heart").hover(function() {
	$(this).siblings("a").find(".fas.fa-heart").show();
}, function() {
	$(this).siblings("a").find(".fas.fa-heart").hide();
});