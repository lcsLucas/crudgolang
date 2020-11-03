import React, { useContext } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom";

import { AuthProvider, Context } from './Context/AuthContext'

import Header from './components/geral/HeaderContent'
import Posts from './components/Posts'
import Login from './components/Login'
import Logout from './components/Logout'

const GlobalStyle = createGlobalStyle`
    html {
        scroll-behavior: smooth;
    }
    body {
        background: #F6F6F6;
        font-family: 'Poppins', sans-serif;
    }
    html, body {
        height: 100%
    }
    #root {
        min-height: 100%
    }
    .container {
        margin-top: 2rem;
        margin-bottom: 2rem
    }
    .content {
        background: #FFF;
        border-radius: .4rem;
        border: 1px solid #EFEFEF;
        margin: 1.5rem 0 0;
        padding: 1rem 1.5rem 1.5rem
    }
    table.table th, table.table td {
        vertical-align: middle
    }

    label {
        font-weight: bold;
        font-size: 1.03rem;
        letter-spacing: .015rem;
        color: #333
    }

    .form-control {
        border: 2px solid #E3E3E3;
        border-radius: 6px !important;
        height: 2.8rem;
        box-shadow: none !important;
    }

    .error {
        color: #dc3545;
        font-size: .75rem;
        display: block;
        margin: .3rem 0 0
    }
`

const NavNavegation = styled.ul`
    background: #FFF;
    border-radius: .4rem;
    border: 1px solid #EFEFEF;

    .nav-link {
        padding: .9rem 1.7rem
    }

`

export default () => {
    return (
        <AuthProvider>
            <Routers />
        </AuthProvider>
    )
}

function Routers() {
    const { authenticated } = useContext(Context)

    return (
        <Router>
            <GlobalStyle />
            <div className="container">
                <NavNavegation className="nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/posts">Posts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/usuarios">Usuários</Link>
                    </li>
                    {
                        authenticated &&
                        <li className="nav-item">
                            <Link className="nav-link" to="/logout">Logout</Link>
                        </li>
                    }

                </NavNavegation>
                <Switch>
                    <PrivateRoute exact path="/" >
                        <Home />
                    </PrivateRoute>
                    <PrivateRoute path="/posts" >
                        <Posts />
                    </PrivateRoute>
                    <Route path="/usuarios">
                        <Users />
                    </Route>
                    <CheckRoute path="/login">
                        <Login />
                    </CheckRoute>
                    <Route path="/logout">
                        <Logout />
                        <Redirect to="/login" />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

function Home() {
    const { authenticated } = useContext(Context)

    return (
        <div className="content">
            <Header>
                <h3>Home</h3>
            </Header>
            {authenticated ? 'Logado' : 'Logout'}
        </div>
    )
}

function Users() {
    return (
        <div className="content">
            <Header>
                <h3>Usuários</h3>
            </Header>
        </div>
    )
}

function CheckRoute({ children, ...rest }) {
    const { authenticated } = useContext(Context)

    return (
        <Route
            {...rest}
            render={
                ({ location }) =>
                    !authenticated ? (
                        children
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/",
                                    state: { from: location }
                                }}
                            />
                        )
            }
        />
    )

}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    const { authenticated } = useContext(Context)

    return (
        <Route
            {...rest}
            render={({ location }) =>
                authenticated ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}