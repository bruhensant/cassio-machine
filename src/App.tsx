import { useState, useRef } from 'react'
import './App.css'

interface RouletteOption {
  id: number
  text: string
  color: string
}

/**
 * Main App component that renders the roulette game
 */
function App() {
  const rouletteOptions: RouletteOption[] = [
    { id: 1, text: 'Opção 1', color: '#FF6B6B' },
    { id: 2, text: 'Opção 2', color: '#4ECDC4' },
    { id: 3, text: 'Opção 3', color: '#45B7D1' },
    { id: 4, text: 'Opção 4', color: '#FFA726' },
    { id: 5, text: 'Opção 5', color: '#AB47BC' }
  ]

  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<RouletteOption | null>(null)
  const rouletteRef = useRef<HTMLDivElement>(null)

  /**
   * Handles the roulette spin animation and result calculation
   */
  const spinRoulette = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinner(null)

    // Calculate random rotation (at least 5 full rotations + random angle)
    const minSpins = 5
    const randomAngle = Math.random() * 360
    const newRotation = rotation + (minSpins * 360) + randomAngle

    setRotation(newRotation)

    // Calculate which option wins based on final angle
    setTimeout(() => {
      // Simply pick a random winner since there's no pointer reference
      const winnerIndex = Math.floor(Math.random() * rouletteOptions.length)
      const winnerOption = rouletteOptions[winnerIndex]
      
      setWinner(winnerOption)
      setIsSpinning(false)
    }, 3000)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎰 Roleta das Aflições</h1>
        <p>Gire a roleta e descubra sua sorte!</p>
      </header>

      <main className="main-content">
        <div className="roulette-container">
          <div className="roulette-wrapper">
            <div 
              ref={rouletteRef}
              className={`roulette ${isSpinning ? 'spinning' : ''}`}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <svg width="100%" height="100%" viewBox="0 0 200 200" className="roulette-svg" style={{display: 'block'}}>
                {rouletteOptions.map((option, index) => {
                  const angle = (360 / rouletteOptions.length)
                  const startAngle = angle * index
                  const endAngle = angle * (index + 1)
                  
                  const startAngleRad = (startAngle * Math.PI) / 180
                  const endAngleRad = (endAngle * Math.PI) / 180
                  
                  const largeArcFlag = angle > 180 ? 1 : 0
                  
                  const x1 = 100 + 90 * Math.cos(startAngleRad)
                  const y1 = 100 + 90 * Math.sin(startAngleRad)
                  const x2 = 100 + 90 * Math.cos(endAngleRad)
                  const y2 = 100 + 90 * Math.sin(endAngleRad)
                  
                  const pathData = [
                    `M 100 100`,
                    `L ${x1} ${y1}`,
                    `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ')
                  
                  const textAngle = startAngle + angle / 2
                  const textRadius = 60
                  const textX = 100 + textRadius * Math.cos((textAngle * Math.PI) / 180)
                  const textY = 100 + textRadius * Math.sin((textAngle * Math.PI) / 180)
                  
                  return (
                    <g key={option.id}>
                      <path
                        d={pathData}
                        fill={option.color}
                        stroke="none"
                        strokeWidth="0"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))'
                        }}
                      >
                        {option.text}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          <div className="controls">
            <button 
              className={`spin-button ${isSpinning ? 'disabled' : ''}`}
              onClick={spinRoulette}
              disabled={isSpinning}
            >
              {isSpinning ? 'Girando...' : 'Girar Roleta'}
            </button>
          </div>
        </div>

        {winner && (
          <div className="result-section">
            <h2>🎉 Resultado!</h2>
            <div 
              className="winner-display"
              style={{ backgroundColor: winner.color }}
            >
              {winner.text}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
