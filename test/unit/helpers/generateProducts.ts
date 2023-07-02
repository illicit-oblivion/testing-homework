import {Product, ProductShortInfo} from "../../../src/common/types";
import {commerce} from "faker";

export const generateProducts = () => {
    const products: Product[] = []

    for(let id = 0; id < 27; id++) {
        products.push({
            id,
            name: `${commerce.productAdjective()} ${commerce.product()}`,
            description: commerce.productDescription(),
            price: Number(commerce.price()),
            color: commerce.color(),
            material: commerce.productMaterial(),
        });
    }

    return products;
}

export function getShortInfo({ id, name, price }: Product): ProductShortInfo {
    return { id, name, price };
}
