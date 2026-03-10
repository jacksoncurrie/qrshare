import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { encodePayload } from '@/lib/payload'
import { buildShareUrl } from '@/lib/share-url'
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
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the link empty for empty input', () => {
    const wrapper = mountCreateView()

    expect(wrapper.getComponent(QrCodePanelStub).props('value')).toBe('')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('shows an error for oversized payloads', async () => {
    const wrapper = mountCreateView()

    await wrapper.get('#payload-input').setValue('a'.repeat(801))
    vi.advanceTimersByTime(120)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Text is too large to generate QR code.')
    expect(wrapper.getComponent(QrCodePanelStub).props('value')).toBe('')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
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
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
  })
})
