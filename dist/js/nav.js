//处理首页导航部分 遵从AMD规范
/* 
    当前模块依赖jquery模块，$是jquery返回的对外接口对象
*/
define(["jquery"], function ($) {
    function download() {
        //数据下载  从nav.json下载   ajax是异步加载数据的
        $.ajax({
            type: "get",
            url: "../data/nav.json",
            /* 
                通过将json代码放到bejson在线网站查看
                可知该json数据的结构为三个数组：banner  sideNav  topNav
                数组里面是对象(花括号括起来的对象)...
            */
            success: function (result) {
                // alert(result);
                var bannerArr = result.banner;
                //通过循环将数据添加到页面上
                for (var i = 0; i < bannerArr.length; i++) {
                    //插入图片到页面
                    $(`<a href="${bannerArr.url}">
                    <img class = 'swiper-lazy swiper-lazy-loaded' src = '../images/banner/${bannerArr[i].img}' alt=""/>
                </a>`).appendTo("#J_homeSwiper .swiper-slide");
                    //设置小圆点
                    var node = $(`<a href="#" class = 'swiper-pagination-bullet'></a>`);
                    if (i == 0) {
                        //如果是第一张图片，则为该图片添加属性class="swiper-pagination-bullet-active"
                        node.addClass("swiper-pagination-bullet-active");
                    }
                    node.appendTo("#J_homeSwiper .swiper-pagination");
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        })
        leftNavDownload();  //下载侧边栏的数据
       
    }

    //实现轮播图的轮播效果
    function banner() {
        var iNow = 0; //当前显示的图片的下标
        var aImgs = null; //记录图片
        var aBtns = null; //记录小圆圈

        /* 
            为轮播图设置定时器：一旦设置定时器相当于机器已经发动
                每2500毫秒就同时切换到下一张图片和下一个小圆点
        */
        var timer = setInterval(function () {
            iNow++;
            // alert("iNow: " + iNow);
            //执行定时器前页面上就已经有一张图片了，接下来的操作是让所有图片突然隐藏且透明度都为0.2，然后让下一张图片的透明度从0.2变化到1，历时500毫秒
            //总结：页面上显示的图片突然消失，让下一张图片淡入，透明度0.2 -> 1; 
            //所以指定定时器时应该将图片切换到当前图片的下一张即iNow++
            tab();
        }, 2500);


        //封装切换函数
        function tab() {
            if (!aImgs) {
                //找到所的图片对象
                aImgs = $("#J_homeSwiper .swiper-slide").find("a");
                // alert(aImgs.)
            }
            if (!aBtns) {
                //找到所有的小圆圈
                aBtns = $("#J_homeSwiper .swiper-pagination").find("a");
            }
            /* 
                图片对象的下标从0开始，最后一张图片是aImgs.length-1，当最后一张图片展示完后，iNow自增其值变为aImgs.length，
                要实现图片的轮播，需要在此时将iNow的值设为0，无缝的衔接显示第一张图片
            */
            if (iNow == aImgs.length) {
                //iNow=0，又一次从第一张图片开始展示，从而实现轮播
                iNow = 0;
            }

            /* 
                切换图片：
                下面代码的意思是：
                    1、将所有的图片突然隐藏    
                    2、将所有的图片的透明度设为0.2
                    3、从所有的图片中找到下标为iNow的图片，该图片是即将被显示的图片，第一次执行定时器时iNow为1，即要显示第2张图片
                    4、将下标为iNow的图片显示出来
                    5、为下标为iNow的图片设置透明度为1(即完全显示出来，完全不透明)
                    6、透明度变化的时间为500毫秒
            */
            aImgs.hide().css("opacity", 0.2).eq(iNow).show().animate({ opacity: 1 }, 500);
            /* 
                切换小圆点
                    1、删除所有小圆点的class样式：swiper-pagination-bullet-active，取消选中状态
                    2、找到当前的小圆点
                    3、为当前的小圆点添加class样式swiper-pagination-bullet-active，为当前小圆点添加选中样式
            */
            aBtns.removeClass("swiper-pagination-bullet-active").eq(iNow).addClass("swiper-pagination-bullet-active");
        }

        //添加鼠标的移入和移出事件，移入轮播图停止轮播，移出时恢复轮播
        $(".swiper-button-prev, #J_homeSwiper, .swiper-button-next").mouseenter(function () {
            clearInterval(timer); //当鼠标移入时，取消定时器使轮播图停止轮播
        }).mouseleave(function () {  //链式操作 当鼠标移出时  添加定时器
            timer = setInterval(function () {
                iNow++;
                tab();
            }, 2500);
        })


        //为轮播图上的小圆点添加点击事件，切换到对应的图片
        //小圆点是ajax异步加载的，所以不能在页面上获取小圆点，因为此时小圆点在执行获取语句前还没加载出来
        //此种情况应该用【事件委托】的方式，将点击事件添加给小圆点的父节点或祖先节点，通过冒泡原理就能实现小圆点的点击事件
        $("#J_homeSwiper .swiper-pagination").on("click", "a", function () {
            // alert($(this).index());  //获取当前被点击控件的下标
            iNow = $(this).index(); //点击小圆点后切换当前显示的图片的下标并根据下标执行切换图片的方法
            tab();
            return false; //阻止a链接的默认行为，比如跳转页面或当前页面内跳转
        })

        //为轮播图左右箭头添加点击事件
        $(".swiper-button-prev,.swiper-button-next").click(function () {
            if (this.className == "swiper-button-prev") {
                iNow--;
                if (iNow == -1) {
                    iNow = aImgs.length - 1;
                }
            } else {
                iNow++;
            }
            tab();
        })
    }


    //侧边导航栏数据的加载
    function leftNavDownload() {
        $.ajax({
            url: "../data/nav.json",
            success: function (result) {
                var sideArr = result.sideNav;
                for (var i = 0; i < sideArr.length; i++) {
                    //使用$()和ECMA6语法创建节点对象
                    var node = $(`<li class = 'category-item'>
                    <a href="/index.html" class = 'title'>
                        ${sideArr[i].title}
                        <em class = 'iconfont-arrow-right-big'></em>
                    </a>
                    <div class="children clearfix" >
                        
                    </div>
                </li>`);
                    node.appendTo("#J_categoryList");
/* <li>
                                <a href="http://www.mi.com/redminote8pro" data-log_code="31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2" class="link clearfix" data-stat-id="d678e8386e9cb0fb" onclick="_msq.push(['trackEvent', '81190ccc4d52f577-d678e8386e9cb0fb', 'http://www.mi.com/redminote8pro', 'pcpid', '31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2']);">
                                    <img src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/cba27e53367b74271a38a4515a692816.png?thumb=1&amp;w=40&amp;h=40&amp;f=webp&amp;q=90" width="40" height="40" alt="" class="thumb">
                                    <span class="text">Redmi Note 8 Pro</span>
                                </a>
                            </li> */
                    //取出当前这个选项卡对应的子节点
                    var childArr = sideArr[i].child;
                    //向上取整，确定当前子节点需要存放为多少列(每列6个)
                    var col = Math.ceil(childArr.length / 6);
                    //设置容器的列数
                    node.find("div.children").addClass("children-col-"+col);
                    //通过循环，创建右侧展开页面的每一个数据
                    for (var j = 0; j < childArr.length; j++) {
                        if(j % 6 == 0){
                            var newUl = $(`<ul class="children-list children-list-col children-list-col-${parseInt(j / 6)}">
                        </ul>`);
                            //div.children(中间没有空格，有空格的代表后代)匹配同时包含div和.children的元素
                            newUl.appendTo(node.find("div.children"));
                        }
                        $(`<li>
                        <a href="http://www.mi.com/redminote8pro" data-log_code="31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2" class="link clearfix" data-stat-id="d678e8386e9cb0fb" onclick="_msq.push(['trackEvent', '81190ccc4d52f577-d678e8386e9cb0fb', 'http://www.mi.com/redminote8pro', 'pcpid', '31pchomeother001000#t=normal&amp;act=other&amp;page=home&amp;page_id=10530&amp;bid=3476792.2']);">
                            <img src="${childArr[j].img}" width="40" height="40" alt="" class="thumb">
                            <span class="text">${childArr[j].title}</span>
                        </a>
                    </li>`).appendTo(newUl);
                    }
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        })
    }


    //给侧边导航栏添加移入移出事件，实现选项卡切换操作
    function leftNavTab(){
        //【事件委托实现】：用于为动态添加的元素绑定事件
        $("#J_categoryList").on("mouseenter",".category-item",function(){
            //$(this)是委托者即category-item的元素
            $(this).addClass("category-item-active");
        })
        $("#J_categoryList").on("mouseleave",".category-item",function(){
            $(this).removeClass("category-item-active");
        })
    }

    //返回对外接口
    return {
        download: download,
        banner: banner,
        leftNavTab: leftNavTab  //切换侧边栏的选项卡
    }
})