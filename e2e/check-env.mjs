// Runs the e2e suite only when Supabase credentials are configured, and skips
// cleanly (exit 0) otherwise so the pre-commit hook never fails on setup alone.
import { spawn } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const envPath = path.resolve(process.cwd(), '.env')

function loadEnv() {
  const parsed = {}
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      if (!line.includes('=')) continue
      const i = line.indexOf('=')
      parsed[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  }
  return { ...parsed, ...process.env }
}

const env = loadEnv()
const missing = []
if (!env.VITE_SUPABASE_URL) missing.push('VITE_SUPABASE_URL')
if (!env.VITE_SUPABASE_PUBLISHABLE_KEY) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY')

if (missing.length > 0) {
  console.log(
    `\n[open-gym] Skipping e2e tests: missing ${missing.join(', ')}. ` +
      'Copy .env.example to .env and add your Supabase project credentials to run the full suite.\n',
  )
  process.exit(0)
}

const isWin = process.platform === 'win32'
const npx = isWin ? 'npx.cmd' : 'npx'
const child = spawn(npx, ['playwright', 'test', ...process.argv.slice(2)], { stdio: 'inherit' })
child.on('exit', (code) => process.exit(code ?? 1))