export interface ClientFilters {
  name: string;
  lastname: string;
  ageMin: number | null;
  ageMax: number | null;
  birthDateStart: Date | null;
  birthDateEnd: Date | null;
}
