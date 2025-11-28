export interface ProfessorSubject {
  id: string; // UUID
  subjectId: string; // UUID
  professorId: string; // UUID
  role: string; // e.g., "Titular", "Adjunto"
  schedule: string; // e.g., "Lunes 18:00 - 22:00"
  subjectName?: string; // Optional helper for UI
}
