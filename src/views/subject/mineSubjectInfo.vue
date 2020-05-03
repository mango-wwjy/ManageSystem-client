<template>
  <div class="app-container">



    <div class="filter-container">
      <el-input v-model="listQuery.fuzzy" placeholder="请输入检索内容" style="width: 800px;" class="filter-item"></el-input>

      <el-button  class="filter-item"  icon="el-icon-search" circle @click="handleFilter">
      </el-button>
    </div>




    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">


      <el-table-column width="120px" align="center" label="课题名称">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="课题范围">
        <template slot-scope="scope">
          <span>{{ scope.row.collegeName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="课题概述">
        <template slot-scope="{row}">
          <router-link :to="{path:'/subject/editSubject/',query:{id:row.id}}" class="link-type">
            <span>{{ row.remark }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="计划人数">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="实际人数">
        <template slot-scope="scope">
          <span>{{ scope.row.totalNumber }}</span>
        </template>
      </el-table-column>

        <el-table-column width="150px" align="center" label="开始时间">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime | parseTime('{y}-{m}-{d} ') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="结束时间">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} ') }}</span>
          </template>
        </el-table-column>


      <el-table-column width="170px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.releaseTime | parseTime('{y}-{m}-{d} ') }}</span>
        </template>
      </el-table-column>


      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.statusName}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="{path:'/subject/editSubject/',query:{id:scope.row.id}}">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {fetchOwnData} from "../../api/subject"; // Secondary package based on el-pagination

    export default {
        name: 'mineSubjectInfo',
        components: { Pagination },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    success: 'success',
                    stop: 'info',
                    deleted: 'danger'
                }
                return statusMap[status]
            }
        },
        data() {
            return {
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    fuzzy:''
                }
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true
                fetchOwnData(this.listQuery).then(response => {
                    this.list = response.data.list
                    this.total = response.data.total
                    this.listLoading = false
                })
            },
            handleFilter(){
                this.getList();
            },
        }
    }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
