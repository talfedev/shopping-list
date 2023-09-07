import type { Category, Item } from "$lib/types/myTypes";

// LIST SHARING
export const shareFullList = (order: string[], categories: { [key: string]: Category; }, items: { [key: string]: Item; }) => {
    let text = '';
    //structure list into a text string
    order.forEach(categoryId => {
        text += `\n${categories[categoryId].name}\n------------\n`;

        categories[categoryId].items.forEach(itemId => {
            if(!items[itemId].checked) {
                text += `- ${items[itemId].name}: ${items[itemId].quantity}\n`;
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
                text += `- ${items[itemId].name}: ${items[itemId].quantity}\n`;
            }
        })
    });

    navigator.clipboard.writeText(text);
}


// CATEGORY SHARING
export const shareCategory = (category: Category, items: { [key: string]: Item; }) => {
    let text = `${category.name}\n------------\n`;
    
    category.items.forEach(itemId => {
        if(!items[itemId].checked) {
            text += `- ${items[itemId].name}: ${items[itemId].quantity}\n`;
        }
    });

    navigator.share({text});
}

export const copyCategoryAsText = (category: Category, items: { [key: string]: Item; }) => {
    let text = `${category.name}\n------------\n`;
    
    category.items.forEach(itemId => {
        if(!items[itemId].checked) {
            text += `- ${items[itemId].name}: ${items[itemId].quantity}\n`;
        }
    });

    navigator.clipboard.writeText(text);
}