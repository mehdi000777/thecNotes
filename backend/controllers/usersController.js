import User from "../models/User.js";
import Note from "../models/Note.js";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) return res.status(400).json({ message: 'No users found' });

    res.status(200).json(users);
})

export const createUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    if (!username || !password) return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (user) return res.status(409).json({ message: 'Duplicate username' });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = (!Array.isArray(roles) || !roles.length)
        ? new User({
            username,
            password: hashPassword,
        })
        : new User({
            username,
            password: hashPassword,
            roles
        })


    await newUser.save();

    res.status(201).json({ message: `New user ${username} created` });
})

export const updateUser = asyncHandler(async (req, res) => {
    const { username, id, roles, active, password } = req.body;

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') return res.status(400).json({ message: 'All field are required' });

    const user = await User.findById(id).exec();
    if (!user) return res.status(400).json({ message: 'User not found' });

    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: 'Duplicate username' });

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({ message: `${updatedUser.username} updated` });
})

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: 'User ID Required' });

    const note = await Note.findOne({ user: id }).lean().exec();
    if (note?.length) return res.status(400).json({ message: 'User has assigned notes' });

    const user = await User.findById(id).exec();
    if (!user) return res.status(400).json({ message: 'User not found' });

    const result = await user.deleteOne();

    res.status(200).json({ message: `User ${result.username} with ID ${result._id} deleted` });
})