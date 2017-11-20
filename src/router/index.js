import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
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
const Chat = resolve => require(['../views/chat/Chat'], resolve)
const Maps = resolve => require(['../views/map/Maps'], resolve)
const Favorites = resolve => require(['../views/home/Favorites'], resolve)
const ShoppingCart = resolve => require(['../views/home/ShoppingCart'], resolve)
const Conversation = resolve => require(['../views/home/Conversation'], resolve)
const SearchProducts = resolve => require(['../views/home/SearchProducts'], resolve)
const Help = resolve => require(['../views/user/Help'], resolve)
const HelpDetail = resolve => require(['../views/user/HelpDetail'], resolve)
const Alumni = resolve => require(['../views/carte/Alumni'], resolve)
const Class = resolve => require(['../views/carte/Class'], resolve)
const MallBackUp = resolve => require(['../views/carte/MallBackUp'], resolve)
const Mall = resolve => require(['../views/carte/Mall'], resolve)
const AddAddress = resolve => require(['../views/products/AddAddress'], resolve)
const OrderPaying = resolve => require(['../views/products/OrderPaying'], resolve)
const OrderForm = resolve => require(['../views/home/OrderForm'], resolve)
const OrderDetail = resolve => require(['../views/home/OrderDetail'], resolve)
const Trace = resolve => require(['../views/products/Trace'], resolve)
const Address = resolve => require(['../views/products/Address'], resolve)
const Pay = resolve => require(['../views/products/Pay'], resolve)
const Categories = resolve => require(['../views/products/Categories'], resolve)
const CategoryProducts = resolve => require(['../views/products/CategoryProducts'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/photos/:id',
      name: 'Photos',
      component: Photos,
      props: true,
      meta: { keepAlive: true }
    }, {
      path: '/products/:id',
      name: 'ProductDetail',
      component: ProductDetail,
      props: true,
      meta: { keepAlive: false }
    }, {
      path: '/report',
      name: 'Report',
      component: Report,
      meta: { keepAlive: false }
    }, {
      path: '/card',
      name: 'Card',
      component: PersonCarte,
      meta: { keepAlive: true }
    }, {
      path: '/users/:user_id',
      name: 'PersonCarte',
      component: PersonCarte,
      props: true,
      meta: { keepAlive: true }
    }, {
      path: '/zone',
      name: 'Zone',
      component: Spaces,
      meta: { keepAlive: true }
    }, {
      path: '/users/:user_id/spaces/:space_id',
      name: 'Spaces',
      component: Spaces,
      meta: { keepAlive: true }
    }, {
      path: '/photos',
      name: 'FoldersPhotos',
      component: Folders,
      meta: { keepAlive: true }
    }, {
      path: '/users/:user_id/folders/:id',
      name: 'Folders',
      component: Folders,
      meta: { keepAlive: true }
    }, {
      path: '/enterprises/:id',
      name: 'EnterpriseCarte',
      component: EnterpriseCarte,
      props: true,
      meta: { keepAlive: true }
    }, {
      path: '/associations/:id',
      name: 'ComityCarte',
      component: ComityCarte,
      props: true,
      meta: { keepAlive: true }
    }, {
      path: '/malls_back_up/:id',
      name: 'MallBackUp',
      component: MallBackUp,
      props: true,
      meta: { keepAlive: true }
    }, {
      path: '/malls/:id',
      name: 'Mall',
      component: Mall,
      props: true,
      meta: { keepAlive: true }
    }, {
      path: '/enterprisedetails/:id',
      name: 'EnterpriseDetail',
      component: EnterpriseDetail,
      meta: { keepAlive: true }
    }, {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { keepAlive: true }
    }, {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { keepAlive: false }
    }, {
      path: '/protocl',
      name: 'Protocol',
      component: Protocol,
      meta: { keepAlive: true }
    }, {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'see',
          component: See,
          name: 'See',
          meta: { keepAlive: false }
        }
      ]
    }, {
      path: '/download',
      name: 'Download',
      component: Download,
      meta: { keepAlive: true }
    }, {
      path: '/mine',
      name: 'Mine',
      component: Mine,
      meta: { keepAlive: true }
    }, {
      path: '/changepassword',
      name: 'ChangePassword',
      component: ChangePassword,
      meta: { keepAlive: false }
    }, {
      path: '/searchenterprises',
      name: 'SearchEnterprise',
      component: SearchEnterprise,
      meta: { keepAlive: true }
    }, {
      path: '/forgetpassword',
      name: 'ForgetPassword',
      component: ForgetPassword,
      meta: { keepAlive: false }
    }, {
      path: '/setnewpassword',
      name: 'SetNewPassword',
      component: SetNewPassword,
      meta: { keepAlive: false }
    }, {
      path: '/registernext/:mobile',
      name: 'RegisterNext',
      component: RegisterNext,
      meta: { keepAlive: false }
    }, {
      path: '/informationfolders/:id',
      name: 'InformationFolders',
      component: InformationFolders,
      meta: { keepAlive: false }
    }, {
      path: '/emptyenterprisecarte',
      name: 'EmptyEnterpriseCarte',
      component: EmptyEnterpriseCarte,
      meta: { keepAlive: true }
    }, {
      path: '/reportexpired',
      name: 'ReportExpired',
      component: ReportExpired,
      meta: { keepAlive: true }
    }, {
      path: '/beforeregister',
      name: 'BeforeRegister',
      component: BeforeRegister,
      meta: { keepAlive: false }
    }, {
      path: '/chat',
      name: 'Chat',
      component: Chat,
      meta: { keepAlive: false }
    }, {
      path: '/maps',
      name: 'Maps',
      component: Maps,
      meta: { keepAlive: false }
    }, {
      path: '/favorites',
      name: 'Favorites',
      component: Favorites,
      meta: { keepAlive: true }
    }, {
      path: '/shoppingcart',
      name: 'ShoppingCart',
      component: ShoppingCart,
      meta: { keepAlive: false }
    }, {
      path: '/conversation',
      name: 'Conversation',
      component: Conversation,
      meta: { keepAlive: true }
    }, {
      path: '/orderform',
      name: 'OrderForm',
      component: OrderForm,
      meta: { keepAlive: true }
    }, {
      path: '/orderdetail/:id',
      name: 'OrderDetail',
      component: OrderDetail,
      meta: { keepAlive: false }
    }, {
      path: '/searchproducts',
      name: 'SearchProducts',
      component: SearchProducts,
      meta: { keepAlive: true }
    }, {
      path: '/help',
      name: 'Help',
      component: Help,
      meta: { keepAlive: false }
    }, {
      path: '/helps/:id',
      name: 'HelpDetail',
      component: HelpDetail,
      meta: { keepAlive: false }
    }, {
      path: '/alumnis/:id',
      name: 'Alumni',
      component: Alumni,
      props: true,
      meta: { keepAlive: true }
    }, {
      path: '/classes/:id',
      name: 'Class',
      component: Class,
      props: true,
      meta: { keepAlive: true }
    }, {
      path: '/addaddress',
      name: 'AddAddress',
      component: AddAddress,
      meta: { keepAlive: false }
    }, {
      path: '/orderpaying',
      name: 'OrderPaying',
      component: OrderPaying,
      meta: { keepAlive: false }
    }, {
      path: '/trace/:id',
      name: 'Trace',
      component: Trace,
      meta: { keepAlive: false }
    }, {
      path: '/address',
      name: 'Address',
      component: Address,
      meta: { keepAlive: false }
    }, {
      path: '/pay',
      name: 'Pay',
      component: Pay,
      meta: { keepAlive: false }
    }, {
      path: '/categories',
      name: 'Categories',
      component: Categories,
      meta: { keepAlive: true }
    }, {
      path: '/category_products/:id',
      name: 'CategoryProducts',
      component: CategoryProducts,
      props: true,
      meta: { keepAlive: true }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    store.dispatch('routeChange', {savedPosition, from, to})
  }
})
