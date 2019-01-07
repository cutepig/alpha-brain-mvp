import {xs, Action, mapAction} from 'ab/storeHelpers';

type Screen = 'start' | 'ave';

export interface IFlow {
  screen: Screen;
}

type FlowAction = Action<'changeScreen', Screen>;

export function createFlowService() {
  const initialState: IFlow = {screen: 'start'};

  const action$ = xs.create<FlowAction>();

  const state$ = action$.fold(
    (state, action) =>
      mapAction<IFlow, FlowAction>(state, action, {
        changeScreen: (state, screen) => ({
          ...state,
          screen,
        }),
      }),
    initialState,
  );

  return {action$, state$};
}
