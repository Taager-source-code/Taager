import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Encoding } from "../admin/shipping-bulk-orders/shipping-bulk-orders.component";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  constructor() {}

  extractToExcel(array, fileName) {
    const separator = ",";
    const keys = Object.keys(array[0]);
    let csvContent = "\uFEFF";
    csvContent +=
      keys.join(separator) +
      "\n" +
      array
        .map((row) => {
          return keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? "" : row[k];
              cell =
                cell instanceof Date
                  ? cell.toLocaleString()
                  : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  mapGreenZoneToAramexCity(province) {
    let city = "";
    switch (province) {
      // case "Ø§Ù„Ø¹Ø§Ø´Ø± Ù…Ù† Ø±Ù…Ø¶Ø§Ù†":
      //   city = "10Th Of Ramadan City";
      //   break;

      case "15 Ù…Ø§ÙŠÙˆ":
        city = "15 Of May City";
        break;
      case "Ø¹Ø¨Ø§Ø³ÙŠÙ‡":
      case "Ø¹Ø¨Ø¯Ù‡ Ø¨Ø§Ø´Ø§":
      case "Ø¹ÙŠÙ† Ø´Ù…Ø³":
        city = "Abasya";
        break;
      case "Ø¹Ø¬ÙˆØ²Ù‡":
        city = "Agouza";
        break;
      case "Ø¹ÙŠÙ† Ø´Ù…Ø³":
        city = "Ain Shams";
        break;
      case "Ù‡Ø±Ù…":
        city = "Al Haram";
        break;
      case "Ø§Ù„Ù…Ø­Ù„Ù‡":
        city = "Al Mahala";
        break;
      case "Ø§Ù„Ù…Ø­Ù„Ø©":
        city = "Al Mahala";
        break;
      case "Ø§Ù„Ù…Ø·Ø±ÙŠÙ‡":
        city = "Al Matarya";
        break;
      case "Ø§Ù„Ù…Ù†ÙˆÙÙŠØ©":
      case "Ø§Ø´Ù…ÙˆÙ†":
      case "Ø¨Ø±ÙƒØ© Ø§Ù„Ø³Ø¨Ø¹":
      case "Ù…Ù†ÙˆÙ":
      case "Ù‚ÙˆÙŠØ³Ù†Ø§":
      case "Ø§Ù„Ù…Ù†ÙˆÙÙŠØ©":
      case "Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø³Ø§Ø¯Ø§Øª":
      case "Ø´Ø¨ÙŠÙ† Ø§Ù„ÙƒÙˆÙ…":
      case "Ø§Ù„Ø´Ù‡Ø¯Ø§Ø¡":
      case "ØªÙ„Ø§":
        city = "Al Menofiah";
        break;
      case "Ø§Ù„Ù…Ù†ÙŠØ¨":
        city = "Al Monib";
        break;
      case "Ø§Ù„Ø¹Ø¨ÙˆØ±":
        city = "Al Obour City";
        break;
      case "Ø§Ù„Ø´Ø±ÙˆÙ‚":
        city = "Al Shorouk";
        break;
      case "Ø§Ù„ÙˆØ§Ø­Ø§Øª ":
        city = "Al Wahat";
        break;
      case "Ø§Ù„ÙˆØ±Ø§Ù‚":
        city = "Al Waraq";
        break;
      case "Ø§Ø³ÙŠÙˆØ·":
      case "Ø§Ø¨Ù†ÙˆØ¨":
      case "Ø§Ø¨Ùˆ ØªÙŠØ¬":
      case "Ø§Ø³ÙŠÙˆØ· Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ø¯ÙŠØ±ÙˆØ·":
      case "Ø§Ù„Ø¨Ø¯Ø§Ø±ÙŠ":
      case "Ø§Ù„ØºÙ†Ø§ÙŠÙ…":
      case "Ø§Ù„Ù‚ÙˆÙŠØ³ÙŠÙ‡":
      case "Ø§Ù„ÙØªØ­":
      case "Ù…Ù†ÙÙ„ÙˆØ·":
      case "Ø³Ù‡Ù„ Ø³Ù„ÙŠÙ…":
      case "ØµØ±ÙÙ‡":
        city = "Assiut";
        break;
      case "Ø§Ø³ÙˆØ§Ù†":
      case "Ø£Ø³ÙˆØ§Ù†":
      case "Ø§Ù„Ø³Ø¯ Ø§Ù„Ø¹Ø§Ù„ÙŠ":
      case "Ø¶Ø±Ø§Ùˆ":
      case "Ø¶Ø±Ø§Ùˆ":
      case "Ø§Ø¯ÙÙˆ":
      case "Ø§Ù„ÙƒÙ„Ø¨Ø´Ù‡":
      case "ÙƒÙˆÙ… Ø§Ù…Ø¨Ùˆ":
      case "Ù…Ø±ÙƒØ² Ù†Ø§ØµØ±":
      case "Ù†ØµØ± Ø§Ù„Ù†ÙˆØ¨Ù‡":
      case "Ø§Ù„ØµØ¯Ø§Ù‚Ù‡ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
        city = "Aswan";
        break;
      case "Ø¹ÙˆØ§ÙŠØ¯ Ø±Ø§Ø³ Ø³ÙˆØ¯Ù‡":
        city = "Awaied-Ras Souda";
        break;
      case "Ù…Ø¯ÙŠÙ†Ø© Ø¨Ø¯Ø±":
        city = "Badr City";
        break;
      case "Ø¨Ù†ÙŠ Ø³ÙˆÙŠÙ":
      case "Ahnaseaa":
      case "Ø¨ÙŠØ¨Ù‡":
      case "Ø§Ù„ÙØ´Ù†":
      case "Ø§Ù„ÙƒØ±ÙŠÙ…Ø§Øª":
      case "Ø§Ù„ÙˆØ§Ø³Ø·Ù‡":
      case "Ù†Ø§ØµØ±":
      case "Ø¨Ù†ÙŠ Ø³ÙˆÙŠÙ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ø³Ù…Ø³Ø·Ù‡":
      case "Ø§Ù‡Ù†Ø§Ø³ÙŠØ§":
        city = "Bani Swif";
        break;
      case "Ø¨Ù„Ø¨ÙŠØ³":
        city = "Belbis";
        break;
      case "Ø¨Ù„Ù‚Ø§Ø³":
        city = "Belqas";
        break;
      case "Ø¨Ù†Ù‡Ø§":
        city = "Benha ";
        break;
      case "Ø¨Ø±ÙƒØ© Ø§Ù„Ø³Ø¨Ø¹":
        city = "Berkeit Sabb";
        break;
      case "Ø¨ÙˆÙ„Ø§Ù‚ Ø§Ù„Ø¯ÙƒØ±ÙˆØ±":
        city = "Bolak El Dakrour";
        break;
      case "Ø¨Ø±Ø¬ Ø§Ù„Ø¹Ø±Ø¨":
        city = "Borg Al Arab City";
        break;
      case "ÙƒÙˆØ±Ù†ÙŠØ´ Ø§Ù„Ù†ÙŠÙ„":
        city = "Cornish El Nile";
        break;
      case "Ø¯Ù…Ù†Ù‡ÙˆØ±":
      case "Ø§Ù„Ø¨Ø­ÙŠØ±Ø©":
      case "Ø§Ø¨Ùˆ Ø§Ù„Ù…Ø·Ø§Ù…ÙŠØ±":
      case "Ø§Ø¨Ùˆ Ø­Ù…Øµ":
      case "Ø§Ù„Ù…Ø­Ù…ÙˆØ¯ÙŠÙ‡":
      case "Ø§Ù„Ø±Ø­Ù…Ø§Ù†ÙŠÙ‡":
      case "Ø§Ù„Ø¨Ø­ÙŠØ±Ø©":
      case "Ø§Ø¯ÙÙŠÙ†Ø§":
      case "Ø§Ø¯ÙƒÙˆ":
      case "Ø§ÙŠØªØ§ÙŠ Ø§Ù„Ø¨Ø§Ø±ÙˆØ¯":
      case "Ø­ÙˆØ´ Ø¹ÙŠØ³ÙŠ":
      case "ÙƒÙØ± Ø§Ù„Ø¯ÙˆØ§Ø±":
      case "ÙƒÙˆÙ… Ø­Ù…Ø§Ø¯Ù‡":
      case "Ø±Ø§Ø´Ø¯":
      case "Ø´Ø¨Ø±Ø§Ø®ÙŠØª":
      case "ÙˆØ§Ø¯ÙŠ Ø§Ù„Ù†Ø·Ø±ÙˆÙ†":
      case "Ø¨Ø¯Ø±":
        city = "Damanhour";
        break;
      case "Ø¯Ø§Ø± Ø§Ù„Ø³Ù„Ø§Ù…":
        city = "Dar El Salam";
        break;
      // case "Ø¯Ø³ÙˆÙ‚":
      //   city = "Desouk";
      //   break;
      case "Ø¯Ù‚ÙŠ":
        city = "Dokki ";
        break;
      case "Ø¯Ù…ÙŠØ§Ø·":
      case "Ø§Ù„Ø²Ø±Ù‚Ø§":
      case "ÙØ§Ø±Ø³ÙƒÙˆØ±":
      case "ÙƒÙØ± Ø³Ø¹Ø¯":
      case "Ø¯Ù…ÙŠØ§Ø· Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ø±Ø§Ø³ Ø§Ù„Ø¨Ø±":
        city = "Dumiatta";
        break;
      case "Ø¬ÙˆÙ†Ù‡":
        city = "EL GOUNA";
        break;
      case "Ø§Ù„ÙƒØ±ÙŠÙ…Ø§Øª":
        city = "EL Korimat";
        break;
      case "Ø§Ù„Ø±Ø­Ø§Ø¨":
        city = "EL rehab";
        break;
      case "Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø³Ù„Ø§Ù…":
      case "Ø§Ù„Ø­Ø±ÙÙŠÙŠÙ†":
      case "Ø§Ù„Ù†Ù‡Ø¶Ù‡":
        city = "El Salam City";
        break;
      case "Ø§Ù„Ø²ÙŠØªÙˆÙ†":
      case "Ø­Ø¯Ø§ÙŠÙ‚ Ø§Ù„Ø²ÙŠØªÙˆÙ†":
      case "Ø­Ù„Ù…ÙŠØ© Ø§Ù„Ø²ÙŠØªÙˆÙ†":
        city = "El Zeitoun";
        break;
      case "Ø§Ù„ÙÙŠÙˆÙ…":
      case "Ø§Ø·Ø³Ù‡":
      case "Ø§Ø¨Ø´ÙˆÙŠ":
      case "Ø§Ù„Ø¹Ø¬Ù…ÙŠÙ†":
      case "ÙƒÙÙˆØ± Ø§Ù„Ù†ÙŠÙ„":
      case "Ù…Ù†Ø´ÙŠÙ‡ Ø¹Ø¨Ø¯ Ø§Ù„Ù„Ù‡":
      case "Ù…Ù†Ø´ÙŠÙ‡ Ø¬Ù…Ø§Ù„":
      case "Ø§Ù„ÙÙŠÙˆÙ… Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ø³Ù†Ù‡ÙˆØ±":
      case "Ø³Ø±Ø³Ù†Ø§":
      case "Ø³Ù†ÙˆØ±Ø³":
      case "Ø·Ø§Ù…ÙŠÙ‡":
      case "ÙŠÙˆØ³Ù Ø§Ù„ØµØ¯ÙŠÙ‚":
      case "Ù…Ù†Ø´ÙŠÙ‡ Ù„Ø·Ù Ø§Ù„Ù„Ù‡":
        city = "Fayoum";
        break;
      case "Ø¬Ø§Ø±Ø¯Ù† Ø³ÙŠØªÙŠ":
        city = "Garden City";
        break;
      case "ØºÙ…Ø±Ù‡":
        city = "Ghamrah";
        break;
      case "Ø§Ù„Ø¬ÙŠØ²Ù‡":
      case "Ø§Ù„Ø¬ÙŠØ²Ø©":
      case "6 Ø§ÙƒØªÙˆØ¨Ø±":
      case "Ø¹Ø¬ÙˆØ²Ù‡":
      case "Ø§Ù„Ù…Ù†ÙŠØ¨":
      case "Ø§Ù„ÙˆØ§Ø­Ø§Øª":
      case "Ø¨ÙˆÙ„Ø§Ù‚ Ø§Ù„Ø¯ÙƒØ±ÙˆØ±":
      case "Ø¯Ù‚ÙŠ":
      case "ÙÙŠØµÙ„":
      case "Ø­Ø¯Ø§ÙŠÙ‚ Ø§Ù„Ø§Ù‡Ø±Ø§Ù…":
      case "Ù‡Ø±Ù…":
      case "Ø§Ù…Ø¨Ø§Ø¨Ù‡":
      case "ÙƒÙŠØª ÙƒØ§Øª":
      case "Ù…Ù†ÙŠÙ„":
      case "Ù…Ù‡Ù†Ø¯Ø³ÙŠÙ†":
      case "Ø¹Ù…Ø±Ø§Ù†ÙŠÙ‡":
      case "Ù‚Ø³Ù… Ø§Ù„Ø¬ÙŠØ²Ù‡":
      case "Ø³Ø§Ù‚ÙŠØ© Ù…ÙƒÙŠ":
      case "Ø´ÙŠØ® Ø²Ø§ÙŠØ¯":
      case "Ø§Ù„Ù‚Ø±ÙŠÙ‡ Ø§Ù„Ø²ÙƒÙŠÙ‡":
      case "ØªØ±Ø³Ø§":
      case "Ø§Ù„ÙˆØ±Ø§Ù‚":
      case "Ø§Ø±Ø¶ Ø§Ù„Ù„ÙˆØ§Ø¡":
      case "Ù†Ø²Ù„Ù‡ Ø§Ù„Ø³Ù…Ø§Ù†":
      case "Ø­Ø¯Ø§ÙŠÙ‚ Ø§ÙƒØªÙˆØ¨Ø±":
      case "Ø§Ù„Ø¨Ø­Ø± Ø§Ù„Ø§Ø¹Ø¸Ù…":
        city = "Giza";
        break;
      case "Ø­Ø¯Ø§ÙŠÙ‚ Ø§Ù„Ù‚Ø¨Ù‡":
        city = "Hadayek El Qobah";
        break;
      case "Ù‡Ù„ÙŠÙˆØ¨Ù„ÙŠØ³":
      case "Ø§Ù„Ø²Ø§ÙˆÙŠÙ‡ Ø§Ù„Ø­Ù…Ø±Ù‡":
      case "Ø§Ù„Ù…Ø§Ø¸Ù‡":
      case "Ø§Ù…ÙŠØ±ÙŠÙ‡":
      case "Ø¬Ø³Ø± Ø§Ù„Ø³ÙˆÙŠØ³":
      case "Ù…Ø³Ø§ÙƒÙ† Ø´ÙŠØ±Ø§ØªÙˆÙ†":
      case "Ø§Ù„Ù†Ø²Ù‡Ù‡ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ù…ØµØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©":
        city = "Heliopolis";
        break;
      case "Ø­Ù„ÙˆØ§Ù†":
      case "Ø­Ø¯Ø§ÙŠÙ‚ Ø­Ù„ÙˆØ§Ù†":
        city = "Helwan";
        break;
      case "Ø§Ù„Ø³Ø¯ Ø§Ù„Ø¹Ø§Ù„ÙŠ":
        city = "High Dam";
        break;
      case "Ø§Ù„Ø¨Ø­Ø± Ø§Ù„Ø£Ø­Ù…Ø± / Ø§Ù„ØºØ±Ø¯Ù‚Ø©":
      case "Ø§Ù„ØºØ±Ø¯Ù‚Ù‡":
      case "Ø¬ÙˆÙ†Ù‡":
      case "Ù…Ø±Ø³ÙŠ Ø¹Ù„Ù…":
      case "Ù‚ÙˆØµÙŠØ±":
      case "Ø±Ø§Ø³ ØºØ§Ø±Ø¨":
      case "Ø§Ù„Ø¨Ø­Ø±Ø§Ù„Ø£Ø­Ù…Ø±":
      case "Ø³ÙØ§Ø¬Ù‡":
      case "Ø§Ù„Ø¯Ù‡Ø§Ø±":
      case "Ø§Ù„Ø§Ø­ÙŠØ§Ù‡":
        city = "Hurghada";
        break;
      case "Ø§Ù…Ø¨Ø§Ø¨Ù‡":
        city = "Imbaba";
        break;
      case "Ø§Ù„Ø§Ø³Ù…Ø§Ø¹ÙŠÙ„ÙŠØ©":
      case "Ø§Ø¨Ùˆ Ø³Ù„Ø·Ø§Ù†":
      case "Ø§Ø¨Ùˆ ØµÙˆÙŠØ±":
      case "Ø§Ù„Ù‚ØµØ§ØµÙŠÙ†":
      case "Ø§Ù„ØµØ§Ù„Ø­ÙŠÙ‡ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ø§Ù„ØªÙ„ Ø§Ù„ÙƒØ¨ÙŠØ±":
      case "ÙØ§ÙŠØ¯":
      case "Ù†ÙÙŠØ´Ù‡":
      case "Ù‚Ù†Ø·Ø±Ù‡ ØºØ±Ø¨":
      case "Ø³Ø±Ø§Ø¨ÙŠÙˆÙ…":
      case "Ø­ÙŠ Ø«Ø§Ù„Ø«":
      case "Ø§Ø¨Ùˆ Ø¹Ø·ÙˆÙ‡":
      case "Ø§Ù„Ø³Ù„Ø§Ù…":
      case "Ø§Ù„Ø´ÙŠØ® Ø²Ø§ÙŠØ¯":
        city = "Ismailia";
        break;
      case "ÙƒÙØ± Ø§Ù„Ø´ÙŠØ®":
      case "Ø§Ù„Ø±ÙŠØ§Ø¶":
      case "Ø¨Ù„Ø·ÙŠÙ…":
      case "Ø¨ÙŠÙ„Ø§":
      case "Ø¨Ø±Ù„Ø³":
      case "Ø¯Ø³ÙˆÙ‚":
      case "ÙÙˆÙ‡":
      case "Ø­Ø§Ù…ÙˆÙ„":
      case "Ù…Ø·ÙˆØ¨Ø³":
      case "Ù‚Ù„ÙŠÙ†":
      case "Ø³ÙŠØ¯ÙŠ Ø³Ø§Ù„Ù…":
        city = "Kafr Al Sheikh";
        break;
      case "Ù‚Ù‡Ø§":
        city = "Kaha ";
        break;
      case "Ø§Ù„Ù‚ØµØ± Ø§Ù„Ø¹ÙŠÙ†ÙŠ":
        city = "Kasr El Einy";
        break;
      case "Ù‚Ø·Ø§Ù…ÙŠÙ‡":
        city = "Katamiah";
        break;
      case "Ø§Ù„Ù‚Ø·Ø§Ù…ÙŠØ©":
        city = "Katamiah";
        break;
      case "Ø§Ù„Ø£Ù‚ØµØ±":
      case "Ø§Ø±Ù…Ù†Ø· ØºØ±Ø¨":
      case "Ø§Ø±Ù…Ù†Ø· Ø´Ø±Ù‚":
      case "Ø§Ù„ÙƒØ±Ù†Ùƒ":
      case "Ø§Ù„ÙƒØ±Ù†Ù‡":
      case "Ø§Ø³Ù†ÙŠ":
      case "Ø§Ù„Ù…Ù†Ø´Ø§Ù‡":
      case "Ø§Ù„Ø¶Ø¨Ø¹ÙŠÙ‡":
        city = "Luxour";
        break;
      case "Ù…Ø¯ÙŠÙ†ØªÙŠ":
        city = "Madinaty";
        break;
      case "Ù…Ù†ÙŠÙ„ Ø§Ù„Ø±ÙˆØ¶Ù‡":
      case "Ù…ØµØ± Ø§Ù„Ù‚Ø¯ÙŠÙ…Ù‡":
        city = "Manial El Rodah";
        break;
      case "Ø§Ù„Ø¯Ù‚Ù‡Ù„ÙŠØ©":
      case "Ø§Ù„Ù…Ù†ØµÙˆØ±Ù‡":
      case "Ø¨Ù„Ù‚Ø§Ø³":
      case "Ø¯Ù‚Ø±Ù†Ø³":
      case "Ø§Ù„Ø³Ù†Ø¨Ù„ÙˆÙŠÙŠÙ†":
      case "Ø§Ù„Ù…Ù†Ø²Ù„Ù‡":
      case "Ù…ÙŠØª ØºÙ…Ø±":
      case "Ù…Ù†ÙŠØ© Ø§Ù„Ù†ØµØ±":
      case "Ù†Ø¨Ø±ÙˆÙ‡":
      case "Ø´Ø±Ø¨ÙŠÙŠÙ†":
      case "Ø·Ù„Ø®Ø§":
      case "Ø§Ù„Ø¬Ù…Ø§Ù„ÙŠÙ‡":
      case "Ø¬Ù…ØµÙ‡":
        city = "Mansoura";
        break;
      case "Ù…Ø±Ø³ÙŠ Ø¹Ù„Ù…":
        city = "Marsa Alam";
        break;
      case " Ù…Ø±Ø³ÙŠ Ù…Ø·Ø±ÙˆØ­":
      case "Ù…Ø±Ø³ÙŠ Ù…Ø·Ø±ÙˆØ­":
      case "Ù…Ø·Ø±ÙˆØ­":
      case "Ø§Ù„Ø¯Ø§Ø¨Ø§":
      case "Ø§Ù„Ø¹Ù„Ù…ÙŠÙ†":
      case "Ø§Ù„Ø³Ø§Ø­Ù„ Ø§Ù„Ø´Ù…Ø§Ù„Ù‰":
      case "Ø³ÙŠØ¯ÙŠ Ø¹Ø¨Ø¯ Ø§Ù„Ø±Ø­Ù…Ù†":
        city = "Marsa Matrouh";
        break;
      case "Ù…ÙŠØª ØºÙ…Ø±":
        city = "Meet Ghamr";
        break;
      case "Ù…Ù‡Ù†Ø¯Ø³ÙŠÙ†":
        city = "Mohandiseen";
        break;
      case "Ù…Ù‚Ø·Ù…":
      case "Ø§Ù„Ø§Ø¨Ø§Ø¬ÙŠÙ‡":
      case "Ø§Ù„Ù‚Ù„Ø¹Ù‡":
      case "Ø§Ù„ÙØ³Ø·Ø§Ø·":
      case "Ø³ÙŠØ¯Ù‡ Ø¹Ø§ÙŠØ´Ù‡":
      case "Ø³ÙŠØ¯Ù‡ Ù†ÙÙŠØ³Ù‡":
        city = "Mokattam";
        break;
      case "Ù…Ø³Ø·Ø±Ø¯":
        city = "Moustorod";
        break;
      case "Ù†Ø¬Ø¹ Ø­Ù…Ø§Ø¯ÙŠ":
        city = "Nag Hamadi";
        break;
      case "Ù…Ø¯ÙŠÙ†Ø© Ù†ØµØ±":
      case "Ø²Ù‡Ø±Ø§Ø¡ Ù…Ø¯ÙŠÙ†Ù‡ Ù†ØµØ±":
        city = "Nasr City";
        break;

      // case "Ø§Ù„ØµØ§Ù„Ø­ÙŠÙ‡ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      //   city = "New Salhia";
      //   break;

      case "Ø¹Ù…Ø±Ø§Ù†ÙŠÙ‡":
        city = "Omranya";
        break;
      case "Ø¨ÙˆØ± Ø³Ø¹ÙŠØ¯":
      case "Ø¨ÙˆØ± ÙØ¤Ø§Ø¯":
      case "Ø§Ù„Ø²Ù‡ÙˆØ±":
      case "Ø§Ù„Ø³ÙŠØ¯Ù‡ Ù†ÙÙŠØ³Ù‡":
      case "Ø­ÙŠ Ø§Ù„Ù…Ù†Ø§Ø®":
      case "Ø§Ù„Ø¶ÙˆØ§Ø­Ù‰":
      case "Ø­Ù‰ Ø§Ù„Ø´Ø±Ù‚":
      case "Ø­ÙŠ Ø§Ù„Ø¹Ø±Ø¨":
      case "Ø­ÙŠ Ø§Ù„Ø¶ÙˆØ§Ø­ÙŠ":
        city = "Port Said";
        break;
      case "Ù‚Ù„ÙŠÙˆØ¨":
        city = "Qalioub";
        break;
      case "Ø§Ù„Ù‚Ù„ÙŠÙˆØ¨ÙŠØ©":
      case "Ø§Ù„Ø´Ø§Ø±Ø¹ Ø§Ù„Ø¬Ø¯ÙŠØ¯":
      case "Ø§Ù… Ø¨ÙŠÙˆÙ…ÙŠ":
      case "Ø§Ù… Ø¨ÙŠÙˆÙ…ÙŠ":
      case "Ø·ÙˆØ®":
        city = "Qaliubia";
        break;
      case "Ù‚Ù†Ø§":
      case "Ø§Ø¨Ùˆ ØªØ´Ø·":
      case "Ø¯Ø´Ù†Ø§":
      case "ÙØ±Ø´ÙˆØ·":
      case "Ù†Ø¬Ø¹ Ø­Ù…Ø§Ø¯ÙŠ":
      case "Ù†Ù‚Ø§Ø¯Ù‡":
      case "Ù‚ÙˆØ³":
      case "Ù‚ÙØ·":
      case "Ø§Ù„ÙˆÙ‚Ù":
      case "Ø§Ù„Ø¨Ù†Ø¯Ø±Ù‡":
        city = "Qena";
        break;
      case "Ù‚ÙˆÙŠØ³Ù†Ø§":
        city = "Quesna";
        break;
      case "Ø±Ù…Ø³ÙŠØ³":
      case "Ø§Ù„Ø¶Ø§Ù‡Ø±":
        city = "Ramsis";
        break;
      case "Ø±Ø§Ø³ ØºØ§Ø±Ø¨":
        city = "RAS GHAREB";
        break;

      // case "Ø±Ø£Ø³ Ø³Ø¯Ø±":
      //   city = "Ras Seidr";
      //   break;

      case "Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø³Ø§Ø¯Ø§Øª":
        city = "Sadat City";
        break;
      case "Ø³ÙØ§Ø¬Ù‡":
        city = "Safaga";
        break;
      case "Ø³ÙŠØ¯ÙŠ ÙƒØ±ÙŠØ±":
        city = "Sedi Kreir";
        break;
      case "Ø´Ø±Ù… Ø§Ù„Ø´ÙŠØ®":
      case "Ø¬Ù†ÙˆØ¨ Ø³ÙŠÙ†Ø§Ø¡":
      case "Ø±Ø£Ø³ Ø³Ø¯Ø±":
        city = "Sharm El Sheikh";
        break;
      case "Ø´Ø¨ÙŠÙ† Ø§Ù„ÙƒÙˆÙ…":
        city = "Shebin El Koum";
        break;
      case "Ø´Ø¨Ø±Ø§":
      case "Ø±ÙˆØ¶ Ø§Ù„ÙØ±Ø¬":
      case "Ù…Ø³Ø·Ø±Ø¯":
      case "Ø´Ø¨Ø±Ø§ Ø§Ù„Ø®ÙŠÙ…Ù‡":
        city = "Shubra";
        break;
      case "Ø´Ø¨Ø±Ø§ Ø§Ù„Ø®ÙŠÙ…Ù‡":
      case "Ù…Ø³Ø·Ø±Ø¯":
        city = "Shubra El Kheima";
        break;
      case "Ø³ÙˆÙ‡Ø§Ø¬":
      case "Ø§Ø®Ù…ÙŠÙ…":
      case "Ø¯Ø§Ø± Ø§Ù„Ø³Ù„Ø§Ù…":
      case "Ø§Ù„Ù…Ù†Ø´Ø§Ù‡":
      case "Ø§Ù„Ø¨Ù„ÙŠÙ†Ø§":
      case "Ø¬Ø±Ø¬Ø§":
      case "ØºÙŠÙ†Ø§":
      case "Ù…Ø±ØºØ§":
      case "Ø³Ù‚Ø·Ù„Ù‡":
      case "Ø·Ù‡Ø·Ø§":
      case "Ø·Ù…Ø§":
        city = "sohag City";
        break;
      case "Ø§Ù„Ø§Ø¯Ø¨ÙŠÙ‡":
      case "Ø§Ù„Ø³ÙˆÙŠØ³":
      case "Ø³ÙˆÙŠØ³":
      case "Ø¹ØªØ§Ù‚Ù‡":
      case "Ø§Ù„Ø§Ø±Ø¨Ø¹ÙŠÙ†":
      case "Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„":
      case "Ø§Ù„Ø³Ù„Ø§Ù…":
      case "Ø§Ù„Ù†Ù‡Ø¶Ù‡":
      case "Ø¨ÙˆØ±ØªÙˆÙÙŠÙ‚":
      case "Ø­ÙŠ ÙÙŠØµÙ„":
        city = "Suez";
        break;
      case "Ø·Ù†Ø·Ø§":
      case "Ø§Ù„ØºØ±Ø¨ÙŠØ©":
      case "Ø§Ù„Ø³Ù†Ø·Ù‡":
      case "Ø¨Ø³ÙŠÙˆÙ†":
      case "Ø§Ù„ØºØ±Ø¨ÙŠØ©":
      case "ÙƒÙØ± Ø³Ø¹Ø¯":
      case "Ù‚Ø·ÙˆØ±":
      case "Ø³Ù…Ù†ÙˆØ¯":
      case "Ø²ÙØªØ§":
      case "ÙƒÙØ± Ø§Ù„Ø²ÙŠØ§Øª":
        city = "Tanta";
        break;
      case "ÙˆØ§Ø¯ÙŠ Ø§Ù„Ù†Ø·Ø±ÙˆÙ†":
        city = "Wadi El Natroun";
        break;
      case "Ø§Ù„Ø´Ø±Ù‚ÙŠØ©":
      case "Ø²Ù‚Ø§Ø²ÙŠÙ‚":
      case "Ø§Ù„Ø¹Ø§Ø´Ø± Ù…Ù† Ø±Ù…Ø¶Ø§Ù†":
      case "Ø§Ø¨Ùˆ Ø­Ù…Ø§Ø¯":
      case "Ø§Ø¨Ùˆ ÙƒØ¨ÙŠØ±":
      case "Ø§Ù„Ø­Ø³Ù†ÙŠÙ‡":
      case "Ø§Ù„Ø§Ø¨Ø±Ø§Ù‡ÙŠÙ…ÙŠÙ‡":
      case "Ø§Ù„ØµØ§Ù„Ø­ÙŠÙ‡ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ø§ÙˆÙ„Ø§Ø¯ ØµÙ‚Ø±":
      case "Ø¨Ù„Ø¨ÙŠØ³":
      case "Ø¯Ø±Ø¨ Ù†Ø¬Ù…":
      case "ÙØ§Ù‚ÙˆØ³":
      case "Ù‡ÙŠÙ‡Ø§":
      case "ÙƒÙØ± ØµÙ‚Ø±":
      case "Ù…Ø´ØªÙˆÙ„ Ø§Ù„Ø³ÙˆÙ‚":
      case "Ù…Ù†ÙŠØ§ Ø§Ù„Ù‚Ù…Ø­":
        city = "Zakazik";
        break;
      case "Ø²Ù…Ø§Ù„Ùƒ":
        city = "Zamalek";
        break;

      // case "6 Ø§ÙƒØªÙˆØ¨Ø±":
      //   city = "October City";
      //   break;

      case "Ø§Ù„Ø³Ø§Ø­Ù„ Ø§Ù„Ø´Ù…Ø§Ù„ÙŠ":
        city = "Marinah";
        break;
      case "Ø§Ù„Ø¹ÙŠÙ† Ø§Ù„Ø³Ø®Ù†Ø©":
        city = "Ein Al Sukhna";
        break;
      case "Ø§Ù„Ù‚Ø§Ù‡Ø±Ù‡ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„":
      case "Ø§Ù„ØªØ¬Ù…Ø¹ Ø§Ù„Ø§ÙˆÙ„":
      case "Ø§Ù„ØªØ¬Ù…Ø¹ Ø§Ù„Ø«Ø§Ù„Ø«":
      case "Ø§Ù„ØªØ¬Ù…Ø¹ Ø§Ù„Ø®Ø§Ù…Ø³":
        city = "New Cairo";
        break;

      // What it is supposed to do if this function receive "Ø§Ù„Ù‚Ø§Ù‡Ø±Ù‡" or "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©"?!
      // Please remove "Ø§Ù„Ù‚Ø§Ù‡Ø±Ù‡" and "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©" from green zone and location
      // case "Ø§Ù„Ù‚Ø§Ù‡Ø±Ù‡":
      //   city = "Cairo";
      //   break;

      case "Ø§Ù„Ø£Ø³ÙƒÙ†Ø¯Ø±ÙŠØ©":
      case "Ø§Ø¨Ùˆ Ù‚ÙŠØ±":
      case "Ø§Ù„Ø¹Ø§Ù…Ø±ÙŠÙ‡":
      case "Ø§Ù„Ø¨ÙŠØ·Ø§Ø´":
      case "Ø§Ù„Ù†Ù‡Ø¶Ù‡ Ø§Ù„Ø¹Ø§Ù…Ø±ÙŠÙ‡":
      case "Ø§Ù„Ø³ÙŠÙˆÙ":
      case "Ø¹ØµØ§ÙØ±Ù‡":
      case "Ø§Ø²Ø§Ø±ÙŠØ·Ù‡":
      case "Ø¨Ù†Ø¬Ø± Ø§Ù„Ø³ÙƒØ±":
      case "Ø³ÙŠØªÙŠ Ø³Ù†ØªØ±":
      case "Ø§Ù„Ø¹Ø¬Ù…ÙŠ":
      case "Ø§Ù„Ø¨Ø±Ø¬ Ø§Ù„Ù‚Ø¯ÙŠÙ…":
      case "Ø¬Ù„ÙŠÙ…":
      case "ÙƒÙØ± Ø¹Ø¨Ø¯Ù‡":
      case "Ø®ÙˆØ±Ø´ÙŠØ¯":
      case "Ù„ÙˆØ±Ø§Ù†":
      case "Ù…Ø¹Ù…ÙˆØ±Ù‡":
      case "Ù…Ø­Ø·Ø© Ø§Ù„Ø±Ù…Ù„":
      case "Ù…Ù†Ø¯Ø±Ù‡":
      case "Ù…Ù†Ø´ÙŠÙ‡":
      case "Ù…ÙŠØ§Ù…ÙŠ":
      case "Ù…Ù†ØªØ²Ù‡":
      case "Ø±Ø´Ø¯ÙŠ":
      case "Ø³Ø§Ù† Ø³ØªÙŠÙØ§Ù†Ùˆ":
      case "Ø³ÙŠØ¯ÙŠ Ø¨Ø´Ø±":
      case "Ø³ÙŠØ¯ÙŠ Ø¬Ø§Ø¨Ø±":
      case "Ø³ÙŠØ¯ÙŠ ÙƒØ±ÙŠØ±":
      case "Ø³Ù…ÙˆØ­Ù‡":
      case "Ø³Ø¨ÙˆØ±ØªÙ†Ø¬":
      case "Ø§Ø³ØªØ§Ù†Ù„ÙŠ":
      case "Ø²ÙŠØ²Ù†ÙŠØ§":
      case "Ø­ÙŠ Ø§Ù„Ø¬Ù…Ø±Ùƒ":
      case "ÙƒØ§Ù…Ø¨ Ø´ÙŠØ²Ø§Ø±":
      case "Ù…Ø­Ø±Ù… Ø¨Ùƒ":
      case "ÙƒÙŠÙ„ÙˆØ¨Ø§ØªØ±Ø§":
      case "ÙÙ„Ù…Ù†Ø¬":
      case "Ø§Ù„Ù…ÙƒØ³":
      case "Ø§Ù„Ù†Ø®ÙŠÙ„":
      case "Ø§Ù„Ø¹Ø·Ø§Ø±ÙŠÙ†":
      case "Ø§Ù„Ø§Ø²Ø§Ø±ÙŠØ·Ù‡":
      case "Ø§Ù„Ø­Ø¶Ø±Ù‡ Ø§Ù„Ù‚Ø¨Ù„ÙŠÙ‡":
      case "Ø³ØªØ§Ù†Ù„ÙŠ":
      case "Ø§Ù„Ù…Ø·Ø§Ø±":
      case "ÙÙŠÙƒØªÙˆØ±ÙŠØ§":
      case "Ù‚Ø¨Ø§Ø±ÙŠ":
      case "ÙƒÙŠÙ†Ø¬ Ù…Ø±ÙŠÙˆØ·":
      case "ØºØ¨Ø±ÙŠØ§Ù„":
      case "Ø·ÙˆØ³ÙˆÙ†":
      case "ÙƒØ±Ù…ÙˆØ²":
      case "Ø¨Ø­Ø±ÙŠ":
      case "Ø§Ù„Ø´Ø·Ø¨ÙŠ":
      case "Ø§Ù„Ø¸Ø§Ù‡Ø±ÙŠÙ‡":
        city = "Alexandria";
        break;
      case "Ù…Ù†ÙŠØ§":
      case "Ø§Ø¨Ùˆ Ù‚Ø±Ù‚Ø§Øµ":
      case "Ø¨Ù†ÙŠ Ù…Ø²Ø§Ø±":
      case "Ø¯Ø±Ù…Ø§ÙˆØ³":
      case "Ø§Ù„Ø¹Ø¯ÙˆÙ‡":
      case "Ù…Ù„Ø§ÙˆÙŠ":
      case "Ù…Ø·Ø§ÙŠ":
      case "Ù…ØºØ§ØºÙ‡":
      case "Ø³Ù…Ù„ÙˆØ·":
      case "Ù…Ù†ÙŠØ§ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
        city = "Menia City";
        break;

      // case "Ø§Ù„ÙˆØ§Ø¯ÙŠ Ø§Ù„Ø¬Ø¯ÙŠØ¯":
      //   city = "Siwa";
      //   break;

      // case "":
      //   city = "Abo Rawash";
      //   break;
      // case "":
      //   city = "ABOU SOMBO";
      //   break;
      // case "":
      //   city = "Abu Zaabal";
      //   break;
      // case "":
      //   city = "Al Arish";
      //   break;
      // case "":
      //   city = "Al Nobariah";
      //   break;

      case "Ø§Ù„Ù‚Ù†Ø§Ø·Ø± Ø§Ù„Ø®ÙŠØ±ÙŠÙ‡":
      case "Ø´Ø¨ÙŠÙ† Ø§Ù„Ù‚Ù†Ø§Ø·Ø±":
        city = "AL Qanater";
        break;

      // case "":
      //   city = "Al Tour City";
      //   break;
      // case "":
      //   city = "Alex Desert Rd.";
      //   break;
      // case "":
      //   city = "Atfeah";
      //   break;

      case "Ø§Ù„Ø§Ø²Ù‡Ø±":
      case "Ø§Ù„Ù…Ø³ÙƒÙŠ":
        city = "Attaba";
        break;

      // case "":
      //   city = "Badrashin";
      //   break;
      // case "":
      //   city = "Bahtem";
      //   break;
      // case "":
      //   city = "Bargiel";
      //   break;
      // case "":
      //   city = "Beigam";
      //   break;
      // case "":
      //   city = "Cairo Suez Desert Rd";
      //   break;
      // case "":
      //   city = "Dahab City";
      //   break;
      // case "":
      //   city = "Dahshour";
      //   break;

      case "Ø¹Ø§Ø¨Ø¯ÙŠÙ†":
      case "ÙˆØ³Ø· Ø§Ù„Ø¨Ù„Ø¯":
      case "Ø§Ù„ØªØ­Ø±ÙŠØ±":
      case "Ø³ÙŠØ¯Ù‡ Ø²ÙŠÙ†Ø¨":
        city = "Down Town";
        break;

      // case "":
      //   city = "El Ayat";
      //   break;
      // case "":
      //   city = "El Hawamdiah";
      //   break;
      // case "":
      //   city = "El Maadi";
      //   break;

      case "Ø¨Ø³Ø§ØªÙŠÙ†":
      case "Ø­Ø¯Ø§ÙŠÙ‚ Ø§Ù„Ù…Ø¹Ø§Ø¯ÙŠ":
      case "Ù…Ø¹Ø§Ø¯ÙŠ":
      case "Ù…Ø¹Ø§Ø¯ÙŠ Ø¯Ø¬Ù„Ù‡":
      case "Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ù…Ø¹Ø±Ø§Ø¬":
      case "Ø§Ù„Ù…Ø¹Ø§Ø¯ÙŠ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ù‡":
      case "Ø²Ù‡Ø±Ø§Ø¡ Ø§Ù„Ù…Ø¹Ø§Ø¯ÙŠ":
        city = "Maadi";
        break;

      // case "":
      //   city = "El Marg";
      //   break;
      // case "":
      //   city = "Al Marg";
      //   break;
      // case "":
      //   city = "El Qantara Sharq";
      //   break;
      // case "":
      //   city = "El Saf";
      //   break;
      // case "":
      //   city = "EL SAWAH";
      //   break;

      case "Ø§Ù„Ø¯Ø§Ø®Ù„Ù‡":
      case "Ø§Ù„Ø®Ø§Ø±Ø¬Ù‡":
      case "Ø§Ù„ÙˆØ§Ø¯ÙŠ Ø§Ù„Ø¬Ø¯ÙŠØ¯":
        city = "El Wadi El Gadid";
        break;

      // case "":
      //   city = "Fayid";
      //   break;
      // case "":
      //   city = "Inshas";
      //   break;
      // case "":
      //   city = "Khanka";
      //   break;
      // case "":
      //   city = "Mansheyt Naser";
      //   break;
      // case "":
      //   city = "Marabella";
      //   break;
      // case "":
      //   city = "Maraqia";
      //   break;
      // case "":
      //   city = "New Capital City";
      //   break;
      // case "":
      //   city = "Nuwibaa";
      //   break;
      // case "":
      //   city = "Rafah";
      //   break;
      // case "":
      //   city = "Ras Shoqeir";
      //   break;
      // case "":
      //   city = "Saqara";
      //   break;
      // case "":
      //   city = "Taba City";
      //   break;
      // case "":
      //   city = "Tebin";
      //   break;
      // case "":
      //   city = "Torah";
      //   break;
      // case "":
      //   city = "Toshka";
      //   break;
    }
    return city;
  }

  mapNumbersToSuspendedReasons = (number) => {
    let suspendedReason = "";
    switch (Number(number)) {
      case 1:
        suspendedReason = "Ø¥Ø®ØªÙ„Ø§Ù Ø³Ø¹Ø± Ù…Ø¹ Ø§Ù„Ø¹Ù…ÙŠÙ„";
        break;
      case 2:
        suspendedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø±ÙØ¶ Ø¥Ø¹Ø·Ø§Ø¡ Ø¹Ù†ÙˆØ§Ù†";
        break;
      case 3:
        suspendedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø±ÙØ¶ Ø¨Ø³Ø¨Ø¨ Ø§Ù„ØªØ¬Ø±Ø¨Ø©";
        break;
      case 4:
        suspendedReason = "Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙŠØ±ÙŠØ¯ Ø®ØµÙ… Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù†ØªØ¬";
        break;
      case 5:
        suspendedReason = "Ø§Ø®ØªÙ„Ø§Ù ÙÙŠ Ø¬Ø¯Ø§ÙˆÙ„ Ø§Ù„ØªÙˆØµÙŠÙ„";
        break;
      case 6:
        suspendedReason = "Ù„Ø§ ÙŠØ±Ø¯ Ùˆ ØªÙ… Ø¥Ù†Ù‡Ø§Ø¡ Ù…Ø­Ø§ÙˆÙ„Ø§Øª Ø§Ù„Ø£ØªØµØ§Ù„";
        break;
      case 7:
        suspendedReason = "Ø§Ù„Ø±Ù‚Ù… Ù„Ø§ ÙŠØ®Øµ Ø§Ù„Ø¹Ù…ÙŠÙ„";
        break;
      case 8:
        suspendedReason = "Ø§Ù„Ø±Ù‚Ù… Ø®Ø·Ø£";
        break;
      case 9:
        suspendedReason = "ØªØ£Ø¬ÙŠÙ„ Ø§Ù„Ø£ÙˆØ±Ø¯Ø± Ù…Ø¹ Ù‚Ø³Ù… Ø§Ù„ØªØ§ÙƒÙŠØ¯";
        break;
      default:
        suspendedReason = "";
    }

    return suspendedReason;
  };

  detectEncoding(file): Observable<string> {
    let result = new Subject<string>();
    const reader = new FileReader();
    reader.onload = (e) => {
      const codes = new Uint8Array(e.target.result as ArrayBuffer);
      const detectedEncoding = Encoding.detect(codes);
      result.next(detectedEncoding);
    };
    reader.readAsArrayBuffer(file);
    return result.asObservable();
  }
}
