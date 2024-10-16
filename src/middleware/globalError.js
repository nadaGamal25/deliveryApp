export const globalError=(err,req,res,next)=>{
    let code =err.statusCode ||500
    const message = err.errorDetails || err.message || 'Something went wrong';
    res.status(code).json({message,status:code,data:[],token:null})
}