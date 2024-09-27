<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="宠物名字:">
        <el-input placeholder="请输入宠物名字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item label="领养状态:">
        <el-select clearable v-model="adopt" placeholder="请选择领养状态" style="width: 200px">
          <el-option v-for="item in ['不可领养', '可领养']" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword || adopt ? false : true"
          @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addPet">添加宠物</el-button>
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
      <el-table-column align="center" prop="nickname" label="宠物名字"></el-table-column>
      <el-table-column align="center" prop="sex" label="宠物性别"></el-table-column>
      <el-table-column align="center" prop="type" label="种类"></el-table-column>
      <el-table-column align="center" prop="age" label="年龄"></el-table-column>
      <el-table-column align="center" label="图片" width="85px">
        <template #default="scope">
          <el-image style="width: 60px; height: 60px" :src="scope.row.img" :preview-src-list="[scope.row.img]"
            preview-teleported>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="活动范围"></el-table-column>
      <el-table-column align="center" prop="status" label="身体状态"></el-table-column>
      <el-table-column align="center" prop="sterilization" label="是否绝育"></el-table-column>
      <el-table-column align="center" prop="vaccine" label="疫苗接种"></el-table-column>
      <el-table-column align="center" prop="adopt" label="可领养状态"></el-table-column>
      <el-table-column align="center" prop="isAdopt" label="是否被领养"></el-table-column>
      <el-table-column align="center" prop="information" label="其他描述"></el-table-column>
      <el-table-column align="center" label="操作" width="170px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updatePet(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.nickname}?`" width="260px" @confirm="deletePet(row.id)">
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
      @current-change="getHasPet" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:添加|更新宠物 -->
  <el-dialog v-model="dialogFormVisible" :title="petParams.id ? '修改宠物' : '添加宠物'" :close-on-click-modal="false">
    <el-form label-width="100px" style="width: 80%" :model="petParams" :rules="rules" ref="formRef">
      <el-form-item label="宠物名字" prop="nickname">
        <el-input v-model="petParams.nickname"></el-input>
      </el-form-item>
      <el-form-item label="宠物性别" prop="sex">
        <el-radio v-model="petParams.sex" label="公">公</el-radio>
        <el-radio v-model="petParams.sex" label="母">母</el-radio>
      </el-form-item>
      <el-form-item label="种类" prop="type">
        <el-input v-model="petParams.type"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="petParams.age"></el-input>
      </el-form-item>
      <el-form-item label="宠物照片" prop="img">
        <el-upload class="avatar-uploader" action="api/file/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="petParams.img" :src="petParams.img" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="活动范围" prop="address">
        <el-input v-model="petParams.address"></el-input>
      </el-form-item>
      <el-form-item label="身体状态" prop="status">
        <el-input v-model="petParams.status"></el-input>
      </el-form-item>
      <el-form-item label="是否绝育" prop="sterilization">
        <el-radio v-model="petParams.sterilization" label="是">是</el-radio>
        <el-radio v-model="petParams.sterilization" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="疫苗接种" prop="vaccine">
        <el-radio v-model="petParams.vaccine" label="未接种">未接种</el-radio>
        <el-radio v-model="petParams.vaccine" label="已接种">已接种</el-radio>
      </el-form-item>
      <el-form-item label="可领养状态" prop="adopt">
        <el-radio v-model="petParams.adopt" label="不可领养">不可领养</el-radio>
        <el-radio v-model="petParams.adopt" label="可领养">可领养</el-radio>
      </el-form-item>
      <el-form-item label="是否被领养" prop="isAdopt">
        <el-radio v-model="petParams.isAdopt" label="是">是</el-radio>
        <el-radio v-model="petParams.isAdopt" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="其他描述">
        <el-input type="textarea" v-model="petParams.information"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Pet">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchPet, reqAddPet, reqDeletePet, reqDeleteBatcbPet } from '@/api/pet';
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
//收集宠物信息的数据
let petParams = reactive({
  id: '',
  nickname: '',
  sex: '',
  address: '',
  type: '',
  age: '',
  status: '',
  sterilization: '',
  vaccine: '',
  adopt: '',
  isAdopt: '',
  information: '',
  img: ''
})
//form实例
let formRef = ref<any>()
//存储批量删除宠物的ID
let batchIdArr = ref<Pet[]>([])
//收集宠物搜索关键字
let keyword = ref<string>('')
let adopt = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

//获取全部已有宠物信息
const getHasPet = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchPet({
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      name: keyword.value,
      adopt: adopt.value,
    }
  })
  // console.log(result);
  if (result.code == 200) {
    total.value = result.data.total
    tableData.value = result.data.records
  }
}
onMounted(() => {
  getHasPet()
})
//分页器下拉菜单
const handler = () => {
  getHasPet()
}
//添加宠物按钮的回调
const addPet = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(petParams, {
    id: '',
    nickname: '',
    sex: '',
    address: '',
    type: '',
    age: '',
    status: '',
    sterilization: '',
    vaccine: '',
    adopt: '',
    isAdopt: '',
    information: '',
    img: ''
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有宠物按钮的回调
const updatePet = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(petParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddPet(petParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: petParams.id ? '更新成功' : '添加成功'
    })
    //获取全部宠物
    getHasPet(petParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: petParams.id ? '更新失败' : '添加失败'
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
  petParams.img = response
  //清除图片校验结果
  formRef.value.clearValidate('img')
}
//校验宠物名字回调
const validateNickname = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 1) {
    callback()
  } else {
    callback(new Error('宠物名字不能为空'))
  }
}
//校验种类回调
const validateType = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 1) {
    callback()
  } else {
    callback(new Error('种类不能为空'))
  }
}
//校验年龄回调
const validateAge = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 1) {
    callback()
  } else {
    callback(new Error('年龄不能为空'))
  }
}
//校验图片回调
const validateImg = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传图片'))
  }
}
//校验活动范围回调
const validateAddress = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 1) {
    callback()
  } else {
    callback(new Error('活动范围不能为空'))
  }
}
//校验身体状态回调
const validateStatus = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 1) {
    callback()
  } else {
    callback(new Error('身体状态不能为空'))
  }
}
//表单校验规则
const rules = {
  nickname: [{ required: true, trigger: 'blur', validator: validateNickname }],
  sex: [{ required: true, trigger: 'change', message: "请选择宠物性别" }],
  type: [{ required: true, trigger: 'blur', validator: validateType }],
  age: [{ required: true, trigger: 'blur', validator: validateAge }],
  img: [{ required: true, validator: validateImg }],
  address: [{ required: true, trigger: 'blur', validator: validateAddress }],
  status: [{ required: true, trigger: 'blur', validator: validateStatus }],
  sterilization: [{ required: true, trigger: 'change', message: "请选择是否绝育" }],
  vaccine: [{ required: true, trigger: 'change', message: "请选择疫苗接种情况" }],
  adopt: [{ required: true, trigger: 'change', message: "请选择可领养状态" }],
  isAdopt: [{ required: true, trigger: 'change', message: "请选择是否被领养" }],
}
//删除某一个宠物
const deletePet = async (petId: number) => {
  let result: any = await reqDeletePet(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasPet(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
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
  let result: any = await reqDeleteBatcbPet(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasPet(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasPet()
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