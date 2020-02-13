const yup = require('yup')

module.exports = {
  kycStep1: yup.object().shape({
    userUid: yup.string().required(),
    fullName: yup.string().required(),
    phoneNumber: yup.string().required(),
    dateOfBirth: yup.date().required(),
    address: yup.string().required(),
    city: yup.string().required(),
    postalCode: yup.number().required(),
    country: yup.string().required(),
    occupation: yup.string().required(),
    fundSource: yup.string().required(),
    usageGoal: yup.string().required(),
    status: yup.string().default('1stStep'),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
  }),
  kycStep2: yup.object().shape({
    userUid: yup.string().required(),
    docType: yup.string().required(),
    docId: yup.string().required(),
    docImgUrl: yup.string().url().required(),
    docImgVerificationUrl: yup.string().url().required(),
    status: yup.string().default('2ndStep'),
    updatedAt: yup.date().default(() => new Date())
  }),
  kycStep3: yup.object().shape({
    userUid: yup.string().required(),
    status: yup.string().default('done'),
    updatedAt: yup.date().default(() => new Date())
  }),
}