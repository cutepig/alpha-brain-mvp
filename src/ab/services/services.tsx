import React, {ReactNode} from 'react';
import {createContext} from 'preact-context';
import {Stream} from 'xstream';
import {createConfigService} from 'ab/services/configService';
import {createFlowService} from 'ab/services/flowService';
import {Observe} from 'ab/redomHelpers';

export interface IServices {
  config: ReturnType<typeof createConfigService>;
  flow: ReturnType<typeof createFlowService>;
}

export function createServices(): IServices {
  return {
    config: createConfigService(),
    flow: createFlowService(),
  };
}

// @ts-ignore
export const Services = createContext<IServices>();

interface IServicesObserver<P> {
  obs: (services: IServices) => Stream<P>;
  children: (props: P, services: IServices) => ReactNode;
}

export function ServicesObserver<P>({obs, children}: IServicesObserver<P>) {
  return (
    <Services.Consumer>
      {(services: IServices) => (
        <Observe in$={obs(services)}>{value => children(value, services)}</Observe>
      )}
    </Services.Consumer>
  );
}
