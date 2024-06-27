import userCol from "../../Models/userModel.mjs";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { generateEncryptedPassword } from "../../utils/generateEncryptedPassword.mjs";
import { generateTime } from "../../utils/generateTime.mjs";
import { generateDate } from "../../utils/generateDate.mjs";
import postCol from "../../Models/postModel.mjs";
import dotenv from "dotenv"
import allPostCol from "../../Models/generalPostModel.mjs";
import { removeImages } from "../../cloudinaryConfig/handleRemoveAPI.mjs";

dotenv.config()

const JWT_SECRET = process.env.JWT_TOKEN;

export const signin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, description, phno, gender, education } = req.body;

        if (!firstName || !lastName || !email || !password || !description || !phno || !gender || !education)
            res.status(200).json({ status: false, message: "All Fields must be filled!!!" })

        else {
            const userExists = await userCol.findOne({
                $or: [
                    { "userDetails.email": email },
                    { "userDetails.phno": phno },
                ]
            })

            if (userExists) {
                res.status(200).json({
                    status: false,
                    message: "User already exists. Try to login"
                })
            } else {
                if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(firstName.trim()))
                    res.status(200).json({ status: false, message: "Invalid First Name" })
                else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(lastName.trim()))
                    res.status(200).json({ status: false, message: "Invalid Last Name" })
                else if (!new RegExp("^[\\w]+([\.-]?[\\w]+)*@[\\w]+([\.-]?[\\w]+)*(\.[\\w]{2,3})+$").test(email.trim()))
                    res.status(200).json({ status: false, message: "Invalid Email Id" })
                else if (!new RegExp("^[\+0-9][0-9]{4,11}$").test(phno.trim()))
                    res.status(200).json({ status: false, message: "Invalid Mobile No" })
                else if (gender === "")
                    res.status(200).json({ status: false, message: "Invalid Gender" })
                else if (education === "")
                    res.status(200).json({ status: false, message: "Invalid Education" })
                else {

                    // CREATE THE USER
                    const user = new userCol({
                        userDetails: {
                            firstName: firstName.trim(),
                            lastName: lastName.trim(),
                            fullName: `${firstName.trim()} ${lastName.trim()}`,
                            email: email.trim(),
                            phno: phno.trim(),
                            password: await generateEncryptedPassword(password),
                            gender: gender,
                            education: education,
                            description: description.trim()
                        },
                        accountCreation: {
                            date: generateDate(),
                            time: generateTime()
                        }
                    })

                    const response = await user.save()

                    if (response) {
                        // IF THE RESPONSE IS NOT NULL THEN CREATE THE POST WITH THE USER_ID
                        const userPost = new postCol({
                            userDetails: {
                                username: `${firstName.trim()} ${lastName.trim()}`,
                                userId: response._id,
                                profilePic: ""
                            }
                        })
                        const post = await userPost.save()

                        if (post) {
                            // IF POST IS NOT NULL THEN GENERATE A TOKEN FOR THE USER AND GIVE A SUCCESS RESPONSE WITH THE USER DATA
                            const token = jwt.sign({ tokenId: response._id }, JWT_SECRET);
                            res.cookie("notemate", token, {
                                httpOnly: true,
                                maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000)
                            })

                            res.status(200).json({
                                status: true,
                                message: response
                            })
                        } else {
                            await userCol.findByIdAndDelete(response._id) // if post collection is not created then delete the user and send a message so that the user will be able to create an account again.
                            res.status(200).json({
                                status: false,
                                message: "Something went wrong!!!"
                            })
                        }
                    } else {
                        // IF THE RESPONSE IS NULL THEN RESPOND BACK WITH FAILURE MESSAGE
                        res.status(200).json({
                            status: false,
                            message: "Something went wrong!!!"
                        })
                    }
                }
            }
        }

    } catch (error) {
        console.error(`Server error : signin error : ${error}`)
    }
}

export const login = async (req, res) => {
    try {
        const { mail, password } = req.body;
        if (!mail || !password)
            res.status(200).json({ status: false, message: "All Fields must be filled!!!" })

        const user = await userCol.findOne({ "userDetails.email": mail });

        if (user) {
            const isPasswordCorrect = bcryptjs.compareSync(password, user.userDetails.password)

            if (isPasswordCorrect) {

                const post = await postCol.findOne({ "userDetails.userId": user._id })

                if (post) {
                    const token = jwt.sign({ tokenId: user._id }, JWT_SECRET);
                    res.cookie("notemate", token, {
                        httpOnly: true,
                        maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000)
                    })

                    res.status(200).json({
                        status: true,
                        message: { user, post }
                    })
                } else {
                    res.status(200).json({
                        status: false,
                        message: "Something went wrong!!!"
                    })
                }


            } else {
                res.status(200).json({
                    status: false,
                    message: "Wrong Credentials"
                })
            }
        } else {
            res.status(200).json({
                status: false,
                message: "User not found. Try to signin."
            })
        }
    } catch (error) {
        console.error(`Server error : login error : ${error}`)
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("notemate");
        res.status(200).send(true)
    } catch (error) {
        console.error(`Server error : logout error --> ${error}`)
    }
}

export const deactiveAccount = async (req, res) => {
    try {
        const _id = req.params.id;
        const response = await userCol.findByIdAndDelete(_id);

        if (response) {
            await allPostCol.deleteMany({ "userDetails.userId": _id })
            const removeUserPost = await postCol.findOneAndDelete({ "userDetails.userId": _id });

            if (removeUserPost) {
                removeUserPost.posts.forEach(post => {
                    removeImages(post.images)
                })

                res.clearCookie("notemate");
            }

            res.status(200).send(response !== null && response !== undefined)
        }
    } catch (error) {
        console.error(`Server error : deactivating account error --> ${error}`)
    }
}