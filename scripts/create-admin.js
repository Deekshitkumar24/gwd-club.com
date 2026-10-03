const { createClient } = require('@supabase/supabase-js');

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.gwd_vjit_clube_SUPABASE_URL ||
  'https://btcwwtrosrtbajocxrjy.supabase.co';

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.gwd_vjit_clube_SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = process.argv[2] || 'admin@gwd-club.com';
  const password = process.argv[3] || 'GwdAdmin2026!';

  console.log(`Checking/creating admin user: ${email}...`);

  // Check if user already exists
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to list users:', listError);
    return;
  }

  let user = users.users.find(u => u.email === email);
  if (!user) {
    console.log('Creating new user in auth.users...');
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'GWD Administrator' },
    });
    if (createError) {
      console.error('Failed to create user:', createError);
      return;
    }
    user = created.user;
    console.log('User created with ID:', user.id);
  } else {
    console.log('User already exists with ID:', user.id);
  }

  // Assign superadmin role in public.profiles
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    role: 'superadmin',
    full_name: 'GWD Administrator',
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error('Failed to update profile:', profileError);
    return;
  }

  console.log(`Superadmin profile assigned successfully for ${email}`);
}

main();
