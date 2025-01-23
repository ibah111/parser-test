import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { Command, CommandRunner } from 'nest-commander';
import puppeteer from 'puppeteer';
import delay from 'src/utils/delay';
import * as fs from 'fs';
import { writeFileSync } from 'fs';

@Command({
  name: 'katalog',
})
export default class KatalogCommand extends CommandRunner {
  private folder: string = 'folder';
  private second_dialog_selector = '#e6ckYWaRNCn2';
  private katalog_link: string =
    'https://www.vprok.ru/catalog/7382/pomidory-i-ovoschnye-nabory';
  // private katalog_link: string =
  //   'https://www.browserless.io/blog/json-responses-with-puppeteer-and-playwright';
  constructor(private readonly httpModule: HttpService) {
    super();
  }
  async run(): Promise<void> {
    console.log('Katalog command'.yellow);
    await this.parseKatalog();
  }

  async parseKatalog() {
    const browser = await puppeteer.launch({
      slowMo: 1000,
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto(this.katalog_link, {
      waitUntil: 'domcontentloaded',
    });
    delay(5)
      .then(async () => {
        const json = await page.evaluate(() => {
          const script = document.querySelector('script#__NEXT_DATA__');
          return script?.textContent ? script.textContent : null;
        });
        const parsed_json = JSON.parse(json as string);
        console.log(
          'json'.yellow,
          parsed_json.props.pageProps.initialStore.catalogPage.products,
        );
        //const products = json.props.pageProps.initialStore.catalogPage.products;
        console.log;
        if (!json) {
          console.log('json is not found');
          await browser.close();
          return;
        }
        writeFileSync(`${this.folder}/output.json`, json, 'utf-8');
        console.log('JSON data saved to output.json'.green);

        await browser.close();
      })
      .then(async () => {
        await browser.close();
        console.log('browser closed'.green);
      });
  }

  async saveToFile(products) {
    const data = products
      .map(
        (product) => `
Название товара: ${product.name}
Ссылка на изображение: ${product.image}
Рейтинг: ${product.rating}
Количество отзывов: ${product.reviewsCount}
Цена: ${product.price}
Акционная цена: ${product.promoPrice || 'Нет'}
Цена до акции: ${product.oldPrice || 'Нет'}
Размер скидки: ${product.discount || 'Нет'}
`,
      )
      .join('\n');

    fs.writeFileSync('products-api.txt', data, 'utf-8');
    console.log('Данные сохранены в файл products-api.txt');
  }

  async parseProducts(categoryUrl: string) {
    try {
      const categoryId = categoryUrl
        .split('/')
        .filter((part) => part.match(/^\d+$/))[0];

      const apiUrl = `https://www.vprok.ru/api/catalog/${categoryId}/products`;

      const response = await axios.get(apiUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      // Обрабатываем данные
      const products = response.data.products;
      const productData = products.map((product) => ({
        name: product.name,
        image: product.image,
        rating: product.rating,
        reviewsCount: product.reviews_count,
        price: product.price,
        promoPrice: product.promo_price || null,
        oldPrice: product.old_price || null,
        discount: product.discount || null,
      }));

      this.saveToFile(productData);
    } catch (error) {
      console.error('Ошибка при получении данных:', error.message);
    }
  }
}
