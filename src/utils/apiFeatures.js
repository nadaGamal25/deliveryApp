function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    return (hours * 60) + minutes;
}

export class ApiFeatures{
    constructor(mongooseQuery,searchQuery){
        this.mongooseQuery = mongooseQuery;
        this.searchQuery = searchQuery;
    }
    async pagination(){
        const pageNumber = this.searchQuery.page *1 || 1;
        if(this.searchQuery.page < 0) pageNumber=1
        const limit = this.searchQuery.limit || 10;
        let skip=(pageNumber-1)*limit
        const total = await this.mongooseQuery.clone().countDocuments(); // Use clone() to avoid re-execution issue
        const totalPages= Math.ceil(total / limit)
        const currentPage=pageNumber
        this.currentPage=currentPage
        this.totalPages=totalPages
        this.total=total
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        // console.log(`Pagination - Page: ${currentPage}, Total Pages: ${totalPages}, Total: ${total}`);

        return this;

    }

    filter(){
        let filterObj= structuredClone(this.searchQuery)  //deep clone
        filterObj=JSON.stringify(filterObj)
        filterObj=filterObj.replace(/(gt|gte|lt|lte)/g,value=>`$${value}`)
        filterObj=JSON.parse(filterObj)

        let excludedFields =['page','limit','sort','fields','search']
        excludedFields.forEach(field=>delete filterObj[field])
        
        this.mongooseQuery.find(filterObj)
        // console.log(`Filter - Filter Object: ${JSON.stringify(filterObj)}`);

        return this
    }

    sort(){
        if(this.searchQuery.sort){
            const sortBy = this.searchQuery.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortBy)
            // console.log(`Sort - Sort By: ${sortBy}`);

        }
    return this
    }

    fields(){
        if(this.searchQuery.fields){
            const fields = this.searchQuery.fields.split(',').join(' ')
            this.mongooseQuery.select(fields)
            // console.log(`Fields - Select Fields: ${fields}`);

            }
            return this
    }
  
    search(){
        if(this.searchQuery.search){
            this.mongooseQuery.find(
                {
                    $or: [
                        {position: {$regex: this.searchQuery.search, $options: 'i'}},
                        // {name : {$regex: this.searchQuery.search, $options: 'i'}},
                    ]
                }
            )
            // console.log(`Search - Search Query: ${this.searchQuery.search}`);
        }
        return this
    }
    
    
    
    
}
// export class ApiFeatures {
//     constructor(mongooseQuery, searchQuery) {
//         this.mongooseQuery = mongooseQuery;
//         this.searchQuery = searchQuery;
//     }

//     async pagination() {
//         const pageNumber = this.searchQuery.page * 1 || 1;
//         if (this.searchQuery.page < 0) pageNumber = 1;
//         const limit = this.searchQuery.limit || 10;
//         const skip = (pageNumber - 1) * limit;
//         const total = await this.mongooseQuery.clone().countDocuments(); // Use clone() to avoid re-execution issue
//         const totalPages = Math.ceil(total / limit);
//         const currentPage = pageNumber;
//         this.currentPage = currentPage;
//         this.totalPages = totalPages;
//         this.total = total;
//         this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
//         console.log(`Pagination - Page: ${currentPage}, Total Pages: ${totalPages}, Total: ${total}`);
//         return this;
//     }

//     filter() {
//         let filterObj = { ...this.searchQuery }; // shallow clone
//         filterObj = JSON.stringify(filterObj);
//         filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, value => `$${value}`);
//         filterObj = JSON.parse(filterObj);

//         const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
//         excludedFields.forEach(field => delete filterObj[field]);

//         this.mongooseQuery = this.mongooseQuery.find(filterObj);
//         console.log(`Filter - Filter Object: ${JSON.stringify(filterObj)}`);
//         return this;
//     }

//     sort() {
//         if (this.searchQuery.sort) {
//             const sortBy = this.searchQuery.sort.split(',').join(' ');
//             this.mongooseQuery = this.mongooseQuery.sort(sortBy);
//             console.log(`Sort - Sort By: ${sortBy}`);
//         }
//         return this;
//     }

//     fields() {
//         if (this.searchQuery.fields) {
//             const fields = this.searchQuery.fields.split(',').join(' ');
//             this.mongooseQuery = this.mongooseQuery.select(fields);
//             console.log(`Fields - Select Fields: ${fields}`);
//         }
//         return this;
//     }

//     search() {
//         if (this.searchQuery.search) {
//             this.mongooseQuery = this.mongooseQuery.find({
//                 $or: [
//                     { title: { $regex: this.searchQuery.search, $options: 'i' } },
//                     { name: { $regex: this.searchQuery.search, $options: 'i' } },
//                 ]
//             });
//             console.log(`Search - Search Query: ${this.searchQuery.search}`);
//         }
//         return this;
//     }
// }
