import * as React from 'react';
import { auth } from '../../firebase';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Routes } from '../../data/routes';
import { connect } from 'react-redux';

export interface LoginProps extends RouteComponentProps {
    login: (user: string | null | undefined) => void;
}

export const LoginPageComponent = (props: LoginProps) => {
    const { history, login } = props;

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const onSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const user = result.user;
            login(user ? user.email : 'Unknown User');
            setError('');
            history.push(Routes.flashcards);
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <>
            <div className="container">
                <h1 className="py-3 text-center">Log in to your account</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            aria-describedby="emailHelp"
                            placeholder="Enter password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
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
            </div>
        </>
    )
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        login: (user: string) => dispatch({type: "LOGIN", user})
    }
}

export const LoginPage = withRouter(connect(null, mapDispatchToProps)(LoginPageComponent as any));