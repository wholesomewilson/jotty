import React from 'react';
import { Route } from 'react-router-dom';
import Editor from './Editor';
import './App.css';
import { Alert } from '../helpers/notifications';

const App = () => (
  <div>
    <Route path="/posts/:id?" component={Editor} />
    <Alert stack= { { limit: 3 }} />
  </div>
);

export default App;
