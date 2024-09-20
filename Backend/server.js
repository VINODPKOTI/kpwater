const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// Create an express app
const app = express();

// Use CORS middleware
app.use(cors());

// Use body-parser middleware
app.use(bodyParser.json());

// In-memory store for OTPs
let otpStorage = {};

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Water_Supply",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected...");

  // Check if the users table exists
  const checkUsersTableQuery = `
    SELECT COUNT(*)
    FROM information_schema.tables 
    WHERE table_schema = 'Water_Supply' 
    AND table_name = 'users';
  `;

  db.query(checkUsersTableQuery, (err, results) => {
    if (err) throw err;

    // If the users table doesn't exist, create it
    if (results[0]["COUNT(*)"] === 0) {
      const createUsersTableQuery = `
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL ,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    address VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

      `;

      db.query(createUsersTableQuery, (err) => {
        if (err) throw err;
        console.log("Users table created.");
      });
    } else {
      console.log("Users table already exists.");
    }

    // Check if the admin user already exists
    const checkAdminQuery = `SELECT * FROM users WHERE email = 'nanjundawaterservices@2024.gmail.com'`;

    db.query(checkAdminQuery, (err, results) => {
      if (err) throw err;

      // If the admin user does not exist, insert the admin row
      if (results.length === 0) {
        const userid = uuidv4();
        const adminPassword = "nanjuwater@1999";
        const saltRounds = 10;

        bcrypt.hash(adminPassword, saltRounds, (err, hashedPassword) => {
          if (err) throw err;

          const insertAdminQuery = `
            INSERT INTO users (userid, name, email, phone_number, address, password)
            VALUES (?,'Nanjunda', 'nanjundawaterservices@2024.gmail.com', '9845684823', 'Seegehalli', ?);
          `;

          db.query(insertAdminQuery, [userid, hashedPassword], (err) => {
            if (err) throw err;
            console.log("Admin user inserted with hashed password.");
          });
        });
      }
    });
  });

  // Check if the orders table exists
  const checkOrdersTableQuery = `
    SELECT COUNT(*)
    FROM information_schema.tables 
    WHERE table_schema = 'Water_Supply' 
    AND table_name = 'orders';
  `;

  db.query(checkOrdersTableQuery, (err, results) => {
    if (err) throw err;

    // If the orders table doesn't exist, create it
    if (results[0]["COUNT(*)"] === 0) {
      const createOrdersTableQuery = `
        CREATE TABLE orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(255),
          item_ordered VARCHAR(255),
          num_bottles VARCHAR(255),
          transaction_status VARCHAR(255),
          FOREIGN KEY (user_id) REFERENCES users(userid),
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        );
      `;

      db.query(createOrdersTableQuery, (err) => {
        if (err) throw err;
        console.log("Orders table created.");
      });
    } else {
      console.log("Orders table already exists.");
    }
  });
});

// // Route to handle signup requests
app.post("/register-user", (req, res) => {
  const { userid, name, phone_number, email, password, address } = req.body;
  console.log(req.body);
  // phone=phoneNumber;
  // console.log(req.body.phone_number);
  // Validate input
  if (
    !req.body.name ||
    !req.body.phone_number ||
    !req.body.email ||
    !req.body.password ||
    !req.body.address
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before inserting
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err)
        return res.status(500).json({ message: "Error hashing password" });

      const insertUserQuery = `
        INSERT INTO users (userid,name, email, phone_number, address, password)
        VALUES (?,?, ?, ?, ?, ?)
      `;

      db.query(
        insertUserQuery,
        [userid, name, email, phone_number, address, hashedPassword],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Error inserting user" });

          res.status(201).json({ message: "User created successfully" });
        }
      );
    });
  });
});

// Route to create an order
app.post("/create-order", (req, res) => {
  const { userId, itemOrdered, numBottles, transactionStatus } = req.body;

  if (!userId || !itemOrdered || !numBottles || !transactionStatus) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const insertOrderQuery = `
    INSERT INTO orders (user_id, item_ordered, num_bottles, transaction_status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertOrderQuery,
    [userId, itemOrdered, numBottles, transactionStatus],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Error inserting order" });

      res.status(201).json({ message: "Order created successfully" });
    }
  );
});

// Signin route
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err)
        return res.status(500).json({ message: "Error comparing passwords" });
      if (!isMatch)
        return res.status(401).json({ message: "Incorrect password" });

      // If valid credentials
      
      res.status(200).json({
        message: "Login successful",
        userId: user.userid,
        userName: user.name,
      });
    });
  });
});

// Route to create an order
// Route to create an order
app.post("/create-order", (req, res) => {
  const { userId, itemOrdered, numBottles, transactionStatus } = req.body;

  if (!userId || !itemOrdered || !numBottles || !transactionStatus) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const insertOrderQuery = `
    INSERT INTO orders (user_id, item_ordered, num_bottles, transaction_status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertOrderQuery,
    [userId, itemOrdered, numBottles, transactionStatus],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Error inserting order" });
      res.status(200).json({ message: "Order placed successfully" });
    }
  );
});

// Fetch orders for a specific user
app.get("/orders/:userID", (req, res) => {
  const userID = req.params.userID;
  console.log("Received request for userId:", userID);
  console.log(typeof userID);
  // Define the query based on the user ID
  let getOrdersQuery;
  let queryParams = [userID]; // Default to the user ID passed in the URL

  if (userID === "d95f52c1-84b3-4acb-92f2-5977a4e2cc06") {
    // Retrieve all orders with status 'pending' for user ID 1
    console.log("Inside the usreid cheking quesry only after verified");
    getOrdersQuery = `
      SELECT o.id, o.item_ordered, o.transaction_status, u.name, u.address FROM orders o JOIN users u ON o.user_id = u.userid WHERE o.transaction_status = 'pending';
    `;
    queryParams = [userID]; // Assuming you're fetching for userID '1'
  } else {
    // Retrieve orders for a specific user ID
    getOrdersQuery = `
      SELECT id, user_id,item_ordered, transaction_status
      FROM orders
      WHERE user_id = ? and transaction_status='pending';
    `;
  }

  db.query(getOrdersQuery, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving orders" });
    }
    return res.json(results);
  });
});

//Ordre handled by admin
app.put("/orders/complete/:orderID", (req, res) => {
  const orderID = req.params.orderID;

  // Your logic to update the transaction_status in the database
  const sql = "UPDATE orders SET transaction_status = ? WHERE id = ?";
  db.query(sql, ["Completed", orderID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update order status" });
    }
    return res.status(200).json({ message: "Order marked as completed" });
  });
});

//View page

app.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;

  const query =
    "SELECT id, name, email, phone_number, address FROM users WHERE userid = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user details:", err);
      res.status(500).json({ error: "Internal server error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(results[0]); // Return the first matching user
    }
  });
});

///put for edit of profile view
app.put("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const { name, email, phone_number, password, address } = req.body;

  const updateQuery =
    "UPDATE users SET name = ?, email = ?, phone_number = ?, address = ? WHERE userid = ?";

  let queryParams = [name, email, phone_number, address, userId];

  // If password is provided, hash it and include it in the query
  if (password) {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }

      const updateWithPasswordQuery =
        "UPDATE users SET name = ?, email = ?, phone_number = ?, address = ?, password = ? WHERE userid = ?";
      queryParams.push(hashedPassword); // Add the hashed password
      queryParams = [
        name,
        email,
        phone_number,
        address,
        hashedPassword,
        userId,
      ]; // Update with password

      db.query(updateWithPasswordQuery, queryParams, (err, result) => {
        if (err) {
          console.error("Error updating user profile with password:", err);
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.json({ message: "Profile updated successfully" });
        }
      });
    });
  } else {
    db.query(updateQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Error updating user profile:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json({ message: "Profile updated successfully" });
      }
    });
  }
});

///email verification page
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kpwatersupply1999@gmail.com",
    pass: "mvvpjxmljblckwjk", // Make sure to use app-specific password or 2FA
  },
});

// Function to generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999);
  // Generate a random 6-digit OTP
};

// Create a simple route to confirm the server is running
app.get("/", (req, res) => {
  res.send(
    "Server is running and connected to the database with CORS enabled!"
  );
});

////TGis is otp
app.post("/send-otp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "All data is required" });
  }

  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in-memory
    otpStorage[email] = otp;

    // Send OTP email
    const mailOptions = {
      from: "kpwatersupply1999@gmail.com",
      to: email,
      subject: "Your OTP Code - KP WATER SUPPLIERS",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2E86C1;">Welcome to KP Water Suppliers!</h2>
        <p>Dear Valued Customer,</p>
        <p>Thank you for choosing our services. To ensure the security of your account, we have generated a One-Time Password (OTP) for verification purposes.</p>
        
        <div style="padding: 15px; background-color: #f1f1f1; border-radius: 5px; text-align: center;">
          <h3 style="color: #E74C3C;">Your OTP Code: <strong>${otp}</strong></h3>
        </div>
        
        <p>Please enter this OTP in the application to proceed with the verification process. This code is valid for 10 minutes.</p>
        
        <p>If you did not request this OTP, please disregard this message. If you have any concerns, feel free to contact our support team at <a href="mailto:kpwatersupply1999@gmail.com">kpwatersupply1999@gmail.com</a>.</p>
        
        <br>
        <p>Best regards,</p>
        <p><strong>KP Water Suppliers Team</strong></p>
        
        <hr>
        <footer style="font-size: 0.9em; color: #777;">
          <p>If you have any questions, reply to this email or call us at +91 9845684823.</p>
          <p>KP Water Suppliers, Seegehalli, Bengaluru 560067</p>
        </footer>
      </div>
    ,`, // your HTML content here
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending OTP. Please try again." });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "OTP sent successfully" });
    });
  });
});

//verification

app.post("/verify-otp", (req, res) => {
  // const { email, enteredOtp } = req.body;
  const { email, enteredOtp } = req.body;
  // Check if both email and enteredOtp are provided
  if (!email || !enteredOtp) {
    console.error("Email or OTP is missing");
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  // Retrieve OTP from storage
  const storedOtp = otpStorage[email];

  // Check if OTP exists for the provided email
  if (!storedOtp) {
    console.error(`No OTP found for email: ${email}`);
    return res.status(400).json({ message: "OTP has expired or is invalid" });
  }

  // Compare OTPs (assuming OTP is numeric)
  if (enteredOtp === String(storedOtp)) {
    console.log(`OTP verified successfully for email: ${email}`);
    delete otpStorage[email]; // Clean up OTP after successful verification
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    console.error(`Invalid OTP entered for email: ${email}`);
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// Start the server on port 8081
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
