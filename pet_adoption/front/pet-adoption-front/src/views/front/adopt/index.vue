<template>
  <div class="container">
    <div class="top">
      <el-input v-model="nickname" style="width: 400px" size="large"></el-input>
      <el-button type="primary" size="large" style="margin-left: 20px" @click="getHasPet()">搜索</el-button>
      <el-button type="primary" size="large" style="margin-left: 20px"
        @click="settingStore.refresh = !settingStore.refresh">重置</el-button>
      <el-button type="success" style="margin-left: 30px" size="large" @click="$router.push('/front/myAdopt')">
        我的领养
      </el-button>
    </div>
    <div class="main">
      <!-- 宠物列表 -->
      <div class="pet">
        <el-card v-for="item in tableData" :key="item.id" style="margin: 10px 0"
          @click="$router.push('/front/homeDetail?id=' + item.id)">
          <div class="petInfo">
            <img :src="item.img" alt="">
            <div class="infos">
              <div class="info1">
                <span style="font-size: 24px">{{ item.nickname }}</span>
                <span style="margin-left: 20px">{{ item.sex }}</span>
                <span style="margin-left: 20px">{{ item.age }}</span>
              </div>
              <div class="info2">
                <div><b>所属种类：</b>{{ item.type }}</div>
                <div><b>活动范围：</b>{{ item.address }}</div>
                <div><b>身体状态：</b>{{ item.status }}</div>
                <div><b>其他描述：</b>{{ item.information }}</div>
                <div style="text-align: right;"><el-button type="primary"
                    @click.stop="petAdopt(item.id)">申请领养</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 分页器 -->
      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
          :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
          @current-change="getHasPet" @size-change="getHasPet()" />
      </div>
    </div>
  </div>
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
    </el-form>
    <template #footer>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="FAdopt">
import { reqSearchAdoptablePet, reqPetApplication } from '@/api/front';
import type { Pet } from '@/api/pet/type';
import { nextTick, onMounted, reactive, ref } from 'vue';
//引入lagout组件小仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus';
let settingStore = useLayoutSettingStore()
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let nickname = ref('')
//form实例
let formRef = ref<any>()
//存储全部宠物数据
let tableData = ref<Pet[]>([])
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
//收集宠物信息的数据
let petAdoptionParams = reactive({
  animalId: '',
  userId: '',
  name: '',
  sex: '',
  age: '',
  experience: '',
  phone: '',
  married: '',
  income: '',
  profession: '',
  address: '',
  reason: '',
})
//获取全部已有宠物信息
const getHasPet = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchAdoptablePet({
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      name: nickname.value
    }
  })
  if (result.code == 200) {
    total.value = result.data.total
    tableData.value = result.data.records
  }
}
onMounted(() => {
  getHasPet()
})
const petAdopt = (animalId: any) => {
  dialogFormVisible.value = true
  Object.assign(petAdoptionParams, {
    animalId: animalId,
    userId: user.id,
    name: '',
    sex: '',
    age: '',
    experience: '',
    phone: '',
    married: '',
    income: '',
    profession: '',
    address: '',
    reason: '',
  })
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqPetApplication(petAdoptionParams)
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: '申请成功'
    })
    //获取全部宠物
    // getHasPet(currentPage.value)
    //浏览器刷新
    // window.location.reload()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: '申请失败'
    })
  }
}
</script>

<style scoped>
.container {
  .top {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    margin: 10px 0
  }

  .main {
    .pet {
      .petInfo {
        display: flex;
        align-items: center;

        img {
          width: 200px;
          height: 180px;
          border-radius: 10px
        }

        .infos {
          padding-left: 50px;
          flex: 1;

          .info1 {
            border-bottom: 1px solid #ddd;
            width: 100%;
            padding-bottom: 10px;
          }

          .info2 {
            line-height: 40px;

            b {
              margin-right: 10px;
              font-weight: bold;
            }
          }
        }
      }
    }

    .pagination {
      padding: 10px;
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 10px;
    }
  }
}
</style>