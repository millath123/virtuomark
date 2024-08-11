import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import UserProfile from './components/User/UserProfile';
import AdminDashboard from './components/Admin/AdminDashboard';
import PrivateRoute from './components/Shared/PrivateRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/user-profile" component={UserProfile} />
          <PrivateRoute path="/admin-dashboard" component={AdminDashboard} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
