import {ImageAnnotatorClient} from "@google-cloud/vision";
import {initializeApp} from "firebase-admin/app";
import {FieldValue, getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
import {setGlobalOptions} from "firebase-functions/v2";
import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import {randomUUID} from "node:crypto";

initializeApp();
setGlobalOptions({maxInstances: 3});

let visionClient: ImageAnnotatorClient | null = null;
const pendingAvatarPattern = /^profile_images_pending\/([^/]+)\/avatar$/;
const rejectedSafeSearchRatings = new Set(["LIKELY", "VERY_LIKELY"]);
const allowedContentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type UnsafeSafeSearchField = "adult" | "racy" | "violence";

const unsafeSafeSearchFields: UnsafeSafeSearchField[] = [
  "adult",
  "racy",
  "violence",
];

function getVisionClient() {
  if (!visionClient) {
    visionClient = new ImageAnnotatorClient();
  }
  return visionClient;
}

function getDownloadUrl(bucketName: string, filePath: string, token: string) {
  const encodedPath = encodeURIComponent(filePath);
  return "https://firebasestorage.googleapis.com/v0/b/" +
    `${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
}

async function deleteFileIfPossible(
  bucketName: string,
  filePath: string,
  reason: string,
) {
  try {
    await getStorage().bucket(bucketName).file(filePath).delete({
      ignoreNotFound: true,
    });
    logger.info("Deleted pending avatar", {filePath, reason});
  } catch (error) {
    logger.warn("Unable to delete pending avatar", {filePath, reason, error});
  }
}

export const moderatePendingAvatar = onObjectFinalized(
  {
    region: "us-east1",
    maxInstances: 3,
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  async (event) => {
    const object = event.data;
    const filePath = object.name;
    const bucketName = object.bucket;

    if (!filePath || !bucketName) {
      logger.warn("Storage object finalized without name or bucket", {
        eventId: event.id,
      });
      return;
    }

    const pathMatch = filePath.match(pendingAvatarPattern);
    if (!pathMatch) {
      logger.debug("Ignoring non-avatar storage object", {filePath});
      return;
    }

    const uid = pathMatch[1];
    const contentType = object.contentType ?? "";
    const userRef = getFirestore().doc(`users/${uid}`);

    logger.info("Moderating pending avatar", {uid, filePath, contentType});

    if (!allowedContentTypes.has(contentType)) {
      const reason = "Unsupported avatar image type";
      await deleteFileIfPossible(bucketName, filePath, reason);
      await userRef.set(
        {
          avatarStatus: "rejected",
          avatarStoragePath: null,
          avatarRejectedAt: FieldValue.serverTimestamp(),
          avatarModerationReason: reason,
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
      logger.info("Rejected avatar due to unsupported content type", {
        uid,
        contentType,
      });
      return;
    }

    const bucket = getStorage().bucket(bucketName);
    const pendingFile = bucket.file(filePath);
    const [imageBuffer] = await pendingFile.download();
    const [safeSearchResult] = await getVisionClient().safeSearchDetection({
      image: {content: imageBuffer},
    });
    const safeSearch = safeSearchResult.safeSearchAnnotation;

    if (!safeSearch) {
      const reason = "SafeSearch returned no annotation";
      await deleteFileIfPossible(bucketName, filePath, reason);
      await userRef.set(
        {
          avatarStatus: "rejected",
          avatarStoragePath: null,
          avatarRejectedAt: FieldValue.serverTimestamp(),
          avatarModerationReason: reason,
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
      logger.warn("Rejected avatar because SafeSearch annotation was missing", {
        uid,
        filePath,
      });
      return;
    }

    const rejectedFields = unsafeSafeSearchFields.filter((field) =>
      rejectedSafeSearchRatings.has(String(safeSearch[field] ?? "UNKNOWN")),
    );

    if (rejectedFields.length > 0) {
      const reason = `Unsafe avatar image: ${rejectedFields.join(", ")}`;
      await deleteFileIfPossible(bucketName, filePath, reason);
      await userRef.set(
        {
          avatarStatus: "rejected",
          avatarStoragePath: null,
          avatarRejectedAt: FieldValue.serverTimestamp(),
          avatarModerationReason: reason,
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
      logger.info("Rejected avatar after SafeSearch", {
        uid,
        filePath,
        rejectedFields,
      });
      return;
    }

    const approvedPath = `profile_images/${uid}/avatar`;
    const downloadToken = randomUUID();
    const approvedFile = bucket.file(approvedPath);

    await pendingFile.copy(approvedFile);
    await approvedFile.setMetadata({
      contentType,
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
        moderationStatus: "approved",
        moderatedFrom: filePath,
      },
    });

    const avatarApprovedURL = getDownloadUrl(
      bucketName,
      approvedPath,
      downloadToken,
    );

    await userRef.set(
      {
        avatarStatus: "approved",
        avatarStoragePath: approvedPath,
        avatarApprovedURL,
        avatarApprovedAt: FieldValue.serverTimestamp(),
        avatarModerationReason: null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      {merge: true},
    );

    await deleteFileIfPossible(bucketName, filePath, "approved and copied");

    logger.info("Approved avatar after SafeSearch", {
      uid,
      pendingPath: filePath,
      approvedPath,
    });
  },
);
