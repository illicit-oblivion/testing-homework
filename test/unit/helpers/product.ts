import {Product} from "../../../src/common/types";

export const getProduct = (id: number): Product  =>( {
    id,
        name: `Название ${id}`,
    price: 5000 + id * 1000 ,
    description: `Описание ${id}`,
    material: `Материал ${id}`,
    color: `Цвет ${id}`,
})
