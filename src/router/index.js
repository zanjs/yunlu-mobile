import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Space from '../views/privateSpace/Space'
import Folders from '../views/privateSpace/Folders'
import Photos from '../views/privateSpace/Photos'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }, {
      path: '/space',
      component: Space
    }, {
      path: '/folders',
      component: Folders
    }, {
      path: '/photos',
      component: Photos
    }
  ]
})
