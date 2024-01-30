import { Event, ActualTime } from "./interface.js";
import { variables } from "./variables/variables.js";
import { Months } from "./enums.js";
import { domVariables } from "./variables/dom_variables.js";

const highlightPresentDate = (): ActualTime => {
  const date = new Date;
  const presentDate: ActualTime = {
    presentDay: date.getDate(),
    presentMonth: date.getMonth(),
    presentYear: date.getFullYear()
  }
  return presentDate;
}

const createBtnForEachDay = (currentYear: number, currentMonth: number, i: number): HTMLButtonElement => {
  const {initialDate} = domVariables;
  let currentMonthAsString: string = `${currentMonth + 1}`;
  console.log(currentMonthAsString)
  let currentDayAsString: string = `${i}`;
  if (currentMonth + 1 < 10) {
    currentMonthAsString = "0" + (currentMonth + 1).toString();
  }
  if (i < 10) {
    currentDayAsString = "0" + i;
  }
  const eventBtn = document.createElement('button');
  eventBtn.innerText = "Add Event";
  eventBtn.classList.add('eventDay');
  eventBtn.addEventListener('click', () => {
    newEventModal.classList.add('active');
    newEventModal.focus();
    initialDate.value = `${currentYear}-${currentMonthAsString}-${currentDayAsString}T12:00`;
  })
  return eventBtn;
}

function renderCalendar(): void {
  const { currentMonth, currentYear } = variables;
  const { calendarDays, currentMonthElement } = domVariables;

  const firstDayOfMonth: number = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth: number = new Date(currentYear, currentMonth + 1, 0).getDate();
  calendarDays.innerHTML = '';

  const presentTime: ActualTime = highlightPresentDate();
  const { presentDay, presentMonth, presentYear } = presentTime;

  for (let i = 0; i < firstDayOfMonth; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day', 'empty');
    calendarDays.appendChild(dayElement);
  }

  const events = getEventsFromLocalStorage();

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement('div');
    const eventBtn = createBtnForEachDay(currentYear, currentMonth, i);
    dayElement.classList.add('day');
    dayElement.innerText = i.toString();

    // Verifica si hay eventos para este día y agrega la clase 'event-day'
    const eventsForDay = events.filter(event => {
      const eventDate = new Date(event.initialDate);
      return eventDate.getDate() === i && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });

    if (eventsForDay.length > 0) {
      dayElement.classList.add('event-day');
      const eventText = document.createElement('div');
      eventText.classList.add('event-text');
      eventText.innerText = eventsForDay.map(event => event.eventTitle).join(', ');
      dayElement.appendChild(eventText);
    }

    if (i === presentDay && presentMonth === currentMonth && presentYear === currentYear) {
      dayElement.classList.add('presentDay');
    }

    calendarDays.appendChild(dayElement);
    dayElement.appendChild(eventBtn);
  }

  currentMonthElement.innerText = `${Months[currentMonth]} ${currentYear}`;
}


renderCalendar();

const checkPreviousBtn = (): void => {
  variables.currentMonth = variables.currentMonth === 0 ? 11 : variables.currentMonth - 1;
  if (variables.currentMonth === 11) {
    variables.currentYear -= 1;
  }
}

const checkNextBtn = (): void => {
  variables.currentMonth = variables.currentMonth === 11 ? 0 : variables.currentMonth + 1;
  if (variables.currentMonth === 0) {
      variables.currentYear += 1;
  }
}

const {prevBtn, nextBtn} = domVariables;

prevBtn.addEventListener('click', () => {
  checkPreviousBtn();
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  checkNextBtn();
  renderCalendar();
});


const {newEventModal, cancelButton, addEventButton, newEventForm, saveButton, closeModalButton, checkEndDate, 
  endDateContainer, reminderContainer, checkRemindDate, reminderSelect, description} = domVariables;

addEventButton.addEventListener('click', () => {
  newEventModal.classList.add('active');
  newEventModal.focus();
});


saveButton.addEventListener('click', () => {
  const formVerification = checkForm();
  if (formVerification) {
    const newEvent = objectCreation();
    const events = getEventsFromLocalStorage();
    console.log(events);

    // Agrega el nuevo evento al arreglo de eventos
    events.push(newEvent);
  
    // Guarda el arreglo de eventos actualizado en localStorage
    localStorage.setItem('events', JSON.stringify(events));

    if (newEvent.reminderSelect) {
      const remindDate = getReminderDate();
      setInterval(() => {
        checkReminder(remindDate);
      }, 10000);
    }

    // Añade evento al día en el calendario
    renderCalendar();
    closeAndResetModal();
  } else {
    highlightIncompleteFields();
  }
});



const getReminderDate = (): object => {
    const hourOfDay = objectCreation().initialDate.slice(11);
    const [hour, minute] = hourOfDay.split(':');

    const dayOfEvent = objectCreation().initialDate.slice(0, 10);
    let [year, month, day] = dayOfEvent.split('-');

    const reminder = Number(objectCreation().reminderSelect);
    const minutes = Number(minute) - reminder;

    const reminderDate = new Date();
    reminderDate.setHours(parseInt(hour));
    reminderDate.setMinutes(minutes);
    reminderDate.setFullYear(parseInt(year));
    reminderDate.setMonth(parseInt((month)) - 1);
    reminderDate.setDate(parseInt(day));
    return reminderDate;
}

const checkReminder = (remindDate: object) => {
    const currentDate = new Date();
    if (currentDate > remindDate) alert('yepa')
    console.log( {remindDate}, {currentDate})
}


const objectCreation = ():Event => {
  const {eventTitle, initialDate, endDate, checkRemindDate, reminderSelect, description, eventType, checkEndDate} = domVariables;
  const newEvent: Event = {
    eventTitle: eventTitle.value,
    initialDate: initialDate.value,
    checkEndDate: checkEndDate.value,
    endDate: endDate.value,
    checkRemindDate: checkRemindDate.value,
    reminderSelect: reminderSelect.value,
    description: description.value,
    eventType: eventType.value
  }
  return newEvent;
}

cancelButton.addEventListener('click', closeAndResetModal);

closeModalButton.addEventListener('click', closeAndResetModal);

newEventModal.addEventListener('click', (event) => {
  if (event.target === newEventModal) {
    closeAndResetModal();
  }
});

newEventModal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeAndResetModal();
  }
});

//event checkbox
checkEndDate.addEventListener('change', () => {
  if (endDateContainer.classList.contains('hide')){
    endDateContainer.classList.remove('hide');
  } else endDateContainer.classList.add('hide');
})

checkRemindDate.addEventListener('change', () => {
  if (reminderContainer.classList.contains('hide')){
    reminderContainer.classList.remove('hide');
  } else reminderContainer.classList.add('hide');
})

function checkForm() {  
  const {eventTitle, initialDate, endDate} = domVariables;
  if (!eventTitle.value || eventTitle.value.length > 60) return false;
  if (!initialDate.value) return false;
  if (!endDateContainer.classList.contains('hide') && !endDate.value) return false;
  if (!reminderContainer.classList.contains('hide') && reminderSelect.value === "0") return false;
  if (description.length > 500) return false;
  else return true;
}

function closeAndResetModal() {
  const {eventTitle, initialDate, endDate, description, checkRemindDate, checkEndDate, reminderSelect} = domVariables;
  newEventModal.classList.remove("active");
  reminderSelect.value = "0";
  initialDate.value= "";
  eventTitle.value = "";
  endDate.value = "";
  description.value = "";
  checkRemindDate.checked = false;
  checkEndDate.checked = false;
}


function getEventsFromLocalStorage(): Event[] {
  const eventsString = localStorage.getItem('events');
  return eventsString ? JSON.parse(eventsString) : [];
}


function highlightIncompleteFields() {
  const { eventTitle, initialDate, endDateContainer, endDate, reminderContainer, reminderSelect, description } = domVariables;

  // Función para resaltar en rojo un campo
  const highlightField = (field: HTMLFormElement) => {
    field.style.border = '2px solid red';
  };

  // Función para restaurar el estilo normal de un campo
  const resetFieldStyle = (field: HTMLFormElement) => {
    field.style.border = '';
  };

  // Lógica para resaltar campos incompletos
  if (!eventTitle.value || eventTitle.value.length > 60) {
    highlightField(eventTitle);
  } else {
    resetFieldStyle(eventTitle);
  }

  if (!initialDate.value) {
    highlightField(initialDate);
  } else {
    resetFieldStyle(initialDate);
  }

  if (!endDateContainer.classList.contains('hide') && !endDate.value) {
    highlightField(endDate);
  } else {
    resetFieldStyle(endDate);
  }

  if (!reminderContainer.classList.contains('hide') && reminderSelect.value === "0") {
    highlightField(reminderSelect);
  } else {
    resetFieldStyle(reminderSelect);
  }

  if (description.value.length > 500) {
    highlightField(description);
  } else {
    resetFieldStyle(description);
  }
}

