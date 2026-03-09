import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import ViewPayloadView from '@/views/ViewPayloadView.vue'
import { encodePayload } from '@/lib/payload'

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/view', component: ViewPayloadView }],
  })

  router.push('/view')
  await router.isReady()

  return mount(ViewPayloadView, {
    global: {
      plugins: [router],
      stubs: {
        RouterLink: { template: '<a><slot /></a>' },
      },
    },
  })
}

describe('ViewPayloadView', () => {
  it('decodes a valid hash payload on mount', async () => {
    const encoded = encodePayload('decoded here')
    window.location.hash = `#${encoded.encodedPayload}`
    const wrapper = await mountView()

    await wrapper.vm.$nextTick()
    expect(
      (
        wrapper.get('textarea[aria-label="Decoded text"]')
          .element as HTMLTextAreaElement
      ).value,
    ).toBe('decoded here')
  })

  it('shows an error for an invalid payload', async () => {
    window.location.hash = '#v1.p.bad*payload'
    const wrapper = await mountView()

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('could not decode that payload')
  })

  it('shows a message when the payload is missing', async () => {
    window.location.hash = ''
    const wrapper = await mountView()

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No QR Share payload was found')
  })
})
