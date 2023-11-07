import './App.css';

import Maze from './Maze.js';

import Notice from './Notification.js';

import React, {useState} from 'react';

function App() {

	const [MazeWidth, setMazeWidth] = useState(0);
	const [MazeHeight, setMazeHeight] = useState(0);
	const [Generate, setGenerate] = useState(false);
	const [Solve, setSolve] = useState(false);
	const [Notification, setNotification] = useState('Please enter parameters for the maze!');

	function handleGenerateClick(){
		setNotification('GENERATING...')
		setGenerate(true)
	}

	function handleSolveClick(){
		setNotification('SOLVING...')
		setSolve(true);
	}

	return (
		<div className="App">
		<h1 style={{filter: 'drop-shadow(0px 0px 5px snow)'}}>Maze Generator</h1>
		<div className='settings-bar'>

			<input type='text' placeholder='width' onChange={(e) => setMazeWidth(e.target.value)}></input>
			<input type='text' placeholder='height' onChange={(e) => setMazeHeight(e.target.value)} ></input>
			<button onClick={handleGenerateClick}>GENERATE</button>
			<button onClick={handleSolveClick}>SOLVE MAZE</button>
		</div>
		<Notice Generate={Generate} Solve={Solve} notification={Notification}/>
		<Maze 	Parameters={{width: MazeWidth, height: MazeHeight}} 
				toSolve={Solve}
				setSolve={setSolve}
				toGenerate={Generate} 
				setGenerate={setGenerate}	
				setNotification={setNotification}
		/>
		</div>
	);
}

export default App;
