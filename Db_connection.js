

function  databseConnection  (){
    return new Promise(( resolve ,reject ) =>{
    const mysql = require('mysql2')

    const connection = mysql.createConnection({
        host :'localhost',
        user:'root',
        password:'',
        database:'ludo',
    });

    connection.connect((err)=>{
        if(err){
            console.log("connection failed ",err);
            return reject(false)
            
        }else{
            console.log("connection success");
            resolve(connection);
        }
       
    })
});
}
module.exports = {databseConnection};
