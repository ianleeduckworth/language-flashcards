import { flashcardsDb } from "../firebase";
import { FlashcardModel } from "../data/flashcards";
import { store } from "..";
import { Actions } from "../reducers/actions";

export const getFlashcards = async () => {
    const flashcardsFromReducer = store.getState().flashcards;

    if (flashcardsFromReducer) {
        return flashcardsFromReducer;
    }

    const { docs } = await flashcardsDb.get();
    const flashcards = docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
    }) as FlashcardModel[];
    store.dispatch({
        type: Actions.SET_FLASHCARDS,
        flashcards
    });

    return flashcards;
}