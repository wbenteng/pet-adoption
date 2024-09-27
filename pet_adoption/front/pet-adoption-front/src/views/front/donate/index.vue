<template>
  <div class="container">
    <div class="top">
      <el-input v-model="keyword" style="width: 400px" size="large"></el-input>
      <el-button type="primary" size="large" style="margin-left: 20px" @click="search">搜索</el-button>
      <el-button type="primary" size="large" style="margin-left: 20px"
        @click="settingStore.refresh = !settingStore.refresh">重置</el-button>
    </div>
    <el-table :data="tableData" style="border-radius: 10px;margin-bottom: 10px;">
      <el-table-column align="center" prop="name" label="捐赠人"></el-table-column>
      <el-table-column align="center" prop="goods" label="捐赠物资"></el-table-column>
      <el-table-column align="center" prop="time" label="捐赠时间"></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
        :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
        @current-change="getHasDonate" @size-change="sizeHandler" />
    </div>
  </div>
</template>

<script setup lang="ts" name="FDonate">
import { onMounted, ref } from 'vue';
import { reqSearchDonate } from '@/api/donate';
//引入lagout组件小仓库
import useLayoutSettingStore from '@/store/modules/setting'
let settingStore = useLayoutSettingStore()
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//收集宠物捐赠搜索关键字
let keyword = ref<string>('')
//存储全部宠物捐赠数据
let tableData = ref([])
//获取全部宠物捐赠数据
const getHasDonate = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchDonate({
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      name: keyword.value,
    }
  })
  // console.log(result);
  if (result.code == 200) {
    total.value = result.data.total
    tableData.value = result.data.records
  }
}
onMounted(() => {
  getHasDonate()
})
const sizeHandler = () => {
  getHasDonate()
}
const search = () => {
  getHasDonate()
}
</script>

<style scoped>
.container {
  .top {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    margin: 10px 0
  }

  .pagination {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fff;
    border-radius: 10px;
  }
}
</style>