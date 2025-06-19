export function permit(...allowedRoles){
    return (req,res,next)=>{
    const { role } = req.user;
    if (allowedRoles.includes(role)) return next();
    return res.status(403).json({error:'Forbidden'});
    };
}
