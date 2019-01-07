import React, {Component, Fragment} from 'react';
import {IServices, ServicesObserver} from 'ab/services/services';

interface IStartScreen {
  isConfigVisible: boolean;
}

export class StartScreen extends Component<IStartScreen> {
  render() {
    const {isConfigVisible} = this.props;

    return (
      <ServicesObserver obs={(services: IServices) => services.config.state$}>
        {(config, services) => (
          <div className="start-screen flex flex-column vw-100 vh-100 ph4 pv2 bg-purple light-yellow">
            <h1 className="ph3">Alpha Brain</h1>

            <div className="flex flex-column items-start pa3">
              <button
                className="w4 ph3 pv1 mb1 ba bw1 b--light-yellow bg-transparent light-yellow"
                onClick={() =>
                  services.flow.action$.shamefullySendNext({
                    type: 'changeScreen',
                    payload: 'ave',
                  })
                }
              >
                Start
              </button>

              <button
                className={`w4 ph3 pv1 ba bw1 b--light-yellow ${
                  isConfigVisible ? 'bg-light-yellow purple' : 'bg-transparent light-yellow'
                }`}
                onClick={() =>
                  services.flow.action$.shamefullySendNext({
                    type: 'toggleConfig',
                    payload: undefined,
                  })
                }
              >
                Config
              </button>
            </div>

            {isConfigVisible && (
              <div>
                <fieldset className="bt bl-0 bb-0 br-0 b--light-yellow">
                  <legend className="pa2">Visual</legend>

                  <label className="db pa2">
                    <div>Frequency</div>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="20"
                      value={config.visualModulationFrequency}
                      onChange={ev =>
                        services.config.update$.shamefullySendNext(state => ({
                          ...state,
                          visualModulationFrequency: parseFloat(ev.target.value),
                        }))
                      }
                    />
                    <span> Hz</span>
                  </label>

                  <label className="db pa2">
                    <div>Hue</div>
                    <select
                      value={config.visualHue}
                      onChange={ev =>
                        services.config.update$.shamefullySendNext(state => ({
                          ...state,
                          visualHue: parseFloat(ev.target.value),
                        }))
                      }
                    >
                      <option value="300">Purple (Delta)</option>
                      <option value="240">Blue (Theta)</option>
                      <option value="180">Cyan (Alpha)</option>
                      <option value="120">Green (Alpha)</option>
                      <option value="60">Yellow (Beta)</option>
                      <option value="0">Red (Beta)</option>
                    </select>
                  </label>

                  <label className="db pa2">
                    <div>Intensity</div>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="100"
                      value={config.visualIntensity}
                      onChange={ev =>
                        services.config.update$.shamefullySendNext(state => ({
                          ...state,
                          visualIntensity: parseFloat(ev.target.value),
                        }))
                      }
                    />
                    <span> %</span>
                  </label>
                </fieldset>

                <fieldset className="bt bl-0 bb-0 br-0 b--light-yellow">
                  <legend className="pa2">Audio</legend>

                  <label className="db pa2">
                    <div>Frequency</div>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="20"
                      value={config.audioModulationFrequency}
                      onChange={ev =>
                        services.config.update$.shamefullySendNext(state => ({
                          ...state,
                          audioModulationFrequency: parseFloat(ev.target.value),
                        }))
                      }
                    />
                    <span> Hz</span>
                  </label>

                  <label className="db pa2">
                    <div>Tone</div>
                    <input
                      type="number"
                      step="1"
                      min="60"
                      max="440"
                      value={config.audioCarrierFrequency}
                      onChange={ev =>
                        services.config.update$.shamefullySendNext(state => ({
                          ...state,
                          audioCarrierFrequency: parseFloat(ev.target.value),
                        }))
                      }
                    />
                    <span> Hz</span>
                  </label>

                  <label className="db pa2">
                    <div>Volume</div>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={config.audioVolume}
                      onChange={ev =>
                        services.config.update$.shamefullySendNext(state => ({
                          ...state,
                          audioVolume: parseFloat(ev.target.value),
                        }))
                      }
                    />
                    <span> %</span>
                  </label>
                </fieldset>
              </div>
            )}
          </div>
        )}
      </ServicesObserver>
    );
  }
}
