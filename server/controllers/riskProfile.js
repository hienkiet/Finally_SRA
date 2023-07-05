import express from "express";
import mongoose from "mongoose";

import RiskProfile from "../models/riskProfileMessage.js";
const router = express.Router();

export const getProfiles = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await RiskProfile.countDocuments({});
    const profiles = await RiskProfile.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: profiles,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProfilesBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const profiles = await RiskProfile.find({
      $or: [{ title }],
    });

    res.json({ data: profiles });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await RiskProfile.findById(id);

    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createProfile = async (req, res) => {
  const profile = req.body;

  const newProfileMessage = new RiskProfile({
    ...profile,
  });

  try {
    await newProfileMessage.save();

    res.status(201).json(newProfileMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { title, selectedFile } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No profile with id: ${id}`);

  const updatedProfile = { title, selectedFile, _id: id };

  await RiskProfile.findByIdAndUpdate(id, updatedProfile, { new: true });

  res.json(updatedProfile);
};

export const deleteProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No profile with id: ${id}`);

  await RiskProfile.findByIdAndRemove(id);

  res.json({ message: "Profile deleted successfully." });
};

export default router;
