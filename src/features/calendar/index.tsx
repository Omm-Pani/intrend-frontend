'use client';
import { useEffect, useState } from 'react';
import CalendarView from '../../components/CalendarView';
import moment, { Moment } from 'moment';
// import { CALENDAR_INITIAL_EVENTS } from '../../utils/dummyData';
import { useDispatch } from 'react-redux';
// import { openRightDrawer } from '../common/rightDrawerSlice';
// import { RIGHT_DRAWER_TYPES } from '../../utils/globalConstantUtil';
import { showNotification } from '../common/headerSlice';
import { useAppSelector } from '@/lib/hooks';
import { openModal } from '../common/modalSlice';
import { MODAL_BODY_TYPES } from '@/helper/app-constants';
import { resetPlatform } from '../common/postSlice';
import Cookies from 'js-cookie';
import axios from 'axios';
import { setDate } from '../common/dateSlice';

// Define types for events
export interface CalendarEvent {
  title: string;
  theme: string;
  startTime: Moment; // Using Moment.js for date handling
  endTime: Moment;
  timeCreated: string;
}

function Calendar() {
  const dispatch = useDispatch();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const { platform, time } = useAppSelector((state) => state.post);
  const token = Cookies.get('auth-token');

  //fetch calender events
  const fetchCalendarEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/get-calendar-events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedEvents = response.data.calendarEvents.map((event: any) => ({
        ...event,
        title: event.platform,
        startTime: moment(event.startTime),
        endTime: moment(event.endTime),
      }));
      console.log(fetchedEvents);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCalendarEvents();
    }
  }, [token]);

  const storeCalendarEvent = async (newEvent: CalendarEvent) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/store-calendar-events`,
        {
          platform: newEvent.title,
          theme: newEvent.theme,
          startTime: newEvent.startTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime: newEvent.endTime.format('YYYY-MM-DD HH:mm:ss'),
          timeCreated: newEvent.timeCreated,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCalendarEvents(); // ✅ Re-fetch events to update UI
    } catch (error) {
      console.error('Error storing event:', error);
    }
  };

  // Add Event handler
  const addNewEvent = (date: Date) => {
    const dDate = moment(date).format('YYYY-MM-DD');
    dispatch(setDate(dDate));

    dispatch(
      openModal({
        title: 'Post Confirmation',
        bodyType: MODAL_BODY_TYPES.POST_TYPE_CONFIRMATION,
      })
    );

    setEventDate(date);
  };

  useEffect(() => {
    if (platform) {
      const newEventObj: CalendarEvent = {
        title: platform,
        theme:
          platform === 'facebook'
            ? 'BLUE'
            : platform === 'youtube'
            ? 'RED'
            : 'GREEN',
        startTime: moment(eventDate),
        endTime: moment(eventDate),
        timeCreated: time,
      };
      setEvents((prevEvents) => [...prevEvents, newEventObj]);
      console.log(newEventObj);
      storeCalendarEvent(newEventObj);
      dispatch(resetPlatform());
      setEventDate(new Date());
    }
  }, [platform, eventDate]);

  // Open all events of the current day in the sidebar
  // const openDayDetail = ({
  //   filteredEvents,
  //   title,
  // }: {
  //   filteredEvents: CalendarEvent[];
  //   title: string;
  // }) => {
  //   dispatch(
  //     openRightDrawer({
  //       header: title,
  //       bodyType: RIGHT_DRAWER_TYPES.CALENDAR_EVENTS,
  //       extraObject: { filteredEvents },
  //     })
  //   );
  // };

  return (
    <>
      <CalendarView
        calendarEvents={events}
        addNewEvent={addNewEvent}
        // openDayDetail={openDayDetail}
      />
    </>
  );
}

export default Calendar;
