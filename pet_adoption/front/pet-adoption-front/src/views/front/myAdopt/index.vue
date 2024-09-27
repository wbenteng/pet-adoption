<template>
  <div class="container">
    <div v-if="!tableData.length" style=" margin: 10px 0">
      <el-card>
        <div style="text-align: center; color: #999;">暂无申请领养记录</div>
      </el-card>
    </div>
    <div v-else class="main">
      <!-- 宠物列表 -->
      <div class="pet">
        <el-card v-for="item in tableData" :key="item.id" style="margin: 10px 0">
          <div class="petInfo">
            <img :src="item.animal.img" alt="">
            <div class="infos">
              <div class="info1">
                <span style="font-size: 24px">{{ item.animal.nickname }}</span>
                <span style="margin-left: 20px">{{ item.animal.sex }}</span>
                <span style="margin-left: 20px">{{ item.animal.age }}</span>
                <b style="margin-left: 30px">
                  <span v-if="item.state === '审核通过'" style="color: green">审核通过</span>
                  <span v-if="item.state === '审核不通过'" style="color: red">审核不通过</span>
                </b>
              </div>
              <div class="info2">
                <div><b>是否绝育：</b>{{ item.animal.sterilization }}</div>
                <div><b>疫苗接种：</b>{{ item.animal.vaccine }}</div>
                <div><b>身体状态：</b>{{ item.animal.status }}</div>
                <div><b>其他描述：</b>{{ item.animal.information }}</div>
              </div>
            </div>
          </div>
          <div style="padding: 10px 0">
            <el-descriptions title="申请详情">
              <el-descriptions-item label="姓名">{{ item.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ item.sex }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ item.age }}</el-descriptions-item>
              <el-descriptions-item label="养宠经验">{{ item.experience }}</el-descriptions-item>
              <el-descriptions-item label="联系方式">{{ item.phone }}</el-descriptions-item>
              <el-descriptions-item label="婚姻">{{ item.married }}</el-descriptions-item>
              <el-descriptions-item label="收入">{{ item.income }}</el-descriptions-item>
              <el-descriptions-item label="职业">{{ item.profession }}</el-descriptions-item>
              <el-descriptions-item label="住址">{{ item.address }}</el-descriptions-item>
              <el-descriptions-item label="领养理由">{{ item.reason }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="FAdopt">
import { reqSearchMyAdopt } from '@/api/front';
import { onMounted, ref } from 'vue';
//存储全部宠物数据
let tableData = ref<any[]>([])
//获取全部已有宠物信息
const getMyAdopt = async () => {
  let result = await reqSearchMyAdopt()
  if (result.code == 200) {
    tableData.value = result.data
  }
}
onMounted(() => {
  getMyAdopt()
})
</script>

<style scoped>
.container {
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
  }
}
</style>