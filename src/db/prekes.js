import mysql from "mysql";

const options = {
    host: "localhost",
    database: "cekiai",
    port: 3306,
    user:"adresu_knyga_prog",
    password:"adresu_knyga_prog"
}
function query(connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results, fields) => {
            if (err) {
               return reject(err)
            }
           return resolve({ 
                results,
                fields
            }) 
        })
    })
}
async function getPrekes() {
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        let  {results: r} = await query(
        connection,
        `select * from prekes`);
        return r;
}
finally {
   connection.end();
   console.log('connection ended');
}}

async function getPrekeOne(id) {
    id = parseInt(id);
    if (!isFinite(id)) {
        return null;
    }
    let connection;    
try {
    connection = mysql.createConnection(options)
    connection.connect();
    let  {results: r} = await query(
    connection,
    `select id, cekiai_id, pavadinimas, kaina, islaidu_tipai_id
    from prekes
    where id = ?`, 
    [id]);
    return r[0];

}
finally {
connection.end();
console.log('connection ended');
}   
}

async function deletePrekeOne(id) {
    id = parseInt(id);
    if (!isFinite(id)) {
        return;
    }
    let connection;    
try {
    connection = mysql.createConnection(options)
    connection.connect();
    let  {results: r} = await query(
    connection,
    `delete 
    from prekes
    where id = ?`, 
    [id]);
    return;
}
finally {
connection.end();
console.log('connection ended');
        }   
}

async function savePrekeOne(prekeOne) {
    let connection;  
    if (typeof prekeOne.id === "undefined") {
        try {
            connection = mysql.createConnection(options)
            connection.connect();
            await query(
            connection,
            `insert into 
            prekes
            (cekiai_id,pavadinimas,kaina, islaidu_tipai_id)
            values (?,?,?,?)`, 
            [prekeOne.cekiaiId, prekeOne.pavadinimas, prekeOne.kaina, prekeOne.islaiduTipaiId]);
            return ;
        }
        finally {
        connection.end();
        console.log('connection ended');
        }  
    }
    else {
        prekeOne.id = parseInt(prekeOne.id)
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        await query(
        connection,
        `update prekes
        set cekiai_id = ?, pavadinimas = ?, kaina = ?, islaidu_tipai_id = ?
        where id = ?`, 
        [prekeOne.cekiaiId, prekeOne.pavadinimas, prekeOne.kaina, prekeOne.islaiduTipaiId, prekeOne.id]);
        return;
    }
    finally {
    connection.end();
    console.log('connection ended');
    }   
    }
}
export {getPrekes, getPrekeOne, deletePrekeOne, savePrekeOne }