const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Define the User schema and model here since we might have issues with import
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if password matches
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
let User;
try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", UserSchema);
}

// MongoDB connection string - use environment variable or default
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/resume-builder";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function seedAdminUser() {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({
      email: "admin@resumebuilder.com",
    });

    if (adminExists) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@resumebuilder.com",
      password: "admin123", // This will be hashed by the User model
      role: "admin",
      status: "active",
    });

    await adminUser.save();
    console.log("Admin user created successfully");

    // Create a regular user
    const regularUser = new User({
      name: "Regular User",
      email: "user@resumebuilder.com",
      password: "user123", // This will be hashed by the User model
      role: "user",
      status: "active",
    });

    await regularUser.save();
    console.log("Regular user created successfully");

    // Print the credentials for easy access
    console.log("\nLOGIN CREDENTIALS:");
    console.log("=================");
    console.log("Admin User:");
    console.log("Email: admin@resumebuilder.com");
    console.log("Password: admin123");
    console.log("\nRegular User:");
    console.log("Email: user@resumebuilder.com");
    console.log("Password: user123");
    console.log("=================\n");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

async function seedDatabase() {
  await connectDB();

  // Seed users
  await seedAdminUser();

  // Add more seed functions here as needed

  console.log("Database seeding completed");
  process.exit(0);
}

// Run the seed function
seedDatabase();
