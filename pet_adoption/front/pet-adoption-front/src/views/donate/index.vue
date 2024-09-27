<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="捐款人:">
        <el-input placeholder="请输入捐款人" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addDoante">添加捐赠</el-button>
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示捐赠信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" prop="name" label="捐款人"></el-table-column>
      <el-table-column align="center" prop="goods" label="捐赠物资"></el-table-column>
      <el-table-column align="center" prop="time" label="捐款时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateDonate(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.name}?`" width="260px" @confirm="deleteNotice(row.id)">
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
      @current-change="getHasDonate" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:添加|更新捐赠 -->
  <el-dialog v-model="dialogFormVisible" :title="doanteParams.id ? '修改捐赠' : '添加捐赠'" :close-on-click-modal="false">
    <el-form label-width="120px" style="width: 80%" ref="formRef">
      <el-form-item label="捐款人">
        <el-input v-model="doanteParams.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="捐赠物资">
        <el-input v-model="doanteParams.goods" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="捐款时间">
        <el-date-picker v-model="doanteParams.time" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Donate">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchDonate, reqAddDonate, reqDeleteDonate, reqDeleteBatcbDonate } from '@/api/donate';
import { Pet } from '@/api/pet/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部捐赠数据
let tableData = ref([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//收集捐赠信息的数据
let doanteParams = reactive({
  id: '',
  name: '',
  goods: '',
  time: '',
})
//form实例
let formRef = ref<any>()
//存储批量删除捐赠的ID
let batchIdArr = ref<Pet[]>([])
//收集捐赠搜索关键字
let keyword = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

//获取全部已有捐赠信息
const getHasDonate = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchDonate({
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
  getHasDonate()
})
//分页器下拉菜单
const handler = () => {
  getHasDonate()
}
//添加捐赠按钮的回调
const addDoante = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(doanteParams, {
    id: '',
    name: '',
    goods: '',
    time: '',
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有捐赠按钮的回调
const updateDonate = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(doanteParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddDonate(doanteParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: doanteParams.id ? '更新成功' : '添加成功'
    })
    //获取全部捐赠
    getHasDonate(doanteParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: doanteParams.id ? '更新失败' : '添加失败'
    })
  }
}
//删除某一个捐赠
const deleteNotice = async (petId: number) => {
  let result: any = await reqDeleteDonate(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasDonate(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
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
  let result: any = await reqDeleteBatcbDonate(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasDonate(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasDonate()
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