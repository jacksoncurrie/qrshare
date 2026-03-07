import { mount } from '@vue/test-utils'
import CopyButton from '@/components/CopyButton.vue'

describe('CopyButton', () => {
  it('updates the label after copying', async () => {
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
