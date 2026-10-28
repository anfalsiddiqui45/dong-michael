const form = document.getElementById('login-form');
const messageBox = document.getElementById('login-message');

function setMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = 'message ' + (type === 'error' ? 'error' : 'success');
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    setMessage('Please enter both email and password.', 'error');
    return;
  }

  if (!window.SUPABASE_CONFIG_READY || !window.supabase) {
    setMessage('Supabase is not configured yet. Add your project URL and anon key in supabase.js.', 'error');
    return;
  }

  try {
    setMessage('Signing in...', 'success');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
    }

    const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    if (data && data.user) {
      setMessage('Login successful. Redirecting...', 'success');
      window.location.href = 'admin.html';
    }
  } catch (error) {
    setMessage(error.message || 'Login failed. Please check your credentials.', 'error');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  }
}

async function checkExistingSession() {
  if (window.SUPABASE_CONFIG_READY && window.supabase) {
    try {
      const { data } = await window.supabase.auth.getSession();
      if (data && data.session) {
        window.location.href = 'admin.html';
      }
    } catch (e) {
      console.warn('Session check:', e);
    }
  }
}

form.addEventListener('submit', handleLogin);
document.addEventListener('DOMContentLoaded', checkExistingSession);
