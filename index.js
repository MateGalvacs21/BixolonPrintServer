const common=require("./untils/bxlcommon");
const pos=require("./untils/bxlpos");
const axios=require('axios')


let LF = "\n";
let issueID = 1;
let p_result;
let p_name = "Printer1";
let data;

function viewResult(result) {
    p_result = result;

    if(p_result==='Cannot connect to server'){
        console.log("\x1b[31m", p_result, "\x1b[0m")
    }
    else if(p_result==='No printers'){
        console.log("\x1b[31m", p_result, "\x1b[0m")
    }
    else if(p_result===''){
        
    }
    else{
        console.log("\x1b[32m", `Sikeresen kinyomtatott ${data.length} rendelést!`, "\x1b[0m")

    }
}


async function print() {
    pos.setPosId(issueID);
    pos.setCharacterset(1250);
    pos.checkPrinterStatus();
    await axios.get(`http://localhost:5500/printdata/cb`)
        .then((response) => {
            data = response.data;
            console.log("------------------------------");
            console.log("\x1b[32m", "Sikeres adatlekérdezés!", "\x1b[0m")
        }).catch((error) => {
            console.log("------------------------------");
            console.log("\x1b[31m", "Sikertelen adatlekérdezés!", "\x1b[0m")
            if (error) {
                data = []
            }
        });
    if (data.length !== 0) {
        console.log("\x1b[36m", `Beérkezett ${data.length} adat!`, "\x1b[0m");
        data.map((value) => {
            pos.printText(value._id.replace(".", "/") + LF, 2, 2, true, false, false, 0, 1);
            value.items.map((item) => {
                pos.printText(item.count+" "+item.item.name+LF,1, 2, true, false, false, 0, 1);
            })
        })


        pos.cutPaper(1);

        var strSubmit = pos.getPosData();

       

        issueID++;
        common.requestPrint(p_name, strSubmit, viewResult);

        return true;

    }
    else {
        console.log("\x1b[33m", "Nem érkezett be új adat!", "\x1b[0m");
    }
}
setInterval(print, 15000);