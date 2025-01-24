import { Command, CommandRunner, Option } from 'nest-commander';
import puppeteer from 'puppeteer';
import delay from 'src/utils/delay';
import * as fs from 'fs';
import { writeFileSync } from 'fs';
import random from 'src/utils/random';

interface ProductCommandOptions {
  url: string;
  name: string;
  folder: string;
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

  urlsArray: string[] = [
    'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202',
    'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-2-5-950g--310778',
    'https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739',
    'https://www.vprok.ru/product/greenfield-greenf-chay-gold-ceyl-bl-pak-100h2g--307403',
    'https://www.vprok.ru/product/chaykofskiy-chaykofskiy-sahar-pesok-krist-900g--308737',
    'https://www.vprok.ru/product/lavazza-kofe-lavazza-1kg-oro-zerno--450647',
    'https://www.vprok.ru/product/parmalat-parmal-moloko-pit-ulster-3-5-1l--306634',
    'https://www.vprok.ru/product/perekrestok-spmi-svinina-duhovaya-1kg--1131362',
    'https://www.vprok.ru/product/vinograd-kish-mish-1-kg--314623',
    'https://www.vprok.ru/product/eko-kultura-tomaty-cherri-konfetto-250g--946756',
    'https://www.vprok.ru/product/bio-perets-ramiro-1kg--476548',
    'https://www.vprok.ru/product/korkunov-kollektsiya-shokoladnyh-konfet-korkunov-iz-molochnogo-shokolada-s-fundukom-karamelizirovannym-gretskim-orehom-vafley-svetloy-orehovoy--1295690',
    'https://www.vprok.ru/product/picnic-picnic-batonchik-big-76g--311996',
    'https://www.vprok.ru/product/ritter-sport-rit-sport-shokol-tsel-les-oreh-mol-100g--305088',
    'https://www.vprok.ru/product/lays-chipsy-kartofelnye-lays-smetana-luk-140g--1197579',
  ];

  async run(passedParams: string[], options: ProductCommandOptions) {
    console.log('Vprok command run. Passed params', passedParams);

    await this.checkFolder()
      .then(async (folder: 'folder') => {
        const urls = this.urlsArray;
        for await (const url of urls) {
          const name = url
            .replace('https://www.vprok.ru/product/', '')
            .split('--')[0];
          await this.parse({ url, name, folder });
        }
        console.log('All urls processed'.green);
        return true;
      })
      .then((bool) => process.exit(bool === true ? 0 : 1));
  }

  async checkFolder() {
    const folderName = 'folder';
    const bool = fs.existsSync(folderName);
    if (bool) {
      console.log('Folder OK'.green);
      return folderName;
    } else {
      fs.mkdirSync(folderName);
      this.checkFolder();
    }
  }

  async parse({ url, name, folder }: ProductCommandOptions) {
    const browser = await puppeteer.launch({
      slowMo: 300,
      headless: false,
      args: [
        '--disable-infobars',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 2000,
    });
    const isMobile: boolean = false;
    await page.setViewport({
      width: 1920,
      height: 1080,
      isMobile,
    });
    if (page) {
      try {
        //secs
        delay(2).then(async () => {
          console.log('Delay passed');
          //Эмулирую активность
          await page.mouse.move(random(), random());
          await page.mouse.down();
          await page.mouse.up();
          await page.mouse.move(random(), random());

          const x_selector =
            '#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > div.MobileAppAlert_wrapper__jkRg0 > svg';
          isMobile
            ? await page
                .click(
                  '#__next > div.Modal_root__kPoVQ.Modal_open__PaUmT > div > div > div.Content_root__7DKIP.Content_modal__gAOHB > button > svg > path',
                  {
                    delay: 1000,
                  },
                )
                .then(async () => {
                  await page.waitForSelector(x_selector);
                  await page.click(x_selector, {
                    delay: 1000,
                  });
                })
            : () => {
                console.log("Mobile false. No selector's for click");
              };
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

          const json = JSON.stringify({
            ...productData,
          });

          writeFileSync(`${folder}/${name}-product.json`, json, 'utf-8');

          delay(2).then(async () => {
            const html = await page.content();
            fs.writeFileSync(`${folder}/${name}-page.html`, html, 'utf-8');
            await page
              .screenshot({
                path: `${folder}/${name}-screenshot.jpg`,
                fullPage: true,
              })
              .then(() => {
                console.log('Данные успешно сохранены!'.green);
                browser.close();
              });
          });
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}
