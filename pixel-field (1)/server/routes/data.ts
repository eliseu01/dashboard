// server/routes/data.ts

import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const router = Router();

router.get('/csv-data', (req, res) => {
  const results: any[] = [];

  const filePath = path.join(process.cwd(), 'log_detalhado_sim_171.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Erro ao ler o CSV:', err);
      res.status(500).json({ error: 'Erro ao ler o arquivo CSV' });
    });
});

export default router;
