export const domVariables = {
  //elements for the calendar
  prevBtn: document.getElementById('prevMonth') as HTMLButtonElement,
  nextBtn: document.getElementById('nextMonth') as HTMLButtonElement,
  currentMonthElement: document.getElementById('currentMonth') as HTMLHeadingElement,
  calendarDays: document.getElementById('days') as HTMLDivElement,
  //new event button
  addEventButton: document.getElementById('showModal') as HTMLButtonElement,
  //modal 1 elements 
  newEventModal: document.getElementById('newEventModal') as HTMLDivElement,
  closeModalButton: document.getElementById('closeModal') as HTMLButtonElement,
  closeModalButtonTwo: document.getElementById('closeModalTwo') as HTMLButtonElement,
  //form elements (modal 1)
  newEventForm: document.getElementById('newEventForm') as HTMLFormElement,
  eventTitle: document.getElementById('eventTitle') as HTMLFormElement,
  initialDate: document.getElementById('initialDate') as HTMLFormElement,
  checkEndDate: document.getElementById('checkEndDate') as HTMLFormElement,
  endDateContainer: document.getElementById('endDateContainer') as HTMLDivElement,
  endDate: document.getElementById('endDate') as HTMLFormElement,
  checkRemindDate: document.getElementById('checkRemindDate') as HTMLFormElement,
  reminderContainer: document.getElementById('reminderContainer') as HTMLDivElement,
  reminderSelect: document.getElementById('reminder') as HTMLFormElement,
  description: document.getElementById('description') as HTMLFormElement,
  eventType: document.getElementById('eventType') as HTMLFormElement,
  //modal 2 footer
  cancelButton: document.getElementById('cancelButton') as HTMLButtonElement,
  saveButton: document.getElementById('saveButton') as HTMLButtonElement,
  //event details (modal 2)
  eventDetailsModal: document.getElementById('eventDetailsModal') as HTMLDivElement,
  eventTitleDisplay: document.getElementById('eventTitleDisplay') as HTMLHeadingElement,
  initialDateDisplay: document.getElementById('initialDateDisplay') as HTMLSpanElement,
  endDateDisplay: document.getElementById('endDateDisplay') as HTMLSpanElement,
  descriptionDisplay: document.getElementById('descriptionDisplay') as HTMLSpanElement,
  reminderDisplay: document.getElementById('reminderDisplay') as HTMLSpanElement,
  eventTypeDisplay: document.getElementById('eventTypeDisplay') as HTMLSpanElement,
  removeEventButton: document.getElementById('removeEventButton') as HTMLButtonElement,
};