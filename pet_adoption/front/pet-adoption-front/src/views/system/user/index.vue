<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
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
      <el-table-column align="center" prop="username" label="用户名" width="140"></el-table-column>
      <el-table-column align="center" width="140px" prop="role" label="角色"></el-table-column>
      <el-table-column align="center" prop="nickname" label="姓名"></el-table-column>
      <el-table-column align="center" width="60px" prop="sex" label="性别"></el-table-column>
      <el-table-column align="center" prop="birth" label="生日"></el-table-column>
      <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
      <el-table-column align="center" prop="phone" label="电话"></el-table-column>
      <el-table-column align="center" prop="address" label="地址"></el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
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
      @current-change="getHasUser" @size-change="handler" />
  </el-card>
  <!-- 对话框组件:更新宠物申请 -->
  <el-dialog v-model="dialogFormVisible" :title="userParams.id ? '修改用户' : '添加用户'" :close-on-click-modal="false">
    <el-form label-width="100px" style="width: 80%" ref="formRef">
      <el-form-item label="用户名">
        <el-input v-model="userParams.username"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select clearable v-model="userParams.role" placeholder="请选择角色" style="width: 100%">
          <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="userParams.nickname"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="userParams.sex" label="男">男</el-radio>
        <el-radio v-model="userParams.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker clearable style="width: 80%" v-model="userParams.birth" type="date" value-format="YYYY-MM-DD"
          placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userParams.email"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="userParams.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="userParams.address"></el-input>
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
import { reqSearchUser, reqSearchRoleName, reqAddUser, reqDeleteUser, reqDeleteBatcbUser } from '@/api/system/user';
import { Pet } from '@/api/pet/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部用户数据
let tableData = ref([])
//存储角色的数据
let roles = ref<any>([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//收集用户信息的数据
let userParams = reactive({
  id: '',
  username: '',
  role: '',
  nickname: '',
  sex: '',
  birth: '',
  email: '',
  phone: '',
  address: '',
})
//form实例
let formRef = ref<any>()
//存储批量删除宠物的ID
let batchIdArr = ref<Pet[]>([])
//收集用户搜索关键字
let keyword = ref<string>('')
//获取setting仓库
let settingstore = useLayoutSettingStore()

//获取全部已有用户信息
const getHasUser = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchUser({
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      username: keyword.value,
    }
  })
  if (result.code == 200) {
    total.value = result.data.total
    tableData.value = result.data.records
  }

  let result2 = await reqSearchRoleName()
  if (result.code == 200) {
    roles.value = result2.data
  }
}
onMounted(() => {
  getHasUser()
})
//分页器下拉菜单
const handler = () => {
  getHasUser()
}
//添加用户按钮的回调
const addUser = () => {
  dialogFormVisible.value = true
  //清空数据
  Object.assign(userParams, {
    id: '',
    username: '',
    role: '',
    nickname: '',
    sex: '',
    birth: '',
    email: '',
    phone: '',
    address: '',
  })
  //清除上一次错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新已有用户申请按钮的回调
const updateUser = (row: any) => {
  dialogFormVisible.value = true
  //存储已有的账号信息
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqDeleteUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasUser(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddUser(userParams)
  console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功'
    })
    //获取全部用户
    getHasUser(userParams.id ? currentPage.value : 1)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败'
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
  let result: any = await reqDeleteBatcbUser(idsList)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    })
    getHasUser(tableData.value.length > 1 ? currentPage.value : currentPage.value - 1)
  }
}
//搜索按钮的回调
const search = () => {
  getHasUser()
}
//重置按钮的回调
const reset = () => {
  settingstore.refresh = !settingstore.refresh
}
</script>