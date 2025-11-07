import { PrismaClient, Patient } from "@prisma/client";
import {
  CreatePatientDto,
  UpdatePatientDto,
} from "../../schemas/patient.schema";

const prisma = new PrismaClient();

export class PatientRepository {
  async createPatient(data: CreatePatientDto): Promise<Patient> {
    return prisma.patient.create({
      data,
    });
  }

  async findPatientById(id: string): Promise<Patient | null> {
    return prisma.patient.findUnique({
      where: { id },
    });
  }

  async findPatientByRut(rut: string): Promise<Patient | null> {
    return prisma.patient.findUnique({
      where: { rut },
    });
  }

  /**
   * Obtiene solo los pacientes ACTIVOS.
   * (Para que las enfermeras los vean en el formulario de peticiones)
   */
  async getAllActivePatients(): Promise<Patient[]> {
    return prisma.patient.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Obtiene TODOS los pacientes, incluyendo inactivos.
   * (Para que los ADMIN/MANAGER los gestionen)
   */
  async getAllPatients(): Promise<Patient[]> {
    return prisma.patient.findMany({
      orderBy: { name: "asc" },
    });
  }

  async updatePatient(id: string, data: UpdatePatientDto): Promise<Patient> {
    return prisma.patient.update({
      where: { id },
      data,
    });
  }

  /**
   * Borrado Lógico (Soft Delete)
   * En lugar de borrar, marcamos el paciente como inactivo.
   */
  async softDeletePatient(id: string): Promise<Patient> {
    return prisma.patient.update({
      where: { id },
      data: { isActive: false },
    });
  }

  //Agregamos para recuperar pacientes que volvieron
  async reactivatePatient(id: string): Promise<Patient> {
    return prisma.patient.update({
      where: { id },
      data: { isActive: true },
    });
  }
}
