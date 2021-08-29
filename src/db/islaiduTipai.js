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
async function getIslaiduTipai() {
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        let  {results: r} = await query(
        connection,
        `select * from islaidu_tipai`);
        return r;
}
finally {
   connection.end();
   console.log('connection ended');
}}

async function getIslaiduTipasOne(id) {
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
    `select id, pavadinimas
    from islaidu_tipai
    where id = ?`, 
    [id]);
    return r[0];
}
finally {
connection.end();
console.log('connection ended');
}   
}

async function deleteIslaiduTipasOne(id) {
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
    from islaidu_tipai
    where id = ?`, 
    [id]);
    return;
}
finally {
connection.end();
console.log('connection ended');
        }   
}

async function saveIslaiduTipasOne(IslaiduTipasOne) {
    let connection;  
    if (typeof IslaiduTipasOne.id === "undefined") {
        try {
            connection = mysql.createConnection(options)
            connection.connect();
            await query(
            connection,
            `insert into 
            islaidu_tipai
            (pavadinimas)
            values (?)`, 
            [IslaiduTipasOne.pavadinimas]);
            return ;
        }
        finally {
        connection.end();
        console.log('connection ended');
        }  
    }
    else {
        IslaiduTipasOne.id = parseInt(IslaiduTipasOne.id)
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        await query(
        connection,
        `update islaidu_tipai
        set pavadinimas = ? 
        where id = ?`, 
        [IslaiduTipasOne.pavadinimas, IslaiduTipasOne.id]);
        return;
    }
    finally {
    connection.end();
    console.log('connection ended');
    }   
    }
}
export {getIslaiduTipai, getIslaiduTipasOne, deleteIslaiduTipasOne, saveIslaiduTipasOne }