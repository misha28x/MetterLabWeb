export interface StationTask {
  id_task: string;
  taskDate: string; // Дата_завдання
  type: string; // Тип_установки
  number: string; // Номер_установки
  employeeName: string; // ПІБ_контактної_особи
  task_status: string; // Статус завдання
  phoneNumber: string; // Номер_телефону
  count: number; // Кількість_заявок
}
