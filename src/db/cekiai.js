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
async function getCekiai() {
        let connection;    
    try {
        connection = mysql.createConnection(options)
        connection.connect();
        let  {results: r} = await query(
        connection,
        `
        select cekiai.id, data, pardavejai.pavadinimas as pardavejaiPavadinimas, mokejimu_tipai.pavadinimas as mokejimuTipaiPavadinimas, sum(prekes.kaina) as sumKaina, count(prekes.id) as prekiuKiekis
        from cekiai left join prekes on prekes.cekiai_id = cekiai.id join mokejimu_tipai on mokejimu_tipai.id = cekiai.mokejimu_tipai_id
        join pardavejai on cekiai.pardavejai_id = pardavejai.id 
        group by cekiai.id, data, pardavejai.pavadinimas, mokejimu_tipai.pavadinimas
        `);
        return r;
}
finally {
   connection.end();
   console.log('connection ended');
}}

async function getCekisOne(id) {
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
    `select  cekiai.id, cekiai.data,  prekes.pavadinimas as prekesPavadinimas,
    prekes.kaina,
    islaidu_tipai.pavadinimas as islaiduTipaiPavadinimas,
    pardavejai.pavadinimas,
    cekiai.mokejimu_tipai.pavadinimas as cekiaiMokejimuTipai, prekes.id as prekesId
    from prekes, islaidu_tipai, cekiai, pardavejai, mokejimu_tipai
    where cekiai.id = prekes.cekiai_id and
    prekes.islaidu_tipai_id = islaidu_tipai.id and
    cekiai.pardavejai_id = pardavejai.id and
    cekiai.mokejimu_tipai_id = mokejimu_tipai.id and
    cekiai.id = ?
`, 
    [id]);
    console.log(r);
    return r;

}
finally {
connection.end();
console.log('connection ended');
}   
}

async function deleteCekiaiOne(id) {
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
    from cekiai
    where id = ?`, 
    [id]);
    return;
}
finally {
connection.end();
console.log('connection ended');
        }   
}

async function saveCekiaiOne(cekiaiOne) {
    let connection;  
    if (typeof cekiaiOne.id === "undefined") {
        try {
            connection = mysql.createConnection(options)
            connection.connect();
            await query(
            connection,
            `insert into 
            cekiai
            (Data,pardavejai_ID,mokejimu_tipai_ID)
            values (?,?,?)`, 
            [cekiaiOne.cekioData, cekiaiOne.cekioPardavejai, cekiaiOne.cekioMokejimoTipai]);
            return ;
        }
        finally {
        connection.end();
        console.log('connection ended');
        }  
    }
}
export {getCekiai, getCekisOne, saveCekiaiOne, deleteCekiaiOne }