<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="宠物名字:">
        <el-input placeholder="请输入宠物名字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addPet">添加丢失宠物</el-button>
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示丢失宠物信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" prop="nickname" label="走失宠物名字"></el-table-column>
      <el-table-column align="center" prop="type" label="种类"></el-table-column>
      <el-table-column align="center" prop="sex" label="性别"></el-table-column>
      <el-table-column align="center" prop="person" label="联系人"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
      <el-table-column align="center" prop="status1" label="已丢失/带领回"></el-table-column>
      <el-table-column align="center" prop="status2" label="找回状态"></el-table-column>
      <el-table-column align="center" label="操作" width="170px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateLost(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.nickname}?`" width="260px" @confirm="deleteLost(row.id)">
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
      @current-change="getHasLost" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:添加|更新丢失宠物 -->
  <el-dialog v-model="dialogFormVisible" :title="lostParams.id ? '修改宠物救助' : '添加宠物救助'" :close-on-click-modal="false">
    <el-form label-width="120px" style="width: 80%" ref="formRef">
      <el-form-item label="走失宠物名字">
        <el-input v-model="lostParams.nickname"></el-input>
      </el-form-item>
      <el-form-item label="种类">
        <el-input v-model="lostParams.type"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="lostParams.sex" label="公">公</el-radio>
        <el-radio v-model="lostParams.sex" label="母">母</el-radio>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="lostParams.person"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="lostParams.phone"></el-input>
      </el-form-item>
      <el-form-item label="已丢失/待领回">
        <el-radio v-model="lostParams.status1" label="已丢失">已丢失</el-radio>
        <el-radio v-model="lostParams.status1" label="待领回">待领回</el-radio>
      </el-form-item>
      <el-form-item label="找回状态">
        <el-radio v-model="lostParams.status2" label="未找到">未找到</el-radio>
        <el-radio v-model="lostParams.status2" label="已找到">已找到</el-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Lost">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchLost, reqAddLost, reqDeleteLost, reqDeleteBatcbLost } from '@/api/lost';
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
//收集丢失宠物信息的数据
let lostParams = reactive({
  id: '',
  nickname: '',
  type: '',
  sex: '',
  person: '',
  phone: '',
  status1: '',
  status2: '',
})
//form实例
let formRef = ref<any>()
//存储批量删除丢失宠物的ID
let batchIdArr = ref<Pet[]>([])
//收集宠物救助搜索关键字
let keyword = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

//获取全部已有丢失宠物信息
const getHasLost = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchLost({
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
  getHasLost()
})
//分页器下拉菜单
const handler = () => {
  getHasLost()
}
//添加丢失宠物按钮的回调
const addPet = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(lostParams, {
    id: '',
    nickname: '',
    type: '',
    sex: '',
    person: '',
    phone: '',
    status1: '',
    status2: '',
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有丢失宠物按钮的回调
const updateLost = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(lostParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddLost(lostParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: lostParams.id ? '更新成功' : '添加成功'
    })
    //获取全部丢失宠物
    getHasLost(lostParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: lostParams.id ? '更新失败' : '添加失败'
    })
  }
}
//删除某一个丢失宠物
const deleteLost = async (petId: number) => {
  let result: any = await reqDeleteLost(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasLost(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
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
  let result: any = await reqDeleteBatcbLost(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasLost(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasLost()
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