import { variables } from "./variables/variables.js";
import { Months } from "./enums.js";
import { domVariables } from "./variables/dom_variables.js";
const highlightPresentDate = () => {
    const date = new Date;
    const presentDate = {
        presentDay: date.getDate(),
        presentMonth: date.getMonth(),
        presentYear: date.getFullYear()
    };
    return presentDate;
};
const createBtnForEachDay = (currentYear, currentMonth, i) => {
    const { initialDate } = domVariables;
    let currentMonthAsString = `${currentMonth + 1}`;
    let currentDayAsString = `${i}`;
    if (currentMonth + 1 < 10) {
        currentMonthAsString = "0" + (currentMonth + 1).toString();
    }
    if (i < 10) {
        currentDayAsString = "0" + i;
    }
    const eventBtn = document.createElement('button');
    eventBtn.innerText = "Add Event";
    eventBtn.classList.add('eventDay', 'hidden');
    eventBtn.addEventListener('click', () => {
        newEventModal.classList.add('active');
        newEventModal.focus();
        initialDate.value = `${currentYear}-${currentMonthAsString}-${currentDayAsString}T12:00`;
    });
    return eventBtn;
};
//Function to render calendar
function renderCalendar() {
    const { currentMonth, currentYear } = variables;
    const { calendarDays, currentMonthElement, eventDetailsModal } = domVariables;
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    calendarDays.innerHTML = '';
    const presentTime = highlightPresentDate();
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
        // Checks if there are eventsfor that day and adds the class 'event-day'
        const eventsForDay = events.filter(event => {
            const eventDate = new Date(event.initialDate);
            return eventDate.getDate() === i && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        });
        // Adds a mouseover event for each day to show the button
        dayElement.addEventListener('mouseover', () => {
            eventBtn.classList.remove('hidden');
        });
        // Adds a mouseover event for each day to show the button
        dayElement.addEventListener('mouseout', () => {
            eventBtn.classList.add('hidden');
        });
        if (eventsForDay.length > 0) {
            dayElement.classList.add('event-day');
            const eventText = document.createElement('div');
            eventText.classList.add('event-text', 'hoverable');
            // Adds an aditional class for pass events
            const isPastEvent = eventsForDay.some(event => new Date(event.initialDate) < new Date());
            if (isPastEvent) {
                eventText.classList.add('past-event');
            }
            // Code for the second modal (Details of event)
            eventText.innerText = eventsForDay.map(event => event.eventTitle).join('\n');
            eventText.addEventListener('click', () => {
                const { eventTitleDisplay, initialDateDisplay, endDateDisplay, descriptionDisplay, reminderDisplay, eventTypeDisplay } = domVariables;
                const firstEventTitle = eventsForDay.length > 0 ? eventsForDay[0].eventTitle : '';
                const firstEventinitialDate = eventsForDay.length > 0 ? eventsForDay[0].initialDate : '';
                const firstEventendDate = eventsForDay.length > 0 ? eventsForDay[0].endDate : 'No end date';
                const firstEventDescription = eventsForDay.length > 0 ? eventsForDay[0].description : 'No description';
                const firstEventReminder = eventsForDay.length > 0 ? eventsForDay[0].reminderSelect : 'No reminder';
                const firstEventEventType = eventsForDay.length > 0 ? eventsForDay[0].eventType : '';
                eventTitleDisplay.innerText = firstEventTitle;
                initialDateDisplay.innerText = `Initial Date: ${firstEventinitialDate}`;
                if (firstEventendDate)
                    endDateDisplay.innerText = `End Date: ${firstEventendDate}`;
                if (firstEventDescription)
                    descriptionDisplay.innerText = `Description: ${firstEventDescription}`;
                if (firstEventReminder)
                    reminderDisplay.innerText = `Reminder Time: ${firstEventReminder}`;
                eventTypeDisplay.innerText = `Event Type: ${firstEventEventType}`;
                removeEventButton.addEventListener('click', () => {
                    const eventTitleToRemove = eventTitleDisplay.innerText;
                    removeEventFromLocalStorage(eventTitleToRemove);
                    const updatedEvents = getEventsFromLocalStorage();
                    eventText.remove();
                    closeAndResetModalTwo();
                });
                eventDetailsModal.classList.add('active');
                eventDetailsModal.focus();
            });
            dayElement.appendChild(eventText);
            const eventDetails = document.createElement('p');
            eventDetails.classList.add('hide');
            if (isPastEvent) {
                eventDetails.classList.add('past-event-details');
            }
            eventDetails.innerText = eventsForDay.map(event => {
                return `${event.eventTitle} \n ${event === null || event === void 0 ? void 0 : event.description} \n ${event.initialDate} \n ${event === null || event === void 0 ? void 0 : event.checkEndDate} \n ${event.eventType}`;
            }).join('\n');
            dayElement.appendChild(eventDetails);
            const hoverableElements = document.querySelectorAll('.hoverable');
            // Adds mouse events for each hoverable element
            hoverableElements.forEach(hoverableElement => {
                hoverableElement.addEventListener('mouseover', () => {
                    const eventDetails = hoverableElement.nextElementSibling;
                    eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.classList.remove('hide');
                });
                hoverableElement.addEventListener('mouseout', () => {
                    const eventDetails = hoverableElement.nextElementSibling;
                    eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.classList.add('hide');
                });
            });
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
function removeEventFromLocalStorage(eventTitle) {
    const events = getEventsFromLocalStorage();
    const updatedEvents = events.filter(event => event.eventTitle !== eventTitle);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
}
// Buttons for previous month and next month
const checkPreviousBtn = () => {
    variables.currentMonth = variables.currentMonth === 0 ? 11 : variables.currentMonth - 1;
    if (variables.currentMonth === 11) {
        variables.currentYear -= 1;
    }
};
const checkNextBtn = () => {
    variables.currentMonth = variables.currentMonth === 11 ? 0 : variables.currentMonth + 1;
    if (variables.currentMonth === 0) {
        variables.currentYear += 1;
    }
};
const { prevBtn, nextBtn, calendarDays, removeEventButton } = domVariables;
// Adds animation
prevBtn.addEventListener('click', () => {
    checkPreviousBtn();
    calendarDays.classList.remove('flip-scale-up-hor');
    renderCalendar();
    setTimeout(() => {
        calendarDays.classList.add('flip-scale-up-hor');
    }, 0);
});
nextBtn.addEventListener('click', () => {
    checkNextBtn();
    calendarDays.classList.remove('flip-scale-up-hor');
    renderCalendar();
    setTimeout(() => {
        calendarDays.classList.add('flip-scale-up-hor');
    }, 0);
});
const { newEventModal, cancelButton, addEventButton, saveButton, closeModalButton, checkEndDate, endDateContainer, reminderContainer, checkRemindDate, reminderSelect, description, closeModalButtonTwo, eventDetailsModal } = domVariables;
// Shows modal
addEventButton.addEventListener('click', () => {
    newEventModal.classList.add('active');
    newEventModal.focus();
});
saveButton.addEventListener('click', () => {
    const formVerification = checkForm();
    if (formVerification) {
        const newEvent = objectCreation();
        const events = getEventsFromLocalStorage();
        // Adds the new event to the event array
        events.push(newEvent);
        // Saves in localstorage
        localStorage.setItem('events', JSON.stringify(events));
        if (newEvent.reminderSelect) {
            const remindDate = getReminderDate();
            const intervalId = setInterval(() => {
                checkReminder(remindDate, newEvent, intervalId);
            }, 10000);
        }
        // Adds the event to the calendar
        renderCalendar();
        closeAndResetModal();
    }
    else {
        highlightIncompleteFields();
    }
});
const getReminderDate = () => {
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
};
const checkReminder = (remindDate, newEvent, intervalId) => {
    const currentDate = new Date();
    if (currentDate > remindDate) {
        alert(`Event with title ${newEvent.eventTitle} will start at ${remindDate}`);
        clearInterval(intervalId);
    }
};
// Creates object 
const objectCreation = () => {
    const { eventTitle, initialDate, endDate, checkRemindDate, reminderSelect, description, eventType, checkEndDate } = domVariables;
    const newEvent = {
        eventTitle: eventTitle.value,
        initialDate: initialDate.value,
        checkEndDate: checkEndDate.value,
        endDate: endDate.value,
        checkRemindDate: checkRemindDate.value,
        reminderSelect: reminderSelect.value,
        description: description.value,
        eventType: eventType.value
    };
    return newEvent;
};
// Events for closing both modals
cancelButton.addEventListener('click', closeAndResetModal);
closeModalButton.addEventListener('click', closeAndResetModal);
closeModalButtonTwo.addEventListener('click', closeAndResetModalTwo);
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
eventDetailsModal.addEventListener('click', (event) => {
    if (event.target === eventDetailsModal) {
        closeAndResetModalTwo();
    }
});
eventDetailsModal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeAndResetModalTwo();
    }
});
// Event checkbox
checkEndDate.addEventListener('change', () => {
    if (endDateContainer.classList.contains('hide')) {
        endDateContainer.classList.remove('hide');
    }
    else
        endDateContainer.classList.add('hide');
});
checkRemindDate.addEventListener('change', () => {
    if (reminderContainer.classList.contains('hide')) {
        reminderContainer.classList.remove('hide');
    }
    else
        reminderContainer.classList.add('hide');
});
function checkForm() {
    const { eventTitle, initialDate, endDate } = domVariables;
    if (!eventTitle.value || eventTitle.value.length > 60)
        return false;
    if (!initialDate.value)
        return false;
    if (!endDateContainer.classList.contains('hide') && !endDate.value)
        return false;
    if (!reminderContainer.classList.contains('hide') && reminderSelect.value === "0")
        return false;
    if (description.length > 500)
        return false;
    else
        return true;
}
function closeAndResetModal() {
    const { eventTitle, initialDate, endDate, description, checkRemindDate, checkEndDate, reminderSelect } = domVariables;
    newEventModal.classList.remove("active");
    reminderSelect.value = "0";
    initialDate.value = "";
    eventTitle.value = "";
    endDate.value = "";
    description.value = "";
    checkRemindDate.checked = false;
    checkEndDate.checked = false;
    eventTitle.style.border = '';
    initialDate.style.border = '';
    endDate.style.border = '';
    reminderSelect.style.border = '';
    description.style.border = '';
}
function closeAndResetModalTwo() {
    const { eventDetailsModal, eventTitleDisplay, initialDateDisplay, endDateDisplay, descriptionDisplay, reminderDisplay, eventTypeDisplay } = domVariables;
    eventDetailsModal.classList.remove("active");
    eventTitleDisplay.innerText = "";
    initialDateDisplay.innerText = "";
    endDateDisplay.innerText = "";
    descriptionDisplay.innerText = "";
    reminderDisplay.innerText = "";
    eventTypeDisplay.innerText = "";
}
function getEventsFromLocalStorage() {
    const eventsString = localStorage.getItem('events');
    return eventsString ? JSON.parse(eventsString) : [];
}
// Function that highlights the incomplete/not valid fields in form
function highlightIncompleteFields() {
    const { eventTitle, initialDate, endDateContainer, endDate, reminderContainer, reminderSelect, description } = domVariables;
    // Highlights in red
    const highlightField = (field) => {
        field.style.border = '2px solid red';
    };
    // Restores the style
    const resetFieldStyle = (field) => {
        field.style.border = '';
    };
    // Incomplete fields
    if (!eventTitle.value || eventTitle.value.length > 60) {
        highlightField(eventTitle);
    }
    else {
        resetFieldStyle(eventTitle);
    }
    if (!initialDate.value) {
        highlightField(initialDate);
    }
    else {
        resetFieldStyle(initialDate);
    }
    if (!endDateContainer.classList.contains('hide') && !endDate.value) {
        highlightField(endDate);
    }
    else {
        resetFieldStyle(endDate);
    }
    if (!reminderContainer.classList.contains('hide') && reminderSelect.value === "0") {
        highlightField(reminderSelect);
    }
    else {
        resetFieldStyle(reminderSelect);
    }
    if (description.value.length > 500) {
        highlightField(description);
    }
    else {
        resetFieldStyle(description);
    }
}
