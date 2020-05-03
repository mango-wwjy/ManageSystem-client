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
          <el-input  placeholder="请输入检索内容" style="width: 800px;" class="filter-item"></el-input>

          <el-button  class="filter-item"  icon="el-icon-search" circle @click="">
          </el-button>
        </div>
        <el-row>
          <el-button type="primary">主要按钮</el-button>
        </el-row>

        <el-table
          :data="tableData"
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
      </el-col>

    </el-row>


  </div>
</template>
<script>
    import {fetchTree} from "../../api/subject";

    export default {
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
                        this.data = [{
                            subjectName:'我的课题',
                            id:'ROOT',
                            children:tree
                        }]
                    }

                })

            },
            filterNode(value, data) {
                if (!value) return true;
                return data.subjectName.indexOf(value) !== -1;
            },
            handleNodeClick(data,node){
            debugger
                console.log(data)
                console.log(node)
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
                    label: 'subjectName'
                }
            };
        }
    };
</script>
