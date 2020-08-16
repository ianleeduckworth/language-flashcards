import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { FlashcardPage } from './pages/flashcardPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={FlashcardPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
