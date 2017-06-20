import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Space from '../views/privateSpace/Space'
import Folders from '../views/privateSpace/Folders'
import Photos from '../views/privateSpace/Photos'
import ProductDetail from '../views/products/ProductDetail'
import Report from '../views/report/Report'
import PersonCarte from '../views/carte/PersonCarte'
import EnterpriseCarte from '../views/carte/EnterpriseCarte'
import ComityCarte from '../views/carte/ComityCarte'
import EnterpriseDetail from '../views/carte/EnterpriseDetail'

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
    }, {
      path: '/productdetail',
      component: ProductDetail
    }, {
      path: '/report',
      component: Report
    }, {
      path: '/personcarte',
      component: PersonCarte
    }, {
      path: '/enterprisecarte',
      component: EnterpriseCarte
    }, {
      path: '/comitycarte',
      component: ComityCarte
    }, {
      path: '/enterprisedetail',
      component: EnterpriseDetail
    }
  ]
})
