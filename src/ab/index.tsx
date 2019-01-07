import React, {Component} from 'react';
import {render} from 'preact';
import {IServices, createServices, Services} from 'ab/services/services';
import {Observe} from 'ab/redomHelpers';
import {StartScreen} from 'ab/ui/StartScreen';
import {AVEScreen} from 'ab/ui/AVEScreen';
import {IFlow} from 'ab/services/flowService';

interface IApp {
  services: IServices;
}

class App extends Component<IApp> {
  render() {
    const {services} = this.props;

    return (
      <Services.Provider value={services}>
        <Services.Consumer>
          {({flow}: IServices) => (
            <Observe in$={flow.state$}>
              {_flow => <main className="App">{this.renderChildren(_flow)}</main>}
            </Observe>
          )}
        </Services.Consumer>
      </Services.Provider>
    );
  }

  renderChildren(flow: IFlow) {
    switch (flow.screen) {
      case 'start':
        return <StartScreen isConfigVisible={flow.isConfigVisible} />;
      case 'ave':
        return <AVEScreen />;
    }
  }
}

const services = createServices();
render(<App services={services} />, document.getElementById('app')!);
