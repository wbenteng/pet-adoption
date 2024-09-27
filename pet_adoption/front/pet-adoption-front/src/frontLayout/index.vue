<template>
  <div class="layout_container">
    <div class="layout_top">
      <FHeader></FHeader>
    </div>
    <div class="layout_main">
      <div class="main">
        <FMain></FMain>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="FLayout">
import FHeader from '@/frontLayout/fheader/index.vue'
import FMain from '@/frontLayout/fMain/index.vue'
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_top {
    width: 100%;
    height: 62px;
    display: flex;
    // flex: 1;
    align-items: center;
    // justify-content: center;
    background: linear-gradient(to right, #c8b4e1, #afd7f7);
    // border-bottom: 1px solid #eee;
  }

  .layout_main {
    background: url(../assets/images/front/bg3.jpg) no-repeat;
    background-size: cover;
    background-attachment: fixed;

    .main {
      width: 840px;
      margin: 0 auto;
      padding: 10px 0;
      opacity: 0.8;
      // height: 1000px;
      // background: #1f4b69;
      min-height: calc(100vh - 62px);
    }
  }
}
</style>