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


app.post("/users", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, age, password, email, pekerjaan } = req.body;

        if (!name || !age || !password || !email ) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.users.create({
            data: { name, age, password: hashedPassword, email, pekerjaan }
        });

        res.status(201).json({ data: result, message: "Successfully created user" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating user" });
    }
});

app.post("/products", async (req: Request, res: Response): Promise<void> => {
    try {
        const { product_name, duration, city, province, amount, isActive } = req.body;

        if (!product_name || !duration || !amount || !isActive ) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const result = await prisma.products.create({
            data: { product_name, duration, city, province, amount, isActive },
        });
        res.status(201).json({ data: result, message: "Successfully created product" });
    }
    catch (error) {
        console.error(error);
            res.status(500).json({ message: "An error occurred while creating product" });
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

app.get("/products", async (req, res) => {
    const result = await prisma.products.findMany()
    res.json ({
        data: result,
        message: "Successfully Get Data Products"
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

app.delete("/products/:id_product", async (req, res) => {
    try {
        const { id_product } = req.params;

        // Pastikan id_product dikonversi ke angka jika id_product bertipe Int
        const productId = parseInt(id_product, 10);
        if (isNaN(productId)) {
            res.status(400).json({ message: "Invalid product ID" });
            return;
        }

        const result = await prisma.products.delete({
            where: {
                id_product: productId, // Sesuaikan dengan nama kolom di model Prisma
            },
        });

        res.json({
            message: `Successfully deleted product with ID ${productId}`,
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting product" });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});