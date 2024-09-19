import { SyntheticEvent, useState } from 'react';
import {
  Button,
  ButtonBase,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';
import { Transition } from '../../shared/components/Transition';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useAppDispatch } from '../../core/store/hooks';
import { filterDream } from './../../core/store/dreams/dreamSlice';
import { Filter, FilterType } from '../../shared/models/filter';
import { isTrue } from '../../shared/utils/is-true';
import moment, { Moment } from 'moment';

interface FilterDreamProps {
  isOpenFilter: boolean;
  onClose: () => void;
}

interface DreamCharacteristic {
  recurrent: boolean;
  nightmare: boolean;
  paralysis: boolean;
}

const defaultDreamCharacteristic = {
  recurrent: false,
  nightmare: false,
  paralysis: false,
};

const defaultFromDate = moment().date(new Date().getDate() - 7);

export function FilterDream({ isOpenFilter, onClose }: FilterDreamProps) {
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [fromDate, setToDate] = useState(defaultFromDate);
  const [toDate, setFromDate] = useState(moment());
  const [dreamCharacteristic, setDreamCharacteristic] = useState<DreamCharacteristic>(defaultDreamCharacteristic);
  const [filters, setFilters] = useState<Filter[]>([]);
  const dispatch = useAppDispatch();

  const handleFavoriteOnly = (e: SyntheticEvent<Element, Event>): void => {
    const target = e.target as HTMLInputElement;
    setFavoriteOnly(!favoriteOnly);
    updateFilter(target.name, !favoriteOnly);
  };

  const handleDate = (e: Moment, type: string): void => {
    if (type === FilterType.FromDate) {
      setFromDate(e);
    }
    if (type === FilterType.ToDate) {
      setToDate(e);
    }
    console.log('type', type);
    updateFilter(type, e.toISOString());
  };

  const handleDreamCharacteristic = (e: SyntheticEvent<Element, Event>): void => {
    const target = e.target as HTMLInputElement;
    setDreamCharacteristic({
      ...dreamCharacteristic,
      [target.name]: !isTrue(target.value),
    });
    updateFilter(target.name, !isTrue(target.value));
  };

  const handleFilter = (): void => {
    // handleDate(fromDate, FilterType.FromDate);
    // handleDate(toDate, FilterType.ToDate);
    dispatch(filterDream(filters));
    onClose();
  };

  const handleClearFilter = (): void => {
    setFavoriteOnly(false);
    setDreamCharacteristic(defaultDreamCharacteristic);
    setFromDate(defaultFromDate);
    setToDate(moment());
    setFilters([]);
  };

  const updateFilter = (name: string, value: string | boolean): void => {
    setFilters((prevFilters) => {
      let updatedFilters = prevFilters.filter((f) => f.value);
      console.log('prevFilters', prevFilters);
      // // const filterExists = updatedFilters.some((f) => f.name === name);

      if (value) {
        updatedFilters.push({ name, value });
      } else {
        updatedFilters = updatedFilters.filter((f) => f.name !== name);
      }

      return updatedFilters;
    });
  };

  return (
    <Dialog open={isOpenFilter} fullScreen TransitionComponent={Transition} onClose={onClose}>
      <DialogTitle className="flex justify-between items-center">
        <div>Filter</div>
        <ButtonBase className="text-sm rounded-lg p-2" component="div" onClick={handleClearFilter}>
          Clear
        </ButtonBase>
      </DialogTitle>
      <DialogContent>
        <div>
          <section className="mb-3 p-3 bg-gray-600 rounded-lg">
            <FormControlLabel
              name="favorite"
              checked={favoriteOnly}
              value={favoriteOnly}
              onChange={(e) => handleFavoriteOnly(e)}
              control={<Checkbox />}
              label="Show only Favorite"
            />
          </section>

          <section className="mb-3 p-3 bg-gray-600 rounded-lg">
            <h4 className="mt-0 mb-2">Date</h4>
            <div id="date" className="flex items-center">
              <div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <MobileDatePicker
                    label="From Date"
                    onAccept={(e) => handleDate(e!, FilterType.FromDate)}
                    value={fromDate}
                    disableFuture={true}
                  />
                </LocalizationProvider>
              </div>
              <div className="mx-3">to</div>
              <div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <MobileDatePicker
                    label="To Date"
                    onAccept={(e) => handleDate(e!, FilterType.ToDate)}
                    value={toDate}
                    disableFuture={true}
                  />
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
