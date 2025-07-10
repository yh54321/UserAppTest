import { Schema, model } from 'mongoose';

const accountSchema = new Schema({
  _id: { type: String, required: true, unique: true },
});

export default model('Account', accountSchema);