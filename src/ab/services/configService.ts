import xs from 'xstream';

export interface IConfig {
  visualModulationFrequency: number; // In Hz
  visualHue: number; // 0-360
  visualIntensity: number; // 0-100
  audioCarrierFrequency: number; // In Hz
  audioModulationFrequency: number; // In Hz
  audioVolume: number; // 0-100
}

function getConfig(): IConfig {
  return {
    visualModulationFrequency: 10,
    visualHue: 180, // From 0-360
    visualIntensity: 50,
    audioCarrierFrequency: 100,
    audioModulationFrequency: 10,
    audioVolume: 50,
  };
}

type ConfigUpdateFn = (config: IConfig) => IConfig;

export function createConfigService(defaultConfig = getConfig()) {
  const update$ = xs.create<ConfigUpdateFn>();
  const state$ = update$.fold<IConfig>((state, updateFn) => updateFn(state), defaultConfig);
  return {state$, update$};
}
