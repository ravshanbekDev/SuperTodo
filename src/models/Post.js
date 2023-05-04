class Products{
    constructor(id , userId , post , date , comments =[] , likes=[]){
        this.id = id,
        this.userId = userId
        this.post= post ,
        this.date = date ,
        this.comments = comments ,
        this.likes = likes
    }
}

module.exports = Products // "Products" klassini eksport qilish