require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User=require('./models/User')
const Expense=require('./models/Expense')
const multer = require("multer");
const Budget=require('./models/Budget')
const app = express();
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.userId = decoded.userId; // Attach userId to the request
        console.log(req.userId)
        next();
    });
};



app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists. Please login." });
      }
  
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
    
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error. Please try again." });
    }
  });
  
  
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT token
      
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
         expiresIn: "1h",
        });
  
        console.log("Generated Token:", token);

    
     res.json({ message: "Login successful", token, userId: user._id, email: user.email, name: user.name});

    } catch (error) {
      res.status(500).json({ message: "Server error. Please try again." });
      console.log(error)
    }
  });
  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Store images in 'uploads/' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
app.post("/add-expense",verifyToken, upload.single("receiptImage"), async (req, res) => {
    try {
      const {
        expenseName,
        description,
        amount,
        category,
        date,
        paymentMethod,
        sharedWith,
        notes,
        isRecurring,
        budgetStatus,
        expenseTrend,
        currency,
        location,
      } = req.body;
  
      if (!expenseName || !description || !amount || !date) {
        return res.status(400).json({ message: "Please fill in all required fields." });
      }
  
      const newExpense = new Expense({
        userId: req.userId,  // Assign the userId from token
        expenseName,
        description,
        amount,
        category,
        date,
        paymentMethod,
        sharedWith,
        notes,
        isRecurring,
        budgetStatus,
        expenseTrend,
        currency,
        location,
        receiptImage: req.file ? req.file.filename : null, 

      });
  
      await newExpense.save();
      res.status(201).json({ message: "Expense added successfully!", expense: newExpense });
  
    } catch (error) {
      console.error("Error adding expense:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get("/get-expenses", verifyToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId });
        res.json(expenses);
           
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Error fetching expenses" });
    }
});

app.post("/set-budget", verifyToken, async (req, res) => {
  try {
      const { budget } = req.body;
      const userId = req.userId;
     
      if (!budget || budget < 0) {
          return res.status(400).json({ message: "Invalid budget value." });
      }

  
      let userBudget = await Budget.findOne({ userId });

      if (userBudget) {
          userBudget.budget = budget;
      } else {
          userBudget = new Budget({ userId, budget });
      }

      await userBudget.save();
      res.json({ message: "Budget set successfully!", budget: userBudget.budget });

  } catch (error) {
      console.error("Error setting budget:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/get-budget", verifyToken, async (req, res) => {
  try {
      const userId = req.userId;
      
    
      const userBudget = await Budget.findOne({ userId });

      if (!userBudget) {
          return res.status(404).json({ message: "Budget not set yet." });
      }

      res.json({ budget: userBudget.budget });
  } catch (error) {
      console.error("Error fetching budget:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/delete-expense/:id", verifyToken, async (req, res) => {
    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!deletedExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.json({ message: "Expense deleted successfully", deletedExpense });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Error deleting expense" });
    }
});

app.put("/update-expense/:id",verifyToken, upload.single("receiptImage"), async (req, res) => {
  try {
      const { id } = req.params; 

     const userId = req.userId; 

      console.log("Expense ID:", id);
      console.log("User ID:", userId);
      console.log("Request Body:", req.body);

      if (!userId) {
          return res.status(401).json({ message: "Unauthorized: User ID missing" });
      }

    
      const updatedExpenseData = { ...req.body };

      
      if (req.file) {
          updatedExpenseData.receiptImage = `/uploads/${req.file.filename}`;
      }

      
      const updatedExpense = await Expense.findOneAndUpdate(
          { _id: id, userId }, 
          updatedExpenseData,
          { new: true, runValidators: true }
      );

      if (!updatedExpense) {
          return res.status(404).json({ message: "Expense not found or unauthorized" });
      }

      res.json({ message: "Expense updated successfully", expense: updatedExpense });
  } catch (error) {
      console.error("Error updating expense:", error);
      res.status(500).json({ message: "Server error", error });
  }
});

  app.get("/get-expense/:id", verifyToken, async (req, res) => {
   try{
    const { id } = req.params;
    const expense = await Expense.findById(id);
    res.json(expense);
   }catch(error){
    console.error("Error fetching expenses:", error);

   }
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
