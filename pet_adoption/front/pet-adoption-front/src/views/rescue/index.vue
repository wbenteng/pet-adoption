<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="名称:">
        <el-input placeholder="请输入名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addPet">添加宠物救助</el-button>
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示用户信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="addres" label="地址"></el-table-column>
      <el-table-column align="center" label="图片" width="85px">
        <template #default="scope">
          <el-image style="width: 60px; height: 60px" :src="scope.row.img" :preview-src-list="[scope.row.img]"
            preview-teleported>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="person" label="联系人"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
      <el-table-column align="center" prop="information" label="相关描述"></el-table-column>
      <el-table-column align="center" label="操作" width="170px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateRescue(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.name}?`" width="260px" @confirm="deleteRescue(row.id)">
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
      @current-change="getHasRescue" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:添加|更新宠物救助 -->
  <el-dialog v-model="dialogFormVisible" :title="rescueParams.id ? '修改宠物救助' : '添加宠物救助'" :close-on-click-modal="false">
    <el-form label-width="100px" style="width: 80%" ref="formRef">
      <el-form-item label="名称">
        <el-input v-model="rescueParams.name"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="rescueParams.addres"></el-input>
      </el-form-item>
      <el-form-item label="宠物照片">
        <el-upload class="avatar-uploader" action="api/file/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="rescueParams.img" :src="rescueParams.img" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="rescueParams.person"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="rescueParams.phone"></el-input>
      </el-form-item>
      <el-form-item label="相关描述">
        <el-input v-model="rescueParams.information"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Rescue">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchRescue, reqAddRescue, reqDeleteRescue, reqDeleteBatcbRescue } from '@/api/rescue';
import { Pet } from '@/api/pet/type';
import { ElMessage, UploadProps } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部宠物数据
let tableData = ref([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//收集宠物救助信息的数据
let rescueParams = reactive({
  id: '',
  name: '',
  addres: '',
  person: '',
  phone: '',
  information: '',
  img: ''
})
//form实例
let formRef = ref<any>()
//存储批量删除宠物救助的ID
let batchIdArr = ref<Pet[]>([])
//收集宠物救助搜索关键字
let keyword = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

//获取全部已有宠物救助信息
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
//分页器下拉菜单
const handler = () => {
  getHasRescue()
}
//添加宠物救助按钮的回调
const addPet = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(rescueParams, {
    id: '',
    name: '',
    addres: '',
    person: '',
    phone: '',
    information: '',
    img: ''
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有宠物救助按钮的回调
const updateRescue = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(rescueParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddRescue(rescueParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: rescueParams.id ? '更新成功' : '添加成功'
    })
    //获取全部宠物救助
    getHasRescue(rescueParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: rescueParams.id ? '更新失败' : '添加失败'
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
  rescueParams.img = response
  //清除图片校验结果
  formRef.value.clearValidate('img')
}
//删除某一个宠物救助
const deleteRescue = async (petId: number) => {
  let result: any = await reqDeleteRescue(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasRescue(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
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
  let result: any = await reqDeleteBatcbRescue(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasRescue(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasRescue()
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