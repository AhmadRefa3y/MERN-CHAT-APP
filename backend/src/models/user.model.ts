import moogoose from "mongoose";

const userSchema = new moogoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      required: true,
      type: String,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    contacts: [
      {
        type: moogoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = moogoose.model("User", userSchema);

export default User;
