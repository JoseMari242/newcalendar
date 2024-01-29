import { eventType } from "./enums"


export interface Event {
  eventTitle: string,
  initialDate: string,
  checkEndDate?: string,
  endDate?: string,
  checkRemindDate?: string,
  reminderSelect?: string,
  description?: string,
  eventType: eventType
}