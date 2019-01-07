import {Stream, Listener} from 'xstream';
import {RedomComponent} from 'redom';

export interface IComponent<P> extends RedomComponent {
  update(props: P): void;
}

export function subscribeTo<P>(in$: Stream<P>) {
  return (el: IComponent<P>) => {
    const {onmount, onunmount} = el;

    const listener: Listener<P> = {
      next: value => {
        // console.log('Subscriber next', value);
        el.update(value);
      },
      error: e => {
        console.error('Subscriber error', e);
        throw e;
      },
      complete: () => undefined,
    };

    el.onmount = () => {
      // console.log('Subscriber onmount');
      in$.addListener(listener);
      if (onmount) {
        onmount.call(el);
      }
    };

    el.onunmount = () => {
      // console.log('Subscriber onunmount');
      in$.removeListener(listener);
      if (onunmount) {
        onunmount.call(el);
      }
    };

    return el;
  };
}
