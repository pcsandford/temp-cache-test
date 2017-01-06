"use strict";

const navigation = {};

navigation.openPopup = function() {
  let data = $(this).data();
  let details = data.details;
  let qrCode = data.qr;
  console.log(data.qr);
  if (data.details) {
    $(".popup__card p").text(details);
  }
  if (data.qr != "undefined") {
    $(".popup__card img").attr("src",qrCode);
  }
  $(".popup").fadeIn();
};

navigation.closePopup = function() {
  $(".popup").fadeOut();
  $(".popup__card p").text("");
  $(".popup__card img").attr("src","");
};

navigation.init = function() {

  $("ul").on("click", "li", function() {
    navigation.openPopup.call($(this));
  });

  $(".popup").on("click", function(){
    navigation.closePopup();
  });


};

$(function() {
  navigation.init();
});


