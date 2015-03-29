(function (NR, undefined) {
  'use strict';
  var heroFader;

  heroFader = document.getElementById('hero-fader');

  if ( heroFader ) {
    NR.heroFader.init(heroFader);
  }

}(window.NR = window.NR || {}));