<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="领养人:">
        <el-input placeholder="请输入领养人名字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示宠物申请领养信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" prop="animal.nickname" label="领养宠物名字"></el-table-column>
      <el-table-column align="center" prop="name" label="姓名"></el-table-column>
      <el-table-column align="center" prop="phone" label="年龄"></el-table-column>
      <el-table-column align="center" prop="experience" label="养宠经验"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
      <el-table-column align="center" prop="married" label="婚姻"></el-table-column>
      <el-table-column align="center" prop="income" label="收入"></el-table-column>
      <el-table-column align="center" prop="profession" label="职业"></el-table-column>
      <el-table-column align="center" prop="address" label="住址"></el-table-column>
      <el-table-column align="center" prop="reason" label="领养理由"></el-table-column>
      <el-table-column align="center" prop="state" label="状态">
        <template #default="scope">
          <span style="color: green" v-if="scope.row.state === '审核通过'">审核通过</span>
          <span style="color: red" v-if="scope.row.state === '审核不通过'">审核不通过</span>
          <span style="color: #1E90FF" v-if="scope.row.state === '待审核'">待审核</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="agreePetAdoption(row, '审核通过')"
            :disabled="row.state !== '待审核'">审核通过</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updatePetAdoption(row)"
            :disabled="row.state !== '待审核'">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.name}?`" width="260px" @confirm="deletePetAdoption(row.id)">
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
      @current-change="getHasPetAdoption" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:更新宠物申请 -->
  <el-dialog v-model="dialogFormVisible" title="修改申请领养" :close-on-click-modal="false">
    <el-form label-width="100px" style="width: 80%" ref="formRef">
      <el-form-item label="姓名">
        <el-input v-model="petAdoptionParams.name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="petAdoptionParams.sex"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="petAdoptionParams.age"></el-input>
      </el-form-item>
      <el-form-item label="养宠经验">
        <el-input v-model="petAdoptionParams.experience"></el-input>
      </el-form-item>
      <el-form-item label="宠物">
        <el-input v-model="petAdoptionParams.pet"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="petAdoptionParams.phone"></el-input>
      </el-form-item>
      <el-form-item label="婚姻">
        <el-input v-model="petAdoptionParams.married"></el-input>
      </el-form-item>
      <el-form-item label="收入">
        <el-input v-model="petAdoptionParams.income"></el-input>
      </el-form-item>
      <el-form-item label="职业">
        <el-input v-model="petAdoptionParams.profession"></el-input>
      </el-form-item>
      <el-form-item label="住址">
        <el-input v-model="petAdoptionParams.address"></el-input>
      </el-form-item>
      <el-form-item label="领养理由">
        <el-input v-model="petAdoptionParams.reason"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="petAdoptionParams.state"></el-input>
      </el-form-item>
      <el-form-item label="宠物id">
        <el-input v-model="petAdoptionParams.animalId"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="PetAdoption">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchPetAdoption, reqAgreePetAdoption, reqUpdatePetAdoption, reqDeletePetAdoption, reqDeleteBatcbPetAdoption } from '@/api/petAdoption';
import { Pet } from '@/api/pet/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部宠物数据
let tableData = ref([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//收集宠物信息的数据
let petAdoptionParams = reactive({
  id: '',
  name: '',
  sex: '',
  age: '',
  experience: '',
  pet: '',
  phone: '',
  married: '',
  income: '',
  profession: '',
  address: '',
  reason: '',
  state: '',
  animalId: '',
})
//form实例
let formRef = ref<any>()
//存储批量删除宠物的ID
let batchIdArr = ref<Pet[]>([])
//收集宠物搜索关键字
let keyword = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

//获取全部已有申请领养信息
const getHasPetAdoption = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchPetAdoption({
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      name: keyword.value,
    }
  })
  console.log(result);
  if (result.code == 200) {
    total.value = result.data.total
    tableData.value = result.data.records
  }
}
onMounted(() => {
  getHasPetAdoption()
})
//分页器下拉菜单
const handler = () => {
  getHasPetAdoption()
}
//审核通过宠物申请按钮的回调
const agreePetAdoption = async (row: any, state: string) => {
  let result: any = await reqAgreePetAdoption(row.id, state)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '审核成功'
    })
    getHasPetAdoption(currentPage.value)
  }
}
//更新已有宠物申请按钮的回调
const updatePetAdoption = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(petAdoptionParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//删除某一个宠物
const deletePetAdoption = async (petId: number) => {
  let result: any = await reqDeletePetAdoption(petId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasPetAdoption(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqUpdatePetAdoption(petAdoptionParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: '更新成功'
    })
    //获取全部宠物申请
    getHasPetAdoption(currentPage.value)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: '更新失败'
    })
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
  let result: any = await reqDeleteBatcbPetAdoption(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasPetAdoption(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasPetAdoption()
}
//重置按钮的回调
const reset = () => {
  settingstore.refresh = !settingstore.refresh
}
</script>