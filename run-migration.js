// Run SQL migration against Supabase PostgreSQL directly
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Guptaji%23%40!op@db.rfxacvctwaqckkvbmlud.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('Connected!');

    const sqlPath = path.join(__dirname, 'supabase', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration...');
    await client.query(sql);
    console.log('Migration completed successfully!');

    // Verify
    const { rows: events } = await client.query('SELECT id, name, venue FROM events');
    console.log('\nSeeded events:', events);

    const { rows: ticketTypes } = await client.query('SELECT name, price, quantity_total FROM ticket_types');
    console.log('Seeded ticket types:', ticketTypes);

  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
