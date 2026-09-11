export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username: rawUsername, password } = req.body;

    if (!rawUsername || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const username = rawUsername.trim();

    let user;
    if (username.slice(-4).toLowerCase() === ".com") {
      // Treat as email
      user = await prisma.user.findUnique({ where: { email: username } });
    } else {
      // Treat as NIC, use findFirst since nicNum may not be unique
      user = await prisma.user.findFirst({ where: { nicNum: username } });
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      error: "Signin failed",
      details: error instanceof Error ? error.message : error,
    });
  }
};
