import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'

import { sendSignedPostRequest, sendUnsignedPostRequest } from './apiClient'

async function run() {
  const apiToken = core.getInput('apiToken', { required: true })
  const payload = { timestamp: new Date().toISOString() }

  const response = apiToken
    ? await sendSignedPostRequest(payload, apiToken)
    : await sendUnsignedPostRequest(payload)

  console.log('request success', response)

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
