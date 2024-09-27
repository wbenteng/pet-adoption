<template>
  <div class="container">
    <div class="top">
      <el-input v-model="keyword" style="width: 400px" size="large"></el-input>
      <el-button type="primary" size="large" style="margin-left: 20px" @click="search">搜索</el-button>
      <el-button type="primary" size="large" style="margin-left: 20px"
        @click="settingStore.refresh = !settingStore.refresh">
        重置
      </el-button>
      <!-- <el-button type="success" size="large" style="margin-left: 30px" @click="addActivity">发布活动</el-button> -->
    </div>

    <div style="margin: 10px 0;">
      <div v-for="item in tableData" style="padding: 20px; border-radius: 10px; background-color: #fff; margin: 10px 0">
        <div style="display: flex">
          <div style="width: 200px;">
            <el-image :src="item.img" style="width: 150px; border-radius: 10px; height: 150px"
              :preview-src-list="[item.img]"></el-image>
          </div>
          <div style="flex: 1;cursor: pointer;line-height: 36px;" @click="view(item)">
            <div style="color: #333;font-size: 22px;font-weight: bold;">
              {{ item.name }}
            </div>
            <div style="margin-top: 20px;font-size: 20px; font-weight: bold; color: #E6A23C;">
              {{ item.time.substr(0, 16) }}
            </div>
            <div style="margin-top: 20px; font-size: 14px">
              <span style="display: flex;align-items: center;">
                <SvgIcon name="place" width="14px" height="14px" style="margin-right: 5px;">
                </SvgIcon>{{ item.address }}
              </span>
              <!-- <span v-if="item.userId === user.id">
                <el-button type="text" style="float: right; font-size: 16px; color: red; margin-left: 10px"
                  @click="del(item.id)">删除</el-button>
                <el-button type="text" style="float: right; font-size: 16px" @click="handleEdit(item)">编辑</el-button>
              </span> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
        :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
        @current-change="getHasActivity" @size-change="sizeHandler" />
    </div>
  </div>
  <!-- 对话框组件:添加|更新宠物活动 -->
  <!-- <el-dialog v-model="dialogFormVisible" width="60%" :title="activityParams.id ? '修改宠物活动' : '添加宠物活动'"
    :close-on-click-modal="false">
    <el-form style="width: 100%" ref="formRef">
      <el-form-item label="标题">
        <el-input v-model="activityParams.name"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <mavon-editor ref="mavonEditorRef" v-model="activityParams.content" :ishljs="true" @imgAdd="imgAdd" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
</el-dialog> -->
  <!-- view查看 -->
  <el-dialog v-model="dialogFormVisible2" width="60%" :title="title">
    <mavon-editor v-model="content" :subfield="false" :defaultOpen="'preview'" :toolbarsFlag="false" :editable="false"
      :scrollStyle="true" :ishljs="true" />
  </el-dialog>
</template>

<script setup lang="ts" name="FActivityKp">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchActivity, reqAddActivity, reqDeleteActivity, reqDeleteBatcbActivity, reqActivityFileUpload } from '@/api/activity';
//引入lagout组件小仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus';
let settingStore = useLayoutSettingStore()
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//收集宠物活动搜索关键字
let keyword = ref<string>('')
//存储全部宠物活动数据
let tableData = ref<any>([])
//收集宠物活动信息的数据
let activityParams = reactive({
  id: '',
  name: '',
  content: '',
})
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
let dialogFormVisible2 = ref<boolean>(false)
//form实例
let formRef = ref<any>()
const mavonEditorRef = ref()
let title = ref('')
let content = ref('')
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
//获取全部已有宠物活动信息
const getHasActivity = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchActivity({
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
const imgAdd = async (pos: any, $file: any) => {
  // 第一步.将图片上传到服务器.
  let formdata = new FormData();
  formdata.append('image', $file);
  let result = await reqActivityFileUpload(formdata)
  let url = result.data;
  mavonEditorRef.value.$img2Url(pos, url);
}
const view = (row: any) => {
  title.value = row.name
  content.value = row.content
  dialogFormVisible2.value = true
}
//添加宠物活动按钮的回调
const addActivity = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(activityParams, {
    id: '',
    name: '',
    content: '',
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有宠物活动按钮的回调
const updateActivity = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(activityParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddActivity(activityParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: activityParams.id ? '更新成功' : '添加成功'
    })
    //获取全部宠物活动
    getHasActivity(activityParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: activityParams.id ? '更新失败' : '添加失败'
    })
  }
}
//删除某一个宠物活动
const deleteActivity = async (petId: number) => {
  let result: any = await reqDeleteActivity(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasActivity(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
onMounted(() => {
  getHasActivity()
})
const sizeHandler = () => {
  getHasActivity()
}
const search = () => {
  getHasActivity()
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