<template>
  <div class="dashboard-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <histogram-chart :chart-data="lineChartData"/>
    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HistogramChart from "./components/histogramChart";
import {getChartInfo} from "../../api/common";
const lineChartData = {
    newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130]
    }
}

export default {
  name: 'Dashboard',
    components: {HistogramChart},
    data(){
      return {
          histogramData:{

          },
          lineChartData:lineChartData.newVisitis
      }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
    created() {
        this.initData();

    },
    methods:{
      initData(){
          getChartInfo().then(response => {
              this.lineChartData = lineChartData.newVisitis
           this.lineChartData=response.data
          })
      }
    }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
