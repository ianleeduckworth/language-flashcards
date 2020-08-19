import * as React from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Flashcard } from '../../data/flashcards';
import { checkAuthAndLogout } from '../../utilities/authUtilities';
import { db } from '../../firebase';

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

    const [flashcards, setFlashcards] = React.useState([] as Flashcard[]);
    const [flashcard, setFlashcard] = React.useState({} as Flashcard);
    const [answer, setAnswer] = React.useState('');
    const [outcome, setOutcome] = React.useState(initOutcome);

    React.useEffect(() => {
        let mounted = true;
        checkAuthAndLogout(history);

        async function fetchData() {
            const { docs } = await db.collection('flashcards').get();
            const flashcards = docs.map(doc => doc.data()) as Flashcard[];
            console.log(flashcards);
            if (mounted) {
                setFlashcards(flashcards);
                loadNewItem(flashcards[Math.floor(Math.random() * flashcards.length)]);
            }

            return () => mounted = false;
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadNewItem = (flashcard?: Flashcard) => {
        const toLoad = flashcard ?? flashcards[Math.floor(Math.random() * flashcards.length)];
        if (toLoad) {
            setFlashcard(toLoad);
        } else {
            setFlashcard({
                foreign: '',
                native: '',
                alsoForeign: [''],
                alsoNative: [''],
                pronunciation: ''
            })
        }
        setOutcome(initOutcome);
    }

    const onCheckClick = () => {
        if (answer === flashcard.native) {
            setOutcome({
                answered: true,
                correct: true,
                message: 'You got it right!'
            });
        } else if (flashcard.alsoNative && flashcard.alsoNative.indexOf(answer) !== -1) {
            setOutcome({
                answered: true,
                correct: true,
                message: `you got it right, but a better answer would have been: ${flashcard.native}`
            });
            console.log(`you got it right.  Best answer: ${flashcard.native}`);
        } else {
            setOutcome({
                answered: true,
                correct: false,
                message: `You got it wrong.  Correct answer: ${flashcard.native}`
            });
        }
    }

    const dismissMessage = () => {
        setOutcome(initOutcome);
    }

    const onNextClicked = () => {
        loadNewItem();
        setAnswer('');
    }

    return (
        <div className="container d-flex flex-column align-items-center">
            <h1 className="my-2">{flashcard.foreign}</h1>
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
            <button type="button" className="btn btn-primary my-2" onClick={onCheckClick}>Check</button>
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
            {outcome.answered &&
                <button type="button" className="btn btn-primary my-2" onClick={onNextClicked}>Next</button>
            }
        </div>
    )
}

export const FlashcardPage = withRouter(FlashcardPageComponent);