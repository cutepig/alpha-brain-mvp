// @ts-ignore
import NoSleep from 'nosleep.js';
import {IConfig} from 'ab/services/configService';
import {el} from 'redom';
import {IServices} from 'ab/services/services';

console.log('nosleep?', NoSleep);

interface IAVEScreen {
  config: IConfig;
}

export class AVEScreen {
  el: HTMLElement;
  config: IConfig;
  nosleep: any;
  audioContext: AudioContext;
  carrierNode: OscillatorNode;
  modulatorNode: OscillatorNode;
  gainNode: GainNode;

  constructor({config}: IAVEScreen, {flow}: IServices) {
    this.config = config;
    // TODO: Move nosleep to services
    this.nosleep = new NoSleep();
    this.audioContext = new AudioContext();
    this.carrierNode = new OscillatorNode(this.audioContext);
    this.modulatorNode = new OscillatorNode(this.audioContext);
    this.gainNode = new GainNode(this.audioContext);

    this.el = el('div.alpha-brain', {
      onclick: () => flow.action$.shamefullySendNext({type: 'changeScreen', payload: 'start'}),
    });
    this.el.style.setProperty(
      '--visual-color',
      `hsl(${config.visualHue}deg, 100%, ${config.visualIntensity}%)`,
    );
    this.el.style.setProperty(
      '--visual-modulation-frequency',
      `${0.5 / config.visualModulationFrequency}s`,
    );

    this.carrierNode.frequency.value = config.audioCarrierFrequency;
    this.modulatorNode.frequency.value = config.audioModulationFrequency;
    this.gainNode.gain.value = 0;
  }

  onmount() {
    // TODO: config this
    this.el.requestFullscreen();
    this.nosleep.enable();

    this.modulatorNode.connect(this.gainNode.gain);
    this.carrierNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.modulatorNode.start(0);
    this.carrierNode.start(0);
  }

  onunmount() {
    this.nosleep.disable();

    // @ts-ignore
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    this.gainNode.disconnect();
    this.carrierNode.stop();
    this.modulatorNode.stop();
    this.carrierNode.disconnect();
    this.modulatorNode.disconnect();
  }
}
