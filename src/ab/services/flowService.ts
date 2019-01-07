import {xs, Action, mapAction} from 'ab/storeHelpers';

type Screen = 'start' | 'ave';

export interface IFlow {
  screen: Screen;
  isConfigVisible: boolean;
}

type FlowAction = Action<'changeScreen', Screen> | Action<'toggleConfig'>;

export function createFlowService() {
  const initialState: IFlow = {screen: 'start', isConfigVisible: false};

  const action$ = xs.create<FlowAction>();

  const state$ = action$.fold(
    (state, action) =>
      mapAction<IFlow, FlowAction>(state, action, {
        changeScreen: (state, screen) => ({
          ...state,
          screen,
        }),
        toggleConfig: state => ({
          ...state,
          isConfigVisible: !state.isConfigVisible,
        }),
      }),
    initialState,
  );

  return {action$, state$};
}
