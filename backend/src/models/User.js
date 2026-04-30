const mongoose = require("mongoose");
const { USER_ROLES } = require("../constants/enums");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: emailRegex
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.MEMBER
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        delete returnedObject.password;
        delete returnedObject.__v;
        return returnedObject;
      }
    }
  }
);

module.exports = mongoose.model("User", userSchema);

