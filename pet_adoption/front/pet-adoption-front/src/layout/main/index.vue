<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由-->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts" name="Main">
  import { nextTick, ref, watch } from 'vue'
  //引入lagout组件小仓库
  import useLayoutSettingStore from '@/store/modules/setting'
  let layoutSettingStore = useLayoutSettingStore()
  //控制当前组件是否销毁重建
  let flag = ref(true)
  //监听refresh属性是否发生变化
  watch(
    () => layoutSettingStore.refresh,
    () => {
      //刷新：路由组件销毁
      flag.value = false
      nextTick(() => {
        flag.value = true
      })
    },
  )
</script>

<style scoped>
  .fade-enter-from {
    opacity: 0;
    transform: scale(0);
  }
  .fade-enter-active {
    transition: all 0.3s;
  }
  .fade-enter-to {
    opacity: 1;
    transform: scale(1);
  }
</style>
