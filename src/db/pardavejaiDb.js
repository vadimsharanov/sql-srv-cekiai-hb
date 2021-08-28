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
async function getPardavejai() {
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        let  {results: r} = await query(
        connection,
        `select * from pardavejai`);
        return r;
}
finally {
   connection.end();
   console.log('connection ended');
}}

async function getVienasPardavejas(id) {
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
    from pardavejai
    where id = ?`, 
    [id]);
    return r[0];
}
finally {
connection.end();
console.log('connection ended');
}   
}

async function deletePardavejas(id) {
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
    from pardavejai
    where id = ?`, 
    [id]);
    return;
}
finally {
connection.end();
console.log('connection ended');
        }   
}

async function savePardavejas(pardavejas) {
    let connection;  
    if (typeof pardavejas.id === "undefined") {
        try {
            connection = mysql.createConnection(options)
            connection.connect();
            await query(
            connection,
            `insert into 
            pardavejai 
            (pavadinimas)
            values (?)`, 
            [pardavejas.pavadinimas]);
            return ;
        }
        finally {
        connection.end();
        console.log('connection ended');
        }  
    }
    else {
        pardavejas.id = parseInt(pardavejas.id)
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        await query(
        connection,
        `update pardavejai
        set pavadinimas = ? 
        where id = ?`, 
        [ pardavejas.pavadinimas,pardavejas.id]);
        return;
    }
    finally {
    connection.end();
    console.log('connection ended');
    }   
    }
}
export {getPardavejai, getVienasPardavejas, savePardavejas, deletePardavejas}
// , getOnePeople, deletePeople, savePeople};