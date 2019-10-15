import React from 'react';
import logo from './logo.svg';
import './App.css';
import Player from './components/Player';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Player />
      </header>
    </div>
  );
}

export default App;
