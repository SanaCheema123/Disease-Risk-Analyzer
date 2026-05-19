import React, { useState, useRef } from 'react'
import Papa from 'papaparse'

const DEMO = [
  { district:'Multan',     temperature_avg:41.2, rainfall_mm:18.5, humidity_pct:72, disease_cases:312, disease_type:'dengue',      prev_year_cases:98,  flood_level:'moderate', aqi:145 },
  { district:'Lahore',     temperature_avg:38.8, rainfall_mm:42.0, humidity_pct:80, disease_cases:187, disease_type:'dengue',      prev_year_cases:64,  flood_level:'low',      aqi:168 },
  { district:'Karachi',    temperature_avg:43.5, rainfall_mm:2.1,  humidity_pct:65, disease_cases:89,  disease_type:'heat',        prev_year_cases:34,  flood_level:'none',     aqi:120 },
  { district:'Faisalabad', temperature_avg:39.4, rainfall_mm:28.0, humidity_pct:76, disease_cases:224, disease_type:'malaria',     prev_year_cases:71,  flood_level:'high',     aqi:135 },
  { district:'Bahawalpur', temperature_avg:42.0, rainfall_mm:8.0,  humidity_pct:58, disease_cases:45,  disease_type:'diarrheal',   prev_year_cases:40,  flood_level:'none',     aqi:95  },
  { district:'Rawalpindi', temperature_avg:36.5, rainfall_mm:55.0, humidity_pct:84, disease_cases:98,  disease_type:'respiratory', prev_year_cases:52,  flood_level:'moderate', aqi:178 },
]

export default function AnalyzeScreen({ onResults }) {
  const [mode, setMode] = useState('upload')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [csvData, setCsvData] = useState(null)
  const [textInput, setTextInput] = useState('')
  const [manualRows, setManualRows] = useState([
    { district:'', temperature_avg:'', rainfall_mm:'', humidity_pct:'', disease_cases:'', disease_type:'dengue', prev_year_cases:'' }
  ])
  const [config, setConfig] = useState({ period:'Last 12 months', forecast:'4 weeks ahead', disease:'All diseases' })
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setError('')
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (r) => {
        if (!r.data.length) { setError('This file appears to be empty. Please check the format.'); return }
        setCsvData(r.data)
      },
      error: () => setError('Could not read this file. Please make sure it is a valid CSV.'),
    })
  }

  const addRow = () => setManualRows(r => [...r, { district:'', temperature_avg:'', rainfall_mm:'', humidity_pct:'', disease_cases:'', disease_type:'dengue', prev_year_cases:'' }])
  const removeRow = (i) => setManualRows(r => r.filter((_,idx) => idx !== i))
  const updateRow = (i, f, v) => setManualRows(r => r.map((row, idx) => idx === i ? { ...row, [f]: v } : row))

  const runAnalysis = async () => {
    setLoading(true); setError('')
    try {
      let districtData = []
      if (mode === 'upload')  districtData = csvData || DEMO
      else if (mode === 'manual') districtData = manualRows.filter(r => r.district.trim())
      else if (mode === 'text') {
        const resp = await fetch('/api/analyze/text', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ text: textInput }),
        })
        const result = await resp.json()
        if (!resp.ok) throw new Error(result.error || 'Analysis failed.')
        if (result.success) { onResults(result.data); return }
        throw new Error(result.error || 'No results returned.')
      }

      if (!districtData.length) { setError('Please add at least one district with data.'); setLoading(false); return }

      const resp = await fetch('/api/analyze', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ input_type: mode, district_data: districtData, config }),
      })
      const result = await resp.json()
      if (!resp.ok) throw new Error(result.error || 'Analysis failed.')
      if (result.success) onResults(result.data)
      else throw new Error(result.error || 'Analysis returned no data.')
    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const modeStyle = (id) => ({
    flex: 1, padding:'14px 16px', cursor:'pointer', textAlign:'left',
    background: mode===id ? 'var(--green-light)' : 'var(--bg-white)',
    border: `1.5px solid ${mode===id ? 'var(--green)' : 'var(--border)'}`,
    borderRadius: 'var(--r-lg)',
    color: mode===id ? 'var(--green-dark)' : 'var(--text-muted)',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'44px 32px 80px' }}>

      <div style={{ marginBottom:'32px' }}>
        <div style={{ fontSize:'11px', color:'var(--green-dark)', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'8px' }}>
          Climate-Disease Risk Analyzer
        </div>
        <h1 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'28px', color:'var(--text-head)', marginBottom:'8px', letterSpacing:'-0.5px' }}>
          Load your district data
        </h1>
        <p style={{ fontSize:'15px', color:'var(--text-muted)', lineHeight:1.65 }}>
          Choose how to bring in data — upload a spreadsheet, fill the form directly, or describe the situation in your own words.
        </p>
      </div>

      {/* Mode selector */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'24px' }}>
        {[
          { id:'upload', icon:'📁', label:'Upload CSV', sub:'Spreadsheet import' },
          { id:'manual', icon:'✏️', label:'Fill in form', sub:'Enter data manually' },
          { id:'text',   icon:'💬', label:'Describe it', sub:'Plain language input' },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={modeStyle(m.id)}>
            <div style={{ fontSize:'18px', marginBottom:'5px' }}>{m.icon}</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'14px', marginBottom:'2px' }}>{m.label}</div>
            <div style={{ fontSize:'11px', opacity:0.75, fontWeight:400 }}>{m.sub}</div>
          </button>
        ))}
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <div className="card" style={{ marginBottom:'20px' }}>
          <div
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--green)' : 'var(--border-strong)'}`,
              background: dragOver ? 'var(--green-light)' : 'var(--bg-section)',
              borderRadius:'var(--r-lg)', padding:'36px 24px',
              textAlign:'center', cursor:'pointer', transition:'all 0.18s',
              marginBottom:'16px',
            }}
          >
            <input ref={fileRef} type="file" accept=".csv" onChange={e => handleFile(e.target.files[0])} style={{ display:'none' }} />
            <div style={{ fontSize:'28px', marginBottom:'10px' }}>📂</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'15px', color:'var(--text-head)', marginBottom:'5px' }}>
              Drop your CSV file here, or click to browse
            </div>
            <div style={{ fontSize:'13px', color:'var(--text-muted)' }}>Accepts .csv files — see README for the expected column format</div>
          </div>

          {csvData && (
            <div style={{
              background:'var(--green-light)', border:'1.5px solid var(--green-mid)',
              borderRadius:'var(--r-md)', padding:'12px 16px',
              display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px',
            }}>
              <span style={{ color:'var(--green-dark)', fontSize:'16px' }}>✓</span>
              <div>
                <div style={{ fontSize:'14px', color:'var(--green-dark)', fontWeight:600 }}>{csvData.length} rows loaded successfully</div>
                <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>Columns found: {Object.keys(csvData[0]||{}).slice(0,6).join(', ')}{Object.keys(csvData[0]||{}).length > 6 ? '...' : ''}</div>
              </div>
            </div>
          )}

          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'4px' }}>
            <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
            <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>or use demo data</span>
            <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
          </div>
          <button
            className="btn-outline"
            onClick={() => setCsvData(DEMO)}
            style={{ width:'100%', justifyContent:'center', marginTop:'12px', fontSize:'13px' }}
          >
            Load 6-District Demo Dataset (Multan, Lahore, Karachi, Faisalabad, Bahawalpur, Rawalpindi)
          </button>
        </div>
      )}

      {/* Manual mode */}
      {mode === 'manual' && (
        <div className="card" style={{ marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'15px', color:'var(--text-head)' }}>District entries</div>
            <button className="btn-primary" onClick={addRow} style={{ padding:'8px 16px', fontSize:'12px' }}>+ Add district</button>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'680px' }}>
              <thead>
                <tr style={{ background:'var(--bg-section)' }}>
                  {['District','Temp °C','Rain mm','Humidity %','Cases','Disease','Last Year Cases',''].map(h => (
                    <th key={h} style={{ padding:'9px 10px', textAlign:'left', fontSize:'11px', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px', borderBottom:'1.5px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {manualRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                    {[
                      { f:'district', type:'text', ph:'e.g. Multan', w:'130px' },
                      { f:'temperature_avg', type:'number', ph:'38.5', w:'80px' },
                      { f:'rainfall_mm', type:'number', ph:'22', w:'75px' },
                      { f:'humidity_pct', type:'number', ph:'70', w:'80px' },
                      { f:'disease_cases', type:'number', ph:'120', w:'75px' },
                    ].map(({ f, type, ph, w }) => (
                      <td key={f} style={{ padding:'7px 8px' }}>
                        <input type={type} placeholder={ph} value={row[f]} onChange={e => updateRow(i,f,e.target.value)}
                          style={{ padding:'7px 10px', fontSize:'13px', minWidth:w }} />
                      </td>
                    ))}
                    <td style={{ padding:'7px 8px' }}>
                      <select value={row.disease_type} onChange={e => updateRow(i,'disease_type',e.target.value)} style={{ padding:'7px 10px', fontSize:'12px', minWidth:'110px' }}>
                        {['dengue','malaria','diarrheal','respiratory','heat'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:'7px 8px' }}>
                      <input type="number" placeholder="Last yr" value={row.prev_year_cases} onChange={e => updateRow(i,'prev_year_cases',e.target.value)}
                        style={{ padding:'7px 10px', fontSize:'13px', minWidth:'80px' }} />
                    </td>
                    <td style={{ padding:'7px 8px' }}>
                      {manualRows.length > 1 && (
                        <button onClick={() => removeRow(i)} style={{ background:'var(--red-light)', color:'var(--red)', border:'none', borderRadius:'var(--r-sm)', padding:'5px 10px', fontSize:'13px', cursor:'pointer' }}>✕</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Text mode */}
      {mode === 'text' && (
        <div className="card" style={{ marginBottom:'20px' }}>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'15px', color:'var(--text-head)', marginBottom:'4px' }}>Describe the situation in your own words</div>
          <div style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'14px' }}>Include district name, weather conditions, case numbers, and any other context you have. The system will extract the data and run the analysis.</div>
          <textarea
            rows={7}
            placeholder={"Example:\n\n\"In Multan last week, the temperature reached 42°C with humidity at 72%. We recorded 312 dengue cases — up from just 98 the same week last year. There was 18mm of rain about three weeks ago and standing water is still visible in low-lying areas. What is the outbreak risk for the coming month?\""}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            style={{ lineHeight:1.75, fontSize:'14px', resize:'vertical' }}
          />
        </div>
      )}

      {/* Config */}
      <div className="card" style={{ marginBottom:'22px' }}>
        <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'14px' }}>Analysis settings</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' }}>
          {[
            { key:'period',   label:'Historical period', opts:['Last 4 weeks','Last 12 weeks','Last 6 months','Last 12 months'] },
            { key:'forecast', label:'Forecast window',   opts:['2 weeks ahead','4 weeks ahead','6 weeks ahead','8 weeks ahead'] },
            { key:'disease',  label:'Disease focus',     opts:['All diseases','Dengue only','Malaria only','Diarrheal only','Respiratory only','Heat-related only'] },
          ].map(({ key, label, opts }) => (
            <div key={key}>
              <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', fontWeight:600, marginBottom:'6px' }}>{label}</label>
              <select value={config[key]} onChange={e => setConfig(c => ({ ...c, [key]:e.target.value }))}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          background:'var(--red-light)', border:'1.5px solid #FCA5A5',
          borderRadius:'var(--r-md)', padding:'12px 16px', marginBottom:'16px',
          fontSize:'14px', color:'var(--red)', display:'flex', gap:'10px', alignItems:'flex-start', lineHeight:1.6,
        }}>
          <span style={{ flexShrink:0 }}>⚠️</span><span>{error}</span>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={runAnalysis}
        disabled={loading}
        style={{ width:'100%', justifyContent:'center', padding:'16px', fontSize:'16px', borderRadius:'var(--r-lg)', fontFamily:'var(--font-head)' }}
      >
        {loading ? (
          <><div className="spinner" style={{ width:'18px', height:'18px' }} /> Analyzing climate and disease data...</>
        ) : '⚡ Run Risk Analysis →'}
      </button>

      {loading && (
        <div style={{ marginTop:'20px', textAlign:'center' }}>
          {['Reading climate variables and case history...','Detecting seasonal anomalies...','Calculating district-level risk scores...','Writing action recommendations...'].map((msg, i) => (
            <div key={i} style={{ fontSize:'13px', color:'var(--text-muted)', animation:`fadeUp 0.4s ease ${0.6+i*0.9}s both`, marginBottom:'5px' }}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  )
}
