<template>
  <div class="tabbar">
    <!-- 顶部左侧静态 -->
    <div class="tabbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts" name="Tabbar">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<style scoped lang="scss">
  .tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-image: linear-gradient(to right, #afd7f7, #c8b4e1);
    .tabbar_left {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }

    .tabbar_right {
      display: flex;
      align-items: center;
    }
  }
</style>
