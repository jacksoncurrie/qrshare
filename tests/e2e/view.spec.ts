import { expect, test } from '@playwright/test'

test('generated payload opens in view mode', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('.')
  await page.getByLabel('Text to share').fill('copied text payload')

  const qr = page.getByAltText('QR code for opening the shared text in QR Share')
  await expect(qr).toBeVisible()

  await page.getByRole('button', { name: 'Copy link' }).click()
  const shareUrl = await page.evaluate(() => navigator.clipboard.readText())
  await expect(shareUrl).toMatch(/\/view#v1\.p\./)

  const shareHash = new URL(shareUrl).hash
  await page.evaluate((hash) => {
    window.history.pushState(
      {},
      '',
      `${window.location.pathname.replace(/create$/u, 'view')}${hash}`,
    )
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, shareHash)

  await expect(page.getByLabel('Decoded text')).toHaveValue(
    'copied text payload',
  )

  await page.getByRole('button', { name: 'Copy text' }).click()
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
})

test('invalid payload shows a helpful error', async ({ page }) => {
  await page.goto('./view#v1.p.bad*payload')
  await expect(
    page.getByText('This QR Share payload is corrupted or incomplete.'),
  ).toBeVisible()
})
