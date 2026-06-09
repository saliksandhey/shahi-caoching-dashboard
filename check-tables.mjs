import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://czyssapayslhxqtheebk.supabase.co',
  'sb_publishable_uw8gMLdD9FqSKJ6nDqjgZw_VanWP1MG'
);

async function checkTables() {
  const tables = ['students', 'leads', 'Registration', 'Registrations'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`Table ${table} succeeded with data length: ${data.length}`);
      if (data.length) console.log(data[0]);
    } else {
      console.log(`Table ${table} failed: ${error.message}`);
    }
  }
}

checkTables();
