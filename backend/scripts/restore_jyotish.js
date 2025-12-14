const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Todo = require('../src/models/Todo');
const DeletedUser = require('../src/models/DeletedUser');

dotenv.config({ path: '../.env' }); // Adjust path if running from backend/scripts

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

    console.log(`Found deleted user: ${deletedUser.name} (${deletedUser.email}) deleted at ${deletedUser.deletedAt}`);

    // Check if user already exists (maybe they signed up again?)
    let existingUser = await User.findOne({ email: deletedUser.email });
    if (existingUser) {
        console.log(`User with email ${deletedUser.email} already exists in active users.`);
        // potentially merge? or just skip.
        // For now, let's assume we proceed to restore todos to this existing user or fail.
        console.log('Restoring todos to this existing user id...');
    }

    // 1. Restore User
    let userId;
    if (!existingUser) {
        // Create new user (or with original ID if possible, but cleaner to new)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt); // Default restore password

        const newUser = await User.create({
            _id: deletedUser.originalId, // Try to keep original ID
            name: deletedUser.name,
            email: deletedUser.email,
            password: hashedPassword,
            // Restore defaut settings if I had them in DeletedUser? No, schema didn't have them. 
            // So they get defaults.
        });
        userId = newUser._id;
        console.log(`User restored. ID: ${userId}`);
        console.log('TEMPORARY PASSWORD set to: "password123" (Please change immediately)');
    } else {
        userId = existingUser._id;
    }

    // 2. Restore Todos
    if (deletedUser.savedTodos && deletedUser.savedTodos.length > 0) {
        const todosToInsert = deletedUser.savedTodos.map(t => ({
            user: userId,
            text: t.text, // Note: suffix [Deleted] might be there from my logic? 
            // In deleteUser logic: `text: t.text` for active, `t.text + ' [Deleted]'` for trashed.
            // We restore them as is.
            completed: t.completed,
            createdAt: t.createdAt,
            // Styles are lost unfortunately as they weren't in DeletedUser schema
        }));

        await Todo.insertMany(todosToInsert);
        console.log(`Restored ${todosToInsert.length} todos.`);
    }

    // 3. Remove from DeletedUser (Optional, currently keeping it for safety or manual delete)
    // await DeletedUser.findByIdAndDelete(deletedUser._id);
    // console.log('Removed from archive.');

    process.exit(0);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

restoreUser();
