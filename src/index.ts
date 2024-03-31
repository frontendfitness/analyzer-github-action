import * as core from '@actions/core'
import exec from '@actions/exec'

async function run() {
  try {
    console.log('tracker index: running npm install')
    await exec.exec('npm install eslint')

    // Run ESLint
    console.log('tracker index: running ESLint')
    await exec.exec('npx eslint .')
    console.log('tracker index: ran ESLint success')
  } catch (error) {
    console.log('An error occured', (error as Error).message)
    core.setFailed(`ESLint check failed: ${error}`)
  }
}

console.log('FF quality tracker index')

run()
