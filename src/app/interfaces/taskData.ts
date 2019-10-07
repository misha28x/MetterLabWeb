export interface Task {
  taskDate: string;
  serviceType: string;
  stationNumber: string;
  task_status?: TaskStatuses;
}

export enum TaskStatuses {
  Uploaded,
  All,
  New = '',
  Send = 'В роботі',
  Resolved = 'Виконано',
  Failed = 'Не виконано'
}
