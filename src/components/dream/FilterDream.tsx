import { SyntheticEvent, useEffect, useState } from 'react';
import { Transition } from '../../shared/components/Transition';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { filterDream } from './../../core/store/dreams/dreamSlice';
import { Filter, FilterType } from '../../shared/models/filter';
import { CloseOutlined } from '@mui/icons-material';
import { Button, ButtonBase, Checkbox, Dialog, DialogContent, Drawer, FormControlLabel } from '@mui/material';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
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

interface FilterFormProps {
  onClose: () => void;
}

const defaultDreamCharacteristic = {
  recurrent: false,
  nightmare: false,
  paralysis: false,
};

const defaultFromDate = moment().date(new Date().getDate() - 7);

export function FilterForm({ onClose }: FilterFormProps) {
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [includeDate, setIncludeDate] = useState(false);
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(moment());
  const [dreamCharacteristic, setDreamCharacteristic] = useState<DreamCharacteristic>(defaultDreamCharacteristic);
  const [filters, setFilters] = useState<Filter[]>([]);
  const stateFilter = useAppSelector((state) => state.dream.filters);
  const dispatch = useAppDispatch();
  const dateDisplayName = `${moment(fromDate.toISOString()).format('L')} - ${moment(toDate.toISOString()).format('L')}`;
  const dateValue = [fromDate.toISOString(), toDate.toISOString()];

  useEffect(() => {
    const dreamCharacteristic = { ...defaultDreamCharacteristic };
    let favorite = false;
    let hasDate = false;
    let from;
    let to;
    stateFilter.forEach((filter: Filter) => {
      if (dreamCharacteristic.hasOwnProperty(filter.name)) {
        const key = filter.name as keyof DreamCharacteristic;
        dreamCharacteristic[key] = filter.value as boolean;
      }

      if (filter.name === FilterType.Favorite) {
        favorite = filter.value as boolean;
      }

      if (filter.name === FilterType.Date) {
        hasDate = true;
        from = (filter?.value as string[])[0];
        to = (filter?.value as string[])[1];
        setFromDate(moment(from));
        setToDate(moment(to));
      }
    });

    setFilters(stateFilter);
    setDreamCharacteristic({ ...dreamCharacteristic });
    setFavoriteOnly(favorite);
    if (hasDate) {
      setFromDate(moment(from));
      setToDate(moment(to));
    } else {
      setIncludeDate(false);
    }
  }, [stateFilter]);

  useEffect(() => {
    if (includeDate) {
      updateFilter(FilterType.Date, false);
      updateFilter(FilterType.Date, dateValue, dateDisplayName);
    }
  }, [fromDate, toDate]);

  const handleFavoriteOnly = (e: SyntheticEvent<Element, Event>): void => {
    const target = e.target as HTMLInputElement;
    setFavoriteOnly(!favoriteOnly);
    updateFilter(target.name, !favoriteOnly, 'Favorite');
  };

  const handleDate = (e: Moment, type: string): void => {
    type === 'from' ? setFromDate(e) : setToDate(e);
  };

  const handleDreamCharacteristic = (e: SyntheticEvent<Element, Event>): void => {
    const target = e.target as HTMLInputElement;
    setDreamCharacteristic({
      ...dreamCharacteristic,
      [target.name]: target.checked,
    });
    const label = document.querySelector(`label[for=${target.id}]`) as HTMLLabelElement;
    updateFilter(target.name, target.checked, label.innerText ?? '');
  };

  const handleAddDateFilter = (): void => {
    setIncludeDate(true);
    setFromDate(defaultFromDate);
    setToDate(moment());
  };

  const handleRemoveDate = (): void => {
    setIncludeDate(false);
    updateFilter(FilterType.Date, false);
    setFromDate(defaultFromDate);
    setToDate(moment());
  };

  const handleClearFilter = (): void => {
    setFavoriteOnly(false);
    setDreamCharacteristic(defaultDreamCharacteristic);
    setIncludeDate(false);
    setFromDate(defaultFromDate);
    setToDate(moment());
    setFilters([]);
  };

  const updateFilter = (name: string, value: string[] | boolean, displayName?: string): void => {
    setFilters((prevFilters) => {
      let updatedFilters = prevFilters.filter((f) => f.value);

      if (value) {
        displayName ? updatedFilters.push({ name, value, displayName }) : updatedFilters.push({ name, value });
      } else {
        updatedFilters = updatedFilters.filter((f) => f.name !== name);
      }

      return updatedFilters;
    });
  };

  const handleFilter = (): void => {
    dispatch(filterDream(filters));
    onClose();
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4">
      <div className="flex justify-between items-center">
        <h2 className="m-0 px-3">Filter</h2>
        <ButtonBase className="text-sm rounded-lg p-2" component="div" onClick={handleClearFilter}>
          Clear
        </ButtonBase>
      </div>

      <section className="mb-3 p-3 rounded-lg">
        <FormControlLabel
          name="favorite"
          checked={favoriteOnly}
          value={favoriteOnly}
          onChange={(e) => handleFavoriteOnly(e)}
          control={<Checkbox />}
          label="Show only Favorite"
        />
      </section>

      <section className="mb-3 p-3 rounded-lg">
        <h4 className="mt-0 mb-2">Date</h4>
        {!includeDate && (
          <Button variant="outlined" onClick={handleAddDateFilter}>
            add
          </Button>
        )}

        {includeDate && (
          <div className="flex items-center">
            <div id="date" className="flex items-center">
              <div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <MobileDatePicker
                    label="From Date"
                    onAccept={(e) => handleDate(e!, 'from')}
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
                    onAccept={(e) => handleDate(e!, 'to')}
                    value={toDate}
                    minDate={fromDate}
                    disableFuture={true}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <ButtonBase className="rounded-xl p-2" onClick={handleRemoveDate}>
              <CloseOutlined />
            </ButtonBase>
          </div>
        )}
      </section>

      <section className="mb-3 p-3 rounded-lg">
        <h4 className="mt-0 mb-2">Dream Characteristic</h4>
        <div>
          <div>
            <FormControlLabel
              htmlFor="recurrent"
              name="recurrent"
              checked={dreamCharacteristic.recurrent}
              value={dreamCharacteristic.recurrent}
              onChange={(e) => handleDreamCharacteristic(e)}
              control={<Checkbox id="recurrent" />}
              label="Recurrent"
            />
          </div>
          <div>
            <FormControlLabel
              htmlFor="nightmare"
              name="nightmare"
              checked={dreamCharacteristic.nightmare}
              value={dreamCharacteristic.nightmare}
              onChange={(e) => handleDreamCharacteristic(e)}
              control={<Checkbox id="nightmare" />}
              label="Nightmare"
            />
          </div>
          <div>
            <FormControlLabel
              htmlFor="paralysis"
              name="paralysis"
              checked={dreamCharacteristic.paralysis}
              value={dreamCharacteristic.paralysis}
              onChange={(e) => handleDreamCharacteristic(e)}
              control={<Checkbox id="paralysis" />}
              label="Sleep Paralysis"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-around items-end h-full w-full gap-5 pb-4">
        <Button onClick={onClose} variant="outlined" className="w-full">
          Cancel
        </Button>
        <Button onClick={handleFilter} type="submit" variant="contained" className="w-full">
          Filter
        </Button>
      </div>
    </div>
  );
}

export function FilterDream({ isOpenFilter, onClose }: FilterDreamProps) {
  const { isMobile } = useIsMobile();

  return (
    <>
      {!isMobile && (
        <Drawer anchor="right" open={isOpenFilter} onClose={onClose}>
          <FilterForm onClose={onClose} />
        </Drawer>
      )}

      {isMobile && (
        <Dialog open={isOpenFilter} fullScreen TransitionComponent={Transition} onClose={onClose}>
          <DialogContent className="p-0">
            <FilterForm onClose={onClose} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
