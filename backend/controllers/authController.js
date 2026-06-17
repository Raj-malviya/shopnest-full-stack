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

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000, // 10 min
        });

        const message = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">ShopNest</h1>
            <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px;">Welcome Aboard!</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #667eea; margin-top: 0; margin-bottom: 20px; font-size: 22px;">Hello ${name},</h2>
            
            <p style="color: #555; margin-bottom: 10px;">Thank you for creating an account with <strong>ShopNest</strong>. We're excited to have you on board!</p>
            
            <p style="color: #555; margin-bottom: 30px;">To complete your email verification, please use the One-Time Password (OTP) below:</p>
            
            <!-- OTP Box -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px; text-align: center;">
                <p style="color: #999; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                <h3 style="font-size: 32px; letter-spacing: 3px; color: #667eea; margin: 0; font-family: 'Courier New', monospace; font-weight: bold;">${otp}</h3>
            </div>
            
            <!-- Timer -->
            <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 30px; text-align: center;">
                <p style="color: #856404; margin: 0; font-size: 14px;">⏱️ This OTP will expire in <strong>10 minutes</strong></p>
            </div>
            
            <!-- Security Note -->
            <div style="background-color: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                <p style="color: #0c5aa0; margin: 0; font-size: 13px;">🔒 <strong>Security Tip:</strong> Never share this OTP with anyone. ShopNest staff will never ask for your OTP.</p>
            </div>
            
            <!-- Action -->
            <p style="color: #666; margin-bottom: 20px; font-size: 14px;">Didn't create this account? You can safely ignore this email.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">© 2026 ShopNest. All rights reserved.</p>
            <p style="color: #bbb; margin: 8px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

        await sendEmail(
            email,
            '🔐 Verify Your ShopNest Account - OTP Inside',
            message
        );

        return res.status(201).json({
            message:
                'Registration successful. Please verify your email using the OTP sent to your email.',
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

// Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

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
        const { email } = req.body;

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

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const message = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">ShopNest</h1>
            <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px;">Email Verification</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #667eea; margin-top: 0; margin-bottom: 20px; font-size: 22px;">Hello ${user.name},</h2>
            
            <p style="color: #555; margin-bottom: 10px;">We've received a request to verify your email address for your <strong>ShopNest</strong> account.</p>
            
            <p style="color: #555; margin-bottom: 30px;">Please use the One-Time Password (OTP) below to complete your email verification:</p>
            
            <!-- OTP Box -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px; text-align: center;">
                <p style="color: #999; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                <h3 style="font-size: 32px; letter-spacing: 3px; color: #667eea; margin: 0; font-family: 'Courier New', monospace; font-weight: bold;">${otp}</h3>
            </div>
            
            <!-- Timer -->
            <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 30px; text-align: center;">
                <p style="color: #856404; margin: 0; font-size: 14px;">⏱️ This OTP will expire in <strong>10 minutes</strong></p>
            </div>
            
            <!-- Security Note -->
            <div style="background-color: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                <p style="color: #0c5aa0; margin: 0; font-size: 13px;">🔒 <strong>Security Tip:</strong> Never share this OTP with anyone. ShopNest staff will never ask for your OTP.</p>
            </div>
            
            <!-- Action -->
            <p style="color: #666; margin-bottom: 20px; font-size: 14px;">If you didn't request this verification, you can safely ignore this email.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">© 2026 ShopNest. All rights reserved.</p>
            <p style="color: #bbb; margin: 8px 0 0 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

        await sendEmail(
            email,
            '🔐 Your ShopNest Verification Code - OTP',
            message
        );

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
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (
            user &&
            (await bcrypt.compare(password, user.password))
        ) {
            // Check Email Verification
            if (!user.verified) {
                return res.status(401).json({
                    message:
                        'Please verify your email before logging in',
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


// const { TokenExpiredError } = require('jsonwebtoken');
// const User = require('../model/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const sendEmail = require('../utils/sendEmail');

// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '3d',
//     });
// };

// // Register a new user
// const registerUser = async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({
//                 message: 'User already exists',
//             });
//         }

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create user
//         const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     otp,
//     otpExpires: Date.now() + 10 * 60 * 1000 // 10 min
// });
// const otp = Math.floor(
//     100000 + Math.random() * 900000
// ).toString();

//         if (!user) {
//             return res.status(400).json({
//                 message: 'Invalid user data',
//             });
//         }

//         // Generate OTP
//         const otp = Math.floor(
//             100000 + Math.random() * 900000
//         ).toString();

//         const message = `
// Welcome to ShopNest, ${name}!

// Thank you for registering with us.

// Your OTP for registration is:

// ${otp}

// Please use this OTP to verify your account.
// `;

//         // Send Email
//         await sendEmail(
//             email,
//             'Welcome to ShopNest - OTP Verification',
//             message
//         );

//         return res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             token: generateToken(user._id),
//             message:
//                 'User registered successfully. Please check your email for OTP verification.',
//         });

//     } catch (error) {
//         console.log(error);

//         return res.status(500).json({
//             message: error.message,
//         });
//     }
// };


// //verify the email
// const verifyEmail = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found'
//             });
//         }

//         if (user.otp !== otp) {
//             return res.status(400).json({
//                 message: 'Invalid OTP'
//             });
//         }

//         if (user.otpExpires < Date.now()) {
//             return res.status(400).json({
//                 message: 'OTP expired'
//             });
//         }

//         user.verified = true;
//         user.otp = undefined;
//         user.otpExpires = undefined;

//         await user.save();

//         return res.json({
//             message: 'Email verified successfully'
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// };
// // Login User
// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (
//             user &&
//             (await bcrypt.compare(password, user.password))
//         ) {
//             return res.json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 token: generateToken(user._id),
//             });
//         }

//         return res.status(400).json({
//             message: 'Invalid email or password',
//         });

//     } catch (error) {
//         console.log(error);

//         return res.status(500).json({
//             message: error.message,
//         });
//     }
// };

// // Get All Users
// const getUsers = async (req, res) => {
//     try {
//         const users = await User.find({}).select('-password');

//         return res.json(users);

//     } catch (error) {
//         console.log(error);

//         return res.status(500).json({
//             message: error.message,
//         });
//     }
// };

// module.exports = {
//     registerUser,
//     loginUser,
//     getUsers,
//     verifyEmail
// };

