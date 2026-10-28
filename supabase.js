// window.SUPABASE_CONFIG = {
//   url: "https://cymytojqzjdgrgkbyzly.supabase.co",
//   anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bXl0b2pxempkZ3Jna2J5emx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNjQxNTAsImV4cCI6MjEwODc0MDE1MH0.EFAsQW3vqsOZiv8WxLFMIya0vhcJ991Dd97PntNNKhc"
// };

// window.SUPABASE_CONFIG_READY = Boolean(
//   window.SUPABASE_CONFIG &&
//   window.SUPABASE_CONFIG.url &&
//   window.SUPABASE_CONFIG.anonKey &&
//   !window.SUPABASE_CONFIG.url.includes("YOUR_PROJECT_ID") &&
//   !window.SUPABASE_CONFIG.anonKey.includes("YOUR_SUPABASE")
// );

// window.safeSupabaseClient = function () {
//   if (!window.SUPABASE_CONFIG_READY || typeof window.supabase === "undefined") {
//     return null;
//   }

//   return window.supabase.createClient(
//     window.SUPABASE_CONFIG.url,
//     window.SUPABASE_CONFIG.anonKey
//   );
// };

// if (typeof window.supabase !== "undefined" && window.SUPABASE_CONFIG_READY) {
//   window.supabase = window.supabase.createClient(
//     window.SUPABASE_CONFIG.url,
//     window.SUPABASE_CONFIG.anonKey
//   );
// }


window.SUPABASE_CONFIG = {
  url: "https://cymytojqzjdgrgkbyzly.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bXl0b2pxempkZ3Jna2J5emx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNjQxNTAsImV4cCI6MjEwODc0MDE1MH0.EFAsQW3vqsOZiv8WxLFMIya0vhcJ991Dd97PntNNKhc"
};

// Replace the CDN namespace with a ready client; READY is true only if the client really exists.
if (window.supabase && window.supabase.createClient) {
  window.supabase = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey
  );
}
window.SUPABASE_CONFIG_READY = Boolean(window.supabase && window.supabase.from);