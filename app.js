/**
 * Created by luwenwei on 18/5/6.
 */
const Sequelize = require('sequelize');
const sequelize = new Sequelize('novel', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    port: 5432,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

const User = sequelize

// force: true 如果表已经存在，将会丢弃表
/*User.sync({force: true}).then(() => {
    // 表已创建
    return User.create({
        firstName: 'l',
        lastName: 'ww'
    });
}).then(function(jane) {
    //获取数据  
    console.log(jane.get({
        plain: true
    }));
}).catch(function (err) {
    //异常捕获  
    console.log('Unable to connect to the database:', err);
});*/

User.findAll().then(users => {
    console.log(users.get({
        plain: true
    }));
});
