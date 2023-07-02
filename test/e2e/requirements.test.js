const {initBrowser, bugIdQuery} = require("./helpers");

describe('Требования', function() {
    it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.goto('http://localhost:3000/hw/store');
            const hamburgerOnDesktop = await page.waitForSelector('button[aria-label="Toggle navigation"]',)
            let isHamburgerHiddenOnDesktop = await hamburgerOnDesktop.isHidden();
            expect(isHamburgerHiddenOnDesktop).toBe(true)
            const navMenuOnDesktop = await page.waitForSelector('.Application-Menu')
            let isNavMenuHiddenOnDesktop = await navMenuOnDesktop.isHidden();
            expect(isNavMenuHiddenOnDesktop).toBe(false)

            await page.setViewport({width: 570, height: 1200})
            await page.goto('http://localhost:3000/hw/store');
            const hamburger = await page.waitForSelector('button[aria-label="Toggle navigation"]')
            let isHamburgerHidden = await hamburger.isHidden();
            expect(isHamburgerHidden).toBe(false)
            const navMenu = await page.waitForSelector('.Application-Menu')
            let isNavMenuHidden = await navMenu.isHidden();
            expect(isNavMenuHidden).toBe(true)
        } finally {
            await browser.close();
        }
    });

    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.setViewport({width: 570, height: 1200})
            await page.goto('http://localhost:3000/hw/store' + bugIdQuery());
            const hamburger = await page.waitForSelector('button[aria-label="Toggle navigation"]');
            await hamburger.click();
            const menuBeforeHamburgerElClick = await page.waitForSelector('.Application-Menu');
            let isMenuHiddenBeforeClick = await menuBeforeHamburgerElClick.isHidden();
            expect(isMenuHiddenBeforeClick).toBe(false);

            const linkHandlers = await page.$x("//a[contains(text(), 'Catalog')]");
            if (linkHandlers.length > 0) {
                await linkHandlers[0].click();
            } else {
                throw new Error("Product link not found");
            }
            const menuAfterHamburgerElClick = await page.waitForSelector('.Application-Menu');
            let isMenuHidden = await menuAfterHamburgerElClick.isHidden();
            expect(isMenuHidden).toBe(true)
        } finally {
            await browser.close();
        }
    });

    it('вёрстка должна адаптироваться под ширину экрана', async () => {
        const [browser, page] = await initBrowser();
        try {
            await page.setViewport({width: 570, height: 1200});
            for (const path of ['/', '/catalog', '/cart', '/contacts', '/delivery']) {
                await page.goto(`http://localhost:3000/hw/store${path}`);

                const isAdaptive = await hasHorizontalScrollbar();
                expect(isAdaptive).toBe(true)
            }
            await page.goto('http://localhost:3000/hw/store/catalog');
            const linkHandlers = await page.$x("//a[contains(text(), 'Details')]");
            if (linkHandlers.length > 0) {
                await linkHandlers[0].click();
            } else {
                throw new Error("Product link not found");
            }
            const isAdaptive = await hasHorizontalScrollbar();
            expect(isAdaptive).toBe(true)
        } finally {
            await browser.close();
        }
    });
});

const hasHorizontalScrollbar = async () => await page.evaluate(() => {
    return document.body.scrollWidth === document.body.clientWidth;
});
