import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";

import { withAuthentication } from "../Session";

const App = () => (
  <Router>
    <PageContainer>
      <Navigation />
      <Main>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </Main>
    </PageContainer>
  </Router>
);

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 60px auto;
  grid-template-columns: 120px auto;
  grid-template-areas: "topbanner topnav" "sidenav main";
`;

const Main = styled.div`
  grid-area: main;
`;

export default withAuthentication(App);
