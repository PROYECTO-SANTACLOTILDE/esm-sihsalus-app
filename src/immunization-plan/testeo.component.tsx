import React from 'react';
import DyakuPatientsTable from '../dyaku-patients/dyaku-patients-table.component';

const DyakuPatientsPage: React.FC = () => {
  return <DyakuPatientsTable pageSize={20} />;
};

export default DyakuPatientsPage;
