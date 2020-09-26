import { FlashcardModel } from "../data/flashcards";
import { Actions } from "./actions";

export interface ApplicationState {
    currentUser: string | null | undefined;
    flashcards: FlashcardModel[] | null | undefined;
  }
  
  const initState: ApplicationState = {
    currentUser: undefined,
    flashcards: undefined
  };
  
  export const rootReducer = (state = initState, action: any) => {
    if (action.type === Actions.LOGIN) {
      return {
        ...state,
        currentUser: action.user
      }
    }

    if (action.type === Actions.SET_FLASHCARDS) {
      return {
        ...state,
        flashcards: action.flashcards
      }
    }

    if (action.type === Actions.CLEAR_FLASHCARDS) {
      return {
        ...state,
        flashcards: undefined
      }
    }
  
    return {...state};
  };
  
  export default rootReducer;
  