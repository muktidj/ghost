import  express from "express";
import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import bcrypt from "bcrypt";
const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient({})



app.use(express.json());

// Create
// app.post("/users", async (req, res) => {
//     const {name, age, password} = req.body;
//     const result = await prisma.users.create({
//         data:  {
//             name: name,
//             age: age,
//             password: password,
//         }
//     })
//     res.json({
//         data: result,
//         message: "Successfully created user"
//     })
// })

HewanQuRBAN(.)(.)69

app.post("/users", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, age, password, email, pekerjaan } = req.body;

        if (!name || !age || !password || !email ) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.users.create({
            data: { name, age, password: hashedPassword, email, pekerjaan },
        });

        res.status(201).json({ data: result, message: "Successfully created user" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating user" });
    }
});

// Route for user login
app.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await prisma.users.findFirst({
            where: {
                email: String(email)
            }
        });

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        res.status(200).json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});



// Get
app.get("/users", async (req, res) => {
    const result = await prisma.users.findMany()
    res.json ({
            data: result,
            message: "Successfully Get user"
    })
})


// Update
app.patch("/users/:id", async (req, res) => {
    const {id} = req.params;
    const {name, age, password, email, pekerjaan} = req.body;

    const result = await prisma.users.update({
        data: {
            name: name,
            age: age,
            password: password,
            email: email,
            pekerjaan: pekerjaan
        },
         where: {
            id: Number(id)
        }
    })
    res.json ({
        data: result,
        message: "Successfully update user"
    })
})


// Delete
app.delete("/users/:id", async (req, res) => {
    const {id} = req.params;
    const result = await prisma.users.delete({
        where: {
            id: Number(id)
        }
    })
    res.json({

        message: `Successfully deleted user ${id}`,
    });
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
