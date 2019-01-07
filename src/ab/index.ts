import {el, mount, setChildren} from 'redom';
import xs from 'xstream';
import {IServices, createServices} from 'ab/services/services';
import {IConfig} from 'ab/services/configService';
import {IFlow} from 'ab/services/flowService';
import {subscribeTo, IComponent} from 'ab/redomHelpers';
import {StartScreen} from 'ab/ui/StartScreen';
import {AVEScreen} from 'ab/ui/AVEScreen';

interface IApp {
  config: IConfig;
  flow: IFlow;
}

class App implements IComponent<IApp> {
  el: HTMLElement;

  constructor(public services: IServices) {
    this.el = el('main.app');
  }

  update(props: IApp) {
    setChildren(this.el, this.renderChildren(props) as any);
  }

  renderChildren({config, flow}: IApp) {
    if (flow.screen === 'start') {
      return StartScreen(this.services);
    } else {
      return new AVEScreen({config}, this.services);
    }
  }
}

const services = createServices();
mount(
  document.getElementById('app')!,
  subscribeTo(
    xs.combine(services.config, services.flow.state$).map(([config, flow]) => ({config, flow})),
  )(new App(services)),
);
