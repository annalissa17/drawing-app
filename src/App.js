import React, { useLayoutEffect, useState } from 'react';
import './App.css';
import rough from 'roughjs/bundled/rough.esm'

const generator = rough.generator()

const App = () => {

  const [elements, setElements] = useState([])
  const [drawing, setDrawing] = useState(false)

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const roughCanvas = rough.canvas(canvas)
    const rect = generator.rectangle(10, 10, 100, 100)
    const line = generator.line(10, 10, 100, 100)

    roughCanvas.draw(rect)
    roughCanvas.draw(line)
  })

  const handleMouseDown = (event) => {
    setDrawing(true)
  }

  const handleMouseMove = (event) => {
    if(!drawing) return

    const {clientX, clientY} = event
    console.log(clientX, clientY)
  }

  const handleMouseUp = (event) => {}

  return (
    <canvas id='canvas' 
      style={{backgroundColor: '#3b3a39'}} 
      width={window.innerWidth} 
      height={window.innerHeight}
      onMouseDown={handleMouseDown} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}>
      canvas
    </canvas>
  );
}

export default App;
