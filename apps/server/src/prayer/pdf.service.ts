import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import 'dayjs/locale/uz-latn';

dayjs.locale('uz-latn');

interface PrayerData {
  date: string;
  prayers: {
    bomdod: boolean;
    peshin: boolean;
    asr: boolean;
    shom: boolean;
    xufton: boolean;
    vitr: boolean;
  };
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generatePrayerTablePdf(
    userId: string,
    prayers: any[],
    userInfo?: { name: string; email: string },
  ): Promise<Buffer> {
    this.logger.log(`Starting PDF generation for user: ${userId}`);
    let browser;

    try {
      // Ma'lumotlarni sanalar bo'yicha guruhlash
      const groupedPrayers = this.groupPrayersByDate(prayers);
      this.logger.log(`Grouped ${prayers.length} prayers`);

      // HTML content yaratish
      const htmlContent = this.generateHtmlContent(groupedPrayers, userInfo);
      this.logger.log('HTML content generated');

      // PDF yaratish
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
        ],
        timeout: 60000, // 60 soniya
      });
      this.logger.log('Browser launched');

      const page = await browser.newPage();

      // Timeout sozlamalari
      page.setDefaultNavigationTimeout(60000); // 60 soniya
      page.setDefaultTimeout(60000);

      // MUHIM: waitUntil ni 'load' ga o'zgartirish (networkidle0 juda sekin)
      await page.setContent(htmlContent, {
        waitUntil: 'load', // 'networkidle0' o'rniga
        timeout: 60000,
      });
      this.logger.log('Content loaded');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
        timeout: 60000,
      });
      this.logger.log('PDF generated successfully');

      return Buffer.from(pdfBuffer);
    } catch (error) {
      this.logger.error('PDF generation failed:', error.message);
      throw new Error(`PDF yaratishda xatolik: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        this.logger.log('Browser closed');
      }
    }
  }

  private groupPrayersByDate(prayers: any[]): Map<string, PrayerData> {
    const grouped = new Map<string, PrayerData>();

    prayers.forEach((prayer) => {
      const dateStr = dayjs(prayer.date).format('YYYY-MM-DD');

      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, {
          date: dateStr,
          prayers: {
            bomdod: false,
            peshin: false,
            asr: false,
            shom: false,
            xufton: false,
            vitr: false,
          },
        });
      }

      const data = grouped.get(dateStr);
      const prayerKey = prayer.prayerType.key;
      if (data && prayerKey in data.prayers) {
        data.prayers[prayerKey] = prayer.isCompleted;
      }
    });

    return grouped;
  }

  private generateHtmlContent(
    groupedPrayers: Map<string, PrayerData>,
    userInfo?: { name: string; email: string },
  ): string {
    const sortedDates = Array.from(groupedPrayers.keys()).sort();
    const totalPrayers = sortedDates.length * 6;
    const completedPrayers = sortedDates.reduce((acc, date) => {
      const data: any = groupedPrayers.get(date);
      return (
        acc +
        Object.values(data.prayers).filter((completed) => completed).length
      );
    }, 0);
    const percentage =
      totalPrayers > 0
        ? ((completedPrayers / totalPrayers) * 100).toFixed(1)
        : '0.0';

    let tableRows = '';
    let currentYear = '';

    sortedDates.forEach((dateStr, index) => {
      const data: any = groupedPrayers.get(dateStr);
      const year: any = dayjs(dateStr).format('YYYY');

      // Yangi yil boshlanganda sarlavha qo'shish
      if (year !== currentYear) {
        currentYear = year;
        tableRows += `
          <tr class="year-header">
            <td colspan="8">${year}-yil</td>
          </tr>
        `;
      }

      const formattedDate = dayjs(dateStr).format('DD MMMM, YYYY');

      tableRows += `
        <tr class="${index % 2 === 0 ? 'even-row' : 'odd-row'}">
          <td class="text-center">${index + 1}</td>
          <td>${formattedDate}</td>
          <td class="checkbox-cell">
            <div class="checkbox ${data.prayers.bomdod ? 'checked' : ''}">
              ${data.prayers.bomdod ? '<span class="checkmark">✓</span>' : ''}
            </div>
          </td>
          <td class="checkbox-cell">
            <div class="checkbox ${data.prayers.peshin ? 'checked' : ''}">
              ${data.prayers.peshin ? '<span class="checkmark">✓</span>' : ''}
            </div>
          </td>
          <td class="checkbox-cell">
            <div class="checkbox ${data.prayers.asr ? 'checked' : ''}">
              ${data.prayers.asr ? '<span class="checkmark">✓</span>' : ''}
            </div>
          </td>
          <td class="checkbox-cell">
            <div class="checkbox ${data.prayers.shom ? 'checked' : ''}">
              ${data.prayers.shom ? '<span class="checkmark">✓</span>' : ''}
            </div>
          </td>
          <td class="checkbox-cell">
            <div class="checkbox ${data.prayers.xufton ? 'checked' : ''}">
              ${data.prayers.xufton ? '<span class="checkmark">✓</span>' : ''}
            </div>
          </td>
          <td class="checkbox-cell">
            <div class="checkbox ${data.prayers.vitr ? 'checked' : ''}">
              ${data.prayers.vitr ? '<span class="checkmark">✓</span>' : ''}
            </div>
          </td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <title>Qazo Namozlar Jadvali</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 20px;
            background-color: #ffffff;
            color: #1f2937;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 25px;
            background-color: #000000;
            color: #ffffff;
            border-radius: 8px;
          }

          .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .header p {
            font-size: 12px;
            color: #9ca3af;
          }

          .user-info {
            background: #f9fafb;
            padding: 15px 20px;
            border-radius: 6px;
            margin-bottom: 25px;
            border-left: 3px solid #000000;
          }

          .user-info p {
            margin: 4px 0;
            color: #4b5563;
            font-size: 13px;
          }

          .user-info strong {
            color: #1f2937;
          }

          .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }

          .stat-card {
            background: #ffffff;
            padding: 18px;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #e5e7eb;
          }

          .stat-card .label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
          }

          .stat-card .value {
            font-size: 28px;
            font-weight: 700;
            color: #000000;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
          }

          thead {
            background-color: #000000;
            color: #ffffff;
          }

          th {
            padding: 14px 10px;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          td {
            padding: 12px 10px;
            text-align: left;
            font-size: 12px;
            border-bottom: 1px solid #e5e7eb;
            color: #374151;
          }

          .text-center {
            text-align: center;
          }

          .even-row {
            background-color: #ffffff;
          }

          .odd-row {
            background-color: #f9fafb;
          }

          .year-header {
            background-color: #f3f4f6 !important;
            font-weight: 700;
            font-size: 13px;
            color: #000000 !important;
            text-align: center !important;
          }

          .year-header td {
            text-align: center !important;
            padding: 12px;
            border-bottom: 2px solid #d1d5db;
          }

          .checkbox-cell {
            text-align: center !important;
            padding: 8px !important;
          }

          .checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #d1d5db;
            border-radius: 3px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
          }

          .checkbox.checked {
            background-color: #000000;
            border-color: #000000;
          }

          .checkmark {
            color: #ffffff;
            font-size: 14px;
            font-weight: bold;
            line-height: 1;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            padding: 20px;
            background: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }

          .footer p {
            color: #6b7280;
            font-size: 11px;
            margin: 4px 0;
          }

          .footer strong {
            color: #000000;
            font-size: 13px;
          }

          .footer .dua {
            font-style: italic;
            color: #4b5563;
            margin-top: 12px;
            padding: 12px;
            background: #ffffff;
            border-radius: 4px;
            font-size: 12px;
            border-left: 3px solid #000000;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Qazo Namozlar Jadvali</h1>
          <p>Yaratilgan: ${dayjs().format('DD MMMM YYYY, HH:mm')}</p>
        </div>

        ${
          userInfo
            ? `
        <div class="user-info">
          <p><strong>Ism:</strong> ${userInfo.name}</p>
          <p><strong>Email:</strong> ${userInfo.email}</p>
        </div>
        `
            : ''
        }

        <div class="stats">
          <div class="stat-card">
            <div class="label">Jami kunlar</div>
            <div class="value">${sortedDates.length}</div>
          </div>
          <div class="stat-card">
            <div class="label">Jami namozlar</div>
            <div class="value">${totalPrayers}</div>
          </div>
          <div class="stat-card">
            <div class="label">O'qilgan</div>
            <div class="value">${completedPrayers}</div>
          </div>
          <div class="stat-card">
            <div class="label">Foiz</div>
            <div class="value">${percentage}%</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 5%;">№</th>
              <th style="width: 22%;">Sana</th>
              <th style="width: 12%;">Bomdod</th>
              <th style="width: 12%;">Peshin</th>
              <th style="width: 12%;">Asr</th>
              <th style="width: 12%;">Shom</th>
              <th style="width: 12%;">Xufton</th>
              <th style="width: 13%;">Vitr</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <p><strong>Qazo Tracker</strong></p>
          <p>Qazo namozlaringizni kuzatib boring</p>
          <div class="dua">
            "Allohim, qabul qilgan namozlarimni qabul et, qoldirgan namozlarimni ada qilishga taufiq ber!"
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private groupByYear(
    groupedPrayers: Map<string, PrayerData>,
  ): Map<string, PrayerData[]> {
    const byYear: any = new Map<string, PrayerData[]>();

    groupedPrayers.forEach((data, dateStr) => {
      const year = dayjs(dateStr).format('YYYY');
      if (!byYear.has(year)) {
        byYear.set(year, []);
      }
      byYear.get(year).push(data);
    });

    return byYear;
  }
}