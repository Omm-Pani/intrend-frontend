import moment from 'moment';

interface CalendarEvent {
  title: string;
  theme: string;
  startTime: moment.Moment;
  endTime: moment.Moment;
}

export interface TeamMember {
  name: string;
  avatar: string;
  email: string;
  role: string;
  joinedOn: string;
  lastActive: string;
}

interface DummyDataObj {
  CALENDAR_INITIAL_EVENTS: CalendarEvent[];
  TEAM_MEMBERS_LIST: TeamMember[];
}

const DummyData: DummyDataObj = Object.freeze({
  CALENDAR_INITIAL_EVENTS: [
    {
      title: 'Meeting with tech team',
      theme: 'PINK',
      startTime: moment().add(-8, 'd').startOf('day'),
      endTime: moment().add(-8, 'd').endOf('day'),
    },
    {
      title: 'Meeting with Cristina',
      theme: 'PURPLE',
      startTime: moment().add(-2, 'd').startOf('day'),
      endTime: moment().add(-2, 'd').endOf('day'),
    },
    {
      title: 'Meeting with Alex',
      theme: 'BLUE',
      startTime: moment().startOf('day'),
      endTime: moment().endOf('day'),
    },
  ],

  TEAM_MEMBERS_LIST: [
    {
      name: 'Omm',
      avatar: 'https://reqres.in/img/faces/1-image.jpg',
      email: 'omm@gmail.com',
      role: 'Owner',
      joinedOn: moment(new Date())
        .add(-5 * 1, 'days')
        .format('DD MMM YYYY'),
      lastActive: '5 hr ago',
    },
    {
      name: 'Ereena',
      avatar: 'https://reqres.in/img/faces/2-image.jpg',
      email: 'ereena@gmail.com',
      role: 'Editor',
      joinedOn: moment(new Date())
        .add(-5 * 2, 'days')
        .format('DD MMM YYYY'),
      lastActive: '15 min ago',
    },
  ],
});

export default DummyData;
