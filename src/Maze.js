import React, { useEffect, useState, useRef } from "react";
import {GenerateMaze} from "./maze-generator";
import aStar from "./astar";
import './Maze.css';

function Maze ({Parameters, toGenerate, setGenerate, toSolve, setSolve, setNotification}){

    const [FinalMaze, setFinalMaze] = useState([]);
    const [MazeGenerated, setMazeGenerated] = useState(false);
    const [Path, setPath] = useState(null);

    const canvasRef = useRef(null);

    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d');


    //Us effect for generation
    useEffect(()=>{
        if(toGenerate){
            setPath(null);
            if(!isNaN(Parameters.width) || !isNaN(Parameters.height)){
                const W = parseInt(Parameters.width);
                const H = parseInt(Parameters.height);
                const MazeBluprint = GenerateMaze(W,H);
                if(MazeBluprint){
                    setFinalMaze(MazeBluprint);
                    setMazeGenerated(true);
                    setNotification('MAZE GENERATED!');
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
                SolveMaze();
            }else{
                setNotification('Maze not generated yet!');
            }
            setSolve(false);
        }
    },[toSolve])

    function SolveMaze(){
        setPath(aStar(FinalMaze));
    }

    function drawMaze(){
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        var height = 0;
        var cellSize = canvas.width/Parameters.width;
        height = cellSize * Parameters.height;
        canvas.height = height;
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, height);
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        offscreenContext.clearRect(0, 0, offscreenCanvas.width, height);

        
        // Loop through the mazeData and draw cells with walls
        FinalMaze.forEach((row, i) => {
            row.forEach((cell, j) => {
                // Draw transparent cell
                offscreenContext.fillStyle = '#585858'; // Transparent black
                offscreenContext.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);

                
                if (Path) {
                    offscreenContext.strokeStyle = 'red'; // Line color
                    offscreenContext.lineWidth = 4; // Line width
                  
                    for (let k = 0; k < Path.length; k++) {
                      const cell = Path[k];
                  
                      // Calculate the center of the cell
                      const centerX = cell.j * cellSize + cellSize / 2;
                      const centerY = cell.i * cellSize + cellSize / 2;
                  
                      if (k === 0) {
                        // Move to the starting cell
                        offscreenContext.beginPath();
                        offscreenContext.moveTo(centerX, centerY);
                      } else {
                        // Draw a line to the center of the next cell
                        offscreenContext.lineTo(centerX, centerY);
                      }
                    }
                  
                    // Finish the Path
                    offscreenContext.stroke();
                }
                
                // Draw walls
                offscreenContext.strokeStyle = 'white'; // Wall color
                offscreenContext.lineWidth = 1; // Adjust line width as needed
                
                // Draw top wall
                    if (cell.TopWall) {
                    offscreenContext.beginPath();
                    offscreenContext.moveTo(j * cellSize, i * cellSize);
                    offscreenContext.lineTo((j + 1) * cellSize, i * cellSize);
                    offscreenContext.stroke();
                }

                // Draw right wall
                if (cell.RightWall) {
                    offscreenContext.beginPath();
                    offscreenContext.moveTo((j + 1) * cellSize, i * cellSize);
                    offscreenContext.lineTo((j + 1) * cellSize, (i + 1) * cellSize);
                    offscreenContext.stroke();
                }

                // Draw bottom wall
                if (cell.BottomWall) {
                    offscreenContext.beginPath();
                    offscreenContext.moveTo(j * cellSize, (i + 1) * cellSize);
                    offscreenContext.lineTo((j + 1) * cellSize, (i + 1) * cellSize);
                    offscreenContext.stroke();
                }

                // Draw left wall
                if (cell.LeftWall) {
                    offscreenContext.beginPath();
                    offscreenContext.moveTo(j * cellSize, i * cellSize);
                    offscreenContext.lineTo(j * cellSize, (i + 1) * cellSize);
                    offscreenContext.stroke();
                }

                context.drawImage(offscreenCanvas, 0, 0);

            });
        });
    }

    useEffect(() => {
        if(MazeGenerated){
            requestAnimationFrame(() =>  {drawMaze()})
            if(Path){
                setNotification('Maze Solved!');
            }
        }
    }, [FinalMaze,Path]);


    return(
        <canvas className="maze" width={1280} ref={canvasRef}></canvas>
    )
}

export default Maze;