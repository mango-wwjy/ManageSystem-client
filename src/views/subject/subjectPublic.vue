<template>
  <div class="app-container">
    <el-input v-model="listQuery.fuzzy" placeholder="请输入检索内容" style="width: 800px;" class="filter-item"></el-input>

    <el-button  class="filter-item"  icon="el-icon-search" circle @click="handleFilter">
    </el-button>

    <el-row :gutter="10" class="mb8">

      <el-col :span="1.5">
        <el-button
          style="margin-top: 5px"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >选择</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="subjectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
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

            <span>{{ row.remark }}</span>

        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="计划人数">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="已选人数">
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


      <el-table-column  label="发布人" prop="releasePeopleName" width="110">


      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >选择课题</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="clickDetail(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


    <el-dialog
      title="课题详情"
      :visible.sync="open "
      width="30%"
      :before-close="cancel">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>课题内容</span>

        </div>
         <div v-html="content">

         </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
    <el-button @click="open = false">关闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

    import Pagination from '@/components/Pagination'
    import {chooseSubject, fetchSubject} from "../../api/student";
    import {fetchDataById} from "../../api/subject";
    export default {
        name: "subjectPublic",
        components: { Pagination },
        data() {
            return {
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 总条数
                total: 0,
                // 表格数据
               subjectList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                listQuery: {

                },
                nowCount:0,
                planCount:0,
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                    page: 1,
                    limit: 10,
                    fuzzy:undefined,
                },
                content:''
            };
        },
        created() {
            this.getList();
        },
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
        methods: {
            /** 查询信息列表 */
            getList() {

                this.loading = true;
                fetchSubject(this.listQuery).then(response => {
                    this.subjectList = response.data.list;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            clickDetail(row){
                this.open=true
                this.content=row.subjectContent
            },
            // 取消按钮
            cancel() {
                this.open = false;

            },
            // 表单重置
            reset() {

            },
            /** 搜索按钮操作 */
            handleFilter() {
                this.getList();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length!=1
                this.multiple = !selection.length
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                const id = row.id || this.ids
                fetchDataById(id).then(response => {
                    this.nowCount = response.data.data.totalNumber
                    this.planCount = response.data.data.subjectNumber
                    if(this.planCount == this.nowCount){
                        this.msgWarn("人数已满，请选择其他课题")

                    }else {
                        this.$confirm('是否确选择此课题', "警告", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(function() {
                            return chooseSubject(id);
                        }).then(response => {
                            if(response.data.code == '0'){
                                this.msgSuccess(response.data.msg)
                            }else {
                                this.msgError(response.data.msg)
                            }
                            this.getList();
                        }).catch(function() {});

                    }

                })


            },
            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {

                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const postIds = row.postId || this.ids;
                this.$confirm('是否确认删除岗位信息编号为"' + postIds + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return delPost(postIds);
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(function() {});
            },

        }
    };
</script>
