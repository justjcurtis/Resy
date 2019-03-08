export function tableToCsv(data : string [][]) {
    var csv = 'Name,Value,Comment\n';
    data.forEach(row => {
        csv += row[0] + ',' + row[1] + ',' + row[2] + '\n';
    });
    return csv;
}

export function csvToTableData(csv:string){
    var data : string [][] = [];
    csv = csv.replace(/"/g,'');
    var rowsjoined = csv.split('\n');

    var i = 0;
    rowsjoined.forEach(row=>{
        if(i==0 && row == "Name,Value,Comment"){
            return;
        }
        var split = row.split(',');
        if(split.length>3){
            throw "Invalid csv file for resx conversion";
        }
        data.push();
        i++;
    });
    return data;
}