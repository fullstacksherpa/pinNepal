import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Discover Nepal, one trail at a time')
  })

  test('can load blog category index', async ({ page }) => {
    await page.goto('http://localhost:3000/blog/category')
    await expect(page.locator('h1').first()).toHaveText('Blog Categories')
  })

  test('can load destination category index', async ({ page }) => {
    await page.goto('http://localhost:3000/destinations/category')
    await expect(page.locator('h1').first()).toHaveText('Destination Categories')
  })
})
