# dps_cmbchina_open_h5

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run dev
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint  


```
启动 mock 服务指令：`yarn run dev:mock` 

## 开发指南

整个项目

### 1、pages

pages 文件夹中包含了各单页应用的打包入口（main.js）、路由（router.js）、模板（index.html）、vue 入口（app.vue）。

### 2、views

views 文件夹中包含了各单页应用的页面（这些页面将在路由 router.js 中被调用）。

### 3、components

components 中包含了各个单页应用的各个页面的的组件，页面文件夹与 views 中的页面 .vue 文件同名。

### 4、api

包含所有的异步请求，按照功能逻辑命名（如订单、资产）。
 


