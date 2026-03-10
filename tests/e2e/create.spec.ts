import { expect, test } from '@playwright/test'

test('create screen loads and generates a qr share link', async ({ page }) => {
  await page.goto('.')

  await expect(page.getByLabel('Text to share')).toBeVisible()
  await page.getByLabel('Text to share').fill('hello from playwright')

  const qr = page.getByAltText(
    'QR code for opening the shared text in QR Share',
  )
  await expect(qr).toBeVisible()

  const copyTarget = page.getByRole('button', { name: 'Copy link' })

  await copyTarget.hover()
  await expect(page.getByText('Click to copy')).toBeVisible()
})

test('theme toggle switches the app theme', async ({ page }) => {
  await page.goto('.')

  const html = page.locator('html')
  const initialTheme = await html.getAttribute('data-theme')

  await page.getByRole('button', { name: /Switch to .* mode/ }).click()

  await expect(html).not.toHaveAttribute('data-theme', initialTheme ?? 'light')
})
