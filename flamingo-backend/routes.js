import express from "express";
import { firebaseApp, database,  } from "../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { collection, doc,  setDoc,  } from "firebase/firestore";

const userRouter = express.Router();
const auth = getAuth(firebaseApp);

// Middleware to get the current user's UID
const getCurrentUserUID = (req, res, next) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            req.currentUserUID = user.userId;
        }
        next();
    });
};

userRouter.post("/signup", async (req, res) => {
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

      const newUserData = {
          username: username,
          email: email,
          found: []
      };

      setDoc(doc(database, "users", user.userId), newUserData);

      return res
          .status(200)
          .json({
              success: true,
              message: "Signed up successfully!",
              userId: user.userId,
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
                  userId: user.userId,
              });
      })
      .catch((error) => {
          return res
              .status(401)
              .json({ success: false, message: error.message });
      });
});

userRouter.post("/enterPlant", async (req, res) => {
    console.log("entering new plant");
    try {
        const { userId , plantName } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const userRef = collection('users').doc(userId);
        userRef.get()
  .then((doc) => {
    if (doc.exists) {
      // Check if the array field exists in the document
      const dataArray = doc.data().Found; // Replace 'field_name' with your actual array field name
      if (Array.isArray(dataArray)) {
        // Check if the array contains the desired entry
        const entryExists = dataArray.includes(plantName); // Replace 'desired_entry' with the entry you want to check
        if (entryExists) {
          return res
            .status(401)
            .json({
                success: false,
                message: "Already exists",
            });
        }
      } 
    } 
  })
        userRef.update({
            Found : firebase.firestore.FieldValue.arrayUnion(plantName)
          })

        if (!userRef.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }

        return res
            .status(200)
            .json({
                success: true,
            });

    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: "Error updating database." });
    }
});

// Route to get plant information based on common name
userRouter.post('/plant-info', async (req, res) => {
  const { commonName } = req.body;
  try {
    // Call the external API to get plant information
    const response = await axios.get(`https://perenual.com/api/species-list?key=[Your-API-Key]&q=${commonName}`);
    const plantInfo = response.data;

    res.json(plantInfo);
  } catch (error) {
    console.error('Error fetching plant information:', error);
    res.status(500).json({ error: 'Failed to fetch plant information' });
  }
});


export default userRouter;