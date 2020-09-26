import { db } from "../firebase";
import { FlashcardModel } from "../data/flashcards";
import { store } from "..";
import { Actions } from "../reducers/actions";

export const getFlashcards = async () => {
    const flashcardsFromReducer = store.getState().flashcards;

    if (flashcardsFromReducer) {
        return flashcardsFromReducer;
    }

    const { docs } = await db.collection('flashcards').get();
    const flashcards = docs.map(doc => doc.data()) as FlashcardModel[];
    store.dispatch({
        type: Actions.SET_FLASHCARDS,
        flashcards
    });

    return flashcards;
}