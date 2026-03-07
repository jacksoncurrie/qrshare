import { mount } from '@vue/test-utils'
import CreateView from '@/views/CreateView.vue'

const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="typeof to === \'string\' ? to : to?.path"><slot /></a>',
}

describe('CreateView', () => {
  it('disables generate for empty input', () => {
    const wrapper = mount(CreateView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          QrCodePanel: { template: '<div />' },
        },
      },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('shows warning and blocks oversized payloads', async () => {
    const wrapper = mount(CreateView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          QrCodePanel: { template: '<div />' },
        },
      },
    })

    await wrapper.get('#payload-input').setValue('a'.repeat(500))
    expect(wrapper.text()).toContain('may be harder to scan')

    await wrapper.get('#payload-input').setValue('a'.repeat(801))
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('generates a link for valid input', async () => {
    const wrapper = mount(CreateView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          QrCodePanel: { template: '<div />' },
        },
      },
    })

    await wrapper.get('#payload-input').setValue('hello world')
    await wrapper.get('button').trigger('click')

    expect(
      (wrapper.get('#generated-link').element as HTMLInputElement).value,
    ).toContain('/view#v1.p.')
  })
})
