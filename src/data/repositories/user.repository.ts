import { PrismaClient, User, Role } from "@prisma/client";

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

  // (Aquí irán otros métodos como findUserById, updateUser, etc.)
}
