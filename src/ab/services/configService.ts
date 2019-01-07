import xs from 'xstream';

export interface IConfig {
  visualModulationFrequency: number; // In Hz
  visualHue: number; // 0-360
  visualIntensity: number; // 0-100
  audioCarrierFrequency: number; // In Hz
  audioModulationFrequency: number; // In Hz
}

function getConfig(): IConfig {
  return {
    visualModulationFrequency: 10,
    visualHue: 180, // From 0-360
    visualIntensity: 50,
    audioCarrierFrequency: 100,
    audioModulationFrequency: 10,
  };
}

export function createConfigService(defaultConfig = getConfig()) {
  return {state$: xs.of(defaultConfig)};
}
