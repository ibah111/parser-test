import { Command, CommandRunner, Option } from 'nest-commander';
import puppeteer from 'puppeteer';
import delay from 'src/utils/delay';
import * as fs from 'fs';
import {
  loginButton,
  oldPrice,
  price,
  rating,
  reviews,
} from './ConstSelectors/Vprok.const';
import random from 'src/utils/random';

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
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });
    try {
      const page = await browser.newPage();
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
      delay(5).then(async () => {
        console.log('Delay passed');
        //Эмулирую активность
        await page.mouse.move(random(), random());
        await page.mouse.down();
        await page.mouse.up();
        await page.mouse.move(random(), random());
        await page.click(loginButton);
        const html = await page.content();
        fs.writeFileSync(`${folder}/page.html`, html, 'utf-8');
        const productData = await page.evaluate(() => {
          const data: Record<string, string | null> = {};

          data.price =
            document.querySelector(price)?.textContent?.trim() || null;
          data.oldPrice =
            document.querySelector(oldPrice)?.textContent?.trim() || null;
          data.rating =
            document.querySelector(rating)?.textContent?.trim() || null;
          data.reviews =
            document.querySelector(reviews)?.textContent?.trim() || null;

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
