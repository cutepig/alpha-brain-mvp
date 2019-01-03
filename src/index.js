'use strict';

function getConfig() {
  return {
    visualModulationFrequency: 10,
    visualHue: 180,   // From 0-360
    visualIntensity: 50,
    audioCarrierFrequency: 100,
    audioModulationFrequency: 10,
  };
}

class AlphaBrainScreen {
  constructor({ config, onStop, nosleep }) {
    this.config = config;
    this.nosleep = nosleep;

    this.el = redom.el('div.alpha-brain', { onclick: onStop });
    this.el.style.setProperty('--visual-color', `hsl(${config.visualHue}deg, 100%, ${config.visualIntensity}%)`);
    this.el.style.setProperty('--visual-modulation-frequency', `${0.5 / config.visualModulationFrequency}s`);
  }

  onmount() {
    this.el.requestFullscreen();
    this.nosleep.enable();

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
    this.nosleep.disable();

    if (document.fullscreenElement) {
      document.exitFullscreen()
    }

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
    this.nosleep = new NoSleep();
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
      return new AlphaBrainScreen({
        config: this.config,
        onStop: () => this.onStop(),
        nosleep: this.nosleep
      });
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
