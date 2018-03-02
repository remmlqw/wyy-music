// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
//1. 定义（路由）组件。
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
import './common/stylus/index.styl'

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.config.productionTip = false;

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
 {path: '/', component: goods},
 {path: '/goods', component: goods},
 {path: '/ratings', component: ratings},
 {path: '/seller', component: seller}
];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
	linkActiveClass:'active',//全局配置 <router-link> 的默认『激活 class 类名』
  routes
});

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
new Vue({
  router,
  //components: { App }  vue1.0的写法
  render:h=>h(App)			//vue2.0的写法
}).$mount('#app');

//render函数是渲染一个视图，然后提供给el挂载，如果没有render那页面什么都不会出来


/*

vue.2.0的渲染过程：

1.首先需要了解这是 es 6 的语法，表示 Vue 实例选项对象的 render 方法作为一个函数，接受传入的参数 h 函数，返回 h(App) 的函数调用结果。

2.其次，Vue 在创建 Vue 实例时，通过调用 render 方法来渲染实例的 DOM 树。

3.最后，Vue 在调用 render 方法时，会传入一个 createElement 函数作为参数，也就是这里的 h 的实参是 createElement 函数，然后 createElement 会以 APP 为参数进行调用，关于 createElement 函数的参数说明参见：Element-Arguments

结合一下官方文档的代码便可以很清晰的了解Vue2.0 render:h => h(App)的渲染过程。

 render: function (createElement) {
     return createElement(
       'h' + this.level,   // tag name 标签名称
       this.$slots.default // 子组件中的阵列
     )
   }

*/

//router.go('/goods');
//router.push('/goods');  -- vue2.0