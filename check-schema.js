const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://czyssapayslhxqtheebk.supabase.co',
  'sb_publishable_uw8gMLdD9FqSKJ6nDqjgZw_VanWP1MG'
);

async function checkSchema() {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error("Error fetching registrations:", error);
    // Maybe try other table names?
  } else {
    console.log("Registrations schema:", data.length ? Object.keys(data[0]) : "No data but success");
    console.log("Data:", data);
  }
}

checkSchema();
