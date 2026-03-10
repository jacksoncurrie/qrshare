import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import ScanView from '@/views/ScanView.vue'

const CameraScannerStub = defineComponent({
  name: 'CameraScanner',
  emits: ['decoded'],
  template: '<div class="camera-scanner-stub" />',
})

async function mountScanView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/scan', component: ScanView },
      { path: '/view', component: { template: '<div>View</div>' } },
    ],
  })

  router.push('/scan')
  await router.isReady()

  const wrapper = mount(ScanView, {
    global: {
      plugins: [router],
      stubs: {
        CameraScanner: CameraScannerStub,
      },
    },
  })

  return { wrapper, router }
}

describe('ScanView', () => {
  it('shows an error when the scanned content is not a QR Share payload', async () => {
    const { wrapper, router } = await mountScanView()

    wrapper
      .getComponent(CameraScannerStub)
      .vm.$emit('decoded', 'https://example.com/not-qr-share')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain(
      'This QR code is not a QR Share link or payload.',
    )
    expect(router.currentRoute.value.path).toBe('/scan')
  })
})
