console.log("加载成功...");
/* 
    配置当前项目引入的模块
    遵从AMD规范
    可以省略.js后缀
*/
require.config({
    //配置路径
    paths: {
        "jquery": "jquery-1.11.3",
        "jquery-cookie": "jquery.cookie",
        "nav": "nav"
    },
    shim: {
        //设置依赖关系 jquery-cookie是依赖jquery的  所以得先引入jquery.js  然后再加载jquery-cookie
        "jquery-cookie": ["jquery"],

    }
})
//引入nav模块，并在回调函数的参数中拿到模块返回的对外对象
require(["nav"],function(nav){
    //调用模块nav中的download方法并执行
    nav.download();
    nav.banner();
    nav.leftNavTab();
})