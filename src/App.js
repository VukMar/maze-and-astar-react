import './App.css';

import Maze from './Maze.js';

import React, {useEffect, useState, useRef} from 'react';

function App() {

	const [MazeWidth, setMazeWidth] = useState(0);
	const [MazeHeight, setMazeHeight] = useState(0);
	const [Generate, setGenerate] = useState(false);
	const [Solve, setSolve] = useState(false);

	return (
		<div className="App">
		<h1 style={{filter: 'drop-shadow(0px 0px 5px snow)'}}>Maze Generator</h1>
		<div className='settings-bar'>

			<input type='text' placeholder='width' onChange={(e) => setMazeWidth(e.target.value)}></input>
			<input type='text' placeholder='height' onChange={(e) => setMazeHeight(e.target.value)} ></input>
			<button onClick={() => setGenerate(true)}>GENERATE</button>
			<button onClick={() => setSolve(true)}>SOLVE MAZE</button>
		</div>
		<Maze 	Parameters={{width: MazeWidth, height: MazeHeight}} 
				toSolve={Solve}
				setSolve={setSolve}
				toGenerate={Generate} 
				setGenerate={setGenerate}	/>
		</div>
	);
}

export default App;
