1. 全局安装koa-generator
2. koa2 项目名称   创建项目
3. npm i nodemon cross-env -D
   npm i koa-generic-session koa-redis redis --save
    npm i mysql xss -S
    npm i koa-morgan -S
4. 更改package.json  
    "dev": "cross-env NODE_ENV=dev ./node_modules/.bin/nodemon bin/www",
    "prd": "cross-env NODE_ENV=production pm2 start bin/www",
