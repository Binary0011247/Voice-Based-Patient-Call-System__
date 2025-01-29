import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  uniqueId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Admin = model('Admin', adminSchema);
export default Admin;