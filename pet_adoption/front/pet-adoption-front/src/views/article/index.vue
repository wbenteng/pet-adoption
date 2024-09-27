<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="标题:">
        <el-input placeholder="请输入标题" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addPet">添加帖子</el-button>
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示帖子信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" prop="name" label="标题"></el-table-column>
      <el-table-column align="center" prop="content" label="内容">
        <template #default="scope">
          <el-button size="small" type="primary" @click="view(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="time" label="发帖时间"></el-table-column>
      <el-table-column align="center" prop="user" label="发帖人"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateArticle(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.name}?`" width="260px" @confirm="deleteArticle(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
      :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
      @current-change="getHasArticle" @size-change="handler" />
  </el-card>
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
  </el-dialog>
</template>

<script setup lang="ts" name="Article">
import { nextTick, onMounted, reactive, ref, shallowRef } from 'vue';
import { reqSearchArticle, reqAddArticle, reqDeleteArticle, reqDeleteBatcbArticle, reqArticleFileUpload } from '@/api/article';
import { Pet } from '@/api/pet/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';
import axios from 'axios';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部帖子数据
let tableData = ref([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
let dialogFormVisible2 = ref<boolean>(false)
let title = ref('')
let content = ref('')
//收集帖子信息的数据
let articleParams = reactive({
  id: '',
  name: '',
  content: '',
})
//form实例
let formRef = ref<any>()
const mavonEditorRef = shallowRef()
//存储批量删除帖子的ID
let batchIdArr = ref<Pet[]>([])
//收集帖子搜索关键字
let keyword = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

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
onMounted(() => {
  getHasArticle()
})
//分页器下拉菜单
const handler = () => {
  getHasArticle()
}
// const imgAdd = async (pos: any, $file: any) => {
//   let formData = new FormData();
//   formData.append('file', $file);
//   let result = await reqArticleFileUpload(formData)
//   let url = result.data;
//   md.value.$img2Url(pos, url);
// }
// 绑定@imgAdd event
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
//添加帖子按钮的回调
const addPet = () => {
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
//table复选框勾选触发
const selectChange = (value: any) => {
  batchIdArr.value = value
}
//批量删除按钮的回调
const delBatch = async () => {
  //整理参数
  let idsList: any = batchIdArr.value.map(item => {
    return item.id
  })
  let result: any = await reqDeleteBatcbArticle(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasArticle(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasArticle()
}
//重置按钮的回调
const reset = () => {
  settingstore.refresh = !settingstore.refresh
}
</script>

<style scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>