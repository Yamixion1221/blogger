 var clientDarkMode = window.matchMedia("(prefers-color-scheme:dark)").matches;
  let darkMode = false

  if (clientDarkMode) {
    if (!$('html').hasClass("appearance-light")) { // SystemSetting = Dark && MAL UserSettings != Light
      darkMode = true
    }
  } else if ($('html').hasClass("appearance-dark")) { // MAL UserSettings = Dark
    darkMode = true
  }

    if (darkMode) {
    $('html').addClass("dark-mode");
  }
    $(document).ready(function() {
    if (darkMode) {
      if($('.js-color-pc-constant').length){$('.js-color-pc-constant').addClass("color-pc-constant");}
    }
  });
