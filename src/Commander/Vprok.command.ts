import { Command, CommandRunner, Option } from 'nest-commander';
import puppeteer from 'puppeteer';
import delay from 'src/utils/delay';
import * as fs from 'fs';
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

    const url =
      'https://www.vprok.ru/product/picnic-picnic-batonchik-big-76g--311996';
    // const url =
    //   'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202';
    const region = 'Санкт-Петербург';
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
      slowMo: 1000,
      headless: false,
      args: [
        '--disable-infobars', // Отключить информационные панели
        '--disable-web-security', // Отключить веб-безопасность
        '--disable-features=IsolateOrigins,site-per-process', // Выключить дополнительные фичи изолированного контента
      ],
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 5000,
    });

    if (page) {
      try {
        //secs
        delay(5).then(async () => {
          console.log('Delay passed');
          //Эмулирую активность
          await page.mouse.move(random(), random());
          await page.mouse.down();
          await page.mouse.up();
          await page.mouse.move(random(), random());

          const productData = await page.evaluate(() => {
            const data: Record<string, string | null> = {};

            data.price =
              document.querySelector(
                '#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_informationBlock__vDYCH > div.ProductPage_desktopBuy__cyRrC > div > div > div > div.PriceInfo_root__GX9Xp > span',
              )?.textContent || null;
            data.oldPrice =
              document.querySelector(
                '#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_informationBlock__vDYCH > div.ProductPage_desktopBuy__cyRrC > div > div > div > div.PriceInfo_root__GX9Xp > div > span.Price_price__QzA8L.Price_size_XS__ESEhJ.Price_role_old__r1uT1',
              )?.textContent || null;
            data.rating =
              document.querySelector(
                '#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_aboutAndReviews__47Wwu > div.DetailsAndReviews_root__ghQFz > section.Summary_section__n5aJB > div:nth-child(6) > div > div.Summary_title__lRoWU',
              )?.textContent || null;
            data.reviews =
              document.querySelector(
                '#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_aboutAndReviews__47Wwu > div.DetailsAndReviews_root__ghQFz > section.Summary_section__n5aJB > div.Summary_reviewsContainer__qTWIu.Summary_reviewsCountContainer___aY6I > div > div',
              )?.textContent || null;

            return data;
          });

          const productText = `
          Цена: ${productData.price || 'Не указана'}\n
          Старая цена: ${productData.oldPrice || 'Не указана'}\n
          Рейтинг: ${productData.rating || 'Не указан'}\n
          Количество отзывов: ${productData.reviews || 'Не указано'}\n
          `;

          fs.writeFileSync(folder + '/product.txt', productText.trim());

          await page.click(
            '#__next > div.Modal_root__kPoVQ.Modal_open__PaUmT > div > div > div.Content_root__7DKIP.Content_modal__gAOHB > button > svg > path',
            {
              delay: 1000,
            },
          );

          delay(3).then(async () => {
            const html = await page.content();
            fs.writeFileSync(`${folder}/page.html`, html, 'utf-8');
            await page
              .screenshot({
                path: `${folder}/screenshot.jpg`,
                fullPage: true,
              })
              .then(() => {
                console.log('Данные успешно сохранены!'.green);
                // process.exit(0);
              });
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
