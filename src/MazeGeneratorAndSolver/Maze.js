import React, { useEffect, useState, useRef } from "react";
import GenerateMaze from "./GeneratorFunctions";
import aStar from "./A-Star";
import './Maze.css';

function Maze ({Parameters, toGenerate, setGenerate, toSolve, setSolve, setNotification}){

    const [FinalMaze, setFinalMaze] = useState([]);
    const [MazeGenerated, setMazeGenerated] = useState(false);
    const [Path, setPath] = useState(null);
    const [CellSize, setCellSize] = useState(0);

    const canvasRef = useRef(null);
    const canvas = canvasRef.current;

    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d');

    //Us effect for generation
    useEffect(()=>{
        if(toGenerate){
            setPath(null);
            setCellSize(40);
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
                setPath(aStar(FinalMaze));
            }else{
                setNotification('Maze not generated yet!');
            }
        }
    },[toSolve])

    function drawMaze(){
        const context = canvas.getContext('2d');

        canvas.width = CellSize*Parameters.width;
        canvas.height = CellSize*Parameters.height;
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // Loop through the mazeData and draw cells with walls
        FinalMaze.forEach((row, i) => {
            row.forEach((cell, j) => {
                
                // Draw cell
                var CellRect = new Object();
                CellRect.x = j * CellSize;
                CellRect.y = i * CellSize;
                
                offscreenContext.fillStyle = cell.isStart || cell.isEnd? '#466d1d' : '#585858';
                offscreenContext.fillRect(CellRect.x, CellRect.y, CellSize, CellSize);
                
                
                // Draw walls
                offscreenContext.strokeStyle = 'white'; // Wall color
                offscreenContext.lineWidth = 1; // Adjust line width as needed
                
                // Draw top wall
                    if (cell.TopWall) {
                    offscreenContext.beginPath();
                    offscreenContext.moveTo(CellRect.x, CellRect.y);
                    offscreenContext.lineTo((j + 1) * CellSize, CellRect.y);
                    offscreenContext.stroke();
                }

                // Draw right wall
                if (cell.RightWall) {
                    offscreenContext.beginPath();
                    offscreenContext.moveTo((j + 1) * CellSize, CellRect.y);
                    offscreenContext.lineTo((j + 1) * CellSize, (i + 1) * CellSize);
                    offscreenContext.stroke();
                }

                // Draw bottom wall
                if (cell.BottomWall) {
                    offscreenContext.beginPath();
                    offscreenContext.moveTo(CellRect.x, (i + 1) * CellSize);
                    offscreenContext.lineTo((j + 1) * CellSize, (i + 1) * CellSize);
                    offscreenContext.stroke();
                }

                // Draw left wall
                if (cell.LeftWall) {
                    offscreenContext.beginPath();
                    offscreenContext.moveTo(CellRect.x, CellRect.y);
                    offscreenContext.lineTo(CellRect.x, (i + 1) * CellSize);
                    offscreenContext.stroke();
                }

                
            });
        });
        if(Path){
            for (let k = 0; k < Path.length; k++) {
                offscreenContext.strokeStyle = '#466d1d'; // Wall color
                offscreenContext.lineWidth = CellSize/2; // Adjust line width as needed
                const cell = Path[k];
                const i = cell.i;
                const j = cell.j;
                
                // Calculate the center of the cell
                const centerX = j * CellSize + CellSize / 2;
                const centerY = i * CellSize + CellSize / 2;
                
                if (k === 0) {
                    // Move to the starting cell
                    offscreenContext.beginPath();
                    offscreenContext.moveTo(centerX, centerY);
                } else {
                    // Draw a line to the center of the next cell
                    offscreenContext.lineTo(centerX, centerY);
                }
            }
            
            // Finish the path
            offscreenContext.stroke();
            setNotification('MAZE SOLVED!');
        } else {
            if (MazeGenerated && toSolve) setNotification('NO VALID PATH!');
        }
        setSolve(false);
        context.drawImage(offscreenCanvas, 0, 0);
    }

    useEffect(() => {
        if(MazeGenerated){
            drawMaze();
            setCanvasWidth();
        }
    }, [FinalMaze, Path]);

    useEffect(() => {

        window.addEventListener('resize', setCanvasWidth);

        return () => {
            window.addEventListener('resize', setCanvasWidth);
        }

    }, [])

    function setCanvasWidth() {
        if(canvas){
            var width;
            console.log('CALCULATING WIDTH FOR CANVAS!')
            if(window.innerWidth > 520){
                if(Parameters.width > 25){
                    width = '90%';
                }else{
                    width = '500px';
                }    
            }else{
                width = '90%';
            }
            canvas.style.width = width;
        }
    }

    return(
        <canvas className="maze" ref={canvasRef}></canvas>
    )
}

export default Maze;