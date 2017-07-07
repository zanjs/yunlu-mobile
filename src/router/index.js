import Vue from 'vue'
import Router from 'vue-router'
import Spaces from '../views/privateSpace/Spaces'
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
import ChangePassword from '../views/user/ChangePassword'
import SearchEnterprise from '../views/home/SearchEnterprise'
import ForgetPassword from '../views/user/ForgetPassword'
import SetNewPassword from '../views/user/SetNewPassword'
import RegisterNext from '../views/user/RegisterNext'
import InformationFolders from '../views/carte/InformationFolders'
import EmptyEnterpriseCarte from '../views/carte/EmptyEnterpriseCarte'
import ReportExpired from '../views/report/ReportExpired'
import BeforeRegister from '../views/user/BeforeRegister'
import SetPassword from '../views/user/SetPassword'
import Chat from '../views/chat/Chat'
import Maps from '../views/map/Maps'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/photos/:id',
      name: 'Photos',
      component: Photos
    }, {
      path: '/products/:id',
      name: 'ProductDetail',
      component: ProductDetail
    }, {
      path: '/report',
      name: 'Report',
      component: Report
    }, {
      path: '/users/:user_id',
      name: 'PersonCarte',
      component: PersonCarte
    }, {
      path: '/users/:user_id/spaces/:space_id',
      name: 'Spaces',
      component: Spaces
    }, {
      path: '/users/:user_id/folders/:id',
      name: 'Folders',
      component: Folders
    }, {
      path: '/enterprises/:id',
      name: 'EnterpriseCarte',
      component: EnterpriseCarte
    }, {
      path: '/associations/:id',
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
      path: '/',
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
    }, {
      path: '/changepassword',
      name: 'ChangePassword',
      component: ChangePassword
    }, {
      path: '/searchenterprises',
      name: 'SearchEnterprise',
      component: SearchEnterprise
    }, {
      path: '/forgetpassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    }, {
      path: '/setnewpassword',
      name: 'SetNewPassword',
      component: SetNewPassword
    }, {
      path: '/registernext',
      name: 'RegisterNext',
      component: RegisterNext
    }, {
      path: '/informationfolders',
      name: 'InformationFolders',
      component: InformationFolders
    }, {
      path: '/emptyenterprisecarte',
      name: 'EmptyEnterpriseCarte',
      component: EmptyEnterpriseCarte
    }, {
      path: '/reportexpired',
      name: 'ReportExpired',
      component: ReportExpired
    }, {
      path: '/beforeregister',
      name: 'BeforeRegister',
      component: BeforeRegister
    }, {
      path: '/setpassword',
      name: 'SetPassword',
      component: SetPassword
    }, {
      path: '/chat',
      name: 'Chat',
      component: Chat
    }, {
      path: '/maps',
      name: 'Maps',
      component: Maps
    }
  ]
})
