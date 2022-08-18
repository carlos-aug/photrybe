import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends Component {
  render() {
    return (
      <nav className='navbar is-primary menu'>
        <div className="navbar-brand">
          <i className="navbar-item fa-solid fa-camera is-medium fa-2xl">Tryphoto</i>
        </div>

        <div className="navbar-menu">
          <Link className='navbar-item has-text-primary-light' to="/home">{`Home`}</Link>
          <Link className='navbar-item has-text-primary-light' to="/favorites">{`Favoritos`}</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <Link className='button is-danger' to="/">{`Sair`}</Link>
          </div>
        </div>
      </nav>
    );
  }
}