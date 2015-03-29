(function (NR) {
  'use strict';
  var debugEnabled;

  NR.console = {};

  debugEnabled = (function () {
    return location.hostname === 'localhost' ||
      location.search.match(/debug/);
  }());

  NR.console = Object.create(console);

  NR.console.debug = (function () {
    if ( debugEnabled ) {
      return console.debug;
    } else {
      return function () {};
    }
  }());

}(window.NR = window.NR || {}));