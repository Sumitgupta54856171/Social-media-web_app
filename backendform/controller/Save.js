function post(req,res){
    console.log(req.body);
    const {title,} =req.body;
    const image ={
        name:req.file.originalname,
        filepath:req.file.path,
    }
    
}