<template>
  <div class="container">
    <div class="top">
      <el-input v-model="keyword" style="width: 400px" size="large"></el-input>
      <el-button type="primary" size="large" style="margin-left: 20px" @click="search">搜索</el-button>
      <el-button type="primary" size="large" style="margin-left: 20px"
        @click="settingStore.refresh = !settingStore.refresh">
        重置
      </el-button>
      <!-- <el-button type="success" size="large" style="margin-left: 30px" @click="addArticle">发布文章</el-button> -->
    </div>

    <div style="margin: 10px 0;">
      <div v-for="item in tableData" style="padding: 20px; border-radius: 10px; background-color: #fff; margin: 10px 0">
        <div style="display: flex">

          <div style="flex: 1">
            <div style="font-size: 20px; font-weight: bold; color: #1E90FF; cursor: pointer" @click="view(item)">{{
              item.name }}</div>

            <div style="margin-top: 60px; font-size: 14px;display: flex;">
              <span style="display: flex;align-items: center;">
                <SvgIcon name="reading" width="14px" height="14px" style="margin-right: 5px"></SvgIcon>{{ item.read1 }}
              </span>
              <span style="display: flex;align-items: center;">
                <SvgIcon name="time" width="14px" height="14px" style="margin-right: 5px; margin-left: 15px">
                </SvgIcon>
                {{ item.time }}
              </span>
              <!-- <span v-if="item.userId === user.id">
                <el-button type="text" style="float: right; font-size: 16px; color: red; margin-left: 10px"
                  @click="del(item.id)">删除</el-button>
                <el-button type="text" style="float: right; font-size: 16px" @click="handleEdit(item)">编辑</el-button>
              </span> -->
            </div>
          </div>

          <div style="width: 200px; text-align: center">
            <el-image :src="item.img" style="width: 100px; height: 100px" :preview-src-list="[item.img]"></el-image>
          </div>

        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
        :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
        @current-change="getHasArticle" @size-change="sizeHandler" />
    </div>
  </div>
  <!-- 对话框组件:添加|更新科普 -->
  <!-- <el-dialog v-model="dialogFormVisible" width="60%" :title="articleParams.id ? '修改科普' : '添加科普'"
    :close-on-click-modal="false">
    <el-form style="width: 100%" ref="formRef">
      <el-form-item label="标题">
        <el-input v-model="articleParams.name"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <mavon-editor ref="mavonEditorRef" v-model="articleParams.content" :ishljs="true" @imgAdd="imgAdd" />
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

<script setup lang="ts" name="FArticleKp">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchArticlKp, reqAddArticleKp, reqDeleteArticleKp, reqDeleteBatcbArticleKp, reqArticleFileUpload } from '@/api/articleKp';
//引入lagout组件小仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus';
let settingStore = useLayoutSettingStore()
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//收集科普搜索关键字
let keyword = ref<string>('')
//存储全部科普数据
let tableData = ref<any>([])
//收集科普信息的数据
let articleParams = reactive({
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
//获取全部已有科普信息
const getHasArticle = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchArticlKp({
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
  let result = await reqArticleFileUpload(formdata)
  let url = result.data;
  mavonEditorRef.value.$img2Url(pos, url);
}
const view = (row: any) => {
  title.value = row.name
  content.value = row.content
  dialogFormVisible2.value = true
}
//添加科普按钮的回调
const addArticle = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(articleParams, {
    id: '',
    name: '',
    content: '',
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有科普按钮的回调
const updateArticle = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(articleParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddArticleKp(articleParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: articleParams.id ? '更新成功' : '添加成功'
    })
    //获取全部科普
    getHasArticle(articleParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: articleParams.id ? '更新失败' : '添加失败'
    })
  }
}
//删除某一个科普
const deleteArticle = async (petId: number) => {
  let result: any = await reqDeleteArticleKp(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasArticle(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
onMounted(() => {
  getHasArticle()
})
const sizeHandler = () => {
  getHasArticle()
}
const search = () => {
  getHasArticle()
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