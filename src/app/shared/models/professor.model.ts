export interface Professor {
  id: string; // UUID
  name: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  file: string; // Legajo
  academicTitle: string;
  scheduleAvailability: string;
  state: boolean; // Activo/Inactivo
}
