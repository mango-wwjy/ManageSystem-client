<template>
  <el-form :model="userForm" :rules="rules" ref="userForm">
    <el-form-item label="账户名">
      <el-input v-model.trim="userForm.userName" :disabled="true"/>
    </el-form-item>

    <el-form-item label="姓名" v-if="user.realName">
      <el-input v-model.trim="userForm.realName" :disabled="true"/>
    </el-form-item>

    <el-form-item label="邮箱"  v-if="user.email">
      <el-input v-model.trim="userForm.userEmail" />
    </el-form-item>

    <el-form-item label="联系方式"  v-if="user.phone">
      <el-input v-model.trim="userForm.userPhone" />
    </el-form-item>

    <el-form-item label="个人简介" >
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4}"
      placeholder="请输入您的个人简介"
      v-model="userForm.introduction">
    </el-input>
    </el-form-item>
    <el-form-item :label="passwordTitle">
      <el-button icon="el-icon-rank" circle @click="clickShowPassword" v-show="showRank"></el-button>
      <el-button icon=" el-icon-close" circle @click="clickClosePassword" v-show="showClose"></el-button>

    </el-form-item>

    <el-form-item label="密码" prop="userPassword" v-show="showPassword">
      <el-input type="password" v-model="userForm.userPassword" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass" v-show="showPassword">
      <el-input type="password" v-model="userForm.checkPass" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    import {validateIsEmail, validateIsPhone} from "../../../utils/validate";
    import {getUserInfo, updateUserOwn} from "../../../api/user";

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
            realName:'',
            name: '',
            email: '',
            avatar: '',
            role: '',
            phone:'',
            introduction:''
        }
      }
    }
  },

    data(){
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if(value.length < 6){
                    callback(new Error('密码至少 6 位数'))
                }
                if (this.userForm.checkPass !== '') {
                    this.$refs.userForm.validateField('checkPass');
                }
                callback();
            }
        };
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.userForm.userPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        const validatePhone = (rule, value, callback) => {
            if(value){
                if (!validateIsPhone(value)) {
                    callback(new Error('请输入正确的手机号格式'))
                } else {
                    callback()
                }
            }else {
                callback("请填写手机号")
            }

        };
        const validateEmail = (rule, value, callback) => {
            if(value){
                if (!validateIsEmail(value)) {
                    callback(new Error('请输入正确的邮箱格式'))
                } else {
                    callback()
                }
            }else {
                callback("请填写邮箱")
            }

        };
        return {
            userForm:{},
            rules: {
                userPassword: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],

                userPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
                userEmail: [{ required: true, trigger: 'blur', validator: validateEmail }],
                introduction:[{required: true, trigger: 'blur',message:'请输入信息'},
                    {max:30,message:'最多可输入100位'}
                ]
            },
            showPassword:false,
            showRank:true,
            showClose:false,
            passwordTitle:'点击修改密码'
        }

    },
    created(){
      this.getUser();
    },
  methods: {
      getUser(){
        this.userForm={
            userName: this.user.name ,
            realName:this.user.realName,
            userEmail: this.user.userEmail,
            avatar: this.user.avatar,
            introduction:this.user.introduction,
            userPhone:this.user.userPhone,
            checkPass:'',
            userPassword: ''
        }
          getUserInfo(this.$store.getters.token).then(response => {
              const { data } = response

              const { userName, realName, userEmail, userPhone,  introduction } = data
              this.userForm.realName=realName
              this.userForm.userName=userName
              this.userForm.userEmail=userEmail
              this.userForm.userPhone=userPhone
              this.userForm.introduction=introduction
          })
      },
      clickShowPassword(){
        this.showPassword=true
        this.showRank=false
        this.showClose=true
        this.passwordTitle='点击关闭修改密码'
      },
      clickClosePassword(){
        this.showPassword=false
        this.showRank=true
        this.showClose=false
        this.passwordTitle='点击修改密码'
          this.$nextTick(() => {
              this.$refs['userForm'].clearValidate()
          })
      },
      async logout() {
          await this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      },
    submit() {
          if(this.showPassword){
              this.$refs['userForm'].validate((valid) => {
                  if (valid) {

                      if(this.$store.getters.userEmail){
                          if(this.userForm.userEmail){
                              if(!validateIsEmail(this.userForm.userEmail)){
                                  this.msgError('请输入正确的邮箱格式')
                                  return
                              }
                          }else {
                              this.msgError('请输入邮箱')
                              return;
                          }

                          if(this.userForm.userPhone){
                              if(!validateIsPhone(this.userForm.userPhone)){
                                  this.msgError('请输入正确的手机号格式')
                                  return
                              }
                          }else {
                              this.msgError('请输入联系方式')
                              return;
                          }
                      }
                      updateUserOwn(this.userForm).then(response => {
                          if(response.data.code =='0'){

                                  getUserInfo(this.$store.getters.token).then(response => {
                                  const { data } = response
                                  const { userName, realName, userEmail, userPhone,  introduction } = data
                                  this.userForm.realName=realName
                                  this.userForm.userName=userName
                                  this.userForm.userEmail=userEmail
                                  this.userForm.userPhone=userPhone
                                  this.userForm.introduction=introduction
                              })
                              this.msgSuccess('更新信息已经密码成功！请重新登陆')
                              this.logout();

                          }else {
                              this.msgError(response.data.msg)
                          }
                      })
                  } else {
                      console.log('error submit!!');
                      return false;
                  }
              })
          }else {
              if(this.$store.getters.userEmail){
                  if(this.userForm.userEmail){
                      if(!validateIsEmail(this.userForm.userEmail)){
                          this.msgError('请输入正确的邮箱格式')
                          return
                      }
                  }else {
                      this.msgError('请输入邮箱')
                      return;
                  }

                  if(this.userForm.userPhone){
                      if(!validateIsPhone(this.userForm.userPhone)){
                          this.msgError('请输入正确的手机号格式')
                          return
                      }
                  }else {
                      this.msgError('请输入联系方式')
                      return;
                  }
              }


              updateUserOwn(this.userForm).then(response => {
                  if(response.data.code =='0'){
                      getUserInfo(this.$store.getters.token).then(response => {
                          const { data } = response

                          const { userName, realName, userEmail, userPhone,  introduction } = data
                          this.userForm.realName=realName
                          this.userForm.userName=userName
                          this.userForm.userEmail=userEmail
                          this.userForm.userPhone=userPhone
                          this.userForm.introduction=introduction


                      })
                      this.$store.dispatch("user/getInfo")
                      this.$forceUpdate();
                      this.msgSuccess(response.data.msg)


                  }else {
                      this.msgError(response.data.msg)
                  }
              })
          }
  ;
    }
  }
}
</script>
