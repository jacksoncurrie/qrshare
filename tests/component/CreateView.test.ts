import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { encodePayload } from '@/lib/payload'
import { buildShareUrl, normalizeDirectUrl } from '@/lib/share-url'
import CreateView from '@/views/CreateView.vue'

const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="typeof to === \'string\' ? to : to?.path"><slot /></a>',
}

const QrCodePanelStub = defineComponent({
  name: 'QrCodePanel',
  props: {
    value: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: '',
    },
    bare: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: '',
    },
  },
  template: '<div class="qr-code-panel-stub" />',
})

function mountCreateView() {
  return mount(CreateView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        QrCodePanel: QrCodePanelStub,
      },
    },
  })
}

describe('CreateView', () => {
  function getCopyButton(wrapper: ReturnType<typeof mountCreateView>) {
    return wrapper.get('button[aria-label="Copy link"]')
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the link empty for empty input', () => {
    const wrapper = mountCreateView()

    expect(wrapper.getComponent(QrCodePanelStub).props('value')).toBe('')
    expect(getCopyButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('shows an error for oversized payloads', async () => {
    const wrapper = mountCreateView()

    await wrapper.get('#payload-input').setValue('a'.repeat(801))
    vi.advanceTimersByTime(120)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Text is too large to generate QR code.')
    expect(wrapper.getComponent(QrCodePanelStub).props('value')).toBe('')
    expect(getCopyButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('generates the share url automatically for valid input', async () => {
    const wrapper = mountCreateView()

    await wrapper.get('#payload-input').setValue('hello world')
    vi.advanceTimersByTime(120)
    await wrapper.vm.$nextTick()

    const expectedUrl = buildShareUrl(
      encodePayload('hello world').encodedPayload,
    )

    expect(wrapper.getComponent(QrCodePanelStub).props('value')).toBe(
      expectedUrl,
    )
    expect(getCopyButton(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('switches to url mode and generates a direct url qr target', async () => {
    const wrapper = mountCreateView()

    await wrapper.get('button[aria-pressed="false"]').trigger('click')
    await wrapper.get('#payload-input').setValue('https://example.com/docs')
    vi.advanceTimersByTime(120)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('textarea').attributes('aria-label')).toBe(
      'URL to share',
    )
    expect(wrapper.getComponent(QrCodePanelStub).props('value')).toBe(
      normalizeDirectUrl('https://example.com/docs'),
    )
    expect(getCopyButton(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('shows an error for an invalid direct url', async () => {
    const wrapper = mountCreateView()

    await wrapper.get('button[aria-pressed="false"]').trigger('click')
    await wrapper.get('#payload-input').setValue('example.com without scheme')
    vi.advanceTimersByTime(120)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain(
      'Enter a valid URL including http:// or https://.',
    )
    expect(wrapper.getComponent(QrCodePanelStub).props('value')).toBe('')
    expect(getCopyButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('keeps the current textbox value visible when switching modes', async () => {
    const wrapper = mountCreateView()

    await wrapper.get('#payload-input').setValue('https://example.com/docs')
    await wrapper.get('button[aria-pressed="false"]').trigger('click')

    expect(
      (wrapper.get('#payload-input').element as HTMLTextAreaElement).value,
    ).toBe('https://example.com/docs')
  })
})
