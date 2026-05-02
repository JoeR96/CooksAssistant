const fapiHost = 'evolved-fox-45.clerk.accounts.dev';
// Try email_address rather than identifier
const fd = new URLSearchParams();
fd.set('email_address', 'test@cooksassistant.dev');
fd.set('password', 'TestUser_2026!Secure');
fd.set('strategy', 'password');
const res = await fetch(`https://${fapiHost}/v1/client/sign_ins?_clerk_js_version=5`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: fd.toString()
});
console.log('status:', res.status);
console.log('body:', (await res.text()).slice(0, 2000));
