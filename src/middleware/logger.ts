import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {

        console.log(
          `Method: ${req.method} | URL: ${req.url} | Time: ${Date.now()}`,
        );
        fs.appendFileSync('log.txt', `${new Date().toISOString()} - ${req.method} ${req.url}\n`);
        
      next();
    
}

export default logger;