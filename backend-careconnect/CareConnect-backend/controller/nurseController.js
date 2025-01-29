import Nurse from "../model/nurseModel.js";
import jwt from "jsonwebtoken";



// Add a new nurse
const addNurse = async (req, res) => {
  const { nurseId, name, mobileOrEmail, department, wardNo } = req.body;

  try {
    const newNurse = new Nurse({ nurseId, name, mobileOrEmail, department, wardNo });
    await newNurse.save();
    res.status(201).json({ message: 'Nurse added successfully', nurse: newNurse });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Nurse ID must be unique' });
    } else {
      res.status(500).json({ message: 'Failed to add nurse', error: error.message });
    }
  }
};
//delete a nurse
const deleteNurse = async (req, res) => {
  const { nurseId } = req.params;

  try {
    const deletedNurse = await Nurse.findOneAndDelete({ nurseId });
    if (deletedNurse) {
      res.status(200).json({ message: 'Nurse deleted successfully' });
    } else {
      res.status(404).json({ error: 'Nurse not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Error deleting nurse' });
  }
};

// Get all nurses
const getNurses = async (req, res) => {
  try {
    const nurses = await Nurse.find();
    res.status(200).json(nurses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve nurses', error: error.message });
  }
};

const loginNurse = async (req, res) => {
  const key = 'Nurse_huun_mai';
  const { id, password } = req.body;
  try {
    // Find the nurse by ID and mobile number
    const nurse = await Nurse.findOne({ nurseId: id });
    if (nurse) {
      const isPasswordValid = password === nurse.mobileOrEmail;
      if (isPasswordValid) {
        // Generate token on succesfull login
        const nursetoken = jwt.sign({ uniqueId: nurse.id }, key, { expiresIn: '7d' });

        // Send response with token
        res.status(200).json({ message: 'Login successful', nursetoken, nurse });

      } else {
        res.status(401).json({ message: 'Invalid Credentials, please try again' });
      }
    } else {
      res.status(404).json({ message: 'Nurse not found' });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to log in', error: error.message });
  }
};

export { addNurse, getNurses, deleteNurse, loginNurse };
