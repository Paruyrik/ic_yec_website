import { createServer } from 'http'
import { google } from 'googleapis'
import { exec } from 'child_process'

// Read credentials from environment — never hardcode these.
// Copy .env.example to .env and fill in GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
// before running this script.
const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI  = 'http://localhost:3333'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌  GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in your .env file.')
  process.exit(1)
}

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
  console.log('✅  Add this to your .env:\n')
  console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
  console.log()
}).listen(3333, () => {
  console.log('Waiting for Google redirect on http://localhost:3333 …\n')
})
