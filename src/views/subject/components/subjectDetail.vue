<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
        <el-button v-show="isEdit" v-loading="loading" type="warning" @click="draftForm">
          停止
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="subjectName">
              <MDinput v-model="postForm.subjectName" :maxlength="100" name="name" required>
                课题名称
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>

                <el-col :span="8">
                  <el-form-item label-width="90px" label="发布范围:" class="postInfo-container-item">
                    <el-select v-model="postForm.collegeId" placeholder="请选择所属学院">
                      <el-option
                        v-for="item in collegeOptions"
                        :key="item.collegeCode"
                        :label="item.collegeName"
                        :value="item.collegeCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>


                <el-col :span="8">
                  <el-form-item label-width="90px" label="课题人数:" class="postInfo-container-item">
                    <el-input-number v-model="postForm.subjectNumber" @change="handleChange"  :min="minNumber" :max="10" label="描述文字"></el-input-number>

                  </el-form-item>
                </el-col>


                <el-col :span="6">
                  <el-form-item label-width="90px" label="课题期限:" class="postInfo-container-item">
                    <el-date-picker type="daterange" v-model="postForm.dateRangeSelection" format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
                                    end-placeholder="结束日期" range-separator="至" clearable @input="timeChange"></el-date-picker>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="90px" label="课题概述:">
          <el-input v-model="postForm.remark" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入课题概述" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="subjectContent" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.subjectContent" :height="400" />
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
    import {addAndUpdateData, fetchDataById} from "../../../api/subject";
    import {getCollegeDict} from "../../../api/common";


    const defaultForm = {
        status: 'draft',
        subjectName:'',
        releasePeople: '', // 文章题目
        display_time: undefined, // 前台展示时间
        id: undefined,
        subjectNumber: 1,
        collegeId:'',
        remark:'',
        subjectContent:'',
        releaseTime:'',
        startTime:'',
        endTime:'',
        subjectType:'',
        manageTime:'',
        manageUser:'',
        totalNumber:0,
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
                if (value == '') {
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
                    subjectName: [{ validator: validateRequire }],
                    subjectContent: [{ validator: validateRequire }],
                },
                tempRoute: {},
                collegeOptions:[],
                minNumber:1,
            }
        },
        computed: {
            contentShortLength() {
                return this.postForm.remark.length
            },
        },
        created() {
            if (this.isEdit) {
                const id = this.$route.query.id
                this.fetchData(id)
            }
            this.initData()
            this.tempRoute = Object.assign({}, this.$route)
        },
        methods: {
            initData(){
                getCollegeDict().then(response => {
                    this.collegeOptions = response.data.data
                })
            },
            fetchData(id) {
                fetchDataById(id).then(response => {
                    this.postForm = response.data.data

                    this.$set(this.postForm, "dateRangeSelection", [this.postForm.startTime,
                        this.postForm.endTime]);

                }).catch(err => {
                    console.log(err)
                })
            },

            handleChange(value){
                  if(this.isEdit){
                      console.log(value)
                      console.log(this.postForm.totalNumber)
                    if(value == this.postForm.totalNumber){
                        this.minNumber = Number(this.postForm.totalNumber)
                        this.msgWarn("计划人数不得少于实际人数")
                    }
                   }
            },

            submitForm() {
                this.$refs.postForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.postForm.status = 'success'
                        let data = this.postForm.dateRangeSelection;
                        this.postForm.startTime=data[0];
                        this.postForm.endTime=data[1];
                        addAndUpdateData(this.postForm).then(response =>{
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
                if (this.postForm.subjectContent.length === 0 || this.postForm.subjectName.length === 0) {
                    this.$message({
                        message: '请填写必要的标题和内容',
                        type: 'warning'
                    })
                    return
                }
                this.postForm.status = 'stop'
                let data = this.postForm.dateRangeSelection;
                this.postForm.startTime=data[0];
                this.postForm.endTime=data[1];
                addAndUpdateData(this.postForm).then(response =>{
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

            timeChange(e) {
                if(e){
                    this.$nextTick(() => {
                        this.postForm.dateRangeSelection = null;
                        this.$set(this.postForm, "dateRangeSelection", [e[0], e[1]]);
                    });
                }

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
