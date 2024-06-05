import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import mainStore from './store/mainStore';
import { Trands } from './lib/trands/trands';

const stores = {
  mainStore
};

(async () => {
  try {
    await stores.mainStore.devicesInfoStore.getDevicesInfo();
    await Trands.loadConfig();
    Trands.startUpdateTimer();
    Trands.startAddFakeValuesTimer();
    startApp();
  } catch (e) {
    console.log('AppError', e);
  }
})()


//TODO инфо по WebGL https://webglfundamentals.org/webgl/lessons/ru/webgl-fundamentals.html

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function startApp () {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
  /*
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
