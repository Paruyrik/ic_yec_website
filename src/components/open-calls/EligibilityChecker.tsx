'use client'

import React, { useState } from 'react'

interface EligibilityData {
  ageMin?: number | null
  ageMax?: number | null
  countries?: { country: string }[] | null
}

interface Props {
  eligibility: EligibilityData
}

type Step = 'age' | 'country' | 'result'

const EU_COUNTRIES = [
  'Austria','Belgium','Bulgaria','Croatia','Cyprus','Czech Republic','Denmark',
  'Estonia','Finland','France','Germany','Greece','Hungary','Ireland','Italy',
  'Latvia','Lithuania','Luxembourg','Malta','Netherlands','Poland','Portugal',
  'Romania','Slovakia','Slovenia','Spain','Sweden',
]
const EEA_COUNTRIES = [...EU_COUNTRIES, 'Iceland','Liechtenstein','Norway']
const PARTNER_COUNTRIES = [...EEA_COUNTRIES, 'Albania','Armenia','Azerbaijan','Bosnia and Herzegovina',
  'Georgia','Kosovo','Moldova','Montenegro','North Macedonia','Serbia','Turkey','Ukraine']

function matchesCountry(userCountry: string, allowedCountries: string[]): boolean {
  return allowedCountries.some(ac => {
    const lc = ac.toLowerCase()
    if (lc.includes('eu/eea')) return EEA_COUNTRIES.some(c => c.toLowerCase() === userCountry.toLowerCase())
    if (lc.includes('eu')) return EU_COUNTRIES.some(c => c.toLowerCase() === userCountry.toLowerCase())
    if (lc.includes('partner')) return PARTNER_COUNTRIES.some(c => c.toLowerCase() === userCountry.toLowerCase())
    return ac.toLowerCase() === userCountry.toLowerCase()
  })
}

export function EligibilityChecker({ eligibility }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('age')
  const [age, setAge] = useState('')
  const [country, setCountry] = useState('')
  const [result, setResult] = useState<'eligible' | 'ineligible' | null>(null)
  const [reason, setReason] = useState('')

  function reset() {
    setStep('age')
    setAge('')
    setCountry('')
    setResult(null)
    setReason('')
  }

  function checkAge() {
    const n = parseInt(age)
    if (isNaN(n)) return
    const min = eligibility.ageMin ?? 0
    const max = eligibility.ageMax ?? 99
    if (n < min || n > max) {
      setResult('ineligible')
      setReason(`Age must be between ${min} and ${max}. You entered ${n}.`)
      setStep('result')
    } else {
      setStep('country')
    }
  }

  function checkCountry() {
    if (!country) return
    const allowed = eligibility.countries ?? []
    if (allowed.length === 0 || matchesCountry(country, allowed.map(c => c.country))) {
      setResult('eligible')
      setReason('You meet the basic eligibility criteria! Click "Apply now" to submit your application.')
    } else {
      setResult('ineligible')
      setReason(`This call is open to participants from: ${allowed.map(c => c.country).join(', ')}.`)
    }
    setStep('result')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 18px',
          background: 'var(--color-tint)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 10,
          fontSize: 14, fontWeight: 500,
          color: 'var(--color-primary)',
          cursor: 'pointer',
        }}
      >
        <span>✓</span> Check my eligibility
      </button>
    )
  }

  return (
    <div style={{
      border: '1.5px solid var(--color-border)',
      borderRadius: 14,
      overflow: 'hidden',
      background: 'var(--color-tint)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'var(--color-primary)',
        color: 'white',
      }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>Quick Eligibility Check</span>
        <button
          onClick={() => { setOpen(false); reset() }}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0 }}
        >×</button>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {(['age', 'country', 'result'] as Step[]).map((s, i) => (
            <div key={s} style={{
              height: 4, flex: 1, borderRadius: 2,
              background: i <= (['age','country','result'] as Step[]).indexOf(step)
                ? 'var(--color-primary)' : 'var(--color-border)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        {step === 'age' && (
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--color-text)' }}>
              How old are you?
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkAge()}
                placeholder="e.g. 24"
                min={10} max={60}
                style={{
                  flex: 1, padding: '10px 14px',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 8, fontSize: 15,
                  background: 'white',
                }}
              />
              <button
                onClick={checkAge}
                disabled={!age}
                style={{
                  padding: '10px 18px',
                  background: 'var(--color-primary)', color: 'white',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontWeight: 500, fontSize: 14,
                  opacity: age ? 1 : 0.5,
                }}
              >Next →</button>
            </div>
          </div>
        )}

        {step === 'country' && (
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--color-text)' }}>
              Which country are you from?
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkCountry()}
                placeholder="e.g. Germany"
                style={{
                  flex: 1, padding: '10px 14px',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 8, fontSize: 15,
                  background: 'white',
                }}
              />
              <button
                onClick={checkCountry}
                disabled={!country}
                style={{
                  padding: '10px 18px',
                  background: 'var(--color-primary)', color: 'white',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontWeight: 500, fontSize: 14,
                  opacity: country ? 1 : 0.5,
                }}
              >Check →</button>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{
              fontSize: 40, marginBottom: 12,
            }}>
              {result === 'eligible' ? '🎉' : '😔'}
            </div>
            <div style={{
              fontSize: 16, fontWeight: 600,
              color: result === 'eligible' ? '#16a34a' : '#dc2626',
              marginBottom: 8,
            }}>
              {result === 'eligible' ? 'You appear eligible!' : 'You may not be eligible'}
            </div>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
              {reason}
            </p>
            <button
              onClick={reset}
              style={{
                background: 'none', border: '1px solid var(--color-border)',
                borderRadius: 8, padding: '7px 16px',
                fontSize: 13, cursor: 'pointer',
                color: 'var(--color-text-muted)',
              }}
            >Check again</button>
          </div>
        )}
      </div>
    </div>
  )
}
