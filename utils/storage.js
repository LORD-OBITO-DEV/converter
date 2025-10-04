import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
export function outPath(filename){ return path.join(UPLOAD_DIR, filename); }
export function listFiles(){ return fs.readdirSync(UPLOAD_DIR); }
