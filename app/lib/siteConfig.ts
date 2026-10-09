// Flip this to `true` the day the app is publicly on the App Store. It restores the
// "Download on the App Store" buttons and the "Available now" copy — all of which are
// still in the code, just hidden. While it's `false`, the site invites people to email
// for access instead (the app is private TestFlight-only for now).
export const APP_PUBLISHED = false;

// BEFORE flipping APP_PUBLISHED: confirm this link resolves. The site used to point at
// id6746897469, which Apple's lookup returns nothing for; the app's App Store Connect
// ID is 6781126475, so that's what's used here.
export const APP_STORE_URL = "https://apps.apple.com/app/id6781126475";

export const ACCESS_EMAIL = "trucollectivemusic@gmail.com";
// Prefilled so people see the one thing we need from them: Apple or Android.
const ACCESS_SUBJECT = "Tru Collective app access";
const ACCESS_BODY = "Hi! I'd like access to the Tru Collective app.\n\nMy phone is (Apple or Android): ";
export const ACCESS_MAILTO = `mailto:${ACCESS_EMAIL}?subject=${encodeURIComponent(ACCESS_SUBJECT)}&body=${encodeURIComponent(ACCESS_BODY)}`;
