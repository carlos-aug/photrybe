import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';
import { Login, Admin, Home, Favorites, NotFound } from './pages';
import './App.css';
import 'bulma/css/bulma.min.css';

export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route path="/home" component={ Home } />
        <Route path="/admin" component={ Admin } />
        <Route path="/favorites" component={ Favorites } />
        <Route path="*" component={ NotFound } />
      </Switch>
    )
  }
}
