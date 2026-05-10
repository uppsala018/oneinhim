# Firebase Storage Rules

No Firebase Storage rules file is currently present in this repository. Use these recommended rules when configuring Firebase Storage for profile image moderation.

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAllowedAvatarImage() {
      return request.resource.size <= 2 * 1024 * 1024
        && request.resource.contentType in [
          'image/jpeg',
          'image/png',
          'image/webp'
        ];
    }

    match /profile_images_pending/{uid}/avatar {
      allow read: if false;
      allow write: if isSignedIn()
        && request.auth.uid == uid
        && isAllowedAvatarImage();
    }

    match /profile_images/{uid}/avatar {
      allow read: if true;
      allow write: if false;
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Moderation TODO

Next step:

- Add a Cloud Function trigger on `profile_images_pending/{uid}/avatar`.
- Run Google Cloud Vision SafeSearch on the uploaded image.
- Reject `adult`, `racy`, or `violence` results that are `LIKELY` or `VERY_LIKELY`.
- For safe images, copy the file to `profile_images/{uid}/avatar`.
- Update `users/{uid}` with `avatarStatus: "approved"` and `avatarApprovedURL`.
- For rejected images, update `users/{uid}.avatarStatus` to `"rejected"`.

The web client must continue to never set `avatarStatus: "approved"` or `avatarApprovedURL`.
