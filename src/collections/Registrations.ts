import type { CollectionConfig } from 'payload'
import { render } from '@react-email/components'
import { StatusUpdate } from '@/emails/StatusUpdate'
import { sendEmail } from '@/lib/email'
import React from 'react'

const FROM = () => process.env.EMAIL_FROM ?? 'IC-YEC <noreply@ic-yec.org>'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'applicantName',
    defaultColumns: ['applicantName', 'email', 'openCall', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'openCall', type: 'relationship', relationTo: 'open-calls' as any, required: true },
    { name: 'applicantName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'country', type: 'text', required: true },
    { name: 'dateOfBirth', type: 'date', required: true },
    { name: 'motivationLetter', type: 'textarea' },
    { name: 'cv', type: 'upload', relationTo: 'documents' as any },
    {
      name: 'answers',
      type: 'array',
      fields: [
        { name: 'blockType', type: 'text', admin: { readOnly: true } },
        { name: 'fieldLabel', type: 'text', admin: { readOnly: true } },
        { name: 'value', type: 'textarea', admin: { readOnly: true } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending',             value: 'pending' },
        { label: 'Reviewing',           value: 'reviewing' },
        { label: 'Shortlisted',         value: 'shortlisted' },
        { label: 'Interview scheduled', value: 'interview' },
        { label: 'Accepted',            value: 'accepted' },
        { label: 'Rejected',            value: 'rejected' },
      ],
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
    },
    {
      name: 'agreementUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Google Form/Doc link - included in the acceptance email',
        condition: (data) => data?.status === 'accepted',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Internal notes - not visible to applicant' },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation !== 'update') return
        if (doc.status === previousDoc?.status) return
        if (doc.status !== 'accepted' && doc.status !== 'rejected') return

        try {
          const openCallId = typeof doc.openCall === 'object' ? (doc.openCall as any).id : doc.openCall
          const openCall   = await req.payload.findByID({ collection: 'open-calls' as any, id: openCallId, depth: 0 })
          const callTitle  = typeof (openCall as any)?.title === 'string'
            ? (openCall as any).title
            : (openCall as any)?.title?.en ?? 'Open Call'

          const html = await render(
            React.createElement(StatusUpdate, {
              applicantName: doc.applicantName,
              openCallTitle: callTitle,
              decision: doc.status as 'accepted' | 'rejected',
              agreementUrl: doc.status === 'accepted' ? (doc.agreementUrl ?? undefined) : undefined,
            }),
          )

          const subject = doc.status === 'accepted'
            ? `Congratulations - you've been accepted to ${callTitle}`
            : `Your application to ${callTitle}`

          await sendEmail({ from: FROM(), to: doc.email, subject, html })
        } catch (err) {
          console.error('[registration:email-hook]', err)
        }
      },
    ],
  },
}
