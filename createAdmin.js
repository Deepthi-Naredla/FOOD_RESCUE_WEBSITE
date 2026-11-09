const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const dns = require("dns");

const User = require("./models/User");

dotenv.config();

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

async function createAdmin() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB Atlas connected"
        );


        // Check if admin already exists

        const existingAdmin =
            await User.findOne({
                email: "admin@foodrescue.com"
            });


        if (existingAdmin) {

            console.log(
                "Admin account already exists"
            );

            await mongoose.disconnect();

            return;

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(
                "Admin@123",
                10
            );


        // Create admin

        const admin =
            await User.create({

                name: "FoodRescue Admin",

                email: "admin@foodrescue.com",

                password: hashedPassword,

                roles: ["admin"],

                phone: "",

                area: "",

                capacity: 0,

                availability: true,

                verified: true

            });


        console.log(
            "Admin account created successfully"
        );

        console.log(
            "Email: admin@foodrescue.com"
        );

        console.log(
            "Password: Admin@123"
        );


        await mongoose.disconnect();

    }

    catch (error) {

        console.error(
            "Failed to create admin:"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}


createAdmin();