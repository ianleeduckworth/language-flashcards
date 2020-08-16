export interface Flashcard {
    id: string;
    native: string;
    alsoNative?: string[];
    foreign: string;
    alsoForeign?: string[];
    pronunciation?: string;
}

export const flashcards: Flashcard[] = [
    {
        id: "1",
        native: "phone",
        alsoNative: [
            "telephone"
        ],
        foreign: "電話",
        pronunciation: "でんわ"
    },
    {
        id: "2",
        native: "car",
        alsoNative: [
            "automobile"
        ],
        foreign: "車",
        pronunciation: "くるま"
    },
    {
        id: "3",
        native: "hello",
        alsoNative: [
            "hi"
        ],
        foreign: "こんにちは"
    },
    {
        id: "4",
        native: "goodbye",
        alsoNative: [
            "bye"
        ],
        foreign: "さようなら"
    }
]