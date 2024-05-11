import { createReducer, on, Action } from '@ngrx/store';
import { toggleForm } from './auth.actions';

export interface State {
  showSignUp: boolean;
}

export const initialState: State = {
  showSignUp: false,
};

export const authReducer = createReducer(
  initialState,
  on(toggleForm, (state) => ({ ...state, showSignUp: !state.showSignUp }))
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
