<!-- 
  柱状图端页面
  @author 东软教师
  @date 2023-12-01
-->
<template>
	<div id="myChart" :style="{width: '500px', height: '400px'}">
	</div>
	<el-button @click="getData()" size="small">后端动态数据</el-button>
	<el-button @click="getData2()" size="small">后端动态数据2</el-button>
</template>
<script>
	// 引入echarts
	import * as echarts from 'echarts';
	import axios from 'axios';
	export default {
		mounted() { //mounted==DOM加载完毕后自动执行
			   //基于准备好的dom，初始化echarts实例
			   let myChart = echarts.init(document.querySelector('#myChart'))
			   // 绘制图表
			   myChart.setOption({
			    //title: { text: 'ECharts 入门示例-柱状图(前端静态数据)' },
				title: { text: '智能制造云平台产能示意图' },
				
				
			    tooltip: {},
			    xAxis: {
			     data : this.data2,
			    },
			    yAxis: {},
					series: [{
					 name: '销量',
					 type: 'bar',
					 data : this.data3,
					}]
			   });
		},
		methods:{
			//查询方法==获取后端部门数据
			getData(){
				//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
				let _this=this;
				let url = "http://localhost:7821/newDept/listDept?pageNum=1&maxPageNum=100";
			    //获取部门数据 后端设置跨域访问了，前端不用设置了
				axios.get(url).then(resp=> {
					_this.deptArr = resp.data.list;
					for(let i=0;i<_this.deptArr.length;i++) {
						//console.log(_this.deptArr[i].dname);
						_this.data2[i] = _this.deptArr[i].dname;
						_this.data3[i] = _this.deptArr[i].locid;
					}
					//基于准备好的dom，初始化echarts实例
					let myChart = echarts.init(document.querySelector('#myChart'))
					// 绘制图表
					myChart.setOption({
					 title: { text: 'ECharts 入门示例-柱状图(后端动态数据)' },
					 tooltip: {},
					 xAxis: {
					  data : this.data2,
					 },
					 yAxis: {},
					 series: [{
					  name: '销量',
					  type: 'bar',   //type: 'pie',   'bar'
					  data : this.data3,
					 }]
					});
				});
			},
			//查询方法==获取后端医生科室数据
			getData2(){
				this.data2.length=0;  //清空data2数据
				this.data3.length=0;  //清空data2数据
				//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
				let _this=this;
				let url = "http://localhost:7821/newEmp/listEmp03?pageNum=1&maxPageNum=100";
			    //获取部门数据 后端设置跨域访问了，前端不用设置了
				axios.get(url).then(resp=> {
					_this.deptArr = resp.data.list;
					for(let i=0;i<_this.deptArr.length;i++) {
						//console.log(_this.deptArr[i].dname);
						//u_count":1,"deptname"
						_this.data2[i] = _this.deptArr[i].deptname;
						_this.data3[i] = _this.deptArr[i].u_count;
					}
					//基于准备好的dom，初始化echarts实例
					let myChart = echarts.init(document.querySelector('#myChart'))
					// 绘制图表
					myChart.setOption({
					 title: { text: '科室人数--柱状图' },
					 tooltip: {},
					 xAxis: {
					  data : this.data2,
					 },
					 yAxis: {},
					 series: [{
					  name: '人数',
					  type: 'bar',   //type: 'pie',   'bar'
					  data : this.data3,
					 }]
					});
				});
			},
		},
		data(){
			return{
				data2: ["一季度","二季度","三季度"],
				data3: [10,20,30],
				deptArr:[],
			}
		},
	}
</script>
<style>
</style>
