class searchOptions{
    constructor(query){
        this.limit = query.limit ? parseInt(query.limit) : null;
        this.skip = query.skip ? parseInt(query.skip) : null;
        this.sort = {};
        if(query.sortBy){
            const parts= query.sortBy.split(':');
            sort[parts[0]] = parts[1] ===  'desc' ? -1 : 1;
        }
    };
}



module.exports = searchOptions;