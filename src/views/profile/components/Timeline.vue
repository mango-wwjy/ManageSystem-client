<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-timeline>
  </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {fetchTimeLine} from "../../../api/common";
export default {
    components: { Pagination },
  data() {
    return {
        timeline: [],
        total: 0,
        listQuery: {
            page: 1,
            limit: 4
        },
    }
  },
  created() {
        this.getList();
  },
  methods:{
        getList(){
            fetchTimeLine(this.listQuery).then(response => {
                this.timeline = response.data.list
                this.total =response.data.total
            })
        }
  }
}
</script>
