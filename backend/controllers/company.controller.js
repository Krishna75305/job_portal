import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getDatauri } from "../utils/datauri.js";

// Register Company
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    let company = await Company.findOne({companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register the same company again",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Get all companies for a user
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Get a single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Get company by ID error:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Update company details
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    let logo;

    if (file) {
      const fileUri = getDatauri(file);
      if (!fileUri) {
        return res.status(400).json({
          message: "Invalid file uploaded",
          success: false,
        });
      }

      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    const updateData = {
      name,
      description,
      website,
      location,
      ...(logo && { logo }), // only include logo if uploaded
    };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated",
      success: true,
      company,
    });
  } catch (error) {
    console.error("Update company error:", error);
    res.status(500).json({
      message: "Something went wrong while updating the company.",
      success: false,
    });
  }
};
