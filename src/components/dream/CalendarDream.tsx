import { useMemo, useState } from 'react';
import { AppBar, Box, Button, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@mui/material';
import { CalendarMonthOutlined, CalendarViewMonthOutlined, Close } from '@mui/icons-material';
import { DateCalendar, LocalizationProvider, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useAppSelector } from '../../core/store/hooks';
import { DreamCard } from './DreamCard';
import { Transition } from '../../shared/components/Transition';
import moment, { Moment } from 'moment';

interface CalendarDreamProps {
  isOpenCalendarDream: boolean;
  onClose: () => void;
  onWriteDream: () => void;
  onEditDream: (id: string) => void;
  onDeleteDream: (id: string) => void;
  onDateChange: (date: Moment) => void;
}

export function HasDreamDay(props: PickersDayProps<Moment> & { highlightedDays?: number[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;
  const dots = highlightedDays.filter((d) => d === props.day.date());

  return (
    <div className="relative">
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} className="rounded-md p-3" />
      {isSelected && (
        <div className="absolute bottom-0 w-full flex justify-center">
          {/* Render a maximum of 3 dots */}
          {dots.slice(0, 3).map((_, index) => (
            <div key={`dots` + index} className="size-[6px] bg-sky-500 rounded mb-[2px] me-[1px]"></div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CalendarDream(props: CalendarDreamProps) {
  const { isOpenCalendarDream, onClose, onWriteDream, onEditDream, onDeleteDream, onDateChange } = props;
  const [date, setDate] = useState(moment());
  const [month, setMonth] = useState(moment());
  const [view, setView] = useState('month');
  const [years, setYears] = useState(
    Array(12)
      .fill(null)
      .map((d, i) => moment(new Date(`${i + 1}-1-${new Date().getFullYear()}`)))
  );
  const dreams = useAppSelector((state) => state.dream.dreams);
  const displayDreams = useAppSelector((state) => state.dream.displayDreams);

  const highlightedDays = useMemo(() => {
    const selectedMonth = moment(month).format('MMM');
    const filteredDreams = dreams.filter((dream) => moment(dream.createdAt).format('MMM') === selectedMonth);
    return filteredDreams.map((dream) => +moment(dream.createdAt).format('D'));
  }, [month, dreams]);

  const selectedDateContent =
    displayDreams[moment(date).format('MMMM D')] &&
    displayDreams[moment(date).format('MMMM D')].length > 0 &&
    displayDreams[moment(date).format('MMMM D')].map((dream) => (
      <DreamCard
        key={dream.id}
        isSimpleView={true}
        dream={dream}
        onEditDream={onEditDream}
        onDeleteDream={onDeleteDream}
      />
    ));

  const handleDate = (date: Moment) => {
    setDate(date);
    onDateChange(date);
  };
  const handleMonth = (date: Moment) => {
    setMonth(date);
    onDateChange(date);
  };

  const handleClose = () => {
    onClose();
    setDate(moment());
    onDateChange(moment());
  };

  const handleView = (view: string): void => {
    setView(view);
  };

  console.log('years', years);
  return (
    <Dialog fullScreen open={isOpenCalendarDream} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Calendar
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className="p-0">
        <div className="h-full">
          <div className="flex justify-end mx-6 sm:mx-12 my-3 gap-2">
            <IconButton
              className={view === 'month' ? 'shadow-lg shadow-gray-700/50' : ''}
              color="inherit"
              onClick={() => handleView('month')}
            >
              <CalendarMonthOutlined color="primary" />
            </IconButton>

            <IconButton
              className={view === 'year' ? 'shadow-lg shadow-gray-700/50' : ''}
              color="inherit"
              onClick={() => handleView('year')}
            >
              <CalendarViewMonthOutlined color="primary" />
            </IconButton>
          </div>

          {view === 'month' && (
            <div>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateCalendar
                  value={date}
                  onChange={(e) => handleDate(e!)}
                  onMonthChange={(e) => handleMonth(e!)}
                  disableFuture={true}
                  slots={{ day: HasDreamDay }}
                  slotProps={{
                    day: { highlightedDays } as any,
                  }}
                  views={['day']}
                />
              </LocalizationProvider>

              {/* Date picker height: 336px; Menu height: 40px; */}
              <Box className="overflow-auto" sx={{ height: `calc(100% - 336px - 40px)` }}>
                {!selectedDateContent && (
                  <div className="flex justify-center">
                    <Button variant="contained" onClick={onWriteDream}>
                      Add Dream
                    </Button>
                  </div>
                )}
                <div className="flex flex-col justify-center mx-12 sm:mx-36 mt-5">
                  {selectedDateContent}
                  {!selectedDateContent && <div className="text-center">No dreams for this day.</div>}
                </div>
              </Box>
            </div>
          )}

          {view === 'year' && (
            <div>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                {years.map((year) => (
                  <DateCalendar
                    className="h-36"
                    key={year.toISOString()}
                    value={year}
                    onChange={(e) => handleDate(e!)}
                    onMonthChange={(e) => handleMonth(e!)}
                    disableFuture={true}
                    slots={{ day: HasDreamDay }}
                    slotProps={{
                      day: { highlightedDays } as any,
                    }}
                    views={['day']}
                  />
                ))}
              </LocalizationProvider>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
