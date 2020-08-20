import { History } from 'history';
import { auth } from '../firebase';
import { Routes } from '../data/routes';

/**
 * Checks if the user is authenticated and if not, sends the user to the home page
 * @param history the browser's history
 */
export const checkAuthAndLogout = (history: History<any>) => {
    const { currentUser } = auth;

    if (!currentUser) {
        history.push(Routes.home)
    }
}