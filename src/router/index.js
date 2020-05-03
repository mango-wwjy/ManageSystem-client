import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },


  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: false,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },

  {
    path: '/noticeInfo',
    component: Layout,
    redirect: '/notice/noticePublic',
    hidden: false,
    children: [
      {
        path: 'noticePublic',
        component: () => import('@/views/notice/noticePublic'),
        name: 'noticePublic',
        meta: { title: '公告信息', icon: 'noticePublic' }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'userInfo',
        name: 'User',
        component: () => import('@/views/user/userInfo'),
        meta: { title: '用户管理', icon: 'userInfo', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/teacher',
    component: Layout,
    children: [
      {
        path: 'teacherInfo',
        name: 'Teacher',
        component: () => import('@/views/teacher/teacherInfo'),
        meta: { title: '教师管理', icon: 'teacherInfo', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    children: [
      {
        path: 'studentInfo',
        name: 'Student',
        component: () => import('@/views/student/studentInfo'),
        meta: { title: '学生管理', icon: 'studentInfo', roles: ['admin'] }
      }
    ]
  },

  {
    path: '/mineStudent',
    component: Layout,
    children: [
      {
        path: 'mineStudentInfo',
        name: 'mineStudent',
        component: () => import('@/views/student/mineStudentInfo'),
        meta: { title: '我的指导学生', icon: 'studentInfo', roles: ['teacher'] }
      }
    ]
  },

  {
    path: '/mineClass',
    component: Layout,
    children: [
      {
        path: 'mineClassInfo',
        name: 'mineClass',
        component: () => import('@/views/class/mineClassInfo'),
        meta: { title: '我的班级', icon: 'class', roles: ['teacher'] }
      }
    ]
  },

  {
    path: '/subjectPublicInfo',
    component: Layout,
    children: [
      {
        path: 'subjectPublic',
        name: 'subjectPublicInfo',
        component: () => import('@/views/subject/subjectPublic'),
        meta: { title: '课题选择', icon: 'class', roles: ['user'] }
      }
    ]
  },

  {
    path: '/studentSubjectInfo',
    component: Layout,
    children: [
      {
        path: 'studentSubject',
        name: 'studentSubjectInfo',
        component: () => import('@/views/student/studentSubject'),
        meta: { title: '我的课题', icon: 'class', roles: ['user'] }
      }
    ]
  },

  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/subjectInfo',
    name: 'subject',
    meta: {
      title: '课题管理',
      icon: 'subject',
      roles: ['teacher']
    },
    children: [
      {
        path: 'createSubject',
        component: () => import('@/views/subject/createSubject'),
        name: 'createSubject',
        meta: { title: '发布课题', icon: 'edit' ,roles: ['teacher']}
      },
      {
        path: 'mineSubjectInfo',
        component: () => import('@/views/subject/mineSubjectInfo'),
        name: 'mineSubjectInfo',
        meta: { title: '我的课题', icon: 'list',roles: ['teacher'] }
      },
      {
        path: 'editSubject',
        component: () => import('@/views/subject/editSubject'),
        name: 'editSubject',
        meta: { title: '编辑课题', noCache: true },
        hidden: true
      },
    ]
  },

  {
    path: '/collegeAndClass',
    component: Layout,
    redirect: '/collegeAndClass/collegeInfo',
    name: 'collegeAndClass',
    meta: {
      title: '学院班级管理',
      icon: 'collegeAndClass',
      roles: ['admin']
    },
    children: [
      {
        path: 'collegeInfo',
        component: () => import('@/views/college/collegeInfo'), // Parent router-view
        meta: { title: '学院管理', icon:'college', roles: ['admin'] }
      },
      {
        path: 'classInfo',
        component: () => import('@/views/class/classInfo'),
        meta: { title: '班级管理', icon:'class', roles: ['admin']}
      },
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/noticeInfo',
    name: 'notice',
    meta: {
      title: '公告管理',
      icon: 'example',
      roles: ['admin','teacher']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/notice/createNotice'),
        name: 'createNotice',
        meta: { title: '发布公告', icon: 'edit' ,roles: ['admin','teacher']}
      },
      {
        path: 'noticeInfo',
        component: () => import('@/views/notice/noticeInfo'),
        name: 'noticeInfo',
        meta: { title: '公告列表', icon: 'list',roles: ['admin','teacher'] }
      },
      {
        path: 'edit',
        component: () => import('@/views/notice/editNotice'),
        name: 'editNotice',
        meta: { title: '编辑公告', noCache: true },
        hidden: true
      },
    ]
  },
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
