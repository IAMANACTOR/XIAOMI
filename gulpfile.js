const gulp = require("gulp");
const scss = require("gulp-sass");   //注意gulp-sass和gulp-scss的失效问题，若有则切换至另一个
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");
/* 
    index.scss => index.css => index.min.css(重命名)
*/
gulp.task("scss",function(){
    return gulp.src("stylesheet/index.scss")
    .pipe(scss())   //预编译scss文件为css
    .pipe(gulp.dest("dist/css"))
    .pipe(minifyCSS())  //压缩文件
    .pipe(rename("index.min.css"))  //重命名文件
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());  //、实时重新加载，实时刷新   
})

/* 
    批量处理scss文件
*/
gulp.task("scssAll",function(){
    return gulp.src("stylesheet/*.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());  //、实时重新加载，实时刷新 
})

//处理js文件
gulp.task("scripts",function(){
    return gulp.src(["*.js","!gulpfile.js"])
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());  //、实时重新加载，实时刷新 
})

//处理所有的html文件
gulp.task("copy-html",function(){
    return gulp.src("*.html")
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());  //、实时重新加载，实时刷新 
})

//处理json数据
gulp.task("data",function(){
    return gulp.src(["*.json","!package.json"])
    .pipe(gulp.dest("dist/data"))
    .pipe(connect.reload());  //、实时重新加载，实时刷新 
})

//处理图片
gulp.task("images",function(){
    return gulp.src("images/**/*") //images/**/*/会一同处理images下的所有资源包括文件夹
    .pipe(gulp.dest("dist/images"))
    .pipe(connect.reload());  //、实时重新加载，实时刷新 
})

//一次性执行多个任务
gulp.task("build",["scss","scripts","copy-html","data","scssAll","images"],function(){
    console.log("项目创建成功");
})

//建立监听 批量监听文件
gulp.task("watch",function(){
    gulp.watch("stylesheet/index.scss",["scss"]);
    gulp.watch("stylesheet/*.scss",["scssAll"]);
    gulp.watch(["*.js","!gulpfile.js"],["scripts"]);
    gulp.watch("*.html",["copy-html"]);
    gulp.watch(["*.json","!package.json"],["data"]);
    gulp.watch("images/**/*",["images"]);
})

//启动服务器 gulp-connect
const connect = require("gulp-connect");
gulp.task("server",function(){
    connect.server({
        root: "dist",
        port: 8887,
        livereload: true  //服务器实时刷新
    })
})


//启动一个默认的任务  直接使用qulp运行
gulp.task("default",["watch","server"]);