<template>
  <div class="login_container">
    <div class="top">喵星球宠物领养系统</div>
    <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
      <h1>Hello</h1>
      <h2>欢迎来到喵星球宠物领养系统</h2>
      <el-form-item prop="username">
        <el-input placeholder="请输入用户名" :prefix-icon="User" v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input placeholder="请输入密码" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="warning" size="default" @click="$router.push('/register')">前往注册</el-button>
        <el-button type="primary" size="default" :loading="loading" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="login">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
//引入获取当前时间的函数
import { getTime } from '@/utils/time'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
//获取路由器
let $router = useRouter()
//获取路由对象
let $route = useRoute()
//定义变量控制按钮加载效果
let loading = ref(false)
//收集账号与密码的数据
let loginForm = reactive({
  username: 'admin',
  password: '123456',
})
//自定义校验规则函数
const validateUserName = (rule: any, value: any, callback: any) => {
  // rule:即为校验规则对象
  // value:即为表单元素文本内容
  //函数:如果符合条件callBack放行通过即为
  //如果不符合条件callBack方法,注入错误提示信息
  if (value.length >= 3) {
    callback()
  } else {
    callback(new Error('用户名至少3位'))
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码至少6位'))
  }
}
//定义表单校验需要的配置对象
const rules = {
  username: [
    { validator: validateUserName, trigger: 'blur' },
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' },
  ],
}
//获取el-form组件
let loginForms = ref()
//登录按钮的回调
const login = async () => {
  //保证全部表单项校验通过再发请求
  await loginForms.value.validate()
  //加载效果：开始加载
  loading.value = true
  try {
    await userStore.userLogin(loginForm)
    //编程式导航跳转到首页
    //判断登录的时候，路由路径当中是否有query参数
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    //登录成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`,
    })
    //登录成功，加载效果消失
    loading.value = false
  } catch (error) {
    //登录失败，加载效果消失
    loading.value = false
    //登录失败提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background2.jpg') no-repeat;
  background-size: cover;

  .top {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    padding-left: 50px;
    color: white;
    background-color: rgba(0, 0, 0, 0.2)
  }

  .login_form {
    width: 30%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }

    .btn {
      float: right;
    }
  }
}
</style>