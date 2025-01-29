import Admin from "../model/adminModel.js";
import jwt from "jsonwebtoken";


const key = 'Admin_huun_mai';

const verify_Admin = async (req, res) => {
  const { uniqueId, password } = req.body;

  try {
    // Find admin by unique ID
    const admin = await Admin.findOne({ uniqueId });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare passwords
    const isPasswordValid = password === admin.password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ uniqueId: admin.uniqueId }, key, { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful', token });
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to login', error: error.message });
  }
}

export { verify_Admin };