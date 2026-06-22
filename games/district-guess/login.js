// ============================================================
// login.js — drives the login modal when the server backend is enabled.
// No-op in legacy client-only mode (DistrictBackend.ENABLED === false), so the
// existing game is untouched until an auth provider is configured.
// ============================================================
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(async function () {
    const B = window.DistrictBackend;
    if (!B) return;
    // Active when the backend is switched on, OR via ?login=1 — a test hatch so
    // login/auth can be exercised on the live site without enabling it for everyone.
    const active = B.ENABLED || new URLSearchParams(location.search).get('login') === '1';
    if (!active) return; // legacy mode — do nothing

    const modal = document.getElementById('login-modal');
    const err = document.getElementById('login-error');
    const show = () => modal.classList.remove('hidden');
    const hide = () => modal.classList.add('hidden');
    const fail = (e) => { err.textContent = (e && e.message) || 'Something went wrong'; };

    modal.querySelectorAll('.login-provider-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        err.textContent = '';
        try { await B.signInWithOAuth(btn.dataset.provider); } catch (e) { fail(e); }
      });
    });

    const form = document.getElementById('login-email-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.textContent = '';
      const email = document.getElementById('login-email').value.trim();
      const pw = document.getElementById('login-password').value;
      try {
        const { error } = await B.signInWithEmail(email, pw);
        if (error) throw error;
      } catch (ex) { fail(ex); }
    });

    document.getElementById('login-signup').addEventListener('click', async () => {
      err.textContent = '';
      const email = document.getElementById('login-email').value.trim();
      const pw = document.getElementById('login-password').value;
      if (!email || pw.length < 6) { err.textContent = 'Enter an email and a 6+ character password.'; return; }
      try {
        const { error } = await B.signUpWithEmail(email, pw);
        if (error) throw error;
        err.textContent = 'Check your email to confirm, then sign in.';
      } catch (ex) { fail(ex); }
    });

    // ---- Profile collection: shown once after sign-in if not yet filled ----
    const pModal = document.getElementById('profile-modal');
    const pErr = document.getElementById('profile-error');
    const hideProfile = () => pModal.classList.add('hidden');

    async function maybeShowProfile() {
      if (localStorage.getItem('dd_profile_done') === '1') return;
      let prof;
      try { prof = await B.getProfile(); } catch (_) { return; }
      if (!prof) return;
      if (prof.city || prof.phone) { localStorage.setItem('dd_profile_done', '1'); return; }
      if (prof.display_name) document.getElementById('profile-display-name').value = prof.display_name;
      pModal.classList.remove('hidden');
    }

    document.getElementById('profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      pErr.textContent = '';
      const val = (id) => document.getElementById(id).value.trim() || null;
      try {
        await B.updateProfile({
          display_name: val('profile-display-name'),
          phone: val('profile-phone'),
          city: val('profile-city'),
          region: val('profile-region'),
          country: val('profile-country'),
          marketing_opt_in: document.getElementById('profile-marketing').checked,
        });
        localStorage.setItem('dd_profile_done', '1');
        hideProfile();
      } catch (ex) { pErr.textContent = (ex && ex.message) || 'Could not save'; }
    });
    document.getElementById('profile-skip').addEventListener('click', () => {
      localStorage.setItem('dd_profile_done', '1');
      hideProfile();
    });

    // Show the gate until signed in; broadcast sign-in so the game can start.
    B.onAuthChange((user) => {
      if (user) { hide(); maybeShowProfile(); window.dispatchEvent(new CustomEvent('district-auth', { detail: { user } })); }
      else show();
    });

    const user = await B.getUser();
    if (user) { hide(); maybeShowProfile(); } else show();
  });
})();
