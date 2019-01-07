import {createConfigService} from 'ab/services/configService';
import {createFlowService} from 'ab/services/flowService';

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
