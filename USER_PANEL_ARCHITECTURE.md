\# USER PANEL ARCHITECTURE

One In Him Bible Study — User Panel MVP



\## 1. Goal



Build a simple user panel for registered users of oneinhimbiblestudy.com.



The user panel should begin as a lightweight profile/setup area, not a full social network yet. It must be built so it can later grow into a Christian community/social layer with profiles, posts, friends, likes, and forum integration.



Initial routes:



\- `/user-panel`

\- `/user-panel/profile`



Do not build wall/feed, friends, likes, public profile pages, direct messages, or video uploads in the MVP.



\---



\## 2. User Roles



The system should support these user roles:



\- `admin`

\- `beta\_tester`

\- `user`

\- `restricted`

\- `banned`



\### Admin



Admin email:



\- `mosegaard622@gmail.com`



Admin has full access to all site features and moderation functionality.



Admin panel must always include a clear link back to:



\- `/`



\### Beta Tester



Beta testers should have access to:



\- the full Bible study site

\- the prayer/forum community

\- beta tester panel

\- future user panel preview/test mode



Later, beta testers should be able to click a button to become regular users after beta testing ends.



\### User



Regular users should have access to:



\- Bible study site

\- forum

\- user panel

\- profile setup/editing



\---



\## 3. User Panel MVP Scope



The MVP should include:



\- show signed-in user

\- display name

\- Christian tradition

\- short bio/about

\- website link

\- social links

\- profile image/avatar upload

\- link to Home

\- link to Prayer Forum

\- link to Profile settings



Christian tradition choices:



\- Catholic

\- Orthodox

\- Protestant

\- Non-denominational



Do not include other religions in this field.



\---



\## 4. Routes



\### `/user-panel`



Main dashboard for the user.



Should show:



\- welcome message

\- profile completion status

\- profile summary

\- links:

&#x20; - Home

&#x20; - Prayer Forum

&#x20; - Edit Profile

\- later: latest forum activity



\### `/user-panel/profile`



Profile setup/edit page.



Fields:



\- display name

\- Christian tradition

\- short bio/about

\- website URL

\- social links

\- profile image/avatar



\---



\## 5. Firestore Data Model



Use Firebase Auth as identity source.



Main collection:



```txt

users/{uid}



{

&#x20; "uid": "firebase-auth-uid",

&#x20; "email": "user@example.com",

&#x20; "displayName": "User Name",

&#x20; "photoURL": "https://...",

&#x20; "avatarStatus": "none | pending | approved | rejected",

&#x20; "avatarStoragePath": "profile\_images/{uid}/avatar/original",

&#x20; "avatarApprovedURL": "https://...",

&#x20; "christianTradition": "Catholic | Orthodox | Protestant | Non-denominational",

&#x20; "bio": "Short user bio",

&#x20; "websiteUrl": "https://example.com",

&#x20; "socialLinks": {

&#x20;   "youtube": "",

&#x20;   "facebook": "",

&#x20;   "instagram": "",

&#x20;   "x": "",

&#x20;   "tiktok": ""

&#x20; },

&#x20; "role": "user",

&#x20; "isBanned": false,

&#x20; "isRestricted": false,

&#x20; "createdAt": "serverTimestamp",

&#x20; "updatedAt": "serverTimestamp",

&#x20; "lastLoginAt": "serverTimestamp"

}

