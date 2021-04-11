import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Builder from './components/Builder';

ReactDOM.render(
    <React.StrictMode>
        <App></App>
        <Builder></Builder>
    </React.StrictMode>,
    document.getElementById('root')
);
