import React, {Component} from 'react';
// @ts-ignore
import NoSleep from 'nosleep.js';
import {IConfig} from 'ab/services/configService';
import {IServices, Services, ServicesObserver} from 'ab/services/services';

interface IAVEScreen {
  config: IConfig;
}

class _AVEScreen extends Component<IAVEScreen> {
  el: HTMLDivElement | null = null;
  nosleep: any;
  audioContext: AudioContext;
  carrierNode: OscillatorNode;
  modulatorNode: OscillatorNode;
  modulatorGainNode: GainNode;
  gainNode: GainNode;

  constructor(props: IAVEScreen) {
    super(props);

    // TODO: Move nosleep to services
    this.nosleep = new NoSleep();
    this.audioContext = new AudioContext();
    this.carrierNode = new OscillatorNode(this.audioContext);
    this.modulatorNode = new OscillatorNode(this.audioContext);
    this.modulatorGainNode = new GainNode(this.audioContext);
    this.gainNode = new GainNode(this.audioContext);
  }

  render() {
    return (
      <Services.Consumer>
        {({flow}: IServices) => (
          <div
            className="ave-screen vw-100 vh-100"
            ref={el => (this.el = el)}
            onClick={() =>
              flow.action$.shamefullySendNext({type: 'changeScreen', payload: 'start'})
            }
          />
        )}
      </Services.Consumer>
    );
  }

  componentDidMount() {
    const {config} = this.props;

    this.el!.style.setProperty(
      '--visual-color',
      `hsl(${config.visualHue}deg, 100%, ${config.visualIntensity}%)`,
    );
    this.el!.style.setProperty(
      '--visual-modulation-frequency',
      `${0.5 / config.visualModulationFrequency}s`,
    );

    if (config.enableFullscreen) {
      this.el!.requestFullscreen();
    }
    this.nosleep.enable();

    this.carrierNode.frequency.value = config.audioCarrierFrequency;
    this.modulatorNode.frequency.value = config.audioModulationFrequency;
    this.modulatorGainNode.gain.value = config.audioVolume / 100;
    this.gainNode.gain.value = 0.5;

    this.modulatorNode.connect(this.modulatorGainNode);
    this.modulatorGainNode.connect(this.gainNode.gain);
    this.carrierNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.modulatorNode.start(0);
    this.carrierNode.start(0);
  }

  componentWillUnmount() {
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

export const AVEScreen = () => (
  <ServicesObserver obs={(services: IServices) => services.config.state$}>
    {config => <_AVEScreen config={config} />}
  </ServicesObserver>
);
