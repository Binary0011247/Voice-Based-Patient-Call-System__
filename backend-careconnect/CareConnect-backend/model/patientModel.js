import { Schema, model } from 'mongoose';

const patientSchema = new Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateofBirth: {
    type: String,
    required: true,
  },

  mobile: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  wardBedNo: {
    type: String,
    required: true,
  },
  admitDate: {
    type: Date,
    required: true,
  }
});

const Patient = model('Patient', patientSchema);
export default Patient;
