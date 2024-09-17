import { SyntheticEvent, useState } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel } from '@mui/material';
import { Transition } from '../../shared/components/Transition';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { isTrue } from '../../shared/utils/is-true';
import { useAppDispatch } from '../../core/store/hooks';
import { filterDream } from './../../core/store/dreams/dreamSlice';
import moment from 'moment';

interface FilterDreamProps {
  isOpenFilter: boolean;
  onClose: () => void;
}

interface DreamCharacteristic {
  recurrent: boolean;
  nightmare: boolean;
  paralysis: boolean;
}

export interface Filter {
  favoriteOnly: boolean;
  date: string;
  dreamCharacteristic: DreamCharacteristic;
}

export function FilterDream({ isOpenFilter, onClose }: FilterDreamProps) {
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [toDate, setToDate] = useState(moment().date(new Date().getDate() - 7));
  const [fromDate, setFromDate] = useState(moment());
  const [dreamCharacteristic, setDreamCharacteristic] = useState<DreamCharacteristic>({
    recurrent: false,
    nightmare: false,
    paralysis: false,
  });
  const dispatch = useAppDispatch();

  const handleDreamCharacteristic = (e: SyntheticEvent<Element, Event>): void => {
    const target = e.target as HTMLInputElement;
    setDreamCharacteristic({
      ...dreamCharacteristic,
      [target.name]: !isTrue(target.value),
    });
  };

  const handleFilter = (): void => {
    const filter: Filter = {
      favoriteOnly,
      date: '',
      dreamCharacteristic,
    };
    console.log('filter', filter);
    dispatch(filterDream(filter));
    onClose();
  };

  return (
    <Dialog open={isOpenFilter} fullScreen TransitionComponent={Transition} onClose={onClose}>
      <DialogTitle className="flex justify-between">
        <div>Filter</div>
        <div>Clear</div>
      </DialogTitle>
      <DialogContent>
        <div>
          <section className="mb-3 p-3 bg-gray-600 rounded-lg">
            <FormControlLabel
              name="favorite"
              checked={favoriteOnly}
              value={favoriteOnly}
              onChange={(e) => setFavoriteOnly(!favoriteOnly)}
              control={<Checkbox />}
              label="Show only Favorite"
            />
          </section>

          <section className="mb-3 p-3 bg-gray-600 rounded-lg">
            <h4 className="mt-0 mb-2">Date</h4>
            <div id="date" className="flex items-center">
              <div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <MobileDatePicker onAccept={(e) => setToDate(e!)} value={toDate} disableFuture={true} />
                </LocalizationProvider>
              </div>
              <div className="mx-3">to</div>
              <div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <MobileDatePicker onAccept={(e) => setFromDate(e!)} value={fromDate} disableFuture={true} />
                </LocalizationProvider>
              </div>
            </div>
          </section>

          <section className="mb-3 p-3 bg-gray-600 rounded-lg">
            <h4 className="mt-0 mb-2">Dream Characteristic</h4>
            <div>
              <FormControlLabel
                className="block"
                name="recurrent"
                checked={dreamCharacteristic.recurrent}
                value={dreamCharacteristic.recurrent}
                onChange={(e) => handleDreamCharacteristic(e)}
                control={<Checkbox />}
                label="Recurrent"
              />
              <FormControlLabel
                className="block"
                name="nightmare"
                checked={dreamCharacteristic.nightmare}
                value={dreamCharacteristic.nightmare}
                onChange={(e) => handleDreamCharacteristic(e)}
                control={<Checkbox />}
                label="Nightmare"
              />
              <FormControlLabel
                className="block"
                name="paralysis"
                checked={dreamCharacteristic.paralysis}
                value={dreamCharacteristic.paralysis}
                onChange={(e) => handleDreamCharacteristic(e)}
                control={<Checkbox />}
                label="Sleep Paralysis"
              />
            </div>
          </section>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleFilter} type="submit" variant="contained">
          Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
