export type ICategory = 'meme' | 'przegryw' | 'wykop' | 'pepe' | 'papaj' | 'flagi' | 'reakcje'

export type IStorage = {
    count: number;
};

export type IEmoji = {
    name: string;
    src: string;
    categories: string[ICategory]
}

export type IFilter = {
    query: string;
}