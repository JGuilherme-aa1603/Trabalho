import pkg from 'pg';
const { Client } = pkg;

const db = new Client({
  connectionString: process.env.DATABASE_URL,
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar ao PostgreSQL:", err);
    return;
  }
  console.log("Conectado ao PostgreSQL!");
});

export default db;