import * as React from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { FlashcardModel } from '../../data/flashcards';
import { checkAuthAndLogout } from '../../utilities/authUtilities';
import { shuffleArray } from '../../utilities/arrayUtilities';
import { getFlashcards } from '../../utilities/apiUtilities';
import { Routes } from '../../data/routes';

interface Outcome {
    answered: boolean;
    correct: boolean;
    message: string;
}

export interface FlashcardPageProps extends RouteComponentProps { }

const FlashcardPageComponent = (props: FlashcardPageProps) => {
    const { history } = props;

    const initOutcome: Outcome = {
        answered: false,
        correct: false,
        message: ''
    };

    const [flashcards, setFlashcards] = React.useState([] as FlashcardModel[]);
    const [flashcard, setFlashcard] = React.useState({
        id: '',
        native: '',
        foreign: '',
        alsoNative: [],
        alsoForeign: [],
        pronunciation: ''
    } as FlashcardModel);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = React.useState(0);
    const [answer, setAnswer] = React.useState('');
    const [outcome, setOutcome] = React.useState(initOutcome);

    React.useEffect(() => {
        let mounted = true;
        checkAuthAndLogout(history);

        async function fetchData() {
            const flashcards = await getFlashcards();
            if (mounted) {
                const shuffledFlashcards = shuffleArray(flashcards)
                setFlashcards(shuffledFlashcards);
                setCurrentFlashcardIndex(0);
                setFlashcard(shuffledFlashcards[0]);
            }

            return () => mounted = false;
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadNewItem = () => {
        if (currentFlashcardIndex === flashcards.length - 1) {
            setCurrentFlashcardIndex(0);
            setFlashcard(flashcards[0]);
        } else { 
            setCurrentFlashcardIndex(currentFlashcardIndex + 1);
            setFlashcard(flashcards[currentFlashcardIndex + 1])
        }
        
        setAnswer('');
    }

    const onCheckClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        let correct = false;
        if (answer.toUpperCase() === flashcard.native.toUpperCase()) {
            correct = true;
            setOutcome({
                answered: true,
                correct: true,
                message: `You got it right! "${flashcard.foreign}" means "${flashcard.native}"`
            });
        } else if (flashcard.alsoNative && flashcard.alsoNative.map(a => a.toUpperCase()).indexOf(answer.toUpperCase()) !== -1) {
            correct = true;
            setOutcome({
                answered: true,
                correct: true,
                message: `you got it right, but a better answer for "${flashcard.foreign}" would have been "${flashcard.native}"`
            });
        } else {
            setOutcome({
                answered: true,
                correct: false,
                message: `You got it wrong.  Correct answer: ${flashcard.native}`
            });
        }

        if (correct) {
            loadNewItem();
        }
    }

    const onEditClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        history.push(`${Routes.addEditFlashcard}/${flashcard.id}`);
    }

    const dismissMessage = () => {
        setOutcome(initOutcome);
    }

    return (
        <div className="container d-flex flex-column align-items-center">
            <h1 className="my-2">{flashcard.foreign}</h1>
            <form className="d-flex flex-column align-items-center">
                <input className="my-2" onChange={e => setAnswer(e.target.value)} value={answer} />
                {flashcard.pronunciation &&
                    <div className="my-2">
                        <p>
                            <a data-toggle="collapse" href="#pronunciation-collapse" role="button" aria-expanded="false" aria-controls="collapseExample">
                                Show pronunciation
                        </a>
                        </p>
                        <div className="collapse" id="pronunciation-collapse">
                            <div className="card card-body">
                                {flashcard.pronunciation}
                            </div>
                        </div>
                    </div>
                }
                <button type="submit" className="btn btn-primary my-2" onClick={onCheckClick}>Check</button>
            </form>
            <button type="submit" className="btn btn-secondary my-2" onClick={onEditClick}>Edit</button>
            {outcome.answered && outcome.correct &&
                <div className="alert alert-success alert-dismissible fade show my-2" role="alert">
                    <strong>Yay!</strong>{` ${outcome.message}`}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={dismissMessage}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            }
            {outcome.answered && !outcome.correct &&
                <div className="alert alert-danger alert-dismissible fade show my-2" role="alert">
                    <strong>Uh oh!</strong>{` ${outcome.message}`}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={dismissMessage}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            }
        </div>
    )
}

export const FlashcardPage = withRouter(FlashcardPageComponent);