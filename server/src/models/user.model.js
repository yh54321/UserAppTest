import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  accountId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default model('User', userSchema);