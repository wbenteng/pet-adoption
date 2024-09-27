<template>
  <!-- 右侧按钮 -->
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker size="small" v-model="color" show-alpha :predefine="predefineColors" @change="setColor"
          :teleported="false" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch v-model="dark" size="small" active-icon="MoonNight" inactive-icon="Sunny" inline-prompt
          @change="changDark" />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>

  <!-- 头像 -->
  <img :src="user.avatarUrl" style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%" />
  <!-- 下拉菜单 -->
  <el-dropdown style="margin-right: 20px;">
    <span class="el-dropdown-link">
      {{ user.nickname }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-item>
        <router-link to="/front/home">前台主页</router-link>
      </el-dropdown-item>
      <el-dropdown-menu>
        <el-dropdown-item @click="layout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="Setting">
import { useRouter, useRoute } from 'vue-router'
//引入lagout组件小仓库
import useLayoutSettingStore from '@/store/modules/setting'
let layoutSettingStore = useLayoutSettingStore()
//获取用户相关小仓库
import useUserStore from '@/store/modules/user'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
let userStore = useUserStore()
//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()
//获取本地用户数据
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
// let user = userStore.user
//收集开关的数据
let dark = ref<boolean>(false)
//刷新按钮点击回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
//全屏按钮点击的回调
const fullScreen = () => {
  //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen()
  }
}
//退出登录点击的回调
const layout = async () => {
  // await userStore.userLogout()
  localStorage.removeItem("user")
  localStorage.removeItem("menus")
  // $router.push({ path: '/login', query: { redirect: $route.path } })
  $router.push('/login')
  ElMessage({
    type: 'success',
    message: '退出成功'
  })
}
//颜色组件数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
//switch开关的change事件
const changDark = () => {
  //获取html根节点
  let html = document.documentElement
  //设置dark类名
  dark.value ? html.className = 'dark' : html.className = ''
}
//主题颜色设置
const setColor = () => {
  //通过js修改根节点的样式
  const html = document.documentElement
  // 设置 css 变量.value
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

.router-link-active {
  text-decoration: none;
}
</style>
