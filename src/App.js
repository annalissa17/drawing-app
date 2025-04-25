import React, { useLayoutEffect, useState } from 'react';
import './App.css';
import rough from 'roughjs/bundled/rough.esm'

const generator = rough.generator()

const App = () => {

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const roughCanvas = rough.canvas(canvas)
    const rect = generator.rectangle(10, 10, 100, 100)
    const line = generator.line(10, 10, 100, 100)

    roughCanvas.draw(rect)
    roughCanvas.draw(line)
  })

  return (
    <canvas id='canvas' 
      style={{backgroundColor: '#3b3a39'}} 
      width={window.innerWidth} 
      height={window.innerHeight}>
      canvas
    </canvas>
  );
}

export default App;
