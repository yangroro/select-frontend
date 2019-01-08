declare module 'reduxsauce' {
  import { AnyAction, Reducer } from 'redux';

  export interface Actions {
    [ action: string ]: string[] | null;
  }

  export interface ActionTypes {
    [ action: string ]: string;
  }

  export type ActionCreators<S> = {
    [ action in keyof S ]: ( ...args: any[] ) => AnyAction;
  }

  export interface Handlers<S> {
    [ type: string ]: ( state: S, action: AnyAction ) => S;
  }

  /**
   * Custom options for created types and actions
   *
   * prefix - prepend the string to all created types
   */
  interface Options {
    prefix?: string;
  }

  interface CreatedActions<T, U> {
    Types: U;
    Creators: T;
  }

  export function createReducer<S>( initialState: S, handlers: Handlers<S> ): Reducer<S>;
  export function createTypes ( types: string, options?: Options ): ActionTypes;
  export function createActions<Actions>( actions: Actions, options?: Options ): CreatedActions<ActionCreators<Actions>, ActionTypes>;
}
