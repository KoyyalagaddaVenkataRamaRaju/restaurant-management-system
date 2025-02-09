require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');

const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");
const Table = require("./models/Table");
const Cart = require("./models/Cart");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Authentication Routes
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Table Management Routes
app.get("/api/tables", async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tables" });
  }
});

app.post("/api/addTables", async (req, res) => {
  try {
    const { numberOfTables } = req.body;
    await Table.deleteMany({}); // Reset tables before adding new ones

    const tables = [];
    for (let i = 1; i <= numberOfTables; i++) {
      tables.push({ tableNumber: i, status: "free" });
    }
    await Table.insertMany(tables);

    res.status(201).json({ message: "Tables added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding tables" });
  }
});

app.put("/api/tables/:tableNumber", async (req, res) => {
  try {
    const { status } = req.body;
    const table = await Table.findOneAndUpdate(
      { tableNumber: req.params.tableNumber },
      { status },
      { new: true }
    );
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Error updating table" });
  }
});

app.delete("/api/tables/:tableNumber", async (req, res) => {
  try {
    const table = await Table.findOneAndDelete({ tableNumber: req.params.tableNumber });
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting table" });
  }
});
// ✅ Fetch menu items
app.get("/api/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menu items" });
  }
});

// ✅ Fetch cart items for a specific table
app.get("/api/cart/:tableNumber", async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const cartItems = await Cart.find({ tableNumber });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
});

// ✅ Add item to cart
app.post("/api/cart", async (req, res) => {
  try {
    const { tableNumber, itemId, name, price } = req.body;
    const newCartItem = new Cart({ tableNumber, itemId, name, price });
    await newCartItem.save();
    res.status(201).json({ message: "Item added to cart!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding to cart" });
  }
});

// ✅ Remove item from cart
app.delete("/api/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Error removing item" });
  }
});

// ✅ Clear cart after order placement
app.delete("/api/cart/clear/:tableNumber", async (req, res) => {
  try {
    await Cart.deleteMany({ tableNumber: req.params.tableNumber });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: "Error clearing cart" });
  }
});


// ✅ Place an Order (POST)
app.post("/api/placeOrder", async (req, res) => {
  try {
    const { tableNumber, items, totalPrice } = req.body;
    if (!tableNumber || !items.length || totalPrice === undefined) {
      return res.status(400).json({ message: "Missing order details!" });
    }

    // ✅ Create a new order
    const newOrder = new Order({
      tableNumber,
      items,
      totalPrice,
      status: "pending", // Default status
    });
    await newOrder.save();

    // ✅ Update table status to "waiting for food"
    await Table.findOneAndUpdate(
      { tableNumber },
      { status: "waiting for food" }
    );

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// ✅ Fetch Orders by Table Number (GET)
app.get("/api/orders/:tableNumber", async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const orders = await Order.find({ tableNumber });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
// ✅ Fetch All Orders (GET)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// In your server.js or controller
const updateTableStatus = async (req, res) => {
  const { tableNumber, status } = req.body;

  try {
    const table = await Table.findOne({ tableNumber });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    table.status = status;
    await table.save();

    res.json({ message: `Table status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Order Status to 'Prepared' and Table Status to 'Eating' by Cook
app.put("/api/orders/:orderId/prepare", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if the user is a cook
    const user = req.user;  // Assuming user info is added via middleware
    if (user.role !== "cook") {
      return res.status(403).json({ message: "Only cooks can prepare orders" });
    }

    // Update the order status to 'prepared'
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "prepared" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the table status to 'eating'
    const table = await Table.findOneAndUpdate(
      { tableNumber: order.tableNumber },
      { status: "eating" },
      { new: true }
    );
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
// After 1 minute, set the table status back to 'free'
setTimeout(async () => {
  await Table.findOneAndUpdate(
    { tableNumber: table.tableNumber },
    { status: "free" }
  );
  console.log(`Table ${table.tableNumber} status updated to free`);
}, 60000); // 1 minute = 60000 milliseconds

res.json({ message: "Order marked as prepared and table status updated to eating", order, table });
} catch (error) {
console.error("Error updating order and table status:", error);
res.status(500).json({ message: "Failed to update order and table status" });
}
});
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Error preparing order:", error);
    res.status(500).json({ message: "Failed to prepare order", error: error.message });
  }
});
app.put('/api/tables/:id', async (req, res) => {
  try {
    const tableId = req.params.id;
    const { status } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if the status is being changed to 'eating'
    if (status === 'eating') {
      // Update the table status to 'eating'
      table.status = 'eating';
      table.eatingStartTime = Date.now(); // Store the time when the status was changed to 'eating'
    } else if (status === 'free') {
      // If it's not 'eating', just set it to 'free'
      table.status = 'free';
      table.eatingStartTime = null; // Clear the start time
    }

    await table.save();
    res.status(200).json(table);

    // If the table's status is set to 'eating', schedule it to change back to 'free' after 10 seconds
    if (status === 'eating') {
      setTimeout(async () => {
        // Check if it's still 'eating' after 10 seconds, then change to 'free'
        const updatedTable = await Table.findById(tableId);
        if (updatedTable && updatedTable.status === 'eating') {
          updatedTable.status = 'free';
          updatedTable.eatingStartTime = null; // Reset the eating start time
          await updatedTable.save();
          console.log(`Table ${tableId} status changed to 'free' after 10 seconds.`);
        }
      }, 10000); // 10 seconds = 10000 milliseconds
    }

  } catch (error) {
    console.error('Error updating table status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')));

  // For any other route, send the React app (handle routing within React)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
