import { Injectable } from '@angular/core';
@Injectable()
export class FileUtilityService {
    downloadFile(data, filename, fields) {
        const csvData = this.ConvertToCSV(data, fields);
        const blob = new Blob(['\ufeff' + csvData], {
            type: 'text/csv;charset=utf-8;',
        });
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const isSafariBrowser =
            navigator.userAgent.indexOf('Safari') !== -1 &&
            navigator.userAgent.indexOf('Chrome') === -1;
        if (isSafariBrowser) {
            //if Safari open in new window to save file with random filename.
            downloadLink.setAttribute('target', '_blank');
        }
        downloadLink.setAttribute('href', url);
        downloadLink.setAttribute('download', filename + '.csv');
        downloadLink.style.visibility = 'hidden';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    /*eslint-disable */
    ConvertToCSV(objArray, headerList) {
        const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        let row = '';
        for (const index in headerList) {
            row += headerList[index] + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        for (let i = 0; i < array.length; i++) { 
            let line = '';
            for (const index in headerList) { 
                const head = headerList[index];
                line += ',' + array[i][head];
            }
            str += line;
        }
        return str;
    }
}
