import React, { useState } from 'react'
import Header from './components/Header.jsx'
import LandingScreen from './components/LandingScreen.jsx'
import AnalyzeScreen from './components/AnalyzeScreen.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [results, setResults] = useState(null)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header screen={screen} onNav={setScreen} />
      <main style={{ flex: 1 }}>
        {screen === 'landing' && (
          <LandingScreen onStart={() => setScreen('analyze')} />
        )}
        {screen === 'analyze' && (
          <AnalyzeScreen
            onResults={(data) => { setResults(data); setScreen('results'); }}
          />
        )}
        {screen === 'results' && results && (
          <ResultsScreen
            data={results}
            onBack={() => setScreen('analyze')}
            onNew={() => { setResults(null); setScreen('analyze'); }}
          />
        )}
      </main>
      <footer style={{
        background: 'var(--bg-dark)',
        color: 'rgba(255,255,255,0.45)',
        textAlign: 'center',
        padding: '18px 24px',
        fontSize: '12px',
        letterSpacing: '0.3px',
      }}>
        Created by AIVONEX Technologies - Climate-Health Intelligence Platform
      </footer>
    </div>
  )
}
