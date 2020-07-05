### 学习慕课网双越老师nodejs的博客项目,[慕课网视频地址](https://coding.imooc.com/class/320.html#Anchor)

**项目介绍**

技术栈：nodejs、mysql、redis、express、koa

纯后端项目，只有简单的前端页面来测试后端的功能.

**项目目录结构**

主分支master为原生nodejs所写的代码，分支refactor/express为用express框架重构后代码，分支refactor/koa为用koa框架重构后代码。

其中server为服务端，client为客户端，其中为了方便，master分支下的lib文件夹放置express和koa中中间件的实现代码。



**express模拟中间件简单总结**

代码执行顺序：


1. 一个中间件（use、get、post）被执行到后，处理参数（register），放入到对应的栈中
2. 创建服务中的函数（callback）执行，获取栈
3. 从栈中获取匹配的函数（match）,放入结果栈中（栈中可能包含中间件：路由，则回到1）
4. 递归 执行(handle)结果栈中的函数，如果其中某个函数不继续递归（或执行完），则结束

这个顺序也引发了我的一个思考，发现了一个问题：

​	因为一个路由是先经过router.use再到router.get的，所以router.get加入栈的时间节点是3，但是如果设置了捕捉404的router.use，那这个中间件函数反而会先入栈，从而比router.get更先执行，然后如果404直接就结束执行，那么router.get永远不会被执行。

​	实际操作发现原生的express也是这样。所以也理解了express为什么会有专门接受四个参数的错误处理中间件吧。