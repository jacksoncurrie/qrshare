export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const helper = document.createElement('textarea')
  helper.value = text
  helper.setAttribute('readonly', '')
  helper.style.position = 'absolute'
  helper.style.left = '-9999px'
  document.body.appendChild(helper)
  helper.select()
  document.execCommand('copy')
  helper.remove()
}
