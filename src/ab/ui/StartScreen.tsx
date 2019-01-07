import React, {Component} from 'react';
import {IServices, ServicesObserver} from 'ab/services/services';

export class StartScreen extends Component {
  render() {
    return (
      <ServicesObserver obs={(services: IServices) => services.config.state$}>
        {(config, services) => (
          <div className="start-screen">
            <h1>Alpha Brain</h1>

            <fieldset>
              <legend>Visual</legend>
              <label>
                <span>Frequency</span>
                <input type="number" step="0.5" min="0.5" max="20" />
                <span>Hz</span>
              </label>

              <label>
                <span>Hue</span>
                <select>
                  <option value="300">Purple (Delta)</option>
                  <option value="240">Blue (Theta)</option>
                  <option value="180">Cyan (Alpha)</option>
                  <option value="120">Green (Alpha)</option>
                  <option value="60">Yellow (Beta)</option>
                  <option value="0">Red (Beta)</option>
                </select>
              </label>

              <label>
                <span>Intensity</span>
                <input type="number" step="1" min="1" max="100" />
                <span>%</span>
              </label>
            </fieldset>

            <fieldset>
              <legend>Audio</legend>
              <label>
                <span>Frequency</span>
                <input type="number" step="0.5" min="0.5" max="20" />
                <span>Hz</span>
              </label>

              <label>
                <span>Tone</span>
                <input type="number" step="1" min="60" max="440" />
                <span>Hz</span>
              </label>

              <label>
                <span>Volume</span>
                <input type="number" step="1" min="0" max="100" />
                <span>%</span>
              </label>
            </fieldset>

            <button
              onClick={() =>
                services.flow.action$.shamefullySendNext({
                  type: 'changeScreen',
                  payload: 'ave',
                })
              }
            >
              Start
            </button>
          </div>
        )}
      </ServicesObserver>
    );
  }
}
