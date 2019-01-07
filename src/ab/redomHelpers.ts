import {Component, ReactNode} from 'react';
import {Stream, Subscription} from 'xstream';

interface IObserve<P> {
  in$: Stream<P>;
  children: (value: P) => ReactNode;
}
interface IObserveState<P> {
  value?: P;
}

export class Observe<P> extends Component<IObserve<P>> {
  subscription?: Subscription;
  state: IObserveState<P> = {};

  componentDidMount() {
    this.subscription = this.props.in$.subscribe({
      next: value => this.setState((state: IObserveState<P>) => ({...state, value})),
      error: error => console.error('Observe:', error),
    });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  render() {
    const {children} = this.props;
    const {value} = this.state;

    return typeof value !== 'undefined' && !!children && children(value);
  }
}
