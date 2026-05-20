import type { NextFunction, Request, Response } from "express";

const auth = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        // const token = req.headers.authorization;
        console.log('thsi is protected route', req.header);
        // if (!token) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Unauthorized",
        //     });
        // }
        next();
    };
};

export default auth;