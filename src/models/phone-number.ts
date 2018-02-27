import * as mongoose from 'mongoose';

const phoneNumberSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  authyId: String
});

const PhoneNumber = mongoose.model('PhoneNumber', phoneNumberSchema);

export {
  PhoneNumber,
  phoneNumberSchema
}