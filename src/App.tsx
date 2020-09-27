import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { FlashcardPage } from './pages/flashcardPage/flashcardPage';
import { HomePage } from './pages/homePage/homePage';
import { Routes } from './data/routes';
import { LoginPage } from './pages/loginPage/loginPage';
import { Navbar } from './components/navbar/navbar';
import { AddFlashcardPage } from './pages/addFlashcard/addFlashcard';
import { DictionaryPage } from './pages/dictionary/dictionaryPage';
import { auth } from './firebase';
import { store } from './index';
import { Actions } from './reducers/actions';
import { NotFoundPage } from './pages/404/notFound';

/***
 * The main application component
 */
export const AppComponent = () => {

  React.useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      authUser ?
        store.dispatch({ type: Actions.LOGIN, user: authUser.email }) :
        store.dispatch({ type: Actions.LOGIN, user: undefined })
    })
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path={Routes.home} component={HomePage} exact />
        <Route path={Routes.flashcards} component={FlashcardPage} exact />
        <Route path={Routes.login} component={LoginPage} exact />
        <Route path={Routes.addFlashcard} component={AddFlashcardPage} exact />
        <Route path={Routes.dictionary} component={DictionaryPage} exact />
        <Route component={NotFoundPage}></Route>
      </Switch>
    </BrowserRouter>

  )
}

const App = AppComponent

export default App;
