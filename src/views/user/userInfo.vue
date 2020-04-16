<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.authId" placeholder="学号/工号" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.userName" placeholder="用户账号" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.fuzzy" placeholder="请输入检索内容" style="width: 200px;" class="filter-item"></el-input>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
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
        prop="userPassword"
        label="用户密码">
      </el-table-column>

      <el-table-column
        prop="status"
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
  </div>

</template>

<script>
    import Pagination from '@/components/Pagination'
    import {fetchUser,exportUser} from "../../api/user"; // secondary package based on el-pagination


    export default {
        name:'UserInfo',
        components: { Pagination },
        data() {
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
            handleUpdate(){

            },
            handleDelete(){

            },
            handleDownload(){
                this.$confirm('是否确认导出所有用户数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return exportUser();
                }).then(response => {
                    this.download(response.data.msg);
                }).catch(function() {});
            }
        }
    }
</script>
