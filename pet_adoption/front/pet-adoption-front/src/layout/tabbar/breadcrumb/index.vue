<template>
  <!-- 左侧图标 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <!-- 注册面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示路由名字与标题 -->
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <!--图标 -->
      <!-- <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon> -->
      <!--面包屑展示匹配路由的标题-->
      <span style="margin: 0 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts" name="Breadcrumb">
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'
//获取layout配置相关的仓库
let LayoutSettingStore = useLayoutSettingStore()
//获取路由对象
let $route = useRoute()
//点击图标的方法
const changeIcon = () => {
  //图标进行切换
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
</script>

<style scoped lang="scss"></style>
