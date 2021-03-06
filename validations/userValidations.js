const Joi = require("joi");
const joiPhone = Joi.extend(require("joi-phone-number"));

module.exports = {
  createInvestorValidation: request => {
    const createSchema = {
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(50)
        .required(),
      accountType: Joi.string()
        .min(5)
        .max(8)
        .required(),
      //enum gender
      gender: Joi.string().valid("Male", "Female"),
      nationality: Joi.string()
        .min(4)
        .max(20)
        .required(),
      typeID: Joi.string()
        .max(20)
        .required(),
      numberID: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      address: Joi.string()
        .min(10)
        .max(100)
        .required(),
      phoneNumber: joiPhone.string().phoneNumber(),
      faxNumber: joiPhone.string().phoneNumber(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required(),
      //enum investor type
      investorType: Joi.string().required()
    };

    return Joi.validate(request, createSchema);
  },

  createLawyerValidation: request => {
    const createSchema = {
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(50)
        .required(),

      //enum account type
      accountType: Joi.string()
        .min(5)
        .max(8)
        .required(),
      //enum gender
      gender: Joi.string().valid("Male", "Female"),
      nationality: Joi.string()
        .min(4)
        .max(20)
        .required(),
      typeID: Joi.string()
        .required()
        .max(20),
      numberID: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      address: Joi.string()
        .min(10)
        .max(100)
        .required(),
      phoneNumber: joiPhone
        .string()
        .phoneNumber()
        .required(),
      faxNumber: joiPhone
        .string()
        .phoneNumber()
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required()
    };

    return Joi.validate(request, createSchema);
  },

  createReviewerValidation: request => {
    const createSchema = {
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(50)
        .required(),
      //enum account type
      accountType: Joi.string()
        .min(5)
        .max(8)
        .required(),
      //enum gender
      gender: Joi.string().valid("Male", "Female"),
      nationality: Joi.string()
        .min(4)
        .max(20)
        .required(),
      typeID: Joi.string()
        .required()
        .max(20),
      numberID: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      address: Joi.string()
        .min(10)
        .max(100)
        .required(),
      phoneNumber: joiPhone
        .string()
        .phoneNumber()
        .required(),
      faxNumber: joiPhone
        .string()
        .phoneNumber()
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required()
      //enum investor type
    };

    return Joi.validate(request, createSchema);
  },

  createAdminValidation: request => {
    const createSchema = {
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(50)
        .required(),
      //enum account type
      accountType: Joi.string()
        .min(5)
        .max(8)
        .required(),
      //enum gender
      gender: Joi.string().valid("Male", "Female"),
      nationality: Joi.string()
        .min(4)
        .max(20)
        .required(),
      typeID: Joi.string()
        .required()
        .max(20),
      numberID: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      address: Joi.string()
        .min(10)
        .max(100)
        .required(),
      phoneNumber: joiPhone
        .string()
        .phoneNumber()
        .required(),
      faxNumber: joiPhone
        .string()
        .phoneNumber()
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required()
      //enum investor type
    };

    return Joi.validate(request, createSchema);
  },

  updateAdminValidation: request => {
    const AdminupdateSchema = {
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(50),
      //enum account type
      accountType: Joi.string()
        .min(5)
        .max(8),
      //enum gender
      gender: Joi.string().valid("Male", "Female"),
      nationality: Joi.string()
        .min(4)
        .max(20),
      typeID: Joi.string().max(20),
      numberID: Joi.string(),
      dateOfBirth: Joi.date(),
      address: Joi.string()
        .min(10)
        .max(100),
      phoneNumber: joiPhone.string().phoneNumber(),
      faxNumber: joiPhone.string().phoneNumber(),
      email: Joi.string().email(),
      password: Joi.string().min(8)
    };

    return Joi.validate(request, AdminupdateSchema);
  },

  updateInvestorValidation: request => {
    const InvestorupdateSchema = {
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(50),
      //enum account type
      accountType: Joi.string()
        .min(5)
        .max(8),
      //enum gender
      gender: Joi.string().valid("Male", "Female"),
      nationality: Joi.string()
        .min(4)
        .max(20),
      typeID: Joi.string().max(20),
      numberID: Joi.string(),
      dateOfBirth: Joi.date(),
      address: Joi.string()
        .min(10)
        .max(100),
      phoneNumber: joiPhone.string().phoneNumber(),
      faxNumber: joiPhone.string().phoneNumber(),
      email: Joi.string().email(),
      password: Joi.string().min(8),
      //enum investor type
      investorType: Joi.string()
    };
    return Joi.validate(request, InvestorupdateSchema);
  },

  updateLawyerValidation: request => {
    const LawyerupdateSchema = {
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(50),
      //enum account type
      accountType: Joi.string()
        .min(5)
        .max(8),
      //enum gender
      gender: Joi.string().valid("Male", "Female"),
      nationality: Joi.string()
        .min(4)
        .max(20),
      typeID: Joi.string().max(20),
      numberID: Joi.string(),
      dateOfBirth: Joi.date(),
      address: Joi.string()
        .min(10)
        .max(100),
      phoneNumber: joiPhone.string().phoneNumber(),
      faxNumber: joiPhone.string().phoneNumber(),
      accountStatus: Joi.boolean(),
      email: Joi.string().email(),
      password: Joi.string().min(8)
      //enum investor type
    };
    return Joi.validate(request, LawyerupdateSchema);
  },

  updateReviewerValidation: request => {
    const ReviewerupdateSchema = {
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(50),
      //enum account type
      accountType: Joi.string()
        .min(5)
        .max(8),
      //enum gender
      gender: Joi.string().valid("Male", "Female"),
      nationality: Joi.string()
        .min(4)
        .max(20),
      typeID: Joi.string().max(20),
      numberID: Joi.string(),
      dateOfBirth: Joi.date(),
      address: Joi.string()
        .min(10)
        .max(100),
      phoneNumber: joiPhone.string().phoneNumber(),
      faxNumber: joiPhone.string().phoneNumber(),
      email: Joi.string().email(),
      password: Joi.string().min(8)
    };
    return Joi.validate(request, ReviewerupdateSchema);
  }
};
