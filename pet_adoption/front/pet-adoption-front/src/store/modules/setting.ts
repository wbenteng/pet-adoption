//layout组件相关配置小仓库
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用于控制菜单折叠还是收起
      refresh: false, //用于控制刷新效果
    }
  },
})

export default useLayoutSettingStore
