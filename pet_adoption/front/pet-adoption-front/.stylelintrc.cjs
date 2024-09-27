module.exports = {
  extends: [
    'stylelint-config-standard',          // 基础 Stylelint 配置
    'stylelint-config-standard-scss',    // SCSS 特定的 Stylelint 配置
    'stylelint-config-recommended-vue/scss', // Vue 中 SCSS 样式格式化推荐配置
    'stylelint-config-recess-order',     // CSS 属性书写顺序插件
    'stylelint-config-prettier'          // Stylelint 和 Prettier 兼容配置
  ],
  overrides: [
    {
      files: ['**/*.{scss,css,vue,html}'],
      customSyntax: 'postcss-scss',       // SCSS 和 CSS 文件使用 PostCSS-SCSS 解析
      rules: {
        'value-keyword-case': null,       // 在 CSS 中使用-bind时不报错
        'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
        'function-url-quotes': 'always',  // 要求在 URL 中使用引号
        'no-empty-source': null,          // 允许空的源文件
        'selector-class-pattern': null,   // 不强制选择器类名的格式
        'property-no-unknown': null,      // 允许未知属性
        'block-opening-brace-space-before': 'always', // 大括号前必须有一个空格
        'value-no-vendor-prefix': null,   // 关闭属性值前缀检查，例如 -webkit-box
        'selector-pseudo-class-no-unknown': [true, {
          ignorePseudoClasses: ['global', 'v-deep', 'deep'] // 忽略特定伪类，以支持 Vue 深度作用选择器
        }]
      }
    },
    {
      files: ['**/*.{html,vue}'],
      customSyntax: 'postcss-html'        // HTML 和 Vue 文件使用 PostCSS-HTML 解析
    }
  ],
  ignoreFiles: [
    '**/dist/**',  // 忽略 dist 目录
    '**/node_modules/**'  // 忽略 node_modules 目录
  ],
  rules: {
    'no-empty-source': null, // 全局配置中也允许空的源文件
    'property-no-vendor-prefix': null, // 全局配置中关闭属性前缀检查
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global', 'v-deep', 'deep'] // 同样，全局配置中忽略 Vue 特定伪类
    }]
  }
};
