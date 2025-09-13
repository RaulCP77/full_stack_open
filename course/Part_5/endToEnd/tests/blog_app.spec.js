const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: { username: 'test', name: 'test', password: 'test' },
    })

    await page.goto('/')

  })

  test('Login form is shown', async ({ page }) => {
    // ...
    await expect(page.getByText('Login to application')).toBeVisible()
    await expect(page.getByText('Username')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('test')
      await page.locator('input[name="Password"]').fill('test')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('test logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('test')
      await page.locator('input[name="Password"]').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong user')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await login(page, 'test', 'test')
    })

    test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'a blog created by playwright', 'playwright', 'http://playwright.dev')

        await expect(page.getByText('New blog: a blog created by playwright, created by: playwright')).toBeVisible()
    })

    test('blog can be edited', async ({ page }) => {
        await createBlog(page, 'a blog created by playwright', 'playwright', 'http://playwright.dev')
        await page.getByRole('button', { name: 'Show more' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('URL: http://playwright.dev. Likes: 1')).toBeVisible()
    })

    test('blog can be deleted', async ({ page }) => {
        await createBlog(page, 'a blog created by playwright', 'playwright', 'http://playwright.dev')
        await page.getByRole('button', { name: 'Show more' }).click()
        await page.getByRole('button', { name: 'Remove this blog' }).click()
        await page.waitForTimeout(500) // wait for the deletion to complete
        
        await expect(page.getByRole('button', { name: 'Show less' })).not.toBeVisible()
    })

    test('only the creator can see the delete button', async ({ page, request }) => {
        await createBlog(page, 'a blog created by playwright', 'playwright', 'http://playwright.dev')
        await page.getByRole('button', { name: 'Show more' }).click()
        await expect(page.getByRole('button', { name: 'Remove this blog' })).toBeVisible()

        // Logout
        await page.getByRole('button', { name: 'Login out' }).click()

        // Create a new user
        await request.post('/api/users', {
          data: { username: 'anotheruser', name: 'Another User', password: 'password123' },
        })

        // Login as the new user
        await login(page, 'anotheruser', 'password123')

        // Try to see the delete button of the blog created by the first user
        await page.getByRole('button', { name: 'Show more' }).click()
        await page.getByRole('button', { name: 'Remove this blog' }).click()
        await page.waitForTimeout(500) // wait for any potential deletion to complete
        await expect(page.getByText('Error deleting the blog')).toBeVisible()
    })

    test('blogs are ordered according to likes', async ({ page }) => {
        await createBlog(page, 'first blog', 'playwright', 'http://playwright.dev')
        await createBlog(page, 'second blog', 'playwright', 'http://playwright.dev')
        await createBlog(page, 'third blog', 'playwright', 'http://playwright.dev')

        // Like second blog twice
        await page.getByRole('button', { name: 'Show more' }).nth(1).click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(500) // wait for the like to be registered
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.locator('.blog').first()).toContainText('second blog')

        // Like third blog once
        await page.getByRole('button', { name: 'Show more' }).nth(1).click()
        await page.locator('.blog').last().getByRole('button', { name: 'Like' }).click()
        await page.waitForTimeout(500) // wait for the like to be registered
        await expect(page.locator('.blog').nth(1)).toContainText('third blog')
        await expect(page.locator('.blog').last()).toContainText('first blog')
    })
  })
})