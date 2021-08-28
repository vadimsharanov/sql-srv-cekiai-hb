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
async function getMokejimuTipai() {
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        let  {results: r} = await query(
        connection,
        `select * from mokejimu_Tipai`);
        return r;
}
finally {
   connection.end();
   console.log('connection ended');
}}

async function getMokejimuTipasOne(id) {
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
    from mokejimu_Tipai
    where id = ?`, 
    [id]);
    return r[0];
}
finally {
connection.end();
console.log('connection ended');
}   
}

async function deleteMokejimuTipasOne(id) {
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
    from mokejimu_Tipai
    where id = ?`, 
    [id]);
    return;
}
finally {
connection.end();
console.log('connection ended');
        }   
}

async function saveMokejimuTipasOne(mokejimuTipasOne) {
    let connection;  
    if (typeof mokejimuTipasOne.id === "undefined") {
        try {
            connection = mysql.createConnection(options)
            connection.connect();
            await query(
            connection,
            `insert into 
            mokejimu_Tipai
            (pavadinimas)
            values (?)`, 
            [mokejimuTipasOne.pavadinimas]);
            return ;
        }
        finally {
        connection.end();
        console.log('connection ended');
        }  
    }
    else {
        mokejimuTipasOne.id = parseInt(mokejimuTipasOne.id)
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        await query(
        connection,
        `update mokejimu_Tipai
        set pavadinimas = ? 
        where id = ?`, 
        [mokejimuTipasOne.pavadinimas, mokejimuTipasOne.id]);
        return;
    }
    finally {
    connection.end();
    console.log('connection ended');
    }   
    }
}
export {getMokejimuTipai, getMokejimuTipasOne, saveMokejimuTipasOne, deleteMokejimuTipasOne};