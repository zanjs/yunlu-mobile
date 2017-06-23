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
import Login from '../views/user/Login'
import Register from '../views/user/Register'
import Protocol from '../views/user/Protocol'
import Home from '../views/home/Home'
import Download from '../views/download/Download'
import See from '../views/home/See'
import Mine from '../views/user/Mine'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }, {
      path: '/space',
      name: 'Space',
      component: Space
    }, {
      path: '/folders',
      name: 'Folders',
      component: Folders
    }, {
      path: '/photos',
      name: 'Photos',
      component: Photos
    }, {
      path: '/productdetail',
      name: 'ProductDetail',
      component: ProductDetail
    }, {
      path: '/report',
      name: 'Report',
      component: Report
    }, {
      path: '/personcarte',
      name: 'PersonCarte',
      component: PersonCarte
    }, {
      path: '/enterprisecarte',
      name: 'EnterpriseCarte',
      component: EnterpriseCarte
    }, {
      path: '/comitycarte',
      name: 'ComityCarte',
      component: ComityCarte
    }, {
      path: '/enterprisedetail',
      name: 'EnterpriseDetail',
      component: EnterpriseDetail
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/register',
      name: 'Register',
      component: Register
    }, {
      path: '/protocl',
      name: 'Protocol',
      component: Protocol
    }, {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/see',
          component: See,
          name: 'See'
        }
      ]
    }, {
      path: '/download',
      name: 'Download',
      component: Download
    }, {
      path: '/mine',
      name: 'Mine',
      component: Mine
    }
  ]
})
