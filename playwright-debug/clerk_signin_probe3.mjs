const fapiHost = 'evolved-fox-45.clerk.accounts.dev';
// Step 1: POST identifier only
let fd = new URLSearchParams();
fd.set('identifier', 'test@cooksassistant.dev');
let res = await fetch(`https://${fapiHost}/v1/client/sign_ins?_clerk_js_version=5`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: fd.toString()
});
console.log('step1 status:', res.status);
console.log('step1 body:', (await res.text()).slice(0, 2500));
