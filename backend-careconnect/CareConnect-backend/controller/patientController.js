import Patient from "../model/patientModel.js";
import jwt from "jsonwebtoken";
// add patients

const addPatient = async (req, res) => {
  const { patientId, name, dateofBirth, mobile, diagnosis, wardBedNo, admitDate } = req.body;

  try {
    const newPatient = new Patient({ patientId, name, dateofBirth, mobile, diagnosis, wardBedNo, admitDate });
    await newPatient.save();
    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Patient ID must be unique' });
    } else {
      res.status(500).json({ message: 'Failed to add patient', error: error.message });
    }
  }
};

// get patients
const getPatient = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve patients', error: error.message });
  }
};

// delete a patient
const deletePatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const deletedPatient = await Patient.findOneAndDelete({ patientId });
    if (deletedPatient) {
      res.status(200).json({ message: 'Patient deleted successfully' });
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  }
  catch (err) {
    res.status(400).json({ error: 'Error deleting patient' });
  }
}

// Login patient
const loginPatient = async (req, res) => {
  const key = 'Patient_huun_mai';
  const { id, password } = req.body;

  try {
    // Find the patient by ID and Date of Birth
    const patient = await Patient.findOne({ patientId: id });
    if (patient) {
      const isPasswordValid = password === patient.dateofBirth;
      if (isPasswordValid) {
        //generate token on successful login
        const patienttoken = jwt.sign({ uniqueId: patient.id }, key, { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', patienttoken, patient });
      } else {
        res.status(401).json({ message: 'Invalid Patient ID or Date of Birth' });
      }
    }
    else {
      res.status(404).json({ message: 'Patient not found' });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to log in', error: error.message });
  }
}


export { addPatient, getPatient, deletePatient, loginPatient };
