// Try Clerk Frontend API directly using publishable key
const PK = 'pk_test_ZXZvbHZlZC1mb3gtNDUuY2xlcmsuYWNjb3VudHMuZGV2JA';
// decode FAPI host from pk
const decoded = Buffer.from(PK.split('_')[2], 'base64').toString();
console.log('decoded pk payload:', decoded);
const fapiHost = decoded.replace(/\$$/, '');
console.log('FAPI host:', fapiHost);

// Try POST /v1/client/sign_ins with identifier+password
const url = `https://${fapiHost}/v1/client/sign_ins?_clerk_js_version=5`;
const fd = new URLSearchParams();
fd.set('strategy', 'password');
fd.set('identifier', 'test@cooksassistant.dev');
fd.set('password', 'TestUser_2026!Secure');

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: fd.toString()
});
console.log('status:', res.status);
const text = await res.text();
console.log('body:', text.slice(0, 1500));
