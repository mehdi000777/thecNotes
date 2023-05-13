import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ username }).exec();
    if (!user || !user.active) return res.status(401).json({ message: 'Unauthorized' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            userInfo: {
                "username": user.username,
                "roles": user.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { "username": user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 60 * 60 * 24 * 1000,
    });

    res.json({ accessToken });
})

export const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decode) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const user = await User.findOne({ username: decode.username }).exec();
            if (!user) return res.status(401).json({ message: 'Unauthorized' });

            const accessToken = jwt.sign(
                {
                    userInfo: {
                        "username": user.username,
                        "roles": user.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken });
        })
    )
})

export const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    res.json({ message: 'Cookie cleard' });
})