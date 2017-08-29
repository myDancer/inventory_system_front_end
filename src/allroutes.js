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

let adminroutes = [
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
    },
    {
        path: '/',
        component: Home,
        name: '进销存管理',
        iconCls: 'el-icon-menu',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/changePower', component: ChangePower, name: '权限设置' },
            { path: '/unit', component: Unit, name: '计量单位' },
            { path: '/cityPicker', component: cityPicker, name: '城市选择器' },
            { path: '/category1', component: Category1, name: '商品类别' },
            { path: '/commodity', component: Commodity, name: '商品管理' },
            { path: '/storage', component: Storage, name: '仓库管理' },
            { path: '/customer', component: Customer, name: '客户管理' },
            { path: '/supplier', component: Supplier, name: '供应商管理' },
        ]
    },
    {
        path: '/caigou',
        component: Home,
        name: '采购管理',
        iconCls: 'fa fa-id-card-o',
        leaf: true,//只有一个节点
        children: [
            { path: '/rukudetail', component: Rukudetail, name: '采购管理' },
        ]
    },
    {
        path: '/xiaoshou',
        component: Home,
        name: '销售管理',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/chuku', component: Chuku, name: '销售管理' }
        ]
    },
    {
        path: '/kucun',
        component: Home,
        name: '库存管理',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/stock', component: Stock, name: '库存管理' }
        ]
    },
    {
        path: '/zhangwu',
        component: Home,
        name: '账务管理',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/account', component: Account, name: '账务管理' }
        ]
    }
];
let caigouroutes = [
    {
        path: '/caigou',
        component: Home,
        name: '采购管理',
        iconCls: 'fa fa-id-card-o',
        leaf: true,//只有一个节点
        children: [
            { path: '/rukudetail', component: Rukudetail, name: '采购管理' },
        ]
    },
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
let xiaoshouroutes = [
    {
        path: '/xiaoshou',
        component: Home,
        name: '销售管理',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/chuku', component: Chuku, name: '销售管理' }
        ]
    },
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
let kucunroutes = [
    {
        path: '/kucun',
        component: Home,
        name: '库存管理',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/stock', component: Stock, name: '库存管理' }
        ]
    },
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
let zhangwuroutes = [
    {
        path: '/zhangwu',
        component: Home,
        name: '账务管理',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/account', component: Account, name: '账务管理' }
        ]
    },
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
let allroutes = {adminroutes,caigouroutes,xiaoshouroutes,kucunroutes,zhangwuroutes}
export default allroutes;