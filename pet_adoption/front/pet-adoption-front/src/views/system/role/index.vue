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
    <el-button type="primary" size="default" @click="addRole">添加角色</el-button>
    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="InfoFilled" icon-color="red"
      title="您确定批量删除这些数据吗？" @confirm="delBatch">
      <template #reference>
        <el-button type="danger" size="default" :disabled="batchIdArr.length ? false : true">批量删除</el-button>
      </template>
    </el-popconfirm>
    <!-- table展示角色信息 -->
    <el-table style="margin: 10px 0;" border stripe :data="tableData" @selection-change="selectChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="55px"></el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="flag" label="唯一标识"></el-table-column>
      <el-table-column align="center" prop="description" label="描述"></el-table-column>
      <el-table-column align="center" label="操作" width="320px">
        <template #="{ row, $index }">
          <!-- <el-button type="primary" size="small" icon="Edit">分配菜单</el-button> -->
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.name}?`" width="260px" @confirm="deleteRole(row.id)">
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
      @current-change="getHasRole" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:更新宠物申请 -->
  <el-dialog v-model="dialogFormVisible" :title="roleParams.id ? '修改用户' : '添加用户'" :close-on-click-modal="false">
    <el-form label-width="100px" style="width: 80%" ref="formRef">
      <el-form-item label="名称">
        <el-input v-model="roleParams.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="唯一标识">
        <el-input v-model="roleParams.flag" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="roleParams.description" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="User">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqSearchRole, reqGetMenu, reqAddRole, reqDeleteRole, reqDeleteBatcbRole } from '@/api/system/role';
import { Pet } from '@/api/pet/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部用户数据
let tableData = ref([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//收集用户信息的数据
let roleParams = reactive({
  id: '',
  name: '',
  flag: '',
  description: '',
})
//form实例
let formRef = ref<any>()
//存储批量删除宠物的ID
let batchIdArr = ref<Pet[]>([])
//收集用户搜索关键字
let keyword = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

//获取全部已有角色信息
const getHasRole = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchRole({
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      name: keyword.value,
    }
  })
  if (result.code == 200) {
    total.value = result.data.total
    tableData.value = result.data.records
  }

  // let result2 = await reqSearchRole()
  // if (result.code == 200) {
  //   roles.value = result2.data
  // }
}
onMounted(() => {
  getHasRole()
})
//分页器下拉菜单
const handler = () => {
  getHasRole()
}
//添加角色按钮的回调
const addRole = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(roleParams, {
    id: '',
    name: '',
    flag: '',
    description: '',
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有用户申请按钮的回调
const updateRole = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(roleParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//删除某一个角色
const deleteRole = async (userId: number) => {
  let result: any = await reqDeleteRole(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasRole(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddRole(roleParams)
  console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: roleParams.id ? '更新成功' : '添加成功'
    })
    //获取全部角色
    getHasRole(roleParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: roleParams.id ? '更新失败' : '添加失败'
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
  let result: any = await reqDeleteBatcbRole(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasRole(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasRole()
}
//重置按钮的回调
const reset = () => {
  settingstore.refresh = !settingstore.refresh
}
</script>