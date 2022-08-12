import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import routes from './router/index.js'
import locale from 'element-ui/lib/locale/lang/en'


ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.use(ElementUI, { locale });
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: routes,
}).$mount('#app')
