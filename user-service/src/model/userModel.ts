import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerify: boolean;
  isBlock: boolean;
  img?: string;
  isAdmin: boolean;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: [true, "Name must be required"] },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  isVerify: { type: Boolean, default: false },
  isBlock: { type: Boolean, default: false },
  img: { type: String },
  isAdmin: { type: Boolean, default: false, required: true },
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword=function (password:string){
  return bcrypt.compareSync(password,this.password);
}


export default mongoose.model<IUser>('User', userSchema);
