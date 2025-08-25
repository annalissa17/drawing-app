import React, { useLayoutEffect, useState, useRef } from 'react';
import './App.css';
import rough from 'roughjs/bundled/rough.esm'

const generator = rough.generator()

function createElement(x1, y1, x2, y2, type) {
  const roughElement = 
    type === 'line'
      ? generator.line(x1, y1, x2, y2)
      : generator.rectangle(x1, y1, x2 - x1, y2 - y1)
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
      const element = createElement(x, y, x, y, tool)
      setElements(prev => [...prev, element])
      setAction('drawing')
    }
  }

  const handleMouseMove = (event) => {
    if (action !== 'drawing') return
    const { x, y } = getCanvasCoordinates(event)
    const index = elements.length - 1
    const { x1, y1 } = elements[index]
    const updatedElement = createElement(x1, y1, x, y, tool)
    const elementsCopy = [...elements]
    elementsCopy[index] = updatedElement
    setElements(elementsCopy)
  }

  const handleMouseUp = () => {
    setAction('idle')
  }

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
          <h1>Titre provisoire</h1>
        </div>
      </header>
      <div className='wrapper grid_container'>
        <div className='input_container'>
          <div className='input'>
            <input
              type='radio'
              id='selection'
              checked={tool === 'selection'}
              onChange={() => setTool('selection')}
            />
            <label htmlFor='selection'>Selection</label>
          </div>
          <div className='input'>
            <input
              type='radio'
              id='line'
              checked={tool === 'line'}
              onChange={() => setTool('line')}
            />
            <label htmlFor='line'>Line</label>
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
        </div>
        <div className='canvas_wrapper'>
          <canvas
            ref={canvasRef}
            className='canvas'
            width={800}  // tu peux ajuster pour ta grille
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            canvas
          </canvas>
        </div>
      </div>
    </div>
  )
}

export default App
