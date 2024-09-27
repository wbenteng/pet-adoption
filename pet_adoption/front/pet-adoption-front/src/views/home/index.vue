<template>
  <el-card>
    <div class="box">
      <img :src="user.avatarUrl" alt="" class="avatar">
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好,{{ user.nickname }}</h3>
        <p class="subtitle">喵星球宠物领养系统</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';
import { onMounted, ref } from 'vue';
import *as echarts from 'echarts'
import { reqMembers } from '@/api/echarts';
let userStore = useUserStore()
//获取本地用户数据
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
let charts = ref()
onMounted(async () => {
  let mycharts = echarts.init(charts.value)
  let option = {
    title: {
      text: '各季度系统注册人数统计',
      subtext: '比例图',
      left: 'center',
      textStyle: {
        color: 'white',
        fontSize: 22
      },
      subtextStyle: {
        color: 'black',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      right: 20,
      top: 40,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 16
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold'
        //   }
        // },
        labelLine: {
          show: false
        },
        data: [
          { value: 1, name: '蜡笔小新' },
          { value: 2, name: '哆啦A梦' },
          { value: 3, name: '火影忍者' },
          { value: 2, name: '海贼王' },
          { value: 1, name: '五等分的花嫁' }
        ]
      }
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  };
  let result = await reqMembers()
  // console.log(result);
  if (result.code == 200) {
    option.series[0].data = [
      { value: result.data[0], name: "第一季度" },
      { value: result.data[1], name: "第二季度" },
      { value: result.data[2], name: "第三季度" },
      { value: result.data[3], name: "第四季度" }
    ];
    mycharts.setOption(option)
  }
})
</script>
<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 40px;
      font-weight: 900;
      margin-bottom: 20px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottoms {
  margin-top: 20px;
  padding: 30px;
  background: url(../../assets/images/background.jpg) no-repeat;
  background-size: cover;
  height: 70%;

  .charts {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
