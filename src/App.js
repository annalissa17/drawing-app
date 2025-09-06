import React, { useLayoutEffect, useState, useRef } from 'react';
import Save from './Save.js'
import './App.css';
import rough from 'roughjs/bundled/rough.esm'
import { ColorPicker } from 'primereact/colorpicker';

const generator = rough.generator()

function createElement(x1, y1, x2, y2, type, stroke, fill) {
  const roughElement = 
    type === 'line'
      ? generator.line(x1, y1, x2, y2, {stroke})
      : generator.rectangle(x1, y1, x2 - x1, y2 - y1, {stroke, fill})
  return { x1, y1, x2, y2, type, roughElement }
}

const isWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element
  if (type === 'rectangle') {
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)
    return x >= minX && x <= maxX && y >= minY && y <= maxY
  } else {
    const a = { x1, y1 }
    const b = { x2, y2 }
    const c = { x, y }
    const offset = distance(a, b) - (distance(a, c) + distance(b, c))
    return Math.abs(offset) < 1
  }
}

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

const getElementAtPosition = (x, y, elements) => {
  return elements.find(element => isWithinElement(x, y, element))
}

const App = () => {
  const [elements, setElements] = useState([])
  const [action, setAction] = useState('none')
  const [tool, setTool] = useState('line')
  const canvasRef = useRef(null)

  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
    return { x, y }
  }

  const handleMouseDown = (event) => {
    const { x, y } = getCanvasCoordinates(event)
    if (tool === 'selection') {
      const element = getElementAtPosition(x, y, elements)
      if (element) setAction('moving')
    } else {
      const element = createElement(x, y, x, y, tool, strokeColor, fillColor)
      setElements(prev => [...prev, element])
      setAction('drawing')
    }
  }

  const handleMouseMove = (event) => {
    if (action !== 'drawing') return
    const { x, y } = getCanvasCoordinates(event)
    const index = elements.length - 1
    const { x1, y1 } = elements[index]
    const updatedElement = createElement(x1, y1, x, y, tool, strokeColor, fillColor)
    const elementsCopy = [...elements]
    elementsCopy[index] = updatedElement
    setElements(elementsCopy)
  }

  const handleMouseUp = () => {
    setAction('idle')
  }

  const [strokeColor, setStrokeColor] = useState('#000000')
  const [fillColor, setFillColor] = useState('#ffffff')

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, canvas.width, canvas.height)
    const roughCanvas = rough.canvas(canvas)

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement))

  }, [elements])

  return (
    <div className='body'>
      <header className='header'>
        <div className='wrapper'>
          <h1>Sketch</h1>
          
        </div>
      </header>
      <div className='wrapper grid_container'>
        <div className='input_container'>
          <h2>Outils</h2>
          <div className='input'>
            <input
              type='radio'
              id='line'
              checked={tool === 'line'}
              onChange={() => setTool('line')}
            />
            <label htmlFor='line'>Ligne</label>
          </div>
          <div className='input'>
            <input
              type='radio'
              id='rectangle'
              checked={tool === 'rectangle'}
              onChange={() => setTool('rectangle')}
            />
            <label htmlFor='rectangle'>Rectangle</label>
          </div>

          <div className='palette'>
              <label htmlFor='strokeColor'>Couleur de bordure</label>
              <ColorPicker value={strokeColor} onChange={(e) => setStrokeColor(e.value.startsWith('#') ? e.value : '#' + e.value)} inline></ColorPicker>
          </div>

          <div className='palette'>
              <label htmlFor='fillColor'>Couleur de remplissage</label>
              <ColorPicker value={fillColor} onChange={(e) => setFillColor(e.value.startsWith('#') ? e.value : '#' + e.value)} inline></ColorPicker>
          </div>
        </div>
        <div className='canvas_wrapper'>
          <canvas
            ref={canvasRef}
            className='canvas'
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            canvas
          </canvas>
        </div>
      </div>
      <footer className='footer'>
          <p>Projet étudiant</p>
          <p>Sketch est une application web pour le dessin. Elle utilise React comme framework et utilise canvas ainsi que la librairie RoughJS pour le dessin.</p>
      </footer>
    </div>
  )
}

export default App
