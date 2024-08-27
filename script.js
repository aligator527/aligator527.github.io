"use strict";

$(document).ready(function() {
    $("#languageSwitcherModal").modal("show");

    $("#form-submit").on("click", function(e) {
        e.preventDefault();

        let txt = $("#form-body").val();
        console.log(txt);
        let text = txt.split("\n");
        let frmtxt = text.join("%0A");

        window.location.href = "mailto:aligator527official@gmail.com" +
            "?subject=" + $("#form-head").val() + "(" + 
            + $("#form-name").val() + ")" +
            "&body=" + frmtxt;
      });

      let currentLang = document.body.lang;
      $("#eng_switch").on("click", () => {
        currentLang = "en";
        document.body.lang = currentLang;
      });
      $("#jpn_switch").on("click", () => {
        currentLang = "ja";
        document.body.lang = currentLang;
      });
})