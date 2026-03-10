import { mount } from '@vue/test-utils'
import CreateView from '@/views/CreateView.vue'

const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="typeof to === \'string\' ? to : to?.path"><slot /></a>',
}

describe('CreateView', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the link empty for empty input', () => {
    const wrapper = mount(CreateView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          QrCodePanel: { template: '<div />' },
        },
      },
    })

    expect(wrapper.find('#generated-link').exists()).toBe(false)
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('shows an error for oversized payloads', async () => {
    const wrapper = mount(CreateView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          QrCodePanel: { template: '<div />' },
        },
      },
    })

    await wrapper.get('#payload-input').setValue('a'.repeat(801))
    vi.advanceTimersByTime(120)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Text is too large to generate QR code.')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('generates a link automatically for valid input', async () => {
    const wrapper = mount(CreateView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          QrCodePanel: { template: '<div />' },
        },
      },
    })

    await wrapper.get('#payload-input').setValue('hello world')
    vi.advanceTimersByTime(120)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
  })
})
