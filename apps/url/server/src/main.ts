import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Initally undefined, but we will use this mutable reference to cache the connection for future use
 * Our database contains a single table: 'url'
 * A url has two fields: id (Int) and original (String)
 */
let _db;

async function getDB() {
  if (_db == null) {
    const conn = await open({
      filename: './urls.db',
      driver: sqlite3.Database,
    });
    _db = conn;
    await _db.run(
      'CREATE TABLE IF NOT EXISTS url (id INTEGER PRIMARY KEY AUTOINCREMENT, original TEXT);'
    );
  }
  return _db;
}

async function shortenUrl(url: string): Promise<string> {
  const db = await getDB();

  const result = await db.run('INSERT INTO url (original) VALUES (?)', url);
  console.log(result);
  const id = result.lastID;
  const short = `http://localhost:3333/s/${id}`;

  return short;
}

async function lookupUrl(shortenedId: number) {
  const db = await getDB();

  const result = await db.get(
    'SELECT original FROM url WHERE id = (?)',
    shortenedId
  );
  console.log(result);
  return result.original;
}

// App

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.post('/api/shorten', async (req, res) => {
//   const original = req.body.original;
//   const short = await shortenUrl(original);

//   res.send({
//     short: short,
//     original: original,
//   });
// });

// app.get('/s/:id', async (req, res) => {
//   const id = Number(req.params.id);
//   const original = await lookupUrl(id);
//   res.redirect(original);
// });

// App

/**
 * Stateful dependencies to inject at root.
 */
type MainDependencies = {
  shortenUrl: (original: string) => Promise<string>;
  lookupUrl: (shortId: number) => Promise<string>;
};

export async function createApp({ shortenUrl, lookupUrl }: MainDependencies) {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.post('/api/shorten', async (req, res) => {
    const original = req.body.original;
    const short = await shortenUrl(original);

    res.status(201).send({
      short: short,
      original: original,
    });
  });

  app.get('/s/:id', async (req, res) => {
    const id = Number(req.params.id);
    const original = await lookupUrl(id);
    res.redirect(original);
  });

  return app;
}

async function main() {
  const dependencies = {
    shortenUrl: shortenUrl,
    lookupUrl: lookupUrl,
  };
  const app = await createApp(dependencies);

  const port = process.env.PORT || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
}

main();