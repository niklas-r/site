(function (NR, _, undefined) {
  'use strict';
  var c,
      ctx,
      innerWidth,
      innerHeight,
      currentGradientIndex,
      color1,
      color2,
      ANIMATION_STEPS,
      ANIMATION_TRANSITION_TIME_MS,
      ANIMATION_DELAY_MS;

  ANIMATION_STEPS = 50;
  ANIMATION_TRANSITION_TIME_MS = 20 * 1000;
  ANIMATION_DELAY_MS = 10 * 1000;

  NR.heroFader = NR.heroFader || {};

  NR.heroFader.init = function initHeroFader(element) {
    c = element;
    ctx = c.getContext("2d");

    currentGradientIndex = 0;

    color1 = NR.heroFader.gradients[currentGradientIndex][0];
    color2 = NR.heroFader.gradients[currentGradientIndex][1];

    setHeroCanvasSize();
    animLoop();

    setTimeout(function () {
      swapGradient();
      setInterval(swapGradient, ANIMATION_TRANSITION_TIME_MS + ANIMATION_DELAY_MS);
    }, ANIMATION_DELAY_MS);

    window.addEventListener('resize', _.debounce(onWindowResize, 100));
  };

  function onWindowResize () {
    setHeroCanvasSize();
  }

  function setHeroCanvasSize () {
    var windowSize;

    console.log("set size");

    windowSize = getWindowSize();

    ctx.canvas.width  = innerWidth  = windowSize.width;
    ctx.canvas.height = innerHeight = windowSize.height;
  }

  function getWindowSize () {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {
      width: x,
      height: y
    };
  }

  function draw () {
    var gradient;

    gradient = ctx.createLinearGradient( 0, 0, innerWidth, innerHeight);

    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.fillStyle = gradient;
    ctx.fillRect( 0, 0, innerWidth, innerHeight);
  }

  function animLoop(){
    window.requestAnimFrame(animLoop);
    draw();
  }

  function swapGradient () {
    var stepGradientId,
        currentGradient,
        nextGradientIndex,
        nextGradient,
        nextGradientColor1Steps,
        nextGradientColor2Steps;

    if ( NR.heroFader.gradients.length - 1 === currentGradientIndex ) {
      nextGradientIndex = 0;
    } else {
      nextGradientIndex = currentGradientIndex + 1;
    }

    currentGradient = NR.heroFader.gradients[currentGradientIndex];
    nextGradient = NR.heroFader.gradients[nextGradientIndex];

    console.debug('===== Start swapping gradient colors =====');
    console.debug('Current: Index %d Colors %o', currentGradientIndex, currentGradient);
    console.debug('Next: Index %d Colors %o', nextGradientIndex, nextGradient);
    console.debug('==========================================');

    nextGradientColor1Steps = getTransitionSteps(
      currentGradient[0],
      nextGradient[0],
      ANIMATION_STEPS
    );

    nextGradientColor2Steps = getTransitionSteps(
      currentGradient[1],
      nextGradient[1],
      ANIMATION_STEPS
    );

    nextGradientColor1Steps.reverse();
    nextGradientColor2Steps.reverse();

    console.debug('Stepping colors...');
    stepGradientId = setInterval(function stepGradient() {
      var nextStepColor1,
          nextStepColor2;
      console.debug('.');
      nextStepColor1 = nextGradientColor1Steps.pop();
      nextStepColor2 = nextGradientColor2Steps.pop();

      color1 = nextStepColor1;
      color2 = nextStepColor2;

      if ( !nextGradientColor1Steps.length ) {
        currentGradientIndex = nextGradientIndex;
        currentGradient = NR.heroFader.gradients[currentGradientIndex];
        color1 = currentGradient[0];
        color2 = currentGradient[1];
        console.debug('===== Done swapping gradient colors =====');
        console.debug('New gradient index: %d', currentGradientIndex);
        console.debug('New gradient colors: %o', currentGradient);
        console.debug('=========================================');
        clearInterval(stepGradientId);
      }

    }, ANIMATION_TRANSITION_TIME_MS / nextGradientColor1Steps.length);
  }

  function getTransitionSteps(colorFrom, colorTo, steps) {
      var stepList = [],
          from = parseColor(colorFrom),
          to = parseColor(colorTo);

      var stepAmountR = Math.floor((to.R - from.R) / steps);
      var stepAmountG = Math.floor((to.G - from.G) / steps);
      var stepAmountB = Math.floor((to.B - from.B) / steps);

      stepList.push(colorFrom);
      for (var i = 0; i <= steps; i++) {
          var minMax;
          // Red
          minMax = stepAmountR > 0 ? Math.min : Math.max;
          from.R = minMax(from.R + stepAmountR, to.R);

          // Green
          minMax = stepAmountG > 0 ? Math.min : Math.max;
          from.G = minMax(from.G + stepAmountG, to.G);

          // Blue
          minMax = stepAmountB > 0 ? Math.min : Math.max;
          from.B = minMax(from.B + stepAmountB, to.B);
          stepList.push(
            from.isHex
              ? rgbToHex(from.R, from.G, from.B)
              : "rgb(" + from.R + ", " + from.G + ", " + from.B + ")"
          );
      }
      stepList.push(colorTo);
      return stepList;
  }

  function parseColor(color) {
      var isHex = color.indexOf("#") !== -1;
      if (isHex) {
          return {
            isHex: true,
            R: hexToR(color),
            G: hexToG(color),
            B: hexToB(color)
        };
      } else {
          var parsed = color
              .substring(4, color.length - 1)
              .replace(/ /g, '')
              .split(',');
          return {
              R: parseInt(parsed[0]),
              G: parseInt(parsed[1]),
              B: parseInt(parsed[2])
          };
      }
  }

  function hexToR (h) { return parseInt((cutHex(h)).substring(0, 2), 16); }
  function hexToG (h) { return parseInt((cutHex(h)).substring(2, 4), 16); }
  function hexToB (h) { return parseInt((cutHex(h)).substring(4, 6), 16); }
  function cutHex (h) { return (h.charAt(0) === "#") ? h.substring(1, 7) : h; }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

}(window.NR = window.NR || {}, window._));