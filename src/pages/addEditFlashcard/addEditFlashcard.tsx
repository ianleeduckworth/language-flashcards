import * as React from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import { checkAuthAndLogout } from '../../utilities/authUtilities';
import { auth, flashcardsDb } from '../../firebase';
import { FlashcardModel, NewFlashcardModel } from '../../data/flashcards';
import { connect } from 'react-redux';
import { Actions } from '../../reducers/actions';
import { Routes } from '../../data/routes';

export interface AddEditFlashcardPageProps extends RouteComponentProps {
    clearFlashcards: () => void;
}

export const AddEditFlashcardPageComponent = (props: AddEditFlashcardPageProps) => {
    const { history, clearFlashcards } = props;

    const [editMode, setEditMode] = React.useState(false);
    const [flashcardId, setFlashcardId] = React.useState('');

    const [native, setNative] = React.useState('');
    const [foreign, setForeign] = React.useState('');
    const [alsoNative, setAlsoNative] = React.useState([] as string[]);
    const [alsoForeign, setAlsoForeign] = React.useState([] as string[]);
    const [pronunciation, setPronunciation] = React.useState('' as string);

    const [alsoNativeInputs, setAlsoNativeInputs] = React.useState([] as string[]);
    const [alsoForeignInputs, setAlsoForeignInputs] = React.useState([] as string[]);

    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    React.useEffect(() => {
        let mounted = true;
        checkAuthAndLogout(history);

        const id = (props.match.params as any).flashcard_id as string;
        if (id) {
            setEditMode(true);
            setFlashcardId(id);
            const setData = async () => {
                if (!mounted) return;

                const doc = await flashcardsDb.doc(id).get();
                const data = doc.data() as FlashcardModel;

                setNative(data.native);
                setForeign(data.foreign);
                setAlsoNative(data.alsoNative ?? [] as string[]);
                setAlsoForeign(data.alsoForeign ?? [] as string[]);
                setPronunciation(data.pronunciation ?? '');

                return () => mounted = false;
            }
            setData();
        }
    }, [history, props.match.params]);

    const resetForm = () => {
        setNative('');
        setForeign('');
        setAlsoNative([]);
        setAlsoNativeInputs([]);
        setAlsoForeign([]);
        setAlsoForeignInputs([]);
        setPronunciation('');
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { currentUser } = auth;

        if (!currentUser) {
            console.log('user is not logged in.  log in to continue');
            return;
        }

        if (!native || !foreign) {
            setError('Native and foreign must be populated');
            return;
        }

        const toAdd: NewFlashcardModel = {
            native: native.toLowerCase(),
            foreign,
        }

        if (pronunciation) {
            toAdd.pronunciation = pronunciation
        }

        if (alsoNative && alsoNative.length > 0) {
            toAdd.alsoNative = alsoNative
        }

        if (alsoForeign && alsoForeign.length > 0) {
            toAdd.alsoForeign = alsoForeign
        }

        if (editMode) {
            await updateFlashcard(toAdd);
        } else {
            await addFlashcard(toAdd);
        }
    }

    const addFlashcard = async (flashcard: NewFlashcardModel) => {
        try {
            const { docs } = await flashcardsDb.where('native', '==', native).get();
            if (docs.length > 0) {
                setError('this item already exists in the database!');
                return;
            }

            await flashcardsDb.add(flashcard);
            resetForm();
            setSuccess(`New word "${native}" (or better yet: "${foreign}") was added!`);
        } catch (e) {
            setError(e);
        } finally {
            clearFlashcards();
        }
    }

    const updateFlashcard = async (flashcard: NewFlashcardModel) => {
        try {
            await flashcardsDb.doc(flashcardId).update({ ...flashcard });
            resetForm();
            setSuccess(`"${native}" was updated successfully!`);
            history.push(Routes.dictionary);
        } catch (e) {
            setError(e)
        } finally {
            clearFlashcards();
        }
    }

    const onNativeInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const { value } = e.target;
        let newNative = [...alsoNative];
        newNative[index] = value;
        setAlsoNative(newNative);
    }

    const onAddNativeInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setAlsoNativeInputs([...alsoNativeInputs, `also-native-input-${alsoNativeInputs.length}`]);
        setAlsoNative([...alsoNative, '']);
    }

    const onRemoveNativeInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        e.preventDefault();
        const newNative = [...alsoNative];
        newNative.splice(index, 1);
        setAlsoNative(newNative);

        const newNativeInputs = [...alsoNativeInputs];
        newNativeInputs.splice(index, 1);
        setAlsoNativeInputs(newNativeInputs);
    }

    const onForeignInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const { value } = e.target;
        let newNative = [...alsoNative];
        newNative[index] = value;
        setAlsoNative(newNative);
    }

    const onAddForeignInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setAlsoForeignInputs([...alsoForeignInputs, `also-foreign-input-${alsoForeignInputs.length}`]);
        setAlsoForeign([...alsoForeign, '']);
    }

    const onRemoveForeignInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        e.preventDefault();
        const newForeign = [...alsoForeign];
        newForeign.splice(index, 1);
        setAlsoForeign(newForeign);

        const newForeignInputs = [...alsoForeignInputs];
        newForeignInputs.splice(index, 1);
        setAlsoForeignInputs(newForeignInputs);
    }

    const onDeleteClicked = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        flashcardsDb.doc(flashcardId).delete();
        clearFlashcards();
        history.push(Routes.dictionary);
    }

    return (
        <div className="container">
            <h1 className="pt-3">Add Flashcard</h1>
            <form onSubmit={onSubmit}>
                <div className="container border py-2 my-3">
                    <div className="form-group">
                        <label htmlFor="recipe-title">Native*</label>
                        <input className="form-control" id="flashcard-native" onChange={e => setNative(e.target.value)} value={native} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Also Native</label>
                        {alsoNativeInputs?.map((input, index) =>
                            <div key={input} className="d-flex">
                                <h6 className="py-3 pr-3">{index + 1}</h6>
                                <input className="form-control my-1" id={input} onChange={e => onNativeInputChange(e, index)} />
                                <button type="button" className="close pb-3 px-2" aria-label="Close" onClick={(e) => onRemoveNativeInput(e, index)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        )}
                        <button className="btn btn-outline-secondary my-2" onClick={onAddNativeInput}>+ Add Native</button>
                    </div>
                </div>
                <div className="container border py-2 my-3">
                    <div className="form-group">
                        <label htmlFor="recipe-title">Foreign*</label>
                        <input className="form-control" id="flashcard-foreign" onChange={e => setForeign(e.target.value)} value={foreign} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Also Foreign</label>
                        {alsoForeignInputs?.map((input, index) =>
                            <div key={input} className="d-flex">
                                <h6 className="py-3 pr-3">{index + 1}</h6>
                                <input className="form-control my-1" id={input} onChange={e => onForeignInputChange(e, index)} />
                                <button type="button" className="close pb-3 px-2" aria-label="Close" onClick={(e) => onRemoveForeignInput(e, index)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        )}
                        <button className="btn btn-outline-secondary my-2" onClick={onAddForeignInput}>+ Add Foreign</button>
                    </div>
                </div>
                <div className="container border py-2 my-3">
                    <div className="form-group">
                        <label htmlFor="recipe-title">Pronunciation</label>
                        <input className="form-control" id="flashcard-native" onChange={e => setPronunciation(e.target.value)} value={pronunciation} />
                    </div>
                </div>
                <button className="btn btn-outline-primary" type="submit">Submit</button>
                {editMode && <button className="btn btn-outline-secondary ml-2" type="button" data-toggle="modal" data-target="#speedbumpModal">Delete</button>}
            </form>
            {error &&
                <div className="alert alert-danger mt-3" role="alert">
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => setError('')}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>Oh snap!</strong> {error}
                </div>
            }
            {success &&
                <div className="alert alert-success mt-3" role="alert">
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => setSuccess('')}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>Awesome!</strong> {success}
                </div>
            }

            {/*speedbump modal*/}
            <div className="modal fade" id="speedbumpModal" tabIndex={-1} role="dialog" aria-labelledby="speedbumpModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="speedbumpModalLabel">Are you sure?</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this item?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={onDeleteClicked}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        clearFlashcards: () => dispatch({ type: Actions.CLEAR_FLASHCARDS })
    }
}

export const AddEditFlashcardPage =
    connect(null, mapDispatchToProps)
        (withRouter(AddEditFlashcardPageComponent));