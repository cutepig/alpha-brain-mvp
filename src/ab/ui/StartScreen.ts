import {el} from 'redom';
import {IServices} from 'ab/ui/services/services';

export function StartScreen({flow}: IServices) {
  return el(
    'div.start-screen',
    {onclick: () => flow.action$.shamefullySendNext({type: 'changeScreen', payload: 'ave'})},
    'Start',
  );
}
