<template>
  <el-card style="width: 500px;margin: 0 auto;">
    <el-form style="width: 80%;" label-width="80px" ref="formRef">
      <el-form-item style="display: flex;">
        <el-upload class="avatar-uploader" action="api/file/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" style="margin:0 auto;">
          <img v-if="personParams.avatarUrl" :src="personParams.avatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="用户名">
        <el-input v-model="personParams.username" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="personParams.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="personParams.sex" label="男">男</el-radio>
        <el-radio v-model="personParams.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker clearable style="width: 80%" v-model="personParams.birth" type="date" value-format="YYYY-MM-DD"
          placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="personParams.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="personParams.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="personParams.address" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="defult" @click="save">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" name="Person">
import { ElMessage, UploadProps } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { reqSearchPerson, reqUpdatePerson } from '@/api/person';
// //引入用户相关的小仓库
// import useUserStore from '@/store/modules/user'
// let userStore = useUserStore()
//获取本地用户数据
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
// let user = userStore.user
//收集活动信息的数据
let personParams = reactive({
  id: '',
  avatarUrl: '',
  username: '',
  nickname: '',
  sex: '',
  birth: '',
  email: '',
  phone: '',
  address: '',
})
//form实例
let formRef = ref<any>()
//获取用户信息
const getHasPerson = async () => {
  let result = await reqSearchPerson(user.username)
  // console.log(result);
  if (result.code == 200) {
    Object.assign(personParams, result.data)
  }
}
onMounted(() => {
  getHasPerson()
})
//保存按钮的回调
const save = async () => {
  //校验表单是否通过
  await formRef.value.validate()
  //发请求
  let result: any = await reqUpdatePerson(personParams)
  // console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '保存成功'
    })
    let result2 = await reqSearchPerson(user.username)
    if (result.code == 200) {
      // Object.assign(personParams, result2.data)
      // result2.token = JSON.parse(localStorage.getItem("user") as string).token
      user.nickname = result2.data.nickname
      user.avatarUrl = result2.data.avatarUrl
      localStorage.setItem("user", JSON.stringify(user))
      window.location.reload()
    }
  } else {
    ElMessage({
      type: 'error',
      message: '保存失败'
    })
  }
}
//上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif' &&
    rawFile.type !== 'image/webp' &&
    rawFile.type !== 'image/jpg'
  ) {
    ElMessage.error('请上传图片格式为.jpeg,.png,.gif,.jpg的图片!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('上传文件大小不能大于4M!')
    return false
  }
  return true
}
//图片上传成功触发的钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response: any,
  uploadFile,
) => {
  //收集上传图片的地址
  personParams.avatarUrl = response
  //清除图片校验结果
  formRef.value.clearValidate('img')
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