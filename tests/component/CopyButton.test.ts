import { mount } from '@vue/test-utils'
import CopyButton from '@/components/CopyButton.vue'

describe('CopyButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('disables the button when there is nothing to copy', () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: '',
      },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('updates the label after copying', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })

    const wrapper = mount(CopyButton, {
      props: {
        text: 'hello',
        idleLabel: 'Copy text',
      },
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('Copied')
  })
})
