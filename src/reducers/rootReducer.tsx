export interface ApplicationState {
    currentUser: string | null | undefined;
  }
  
  const initState: ApplicationState = {
    currentUser: undefined,
  };
  
  export const rootReducer = (state = initState, action: any) => {
    if (action.type === "LOGIN") {
      return {
        ...state,
        currentUser: action.user
      }
    }
  
    return {...state};
  };
  
  export default rootReducer;
  