import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './index.css';
import App from './App.js';
import appReducer from './store/appSlice.js'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from 'react-hot-toast';


const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql', // Replace with your GraphQL API endpoint
  cache: new InMemoryCache(),
});

const store=configureStore({
  reducer: {
    app:appReducer
  }
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>

    <ApolloProvider client={client}>

    <App />
    <Toaster/>
    </ApolloProvider>
    </Provider>
  </React.StrictMode>
);
