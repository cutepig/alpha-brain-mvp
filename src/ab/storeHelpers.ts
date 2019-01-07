import xs from 'xstream';

export {xs};

export interface Action<S extends string, T = any> {
  type: S;
  payload: T extends undefined ? never : T;
}

type ActionTypeOf<A> = A extends Action<any> ? A['type'] : never;
type Reducer<S, A extends Action<any>> = (state: S, a: A['payload']) => S;

export function mapAction<S, A extends Action<any>>(
  state: S,
  action: A,
  reducers: {[key in ActionTypeOf<A>]: Reducer<S, A>},
): S {
  // @ts-ignore
  const reducer = reducers[action.type] as Reducer<S, A>;
  return reducer ? reducer(state, action.payload) : state;
}

export function filterAction<A extends Action<any>>(type: ActionTypeOf<A>) {
  return (action: A) => action.type === type;
}
