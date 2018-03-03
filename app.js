var express = require("express");//引入模块
var swig = require("swig");//加载模板处理模块
var app = express();//创建服务
var index = require("./controllers/index");
var api = require("./controllers/api");

app.engine("html",swig.renderFile);
app.set("views","./views");//第一个 必须是 views 第二个是模板文件存放的目录
app.set("view engine","html");//注册模板引擎 第一个参数必须是view engine 第二个参数是模板引擎的名称

//在开发过程中  我们不要模板缓存
swig.setDefaults({cache:false});

//静态文件托管
app.use("/public",express.static( __dirname +"/public"))

//分模块处理
app.get("/",index.a);//主页
app.get("/api/musicList",api.musicList);//请求歌单列表
app.get("/api/lyric",api.lyric);//请求歌词列表

app.listen("8080",function(){
	console.log("listening...请打开http://127.0.0.1:8080");
});
