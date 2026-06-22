// ============================================================
// backend.js — Daily District server backend client
//
// Wraps Supabase Auth + the `today` / `guess` Edge Functions so the answer and
// clue values stay server-side (see BACKEND.md). Exposes a single global
// `DistrictBackend`. Requires the supabase-js UMD bundle loaded first.
//
// Activation is gated by DistrictBackend.ENABLED. Leave it false until at least
// one auth provider is configured in the Supabase dashboard; the game then runs
// in its legacy client-only mode. Flip to true to require login + server clues.
// ============================================================
(function () {
  const SUPABASE_URL = 'https://itbpvqkunfeaimuxposx.supabase.co';
  // Publishable (anon) key — safe to ship in client code.
  const SUPABASE_ANON_KEY = 'sb_publishable_r1e40mdMFg02saEW_xNq2A_iTGELUcU';

  // Master switch. Keep false until OAuth/email providers are configured.
  const ENABLED = false;

  let _client = null;
  function client() {
    if (_client) return _client;
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error('supabase-js not loaded before backend.js');
    }
    _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    return _client;
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  async function getUser() {
    const { data } = await client().auth.getUser();
    return data?.user ?? null;
  }
  function onAuthChange(cb) {
    return client().auth.onAuthStateChange((_event, session) => cb(session?.user ?? null));
  }
  function signInWithOAuth(provider) {
    // provider: 'google' | 'apple' | 'azure' | 'github' | ...
    return client().auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.href.split('#')[0] },
    });
  }
  function signInWithEmail(email, password) {
    return client().auth.signInWithPassword({ email, password });
  }
  function signUpWithEmail(email, password, username) {
    return client().auth.signUp({
      email, password,
      options: { data: username ? { username } : {} },
    });
  }
  function signOut() { return client().auth.signOut(); }

  // ── API (Edge Functions) ───────────────────────────────────────────────────
  // Both require a signed-in session; functions-js attaches the auth header.
  async function today() {
    const { data, error } = await client().functions.invoke('today', { body: {} });
    if (error) throw error;
    return data; // { date, puzzleNumber, clues, cluesTotal, result, answer }
  }
  async function guess(phase, value, seconds) {
    const { data, error } = await client().functions.invoke('guess', {
      body: { phase, value, seconds },
    });
    if (error) throw error;
    return data; // { correct, adjacent, phase, guesses, guessesLeft, completed, won, clues, answer }
  }

  // Leaderboard: { user, today, allTime }. `user` is the signed-in player's own
  // stats (null if signed out); today/allTime are aggregates across all players.
  // Callable by anon, so aggregates show even when signed out.
  async function leaderboard() {
    const { data, error } = await client().rpc('get_leaderboard');
    if (error) throw error;
    return data;
  }

  window.DistrictBackend = {
    ENABLED,
    SUPABASE_URL,
    client,
    getUser, onAuthChange,
    signInWithOAuth, signInWithEmail, signUpWithEmail, signOut,
    today, guess, leaderboard,
  };
})();
