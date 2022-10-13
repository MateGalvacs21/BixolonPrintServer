let data = [];
let id;
let main = document.getElementById("main");
let LF = "\n";
let issueID = 1;
let p_result;
let p_name = "Printer1";

const print = () => {
    setPosId(issueID);
    setCharacterset(1250);
    checkPrinterStatus();

    function viewResult(result) {
        p_result = result;
        
        if (p_result === 'Cannot connect to server') {

            main.innerHTML += `<h4 style="color:red">${p_result}</h4>`
            main.innerHTML += `<h5 style="color:red">Nem sikerült asztalt kinyomtatni</h5>`


        }
        else if (p_result === 'No printers') {
            main.innerHTML += `<h4 style="color:red">${p_result}</h4>`
            main.innerHTML += `<h5 style="color:red">Nem sikerült asztalt kinyomtatni</h5>`
        }
        else if (p_result === '') {

        }
        else {
         
            main.innerHTML += `<h5 style="color:green">Sikeresen kinyomtattad asztalt! </h5>`
            
            for (let index = 0; index < data.length; index++) {
                
                fetch(`http://192.168.0.40:5500/delPrint/cb/${data[index]._id}`, {
                method: 'DELETE',
            })
            }
        }
    }

    for (let index = 0; index < data.length; index++) {
        printText("---------------------"+LF, 1, 1, true, false, false, 0,0);

        printText(data[index]._id.replace(".", "/") + LF, 3, 3, true, false, false, 0, 1);
        printText("---------------------"+LF, 1, 1, true, false, false, 0,0);

        id = data[index]._id;
        for (let item = 0; item < data[index].items.length; item++) {
            printText(data[index].items[item].count + " " + data[index].items[item].name, 2, 2, true, false, false, 0, 0);
            printText(data[index].items[item].props + LF, 1, 0, true, false, false, 0,0);
            printText("---------------------"+LF, 1, 1, true, false, false, 0,0);

        }
        cutPaper(1);
       

    }
    var strSubmit = getPosData();
    issueID++;
    requestPrint(p_name, strSubmit, viewResult);
    return true;

}



const fetcher = async () => {
    await fetch('http://192.168.0.40:5500/printdata/cb').then((response) => response.json()).then((log) => {
        data = log;
        main.innerHTML = `<h4 style="color:green">Adatok lekérése sikeres volt!</h4>`

    })
        .catch((error) => {
            main.innerHTML = `<h4 style="color:red">Hiba a serverhez való kapcsolódásban!</h4>`

        });

    switch (data.length === 0 || data.length === undefined) {
        case true:
            main.innerHTML += `<h4 style="color:yellow">Nem érkezett be új adat!</h4>`

            break;
        case false:
            main.innerHTML += `<h4 style="color:blue">Rendszerben tartott adatok száma: ${data.length}</h4>`
            print();
            break;
        default:

            break;
    }

};


setInterval(fetcher, 15000);

window.onload = fetcher