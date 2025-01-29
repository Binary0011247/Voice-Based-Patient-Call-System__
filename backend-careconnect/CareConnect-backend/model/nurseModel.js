import { Schema, model } from 'mongoose';

const nurseSchema = new Schema({
  nurseId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobileOrEmail: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  wardNo: {
    type: String,
    required: true,
  },
});

const Nurse = model('Nurse', nurseSchema);
export default Nurse;
