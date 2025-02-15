'use client';
import { useEffect, useState } from 'react';
import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import moment, { Moment } from 'moment';
import { CALENDAR_EVENT_STYLE } from './util';
import { CalendarEvent } from '@/features/calendar';
import { useAppDispatch } from '@/lib/hooks';

// Define types for calendar events and props

interface CalendarViewProps {
  calendarEvents: CalendarEvent[];
  addNewEvent: (date: Date) => void;
}

// Define type for theme background styles
const THEME_BG: Record<string, string> = CALENDAR_EVENT_STYLE;

const CalendarView: React.FC<CalendarViewProps> = ({
  calendarEvents,
  addNewEvent,
}) => {
  const dispatch = useAppDispatch();
  const today = moment().startOf('day');
  const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
  ];

  const [firstDayOfMonth, setFirstDayOfMonth] = useState<Moment>(
    moment().startOf('month')
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currMonth, setCurrMonth] = useState<string>(
    moment(today).format('MMM-yyyy')
  );

  useEffect(() => {
    setEvents(calendarEvents);
  }, [calendarEvents]);

  const allDaysInMonth = (): Date[] => {
    const start = moment(firstDayOfMonth).startOf('week');
    const end = moment(firstDayOfMonth).endOf('month').endOf('week');
    const days: Date[] = [];
    let day = start;
    while (day <= end) {
      days.push(day.toDate());
      day = day.clone().add(1, 'day');
    }
    return days;
  };
  const getEventsForCurrentDate = (date: Date): CalendarEvent[] => {
    let filteredEvents = events.filter((e) =>
      moment(date).isSame(moment(e.startTime), 'day')
    );

    // if (filteredEvents.length > 2) {
    //   const originalLength = filteredEvents.length;
    //   filteredEvents = filteredEvents.slice(0, 2);
    //   filteredEvents.push({
    //     title: `${originalLength - 2} more`,
    //     theme: 'MORE',
    //     startTime: moment().startOf('day'),
    //     endTime: moment().endOf('day'),
    //   });
    // }

    return filteredEvents;
  };

  // const openAllEventsDetail = (date: Date, theme: string): void => {
  //   if (theme !== "MORE") return;
  //   const filteredEvents = events
  //     .filter((e) => moment(date).isSame(moment(e.startTime), "day"))
  //     .map((e) => ({
  //       title: e.title,
  //       theme: e.theme,
  //     }));

  //   openDayDetail({
  //     filteredEvents,
  //     title: moment(date).format("D MMM YYYY"),
  //   });
  // };

  const isToday = (date: Date): boolean => moment(date).isSame(moment(), 'day');

  const isDayBeforeToday = (date: Date): boolean =>
    moment(date).isBefore(today);

  const isDifferentMonth = (date: Date): boolean =>
    moment(date).month() !== firstDayOfMonth.month();

  const getPrevMonth = (): void => {
    const firstDayOfPrevMonth = firstDayOfMonth
      .clone()
      .subtract(1, 'month')
      .startOf('month');
    setFirstDayOfMonth(firstDayOfPrevMonth);
    setCurrMonth(firstDayOfPrevMonth.format('MMM-yyyy'));
  };

  const getCurrentMonth = (): void => {
    const firstDayOfCurrMonth = moment().startOf('month');
    setFirstDayOfMonth(firstDayOfCurrMonth);
    setCurrMonth(firstDayOfCurrMonth.format('MMM-yyyy'));
  };

  const getNextMonth = (): void => {
    const firstDayOfNextMonth = firstDayOfMonth
      .clone()
      .add(1, 'month')
      .startOf('month');
    setFirstDayOfMonth(firstDayOfNextMonth);
    setCurrMonth(firstDayOfNextMonth.format('MMM-yyyy'));
  };

  return (
    <div className="w-full bg-base-100 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex justify-normal gap-2 sm:gap-4">
          <p className="font-semibold text-xl w-48">
            {moment(firstDayOfMonth).format('MMMM yyyy')}
            <span className="text-xs ml-2">Beta</span>
          </p>
          <button
            className="btn btn-square btn-sm btn-ghost"
            onClick={getPrevMonth}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            className="btn btn-sm btn-ghost normal-case"
            onClick={getCurrentMonth}
          >
            Current Month
          </button>
          <button
            className="btn btn-square btn-sm btn-ghost"
            onClick={getNextMonth}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div>
          <button
            className="btn btn-sm btn-ghost btn-outline normal-case"
            onClick={() => addNewEvent(new Date())}
          >
            Add New Event
          </button>
        </div>
      </div>
      <div className="my-4 divider" />
      <div className="grid grid-cols-7 gap-6 sm:gap-12 place-items-center">
        {weekdays.map((day, key) => (
          <div className="text-xs capitalize" key={key}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 mt-1 place-items-center">
        {allDaysInMonth().map((day, idx) => (
          <div
            key={idx}
            className={`${
              colStartClasses[moment(day).day()]
            } border border-solid w-full h-28`}
          >
            <p
              className={`flex items-center justify-center h-8 w-8 rounded-full mx-1 mt-1 text-sm cursor-pointer hover:bg-base-300 ${
                isToday(day) && 'bg-blue-100 dark:bg-blue-400 dark:text-white'
              } ${
                isDifferentMonth(day) && 'text-slate-400 dark:text-slate-600'
              }`}
              onClick={() => !isDayBeforeToday(day) && addNewEvent(day)}
            >
              {moment(day).format('D')}
            </p>
            {getEventsForCurrentDate(day).map((e, k) => (
              <div
                key={k}
                // onClick={() => openAllEventsDetail(day, e.theme)}
                className={`flex justify-between text-xs px-2 mt-1 truncate ${
                  THEME_BG[e.theme] || ''
                }`}
              >
                <p>{e.title}</p>
                <p>{e.timeCreated}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
