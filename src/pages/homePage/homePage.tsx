import * as React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../data/routes';

export const HomePageComponent = () => {
    return (
        <div className="container">
            <div className="row">
                <h1>Language Flashcards</h1>
            </div>
            <div className="row py-2">
                <p>A great way to study vocabulary.  Add words and then study them.</p>
            </div>
            <div className="row py-2">
                <Link to={Routes.flashcards}>Get started studying!</Link>
            </div>
            <div className="row py-2">
                <Link to={Routes.addEditFlashcard}>Add a new flashcard!</Link>
            </div>
            <div className="row py-2">
                <Link to={Routes.dictionary}>See all your words!</Link>
            </div>
        </div>
    )
}

export const HomePage = HomePageComponent;