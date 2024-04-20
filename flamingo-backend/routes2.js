import express from "express";
import { firebaseApp, database,  } from "./firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";
import 'dotenv/config';

const userRouter = express.Router();
const auth = getAuth(firebaseApp);
const API_KEY = process.env.API_KEY;

userRouter.post('/getPlantPic', async (req, res) => {
    const { commonName } = req.body;
    try {
      // Call the external API to get plant information
      const response = await axios.get(`https://perenual.com/api/species-list?key=${API_KEY}&q=${commonName}`);
      const plantPic = response.data["default_image"]["original_url"];
      res.json(plantPic);
    } catch (error) {
      console.error('Error fetching plant picture:', error);
      res.status(500).json({ error: 'Failed to fetch plant picture' });
    }
  });

  userRouter.post('/identifyPlant', async (req, res) => {
    const { image } = req.body;
    try {
      // Call the external API to get plant information
      const response = await axios.get(`https://perenual.com/api/species-list?key=[Your-API-Key]&q=${image}`);
      const plant = response.data;
  
      res.json(plant);
    } catch (error) {
      console.error('Error identifying plant:', error);
      res.status(500).json({ error: 'Failed to indentify plant' });
    }
  });