const Koa = require('koa');
const app = new Koa();

const static = require('koa-static');
const path = require('path');
const bodyparser = require('koa-bodyparser');
const router = require('koa-router')();
const query = require('./db/query')

app.use(static(path.join(process.cwd(),'public')));
app.use(bodyparser());
app.use(router.routes());
app.use(router.allowedMethods());

//获取数据
router.get('/api/list',async ctx=>{
    let result = await query('select * from userlist');
    ctx.body = result
})
//添加数据
router.post('/api/add',async ctx=>{
    let {note,type,sort} = ctx.request.body;
    if(note && type && sort){
        let result = await query('select * from userlist where sort=?',[sort])
        if(result.length){
            //已存在
            ctx.body = {
                code:0,
                msg:'已存在'
            }
        }else{
            let create_time = new Date();
            let data = await query('insert into userlist (note,type,sort,create_time) values (?,?,?,?)',[note,type,sort,create_time]);
            if(data === 'error'){
                ctx.body = {
                    code:0,
                    msg:"添加失败"
                }
            }else{
                ctx.body = {
                    code:1,
                    msg:"添加成功"
                }
            }
        }
    }else{
        ctx.body = {
            code:2,
            msg:'信息不完善'
        }
    }
})
//删除数据
router.get('/api/del',async ctx=>{
    let {id} = ctx.query;
        await query('delete from userlist where id=?',[id]);
    ctx.body = {
        code:1,
        msg:'删除成功'
    }
})
//修改
router.post('/api/edit',async ctx=>{
    let {note,type,sort,id} = ctx.request.body;
    let create_time = new Date();
        await query('update userlist set note=?,type=?,sort=?,create_time=? where id=?',[note,type,sort,create_time,id]);
    ctx.body = {
        code:1,
        msg:'修改成功'
    }    
})
//模糊搜索
router.get('/api/search',async ctx=>{
    let {note} = ctx.query;
    let data = "";
    if(note){
        data = `select * from userlist where note like '%${note}%'`
    }else{
        data = `select * from userlist`
    }
    try{
        let list = await query(data);
        ctx.body={
            code:1,
            data:list
        }
    }catch(e){
        ctx.body={
            code:0,
            msg:'查询失败'
        }   
    }
})
app.listen(3000,()=>{
    console.log("port in is 3000")
})