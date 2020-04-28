<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          草稿
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.noticeTitle" :maxlength="100" name="name" required>
                公告题目
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="作者:" class="postInfo-container-item">
                    <el-input v-model="postForm.manageUser" placeholder="请输入作者">
                    </el-input>
                  </el-form-item>
                </el-col>


                <el-col :span="6">
                  <el-form-item label-width="90px" label="重要性:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.noticeReading"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display:inline-block"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="90px" label="文章简介:">
          <el-input v-model="postForm.noticeType" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入文章简介" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.noticeContent" :height="400" />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    import MDinput from '@/components/MDinput'
    import Sticky from '@/components/Sticky' // 粘性header组件
    import Warning from './Warning'
    import {fetchNoticeById, insertNoticeInfo} from "../../../api/notice";


    const defaultForm = {
        status: 'draft',
        noticeId:'',
        noticeTitle: '', // 文章题目
        display_time: undefined, // 前台展示时间
        id: undefined,
        noticeReading: 0,
        noticeType:'',
        authId:'',
        noticeContent:''
    }

    export default {
        name: 'ArticleDetail',
        components: { Tinymce, MDinput, Sticky, Warning },
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            const validateRequire = (rule, value, callback) => {
                if (value === '') {
                    this.$message({
                        message: rule.field + '为必传项',
                        type: 'error'
                    })
                    callback(new Error(rule.field + '为必传项'))
                } else {
                    callback()
                }
            }

            return {
                postForm: Object.assign({}, defaultForm),
                loading: false,
                userListOptions: [],
                rules: {
                    image_uri: [{ validator: validateRequire }],
                    title: [{ validator: validateRequire }],
                    content: [{ validator: validateRequire }],
                },
                tempRoute: {}
            }
        },
        computed: {
            contentShortLength() {
                return this.postForm.noticeType.length
            },
        },
        created() {
            if (this.isEdit) {
                const id = this.$route.query.id
                this.fetchData(id)
            }
            21
            this.tempRoute = Object.assign({}, this.$route)
        },
        methods: {
            fetchData(id) {
                fetchNoticeById(id).then(response => {
                    debugger
                    this.postForm = response.data.data
                }).catch(err => {
                    console.log(err)
                })
            },

            submitForm() {
                this.$refs.postForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.postForm.status = 'published'
                        insertNoticeInfo(this.postForm).then(response =>{
                             if(response.data.code=='0'){
                                 this.$notify({
                                     title: '成功',
                                     message: response.data.message,
                                     type: 'success',
                                     duration: 2000
                                 })
                                 this.loading = false
                             }
                        })


                    } else {
                        console.log('错误的提交!!')
                        return false
                    }
                })
            },
            draftForm() {
                if (this.postForm.noticeContent.length === 0 || this.postForm.noticeTitle.length === 0) {
                    this.$message({
                        message: '请填写必要的标题和内容',
                        type: 'warning'
                    })
                    return
                }
                this.postForm.status = 'draft'
                insertNoticeInfo(this.postForm).then(response =>{
                    if(response.data.code=='0'){
                        this.$notify({
                            title: '成功',
                            message: response.data.message,
                            type: 'success',
                            duration: 2000
                        })
                        this.loading = false
                    }
                })

            },

        }
    }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
