import { Request, Response } from "express";
import puppeteer from "puppeteer";
class ScrapingController {
  async execute(request: Request, response: Response) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(
      "https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops"
    );

    const scraping = await page.evaluate(() => {
      const laptops = document.querySelectorAll(".col-md-9 .row .thumbnail");

      const thumbnails = [...laptops];
      const formattedProducts = thumbnails.map(({ children }) => {
        return {
          title: children[1].children[1].children[0].textContent,
          description: children[1].children[2].textContent,
          image: "https://webscraper.io" + children[0].getAttribute("src"),
          productUrl:
            "https://webscraper.io" +
            children[1].children[1].children[0].getAttribute("href"),
          price: children[1].children[0].textContent,
          ratings: Number(children[2].children[0].textContent?.split(" ")[0]),
          ratingAverage: Number(
            children[2].children[1].getAttribute("data-rating")
          ),
        };
      });

      return formattedProducts;
    });

    const laptopsLenovo = scraping
      .filter((product) => {
        return product.title?.toLocaleLowerCase().includes("lenovo");
      })
      .sort((a, b) => {
        return Number(a.price?.split("$")[1]) - Number(b.price?.split("$")[1]);
      });

    return response.json({ products: laptopsLenovo });
  }
}

export { ScrapingController };
