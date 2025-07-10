import User from '../models/user.model.js'
import { retry } from '../utils/utils.js'

export const create = async (req, res) => {
    console.log("Creating User!");
    try {
        const { firstName, lastName, email, password } = req.body;
        const accountId = req.params.account;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'Required User fields are missing!' });
        }

        if (!accountId) {
            return res.status(400).json({ error: 'Account not specified!' });
        }

        // await User.create({ firstName, lastName, email, password, accountId: accountId});
        retry(() => User.create({ firstName, lastName, email, password, accountId }));

        console.log("User Created!");

        res.sendStatus(201) // 201: Creation

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const get = async (req, res) => {
    try {
        const accountId = req.params.account;
        const { page, limit } = req.query

        if (!accountId) {
            return res.status(400).json({ error: 'Account not specified!' });
        }

        if (!page | !limit) {
            return res.status(400).json({ error: "Pagination 'page' or 'limit' not specified!" });
        }

        const skip = (page - 1) * limit; // how many documents to skip over

        const users = await User.find({ accountId }).skip(skip).limit(limit);
        if (!users) {
            return res.status(409).json({ error: 'Account has no users!' }); // 409: Conflict
        }

        console.log("Getting Users for account: " + accountId);

        res.status(200).json(users); // 200: Ok

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const accountId = req.params.account;
        const id = req.params.id;

        if (!accountId) {
            return res.status(400).json({ error: 'Account not specified!' });
        }

        if (!id) {
            return res.status(400).json({ error: "UserId not specified!" });
        }

        await User.findByIdAndDelete(id);

        console.log("Deleting user with id: " + id);

        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};