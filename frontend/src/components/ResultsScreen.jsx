import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'

const COLORS = { Critical:'#E53935', High:'#F57C00', Moderate:'#1E88E5', Low:'#388E3C' }
const BG     = { Critical:'#FFEBEE', High:'#FFF3E0', Moderate:'#E3F2FD', Low:'#E8F5E9' }

function RiskBar({ score, level }) {
  const color = COLORS[level] || COLORS.Low
  return (
    <div style={{ position:'relative', height:'7px', background:'var(--bg-section)', borderRadius:'4px', overflow:'hidden', flex:1 }}>
      <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${score}%`, background:color, borderRadius:'4px', transition:'width 1.2s ease' }} />
    </div>
  )
}

function now() {
  return new Date().toLocaleDateString('en-PK', { year:'numeric', month:'long', day:'numeric' })
}

function buildCSV(data) {
  const sorted = [...(data.districts||[])].sort((a,b)=>(b.risks?.[0]?.score||0)-(a.risks?.[0]?.score||0))
  const rows = [
    ['District','Score','Level','Primary Threat','Trigger Factors','Lag Weeks','Recommendation','Action 1','Action 2','Action 3'],
    ...sorted.map(d => {
      const t = d.risks?.[0]||{}
      return [d.name, t.score||0, t.level||'Low', d.top_threat||'',
        (t.trigger_factors||[]).join('; '), t.lag_weeks||'', t.recommendation||'',
        (d.priority_actions||[])[0]||'', (d.priority_actions||[])[1]||'', (d.priority_actions||[])[2]||'']
    })
  ]
  return rows.map(r => r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
}

function buildTXT(data) {
  const sorted = [...(data.districts||[])].sort((a,b)=>(b.risks?.[0]?.score||0)-(a.risks?.[0]?.score||0))
  return [
    '═══════════════════════════════════════════════════════',
    '   CLIMATE-DISEASE RISK ANALYZER DISTRICT REPORT',
    '   Created by Aivonex Technologies',
    `   Generated: ${now()}`,
    '═══════════════════════════════════════════════════════',
    '', 'EXECUTIVE SUMMARY', '─────────────────',
    data.summary||'N/A', '',
    'DISTRICT RISK SCORES', '─────────────────────',
    ...sorted.map((d,i) => {
      const t = d.risks?.[0]||{}
      return `${String(i+1).padStart(2,'0')}. ${d.name.padEnd(18)} ${String(t.score||0).padStart(3)}/100  [${(t.level||'Low').toUpperCase()}]  ${d.top_threat||''}`
    }),
    '', 'DETAILED ANALYSIS', '──────────────────',
    ...sorted.flatMap(d => [
      '', `▸ ${d.name.toUpperCase()}`,
      ...(d.risks||[]).map(r=>`  • ${r.disease} — ${r.score}/100 (${r.level})\n    ${r.recommendation||''}`),
      ...(d.priority_actions||[]).length ? ['  Actions:', ...(d.priority_actions||[]).map((a,i)=>`    ${i+1}. ${a}`)] : [],
    ]),
    '', '═══════════════════════════════════════════════════════',
    '  Climate-Disease Risk Analyzer · Aivonex Technologies',
    '═══════════════════════════════════════════════════════',
  ].join('\n')
}

function buildWord(data) {
  const sorted = [...(data.districts||[])].sort((a,b)=>(b.risks?.[0]?.score||0)-(a.risks?.[0]?.score||0))
  const rows = sorted.map(d => {
    const t = d.risks?.[0]||{}
    return `<tr>
      <td style="padding:8px 10px;border:1px solid #ddd;font-weight:600">${d.name}</td>
      <td style="padding:8px 10px;border:1px solid #ddd;text-align:center;font-weight:700;color:${COLORS[t.level]||'#388E3C'}">${t.score||0}/100</td>
      <td style="padding:8px 10px;border:1px solid #ddd;text-align:center">${t.level||'Low'}</td>
      <td style="padding:8px 10px;border:1px solid #ddd;text-transform:capitalize">${d.top_threat||'—'}</td>
      <td style="padding:8px 10px;border:1px solid #ddd;font-size:12px">${(d.priority_actions||[]).slice(0,2).join(' | ')||'—'}</td>
    </tr>`
  }).join('')
  const details = sorted.map(d=>`
    <h3 style="color:#1a3a5c;font-size:14px;margin:18px 0 6px">${d.name}</h3>
    ${(d.risks||[]).map(r=>`<div style="margin:0 0 6px 14px;font-size:13px">
      <strong style="text-transform:capitalize;color:${COLORS[r.level]||'#388E3C'}">${r.disease}</strong>
      — ${r.score}/100 (${r.level})${r.recommendation?`<div style="color:#555;margin-top:3px">${r.recommendation}</div>`:''}
    </div>`).join('')}
    ${(d.priority_actions||[]).length?`<div style="margin:6px 0 0 14px;font-size:13px"><strong style="color:#2e7d32">Actions:</strong><ol style="margin:4px 0 0 18px">${(d.priority_actions||[]).map(a=>`<li>${a}</li>`).join('')}</ol></div>`:''}
  `).join('<hr style="margin:10px 0;border:none;border-top:1px solid #eee"/>')
  const thresh = data.climate_thresholds
    ? Object.entries(data.climate_thresholds).map(([k,v])=>`<tr><td style="padding:7px 10px;border:1px solid #ddd;font-weight:600;text-transform:capitalize">${k}</td><td style="padding:7px 10px;border:1px solid #ddd;font-size:12px">${v}</td></tr>`).join('')
    : ''
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"/><title>Climate-Disease Risk Report</title>
<style>
body{font-family:Calibri,Arial,sans-serif;font-size:13px;color:#222;margin:40px;line-height:1.6}
h2{font-size:15px;color:#1a3a5c;border-bottom:2px solid #4CAF50;padding-bottom:5px;margin:24px 0 10px}
table{border-collapse:collapse;width:100%;margin-bottom:14px}
th{background:#0d1b2a;color:white;padding:8px 10px;text-align:left;font-size:11px}
.hdr{background:#0d1b2a;color:white;padding:18px 24px;margin:-40px -40px 24px}
.summary{background:#f0f7f0;border-left:4px solid #4CAF50;padding:12px 16px;margin:10px 0 18px;border-radius:4px}
.footer{margin-top:28px;padding-top:10px;border-top:1px solid #ddd;font-size:11px;color:#999}
</style></head>
<body>
<div class="hdr"><h1 style="color:white;margin:0;font-size:20px">Climate-Disease Risk Analyzer</h1>
<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:4px">Prepared by Aivonex Technologies · ${now()}</div></div>
${data.summary?`<h2>Executive Summary</h2><div class="summary">${data.summary}</div>`:''}
<h2>District Risk Score Summary</h2>
<table><thead><tr><th>District</th><th>Score</th><th>Level</th><th>Primary Threat</th><th>Key Actions</th></tr></thead><tbody>${rows}</tbody></table>
<h2>Detailed District Analysis</h2>${details}
${thresh?`<h2>Climate-Disease Thresholds</h2><table><thead><tr><th>Disease</th><th>Threshold Conditions</th></tr></thead><tbody>${thresh}</tbody></table>`:''}
<div class="footer">Climate-Disease Risk Analyzer · Created by Aivonex Technologies · ${now()}<br/>
This report should be reviewed by qualified public health professionals before operational use.</div>
</body></html>`
}

function buildPDF(data) {
  const sorted = [...(data.districts||[])].sort((a,b)=>(b.risks?.[0]?.score||0)-(a.risks?.[0]?.score||0))
  const tableRows = sorted.map((d,i)=>{
    const t=d.risks?.[0]||{}; const clr=COLORS[t.level]||'#388E3C'
    return `<tr>
      <td style="color:#9ca3af;font-size:11px">${i+1}</td>
      <td style="font-weight:600">${d.name}</td>
      <td style="font-weight:700;color:${clr}">${t.score||0}/100</td>
      <td><span style="background:${BG[t.level]||BG.Low};color:${clr};padding:2px 8px;border-radius:100px;font-size:10px;font-weight:700">${t.level||'Low'}</span></td>
      <td style="text-transform:capitalize">${d.top_threat||'—'}</td>
      <td style="font-size:11px;color:#555">${(t.trigger_factors||[]).slice(0,2).join(', ')||'—'}</td>
    </tr>`
  }).join('')
  const details = sorted.map(d=>{
    const t=d.risks?.[0]||{}; const clr=COLORS[t.level]||'#388E3C'
    return `<div style="margin-bottom:14px;background:#fafafa;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;page-break-inside:avoid">
      <div style="font-weight:800;font-size:14px;color:#0d1b2a;margin-bottom:8px">
        ${d.name} <span style="background:${BG[t.level]||BG.Low};color:${clr};padding:2px 9px;border-radius:100px;font-size:10px;font-weight:700">${t.level||'Low'}</span>
      </div>
      ${(d.risks||[]).map(r=>{const c=COLORS[r.level]||'#388E3C';return`<div style="display:flex;gap:8px;align-items:baseline;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:12px">
        <span style="text-transform:capitalize;font-weight:600;min-width:100px;color:${c}">${r.disease}</span>
        <span style="font-weight:700;color:${c}">${r.score}/100</span>
        ${r.recommendation?`<span style="color:#555;font-size:11px;flex:1">${r.recommendation}</span>`:''}</div>`}).join('')}
      ${(d.priority_actions||[]).length?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #eee">
        <div style="font-size:10px;font-weight:700;color:#388E3C;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">Recommended actions</div>
        <ol style="margin-left:16px;font-size:11px;color:#444;line-height:1.7">${(d.priority_actions||[]).map(a=>`<li>${a}</li>`).join('')}</ol></div>`:''}
    </div>`
  }).join('')
  const thresh = data.climate_thresholds && Object.keys(data.climate_thresholds).length
    ? `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">
        ${Object.entries(data.climate_thresholds).map(([k,v])=>`<div style="flex:1;min-width:140px;background:#f7f9fc;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px">
          <div style="font-size:10px;font-weight:700;color:#388E3C;text-transform:capitalize;margin-bottom:4px">${k}</div>
          <div style="font-size:11px;color:#6b7280;line-height:1.55">${v}</div></div>`).join('')}</div>` : ''
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Climate-Disease Risk Report</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;font-size:13px;color:#222;background:#fff}
.page{max-width:800px;margin:0 auto}
.header{background:#0d1b2a;color:white;padding:24px 32px}
.header h1{font-size:20px;font-weight:800;margin-bottom:4px}
.content{padding:24px 32px}
.sec{font-size:11px;font-weight:700;color:#0d1b2a;text-transform:uppercase;letter-spacing:1px;margin:22px 0 10px;padding-bottom:5px;border-bottom:2px solid #4CAF50}
.summary{background:#f0f7f0;border-left:3px solid #4CAF50;padding:12px 14px;border-radius:4px;font-size:13px;line-height:1.75;color:#333}
.stats{display:flex;gap:10px;margin:14px 0}
.stat{flex:1;background:#f7f9fc;border:1px solid #e5e7eb;border-radius:8px;padding:12px;text-align:center}
.sv{font-size:22px;font-weight:800;margin-bottom:3px}
.sl{font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600}
table{width:100%;border-collapse:collapse;margin-bottom:8px}
th{background:#0d1b2a;color:white;padding:8px 10px;text-align:left;font-size:11px;font-weight:600}
td{padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;vertical-align:top}
tr:nth-child(even) td{background:#fafafa}
.footer{margin-top:24px;padding:12px 32px;background:#f7f9fc;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;display:flex;justify-content:space-between}
@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
</style></head><body>
<div class="page">
<div class="header">
  <h1>Climate-Disease Risk Analyzer</h1>
  <div style="font-size:12px;color:rgba(255,255,255,0.55);margin-top:3px">District Risk Analysis Report · Created by Aivonex Technologies · ${now()}</div>
</div>
<div class="content">
  <div class="stats">
    <div class="stat"><div class="sv" style="color:#0d1b2a">${data.total_districts||sorted.length}</div><div class="sl">Districts</div></div>
    <div class="stat"><div class="sv" style="color:#E53935">${sorted.filter(d=>d.risks?.[0]?.level==='Critical').length}</div><div class="sl">Critical</div></div>
    <div class="stat"><div class="sv" style="color:#F57C00">${sorted.filter(d=>d.risks?.[0]?.level==='High').length}</div><div class="sl">High Risk</div></div>
    <div class="stat"><div class="sv" style="color:#388E3C">4 wks</div><div class="sl">Forecast</div></div>
  </div>
  ${data.summary?`<div class="sec">Executive Summary</div><div class="summary">${data.summary}</div>`:''}
  <div class="sec">District Risk Scores</div>
  <table><thead><tr><th>#</th><th>District</th><th>Score</th><th>Level</th><th>Primary Threat</th><th>Trigger Factors</th></tr></thead>
  <tbody>${tableRows}</tbody></table>
  <div class="sec">Detailed Analysis</div>
  ${details}
  ${thresh?`<div class="sec">Climate-Disease Thresholds</div>${thresh}`:''}
</div>
<div class="footer">
  <span>Climate-Disease Risk Analyzer · Aivonex Technologies</span>
  <span>${now()}</span>
</div>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`
}

function ExportModal({ data, onClose }) {
  const [busy, setBusy] = useState('')
  const dl = (content, filename, type) => {
    const blob = new Blob([content], { type })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }
  const actions = [
    { id:'pdf',  icon:'📄', label:'PDF Report',      sub:'Opens print dialog — save as PDF', color:'#E53935', bg:'#FFEBEE',
      fn: () => { const win=window.open('','_blank'); win.document.write(buildPDF(data)); win.document.close() } },
    { id:'word', icon:'📝', label:'Word Document',   sub:'Download as .doc file',            color:'#1E88E5', bg:'#E3F2FD',
      fn: () => dl(buildWord(data), 'Climate-Disease-Risk-Report.doc', 'application/msword') },
    { id:'csv',  icon:'📊', label:'CSV Spreadsheet', sub:'Open in Excel or Google Sheets',   color:'#388E3C', bg:'#E8F5E9',
      fn: () => dl(buildCSV(data), 'Climate-Disease-Risk-Report.csv', 'text/csv') },
    { id:'txt',  icon:'📋', label:'Text Report',     sub:'Plain text, copy anywhere',        color:'#F57C00', bg:'#FFF3E0',
      fn: () => dl(buildTXT(data), 'Climate-Disease-Risk-Report.txt', 'text/plain') },
  ]
  const run = (a) => { setBusy(a.id); setTimeout(() => { a.fn(); setBusy(''); onClose() }, 200) }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(13,27,42,0.6)', backdropFilter:'blur(5px)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--bg-white)', borderRadius:'var(--r-xl)', padding:'28px', width:'440px', boxShadow:'0 24px 64px rgba(0,0,0,0.2)', animation:'fadeUp 0.25s ease' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'18px', color:'var(--text-head)' }}>Download Report</div>
          <button onClick={onClose} style={{ background:'var(--bg-section)', border:'none', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', fontSize:'15px', color:'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'20px' }}>
          Choose your format — all exports include the full district analysis, risk scores, and action recommendations.
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
          {actions.map(a => (
            <button key={a.id} onClick={() => run(a)} disabled={!!busy}
              style={{ background: busy===a.id ? a.bg : 'var(--bg-section)', border:`1.5px solid ${busy===a.id ? a.color+'60' : 'var(--border)'}`, borderRadius:'var(--r-lg)', padding:'16px 14px', cursor: busy ? 'not-allowed' : 'pointer', textAlign:'left', transition:'all 0.15s', opacity: busy && busy!==a.id ? 0.5 : 1 }}
              onMouseEnter={e=>{ if(!busy){ e.currentTarget.style.background=a.bg; e.currentTarget.style.borderColor=a.color+'60' }}}
              onMouseLeave={e=>{ if(busy!==a.id){ e.currentTarget.style.background='var(--bg-section)'; e.currentTarget.style.borderColor='var(--border)' }}}
            >
              <div style={{ fontSize:'22px', marginBottom:'7px' }}>{busy===a.id ? '⏳' : a.icon}</div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'13px', color:'var(--text-head)', marginBottom:'3px' }}>{a.label}</div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{a.sub}</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop:'16px', padding:'10px 14px', background:'var(--bg-section)', borderRadius:'var(--r-md)', fontSize:'12px', color:'var(--text-muted)', lineHeight:1.6 }}>
          For PDF: click "Save as PDF" in the print dialog. For Word: open the downloaded .doc in Microsoft Word.
        </div>
      </div>
    </div>
  )
}

function DistrictCard({ district, onClick, selected }) {
  const top=district.risks?.[0]||{}; const level=top.level||'Low'; const score=top.score||0; const color=COLORS[level]||COLORS.Low
  return (
    <div onClick={() => onClick(district)} style={{ background: selected ? BG[level] : 'var(--bg-white)', border:`1.5px solid ${selected ? color+'60' : 'var(--border)'}`, borderRadius:'var(--r-lg)', padding:'16px 18px', cursor:'pointer', transition:'all 0.18s', boxShadow: selected ? `0 0 0 3px ${color}18` : 'var(--shadow-sm)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
        <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'15px', color:'var(--text-head)' }}>{district.name}</div>
        <span className={`badge badge-${level.toLowerCase()}`}>{level}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
        <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'26px', color, lineHeight:1 }}>{score}</div>
        <RiskBar score={score} level={level} />
        <div style={{ fontSize:'12px', color:'var(--text-muted)', minWidth:'28px', textAlign:'right', fontFamily:'var(--font-head)', fontWeight:700 }}>/100</div>
      </div>
      <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>
        Primary concern: <span style={{ color:'var(--text-body)', fontWeight:500, textTransform:'capitalize' }}>{district.top_threat || '—'}</span>
      </div>
    </div>
  )
}

function DetailPanel({ district, onClose }) {
  if (!district) return null
  const top=district.risks?.[0]||{}; const level=top.level||'Low'; const color=COLORS[level]||COLORS.Low
  const radarData = (district.risks||[]).map(r=>({ disease: r.disease ? r.disease.charAt(0).toUpperCase()+r.disease.slice(1) : '', score: r.score||0 }))
  return (
    <div className="card slide-in" style={{ border:`1.5px solid ${color}30` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'18px' }}>
        <div>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'20px', color:'var(--text-head)' }}>{district.name}</div>
          <div style={{ fontSize:'13px', color:'var(--text-muted)', marginTop:'3px' }}>Full risk breakdown</div>
        </div>
        <button onClick={onClose} style={{ background:'var(--bg-section)', border:'1px solid var(--border)', borderRadius:'var(--r-sm)', padding:'5px 12px', cursor:'pointer', fontSize:'13px', color:'var(--text-muted)' }}>Close ×</button>
      </div>
      {radarData.length > 1 && (
        <div style={{ marginBottom:'16px' }}>
          <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'10px' }}>Risk across disease types</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="disease" tick={{ fill:'var(--text-muted)', fontSize:11 }} />
              <Radar dataKey="score" stroke={color} fill={color} fillOpacity={0.12} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div style={{ marginBottom:'16px' }}>
        <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'10px' }}>Disease breakdown</div>
        {(district.risks||[]).map((r,i) => (
          <div key={i} style={{ background:'var(--bg-section)', borderRadius:'var(--r-md)', padding:'11px 13px', marginBottom:'8px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'13px', color:'var(--text-head)', textTransform:'capitalize' }}>{r.disease}</div>
              <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'15px', color:COLORS[r.level]||COLORS.Low }}>{r.score}</span>
                <span className={`badge badge-${r.level?.toLowerCase()}`}>{r.level}</span>
              </div>
            </div>
            {(r.trigger_factors||[]).length>0 && (
              <div style={{ display:'flex', gap:'5px', marginBottom:'6px', flexWrap:'wrap' }}>
                {r.trigger_factors.map((f,fi)=>(<span key={fi} style={{ fontSize:'11px', padding:'2px 7px', background:'var(--bg-white)', border:'1px solid var(--border)', borderRadius:'100px', color:'var(--text-muted)' }}>{f}</span>))}
              </div>
            )}
            {r.lag_weeks && <div style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'4px' }}>Typical lag: <span style={{ color:'var(--teal)', fontWeight:600 }}>{r.lag_weeks} weeks</span> after trigger</div>}
            {r.recommendation && <div style={{ fontSize:'13px', color:'var(--text-body)', lineHeight:1.65, borderLeft:`3px solid ${COLORS[r.level]||COLORS.Low}`, paddingLeft:'10px', marginTop:'6px' }}>{r.recommendation}</div>}
          </div>
        ))}
      </div>
      {(district.climate_anomalies||[]).length>0 && (
        <div style={{ marginBottom:'14px' }}>
          <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'8px' }}>Climate anomalies</div>
          {district.climate_anomalies.map((a,i) => (
            <div key={i} style={{ fontSize:'13px', color:'var(--amber)', padding:'5px 0', display:'flex', gap:'8px', alignItems:'flex-start', borderBottom: i<district.climate_anomalies.length-1?'1px solid var(--border)':'none', lineHeight:1.6 }}>
              <span style={{ flexShrink:0 }}>⚠</span><span>{a}</span>
            </div>
          ))}
        </div>
      )}
      {(district.priority_actions||[]).length>0 && (
        <div style={{ background:'var(--green-light)', border:'1.5px solid var(--green-mid)', borderRadius:'var(--r-md)', padding:'13px 15px' }}>
          <div style={{ fontSize:'11px', color:'var(--green-dark)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'9px' }}>Recommended actions</div>
          {district.priority_actions.map((a,i) => (
            <div key={i} style={{ fontSize:'13px', color:'var(--text-body)', padding:'4px 0', display:'flex', gap:'10px', alignItems:'flex-start', lineHeight:1.65 }}>
              <span style={{ color:'var(--green-dark)', fontFamily:'var(--font-head)', fontWeight:800, flexShrink:0 }}>{i+1}.</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ResultsScreen({ data, onBack, onNew }) {
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy]     = useState('score')
  const [showExport, setShowExport] = useState(false)

  const districts = data.districts || []
  const sorted    = [...districts].sort((a,b) =>
    sortBy==='name' ? a.name.localeCompare(b.name) : (b.risks?.[0]?.score||0)-(a.risks?.[0]?.score||0)
  )
  const barData = sorted.slice(0,8).map(d => ({ name:d.name, score:d.risks?.[0]?.score||0, level:d.risks?.[0]?.level||'Low' }))

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 32px 80px' }}>
      {showExport && <ExportModal data={data} onClose={() => setShowExport(false)} />}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px', flexWrap:'wrap', gap:'16px' }}>
        <div>
          <div style={{ fontSize:'11px', color:'var(--green-dark)', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'7px' }}>Analysis complete</div>
          <h1 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'26px', color:'var(--text-head)', letterSpacing:'-0.5px' }}>District Risk Report</h1>
          {data.analysis_date && <div style={{ fontSize:'13px', color:'var(--text-muted)', marginTop:'4px' }}>Generated: {data.analysis_date}</div>}
        </div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
          <button onClick={() => setShowExport(true)} style={{ background:'var(--green)', color:'#fff', border:'none', borderRadius:'var(--r-md)', padding:'10px 20px', fontSize:'13px', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'7px', boxShadow:'0 2px 8px rgba(76,175,80,0.3)' }}>
            ⬇ Download Report
          </button>
          <button className="btn-outline" onClick={onBack} style={{ fontSize:'13px' }}>← Edit inputs</button>
          <button className="btn-outline" onClick={onNew}  style={{ fontSize:'13px' }}>+ New analysis</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'24px' }}>
        {[
          { label:'Districts analyzed', value:data.total_districts||districts.length,                                           color:'var(--text-head)'   },
          { label:'Critical risk',      value:districts.filter(d=>d.risks?.[0]?.level==='Critical').length,                    color:'var(--red)'         },
          { label:'High risk',          value:districts.filter(d=>d.risks?.[0]?.level==='High').length,                        color:'var(--amber)'       },
          { label:'Forecast window',    value:'4 weeks',                                                                        color:'var(--green-dark)'  },
        ].map((s,i) => (
          <div key={i} className="card fade-up" style={{ animationDelay:`${i*0.07}s`, padding:'18px 20px' }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'28px', color:s.color, lineHeight:1, marginBottom:'6px' }}>{s.value}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {data.summary && (
        <div style={{ background:'var(--bg-dark)', borderRadius:'var(--r-lg)', padding:'22px 26px', marginBottom:'24px', border:'1.5px solid rgba(76,175,80,0.25)', animation:'fadeUp 0.4s ease 0.2s both' }}>
          <div style={{ fontSize:'11px', color:'#81C784', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>Analysis summary — Aivonex AI</div>
          <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.78)', lineHeight:1.8, margin:0 }}>{data.summary}</p>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap:'24px', marginBottom:'24px' }}>
        <div>
          <div className="card" style={{ marginBottom:'16px', padding:'20px 20px 12px' }}>
            <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'14px' }}>Risk score overview</div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={barData} margin={{ top:4, right:4, left:-18, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill:'var(--text-muted)', fontSize:11 }} />
                <YAxis domain={[0,100]} tick={{ fill:'var(--text-muted)', fontSize:11 }} />
                <Tooltip contentStyle={{ background:'var(--bg-white)', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'13px' }} formatter={(v,_,p) => [`${v}/100 — ${p.payload.level}`, 'Risk score']} />
                <Bar dataKey="score" radius={[5,5,0,0]}>
                  {barData.map((e,idx) => <rect key={idx} fill={COLORS[e.level]||COLORS.Low} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'14px', color:'var(--text-head)' }}>All districts</div>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ width:'auto', padding:'6px 10px', fontSize:'12px' }}>
              <option value="score">Highest risk first</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr' : '1fr 1fr', gap:'10px' }}>
            {sorted.map((d,i) => (
              <div key={i} style={{ animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
                <DistrictCard district={d} onClick={setSelected} selected={selected?.name===d.name} />
              </div>
            ))}
          </div>
        </div>
        {selected && <div><DetailPanel district={selected} onClose={() => setSelected(null)} /></div>}
      </div>

      {data.climate_thresholds && Object.keys(data.climate_thresholds).length>0 && (
        <div className="card" style={{ animation:'fadeUp 0.4s ease 0.3s both' }}>
          <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'14px' }}>Climate-disease thresholds identified</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'10px' }}>
            {Object.entries(data.climate_thresholds).map(([disease, threshold]) => (
              <div key={disease} style={{ background:'var(--bg-section)', borderRadius:'var(--r-md)', padding:'11px 13px' }}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'12px', color:'var(--green-dark)', textTransform:'capitalize', marginBottom:'5px' }}>{disease}</div>
                <div style={{ fontSize:'12px', color:'var(--text-muted)', lineHeight:1.65 }}>{threshold}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop:'24px', padding:'14px 18px', background:'var(--bg-section)', borderRadius:'var(--r-lg)', display:'flex', alignItems:'center', gap:'14px' }}>
        <img src="/src/assets/logo.jpeg" alt="Aivonex" style={{ height:'28px', opacity:0.75 }} onError={e=>e.target.src='/src/assets/logo.png'} />
        <div style={{ fontSize:'12px', color:'var(--text-muted)', lineHeight:1.65, flex:1 }}>
          This report is generated by the Climate-Disease Risk Analyzer, created by AIVONEX Technologies.
          Results should be reviewed by qualified public health professionals before operational use.
        </div>
      </div>
    </div>
  )
}