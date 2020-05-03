<template>
  <div class="mainClass">
    <el-row :gutter="20" >
      <el-col :span="6">
        <el-input
          style="margin-top: 20px"
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>

        <el-tree
          class="expand-tree"
          node-key="id"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          highlight-current
          :expand-on-click-node="false"
          :default-expand-all="true"
          @node-click="handleNodeClick"
          ref="tree">
        </el-tree>
      </el-col>
      <el-col :span="16">
        <div class="filter-main-container">
          <el-input  placeholder="请输入检索内容" v-model="listQuery.fuzzy" style="width: 800px;" class="filter-item"></el-input>

          <el-button  class="filter-item"  icon="el-icon-search" circle @click="handleFilter">
          </el-button>
        </div>

        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="studentNumber"
            label="学号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="studentEmail"
            label="邮箱">
          </el-table-column>

          <el-table-column
            prop="studentPhone"
            label="电话">
          </el-table-column>

          <el-table-column
            prop="subjectName"
            label="课题名称">
          </el-table-column>

        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </el-col>

    </el-row>


  </div>
</template>
<script>
    import {fetchTree,fetchMineClass} from "../../api/classInfo";
    import Pagination from '@/components/Pagination'
    export default {
        components: { Pagination },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },

        methods: {
            tree(){
                fetchTree().then(res => {
                    let tree = []

                    tree=res.data.data
                    if(tree.length>0){
                        debugger

                        this.data = [{
                            className:'我的班级',
                            id:'ROOT',
                            children:tree
                        }]
                        this.listQuery.classCode=tree[0].classCode
                        this.getList()
                    }

                })

            },
            filterNode(value, data) {
                if (!value) return true;
                return data.className.indexOf(value) !== -1;
            },
            handleNodeClick(data,node){
                if(data.id && data.id!='ROOT'){
                    this.listQuery.classCode=data.classCode
                    this.getList();
                }
            },
            handleFilter(){
             this.getList();
            },
            getList(){
                if(this.listQuery.classCode){
                    fetchMineClass(this.listQuery).then(response => {
                        this.tableData = response.data.list
                        this.total = response.data.total
                    })
                }
            }
        },
        created(){
            this.tree();
        },
        data() {
            return {
                filterText: '',
                data: [],
                tableData:[],
                defaultProps: {
                    children: 'children',
                    label: 'className'
                },
                listQuery: {
                    page: 1,
                    limit: 10,
                    fuzzy:undefined,
                    classCode:undefined
                },
                total: 0,
            };
        }
    };
</script>
