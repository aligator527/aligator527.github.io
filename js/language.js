"use strict";

$(document).ready(function() {
    $("#languageSwitcherModal").modal("show");

      let currentLang = document.body.lang;
      $("#eng_switch").on("click", () => {
        currentLang = "en";
        document.body.lang = currentLang;
        $("#languageSwitcherModal").modal("hide");
      });
      $("#jpn_switch").on("click", () => {
        currentLang = "ja";
        document.body.lang = currentLang;
        $("#languageSwitcherModal").modal("hide");
      });
})