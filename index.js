const express = require('express');
const fs = require('fs');
const path = require('path');
var config = require(path.resolve(__dirname,'config.js'));
const request = require('request');
const mysql = require('mysql2');
const app = express();
app.use("/",express.static('./public'));
app.get("/list",async (req,res)=>{
    try {
        var connection = mysql.createConnection(config.connection);
        var data = await new Promise((resolve,reject)=>{
            connection.query(`
                SELECT * FROM comments;
            `,function(err,results,fields) {
                console.log(results);
                resolve(results);
            });
        });
        res.json({result:true,data:data});
    } catch(e) {
        console.log(e);
        res.json({result:false});
    }
});
app.post("/send",(req,res)=>{
    function convert_date(dt) {
        return dt.toISOString();
    }

    function genId(schema,size) {
        if(!schema) {
            schema = "";
        }
        var code = 'xxxxxxxxxxxxxxxx';
        if(size) {
            var sb = [];
            for(var x = 0; x < size;x++) {
                sb.push("x");
            }
            code = sb.join("");
        }
        return schema+(code).replace(/[x]/g, function(c) {
            var r = Math.random() * 16 | 0;
            if( c == 'x' ) {
                return r.toString(16);
            } else {
                return c;
            }
        });
    }

    
    function validString(str) {
        if(Object.prototype.toString.apply(str)!="[object String]" || str.length == 0 || str===null || str===undefined) {
            if(str===null || str ===undefined || str.length ==0) return `''`;
            
            throw new Error("invalid string");
        }
        var close = false;
        if(str.charAt(0) != '\'') close = true;
        else {
            if(str.charAt(str.length-1) == '\'') str = str.substring(1,str.length-1);
            else str = str.substring(1,str.length);
        }
        str = str.split("'").join("\\'");
        return '\'' + str + '\'';
    }

    var body = [];
    var total = 0;
    var error = false;
	req.on("data",(chunk)=>{
        body.push(chunk);
        total += chunk.length;
        if(total > 1000000) { // ~ 1min 30s de gravação
            req.connection.destroy();
            error = true;
        }
    });
	req.on("end",async ()=>{
        if(error) {
            return;
        }
        if(body.length>0) {
            try {
                var size = 0;
                for(var x = 0; x < body.length;x++) {
                    size += body[x].length;
                }
                var c = new Int8Array(size);
                var offset = 0;
                for(var x = 0; x < body.length;x++) {
                    if(x==0)
                        c.set(body[x])
                    else
                        c.set(body[x],offset);
                    offset += body[x].length;
                }


                var buffer = Buffer.from(c);
                var id = genId("msg");
                while(fs.existsSync("./public/messages/user1/"+id+".mp3")) {
                    id = genId("msg");
                }

                var connection = mysql.createConnection(config.connection);
                var maxid = await new Promise((resolve,reject)=>{
                    connection.query(
                        `
                            SELECT MAX(id) FROM comments;
                        `,function(err, results, fields) {
                            if(err) {
                                console.log(err);
                                reject( 0 );
                            }
                            resolve( results[0]['MAX(id)'] );
                        });
                });
                if(maxid == null) maxid = 0;
                console.log("MAXID",maxid);

                num = {
                    id : maxid+1,
                    user : 1,
                    state : 1,
                    mode : 1
                };
                text = {
                    date : convert_date(new Date()),
                    comment : "",
                    file : id
                };
                for(var key in text) {
                    text[key] = validString(text[key]);
                }

                var data = await new Promise((resolve,reject)=>{
                    connection.query(`
                        INSERT INTO \`comments\`(\`id\`,\`user\`,\`mode\`,\`state\`,\`file\`,\`date\`,\`comment\`)
                        VALUES
                        ( ${num.id}, ${num.user}, ${num.mode}, ${num.state}, ${text.file}, ${text.date}, ${text.comment} )
                    `,function(err,results,fields) {
                        console.log(results);
                        resolve(results);
                    });
                });

                fs.writeFileSync("./public/messages/user1/"+id+".mp3",buffer,"binary");
                res.json({result:true});

                return;
            } catch(e) {
                console.log(e);
                res.json({result:false});
                return;
            }
        }
        res.json({result:false});
    });
});

app.listen(8081,()=>{
    console.log("listening " + 8081);
});
