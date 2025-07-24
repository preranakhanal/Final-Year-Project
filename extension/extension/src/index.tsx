import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Popup from './popup/Popup';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<Popup />);
}