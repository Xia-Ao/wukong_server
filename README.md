# 嗷嗷发布系统后台
仿照 贝贝集团 悟空发布系统（应用预发，线上部署环境）原理，精简版嗷嗷发布系统。


### 启动
启动
```
npm run dev
```

部署
```
pm2 start app.js --watch --name wukong_server
```

## 功能：

- 发布计划
- ~~代码CR~~
- 预发布
- 正式发布
- 合并主干
- ~~回滚~~
- 预发环境访问/线上环境访问

实现原理:

预发布过程

![预发布过程](https://img.xiaao.xin/image/M00/00/01/L2Kexl6BxXWADScpAAJD4SsY76I026.png)

正式发布过程
![正式发布过程](https://img.xiaao.xin/image/M00/00/01/L2Kexl6BxeSAcombAAE9xV4-VCM177.png)

预发环境访问验证和线上环境访问实现：

在企业运维服务层面，一个应用（项目）对应的都是一个集群，有多个线上实例和一个预发环境的实例，但是在嗷嗷发布系统中，没有那么多的实例资源，选择使用目录用来区分应用和环境。

![](https://img.xiaao.xin/image/M00/00/01/L2Kexl6ByJWAFefrAAIoDu1UjMo644.png)

这边有一个很骚的操作，请求如何访问预发和线上，原公司的操作是种cookie，通过cookie来区分访问的是预发环境还是线上环境。

个人感觉比较好的做法是指定ip或者专门设置一个预发的域名或者路径。

## 技术栈

Koa + Koa-Router

## 目录
方面之后迭代快速回忆和定位问题。

```

```



