import { HttpsError, onCall } from "firebase-functions/https";
import { db, logger } from "./firebase";
type ProfileData = { data: { name: string; email: string } };
exports.getData = onCall(async (request): Promise<ProfileData> => {
  logger.info("GET", request.data, { structuredData: true });
  const profileRef = db.collection("profile").doc(request.data);
  const doc = await profileRef.get();
  if (!doc.exists) {
    logger.info("No such document", request.data, { structuredData: true });
    throw new HttpsError("not-found", "Cannot find document");
  } else {
    logger.info("Document.data", doc.data(), { structuredData: true });
    return { ...(doc.data() as ProfileData) };
  }
});

exports.setData = onCall((request) => {
  logger.info("request.data", request.data, { structuredData: true });
  db.collection("profile")
    .doc(request.data.phonenumber)
    .set({ ...request.data.data })
    .then((resp) => {
      logger.info("resp", resp, { structuredData: true });
      return {
        result: "success",
        data: request.data,
      };
    })
    .catch((err) => {
      logger.info("err", err, { structuredData: true });
      throw new HttpsError("invalid-argument", err);
    });
});
