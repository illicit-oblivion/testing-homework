import {getApp} from "./helpers/getApp";
import {getAllByRole, render} from "@testing-library/react";

describe('Общие требования', () => {
    const baseName = '/hw/store'

    test('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async () => {
        const {app} = getApp();

        const {getByRole} = render(app);
        const navigation = getByRole('navigation');

        const navLinks = getAllByRole(navigation, 'link').map(it => it.getAttribute("href"));

        expect(navLinks).toContain(`${baseName}/catalog`);
        expect(navLinks).toContain(`${baseName}/cart`);
    });

    test('название магазина в шапке должно быть ссылкой на главную страницу', async () => {
        const {app} = getApp();

        const {getByText} = render(app);
        const navigation = getByText('Example store');


        expect(navigation.tagName.toLowerCase()).toBe('a');
        expect(navigation.getAttribute('href')).toBe(`${baseName}/`);
    });
});
