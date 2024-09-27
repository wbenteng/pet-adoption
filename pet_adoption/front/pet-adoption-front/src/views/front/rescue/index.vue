<template>
  <div class="container">
    <div class="top">
      <el-input v-model="keyword" style="width: 400px" size="large"></el-input>
      <el-button type="primary" size="large" style="margin-left: 20px" @click="getHasRescue()">搜索</el-button>
      <el-button type="primary" size="large" style="margin-left: 20px"
        @click="settingStore.refresh = !settingStore.refresh">重置</el-button>
    </div>
    <el-table :data="tableData" style="border-radius: 10px;margin-bottom: 10px;">
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="addres" label="地址"></el-table-column>
      <el-table-column align="center" label="图片">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.img" :preview-src-list="[scope.row.img]"
            preview-teleported>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="person" label="联系人"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
      <el-table-column align="center" prop="information" label="相关描述"></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
        :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
        @current-change="getHasRescue" @size-change="getHasRescue()" />
    </div>
  </div>
</template>

<script setup lang="ts" name="FRescue">
import { onMounted, ref } from 'vue';
import { reqSearchRescue } from '@/api/rescue';
//引入lagout组件小仓库
import useLayoutSettingStore from '@/store/modules/setting'
let settingStore = useLayoutSettingStore()
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//收集宠物救助搜索关键字
let keyword = ref<string>('')
//存储全部宠物救助数据
let tableData = ref([])
//获取全部宠物救助数据
const getHasRescue = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchRescue({
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
  getHasRescue()
})
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