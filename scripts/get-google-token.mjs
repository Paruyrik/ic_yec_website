import { createServer } from 'http'
import { google } from 'googleapis'
import { exec } from 'child_process'

const CLIENT_ID     = '427365930682-hb7isbc9324m60kd6b4n5ca25m8im2eo.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI  = 'http://localhost:3333'

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/calendar.events'],
})

console.log('\n🔑  Opening browser for Google auth…\n')
exec(`open "${authUrl}"`)

const server = createServer(async (req, res) => {
  const url  = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get('code')
  if (!code) { res.end('No code found.'); return }

  res.end('<h2>Done! You can close this tab and go back to your terminal.</h2>')
  server.close()

  const { tokens } = await oauth2Client.getToken(code)
  console.log('✅  Add these to your .env:\n')
  console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`)
  console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`)
  console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
  console.log()
}).listen(3333, () => {
  console.log('Waiting for Google redirect on http://localhost:3333 …\n')
})
