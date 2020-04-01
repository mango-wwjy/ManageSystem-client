<template>



  <div class="login-container">
    <vue-particles
      id="particles-js"
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <el-collapse-transition>

      <el-form v-show="loginOpen" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">毕业生信息管理系统</h3>
        </div>

        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>
      <el-row :gutter="20">
        <el-col :span="18">
           <el-form-item prop="randomCode" style="width: 300px;">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
             <el-input
               ref="randomCode"
               v-model="loginForm.randomCode"
               placeholder="请输入验证码"
               name="username"
               type="text"
               tabindex="1"
               auto-complete="on"
             />

           </el-form-item>
        </el-col>

        <el-col :span="6">
           <input type="button"  @click="createCode"  class="verification" v-model="checkCode"/>
        </el-col>
      </el-row>


        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>



        <div class="tips">
          <el-link type="info" disabled>还没有账号吗？点击</el-link>
          <el-link type="primary" @click="openRegister">注册</el-link>

        </div>

      </el-form>
    </el-collapse-transition>

    <el-form  ref="registerForm" :model="registerForm" :rules="registerRules" v-show="open" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="username">
      <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
      <el-input
        ref="username"
        v-model="loginForm.username"
        placeholder="请输入用户名"
        name="username"
        type="text"
        tabindex="1"
        auto-complete="on"
      />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item prop="randomCode" style="width: 300px;">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
            <el-input
              ref="randomCode"
              v-model="loginForm.randomCode"
              placeholder="请输入验证码"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />

          </el-form-item>
        </el-col>

        <el-col :span="6">
          <input type="button"  @click="createCode"  class="verification" v-model="checkCode"/>
        </el-col>
      </el-row>


      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>



      <div class="tips">
        <el-link type="info" disabled>已经有账号？点击</el-link>
        <el-link type="primary" @click="openLogin">登录</el-link>

      </div>

    </el-form>


  </div>

</template>

<script>


export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少 6 位数'))
      } else {
        callback()
      }
    }
    const validateCode=(rule, value, callback) =>{
        if(value){
            if(value!==this.checkCode){
                callback(new Error('验证码输入错误'))
            }else {
                callback()
            }

        }else if(!value){
            callback("请输入验证码")
        }else {
            callback()
        }
    }
    return {
        loginForm: {
          username: '',
          randomCode:'',
          password: ''
      },
        registerForm:{

        },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        randomCode:[{required:true,trigger:'blur',validator: validateCode}]
      },
        registerRules:{

        },
      loading: false,
      passwordType: 'password',
      redirect: undefined,

        checkCode:'',
        open:false,
        loginOpen:true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
    mounted(){

    },
    created(){
      this.createCode();
    },
  methods: {
    openRegister(){
        this.open=true
        this.loginOpen=false
    },
    openLogin(){
      this.open=false
      this.loginOpen=true
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
              // if(){
              //     this.$message({
              //         message: '登陆成功',
              //         type: 'success',
              //         duration: 3000
              //     })
              // }

          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
      createCode(){
          //先清空验证码的输入
          this.code = "";
          this.checkCode = "";
          this.randomCode = "";
          //验证码的长度
          var codeLength = 4;
          //随机数
          var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
          for(var i = 0; i < codeLength; i++) {
              //取得随机数的索引（0~35）
              var index = Math.floor(Math.random()*36);
              //根据索引取得随机数加到code上
              this.code += random[index];
          }
          //把code值赋给验证码
          this.checkCode = this.code;

      }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

}

#particles-js{
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;   //设置absolute,其他DIV设置为relative，这样这个例子效果就作为背景
}
.yanzhengma_input{
  font-family: 'Exo 2', sans-serif;
  border: 1px solid #fff;
  color: #fff;
  outline: none;
  border-radius: 12px;
  letter-spacing: 1px;
  font-size: 17px;
  font-weight: normal;
  background-color: rgba(82, 56, 76, 0.15);
  padding: 5px 0 5px 10px;
  margin-left: 30px;
  height: 30px;
  margin-top: 25px;
  border: 1px solid #e6e6e6;
}

.captcha{
  height: 50px;
  text-align: justify;
}
.verification{
  border-radius: 12px;
  width:100px;
  letter-spacing:5px;
  margin-top: 6px;
  height: 40px;
  transform: translate(-15px,0);
}

</style>
