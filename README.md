# 模仿网易云音乐PC端应用

**项目前端使用 jQuery**
**项目后端使用 Node + Express + MySQL**

**项目演示地址 http://liqianwen.remmli.com:8084/**

### 功能模块
- 播放控制
    - 播放列表控制（下一首、上一首、暂停）
    - 播放进度条控制（拖拽、点击）
    - 音量控制

- 歌词滚动

### 代码目录
```js
+-- public/                                 ---静态资源目录
|    +-- css                                ---样式
|    |    ...
|    +-- fonts                              ---字体图标
|    |    ...
|    +-- img                                ---图片
|    |    ...
|    +-- js                                 ---js
|    |    --- jquery-3.1.1min.js            ---jQuery
|    |    --- app.js                        ---页面逻辑控制
|    |    --- lyricScroll.js                ---歌词滚动
|    |    --- player.js                     ---播放控制
+-- lrc                                     ---歌词文件.lrc目录
|    --- ...
+-- node_modules/                           ---项目依赖的模块
|    --- ...
+-- controllers/                            ---控制器（后端业务逻辑）
|    --- api.js                             
|    --- index.js                           
+-- views/                                  ---视图
|    --- ...
--- app.js                                  ---项目入口及程序启动文件
--- package.json                            ---包描述文件及开发者信息
--- README.md                               ---项目说明
--- music.sql                        ---mysql数据库导出的备份文件                             
```

### 项目截图

**播放界面**

![image](https://github.com/remmlqw/img-folder/blob/master/wy_main.png)

**歌词界面**

![image](https://github.com/remmlqw/img-folder/blob/master/wy_geci.png)

### 启动项目

**下载依赖包**

``` js
npm i
```
**开启服务**

``` js
npm start
```

**在浏览器地址栏输入**
``` js
http://127.0.0.1:8080/
```
