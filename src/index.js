import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureStore from './store/configureStore';
import history from './history';
import Routes from './containers/Routes';
import './styles/main.scss';
import { fetchMasterTableRequest } from './actions/masterTable';
import { fetchAccessControlRequest } from './actions/accessControl';

const store = configureStore();

store.dispatch(fetchMasterTableRequest());
store.dispatch(fetchAccessControlRequest());

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('app')
);

module.hot.accept();
