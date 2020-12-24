// vue.config.js 配置说明
const webpack = require('webpack')
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack:  {
    plugins:[
      new webpack.ProvidePlugin({
        $:'jquery',
        jQuery:'jquery',
        'windows.jQuery':'jquery'
      })
    ]

  },
  devServer: {
    port: 8080, // 端口号
    host: "0.0.0.0",
    https: false, 
    open: false, //配置自动启动浏览器
    proxy: {//跨域配置
      "/dev": {
        target: "http://fu.sctsjkj.com:5082",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/dev": ""
        }
      }
    }
  }
};
