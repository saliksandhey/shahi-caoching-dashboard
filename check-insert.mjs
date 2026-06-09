import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://czyssapayslhxqtheebk.supabase.co',
  'sb_publishable_uw8gMLdD9FqSKJ6nDqjgZw_VanWP1MG'
);

async function checkInsert() {
  const { data, error } = await supabase
    .from('registrations')
    .insert([{ full_name: 'Test User' }])
    .select();
    
  if (error) {
    console.error("Insert failed:", error);
  } else {
    console.log("Insert succeeded:", data);
  }
}

checkInsert();
