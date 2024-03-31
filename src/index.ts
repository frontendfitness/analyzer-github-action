import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run() {
  try {
    console.log('tracker index: running the lint script')
    await exec.exec('npm run lint')

    // Run ESLint
    console.log('tracker index: ran ESLint successfully')
  } catch (error) {
    console.log('An error occured', (error as Error).message)
    core.setFailed(`ESLint check failed: ${error}`)
  }
}

console.log('FF quality tracker index')

run()
