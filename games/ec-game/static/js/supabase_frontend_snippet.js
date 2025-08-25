/* Supabase front-end hook for GitHub Pages
   - Add this after your inputs and before </body>
   - Update SUPABASE_URL and SUPABASE_ANON_KEY
*/
const SUPABASE_URL = 'https://renowzxywrnuomxzsydn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbm93enh5d3JudW9teHpzeWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwODc1NDgsImV4cCI6MjA3MTY2MzU0OH0.8AvSHDFDPD9b-hHOTN1DPLwrtjdWnXjmjXNpumh0YL0';

// Load supabase-js when using this as a standalone file
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function readValues() {
  const ids = ['A','B','C','D','E','F','G'];
  const vals = ids.map(id => {
    const el = document.getElementById('jc-user-submit-input' + id);
    const n = Number(el && el.value ? el.value : 0);
    return Number.isFinite(n) ? Math.trunc(n) : 0; // force integer
  });
  return vals;
}

function validate(values) {
  // All integers and between 0..100
  for (const v of values) {
    if (!Number.isInteger(v) || v < 0 || v > 100) return false;
  }
  const sum = values.reduce((a,b) => a + b, 0);
  return sum === 100;
}

async function submitAllocations() {
  const btn = document.querySelector('.jc-submit');
  const values = readValues();
  if (!validate(values)) {
    alert('Please enter integers 0–100 that sum to exactly 100.');
    return;
  }
  try {
    btn && (btn.disabled = true);
    const payload = { a: values[0], b: values[1], c: values[2], d: values[3], e: values[4], f: values[5], g: values[6] };
    const { error } = await sb.from('responses').insert([payload]);
    if (error) {
      console.error(error);
      alert('Save failed: ' + (error.message || 'Unknown error'));
    } else {
      alert('Saved! Thanks for playing.');
    }
  } finally {
    btn && (btn.disabled = false);
  }
}

// Wire up the existing "Submit" button with class .jc-submit
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.jc-submit');
  if (btn) btn.addEventListener('click', submitAllocations);
});
