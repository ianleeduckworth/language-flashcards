/**
 * Randomizes the contents of an array
 * @param array the array to be randomized
 */
export const shuffleArray = (array: Array<any>) => {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a;
}