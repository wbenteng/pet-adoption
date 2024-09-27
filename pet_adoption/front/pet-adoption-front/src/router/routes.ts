//对外暴露路由(常量路由)
export const constantRoute = [
  {
    //登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login', //命名路由
    meta: {
      title: '登录', //菜单标题
      hidden: true, //路由在菜单中是否隐藏
      icon: 'Promotion', //菜单文字左侧的图标
    },
  },
  {
    //注册
    path: '/register',
    component: () => import('@/views/register/index.vue'),
    name: 'register', //命名路由
    meta: {
      title: '注册', //菜单标题
      hidden: true, //路由在菜单中是否隐藏
      icon: 'Promotion', //菜单文字左侧的图标
    },
  },

  //后台
  //首页
  {
    //登录成功以后展示数据的路由
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  //个人中心
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'personal',
    meta: {
      title: '个人中心',
      hidden: false,
      icon: 'Avatar',
    },
    redirect: '/person',
    children: [
      {
        path: '/back/person',
        component: () => import('@/views/person/index.vue'),
        meta: {
          title: '个人信息',
          hidden: false,
          icon: 'ChatLineSquare',
        },
      },
      {
        path: '/back/password',
        component: () => import('@/views/password/index.vue'),
        meta: {
          title: '修改密码',
          hidden: false,
          icon: 'EditPen',
        },
      },
    ],
  },
  //系统管理
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    name: 'system',
    meta: {
      title: '系统管理',
      hidden: false,
      icon: 'Grid',
    },
    redirect: '/system/user',
    children: [
      {
        path: '/system/user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        path: '/system/role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
    ],
  },
  //公告管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'notice',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/notice',
        component: () => import('@/views/notice/index.vue'),
        meta: {
          title: '公告管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //流浪宠物管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'pet',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/pet',
        component: () => import('@/views/pet/index.vue'),
        meta: {
          title: '流浪宠物管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //申请领养管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'petAdoption',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/petAdoption',
        component: () => import('@/views/petAdoption/index.vue'),
        meta: {
          title: '申请领养管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //宠物救助管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'rescue',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/rescue',
        component: () => import('@/views/rescue/index.vue'),
        meta: {
          title: '宠物救助管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //宠物喂养点管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'feed',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/feed',
        component: () => import('@/views/feed/index.vue'),
        meta: {
          title: '宠物喂养点管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //宠物丢失管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'lost',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/lost',
        component: () => import('@/views/lost/index.vue'),
        meta: {
          title: '宠物丢失管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //帖子管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'article',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/article',
        component: () => import('@/views/article/index.vue'),
        meta: {
          title: '帖子管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //评论管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'comment',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/comment',
        component: () => import('@/views/comment/index.vue'),
        meta: {
          title: '评论管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //捐赠管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'donate',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/donate',
        component: () => import('@/views/donate/index.vue'),
        meta: {
          title: '捐赠管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //科普文章管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'articleKp',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/articleKp',
        component: () => import('@/views/articleKp/index.vue'),
        meta: {
          title: '科普文章管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },
  //活动管理
  {
    path: '/back',
    component: () => import('@/layout/index.vue'),
    name: 'activity',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/back/home',
    children: [
      {
        path: '/back/activity',
        component: () => import('@/views/activity/index.vue'),
        meta: {
          title: '活动管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },

  {
    //404
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'CircleCloseFilled',
    },
  },
  {
    //任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意',
      hidden: true,
      icon: 'Rank',
    },
  },
]

export const FConstantRoute = [
  {
    path: '/',
    redirect: '/front/home',
  },
  //前台
  //首页
  {
    path: '/front/home',
    component: () => import('@/views/front/home/index.vue'),
    name: 'fHome',
    meta: {
      title: '首页',
      hidden: true,
      icon: '',
    },
  },
  //领养
  {
    path: '/front',
    component: () => import('@/frontLayout/index.vue'),
    name: 'front',
    meta: {
      title: '',
      hidden: true,
      icon: '',
    },
    redirect: '/front/home',
    children: [
      //个人信息
      {
        path: '/front/person',
        component: () => import('@/views/front/person/index.vue'),
        meta: {
          title: '宠物详情',
          hidden: true,
          icon: '',
        },
      },
      //修改密码
      {
        path: '/front/password',
        component: () => import('@/views/front/password/index.vue'),
        meta: {
          title: '宠物详情',
          hidden: true,
          icon: '',
        },
      },
      // 宠物详情
      {
        path: '/front/homeDetail',
        component: () => import('@/views/front/homeDetail/index.vue'),
        meta: {
          title: '宠物详情',
          hidden: true,
          icon: '',
        },
      },
      // 宠物领养
      {
        path: '/front/adopt',
        component: () => import('@/views/front/adopt/index.vue'),
        meta: {
          title: '宠物领养',
          hidden: true,
          icon: '',
        },
      },
      // 我的领养
      {
        path: '/front/myAdopt',
        component: () => import('@/views/front/myAdopt/index.vue'),
        meta: {
          title: '我的领养',
          hidden: true,
          icon: '',
        },
      },
      // 宠物救助
      {
        path: '/front/rescue',
        component: () => import('@/views/front/rescue/index.vue'),
        meta: {
          title: '宠物救助',
          hidden: true,
          icon: '',
        },
      },
      // 宠物喂养
      {
        path: '/front/feed',
        component: () => import('@/views/front/feed/index.vue'),
        meta: {
          title: '宠物救助',
          hidden: true,
          icon: '',
        },
      },
      // 宠物丢失
      {
        path: '/front/lost',
        component: () => import('@/views/front/lost/index.vue'),
        meta: {
          title: '宠物丢失',
          hidden: true,
          icon: '',
        },
      },
      // 宠物论坛
      {
        path: '/front/article',
        component: () => import('@/views/front/article/index.vue'),
        meta: {
          title: '宠物论坛',
          hidden: true,
          icon: '',
        },
      },
      // 宠物捐赠
      {
        path: '/front/donate',
        component: () => import('@/views/front/donate/index.vue'),
        meta: {
          title: '宠物捐赠',
          hidden: true,
          icon: '',
        },
      },
      // 宠物科普
      {
        path: '/front/articleKp',
        component: () => import('@/views/front/articleKp/index.vue'),
        meta: {
          title: '宠物科普',
          hidden: true,
          icon: '',
        },
      },
      // 宠物活动
      {
        path: '/front/activity',
        component: () => import('@/views/front/activity/index.vue'),
        meta: {
          title: '宠物科普',
          hidden: true,
          icon: '',
        },
      },
    ],
  },
]
