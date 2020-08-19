import * as React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../data/routes';

export const HomePageComponent = () => {
    return (
        <div className="container">
            <div className="row">
                <h1>Language Flashcards</h1>
            </div>
            <div className="row">
                <p>A great way to study vocabulary.  Add words and then study them.</p>
            </div>
            <div className="row">
                <Link to={Routes.flashcards}>Get started studying!</Link>
            </div>
            <div className="row">
                <Link to={Routes.addFlashcard}>Add a new flashcard!</Link>
            </div>
        </div>
    )
}

export const HomePage = HomePageComponent;