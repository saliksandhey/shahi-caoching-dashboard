const tables = ["registration_form", "RegistrationForm", "StudentData", "student_data", "users", "profiles", "registration", "Registration"];
const url = "https://czyssapayslhxqtheebk.supabase.co/rest/v1";
const headers = {
  "apikey": "sb_publishable_uw8gMLdD9FqSKJ6nDqjgZw_VanWP1MG",
  "Authorization": "Bearer sb_publishable_uw8gMLdD9FqSKJ6nDqjgZw_VanWP1MG"
};

async function test() {
  for (let table of tables) {
    try {
      const res = await fetch(`${url}/${table}?select=*`, { headers });
      if (res.ok) {
        console.log(`FOUND TABLE: ${table}`);
        const data = await res.json();
        console.log("Data length:", data.length);
      } else {
        console.log(`Table ${table} failed with status: ${res.status}`);
      }
    } catch (e) {
      console.log(`Error testing ${table}:`, e.message);
    }
  }
}
test();
