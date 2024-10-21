export interface Paginated<T>{
// array of entities based on the where the paginated is used
    data: T[];
    meta: {
        itemsPerPage:number;
        totalItems:number;
        currentPage:number;
        totalPages:number;
    },
    links:{
        first:string;
        last:string;
        current:string;
        next:string;
        previous:string;
    }
}