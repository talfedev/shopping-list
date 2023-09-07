import type { Category, Item } from "$lib/types/myTypes";

export const shareFullList = (order: string[], categories: { [key: string]: Category; }, items: { [key: string]: Item; }) => {
    let text = '';
    //structure list into a text string
    order.forEach(categoryId => {
        text += `\n${categories[categoryId].name}\n------------\n`;

        categories[categoryId].items.forEach(itemId => {
            if(!items[itemId].checked) {
                text += `- ${items[itemId].name}\n`;
            }
        })
    });

    navigator.share({text});
}

export const copyListAsText = (order: string[], categories: { [key: string]: Category; }, items: { [key: string]: Item; }) => {
    let text = '';
    //structure list into a text string
    order.forEach(categoryId => {
        text += `\n${categories[categoryId].name}\n------------\n`;

        categories[categoryId].items.forEach(itemId => {
            if(!items[itemId].checked) {
                text += `- ${items[itemId].name}\n`;
            }
        })
    });

    navigator.clipboard.writeText(text);
}