const {initBrowser} = require("./helpers");

describe('Корзина', function() {
    it('Содержимое корзины должно сохраняться между перезагрузками страницы', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.goto('http://localhost:3000/hw/store/catalog');
            const linkHandlers = await page.$x("//a[contains(text(), 'Details')]");
            if (linkHandlers.length > 0) {
                await linkHandlers[0].click();
            } else {
                throw new Error("Product link not found");
            }

            const addToCartBtn = await page.$x("//button[contains(text(), 'Add to Cart')]");
            if (addToCartBtn.length > 0) {
                await addToCartBtn[0].click();
            } else {
                throw new Error("Button  not found");
            }

            const cartLinkBeforeReload = await page.$x("//a[starts-with(text(), 'Cart')]");
            const cartLinkBeforeReloadText = await page.evaluate(element => element.textContent, cartLinkBeforeReload[0]);
            await page.reload();
            const cartLinkAfterReload = await page.$x("//a[starts-with(text(), 'Cart')]");
            const cartLinkAfterReloadText = await page.evaluate(element => element.textContent, cartLinkAfterReload[0]);

            expect(cartLinkBeforeReloadText).toBe(cartLinkAfterReloadText);
        } finally {
            await browser.close();
        }
    });
});
