const {initBrowser, bugIdQuery} = require("./helpers");

describe('Каталог', function() {
    it('названия товаров приходят с api', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.goto('http://localhost:3000/hw/store/catalog' + bugIdQuery());
            const itemTitle = (await page.waitForSelector('.card-title'));

            const text = await itemTitle?.evaluate(el => el.textContent);
            expect(text).not.toBe('');
        } finally {
            await browser.close();
        }
    });

    it('не загружается товар с api', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.goto('http://localhost:3000/hw/store/catalog/1' + bugIdQuery());
            const addToCartBtn = (await page.$x("//button[contains(text(), 'Add to Cart')]"))[0];
            expect(addToCartBtn).toBeDefined();
        } finally {
            await browser.close();
        }
    });
});
