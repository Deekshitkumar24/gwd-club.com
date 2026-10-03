process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString =
  process.env.gwd_vjit_clube_POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL or POSTGRES_URL in environment');
  process.exit(1);
}

async function seedData() {
  console.log('Connecting to PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected successfully!');

    // 1. Run seed.sql to create the 9 slots
    const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    console.log('Running seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('seed.sql executed successfully.');

    // 2. Update with real GWD leaders from 002_extended_schema.sql
    console.log('Updating team members with real GWD data...');
    await client.query(`
      UPDATE public.team_members SET
        name = 'Aldrin Paul',
        bio = 'Leading GWD with a clear conviction: the highest-velocity learning happens when you stop theorizing and start shipping real work.',
        quote = 'Ideas are worthless until they are built and shipped.',
        photo_url = '/team/president.jpg'
      WHERE sort_order = 1;

      UPDATE public.team_members SET
        name = 'Mohd Ismail',
        bio = 'Drives operational discipline, sprint roadmaps, and cross-functional alignment across all collective divisions.',
        quote = 'Execution is the only currency that matters.'
      WHERE sort_order = 2;

      UPDATE public.team_members SET
        name = 'Shravya',
        bio = 'Coordinates club administration, member onboarding, internal governance, and transparent documentation.',
        quote = 'Clarity and operational rigor turn momentum into lasting impact.',
        photo_url = '/team/general-secretary.jpg'
      WHERE sort_order = 3;

      UPDATE public.team_members SET
        name = 'Deekshit Katikaneni',
        bio = 'Architecting digital platforms, open-source systems, and production software. Mentoring technical builders to industry standards.',
        quote = 'Ship cleanly, architect for scale, and iterate fearlessly.',
        photo_url = '/team/technical-lead.png'
      WHERE sort_order = 4;

      UPDATE public.team_members SET
        name = 'Nishta Gaur',
        bio = 'Directs visual systems, design tokens, brand identities, and editorial storytelling across all touchpoints.',
        quote = 'Design gives form, intention, and clarity to technology.'
      WHERE sort_order = 5;

      UPDATE public.team_members SET
        name = 'Anvita Reddy',
        bio = 'Amplifies GWD launches, builder campaigns, distribution networks, and digital storytelling across channels.',
        quote = 'Great products deserve distribution that matches their craft.'
      WHERE sort_order = 6;

      UPDATE public.team_members SET
        name = 'Bhavya Koduri',
        bio = 'Directs hackathons, summits, and campus showcases with seamless stage execution and attendee experience.',
        quote = 'Every interaction and stage moment shapes the collective memory.',
        photo_url = '/team/event-management-lead.jpg'
      WHERE sort_order = 7;

      UPDATE public.team_members SET
        name = 'Tuba Azeem',
        bio = 'Directs external relations, institutional liaison, corporate outreach, and media communications.',
        quote = 'Meaningful partnerships compound when built on mutual trust.'
      WHERE sort_order = 8;

      UPDATE public.team_members SET
        name = 'Burhan Uddin',
        bio = 'Captures the builder journey through cinematic photography, documentaries, live event recaps, and visual media.',
        quote = 'Document the struggle and the craft with unvarnished honesty.'
      WHERE sort_order = 9;
    `);

    // 3. Verify Team Members
    const teamRes = await client.query(`
      SELECT sort_order, name, role_title, photo_url, active
      FROM public.team_members
      ORDER BY sort_order;
    `);
    console.log('All 9 Team Members in Database:');
    console.table(teamRes.rows);

    // 4. Verify Milestones
    const milestoneRes = await client.query('SELECT count(*) FROM public.timeline_milestones;');
    console.log('Milestones count in Database:', milestoneRes.rows[0].count);

    // 5. Verify Site Settings
    const settingsRes = await client.query('SELECT key FROM public.site_settings;');
    console.log('Site settings in Database:', settingsRes.rows.map(r => r.key));

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedData();
