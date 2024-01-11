import React, { useState } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;



export default function AppFunctional(props) {
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState(initialMessage);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setEmail(initialEmail);
    setMessage(initialMessage);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    const coordinates = {
      left: index - 1,
      right: index + 1,
      up: index - 3,
      down: index + 3,
    };

    const newIndex = coordinates[direction];
    if (newIndex < 0 || newIndex > 8 || 
        (direction === 'left' && index % 3 === 0) || 
        (direction === 'right' && index % 3 === 2)) {
      setMessage(`You can't go ${direction}`);
      return index;
    }

    setMessage(''); // Clear message when valid move
    return newIndex;
  }

  function move(evt) {
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);

    if (newIndex !== index) {
      setIndex(newIndex);
      setSteps(prevSteps => prevSteps + 1);
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();

    if (!email) {
      setMessage("Ouch: email is required");
      return;
    }

     // Check for banned email
  if (email === 'foo@bar.baz') {
    setMessage("foo@bar.baz failure #71");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setMessage("Ouch: email must be a valid email");
    return;
  }

  
    const { x, y } = getXY();
  
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        x: x,
        y: y,
        steps: steps,
        email: email,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Unprocessable Entity');
      }
      return response.json();
    })
    .then(data => {
      setMessage('Submit success: ' + data.message);
      setEmail(initialEmail); // Reset email after successful submission
    })
    .catch(error => {
      setMessage('Submit error: ' + error.message);
    });
  }

  const stepsMessage = `You moved ${steps} ${steps === 1 ? 'time' : 'times'}`;



  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{stepsMessage}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
