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
    if (!B || !B.ENABLED) return; // legacy mode — do nothing

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

    // Show the gate until signed in; broadcast sign-in so the game can start.
    B.onAuthChange((user) => {
      if (user) { hide(); window.dispatchEvent(new CustomEvent('district-auth', { detail: { user } })); }
      else show();
    });

    const user = await B.getUser();
    if (user) hide(); else show();
  });
})();
