import express from "express";
import exphbs from "express-handlebars";
import { readFile, writeFile } from "fs/promises";
import {getMokejimuTipai, getMokejimuTipasOne, saveMokejimuTipasOne, deleteMokejimuTipasOne } from "./db/mokejimuTipai.js";
import {getPardavejai, getVienasPardavejas, savePardavejas, deletePardavejas} from "./db/pardavejaiDb.js";

const SERVER_PORT = 3000;
const WEB_DIR = "web";
const DATA_FILE = "zmones.json"
const KLAIDA = "404-mergaite.html"

const app = express()
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
                    // midlewar'u registravimo tvarka, turi reiksme
app.use(express.static(WEB_DIR,    // pagal default'ine reiksme, programa skaitys is pradziu index.html,
                    // bet boolean'u false mes pasakome, kad default'a panaikiname
));                // Reaguoja i visas uzklausas, patikrina, ar web direktorijoje yra toks failas, 
                    //jeigu yra - uzklausa apdorojama[nusius atsakyma narsyklej],
                    // ir next() nekvieciamas, o jei yra yra, tai kviecia funckjia next, ir ziures, kokius middlewar'us reikia atlikti.

// app.use((req, res, next) => { // login middleWar'as
//     console.log(req);        // kiekviena uzklausa(request) bus atspausdinta;
//                             // iskviesdamas sia funckija, sakau, kad apdorojimas dar nebaigtas, liepiu dirbti kitiem savo darba.
// })

app.use(express.urlencoded( {
    extended:true
}))
app.use(express.json());

app.get("/pardavejai", async function (req, res) {  // generuojame zmoniu sarasa
    try {
    let pardavejai = await getPardavejai() 
    res.render("pardavejai", { pardavejai , title: "Pilnas zmoniu sarasas"});
}
    catch (err) {
        console.log("Ivyko klaida:", err);
        res.status(500).end(`<html><body><${err.message}/body></html>`)
}
})

app.get("/pardavejas/:id", async (req, res) => { // sukuriame atskira puslapy, kiekvienam zmogui
    try {
        let pardavejas = null;
        if (req.params.id) {
        pardavejas = await getVienasPardavejas(req.params.id)
}
    res.render("pardavejas", { pardavejas, title: "Pardavejo informacija"});
}
    catch (err) {
    console.log(err);
    res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
});

app.post("/pardavejas", async (req, res) => {  // naujo zmogaus kurimas
    try {
        await savePardavejas(req.body)
        res.redirect("/pardavejai")
}
catch (err) {
    console.log(err);
        res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
})
app.get("/pardavejas/:id/delete", async (req, res) => { // padarom linka, i kuri nuejus zmogus trinamas
    try {
        await deletePardavejas(req.params.id)
        res.redirect("/pardavejai")
}
    catch (err) {
        console.log(err);
    res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
});


app.get("/mokejimuTipai", async function (req, res) {  // generuojame zmoniu sarasa
    try {
    let mokejimuTipai = await getMokejimuTipai() 
    res.render("mokejimuTipai", { mokejimuTipai , title: "Mokejimu tipu zmoniu sarasas"});
}
    catch (err) {
        console.log("Ivyko klaida:", err);
        res.status(500).end(`<html><body><${err.message}/body></html>`)
}
})
app.get("/mokejimuTipasOne/:id", async (req, res) => { // sukuriame atskira puslapy, kiekvienam zmogui
    try {
        let mokejimuTipasOne = null;
        if (req.params.id) {
            mokejimuTipasOne = await getMokejimuTipasOne(req.params.id)
}
    res.render("mokejimuTipasOne", { mokejimuTipasOne, title: "Mokejimu tipo  informacija"});
}
    catch (err) {
    console.log(err);
    res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
});

app.post("/mokejimuTipai", async (req, res) => {  // naujo zmogaus kurimas
    try {
        await saveMokejimuTipasOne(req.body)
        res.redirect("/mokejimuTipai")
}
catch (err) {
    console.log(err);
        res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
})
app.get("/mokejimuTipasOne/:id/delete", async (req, res) => { // padarom linka, i kuri nuejus zmogus trinamas
    try {
        await deleteMokejimuTipasOne(req.params.id)
        res.redirect("/mokejimuTipai")
}
    catch (err) {
        console.log(err);
    res.status(500).end(await readFile(KLAIDA, {
        encoding:"utf-8"
    }));
}
});
// // app.get("/redagavimas/:id", async (req, res) => { // zmogaus redagavimas
// //     try {
// //         let zmones = await readFile(DATA_FILE, {
// //             encoding:"utf-8"
// //         })
// //         zmones = JSON.parse(zmones);
// //         const id = parseInt(req.params.id);
// //         const zmogus = zmones.find(z => z.id === id);
// //         res.render("redagavimas", { zmogus, title: "Zmogaus redagavimas"});
// //         if (req.query.naujasVardas === undefined || req.query.naujasVardas === ""){
// //         }
// //         else {
// //         zmones[zmones.indexOf(zmogus)].vardas = req.query.naujasVardas;
// //         zmones[zmones.indexOf(zmogus)].pavarde = req.query.naujaPavarde;
// //         zmones[zmones.indexOf(zmogus)].alga = parseFloat(req.query.naujaAlga);
// //         }
// //         await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
// //             encoding:"utf8"
// //         })
// //     }
// //     catch (err) {
// //             res.status(500).end(await readFile(KLAIDA, {
// //         encoding:"utf-8"
// //     }));
// //     }
// // });
// app.get("/json/zmogus", async(req, res) => {
//         try {
//             let zmones = await readFile(DATA_FILE, {
//             encoding:"utf-8"
//         })
//         zmones = JSON.parse(zmones);
//         res.set("Content-Type", "application/json") // siunciant respons'a atgal, nustatome tipa
//         res.send(JSON.stringify(zmones))
    
//     }
//         catch (err) {
//         res.status(500).end(await readFile(KLAIDA, {
//             encoding:"utf-8"
//         }));
//     }
// });

// app.delete("/json/zmogus/:id", async(req, res) => { 
//     try {
//         let zmones = await readFile(DATA_FILE, {
//         encoding:"utf-8"
//     })
//     zmones = JSON.parse(zmones); 
//     const id = parseInt(req.params.id);
//     const index = zmones.findIndex(z => z.id === id);
//     if (index >=0) {
//         zmones.splice(index, 1)
//         await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
//             encoding:"utf-8"
//         })
//     }
//     res.status(200).end();
//     }
//     catch (err) {
//     res.status(500).end(await readFile(KLAIDA, {
//         encoding:"utf-8"
//     }));
//     }
    
// }); // zmogaus trinimas, naudojant DOM



//     app.post("/json/zmogus", async(req, res) => { // naujo zmogaus kurimas, naudojant DOM
//         try {
//             let zmones = await readFile(DATA_FILE, {
//             encoding:"utf-8"
//         })
//         zmones = JSON.parse(zmones);

//         let zmogus;
//         if (req.body.id) {
//             const id = parseInt(req.body.id);
//             zmogus = zmones.find(z => z.id === id);
//              if (zmogus) {
//                  zmogus.vardas = req.body.vardas
//                  zmogus.pavarde = req.body.pavarde
//                  zmogus.alga = parseFloat(req.body.alga);
//              }
//              else {
//                  res.render("nera", {id})
//                  return;
//              }
//         }
        
//         else {
//             let nextId = 0;
//             for (const zmogus of zmones) {
//                 if (zmogus.id > nextId) {
//                     nextId = zmogus.id
//                 }
//             }
//             nextId++;
//             zmogus = {
//             id: nextId,
//             vardas: req.body.vardas,
//             pavarde: req.body.pavarde,
//             alga: parseFloat(req.body.alga),
//         };
//         zmones.push(zmogus);
//         };
//         await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
//             encoding:"utf8"
//         })
//         res.set("Content-Type", "application/json") // siunciant respons'a atgal, nustatome tipa
//         res.send(JSON.stringify(zmogus))
//         res.status(201).end()
//     }
//     catch (err) {
//             res.status(500).end(await readFile(KLAIDA, {
//             encoding:"utf-8"
//         }));
//     }
    
//     })
//     app.put("/json/zmogus/:id", async(req, res) => { 
//         try {
//             let zmones = await readFile(DATA_FILE, {
//             encoding:"utf-8"
//         })
//         zmones = JSON.parse(zmones); 
//         const id = parseInt(req.params.id);
//         const zmogus = zmones.find(z => z.id === id);
//         if (zmogus) {
//             zmogus.vardas = req.body.vardas;
//             zmogus.pavarde = req.body.pavarde;
//             zmogus.alga = parseFloat(req.body.alga)
//             await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
//                 encoding:"utf-8"
//             })
//             res.status(200).end(JSON.stringify(zmogus));
//         }
//         else {
//             res.status(404).end()
//         }
//         }
//         catch (err) {
//         res.status(500).end(await readFile(KLAIDA, {
//             encoding:"utf-8"
//         }));
//         }
        
//     });
app.listen(SERVER_PORT)

console.log(`Server started at port: ${SERVER_PORT}`);


    