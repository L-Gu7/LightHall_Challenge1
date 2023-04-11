import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(() => {
    let storedCount = JSON.parse(window.localStorage.getItem('count'));
    //initialize count with previous count if exists else 0
    return storedCount === null ? 0 : storedCount;
  });

  useEffect(() => {
    window.localStorage.setItem('count', count);
  }, [count]);

  const handleClick = () => {
    setCount(count+1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1> Challenge Level 1</h1>    
        <button onClick={handleClick} className='button'>{count}</button>
      </header>
    </div>
  );
}

export default App;
