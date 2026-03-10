import { expect, test } from '@playwright/test'

test('main controls are keyboard reachable', async ({ page }) => {
  await page.goto('.')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'QR Share' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Scan' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Text to share')).toBeFocused()

  const githubLink = page.getByRole('link', { name: 'View source on GitHub' })
  const themeToggle = page.getByRole('button', { name: /Switch to .* mode/ })

  for (let step = 0; step < 6; step += 1) {
    if (
      await githubLink.evaluate((element) => element === document.activeElement)
    ) {
      break
    }

    await page.keyboard.press('Tab')
  }

  await expect(githubLink).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(themeToggle).toBeFocused()
})
