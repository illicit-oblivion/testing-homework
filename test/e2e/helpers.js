const puppeteer = require("puppeteer");

async function initBrowser() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
    const page = await browser.newPage();
    return [browser, page];
}

function bugIdQuery(onlyThisBug) {
    const bugId = +process.env.BUG_ID;
    if (!bugId || onlyThisBug && onlyThisBug !== bugId) {
        return '';
    }

    return '?bug_id=' + bugId;
}

module.exports = {initBrowser, bugIdQuery}
