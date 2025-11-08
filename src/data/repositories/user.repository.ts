import { PrismaClient, User, Role } from "@prisma/client";

type UserWithoutPassword = Omit<User, "password">;

// Creamos una instancia única del cliente de Prisma
// (Puedes mover esto a src/prisma.client.ts si prefieres)
const prisma = new PrismaClient();

export class UserRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: data.role,
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findAllUsers(): Promise<UserWithoutPassword[]> {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async updateUser(
    id: string,
    data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
