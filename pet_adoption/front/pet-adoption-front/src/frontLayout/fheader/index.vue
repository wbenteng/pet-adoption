<template>
  <div class="left">
    <Logo class="logo"></Logo>
  </div>
  <div class="middle">
    <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal"
      background-color="linear-gradient(to right, #c8b4e1, #afd7f7)" active-text-color="white" router>
      <el-menu-item index="/front/home">首页</el-menu-item>
      <el-menu-item index="/front/adopt">宠物领养</el-menu-item>
      <el-menu-item index="/front/rescue">宠物救助</el-menu-item>
      <el-menu-item index="/front/feed">宠物投喂</el-menu-item>
      <el-menu-item index="/front/lost">宠物丢失</el-menu-item>
      <el-menu-item index="/front/article">宠物论坛</el-menu-item>
      <el-menu-item index="/front/donate">宠物捐赠</el-menu-item>
      <el-menu-item index="/front/articleKp">宠物科普</el-menu-item>
      <el-menu-item index="/front/activity">宠物活动</el-menu-item>
    </el-menu>
  </div>
  <div class="right">
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
        <el-dropdown-item v-if="user.role === 'ROLE_ADMIN'">
          <router-link to="/back/home">后台管理</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/front/person">个人中心</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/front/password">修改密码</router-link>
        </el-dropdown-item>
        <el-dropdown-menu>
          <el-dropdown-item @click="layout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="FHeader">
import Logo from '@/layout/logo/index.vue'
import { ElMessage } from 'element-plus';
//获取路由对象
import { useRoute, useRouter } from 'vue-router'
//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()
//获取本地用户数据
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
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
</script>

<style scoped>
.logo {
  font-weight: bold;
  /* height: 100%; */
  /* display: flex; */
}

.middle {
  display: flex;
  flex: 1;
  /* width: 65%; */
  /* padding-left: 6%; */
  /* justify-content: center; */
  margin-right: 7%;

  .el-menu-demo {
    display: flex;
    flex: 1;
    justify-content: center;
  }
}

.right {
  /* width: 18%; */
  display: flex;
  /* justify-content: flex-end; */
  align-items: center;
}

a {
  text-decoration: none;
  color: black;
}

.router-link-active {
  text-decoration: none;
}

.el-menu--horizontal.el-menu {
  border-bottom: none;
}
</style>