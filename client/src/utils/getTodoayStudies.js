import getSchedule from "./reminder";

const isDueTodayOrBefore = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const comparisonDate = new Date(date);
  comparisonDate.setHours(0, 0, 0, 0);

  // Check if the comparisonDate is today or before
  return comparisonDate.getTime() <= today.getTime();
};

const getNextDay = (last_learned, repeatTimes, period, learn_count) => {
  const schedule = getSchedule(repeatTimes, period); // Assuming getSchedule is defined elsewhere
  const daysToAdd = schedule[learn_count];

  const lastLearnedDate = new Date(last_learned);
  const nextDay = new Date(lastLearnedDate);
  nextDay.setDate(nextDay.getDate() + daysToAdd);
  return nextDay;
};

export const getTodaysStudies = (allStudies) => {
  return allStudies.filter((study) => {
    const nextDay = getNextDay(
      study.last_learned,
      study.user.repeatTimes,
      study.user.period,
      study.learn_count
    );
    return isDueTodayOrBefore(nextDay);
  });
};
