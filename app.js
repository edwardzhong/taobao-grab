const koa = require('koa')
const app = new koa()
const Pug = require('koa-pug')
const favicon = require('koa-favicon')
const path = require('path')
const {infoReq,rankReq} =require('./lib')

const pug = new Pug({
    viewPath: './',
    debug: false,
    pretty: false,
    compileDebug: false,
    locals: { app: 'grab taobao' },
    basedir: '/',
    app: app // equals to pug.use(app) and app.use(pug.middleware)
});

pug.locals.mode = process.env.NODE_ENV;
app.use(favicon(path.join(__dirname, 'favicon.jpg')));

app.use(async (ctx, next) => {
    if (ctx.path === '/') {
        ctx.render('index.pug');
    } else if(ctx.path === '/info'){
        const id = ctx.query.id;
        if(id){
            const info = await infoReq(id);
            ctx.type = 'text/plain; charset=utf-8';
            ctx.body=info;
        } else {
            ctx.body='please input good id'
        }
    } else if(ctx.path === '/rank'){
        const kw = ctx.query.kw;
        if(kw){
            const rs = await rankReq(kw);
            ctx.body=rs.slice(0,40);
        } else {
            ctx.body='please input key word'
        }
    }
});

// deal 404
app.use(async (ctx, next) => {
    ctx.status = 404;
    ctx.body = '404! page not found !';
});

// koa already had middleware to deal with the error, just rigister the error event
app.on('error', (err, ctx) => {
    ctx.status = 500;
    ctx.statusText = 'Internal Server Error';
    if (ctx.app.env === 'development') { //throw the error to frontEnd when in the develop mode
        ctx.res.end(err.stack); //finish the response
    } else {
        ctx.res.end('Server Error');
    }
});

if (!module.parent) {
    app.listen(9191);
    console.log('app server running at: http://localhost:%d', 9191);
}