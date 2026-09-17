import { test as base, expect, type Page } from '@playwright/test'
import { createTestUser, deleteTestUser, hasAdminCredentials, type TestUser } from './support/adminApi'

export async function loginAs(page: Page, user: TestUser) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(user.email)
  await page.getByLabel('Password').fill(user.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(user.role === 'coach' ? '/coach/dashboard' : '/app/dashboard')
}

export const test = base.extend<{ athlete: TestUser; coach: TestUser }>({
  athlete: async ({}, use) => {
    if (!hasAdminCredentials()) {
      test.skip(true, 'SUPABASE_SERVICE_ROLE_KEY not configured — cannot create test users')
    }
    const user = await createTestUser('athlete')
    await use(user)
    await deleteTestUser(user.id)
  },
  coach: async ({}, use) => {
    if (!hasAdminCredentials()) {
      test.skip(true, 'SUPABASE_SERVICE_ROLE_KEY not configured — cannot create test users')
    }
    const user = await createTestUser('coach')
    await use(user)
    await deleteTestUser(user.id)
  },
})

export { expect }
