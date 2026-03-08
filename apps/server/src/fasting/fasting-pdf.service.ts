import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import 'dayjs/locale/uz-latn';

dayjs.locale('uz-latn');

@Injectable()
export class FastingPdfService {
  private readonly logger = new Logger(FastingPdfService.name);

  async generateFastingPdf(
    fastingList: any[],
    userInfo?: { name: string; email: string },
  ): Promise<Buffer> {
    this.logger.log('Starting fasting PDF generation');
    let browser;

    try {
      const htmlContent = this.generateHtmlContent(fastingList, userInfo);

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
        timeout: 60000,
      });

      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);

      await page.setContent(htmlContent, { waitUntil: 'load', timeout: 60000 });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
        timeout: 60000,
      });

      this.logger.log('Fasting PDF generated successfully');
      return Buffer.from(pdfBuffer);
    } catch (error) {
      this.logger.error('Fasting PDF generation failed:', error.message);
      throw new Error(`PDF yaratishda xatolik: ${error.message}`);
    } finally {
      if (browser) await browser.close();
    }
  }

  private generateHtmlContent(
    fastingList: any[],
    userInfo?: { name: string; email: string },
  ): string {
    const totalCount = fastingList.length;
    const completedCount = fastingList.filter((f) => f.isCompleted).length;
    const uncompletedCount = totalCount - completedCount;
    const percentage =
      totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : '0.0';

    // Yillar bo'yicha guruhlash
    const byYear = new Map<number, any[]>();
    fastingList.forEach((f) => {
      const year = f.gregorian_year;
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year)!.push(f);
    });

    let tableRows = '';
    let rowIndex = 1;

    byYear.forEach((fastings, year) => {
      tableRows += `
        <tr class="year-header">
          <td colspan="5">${year}-yil Ramazon</td>
        </tr>
      `;
      fastings.forEach((f) => {
        tableRows += `
          <tr class="${rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}">
            <td class="text-center">${rowIndex++}</td>
            <td class="text-center">${f.day_of_ramadan?.toString().padStart(2, '0')}</td>
            <td>${f.hijri_date || '-'}</td>
            <td>${dayjs(f.date).format('DD MMMM, YYYY')}</td>
            <td class="checkbox-cell">
              <div class="checkbox ${f.isCompleted ? 'checked' : ''}">
                ${f.isCompleted ? '<span class="checkmark">✓</span>' : ''}
              </div>
            </td>
          </tr>
        `;
      });
    });

    return `
      <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <title>Qazo Ro'zalar Jadvali</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; padding: 20px; background: #fff; color: #1f2937; }
          .header { text-align: center; margin-bottom: 24px; }
          .header h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
          .header p { font-size: 12px; color: #6b7280; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat-card { background: #f9fafb; padding: 14px; border-radius: 6px; text-align: center; border: 1px solid #e5e7eb; }
          .stat-card .label { font-size: 10px; color: #6b7280; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
          .stat-card .value { font-size: 24px; font-weight: 700; color: #111827; }
          table { width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; }
          th { padding: 12px 10px; text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; background: #f3f4f6; }
          td { padding: 10px; text-align: left; font-size: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; }
          .text-center { text-align: center; }
          .even-row { background: #fff; }
          .odd-row { background: #f9fafb; }
          .year-header td { text-align: center !important; font-weight: 700; font-size: 13px; background: #f3f4f6 !important; color: #111827 !important; border-bottom: 2px solid #d1d5db; padding: 10px; }
          .checkbox-cell { text-align: center !important; }
          .checkbox { width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; background: #fff; }
          .checkbox.checked { background: #000; border-color: #000; }
          .checkmark { color: #fff; font-size: 13px; font-weight: bold; }
          .footer { margin-top: 32px; text-align: center; padding: 16px; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb; }
          .footer p { color: #6b7280; font-size: 11px; margin: 3px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Qazo Ro'zalar Jadvali</h1>
          ${userInfo ? `<p>${userInfo.name} &bull; ${userInfo.email}</p>` : ''}
        </div>

        <div class="stats">
          <div class="stat-card"><div class="label">Jami</div><div class="value">${totalCount}</div></div>
          <div class="stat-card"><div class="label">Tutilgan</div><div class="value">${completedCount}</div></div>
          <div class="stat-card"><div class="label">Tutilmagan</div><div class="value">${uncompletedCount}</div></div>
          <div class="stat-card"><div class="label">Foiz</div><div class="value">${percentage}%</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:6%">№</th>
              <th style="width:10%">Kun</th>
              <th style="width:20%">Hijriy sana</th>
              <th style="width:32%">Milodiy sana</th>
              <th style="width:12%">Tutildi</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>

        <div class="footer">
          <p>Qazo Tracker &bull; ${dayjs().format('DD.MM.YYYY')}</p>
        </div>
      </body>
      </html>
    `;
  }
}
