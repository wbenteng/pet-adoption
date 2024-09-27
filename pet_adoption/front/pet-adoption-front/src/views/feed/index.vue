<template>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addPet">添加宠物喂养点</el-button>
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示宠物喂养点信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" label="环境照片">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.img" :preview-src-list="[scope.row.img]"
            preview-teleported>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="地址"></el-table-column>
      <el-table-column align="center" prop="information" label="相关描述"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateFeed(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除该喂养点?`" width="260px" @confirm="deleteFeed(row.id)">
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
      @current-change="getHasFeed" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:添加|更新宠物救助 -->
  <el-dialog v-model="dialogFormVisible" :title="feedParams.id ? '修改宠物喂养点' : '添加宠物喂养点'" :close-on-click-modal="false">
    <el-form label-width="100px" style="width: 80%" ref="formRef">
      <el-form-item label="宠物照片">
        <el-upload class="avatar-uploader" action="api/file/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="feedParams.img" :src="feedParams.img" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="feedParams.address"></el-input>
      </el-form-item>
      <el-form-item label="相关描述">
        <el-input v-model="feedParams.information"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Feed">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchFeed, reqAddFeed, reqDeleteFeed, reqDeleteBatcbFeed } from '@/api/feed';
import { Pet } from '@/api/pet/type';
import { ElMessage, UploadProps } from 'element-plus';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部宠物喂养点数据
let tableData = ref([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//收集宠物救助喂养点的数据
let feedParams = reactive({
  id: '',
  address: '',
  information: '',
  img: ''
})
//form实例
let formRef = ref<any>()
//存储批量删除宠物喂养点的ID
let batchIdArr = ref<Pet[]>([])
//收集宠物喂养点搜索关键字
let keyword = ref<string>('')

//获取全部已有宠物喂养点信息
const getHasFeed = async (pager = 1) => {
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
  getHasFeed()
})
//分页器下拉菜单
const handler = () => {
  getHasFeed()
}
//添加宠物喂养点按钮的回调
const addPet = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(feedParams, {
    id: '',
    address: '',
    information: '',
    img: ''
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有宠物喂养点按钮的回调
const updateFeed = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(feedParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddFeed(feedParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: feedParams.id ? '更新成功' : '添加成功'
    })
    //获取全部宠物喂养点
    getHasFeed(feedParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: feedParams.id ? '更新失败' : '添加失败'
    })
  }
}
//上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif' &&
    rawFile.type !== 'image/webp' &&
    rawFile.type !== 'image/jpg'
  ) {
    ElMessage.error('请上传图片格式为.jpeg,.png,.gif,.jpg的图片!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('上传文件大小不能大于4M!')
    return false
  }
  return true
}
//图片上传成功触发的钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response: any,
  uploadFile,
) => {
  //收集上传图片的地址
  feedParams.img = response
  //清除图片校验结果
  formRef.value.clearValidate('img')
}
//删除某一个喂养点
const deleteFeed = async (petId: number) => {
  let result: any = await reqDeleteFeed(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasFeed(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
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
  let result: any = await reqDeleteBatcbFeed(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasFeed(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
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