import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

function loadEnv() {
  const envPath = path.resolve(import.meta.dirname, '../../.env')
  const parsed: Record<string, string> = {}
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

/** True when the admin credentials needed to create/delete test users are configured. */
export function hasAdminCredentials(): boolean {
  return Boolean(env.VITE_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)
}

let adminClient: SupabaseClient | null = null

/**
 * Lazily-built admin client used to create/delete disposable test users.
 * Only call this when `hasAdminCredentials()` is true — it throws otherwise.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!hasAdminCredentials()) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required to create/delete e2e test users. Add it to .env — see Project Settings > API in the Supabase dashboard.',
    )
  }
  if (!adminClient) {
    adminClient = createClient(env.VITE_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return adminClient
}

export type Role = 'athlete' | 'coach'

export interface TestUser {
  id: string
  email: string
  password: string
  username: string
  displayName: string
  role: Role
}

export async function createTestUser(role: Role): Promise<TestUser> {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const email = `e2e-${role}-${unique}@example.com`
  const password = 'TestPass123!'
  const username = `e2e_${role}_${unique}`.slice(0, 30)
  const displayName = `E2E ${role === 'coach' ? 'Coach' : 'Athlete'} ${unique.slice(-4)}`

  const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, display_name: displayName, role },
  })
  if (error) throw error

  return { id: data.user.id, email, password, username, displayName, role }
}

export async function deleteTestUser(userId: string) {
  await getSupabaseAdmin().auth.admin.deleteUser(userId)
}
