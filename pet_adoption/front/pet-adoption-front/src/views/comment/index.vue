<template>
  <el-card style="margin: 10px 0;">
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示评论信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" prop="content" label="内容"></el-table-column>
      <el-table-column align="center" prop="user" label="发表人"></el-table-column>
      <el-table-column align="center" prop="time" label="时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateComment(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除该评论?`" width="260px" @confirm="deleteComment(row.id)">
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
      @current-change="getHasComment" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:添加|更新丢失宠物 -->
  <el-dialog v-model="dialogFormVisible" :title="commentParams.id ? '修改评论' : '添加评论'" :close-on-click-modal="false">
    <el-form label-width="120px" style="width: 80%" ref="formRef">
      <el-form-item label="回复内容">
        <el-input v-model="commentParams.content" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="回复人">
        <el-input v-model="commentParams.user" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="回复时间">
        <el-date-picker v-model="commentParams.time" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="父id">
        <el-input v-model="commentParams.pid" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="文章id">
        <el-input v-model="commentParams.articleId" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Comment">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchComment, reqUpdateComment, reqDeleteComment, reqDeleteBatcbComment } from '@/api/comment';
import { Pet } from '@/api/pet/type';
import { ElMessage, UploadProps } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部评论数据
let tableData = ref([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//收集评论信息的数据
let commentParams = reactive({
  id: '',
  content: '',
  user: '',
  time: '',
  pid: '',
  articleId: '',
})
//form实例
let formRef = ref<any>()
//存储批量删除评论的ID
let batchIdArr = ref<Pet[]>([])
//收集评论搜索关键字
let keyword = ref<string>('')

//获取全部已有评论信息
const getHasComment = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchComment({
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
  getHasComment()
})
//分页器下拉菜单
const handler = () => {
  getHasComment()
}
//更新已有评论按钮的回调
const updateComment = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(commentParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqUpdateComment(commentParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: commentParams.id ? '更新成功' : '添加成功'
    })
    //获取全部评论
    getHasComment(commentParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: commentParams.id ? '更新失败' : '添加失败'
    })
  }
}
//删除某一个评论
const deleteComment = async (petId: number) => {
  let result: any = await reqDeleteComment(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasComment(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
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
  let result: any = await reqDeleteBatcbComment(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasComment(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
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