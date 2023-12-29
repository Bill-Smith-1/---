import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
const routes = [
	{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/Login.vue')
	},
	{
		path: '/home',
		name: 'home',
		component: () => import('../views/Home.vue'),
		children: [
			{
				path: '/dept',
				name: 'dept',
				component: () => import('../components/sysmag/Dept.vue')
			},
			{
				path: '/dept2',
				name: 'dept2',
				component: () => import('../components/sysmag/Dept2.vue')
			},
			{
				path: '/Emp',
				name: 'Emp',
				component: () => import('../components/sysmag/Emp.vue')
			},
			{
				path: '/Pc',
				name: 'Pc',
				component: () => import('../components/sysmag/Pc.vue')
			},
			{
				path: '/Prod',
				name: 'Prod',
				component: () => import('../components/sysmag/Prod.vue')
			},
			{
				path: '/Device',
				name: 'Device',
				component: () => import('../components/sysmag/Device.vue')
			},
			{
				path: '/DeviceType',
				name: 'DeviceType',
				component: () => import('../components/sysmag/DeviceType.vue')
			},
			{
				path: '/order',
				name: 'order',
				component: () => import('../components/sysmag/Order.vue')
			},
			{
				path: '/img',
				name: 'img',
				component: () => import('../components/sysmag/Img.vue')
			},
			{
				path: '/img2',
				name: 'img2',
				component: () => import('../components/sysmag/Img2.vue')
			}
		]
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router




/*配置路由的导航守卫*/
/*
  有一些路由不能直接进入，必须进行安全验证(登录验证),
  to:要进入的路由   from:当前路由  next:函数，能够继续访问路由
*/
//开发其他功能前是先注释
/*
router.beforeEach((to,from,next)=>{
	let routList;
	let str ;
	let url = "http://localhost:8080/BBS_team19_03/ListSysMenuServlet?action=ListSysMenu2&roleId=1";
	//获取后端数据  可以动态添加 routList
	axios.get(url).then(resp=> {
		str = resp.data;
		console.log("str="+str);
		//配置守卫路由集合--后端动态赋值
		routList= str;
		//方案1
		if(routList.indexOf(to.path)>=0){
			if( RoleID==null || RoleID !=1 ) { //||
				router.push('/')
			}
		}	
	});
	
	
	//配置守卫路由集合
	//前端静态赋值
	//const routList=['/dept','/emp','/emp2','/img'];
	//前端静态赋值
	const routList2=['/sys_index','/upload'];
	let RoleID=sessionStorage.getItem("RoleID");
	//alert("RoleID="+RoleID);
	
	if(routList2.indexOf(to.path)>=0){
		if( RoleID==null || RoleID !=1 && RoleID !=2 ) { //||
			router.push('/')
		}
	}
	next();
})
*/

