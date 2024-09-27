<template>
  <div class="container">
    <el-table :data="tableData" style="border-radius: 10px;margin-bottom: 10px;">
      <el-table-column align="center" label="环境照片">
        <template #default="scope">
          <el-image style="width: 180px; height: 180px" :src="scope.row.img" :preview-src-list="[scope.row.img]"
            preview-teleported>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="地址"></el-table-column>
      <el-table-column align="center" prop="information" label="相关描述"></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
        :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
        @current-change="getHasRescue" @size-change="sizeHandler" />
    </div>
  </div>
</template>

<script setup lang="ts" name="FFeed">
import { onMounted, ref } from 'vue';
import { reqSearchFeed } from '@/api/feed';
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
  let result = await reqSearchFeed({
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
const sizeHandler = () => {
  getHasRescue()
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