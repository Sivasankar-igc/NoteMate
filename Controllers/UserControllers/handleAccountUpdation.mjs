import userCol from "../../Models/userModel.mjs";
import { generateEncryptedPassword } from "../../utils/generateEncryptedPassword.mjs";

export const editPassword = async (req, res) => {
    try {
        const id = req.params.id;
        const { password } = req.body;
        const hashPassword = await generateEncryptedPassword(password);
        const response = await userCol.findByIdAndUpdate(id, { $set: { "userDetails.password": hashPassword } })
        res.status(200).send(response !== null && response !== undefined)
    } catch (error) {
        console.error(`Server error : editing password --> ${error}`)
    }
}

export const editDescription = async (req, res) => {
    try {
        const id = req.params.id;
        const { description } = req.body;
        const response = await userCol.findByIdAndUpdate(id, { $set: { "userDetails.description": description } })
        res.status(200).send(response !== null && response !== undefined)
    } catch (error) {
        console.error(`Server error : editing description --> ${error}`)
    }
}

export const editUserDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const { firstName, lastName, gender, education } = req.body;

        if (!firstName || !lastName || !gender || !education)
            res.status(200).json({ status: false, message: "All fields must be filled" })

        if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(firstName.trim()))
            res.status(200).json({ status: false, message: "Invalid First Name" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(lastName.trim()))
            res.status(200).json({ status: false, message: "Invalid Last Name" })

        const response = await userCol.findByIdAndUpdate(id, {
            $set: {
                "userDetails.firstName": firstName.trim(),
                "userDetails.lastName": lastName.trim(),
                "userDetails.fullName": `${firstName.trim()} ${lastName.trim()}`,
                "userDetails.gender": gender,
                "userDetails.education": education
            }
        }, { new: true })

        response ? res.status(200).json({ status: true, message: response }) : res.status(200).json({ status: false, message: "Something went wrong!!!" })
        res.status(200).json({ status: response !== null && response !== undefined, message: response })
    } catch (error) {
        console.error(`Server error : editing user details --> ${error}`)
    }
}

export const editProfilePic = async (req, res) => {
    try {
        const id = req.params.id;
        const { profilePic } = req.body;

        const response = await userCol.findByIdAndUpdate(id, {
            $set: { "userDetails.profilePic": profilePic }
        })

        res.status(200).send(response !== null && response !== undefined)
    } catch (error) {
        console.error(`Server error : editing profile picture --> ${error}`)
    }
}