<template>
  <div class="container">
    <div class="top">
      <el-input v-model="keyword" style="width: 400px" size="large"></el-input>
      <el-button type="primary" size="large" style="margin-left: 20px" @click="search">搜索</el-button>
      <el-button type="primary" size="large" style="margin-left: 20px"
        @click="settingStore.refresh = !settingStore.refresh">
        重置
      </el-button>
      <el-button type="success" size="large" style="margin-left: 30px" @click="addArticle">发帖</el-button>
    </div>
    <div class="comments">
      <div v-for="item in tableData" style="padding: 20px; border-radius: 10px; background-color: #fff; margin: 10px 0">
        <div style="font-size: 20px; font-weight: bold; color: #1E90FF; cursor: pointer" @click="view(item)">{{
          item.name }}</div>
        <div style="margin-top: 15px; font-size: 14px">
          <span><i class="el-icon-user-solid" style="margin-right: 5px"></i>{{ item.user }}</span>
          <span><i class="el-icon-time" style="margin-right: 5px; margin-left: 20px"></i>{{ item.time }}</span>
          <span>
            <el-button v-if="item.userId === user.id" type="text"
              style="float: right; font-size: 16px; color: red; margin-left: 10px"
              @click="deleteArticle(item.id)">删除</el-button>
            <el-button v-if="item.userId === user.id" type="text" style="float: right; font-size: 16px"
              @click="updateArticle(item)">编辑</el-button>
            <el-button type="text" style="float: right; font-size: 16px" @click="addComment(item.id)">评论</el-button>
          </span>
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
  <!-- 对话框组件:添加|更新帖子 -->
  <el-dialog v-model="dialogFormVisible" width="60%" :title="articleParams.id ? '修改帖子' : '添加帖子'"
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
  </el-dialog>
  <el-dialog v-model="dialogFormVisible2" width="60%" :title="title">
    <mavon-editor v-model="content" :subfield="false" :defaultOpen="'preview'" :toolbarsFlag="false" :editable="false"
      :scrollStyle="true" :ishljs="true" />
    <div style="margin: 30px 0">
      <div style="margin-bottom: 20px; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px">评论列表</div>
      <div v-for="item in comments"
        style="background-color: #fff; padding: 10px; border-radius: 10px; border-bottom: 1px solid #ddd">
        <div style="padding: 10px 0; display: flex; color: #666;  font-size: 14px">
          <div style="width: 100px; text-align: center">
            <el-image :src="item.avatar" style="width: 50px; height: 50px; border-radius: 50%"></el-image>
          </div>
          <div style="flex: 1; line-height: 25px;">
            <div>
              <span style="color: #3F5EFB">{{ item.user }}：</span>
              <span>{{ item.content }}</span>
            </div>
            <div style="font-size: 12px; margin-top: 5px; display: flex">
              <div style="flex: 1"><i class="el-icon-time"></i> <span>{{ item.time }}</span></div>
              <div style="width: 100px; text-align: right">
                <el-button type="text" @click="delComment(item.id)" style="color: red"
                  v-if="user.nickname === item.user">删除</el-button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <!-- 对话框组件:回复 -->
  <el-dialog v-model="dialogFormVisible3" title="评论" :close-on-click-modal="false">
    <el-form label-width="100px" style="width: 80%" ref="formRef">
      <el-form-item label="评论内容">
        <el-input type="textarea" v-model="comment.content" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveComment">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="FArticle">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchArticle, reqAddArticle, reqDeleteArticle, reqArticleFileUpload } from '@/api/article';
import { reqSearchArticleComment, reqAddPetComment, reqDeletePetComment } from '@/api/front';
//引入lagout组件小仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus';
let settingStore = useLayoutSettingStore()
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//收集帖子搜索关键字
let keyword = ref<string>('')
//存储全部帖子数据
let tableData = ref<any>([])
//收集帖子信息的数据
let articleParams = reactive({
  id: '',
  name: '',
  content: '',
})
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
let dialogFormVisible2 = ref<boolean>(false)
let dialogFormVisible3 = ref<boolean>(false)
//form实例
let formRef = ref<any>()
const mavonEditorRef = ref()
let title = ref('')
let content = ref('')
let aid = ref(0)
let comment = ref({
  articleId: null,
  content: '',
  type: 0
})
let comments = ref<any>([])
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
//获取全部已有帖子信息
const getHasArticle = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchArticle({
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
  aid.value = row.id
  getComment(aid.value)
  dialogFormVisible2.value = true
}
const getComment = async (id: any) => {
  let result = await reqSearchArticleComment(id)
  comments.value = result.data
}
//添加帖子按钮的回调
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
//更新已有帖子按钮的回调
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
  let result: any = await reqAddArticle(articleParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: articleParams.id ? '更新成功' : '添加成功'
    })
    //获取全部帖子
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
const addComment = (id: any) => {
  dialogFormVisible3.value = true
  comment.value.articleId = id
}
const saveComment = async () => {
  comment.value.type = 2
  let result = await reqAddPetComment(comment.value)
  if (result.code == 200) {
    dialogFormVisible3.value = false
    getComment(comment.value.articleId)
    Object.assign(comment.value, {
      articleId: null,
      content: '',
      type: 0
    })
    ElMessage({
      type: 'success',
      message: '评论成功'
    })
  }
  else {
    ElMessage({
      type: 'error',
      message: '评论失败'
    })
  }
}
//删除某一个帖子
const deleteArticle = async (petId: number) => {
  let result: any = await reqDeleteArticle(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasArticle(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
const delComment = async (id: number) => {
  let result = await reqDeletePetComment(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getComment(aid.value)
  }
  else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
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