import React from 'react'

const stats = [
  { label: 'Advance Warning', value: '2–8 Weeks', icon: '⚡', color: 'var(--green)' },
  { label: 'Diseases Monitored', value: '5 Types', icon: '🔬', color: 'var(--teal)' },
  { label: 'Climate Variables', value: '7 Inputs', icon: '🌡️', color: 'var(--blue)' },
  { label: 'Districts Covered', value: 'All Pakistan', icon: '🗺️', color: 'var(--amber)' },
]

const features = [
  {
    icon: '📊',
    title: 'Climate–Disease Pattern Analysis',
    desc: 'Identifies which exact combinations of temperature, rainfall, and humidity have historically triggered outbreaks in each district — including how many weeks in advance the warning signs appear.',
    color: 'var(--green)',
  },
  {
    icon: '🎯',
    title: 'District-Level Risk Scoring',
    desc: 'Every district receives a 0–100 risk score for each disease type, color-coded by severity. Health officers see immediately which areas need resources first.',
    color: 'var(--teal)',
  },
  {
    icon: '📈',
    title: 'Trend and Anomaly Detection',
    desc: 'Compares live climate readings against multi-year baselines. Flags conditions that have preceded past outbreaks — giving teams a critical window to act before cases rise.',
    color: 'var(--blue)',
  },
  {
    icon: '📋',
    title: 'Ready-to-Use Action Plans',
    desc: 'For every high-risk district, the system writes specific field-ready recommendations — which medicines to pre-position, which teams to deploy, and when to escalate to provincial authorities.',
    color: 'var(--amber)',
  },
]

const steps = [
  { num: '01', title: 'Upload your data', desc: 'Upload a CSV spreadsheet, fill a simple form, or just type a plain description of the situation.' },
  { num: '02', title: 'AI runs the analysis', desc: 'The system cross-references climate variables, historical case patterns, and known disease thresholds.' },
  { num: '03', title: 'Review risk scores', desc: 'Every district gets a ranked risk score per disease — color-coded Critical, High, Moderate, or Low.' },
  { num: '04', title: 'Take action', desc: 'Download the full report and share it directly with health authorities, hospitals, or field teams.' },
]

export default function LandingScreen({ onStart }) {
  return (
    <div>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-dark2) 100%)',
        padding: '80px 40px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(76,175,80,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,137,123,0.06) 0%, transparent 45%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '780px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(76,175,80,0.15)',
            border: '1px solid rgba(76,175,80,0.3)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '28px',
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '12px', color: '#A5D6A7', fontWeight: 600, letterSpacing: '0.5px' }}>
              Climate-Health Early Warning System — Active
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 800,
            fontSize: 'clamp(38px, 5.5vw, 66px)',
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: '22px',
          }}>
            Predict Disease Outbreaks<br />
            <span style={{ color: '#81C784' }}>Weeks Before They Start</span>
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'rgba(255,255,255,0.62)',
            maxWidth: '560px',
            margin: '0 auto 36px',
            lineHeight: 1.75,
            fontWeight: 400,
          }}>
            Upload district climate and disease data. The system analyzes patterns,
            identifies outbreak-triggering thresholds, and produces a ranked risk score
            for every district — giving health teams time to act, not just react.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={onStart}
              style={{ fontSize: '15px', padding: '14px 34px', borderRadius: 'var(--r-lg)' }}
            >
              Start Analysis →
            </button>
            <button
              className="btn-outline"
              onClick={onStart}
              style={{
                fontSize: '14px', padding: '14px 26px', borderRadius: 'var(--r-lg)',
                borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)',
              }}
            >
              Load Demo Data
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        background: 'var(--bg-white)',
        borderBottom: '1.5px solid var(--border)',
        padding: '0 40px',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '26px 20px',
              textAlign: 'center',
              borderRight: i < 3 ? '1.5px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{
                fontFamily: 'var(--font-head)', fontWeight: 800,
                fontSize: '22px', color: s.color, marginBottom: '4px',
              }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--bg-section)', padding: '72px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ fontSize: '11px', color: 'var(--green-dark)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Simple process</div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '32px', color: 'var(--text-head)', letterSpacing: '-0.5px' }}>
              From raw data to clear action — in four steps
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
            {steps.map((s, i) => (
              <div key={i} className="card fade-up" style={{ animationDelay: `${i*0.1}s`, position: 'relative', paddingTop: '28px' }}>
                <div style={{
                  fontFamily: 'var(--font-head)', fontWeight: 800,
                  fontSize: '36px', color: 'var(--green-mid)',
                  lineHeight: 1, marginBottom: '14px',
                }}>{s.num}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: 'var(--text-head)', marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--bg-white)', padding: '72px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ fontSize: '11px', color: 'var(--green-dark)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Capabilities</div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '32px', color: 'var(--text-head)', letterSpacing: '-0.5px' }}>
              What the system does for you
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} className="card fade-up" style={{ animationDelay: `${0.1 + i*0.1}s`, display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--r-md)',
                  background: 'var(--bg-section)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: 'var(--text-head)', marginBottom: '7px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.75 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--teal) 100%)',
        padding: '72px 40px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '32px', color: '#fff', marginBottom: '14px', letterSpacing: '-0.5px' }}>
          Run your first analysis in under 60 seconds
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', marginBottom: '30px', maxWidth: '480px', margin: '0 auto 30px', lineHeight: 1.7 }}>
          Upload a spreadsheet, fill a quick form, or just describe the situation in plain words. The system handles the rest.
        </p>
        <button
          className="btn-primary"
          onClick={onStart}
          style={{
            background: '#fff', color: 'var(--green-dark)',
            fontSize: '15px', padding: '14px 36px', borderRadius: 'var(--r-lg)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          Open the Analyzer →
        </button>
      </section>

    </div>
  )
}
