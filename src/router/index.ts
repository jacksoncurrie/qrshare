import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_TITLES, ROUTES } from '@/lib/constants'
import NotFoundView from '@/views/NotFoundView.vue'
import CreateView from '@/views/CreateView.vue'
import ScanView from '@/views/ScanView.vue'
import ViewPayloadView from '@/views/ViewPayloadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: ROUTES.create,
    },
    {
      path: ROUTES.create,
      component: CreateView,
      meta: {
        title: ROUTE_TITLES[ROUTES.create],
      },
    },
    {
      path: ROUTES.scan,
      component: ScanView,
      meta: {
        title: ROUTE_TITLES[ROUTES.scan],
        fullscreen: true,
      },
    },
    {
      path: ROUTES.view,
      component: ViewPayloadView,
      meta: {
        title: ROUTE_TITLES[ROUTES.view],
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundView,
      meta: {
        title: ROUTE_TITLES.notFound,
      },
    },
  ],
})

router.afterEach((to) => {
  document.title =
    typeof to.meta.title === 'string'
      ? to.meta.title
      : ROUTE_TITLES[ROUTES.create]
})

export default router
