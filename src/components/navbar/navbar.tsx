import * as React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { Routes } from "../../data/routes";
import "./navbar.scss";
import { auth } from '../../firebase';
import { connect } from "react-redux";
import { ApplicationState } from "../../reducers/rootReducer";

interface NavbarProps extends RouteComponentProps {
  currentUser?: string;
}

export const NavbarComponent = (props: NavbarProps) => {
  const { history, currentUser } = props;

  const onLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    history.push(Routes.login);
  }

  const onLogOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    auth.signOut();
    history.push(Routes.home);
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container d-flex align-items-center">
          <Link className="navbar-brand mr-auto" to={Routes.home}>Flashcards</Link>
          {currentUser &&
            <>
              <h6 className="d-none d-md-block mb-0 mr-3 font-italic">{currentUser}</h6>
              <button className="btn btn-outline-secondary my-2 ml-2" onClick={onLogOut}>Logout</button>
            </>
          }
          {!currentUser &&
            <button className="btn btn-outline-secondary my-2 ml-4" onClick={onLogin}>Login</button>
          }
        </div>
      </nav>
    </>
  );
}

const mapStateToProps = (state: ApplicationState) => {
  return {
    currentUser: state.currentUser
  }
};

export const Navbar = withRouter(connect(mapStateToProps)(NavbarComponent as any));
