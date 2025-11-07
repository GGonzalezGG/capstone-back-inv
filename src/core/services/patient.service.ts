import { Patient } from "@prisma/client";
import { PatientRepository } from "../../data/repositories/patient.repository";
import {
  CreatePatientDto,
  UpdatePatientDto,
} from "../../schemas/patient.schema";
import AppError from "../../utils/AppError";

export class PatientService {
  private patientRepository: PatientRepository;

  constructor() {
    this.patientRepository = new PatientRepository();
  }

  async create(data: CreatePatientDto): Promise<Patient> {
    // Regla de negocio: No permitir pacientes con el mismo RUT
    const existingPatient = await this.patientRepository.findPatientByRut(
      data.rut
    );
    if (existingPatient) {
      throw new AppError("El RUT ingresado ya está registrado.", 400);
    }
    return this.patientRepository.createPatient(data);
  }

  /**
   * Para que las enfermeras vean la lista en el formulario de peticiones
   */
  async getAllActive(): Promise<Patient[]> {
    return this.patientRepository.getAllActivePatients();
  }

  /**
   * Para que los admins vean el historial completo
   */
  async getAll(): Promise<Patient[]> {
    return this.patientRepository.getAllPatients();
  }

  async getById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findPatientById(id);
    if (!patient) {
      throw new AppError("Paciente no encontrado.", 404);
    }
    return patient;
  }

  async update(id: string, data: UpdatePatientDto): Promise<Patient> {
    // Verificar que el paciente existe
    await this.getById(id);

    // Regla de negocio: Si cambia el RUT, verificar que no exista otro
    if (data.rut) {
      const existingPatient = await this.patientRepository.findPatientByRut(
        data.rut
      );
      // Si existe y NO es el mismo paciente que estamos editando
      if (existingPatient && existingPatient.id !== id) {
        throw new AppError(
          "El RUT ingresado ya pertenece a otro paciente.",
          400
        );
      }
    }
    return this.patientRepository.updatePatient(id, data);
  }

  async delete(id: string): Promise<Patient> {
    // Verificar que el paciente existe
    await this.getById(id);
    // Usamos borrado lógico
    return this.patientRepository.softDeletePatient(id);
  }

  async reactivate(id: string): Promise<Patient> {
    // Verificar que el paciente existe
    await this.getById(id);
    return this.patientRepository.reactivatePatient(id);
  }
}
