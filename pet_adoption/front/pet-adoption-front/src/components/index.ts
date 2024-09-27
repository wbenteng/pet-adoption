//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
// import Category from './Category/index.vue'
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const allGlobalComponent: any = { SvgIcon, }
export default {
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key])
    })
    //将element-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
