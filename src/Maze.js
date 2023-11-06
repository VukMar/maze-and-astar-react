import React, { useEffect, useState, useRef } from "react";
import mazeGenerator, {GenerateMaze, MazeGrid} from "./maze-generator";
import aStar from "./astar";
import './Maze.css';

function Maze ({Parameters, toGenerate, setGenerate, toSolve, setSolve}){

    const [FinalMaze, setFinalMaze] = useState([]);
    const [MazeGenerated, setMazeGenerated] = useState(false);
    const [Notification, setNotification] = useState('Please enter parameters for the maze!');
    const [gridSize, setGridSize] = useState(0);
    const [Solving, setSolving] = useState(false);


    //Us effect for generation
    useEffect(()=>{
        if(toGenerate){
            if(!isNaN(Parameters.width) || !isNaN(Parameters.height)){
                const W = parseInt(Parameters.width);
                const H = parseInt(Parameters.height);
                setGridSize(Parameters.width)
                const MazeBluprint = GenerateMaze(W,H);
                if(MazeBluprint){
                    setFinalMaze(MazeBluprint);
                    setMazeGenerated(true);
                }else{
                    setNotification(`WIDTH or HEIGHT can't be 0!`);
                }
            }else{
                setNotification('Please enter a valid number!');
            }
            setGenerate(false);
        }
    },[toGenerate])

    //Use effect for solving
    useEffect(()=>{
        if(toSolve){
            if(MazeGenerated){
                setSolving(true);
                SolveMaze();
            }else{
                setNotification('Maze not generated yet!');
            }
            setSolve(false);    
            setSolving(false);
        }
    },[toSolve])

    function setupStyle(w){

        const top = !w.TopWall? '1px solid transparent' : '1px solid brown'; 
        const bottom = !w.BottomWall? '1px solid transparent' : '1px solid brown'; 
        const left = !w.LeftWall? '1px solid transparent' : '1px solid brown';  
        const right = !w.RightWall? '1px solid transparent' : '1px solid brown';
        
        if(w.isPath){
            return ({borderTop: `${top}`, borderBottom: `${bottom}`, borderLeft: `${left}`, borderRight: `${right}`})
        }else{
            return ({borderTop: `${top}`, borderBottom: `${bottom}`, borderLeft: `${left}`, borderRight: `${right}`})

        }
        
    }

    function drawPath(path){
        for(var i = 0; i < FinalMaze.length; i++){
            for(var j = 0; j < FinalMaze[i].length; j++){
                for(var k = path.length-1; k >= 0; k--){
                    if(path[k].i === i && path[k].j === j){
                        FinalMaze[i][j].isPath = true;
                    }
                }
            }
        }
    }

    function SolveMaze(){
        
        const path = aStar(FinalMaze);
        if(path){
            drawPath(path);
        }else{
            setNotification('NO PATH FOUND!');
        }
    }

    return(
        toGenerate? (
            <p>GENERATING...</p>
        ) : Solving? (
            <p>SOLVING MAZE...</p>
        ) : MazeGenerated && FinalMaze.length > 0? (
            <div className="maze" style={{gridTemplateColumns: `repeat(${gridSize}, 1fr)`}}>
                {FinalMaze.map((h) => (
                    h.map((w,index) => (
                        <div key={`cell${index * 8645}`} className="cell" style={setupStyle(w)}>
                            {w.isStart? 'S' : w.isEnd? 'E' : w.isPath? '·' : ''}
                        </div>
                    ) )
                    
                ))}
                    </div>
        ) : (
            <p>{Notification}</p>
        )
    )
}

export default Maze;