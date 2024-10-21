import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';
@Injectable()
export class PaginationProvider {
constructor(
    /*
    Injecting request
    */
   @Inject(REQUEST)
   private readonly request:Request,
){}

    public  async paginateQuery<T extends ObjectLiteral>(
        paginationQuery:PaginationQueryDto, 
        repository:Repository<T>
    ):Promise<Paginated<T>>{
        let results = await repository.find({
             // relations:{
             //   metaOptions:true,
             //   author:true,
             //   tags:true
             // },
            skip:(paginationQuery.page -1) * paginationQuery.limit, 
            take:paginationQuery.limit  // take 10 posts form db at one time, like the skip method
           });


        /*
        Create the req URLS
        */
       const baseURL = this.request.protocol + '://' + this.request.headers.host + '/';
       const newURL = new URL(this.request.url, baseURL);
       console.log("🚀 ~ PaginationProvider ~ baseURL:", newURL)
        /*
        Calculate the page number
         */
        // /total number of items in repo
        const totalItems = await repository.count()
        // if number is 5.2 it make s it 6 pages
        const totalPages = Math.ceil(totalItems / paginationQuery.limit);
        const nextPage = paginationQuery.page  === totalPages ? paginationQuery.page : paginationQuery.page+1 //reached the end of the list, next page become current page,  creates the next page
        const previousPage = paginationQuery.page  === 1 ? paginationQuery.page : paginationQuery.page -1 //reached the end of the list, previous page become current page,  creates the previous page
        
        const finalResponse: Paginated<T> = {
            data:results,
            meta:{
                itemsPerPage:paginationQuery.limit,
                totalItems:totalItems,
                currentPage:paginationQuery.page,
                totalPages:totalPages,
            },
            links:{
                first:`${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
                last:`${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
                current:`${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
                next:`${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
                previous:`${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
            },
        }
        
        return finalResponse;
    }
}
