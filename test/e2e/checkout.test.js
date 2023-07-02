const {initBrowser, bugIdQuery} = require("./helpers");

describe('Заказ', function() {
    it('валидация телефона работает', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.goto('http://localhost:3000/hw/store/catalog/1');
            const addToCartBtn = (await page.$x("//button[contains(text(), 'Add to Cart')]"))[0];
            await addToCartBtn.click();
            await page.goto('http://localhost:3000/hw/store/cart' + bugIdQuery(10));
            await page.type('#f-phone', '79991111212');
            await page.click('.Form-Submit');
            const error = await page.waitForSelector('text/Please provide a valid phone');
            expect(await error.isHidden()).toBe(true);
        } finally {
            await browser.close();
        }
    });

    it('заказ выдает правильный id', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.goto('http://localhost:3000/hw/store/catalog/1');
            const addToCartBtn = (await page.$x("//button[contains(text(), 'Add to Cart')]"))[0];
            await addToCartBtn.click();
            await page.goto('http://localhost:3000/hw/store/cart' + bugIdQuery(2));
            await page.type('#f-name', 'meow');
            await page.type('#f-phone', '79991111212');
            await page.type('#f-address', 'blabla');
            await page.click('.Form-Submit');
            const id = await page.waitForSelector('.Cart-Number');
            expect((await id.evaluate(el => el.textContent)).length).toBeLessThan(10);
        } finally {
            await browser.close();
        }
    });

    it('сообщение о заказе правильного цвета', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.goto('http://localhost:3000/hw/store/catalog/1');
            const addToCartBtn = (await page.$x("//button[contains(text(), 'Add to Cart')]"))[0];
            await addToCartBtn.click();
            await page.goto('http://localhost:3000/hw/store/cart' + bugIdQuery(8));
            await page.type('#f-name', 'meow');
            await page.type('#f-phone', '79991111212');
            await page.type('#f-address', 'blabla');
            await page.click('.Form-Submit');
            await page.waitForSelector('.alert-success', {timeout: 1000});
        } finally {
            await browser.close();
        }
    });
});
