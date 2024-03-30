import core from '@actions/core'
import exec from '@actions/exec'

async function run() {
  try {
    console.log('Running FF quality tracker', 1)
    await exec.exec('npm install eslint')

    console.log('Running FF quality tracker', 2)

    // Run ESLint
    await exec.exec('npx eslint .')
    console.log('Running FF quality tracker', 3)
  } catch (error) {
    console.log('Running FF quality tracker', 4)

    core.setFailed(`ESLint check failed: ${error}`)
  }
}

console.log('FF quality tracker index')

run()
