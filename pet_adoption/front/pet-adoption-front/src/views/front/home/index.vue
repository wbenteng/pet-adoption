<template>
  <div class="layout_container">
    <div class="layout_top">
      <FHeader></FHeader>
    </div>
    <div class="layout_main">
      <!-- 轮播图 -->
      <div class="carousel">
        <el-carousel height="510px" trigger="click">
          <el-carousel-item>
            <img src="../../../assets/images/front/home/img1.jpg" alt="" style="width: 100%;height: 100%">
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../../assets/images/front/home/img2.webp" alt="" style="width: 100%;height: 100%">
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../../assets/images/front/home/img3.webp" alt="" style="width: 100%;height: 100%">
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../../assets/images/front/home/img4.webp" alt="" style="width: 100%;height: 100%">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="main">
        <!-- 公告栏 -->
        <div class="notice">
          <div class="title">公告栏</div>
          <el-collapse v-model="active">
            <el-collapse-item :name="index + ''" v-for="(item, index) in notices">
              <template #title>
                <span style="font-size: 26px; color: #666">{{ item.name }}</span>
              </template>
              <div style="font-size: 18px;color: #888">{{ item.content }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <!-- 宠物列表 -->
        <div class="pet">
          <div class="title">宠物一览</div>
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
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 分页器 -->
        <div class="pagination">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 10]"
            :background="true" layout=" prev, pager, next, jumper, ->, sizes, total" :total="total"
            @current-change="getHasPet" @size-change="handler" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="FHome">
import FHeader from '@/frontLayout/fheader/index.vue'
import { onMounted, ref } from 'vue';
import { reqSearchPet } from '@/api/pet';
import type { FrontNotice } from '@/api/front/type';
import type { Pet } from '@/api/pet/type';
import { reqSearchFrontNotice } from '@/api/front';
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//存储全部宠物数据
let tableData = ref<Pet[]>([])
let notices = ref<FrontNotice[]>([])
let active = ref(['0', '1'])
//获取全部已有宠物信息
const getHasPet = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSearchPet({
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    }
  })
  if (result.code == 200) {
    total.value = result.data.total
    tableData.value = result.data.records
  }
  let result2 = await reqSearchFrontNotice()
  if (result2.code == 200) {
    notices.value = result2.data
  }
}
onMounted(() => {
  getHasPet()
})
//分页器下拉菜单
const handler = () => {
  getHasPet()
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_top {
    width: 100%;
    height: 62px;
    display: flex;
    align-items: center;
    background: linear-gradient(to right, #c8b4e1, #afd7f7);
    // border-bottom: 1px solid #eee;
  }

  .layout_main {
    background: url(../../../assets/images/front/bg3.jpg) no-repeat;
    background-size: cover;
    background-attachment: fixed;

    .carousel {
      width: 840px;
      margin: 0 auto;
      padding-top: 10px;
    }

    .main {
      width: 840px;
      margin: 0 auto;
      padding-bottom: 10px;
      opacity: 0.8;
      // height: 1000px;
      // background: #1f4b69;
      min-height: calc(100vh - 62px);

      .notice {
        margin: 10px 0;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;

        .title {
          padding: 10px 0;
          font-size: 40px;
          color: #c8a7f0;
        }
      }

      .pet {
        // margin: 10px 0;

        .title {
          padding: 20px 20px;
          font-size: 40px;
          background-color: #fff;
          border-radius: 10px;
          color: #71bbf3;
        }

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
              padding-bottom: 10px
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
        border-radius: 10px
      }
    }
  }
}

a {
  text-decoration: none;
  color: black;
}

.router-link-active {
  text-decoration: none;
}
</style>