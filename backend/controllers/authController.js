const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
    );
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOtpExpiry = () => {
    return Date.now() + 10 * 60 * 1000;
};

const normalizeEmail = (email) => {
    return email?.trim().toLowerCase();
};

const buildVerificationEmail = (name, otp) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <div style="background: #667eea; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">ShopNest</h1>
            <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px;">Email Verification</p>
        </div>
        <div style="padding: 40px 30px;">
            <h2 style="color: #667eea; margin-top: 0; font-size: 22px;">Hello ${name},</h2>
            <p style="color: #555;">Use this One-Time Password to verify your ShopNest account:</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px; text-align: center;">
                <p style="color: #999; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                <h3 style="font-size: 32px; letter-spacing: 3px; color: #667eea; margin: 0; font-family: monospace;">${otp}</h3>
            </div>
            <p style="color: #856404; background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; text-align: center;">This OTP will expire in <strong>10 minutes</strong>.</p>
            <p style="color: #666; font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">2026 ShopNest. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

const sendVerificationOtp = async (user) => {
    await sendEmail(
        user.email,
        'Verify Your ShopNest Account - OTP',
        buildVerificationEmail(user.name, user.otp)
    );
};

const assignNewOtp = (user) => {
    user.otp = generateOtp();
    user.otpExpires = getOtpExpiry();
};

// Register User
const registerUser = async (req, res) => {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);
    let createdUserId = null;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required',
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.verified) {
                return res.status(400).json({
                    message: 'User already exists',
                });
            }

            const salt = await bcrypt.genSalt(10);
            existingUser.name = name;
            existingUser.password = await bcrypt.hash(password, salt);
            assignNewOtp(existingUser);

            await existingUser.save();
            await sendVerificationOtp(existingUser);

            return res.status(200).json({
                message: 'Account already exists but is not verified. A new OTP has been sent to your email.',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp: generateOtp(),
            otpExpires: getOtpExpiry(),
        });

        createdUserId = user._id;
        await sendVerificationOtp(user);

        return res.status(201).json({
            message: 'Registration successful. Please verify your email using the OTP sent to your email.',
        });

    } catch (error) {
        console.log(error);

        if (createdUserId) {
            await User.findByIdAndDelete(createdUserId);
        }

        return res.status(500).json({
            message: error.message,
        });
    }
};

// Verify Email
const verifyEmail = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const { otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (user.verified) {
            return res.status(400).json({
                message: 'Email already verified',
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP',
            });
        }

        if (user.otpExpires < Date.now()) {
            user.otp = undefined;
            user.otpExpires = undefined;

            await user.save();

            return res.status(400).json({
                message: 'OTP expired. Please request a new OTP.',
            });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: 'Email verified successfully',
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

const resendOtp = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (user.verified) {
            return res.status(400).json({
                message: 'Email already verified',
            });
        }

        assignNewOtp(user);
        await user.save();
        await sendVerificationOtp(user);

        return res.json({
            message: 'A new OTP has been sent to your email.',
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (
            user &&
            (await bcrypt.compare(password, user.password))
        ) {
            if (!user.verified) {
                return res.status(401).json({
                    message: 'Please verify your email before logging in',
                });
            }

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

        return res.status(400).json({
            message: 'Invalid email or password',
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        return res.json(users);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    resendOtp,
    loginUser,
    getUsers,
};
