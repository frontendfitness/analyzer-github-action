import crypto from 'crypto'
import { API_CONFIG_URL } from './config'

const signPayload = (payload: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(payload).digest('hex')

const handleResponse = (response: Response) => {
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

export const sendUnsignedPostRequest = async (payload: unknown) => {
  console.log('making unsigned request', payload)

  const payloadString = JSON.stringify(payload)
  const response = await fetch(API_CONFIG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payloadString,
  })
  return handleResponse(response)
}
export const sendSignedPostRequest = async (
  payload: unknown,
  secret: string
) => {
  console.log('making signed request', secret, payload)

  const payloadString = JSON.stringify(payload)
  const signature = signPayload(payloadString, secret)

  const response = await fetch(API_CONFIG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Signature': signature },
    body: payloadString,
  })

  return handleResponse(response)
}
