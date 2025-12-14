const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Todo = require('./src/models/Todo');
const DeletedUser = require('./src/models/DeletedUser');

dotenv.config();

const restoreUser = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Find the most recently deleted user with query 'jyotish'
    const deletedUser = await DeletedUser.findOne({ 
        $or: [
             { name: { $regex: 'jyotish', $options: 'i' } },
             { email: { $regex: 'jyotish', $options: 'i' } }
        ]
    }).sort({ createdAt: -1 });

    if (!deletedUser) {
      console.log('No deleted user found with name/email containing "jyotish"');
      process.exit(1);
    }

    console.log(`Found deleted user: ${deletedUser.name} (${deletedUser.email})`);

    // Check if user already exists
    let existingUser = await User.findOne({ email: deletedUser.email });
    let userId;

    if (existingUser) {
        console.log(`User with email ${deletedUser.email} already exists. Restoring data to it.`);
        userId = existingUser._id;
    } else {
        // Create new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt); 

        const newUser = await User.create({
            _id: deletedUser.originalId, 
            name: deletedUser.name,
            email: deletedUser.email,
            password: hashedPassword,
        });
        userId = newUser._id;
        console.log(`User restored. ID: ${userId}`);
        console.log('TEMPORARY PASSWORD: "password123"');
    }

    // Restore Todos
    if (deletedUser.savedTodos && deletedUser.savedTodos.length > 0) {
        const todosToInsert = deletedUser.savedTodos.map(t => ({
            user: userId,
            text: t.text,
            completed: t.completed,
            createdAt: t.createdAt,
        }));

        await Todo.insertMany(todosToInsert);
        console.log(`Restored ${todosToInsert.length} todos.`);
    } else {
        console.log('No todos found in archive to restore.');
    }

    // KEEPING ARCHIVE FOR SAFETY
    // await DeletedUser.findByIdAndDelete(deletedUser._id);

    process.exit(0);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

restoreUser();
