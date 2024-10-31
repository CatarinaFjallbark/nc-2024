import { HttpsError, onCall, onRequest } from "firebase-functions/https";
import { db, logger } from "./firebase";

export const getData = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

exports.setData = onCall((request) => {
  logger.info("request.data.data", request.data.data, { structuredData: true });
  db.collection("profile")
    .doc(request.data.data.phonenumber)
    .set({ ...request.data.data })
    .then((resp) => {
      logger.info("resp", resp, { structuredData: true });
      return {
        result: "success",
      };
    })
    .catch((err) => {
      logger.info("err", err, { structuredData: true });
      throw new HttpsError("invalid-argument", err);
    });
});
