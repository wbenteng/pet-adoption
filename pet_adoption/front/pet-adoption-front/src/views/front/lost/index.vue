<template>
  <div class="container">
    <div class="top">
      <el-input v-model="keyword" style="width: 400px" size="large"></el-input>
      <el-button type="primary" size="large" style="margin-left: 20px" @click="search">搜索</el-button>
      <el-button type="primary" size="large" style="margin-left: 20px"
        @click="settingStore.refresh = !settingStore.refresh">重置</el-button>
    </div>
    <el-table :data="tableData" style="border-radius: 10px;margin-bottom: 10px;">
      <el-table-column align="center" prop="nickname" label="走失宠物名字"></el-table-column>
      <el-table-column align="center" prop="type" label="种类"></el-table-column>
      <el-table-column align="center" prop="sex" label="性别"></el-table-column>
      <el-table-column align="center" prop="person" label="联系人"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
      <el-table-column align="center" prop="status1" label="已丢失/带领回"></el-table-column>
      <el-table-column align="center" prop="status2" label="找回状态"></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
        :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
        @current-change="getHasLost" @size-change="sizeHandler" />
    </div>
  </div>
</template>

<script setup lang="ts" name="FRescue">
import { onMounted, ref } from 'vue';
import { reqSearchLost } from '@/api/lost';
//引入lagout组件小仓库
import useLayoutSettingStore from '@/store/modules/setting'
let settingStore = useLayoutSettingStore()
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//收集丢失宠物搜索关键字
let keyword = ref<string>('')
//存储全部丢失宠物数据
let tableData = ref([])
//获取全部丢失宠物数据
const getHasLost = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchLost({
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
  getHasLost()
})
const sizeHandler = () => {
  getHasLost()
}
const search = () => {
  getHasLost()
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