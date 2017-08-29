import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import ChangePower from './pages/nav1/changePower.vue'
import Unit from './pages/nav1/unit.vue'
import Category from './pages/nav1/category.vue'
import Category1 from './pages/nav1/category1.vue'
import Commodity from './pages/nav1/commodity.vue'
import Storage from './pages/nav1/storage.vue'
import Supplier from './pages/nav1/supplier.vue'
import Customer from './pages/nav1/customer.vue'
import Rukudetail from './pages/nav2/rukudetail.vue'
import Chuku from './pages/nav3/chuku.vue'
import Stock from './pages/nav4/stock.vue'
import Account from './pages/nav5/account.vue'
import echarts from './pages/charts/echarts.vue'
import accountCharts from './pages/charts/accountCharts.vue'
import cityPicker from './component/cityPicker.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '统计分析',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/accountCharts', component: accountCharts, name: '账务分析' },
            { path: '/echarts', component: echarts, name: 'echarts' }]
    }
]

export default routes;