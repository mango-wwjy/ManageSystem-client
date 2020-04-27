<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.authId" placeholder="学号/工号" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.userName" placeholder="用户账号" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.fuzzy" placeholder="请输入检索内容" style="width: 200px;" class="filter-item"></el-input>

      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button  :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :data="list"
      border
      fit
      v-loading="listLoading"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="用户账号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userEmail"
        label="邮箱">
      </el-table-column>

      <el-table-column
        prop="userPhone"
        label="手机号">
      </el-table-column>

      <el-table-column
        prop="introduction"
        label="个人简介">
      </el-table-column>

      <el-table-column
        prop="userPassword"
        label="用户密码">
      </el-table-column>

      <el-table-column
        prop="statusName"
        label="账户状态">

      </el-table-column>

     <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="{row,$index}">
        <el-button type="primary" size="mini" @click="handleUpdate(row)">
          编辑
        </el-button>
        <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
          删除
        </el-button>
      </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="userInfo" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="realName" placeholder="请输入姓名">
          <el-input class="filter-item" v-model="userInfo.realName" />

        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="userInfo.userPhone"  placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userInfo.userEmail" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="userInfo.userPassword" placeholder="请输入密码"/>
        </el-form-item>

        <el-form-item label="个人简介" prop="introduction" label-width="80px">
          <el-input v-model="userInfo.introduction" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入个人简介" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate()">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
    import Pagination from '@/components/Pagination'
    import {fetchUser, exportUser, updateUser, deleteUser} from "../../api/user";
    import {validateIsEmail, validateIsPhone} from "../../utils/validate"; // secondary package based on el-pagination


    export default {
        name:'UserInfo',
        components: { Pagination },
        data() {
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码至少 6 位数'))
                } else {
                    callback()
                }
            }
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

            }
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

            }
            return {
                list: null,
                total: 0,
                listLoading: true,
                downloadLoading:false,
                listQuery: {
                    page: 1,
                    limit: 10,
                    userName:undefined,
                    authId:undefined,
                    fuzzy:undefined
                },
                rules: {
                    realName: [{required: true, trigger: 'blur',message:'请输入姓名'}],
                    userPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
                    userPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
                    userEmail: [{ required: true, trigger: 'blur', validator: validateEmail }],
                    introduction:[{required: true, trigger: 'blur',message:'请输入个人简介'},
                        {max:30,message:'最多可输入100位'}
                    ]


                },
                dialogFormVisible:false,
                userInfo: {
                    id:undefined,
                    realName:undefined,
                    userEmail:undefined,
                    userPhone:undefined,
                    userPassword:undefined,
                    introduction:undefined,
                },
            }
        },
        created() {
            this.getList()
        },
        methods:{
            getList() {
                this.listLoading = true
                fetchUser(this.listQuery).then(response => {
                    this.list = response.data.list
                    this.total = response.data.total

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 1000)
                })
            },
            handleFilter(){
                this.getList();
            },
            handleUpdate(row){
                this.userInfo = Object.assign({},row)
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })

            },
            handleDelete(row, index){
                this.$confirm('是否确认删除该用户，如果删除，该用户的数据将不能回复，请确认！', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteUser(row.id);
                }).then(response => {

                    if(response.data.code == '0'){
                        this.msgSuccess(response.data.msg)
                    }else {
                        this.msgError(response.data.msg)
                    }
                    this.getList();

                }).catch(function() {});

            },
            cancelUpdate(){
             this.dialogFormVisible = false
            },
            updateData(){
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const userData = Object.assign({}, this.userInfo)
                        updateUser(userData).then(response => {
                            if(response.data.code =='0'){
                                this.msgSuccess(response.data.msg)
                                this.getList();
                                this.dialogFormVisible = false
                            }else{
                                this.msgError(response.data.msg)
                            }
                            this.dialogFormVisible = false

                        })
                    }
                })
            },
            handleDownload(){
                this.downloadLoading=true
                this.$confirm('是否确认导出所有用户数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return exportUser();
                }).then(response => {
                    this.download(response.data.msg);
                    this.downloadLoading=false
                }).catch(function() {});
            }
        }
    }
</script>
