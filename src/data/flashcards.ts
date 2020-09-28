export interface FlashcardModel extends NewFlashcardModel {
    id: string;
}

export interface NewFlashcardModel {
    native: string;
    alsoNative?: string[];
    foreign: string;
    alsoForeign?: string[];
    pronunciation?: string;
}