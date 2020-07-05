//Landing Slideshow
var slideIndex = 0;
$(".slides:eq(" + slideIndex + ")").show();

$("#previous").on("click", function() {
	slideIndex += -1;
	if(slideIndex < 0) {
		slideIndex = 3;
		$(".slides:eq(0)").hide("slide", {direction: "right"}, 500);
	} else {
		$(".slides:eq(" + (slideIndex + 1) + ")").hide("slide", {direction: "right"}, 500);
	};
	$(".slides:eq(" + slideIndex + ")").show("slide", {direction: "left"}, 500);
});

$("#next").on("click", function() {
	slideIndex += 1;
	if(slideIndex > 3) {
		slideIndex = 0;
		$(".slides:eq(3)").hide("slide", {direction: "left"}, 500);
	} else {
		$(".slides:eq(" + (slideIndex - 1) + ")").hide("slide", {direction: "left"}, 500);
	};
	$(".slides:eq(" + slideIndex + ")").show("slide", {direction: "right"}, 500);
});

//Show & Hide Avatar Form
$("#avatarButton").on("click", function() {
	$(this).siblings("#avatarForm").slideToggle();
});

//Show & Hide Edit Comment Form
$(".editButton").on("click", function() {
	$(this).siblings(".editForm").slideToggle();
});

//Piece Tags
$("#tags").on("keypress", function(event) {
	if(event.which === 32) {
		let text = $(this).val().replace(/[^\w]/g, "");
		if(text) {
			$(this).before("<span class='tag'>" + text + "</span>");
		};
		$(this).val("");
	};
});

$("#tagField").on("click", ".tag", function() {
	$(this).fadeOut(function() {
		$(this).remove();
	});
});

$("#tagField").on("DOMNodeInserted", ".tag", function() {
	$("#submitTags").val($("#submitTags").val() + "," + $(this).text());
});

$("#tagField").on("DOMNodeRemoved", ".tag", function() {
	$("#submitTags").val($("#submitTags").val().replace($(this).text(), ""));
});

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