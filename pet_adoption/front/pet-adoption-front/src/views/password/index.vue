<template>
  <el-card style="width: 500px;margin: 0 auto;">
    <el-form label-width="120px" :model="passwordParams" :rules="rules" ref="formRef">
      <el-form-item label="原密码" prop="password">
        <el-input v-model="passwordParams.password" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordParams.newPassword" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="passwordParams.confirmPassword" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" name="Password">
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { reqUpdatePassword } from '@/api/password';
//获取本地用户数据
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
//收集活动信息的数据
let passwordParams = reactive({
  username: user.username,
  password: '',
  newPassword: '',
  confirmPassword: '',
})
//form实例
let formRef = ref<any>()
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqUpdatePassword(passwordParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '修改成功'
    })
  } else {
    ElMessage({
      type: 'error',
      message: '修改失败'
    })
  }
}
//校验原密码回调
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 3) {
    callback()
  } else {
    callback(new Error('原密码至少3位'))
  }
}
//校验新密码回调
const validateNewPassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 3) {
    callback()
  } else {
    callback(new Error('新密码至少3位'))
  }
}
//校验确认新密码回调
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length < 3) {
    callback(new Error('确认新密码至少3位'))
  } else if (value !== passwordParams.newPassword) {
    callback(new Error('确认新密码和新密码不一致'))
  } else {
    callback()
  }
}

//表单校验规则
const rules = {
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
  newPassword: [{ required: true, trigger: 'blur', validator: validateNewPassword }],
  confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
}

</script>

<style scoped></style>