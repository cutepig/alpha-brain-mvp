'use strict';

function getConfig() {
  return {
    visualModulationFrequency: 10,
    visualHue: 0.5,
    visualIntensity: 0.5,
    audioCarrierFrequency: 100,
    audioModulationFrequency: 10,
  };
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

class AlphaBrainScreen {
  constructor(config, onStop) {
    this.config = config;

    this.el = redom.el('div.alpha-brain', { onclick: onStop });
    this.el.style.setProperty('--visual-color', `rgb(${hslToRgb(config.visualHue, 1, config.visualIntensity)})`);
    this.el.style.setProperty('--visual-modulation-frequency', `${0.5 / config.visualModulationFrequency}s`);
  }

  onmount() {
    const audioContext = new AudioContext;
    const carrierNode = audioContext.createOscillator();
    const modulatorNode = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    carrierNode.frequency.value = 100;    // TODO: Make this variable
    modulatorNode.frequency.value = 10;   // TODO: Make this variable
    gainNode.gain.value = 0;

    modulatorNode.connect(gainNode.gain);
    carrierNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    modulatorNode.start(0);
    carrierNode.start(0);

    this.audioContext = audioContext;
    this.carrierNode = carrierNode;
    this.modulatorNode = modulatorNode;
    this.gainNode = gainNode;
  }

  onunmount() {
    this.gainNode.disconnect();
    this.carrierNode.stop();
    this.modulatorNode.stop();
    this.carrierNode.disconnect();
    this.modulatorNode.disconnect();
  }
}

function StartScreen(onStart) {
  return redom.el('div.start-screen', { onclick: onStart }, 'Start');
}

class App {
  constructor() {
    this.config = getConfig();
    this.screen = 'start'; // 'start' | 'alpha-brain'
    this.el = redom.el('main.app', this.renderChildren());
  }

  update() {
    redom.setChildren(this.el, this.renderChildren());
  }

  renderChildren() {
    if (this.screen === 'start') {
      return StartScreen(() => this.onStart());
    } else {
      return new AlphaBrainScreen(this.config, () => this.onStop());
    }
  }

  onStart() {
    this.screen = 'alpha-brain';
    this.update();
  }

  onStop() {
    this.screen = 'start';
    this.update();
  }
}

redom.mount(document.getElementById('app'), new App());
