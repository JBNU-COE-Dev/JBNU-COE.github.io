import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ko';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './monthlyCalendar.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { calendarApi } from '../../../services';
import { getHolidaysAsEvents } from '../../../utils/holidays';

// moment 한국어 설정
moment.locale('ko');
const localizer = momentLocalizer(moment);

function MonthlyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventsData, setEventsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 백엔드 API에서 행사 일정 로드 및 파싱
  useEffect(() => {
    const loadCalendarEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 백엔드 API에서 일정 데이터 가져오기
        const data = await calendarApi.getAllCalendarEvents();
        
        // API 응답이 배열인 경우 그대로 사용, 객체인 경우 data 필드 확인
        const events = Array.isArray(data) ? data : (data.content || data.data || []);
        
        // 파싱하여 eventsData에 설정
        const parsedEvents = parseCalendarData(events);
        setEventsData(parsedEvents);
      } catch (err) {
        console.error('Failed to load calendar events:', err);
        setError(err.message || '행사 일정을 불러오는데 실패했습니다.');
        
        // API 실패 시 fallback: 기존 calendar.json 파일 사용
        try {
          const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/calendar.json`);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const parsedEvents = parseCalendarData(fallbackData);
            setEventsData(parsedEvents);
            setError(null); // fallback 성공 시 에러 제거
          }
        } catch (fallbackErr) {
          console.error('Failed to load fallback calendar.json:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCalendarEvents();
  }, []);

  // 현재 월이 변경될 때 공휴일 업데이트
  useEffect(() => {
    if (Object.keys(eventsData).length === 0) return;
    
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth + 2, 0);
    const holidays = getHolidaysAsEvents(startDate, endDate);
    
    // 기존 이벤트에서 공휴일만 제거하고 새 공휴일 추가
    const updatedEvents = {};
    
    // 기존 이벤트 중 공휴일이 아닌 것만 복사
    Object.keys(eventsData).forEach(date => {
      const nonHolidayEvents = eventsData[date].filter(e => !e.isHoliday);
      if (nonHolidayEvents.length > 0) {
        updatedEvents[date] = nonHolidayEvents;
      }
    });
    
    // 새로운 공휴일 추가
    Object.keys(holidays).forEach(date => {
      if (!updatedEvents[date]) {
        updatedEvents[date] = [];
      }
      updatedEvents[date].push(...holidays[date]);
    });
    
    setEventsData(updatedEvents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  // 백엔드 API 응답 데이터 파싱 함수
  // API 응답 형식: { date_start, date_end, event_korean, event_english, ... }
  const parseCalendarData = (jsonData) => {
    const events = {};

    // jsonData가 배열인지 확인
    if (!Array.isArray(jsonData)) {
      console.warn('Calendar data is not an array:', jsonData);
      return events;
    }

    jsonData.forEach(item => {
      // 날짜 필드 확인 (API 응답에 따라 date_start 또는 startDate 등일 수 있음)
      const startDateStr = item.date_start || item.startDate || item.start;
      const endDateStr = item.date_end || item.endDate || item.end;

      if (!startDateStr || !endDateStr) {
        console.warn('Invalid calendar item (missing dates):', item);
        return;
      }

      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // 유효한 날짜인지 확인
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn('Invalid date format in calendar item:', item);
        return;
      }

      // 행사명 필드 확인 (API 응답에 따라 event_korean 또는 title 등일 수 있음)
      const eventTitle = item.event_korean || item.title || item.name || '행사';
      const eventTitleEn = item.event_english || item.titleEn || item.nameEn || '';

      const eventData = {
        title: eventTitle,
        titleEn: eventTitleEn,
        dateRange: startDateStr === endDateStr
          ? moment(startDate).format('M/D')
          : `${moment(startDate).format('M/D')} - ${moment(endDate).format('M/D')}`
      };

      // 시작 날짜부터 종료 날짜까지 모든 날짜에 이벤트 추가
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateKey = moment(currentDate).format('YYYY-MM-DD');
        if (!events[dateKey]) events[dateKey] = [];
        events[dateKey].push(eventData);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return events;
  };

  // eventsData를 react-big-calendar 형식으로 변환
  const events = useMemo(() => {
    const eventList = [];

    Object.keys(eventsData).forEach(dateStr => {
      const date = new Date(dateStr);
      eventsData[dateStr].forEach(event => {
        eventList.push({
          title: event.title,
          start: date,
          end: date,
          allDay: true,
          resource: event
        });
      });
    });

    return eventList;
  }, [eventsData]);

  // 날짜를 'YYYY-MM-DD' 형식으로 변환
  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  // 선택된 날짜의 이벤트 가져오기
  const getEventsForDate = (date) => {
    const dateKey = formatDate(date);
    return eventsData[dateKey] || [];
  };

  const selectedEvents = getEventsForDate(selectedDate);

  // 날짜 선택 핸들러
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  // 이벤트 클릭 핸들러
  const handleSelectEvent = (event) => {
    setSelectedDate(event.start);
  };

  // 커스텀 이벤트 스타일
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: 'rgba(0, 76, 165, 1)',
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.85rem',
        padding: '2px 6px'
      }
    };
  };

  // 커스텀 날짜 셀 스타일
  const dayPropGetter = (date) => {
    const hasEvent = events.some(event =>
      moment(event.start).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
    );
    
    const dayOfWeek = date.getDay(); // 0 = 일요일, 6 = 토요일
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const className = [];
    if (hasEvent) {
      className.push('has-event');
    }
    if (isWeekend) {
      className.push('weekend-day');
    }

    return {
      className: className.join(' '),
      style: isWeekend ? {
        color: '#dc2626', // 빨간색
        fontWeight: '600'
      } : {}
    };
  };

  // 한국어 메시지
  const messages = {
    today: '오늘',
    previous: '이전',
    next: '다음',
    month: '월',
    week: '주',
    day: '일',
    agenda: '일정',
    date: '날짜',
    time: '시간',
    event: '이벤트',
    showMore: (total) => `+${total} 더보기`
  };

  // 월 이동 핸들러
  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).subtract(1, 'month').toDate());
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'month').toDate());
  };

  // 커스텀 툴바 컴포넌트
  const CustomToolbar = ({ label }) => {
    return (
      <div className="calendar-toolbar">
        <button className="toolbar-nav-button" onClick={handlePreviousMonth}>
          <FaChevronLeft />
        </button>
        <span className="toolbar-label">{label}</span>
        <button className="toolbar-nav-button" onClick={handleNextMonth}>
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="monthly-calendar-page">
      <div className="page-title">
        <h1>월별 행사 일정</h1>
        <p>공과대학 학생회 행사 일정을 확인하세요</p>
      </div>

      {loading && (
        <div className="calendar-loading">
          <p>행사 일정을 불러오는 중...</p>
        </div>
      )}

      {error && !loading && (
        <div className="calendar-error">
          <p>⚠️ {error}</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            로컬 캐시 파일을 사용하고 있습니다.
          </p>
        </div>
      )}

      <div className="calendar-container">
        <div className="calendar-section">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month']}
            defaultView="month"
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            messages={messages}
            popup
            max={3}
            className="big-calendar"
            components={{
              toolbar: CustomToolbar
            }}
          />
        </div>

        <div className="events-section">
          <div className="events-box">
            <div className="events-header">
              <h2>행사 일정</h2>
              <div className="selected-date">
                {moment(selectedDate).format('YYYY년 M월 D일')}
              </div>
            </div>

            {selectedEvents.length > 0 ? (
              <ul className="events-list">
                {selectedEvents.map((event, index) => (
                  <li key={index} className="event-item">
                    <div className="event-marker"></div>
                    <div className="event-content">
                      <div className="event-title">{event.title}</div>
                      {event.dateRange && (
                        <div className="event-date-range">{event.dateRange}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-events">선택한 날짜에 일정이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyCalendar;
