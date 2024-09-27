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
    <el-button type="primary" size="default" @click="addPet">添加活动</el-button>
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示活动信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" prop="name" label="标题"></el-table-column>
      <el-table-column align="center" prop="content" label="内容">
        <template #default="scope">
          <el-button size="small" type="primary" @click="view(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="time" label="发布时间"></el-table-column>
      <el-table-column align="center" label="封面">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.img" :preview-src-list="[scope.row.img]"
            preview-teleported>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="num" label="报名人数"></el-table-column>
      <el-table-column align="center" prop="address" label="地址"></el-table-column>
      <el-table-column align="center" label="操作" width="180px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateActivity(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.name}?`" width="260px" @confirm="deleteActivity(row.id)">
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
      @current-change="getHasActivity" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:添加|更新活动 -->
  <el-dialog v-model="dialogFormVisible" width="70%" :title="activityParams.id ? '修改活动' : '添加活动'"
    :close-on-click-modal="false">
    <el-form style="width: 90%" label-width="100px" ref="formRef">
      <el-form-item label="标题">
        <el-input v-model="activityParams.name"></el-input>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload class="avatar-uploader" action="api/file/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="activityParams.img" :src="activityParams.img" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker v-model="activityParams.time" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="报名人数">
        <el-input v-model="activityParams.num"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="activityParams.address"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <mavon-editor ref="mavonEditorRef" v-model="activityParams.content" :ishljs="true" @imgAdd="imgAdd" />
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

<script setup lang="ts" name="ActivityKp">
import { nextTick, onMounted, reactive, ref, shallowRef } from 'vue';
import { reqSearchActivity, reqAddActivity, reqDeleteActivity, reqDeleteBatcbActivity, reqActivityFileUpload } from '@/api/activity';
import { Pet } from '@/api/pet/type';
import { ElMessage, UploadProps } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部活动数据
let tableData = ref([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
let dialogFormVisible2 = ref<boolean>(false)
let title = ref('')
let content = ref('')
//收集活动信息的数据
let activityParams = reactive({
  id: '',
  name: '',
  content: '',
  img: '',
  time: '',
  num: '',
  address: '',
})
//form实例
let formRef = ref<any>()
const mavonEditorRef = shallowRef()
//存储批量删除活动的ID
let batchIdArr = ref<Pet[]>([])
//收集活动搜索关键字
let keyword = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

//获取全部已有活动信息
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
onMounted(() => {
  getHasActivity()
})
//分页器下拉菜单
const handler = () => {
  getHasActivity()
}
// const imgAdd = async (pos: any, $file: any) => {
//   let formData = new FormData();
//   formData.append('file', $file);
//   let result = await reqActivityFileUpload(formData)
//   let url = result.data;
//   md.value.$img2Url(pos, url);
// }
// 绑定@imgAdd event
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
//添加活动按钮的回调
const addPet = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(activityParams, {
    id: '',
    name: '',
    content: '',
    img: '',
    time: '',
    num: '',
    address: '',
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
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
  activityParams.img = response
  //清除图片校验结果
  formRef.value.clearValidate('img')
}
//更新已有活动按钮的回调
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
    //获取全部活动
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
//删除某一个活动
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
  let result: any = await reqDeleteBatcbActivity(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasActivity(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasActivity()
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