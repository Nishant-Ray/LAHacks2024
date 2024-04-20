import express from "express";
import multer from "multer";
import { firebaseApp, database,  } from "../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { doc,  setDoc,  } from "firebase/firestore";

const userRouter = express.Router();
const auth = getAuth(firebaseApp);

// Fixes file size issue 

const upload = multer({
    storage: multer.memoryStorage(), // Memory storage instead of disk
    limits: {
        // Adjust file size
        fileSize: 50 * 1024 * 1024, // Currently set to 50MB
        // Adjust file name size if necessary (unlikely)
        fieldNameSize: 100,
        fieldSize: 50 * 1024 * 1024, // Currently set to 50MB
    },
});


// Middleware to get the current user's UID
const getCurrentUserUID = (req, res, next) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            req.currentUserUID = user.uid;
        }
        next();
    });
};
const router = express.Router();

router.get("/test", (req, res) => {
    res.status(200).json({ message: "Hello world" });
  }
);

router.get("/upload-image", (req, res) => {
  res.status(200).json({ message: "Hello world" });
}
);

router.post("/signup", async (req, res) => {
  console.log("Signing up");

  const { email, username, password } = req.body;

  if (
      email === undefined ||
      username === undefined ||
      password === undefined
  ) {
      return res
          .status(401)
          .json({
              success: false,
              message:
                  "Missing email, username, and/or password in request body.",
          });
  }

  try {
      const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
      );
      // Signed up
      const user = userCredential.user;

      const dateNow = new Date().toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
      });

      const generatedPrompts = generatePrompts();

      const newUserData = {
          username: username,
          email: email,
          completed_pingos: 0,
          completed_prompts: 0,
          friends: [],
          last_completed_pingo: dateNow,
          latest_completed_prompts: 0,
          latest_prompts: generatedPrompts,
          latest_prompts_pictures: Array(9).fill(""),
      };

      setDoc(doc(database, "users", user.uid), newUserData);

      return res
          .status(200)
          .json({
              success: true,
              message: "Signed up successfully!",
              uid: user.uid,
          });
  } catch (error) {
      console.log(error);
      return res.status(401).json({ success: false, message: error.message });
  }
});
userRouter.post("/login", async (req, res) => {
  console.log("Logging in");

  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
      return res
          .status(401)
          .json({
              success: false,
              message: "Missing email and/or password in request body.",
          });
  }

  signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Logged in
          const user = userCredential.user;
          return res
              .status(200)
              .json({
                  success: true,
                  message: "Logged in successfully!",
                  uid: user.uid,
              });
      })
      .catch((error) => {
          return res
              .status(401)
              .json({ success: false, message: error.message });
      });
});

export default router;