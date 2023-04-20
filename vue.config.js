const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/naverann': {
        target: 'https://msearch.shopping.naver.com',
        changeOrigin: true,
        pathRewrite: {
          '^/naverann': ''
        }
      },
      '/catalog': {
        target: 'https://msearch.shopping.naver.com',
        changeOrigin: true
      },
    }
  },
})
