import Vue from 'vue'
import Router from 'vue-router'
// import Spaces from '../views/privateSpace/Spaces'
// import Folders from '../views/privateSpace/Folders'
// import Photos from '../views/privateSpace/Photos'
// import ProductDetail from '../views/products/ProductDetail'
// import Report from '../views/report/Report'
// import PersonCarte from '../views/carte/PersonCarte'
// import EnterpriseCarte from '../views/carte/EnterpriseCarte'
// import ComityCarte from '../views/carte/ComityCarte'
// import EnterpriseDetail from '../views/carte/EnterpriseDetail'
// import Login from '../views/user/Login'
// import Register from '../views/user/Register'
// import Protocol from '../views/user/Protocol'
// import Home from '../views/home/Home'
// import Download from '../views/download/Download'
// import See from '../views/home/See'
// import Mine from '../views/user/Mine'
// import ChangePassword from '../views/user/ChangePassword'
// import SearchEnterprise from '../views/home/SearchEnterprise'
// import ForgetPassword from '../views/user/ForgetPassword'
// import SetNewPassword from '../views/user/SetNewPassword'
// import RegisterNext from '../views/user/RegisterNext'
// import InformationFolders from '../views/carte/InformationFolders'
// import EmptyEnterpriseCarte from '../views/carte/EmptyEnterpriseCarte'
// import ReportExpired from '../views/report/ReportExpired'
// import BeforeRegister from '../views/user/BeforeRegister'
// import SetPassword from '../views/user/SetPassword'
// import Chat from '../views/chat/Chat'
// import Maps from '../views/map/Maps'
// import Favorites from '../views/home/Favorites'
// import ShoppingCart from '../views/home/ShoppingCart'
// import Conversation from '../views/home/Conversation'
// import SearchProducts from '../views/home/SearchProducts'
const Spaces = resolve => require(['../views/privateSpace/Spaces'], resolve)
const Folders = resolve => require(['../views/privateSpace/Folders'], resolve)
const Photos = resolve => require(['../views/privateSpace/Photos'], resolve)
const ProductDetail = resolve => require(['../views/products/ProductDetail'], resolve)
const Report = resolve => require(['../views/report/Report'], resolve)
const PersonCarte = resolve => require(['../views/carte/PersonCarte'], resolve)
const EnterpriseCarte = resolve => require(['../views/carte/EnterpriseCarte'], resolve)
const ComityCarte = resolve => require(['../views/carte/ComityCarte'], resolve)
const EnterpriseDetail = resolve => require(['../views/carte/EnterpriseDetail'], resolve)
const Login = resolve => require(['../views/user/Login'], resolve)
const Register = resolve => require(['../views/user/Register'], resolve)
const Protocol = resolve => require(['../views/user/Protocol'], resolve)
const Home = resolve => require(['../views/home/Home'], resolve)
const Download = resolve => require(['../views/download/Download'], resolve)
const See = resolve => require(['../views/home/See'], resolve)
const Mine = resolve => require(['../views/user/Mine'], resolve)
const ChangePassword = resolve => require(['../views/user/ChangePassword'], resolve)
const SearchEnterprise = resolve => require(['../views/home/SearchEnterprise'], resolve)
const ForgetPassword = resolve => require(['../views/user/ForgetPassword'], resolve)
const SetNewPassword = resolve => require(['../views/user/SetNewPassword'], resolve)
const RegisterNext = resolve => require(['../views/user/RegisterNext'], resolve)
const InformationFolders = resolve => require(['../views/carte/InformationFolders'], resolve)
const EmptyEnterpriseCarte = resolve => require(['../views/carte/EmptyEnterpriseCarte'], resolve)
const ReportExpired = resolve => require(['../views/report/ReportExpired'], resolve)
const BeforeRegister = resolve => require(['../views/user/BeforeRegister'], resolve)
const SetPassword = resolve => require(['../views/user/SetPassword'], resolve)
const Chat = resolve => require(['../views/chat/Chat'], resolve)
const Maps = resolve => require(['../views/map/Maps'], resolve)
const Favorites = resolve => require(['../views/home/Favorites'], resolve)
const ShoppingCart = resolve => require(['../views/home/ShoppingCart'], resolve)
const Conversation = resolve => require(['../views/home/Conversation'], resolve)
const SearchProducts = resolve => require(['../views/home/SearchProducts'], resolve)

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
      path: '/enterprisedetails/:id',
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
          path: 'see',
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
      path: '/registernext/:mobile',
      name: 'RegisterNext',
      component: RegisterNext
    }, {
      path: '/informationfolders/:id',
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
    }, {
      path: '/favorites',
      name: 'Favorites',
      component: Favorites
    }, {
      path: '/shoppingcart',
      name: 'ShoppingCart',
      component: ShoppingCart
    }, {
      path: '/conversation',
      name: 'Conversation',
      component: Conversation
    }, {
      path: '/searchproducts',
      name: 'SearchProducts',
      component: SearchProducts
    }
  ]
})
