import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import { Eyedropper, Pills } from '@carbon/react/icons'; // Iconos supuestos, ajustar según disponibilidad
import { usePatient, useVisit, useConfig, ExtensionSlot } from '@openmrs/esm-framework';
import styles from './well-child-care.scss';

interface VaccinationProps {
  patientUuid: string;
}

const ChildImmunizationSchedule: React.FC<VaccinationProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit, isLoading: isVisitLoading } = useVisit(patientUuid);
  const { patient, isLoading: isPatientLoading } = usePatient(patientUuid);
  const config = useConfig();
  const pageSize = 10;

  // Calcular la edad del paciente en meses (relevante para vacunas infantiles)
  const patientAgeInMonths = useMemo(() => {
    if (!patient?.birthDate) return null;
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    return years * 12 + months;
  }, [patient?.birthDate]);

  // Definición memoizada de las pestañas
  const tabs = useMemo(
    () => [
      {
        label: t('vaccineCalendar', 'Calendario de Vacunas del Niño'),
        icon: Eyedropper, // Ajustar si el icono no está disponible
        slotName: 'vaccination-schedule-slot',
      },
      {
        label: t('scheduleVaccination', 'Vacunas Suministradas'),
        icon: Pills, // Ajustar si el icono no está disponible
        slotName: 'vaccination-appointment-slot',
      },
    ],
    [t],
  );

  // Mostrar mensaje de carga si los datos no están listos
  if (isVisitLoading || isPatientLoading) {
    return (
      <Layer>
        <Tile>
          <p>{t('loading', 'Cargando datos...')}</p>
        </Tile>
      </Layer>
    );
  }

  // Estado memoizado para pasar a los slots de extensión
  const state = useMemo(
    () => ({ patient, patientUuid, patientAgeInMonths, currentVisit }),
    [patient, patientUuid, patientAgeInMonths, currentVisit],
  );

  return (
    <div className={styles.widgetCard}>
      {/* Cabecera del componente */}
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t('childImmunizationSchedule', 'Esquema de Inmunización Infantil')}</h4>
          </div>
        </Tile>
      </Layer>

      {/* Pestañas y contenido */}
      <Layer>
        <Tabs>
          <TabList className={styles.tabList} aria-label={t('immunizationTabs', 'Lista de pestañas de inmunización')}>
            {tabs.map((tab, index) => (
              <Tab className={styles.tab} key={index} renderIcon={tab.icon}>
                {tab.label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((tab, index) => (
              <TabPanel key={index} className={styles.tabPanelContainer}>
                <ExtensionSlot
                  name={tab.slotName}
                  state={{ patientUuid, currentVisit, pageSize, patientAgeInMonths }}
                  className={styles.extensionSlot}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default ChildImmunizationSchedule;
