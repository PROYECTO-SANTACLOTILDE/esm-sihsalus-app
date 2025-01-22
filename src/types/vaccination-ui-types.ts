export interface UIVaccine {
  vaccineName: string;
  vaccineUuid: string;
}

export interface UIEligibleDateRange {
  from: {
    unit: string;
    value: number;
  };
  to: {
    unit: string;
    value: number;
  };
}

export interface UIVaccineData {
  id: string;
  vaccines: UIVaccine[];
  eligible_date_range: UIEligibleDateRange;
}
