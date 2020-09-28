import * as React from 'react';
import { checkAuthAndLogout } from '../../utilities/authUtilities';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getFlashcards } from '../../utilities/apiUtilities';
import { FlashcardModel } from '../../data/flashcards';
import { sortFlashcardsAlphabeticallyByNative } from '../../utilities/arrayUtilities';
import { Routes } from '../../data/routes';

export interface DictionaryProps extends RouteComponentProps { }

export const DictionaryPageComponent = (props: DictionaryProps) => {
    const { history } = props;
    const [flashcards, setFlashcards] = React.useState([] as FlashcardModel[]);

    React.useEffect(() => {
        let mounted = true;
        checkAuthAndLogout(history);

        async function fetchData() {
            if (mounted) {
                const flashcards = await getFlashcards();
                setFlashcards(sortFlashcardsAlphabeticallyByNative(flashcards));
            }

            return () => mounted = false;
        }
        fetchData();
    }, [history])

    const onRowClicked = (
        e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
        flashcard: FlashcardModel
    ) => {
        e.preventDefault();
        history.push(`${Routes.addEditFlashcard}/${flashcard.id}`);
    }

    return (
        <div className="container">
            <h1>Dictionary</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Native</th>
                        <th scope="col">Foreign</th>
                        <th scope="col">Pronunciation</th>
                    </tr>
                </thead>
                <tbody>
                    {flashcards.map(flashcard =>
                        <tr onClick={(e) =>
                            onRowClicked(e, flashcard)}
                            key={flashcard.native}
                            style={{cursor: 'pointer'}}
                        >
                            <td>{flashcard.native}</td>
                            <td>{flashcard.foreign}</td>
                            <td>{flashcard.pronunciation}</td>
                        </tr>)}
                </tbody>

            </table>
        </div>
    )
}

export const DictionaryPage = withRouter(DictionaryPageComponent);