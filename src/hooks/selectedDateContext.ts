import { createContext } from 'react';
import dayjs from 'dayjs';

const omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

const SelectedDateContext = createContext({
  selectedDate: dayjs().startOf('day').format(omrsDateFormat),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedDate: (date: string) => {},
});

export default SelectedDateContext;
