import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { SnackbarProvider } from 'notistack';
import { store, persistor } from './store';
import Router from './containers/Routes';
import './App.css';
import './lib/i18n';
import 'react-table/react-table.css';
import "react-awesome-popover/dest/react-awesome-popover.css";

class App extends Component {
  render() {
    return (
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router />
          </PersistGate>
        </Provider>
      </SnackbarProvider>
    );
  }
}

export default App;
