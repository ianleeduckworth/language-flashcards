import { History } from 'history';
import { auth } from '../firebase';
import { Routes } from '../data/routes';

export const checkAuthAndLogout = (history: History<any>) => {
    const { currentUser } = auth;

    if (!currentUser) {
        history.push(Routes.home)
    }
}