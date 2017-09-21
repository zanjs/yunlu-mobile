import Vue from 'vue'
import Router from 'vue-router'
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
const Help = resolve => require(['../views/user/Help'], resolve)
const HelpDetail = resolve => require(['../views/user/HelpDetail'], resolve)
const Alumni = resolve => require(['../views/carte/Alumni'], resolve)
const Class = resolve => require(['../views/carte/Class'], resolve)
const Mall = resolve => require(['../views/carte/Mall'], resolve)
const AddAddress = resolve => require(['../views/products/AddAddress'], resolve)
const OrderPaying = resolve => require(['../views/products/OrderPaying'], resolve)
const OrderForm = resolve => require(['../views/home/OrderForm'], resolve)
const OrderDetail = resolve => require(['../views/home/OrderDetail'], resolve)
const Trace = resolve => require(['../views/products/Trace'], resolve)
const Address = resolve => require(['../views/products/Address'], resolve)
const Pay = resolve => require(['../views/products/Pay'], resolve)

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
      path: '/card',
      name: 'Card',
      component: PersonCarte
    }, {
      path: '/users/:user_id',
      name: 'PersonCarte',
      component: PersonCarte
    }, {
      path: '/zone',
      name: 'Zone',
      component: Spaces
    }, {
      path: '/users/:user_id/spaces/:space_id',
      name: 'Spaces',
      component: Spaces
    }, {
      path: '/photos',
      name: 'FoldersPhotos',
      component: Folders
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
      path: '/malls/:id',
      name: 'Mall',
      component: Mall
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
      path: '/orderform',
      name: 'OrderForm',
      component: OrderForm
    }, {
      path: '/orderdetail/:id',
      name: 'OrderDetail',
      component: OrderDetail
    }, {
      path: '/searchproducts',
      name: 'SearchProducts',
      component: SearchProducts
    }, {
      path: '/help',
      name: 'Help',
      component: Help
    }, {
      path: '/helps/:id',
      name: 'HelpDetail',
      component: HelpDetail
    }, {
      path: '/alumnis/:id',
      name: 'Alumni',
      component: Alumni
    }, {
      path: '/classes/:id',
      name: 'Class',
      component: Class
    }, {
      path: '/addaddress',
      name: 'AddAddress',
      component: AddAddress
    }, {
      path: '/orderpaying',
      name: 'OrderPaying',
      component: OrderPaying
    }, {
      path: '/trace/:id',
      name: 'Trace',
      component: Trace
    }, {
      path: '/address',
      name: 'Address',
      component: Address
    }, {
      path: '/pay',
      name: 'Pay',
      component: Pay
    }
  ]
})
