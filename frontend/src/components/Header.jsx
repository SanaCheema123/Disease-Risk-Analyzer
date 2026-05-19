import React, { useState } from 'react'
import logo from '../assets/logo.png'

export default function Header({ screen, onNav }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'analyze', label: 'Analyze' },
  ]

  return (
    <header style={{
      background: 'var(--bg-white)',
      borderBottom: '1.5px solid var(--border)',
      padding: '0 40px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => onNav('landing')}
      >
        <img
          src={logo}
          alt="Aivonex"
          style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
        />
        <div style={{ borderLeft: '1.5px solid var(--border)', paddingLeft: '14px' }}>
          <div style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 800,
            fontSize: '15px',
            color: 'var(--text-head)',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}>
            Climate-Disease <span style={{ color: `var(--green-dark)` }}>Risk Analyzer</span>
          </div>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginTop: '2px',
          }}>
            Climate · Health · Intelligence
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              background: screen === item.id ? 'var(--green-light)' : 'transparent',
              color: screen === item.id ? 'var(--green-dark)' : 'var(--text-muted)',
              border: '1.5px solid',
              borderColor: screen === item.id ? 'var(--green-mid)' : 'transparent',
              borderRadius: 'var(--r-md)',
              padding: '8px 18px',
              fontSize: '13px',
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.3px',
              transition: 'all 0.15s',
            }}
          >
            {item.label}
          </button>
        ))}

        <button
          className="btn-primary"
          onClick={() => onNav('analyze')}
          style={{ marginLeft: '8px', padding: '9px 20px', fontSize: '13px' }}
        >
          Run Analysis →
        </button>
      </nav>
    </header>
  )
}
