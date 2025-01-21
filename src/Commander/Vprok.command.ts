import { Command, CommandRunner, Option } from 'nest-commander';
import puppeteer from 'puppeteer';
import delay from 'src/utils/delay';
import * as fs from 'fs';

interface ProductCommandOptions {
  url: string;
  region: string;
}

@Command({
  name: 'vprok',
})
export class VprokCommand extends CommandRunner {
  @Option({
    flags: '-u, --url <url>',
    description: 'URL страницы товара',
  })
  parseUrl(value: string): string {
    return value;
  }

  @Option({
    flags: '-r, --region <region>',
    description: 'Регион',
  })
  parseRegion(value: string): string {
    return value;
  }

  async run(passedParams: string[], options: ProductCommandOptions) {
    console.log('Vprok command run. Passed params', passedParams);
    const { url, region } = options;
    if (!url || !region) {
      options = {
        url: 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202',
        region: 'Санкт-Петербург',
      };
    }
    console.log(options);
    this.checkFolder().then(async () => await this.parse({ url, region }));
  }

  async checkFolder() {
    const folderName = 'folder';
    const bool = fs.existsSync(folderName);
    if (bool) {
      return folderName;
    } else {
      fs.mkdirSync(folderName);
      this.checkFolder();
    }
  }

  async parse({ url, region }: ProductCommandOptions) {
    const folder = await this.checkFolder();
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', // Обход ограничений безопасности (в некоторых случаях нужно для запуска в Docker)
        '--disable-setuid-sandbox',
        '--disable-infobars', // Отключить информационные панели
        '--disable-web-security', // Отключить веб-безопасность
        '--disable-features=IsolateOrigins,site-per-process', // Выключить дополнительные фичи изолированного контента
      ],
    });
    const page = await browser.newPage();
    try {
      const userAgent = await page.evaluate(() => navigator.userAgent);
      console.log(userAgent);
      await page
        .goto(
          'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202',
          {
            waitUntil: 'load',
          },
        )
        .then((res) => {
          console.log('goto: ', res);
        });
      //secs
      delay(10).then(async () => {
        console.log('Delay passed');
        //Эмулирую активность
        await page.mouse.move(100, 100);
        await page.mouse.down();
        await page.mouse.up();
        await page.mouse.move(300, 300);
        const html = await page.content();
        fs.writeFileSync(`${folder}/page.html`, html, 'utf-8');
        const productData = await page.evaluate(() => {
          const data: Record<string, string | null> = {};

          data.price =
            document
              .querySelector('.product-price-class')
              ?.textContent?.trim() || null;
          data.oldPrice =
            document.querySelector('.old-price-class')?.textContent?.trim() ||
            null;
          data.rating =
            document
              .querySelector('.product-rating-class')
              ?.textContent?.trim() || null;
          data.reviews =
            document
              .querySelector('.product-reviews-class')
              ?.textContent?.trim() || null;

          return data;
        });
        await page.screenshot({
          path: `${folder}/screenshot.jpg`,
          fullPage: true,
        });

        // Сохранение данных
        const productText = `
      Цена: ${productData.price || 'Не указана'}
      Старая цена: ${productData.oldPrice || 'Не указана'}
      Рейтинг: ${productData.rating || 'Не указан'}
      Количество отзывов: ${productData.reviews || 'Не указано'}
      `;
        fs.writeFileSync(folder + '/product.txt', productText.trim());

        console.log('Данные успешно сохранены!');
      });
    } catch (error) {
      console.log(error);
    }
  }
}
