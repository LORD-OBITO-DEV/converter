import dotenv from 'dotenv';
dotenv.config();
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import fs from 'fs';
import { spawn } from 'child_process';
import { outPath } from './utils/storage.js';
import File from './models/File.js';

const connection = new IORedis(process.env.REDIS_URL);

const worker = new Worker('conversion', async job => {
  const { url, format, userId, public } = job.data;
  const id = job.id.toString();
  const outName = `${id}.${format}`;
  const outFile = outPath(outName);
  const tempPattern = outPath(`${id}.%(ext)s`);

  const ytdlpArgs = format === 'mp4' ? ['-f','best','-o',tempPattern, url] : ['-f','bestaudio','-o',tempPattern, url];

  await new Promise((resolve,reject)=>{
    const p = spawn('yt-dlp', ytdlpArgs);
    p.stderr.on('data', d=>console.error('yt-dlp', d.toString()));
    p.on('close', c=> c===0 ? resolve() : reject(new Error('yt-dlp failed')));
  });

  const files = fs.readdirSync(process.env.UPLOAD_DIR || './uploads').filter(f=>f.startsWith(id));
  if(!files.length) throw new Error('download not found');
  const downloaded = files.find(f=>!f.endsWith(`.${format}`)) || files[0];
  const downloadedPath = outPath(downloaded);

  if(format === 'mp4' && downloadedPath.endsWith('.mp4')){
    fs.renameSync(downloadedPath, outFile);
  } else {
    await new Promise((resolve,reject)=>{
      const ff = spawn('ffmpeg', ['-y','-i',downloadedPath,outFile]);
      ff.stderr.on('data', d=>console.error('ffmpeg', d.toString()));
      ff.on('close', c=> c===0 ? ( (fs.unlinkSync(downloadedPath)), resolve() ) : reject(new Error('ffmpeg failed')));
    });
  }

  // record in DB
  const stat = fs.statSync(outFile);
  const f = new File({ owner: userId, originalUrl: url, filename: outName, mime: format==='mp3'?'audio/mpeg': format==='wav'?'audio/wav':'video/mp4', size: stat.size, public });
  await f.save();
  return { file: `/files/${outName}`, fileId: f._id };
}, { connection });

worker.on('failed', (job, err)=> console.error('Job failed', job.id, err));
worker.on('completed', (job, result)=> console.log('Job completed', job.id, result));
