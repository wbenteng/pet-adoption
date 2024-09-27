<template>
  <div class="container">
    <div class="pet">
      <div class="img">
        <img :src="pet.img" alt="">
      </div>
      <div class="petInfo">
        <el-card>
          <div style="font-size: 26px;font-weight: bold;">{{ pet.nickname }}</div>
          <div style="line-height: 30px; margin-top: 20px">
            <div style="display: flex">
              <div style="width: 80px"><b>性别:</b></div>
              <div>{{ pet.sex }}</div>
            </div>

            <div style="display: flex">
              <div style="width: 80px"><b>种类:</b></div>
              <div>{{ pet.type }}</div>
            </div>

            <div style="display: flex">
              <div style="width: 80px"><b>年龄:</b></div>
              <div>{{ pet.age }}</div>
            </div>

            <div style="display: flex">
              <div style="width: 80px"><b>活动范围:</b></div>
              <div>{{ pet.address }}</div>
            </div>

            <div style="display: flex">
              <div style="width: 80px"><b>身体状态:</b></div>
              <div>{{ pet.status }}</div>
            </div>

            <div style="display: flex">
              <div style="width: 80px"><b>其他描述:</b></div>
              <div>{{ pet.information }}</div>
            </div>
            <div style="margin-top: 10px; color: red;display: flex">
              <SvgIcon name="catPaw" width="35px" height="35px" style="cursor: pointer" @click="praiseClick"></SvgIcon>
              <span style="display: flex;align-items: center;margin-left: 3px;">{{ pet.praise }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <div style="padding: 30px 0">
      <div style="padding: 10px 0; font-size: 32px; border-bottom: 1px solid #666;">评论
      </div>
      <div style="margin: 10px 0">
        <el-input size="large" type="textarea" v-model="petParams.content" placeholder="请发表评论"></el-input>
        <div style="text-align: right; padding: 10px 0;"><el-button type="primary" size="large"
            @click="saveComment(1)">评论</el-button></div>
      </div>

      <div style="margin: 30px 0">
        <div v-for="item in comments" style="background-color: #fff; padding: 10px; border-radius: 10px;margin: 5px 0;">
          <div style="padding: 10px 0; display: flex; color: #666;  font-size: 14px">
            <div style="width: 100px; text-align: center">
              <el-image :src="item.avatar" style="width: 50px; height: 50px; border-radius: 50%"></el-image>
            </div>
            <div style="flex: 1; line-height: 25px;">
              <div>
                <span style="color: #3F5EFB">{{ item.user }}：</span>
                <span>{{ item.content }}</span>
              </div>
              <div style="font-size: 12px; margin-top: 5px; display: flex">
                <div style="flex: 1"><i class="el-icon-time"></i> <span>{{ item.time }}</span></div>
                <div style="width: 100px; text-align: right">
                  <el-button type="text" @click="handleAddComment(item.id)">回复</el-button>
                  <el-button type="text" @click="delComment(item.id)" style="color: red"
                    v-if="user.nickname === item.user">删除</el-button>
                </div>
              </div>

              <div style="padding-left: 50px; line-height: 25px;">
                <div style="background-color: #eff; padding: 10px 20px;" v-for="subitem in item.children">
                  <div>
                    <span style="color: #3F5EFB">{{ subitem.user }}：</span>
                    <span>{{ subitem.content }}</span>
                  </div>
                  <div style="font-size: 12px; margin-top: 5px; display: flex">
                    <div style="flex: 1"><i class="el-icon-time"></i> <span>{{ subitem.time }}</span></div>
                    <div style="width: 100px; text-align: right">
                      <el-button type="text" @click="delComment(subitem.id)" style="color: red"
                        v-if="user.nickname === subitem.user">删除</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 对话框组件:回复 -->
    <el-dialog v-model="dialogFormVisible" title="回复" :close-on-click-modal="false">
      <el-form label-width="100px" style="width: 80%" ref="formRef">
        <el-form-item label="回复内容">
          <el-input type="textarea" v-model="petParams.contentr" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveComment(2)">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="HomeDetail">
import SvgIcon from '@/components/SvgIcon/index.vue'
import { reqPetDetail, reqAddPetPraise, reqSearchPetComment, reqAddPetComment, reqDeletePetComment } from '@/api/front';
import { Pet } from '@/api/pet/type';
import { Comment } from '@/api/front/type';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
const $route = useRoute()
//存储某个宠物信息
let pet = ref<Pet>({})
let petParams = ref<any>({
  // pid: null,
  // content: '123',
  // contentr: null,
  // type: 0,
  // articleId: null
})
let comments = ref<Comment[]>([])
//存储该宠物id
let id = $route.query.id
//标记是否点赞过
let praise = ref(false)
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {}
//对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//获取全部已有宠物信息
const getHasPet = async () => {
  let result = await reqPetDetail(id)
  if (result.code == 200) {
    pet.value = result.data
  }
}
const getComment = async () => {
  let result = await reqSearchPetComment(id)
  if (result.code == 200) {
    comments.value = result.data
  }
}
onMounted(() => {
  getHasPet()
  getComment()
})
const praiseClick = async () => {
  if (praise.value) {
    return
  }
  (pet.value.praise as number) += 1
  let result = await reqAddPetPraise(pet.value)
  if (result.code == 200) {
    getHasPet()
    praise.value = true
  }
}
const handleAddComment = (pid: any) => {
  dialogFormVisible.value = true
  petParams.value.pid = pid
}
const delComment = async (id: number) => {
  let result = await reqDeletePetComment(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getComment()
  }
  else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
const saveComment = async (index: any) => {
  if (!user.username) {
    ElMessage({
      type: 'warning',
      message: '请登录后评论'
    })
    return
  }
  // if (petParams.value.contentr) {
  //   petParams.value.content = petParams.value.contentr
  // }
  if (index === 1) {
    if (!petParams.value.content) {
      ElMessage({
        type: 'warning',
        message: '请输入评论'
      })
      return
    }
  }
  else {
    if (!petParams.value.contentr) {
      ElMessage({
        type: 'warning',
        message: '请输入回复'
      })
      return
    }
    petParams.value.content = petParams.value.contentr
  }
  petParams.value.type = 1
  petParams.value.articleId = id
  console.log(petParams.value);

  let result = await reqAddPetComment(petParams.value)
  if (result.code == 200) {
    dialogFormVisible.value = false
    // Object.assign(petParams.value, {
    //   pid: null,
    //   content: null,
    //   contentr: null,
    //   type: 0,
    //   articleId: null
    // })
    petParams.value = {}
    ElMessage({
      type: 'success',
      message: '回复成功'
    })
    getComment()
  }
  else {
    ElMessage({
      type: 'error',
      message: '回复失败'
    })
  }
}
</script>

<style scoped>
.container {
  .pet {
    display: flex;

    .img {
      display: flex;
      align-items: center;
      margin-left: 10px;

      img {
        width: 300px;
        height: 260px;
        border-radius: 10px;
      }
    }

    .petInfo {
      padding-left: 30px;
      width: 500px;

      b {
        font-weight: bold;
      }
    }
  }
}
</style>