//Landing Slideshow
var slideIndex = 0,
	slideOff = 0;

$(".slides:eq(" + slideIndex + ")").show();
$(".circular:eq(" + slideIndex + ")").addClass("gray");

$("#previous").on("click", function() {
	slideIndex = (slideIndex === 0) ? 3 : slideIndex += -1;
	slideOff = (slideIndex === 3) ? 0 : slideIndex + 1;
	slideTo("previous")
});

$("#next").on("click", function() {
	slideIndex = (slideIndex === 3) ? 0 : slideIndex += 1;
	slideOff = (slideIndex === 0) ? 3 : slideIndex - 1;
	slideTo("next");
});

//Toggle Submenu
$("#hamburger").on("click", function() {
	$("#submenu").fadeToggle();
});

//Toggle Avatar Form
$("#avatarButton").on("click", function() {
	$(this).siblings("#avatarForm").slideToggle();
});

//Toggle Edit Comment Form
$(".editButton").on("click", function() {
	$(this).parents(".content").find(".editForm").slideToggle();
});

//Creating & Removing Tags
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

//Storing & Deleting Tag Value
$("#tagField").on("DOMNodeInserted", ".tag", function() {
	$("#submitTags").val($("#submitTags").val() + "," + $(this).text());
});


$("#tagField").on("DOMNodeRemoved", ".tag", function() {
	$("#submitTags").val($("#submitTags").val().replace($(this).text(), ""));
});

//Card Hover Effect
$(".indexCard").hover(function() {
	$(this).toggleClass("shaded");
	$(this).children("#bottomBar, #topBar").fadeToggle(250);
});

//Login Message Hover Effect
$(".outIcon").hover(function() {
	$(this).parents("a").siblings(".outMessage").fadeToggle();
});

//Showing & Hiding Kebab Menu
$(".kebab").on("click", function() {
	$(this).find(".menu").toggle();
});

//Slideshow Function
function slideTo(type) {
	if(type === "previous") {
		var d1 = "right",
			d2 = "left";
	};
	if(type === "next") {
		var d1 = "left",
			d2 = "right";
	};
	$(".slides:eq(" + slideOff + ")").hide("slide", {direction: d1}, 500);
	$(".slides:eq(" + slideIndex + ")").show("slide", {direction: d2}, 500);
	$(".circular:eq(" + slideOff + ")").removeClass("gray");
	$(".circular:eq(" + slideIndex + ")").addClass("gray");
};
