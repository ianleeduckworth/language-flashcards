import { FlashcardModel } from "../data/flashcards";

/**
 * Randomizes the contents of an array
 * @param array the array to be randomized
 */
export const shuffleArray = (array: Array<any>) => {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const sortFlashcardsAlphabeticallyByNative = (array: Array<FlashcardModel>) => {
    return array.sort((a, b) => {
        var textA = a.native.toUpperCase();
        var textB = b.native.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
}