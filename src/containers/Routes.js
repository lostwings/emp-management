import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoginPage from './pages/LoginPage';
import TimesheetPage from './pages/TimesheetPage';
import LeavePage from './pages/LeavePage';
import ProjectPage from './pages/ProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProfilePage from './pages/ProfilePage';
import EmployeePage from './pages/EmployeePage';
import ReportPage from './pages/ReportPage';
import AddTaskPage from './pages/AddTaskPage';
import ManageLeave from './pages/ManageLeave';

const Routes = () => (
  <Switch>
    <Route path="/login" component={LoginPage} />
    <Route exact path="/" render={() => <Redirect to="/timesheet" />} />
    <PrivateRoute exact path="/timesheet" component={TimesheetPage} />
    <PrivateRoute path="/timesheet/new" component={AddTaskPage} />
    <PrivateRoute path="/leave" component={LeavePage} />
    <PrivateRoute exact path="/project" component={ProjectPage} />
    <PrivateRoute path="/project/:id" component={ProjectDetailPage} />
    <PrivateRoute path="/profile/:id" component={ProfilePage} />
    <PrivateRoute path="/employee" component={EmployeePage} />
    <PrivateRoute path="/report" component={ReportPage} />
    <PrivateRoute path="/manageleave" component={ManageLeave} />
  </Switch>
);

export default Routes;
