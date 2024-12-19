import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from "react-router-dom";
import EntryPage from './pages/entry/EntryPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RecoilRoot>
    {/* <React.StrictMode> */}
    {/* // prod */}
    <Router>
      {/* <Router> */}
      <EntryPage />
    </Router>
    {/* </React.StrictMode> */}
  </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
