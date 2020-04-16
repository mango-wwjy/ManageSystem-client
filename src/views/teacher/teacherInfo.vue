<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="学号" style="width: 200px;" class="filter-item"></el-input>
      <el-input placeholder="学生姓名" style="width: 200px;" class="filter-item"></el-input>
      <el-input placeholder="请输入检索内容" style="width: 200px;" class="filter-item"></el-input>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left:20px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        增加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>

</template>

<script>
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination


    export default {
        name:'TeacherInfo',
        components: { Pagination },
        data() {
            return {
                list: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                total: 0,
                listLoading: true,
                downloadLoading:false,
                listQuery: {
                    page: 1,
                    limit: 10,
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
            },
            handleCreate(){

            },
            handleFilter(){

            },
            handleDownload(){

            }
        }
    }
</script>
