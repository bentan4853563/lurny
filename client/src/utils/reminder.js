const calculateReminders = (X, Y) => {
  const A = X - 1;
  const B = 1 / A;
  const C = Math.pow(Y, B);

  let reminders = [1];

  for (let i = 1; i < X; i++) {
    reminders.push(C * reminders[i - 1]);
  }

  const remindersInHours = reminders.map((rem) => rem * 24);

  return remindersInHours;
};

const getSchedule = (repeat, period) => {
  let predictedDays = [];

  const reminderHours = calculateReminders(parseInt(repeat), parseInt(period));
  for (let i = 0; i < reminderHours.length; i++) {
    const period = Math.round(reminderHours[i] / 24);
    predictedDays.push(period);
  }
  return predictedDays;
};

export default getSchedule;
