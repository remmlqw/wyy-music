//模块引用
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();//加载package.json文件里的devDependencies中的所有插件
var open = require('open');

var app = {
	srcPath : 'src/',  //定义目录路径 源代码放置的位置
	devPath : 'build/', //整合之后的文件 开发环境要用到的文件放置的目录
	prdPath : 'dist/'  //用于生产，部署的目录	
};

//gulp借鉴了Unix操作系统的管道（pipe）思想，前一级的输出，直接变成后一级的输入
gulp.task('lib',function(){
	gulp.src('bower_components/**/*.js')//指定需要处理的源文件的路径
	.pipe(gulp.dest(app.devPath + 'vendor'))//dest方法是指定处理完后文件输出的路径；
	.pipe(gulp.dest(app.prdPath + 'vendor'))
	.pipe($.connect.reload());//通知服务器自动刷新网页
});

gulp.task("html",function(){
	gulp.src(app.srcPath + '**/*.html')
	.pipe(gulp.dest(app.devPath))
	.pipe(gulp.dest(app.prdPath))
	.pipe($.connect.reload());
});

gulp.task("json",function(){
	gulp.src(app.srcPath + 'data/**/*.json')
	.pipe(gulp.dest(app.devPath + 'data'))
	.pipe(gulp.dest(app.prdPath + 'data'))
	.pipe($.connect.reload());
});

gulp.task('less',function(){
	gulp.src(app.srcPath + 'style/index.less')
	.pipe($.less())//编译less文件至css文件
	.pipe(gulp.dest(app.devPath + 'css'))
	.pipe($.cssmin())//css压缩
	.pipe(gulp.dest(app.prdPath + 'css'))
	.pipe($.connect.reload());
});

gulp.task('js',function(){
	gulp.src(app.srcPath + 'script/**/*.js')
	.pipe($.concat('index.js'))//合并gulp.src()中文件为单一文件
	.pipe(gulp.dest(app.devPath + 'js'))
	.pipe($.uglify())//JS文档压缩
	.pipe(gulp.dest(app.prdPath + 'js'))
	.pipe($.connect.reload());
});

gulp.task('image',function(){
	gulp.src(app.srcPath + 'image/**/*')
	.pipe(gulp.dest(app.devPath + 'image'))
	.pipe($.imagemin())//图片压缩
	.pipe(gulp.dest(app.prdPath + 'image'))
	.pipe($.connect.reload());
});

gulp.task('build',['image','js','less','lib','html','json']);

//清除build和dist文件
gulp.task('clean',function(){
	gulp.src([app.devPath,app.prdPath])
	.pipe($.clean());//删除文件或文件夹
});

//创建一个服务
gulp.task('server',['build'],function(){
	$.connect.server({
		root : [app.devPath],//服务启动的根目录
		livereload : true,//livereload是一个标志，为true时gulp会自动检测文件的变化然后自动进行源码构建。
		port : 1234//端口
	})
	
	open('http://localhost:1234');//服务启动 立即开启浏览器 打开网页
})

//修改源文件  自动构建(检测源文件的变换，实时改变build和dist)
gulp.watch('bower_components/**/*',['lib']);//对指定的文件进行监听
gulp.watch(app.srcPath + '**/*.html',['html']);
gulp.watch(app.srcPath + 'data/**/*.json',['json']);
gulp.watch(app.srcPath + 'style/**/*.less',['less']);
gulp.watch(app.srcPath + 'script/**/*.js',['js']);
gulp.watch(app.srcPath + 'image/**/*',['image']);

gulp.task('default',['server']);//命令行输入gulp相当于gulp server
