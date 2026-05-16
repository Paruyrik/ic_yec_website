'use client'

import { Fragment, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { renderField } from './fieldRegistry'
import type { AnswerEntry, FormFieldBlock } from './types'
import { INPUT_STYLE } from './renderers/shared'

type Props = {
  openCallId: string
  openCallTitle: string
  formFields: FormFieldBlock[]
  spotsAvailable?: number
}

type FormValues = Record<string, any>

const GDPR_TEXT =
  'I agree to IC-YEC processing my personal data for the purpose of this application. ' +
  'Data will not be shared with third parties.'

function Field({ label, required, error, children }: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontWeight: 500, fontSize: 13, color: 'var(--color-text)' }}>
        {label}{required && <span style={{ color: '#c0392b', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ color: '#c0392b', fontSize: 12 }}>{error}</span>}
    </div>
  )
}

export function RegistrationForm({ openCallId, openCallTitle, formFields, spotsAvailable }: Props) {
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const methods = useForm<FormValues>({ mode: 'onBlur' })
  const { register, control, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, watch } = methods
  const applicantName = watch('applicantName', '')

  async function onSubmit(data: FormValues) {
    const answers: AnswerEntry[] = formFields.map((block, i) => {
      const raw = data[`dynamic_${i}`]
      let value: string
      if (typeof raw === 'object' && raw !== null && !(raw instanceof FileList)) {
        value = Object.entries(raw).filter(([, v]) => v).map(([k]) => k).join(', ')
      } else if (raw instanceof FileList) {
        value = Array.from(raw).map((f) => f.name).join(', ')
      } else {
        value = String(raw ?? '')
      }
      const label = 'label' in block ? (block as any).label : block.blockType
      return { blockType: block.blockType, fieldLabel: label, value }
    })

    const cvFile = data.cv?.[0] as File | undefined
    let cvMediaId: string | undefined
    if (cvFile) {
      const fd = new FormData()
      fd.append('file', cvFile)
      fd.append('alt', `CV - ${data.applicantName}`)
      const res = await fetch('/api/documents', { method: 'POST', body: fd })
      if (res.ok) cvMediaId = (await res.json()).doc?.id
    }

    await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        openCall: openCallId,
        applicantName: data.applicantName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        dateOfBirth: data.dateOfBirth,
        motivationLetter: data.motivationLetter,
        cv: cvMediaId,
        answers,
        gdprConsent: data.gdprConsent,
        status: 'pending',
      }),
    })
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (isSubmitSuccessful) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
        <h3 style={{ color: 'var(--color-primary)', marginBottom: 8 }}>Application received!</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Thank you, <strong>{applicantName}</strong>.
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>
          We&apos;ll review your application for <strong>{openCallTitle}</strong> and contact you within two weeks.
        </p>
        <button
          onClick={() => { reset(); setCvFileName(null) }}
          style={{ padding: '9px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer' }}
        >
          Submit another
        </button>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>

        {/* Row 1: Name + Date of Birth */}
        <div className="form-row-2">
          <Field label="Full Name" required error={errors.applicantName ? String(errors.applicantName.message) : undefined}>
            <input type="text" placeholder="First Last" style={INPUT_STYLE}
              {...register('applicantName', { required: 'Required' })} />
          </Field>
          <Field label="Date of Birth" required error={errors.dateOfBirth ? String(errors.dateOfBirth.message) : undefined}>
            <input type="date" style={INPUT_STYLE}
              {...register('dateOfBirth', { required: 'Required' })} />
          </Field>
        </div>

        {/* Row 2: Email */}
        <Field label="Email" required error={errors.email ? String(errors.email.message) : undefined}>
          <input type="email" placeholder="name@example.com" style={INPUT_STYLE}
            {...register('email', {
              required: 'Required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            })} />
        </Field>

        {/* Row 3: Phone + Country */}
        <div className="form-row-2">
          <Field label="Phone">
            <input type="tel" placeholder="+374 00 000 000" style={INPUT_STYLE} {...register('phone')} />
          </Field>
          <Field label="Country" required error={errors.country ? String(errors.country.message) : undefined}>
            <input type="text" placeholder="Armenia" style={INPUT_STYLE}
              {...register('country', { required: 'Required' })} />
          </Field>
        </div>

        {/* Motivation letter */}
        <Field label="Motivation Letter">
          <textarea rows={4} placeholder="Why do you want to participate?" style={{ ...INPUT_STYLE, resize: 'vertical' }}
            {...register('motivationLetter')} />
        </Field>

        {/* CV — dashed drop zone */}
        <Field label="CV / Résumé" error={errors.cv ? String(errors.cv.message) : undefined}>
          <label className="upload-zone">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              {...register('cv', {
                validate: { size: (f: FileList | null) => !f?.[0] || f[0].size <= 5 * 1024 * 1024 || 'Max 5 MB' },
                onChange: (e) => setCvFileName(e.target.files?.[0]?.name ?? null),
              })}
            />
            {cvFileName
              ? <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 500 }}>📎 {cvFileName}</span>
              : <>
                  <span style={{ fontSize: 22, display: 'block', marginBottom: 6 }}>📎</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    Click to upload CV
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', marginTop: 3 }}>
                    PDF, DOC or DOCX — max 5 MB
                  </span>
                </>
            }
          </label>
        </Field>

        {/* Dynamic fields from CMS */}
        {formFields.length > 0 && (
          <>
            <hr className="divider" />
            {formFields.map((block, i) => (
              <Fragment key={`${block.blockType}_${i}`}>
                {renderField({ block, fieldName: `dynamic_${i}`, register, control, errors })}
              </Fragment>
            ))}
          </>
        )}

        {/* GDPR — purple accent checkbox, starts unchecked */}
        <div style={{ background: 'var(--color-tint)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              className="gdpr"
              {...register('gdprConsent', { required: 'You must accept to submit' })}
            />
            <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--color-text)' }}>
              {GDPR_TEXT}
              <span style={{ color: '#c0392b', marginLeft: 2 }}>*</span>
            </span>
          </label>
          {errors.gdprConsent && (
            <p style={{ color: '#c0392b', fontSize: 12, marginTop: 6, marginLeft: 27 }}>
              {String(errors.gdprConsent.message)}
            </p>
          )}
        </div>

        {/* Submit + spots counter */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '13px',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 15,
              fontWeight: 500,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Application'}
          </button>
          {spotsAvailable != null && (
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>
              {spotsAvailable === 1
                ? '⚠️ Only 1 spot left'
                : spotsAvailable <= 5
                ? `⚡ Only ${spotsAvailable} spots remaining`
                : `${spotsAvailable} spots available`}
            </p>
          )}
        </div>

      </form>
    </FormProvider>
  )
}
