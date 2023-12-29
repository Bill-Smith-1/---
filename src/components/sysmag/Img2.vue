<!-- 
  饼状图端页面
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
			let myChart = echarts.init(document.querySelector('#myChart'));
			myChart.setOption({
			    title: { text: 'ECharts 入门示例-饼状图(前端静态数据)' },
				tooltip: {},
			    series: 
                {
					type: 'pie',
					data: this.data1,
			    },
				radius: '50%'
			});
			
			let _this=this;
			_this.data2.length=0;  //清空data2数据
			let url = "http://localhost:7821/newDept/listDept?pageNum=1&maxPageNum=100";
			//获取部门数据 后端设置跨域访问了，前端不用设置了
			axios.get(url).then(resp=> {
				_this.deptArr = resp.data.list;
				//for(let i=0;i<6;i++) {
				for(let i=0;_this.deptArr.length;i++) {
					_this.data2.push({
					    value: _this.deptArr[i].deptno,
					    name: _this.deptArr[i].dname
					});
				}
			});
			
		   /*
			let url2 = "http://localhost:7821/newEmp/listEmp04?pageNum=1&maxPageNum=100";
			//获取部门数据 后端设置跨域访问了，前端不用设置了
			axios.get(url2).then(resp=> {
				_this.deptArr = resp.data.list;
				//for(let i=0;i<6;i++) {
				for(let i=0;_this.deptArr.length;i++) {
					_this.data3.push({
					    value: _this.deptArr[i].u_cont,
					    name: _this.deptArr[i].cname
					});
				}
			});
			*/
		},
		methods:{
			//查询方法==获取后端部门数据
			getData(){
						//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
						let _this=this;
						//基于准备好的dom，初始化echarts实例
						let myChart = echarts.init(document.querySelector('#myChart'))
						// 绘制图表
						myChart.setOption({
						 title: { text: 'ECharts 入门示例-饼状图(后端动态数据)' },
						 tooltip: {},
						series:
							{
								type: 'pie',
								data: _this.data2, 
						},
						radius: '50%'
						});
			},
			//查询方法==获取后端医生职称人数
			getData2(){
				//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
				let _this=this;
				//基于准备好的dom，初始化echarts实例
				let myChart = echarts.init(document.querySelector('#myChart'));
				let url = "http://localhost:7821/newDept/listDept?pageNum=1&maxPageNum=100";
				//获取部门数据 后端设置跨域访问了，前端不用设置了
				axios.get(url).then(resp=> {
					_this.deptArr = resp.data.list;
					//for(let i=0;i<6;i++) {
					for(let i=0;_this.deptArr.length;i++) {
						_this.data2.push({
						    value: _this.deptArr[i].deptno,
						    name: _this.deptArr[i].dname
						});
					}
					myChart.setOption({
						 title: { text: 'ECharts 入门示例-饼状图(后端动态数据)' },
						 tooltip: {},
						series:
							{
								type: 'pie',
								data: _this.data2, 
						},
						radius: '50%'
						});
				});
			},
		},
		data(){
			return{
				deptArr:[],
				data1: [     //静态数据数组
				        {
				          value: 335,
				          name: '直接访问'
				        },
				        {
				          value: 234,
				          name: '联盟广告'
				        },
				        {
				          value: 1548,
				          name: '搜索引擎'
				        }
				],
				data2: [    //接收后端数据的数组
				        {
				          value: 10,
				          name: '直接访问3'
				        },
				        {
				          value: 10,
				          name: '联盟广告3'
				        },
				        {
				          value: 10,
				          name: '搜索引擎3'
				        }
				],
				data3:[],
			}
		},
	}
</script>
<style>
</style>