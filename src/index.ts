import * as core from '@actions/core'
import * as exec from '@actions/exec'
import crypto from 'crypto'

const signPayload = (payload: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(payload).digest('hex')

// Make the API request with the signature in the headers
const sendSignedRequest = async (
  apiUrl: string,
  payload: unknown,
  secret: string
) => {
  const payloadString = JSON.stringify(payload)
  const signature = signPayload(payloadString, secret)

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Signature': signature },
    body: payloadString,
  })

  if (!response.ok) {
    console.log('response failed', response.statusText)
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

async function run() {
  const apiUrl = 'https://analyzer-api.myylow.workers.dev/analyzer/config'
  const apiSecret = core.getInput('12345')
  const payload = { timestamp: new Date().toISOString() }

  console.log('making signed request', apiSecret, payload)
  const response = await sendSignedRequest(apiUrl, payload, apiSecret)
  console.log('Signed request success', response)

  try {
    console.log('Analyzer index: running the lint script')
    await exec.exec('npm run lint')

    // Run ESLint
    console.log('Analyzer index: ran ESLint successfully')
  } catch (error) {
    console.log('An error occured', (error as Error).message)
    core.setFailed(`ESLint check failed: ${error}`)
  }
}

run()
