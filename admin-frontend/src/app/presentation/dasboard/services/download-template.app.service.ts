import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class DownloadTemplateService {
  downloadFile(data, filename, fields) {
    let csvData = this.ConvertToCSV(data, fields);
    let blob = new Blob(["\ufeff" + csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let downloadLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      downloadLink.setAttribute("target", "_blank");
    }
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", filename + ".csv");
    downloadLink.style.visibility = "hidden";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  downloadPayloadResponse(data, filename) {
    let csvData = JSON.stringify(data);
    let blob = new Blob(["\ufeff" + csvData], {
      type: "text;charset=utf-8;",
    });
    let downloadLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      downloadLink.setAttribute("target", "_blank");
    }
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", filename + ".txt");
    downloadLink.style.visibility = "hidden";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "";
    for (let index in headerList) {
      row += headerList[index] + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in headerList) {
        let head = headerList[index];
        line += "," + array[i][head];
      }
      str += line;
    }
    return str;
  }
}
