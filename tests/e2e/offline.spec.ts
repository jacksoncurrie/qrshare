import { expect, test } from '@playwright/test'

test('app shell works offline after first load', async ({ page, context }) => {
  await page.goto('.')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })

  await context.setOffline(true)
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Generate a QR Share link' }),
  ).toBeVisible()

  await page.evaluate(() => {
    window.history.pushState(
      {},
      '',
      `${window.location.pathname.replace(/create$/u, 'view')}#v1.p.b2ZmbGluZSB3b3Jrcw`,
    )
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  await expect(page.getByLabel('Decoded text')).toHaveValue('offline works')
})

test('manifest and service worker are available', async ({ page }) => {
  await page.goto('.')
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1)
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready
    return registration.active?.scriptURL
  })
})
