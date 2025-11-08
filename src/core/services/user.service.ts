import { User } from "@prisma/client";
import { UserRepository } from "../../data/repositories/user.repository";
import { UpdateUserDto } from "../../schemas/user.schema";
import AppError from "../../utils/AppError";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Obtiene todos los usuarios
   */
  async getAll(): Promise<Omit<User, "password">[]> {
    return this.userRepository.findAllUsers();
  }

  /**
   * Obtiene un usuario por ID
   */
  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError("Usuario no encontrado.", 404);
    }
    return user;
  }

  /**
   * Actualiza un usuario
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    // 1. Verificar que el usuario a editar existe
    await this.getById(id);

    // 2. Regla de negocio: Si se está cambiando el email,
    //    verificar que no esté ya en uso por OTRO usuario.
    if (data.email) {
      const existingUser = await this.userRepository.findUserByEmail(
        data.email
      );
      if (existingUser && existingUser.id !== id) {
        throw new AppError("El email ya está en uso por otra cuenta.", 400);
      }
    }

    // 3. Actualizar el usuario
    return this.userRepository.updateUser(id, data);
  }

  /**
   * Desactiva una cuenta de usuario
   */
  async deactivate(id: string): Promise<User> {
    await this.getById(id); // Verifica que existe
    return this.userRepository.updateUser(id, { isActive: false });
  }

  /**
   * Reactiva una cuenta de usuario
   */
  async reactivate(id: string): Promise<User> {
    await this.getById(id); // Verifica que existe
    return this.userRepository.updateUser(id, { isActive: true });
  }
}
