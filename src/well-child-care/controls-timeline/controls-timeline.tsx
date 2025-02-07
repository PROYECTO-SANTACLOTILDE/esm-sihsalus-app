import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Column, Tag, Tile, Button } from '@carbon/react';
import { AddIcon, launchWorkspace, formatDate, useConfig, usePatient } from '@openmrs/esm-framework';
import styles from './cred-schedule.scss';

interface CredEncounter {
  id: string;
  title: string;
  date: Date;
  type: 'CRED' | 'Complementaria';
}

interface CREDScheduleProps {
  patientUuid: string; // Only UUID is required
}

const CREDSchedule: React.FC<CREDScheduleProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig();

  // The code below shows placeholders for ageInMonths and encounters.
  // In a real scenario, you might fetch them from an ESM hook or API call:
  // e.g. useCurrentPatient() to get birthdate => compute months
  // or a custom hook to get the patient's encounters

  const [patientAgeInMonths, setPatientAgeInMonths] = useState<number>(0);
  const [encounters, setEncounters] = useState<CredEncounter[]>([]);

  useEffect(() => {
    // Placeholder example: fetch or compute from an OpenMRS backend or ESM
    // For example, you could do:
    // const { patient } = useCurrentPatient();
    // setPatientAgeInMonths(ageInMonths(patient?.birthdate));
    // or fetch encounters with usePatientEncounters(...).

    // Simulate an API call:
    setTimeout(() => {
      setPatientAgeInMonths(10); // Hard-coded example
      setEncounters([
        { id: '1', title: 'CRED Nº 1', date: new Date('2023-01-10'), type: 'CRED' },
        { id: '2', title: 'Complementaria', date: new Date('2023-02-05'), type: 'Complementaria' },
      ]);
    }, 500);
  }, [patientUuid]);

  const ageGroups = [
    { min: 0, max: 1, label: '0 AÑOS', sublabel: '0 A 29 DIAS' },
    { min: 1, max: 12, label: '1 AÑO', sublabel: '1 A 11 MESES' },
    { min: 12, max: 24, label: '2 AÑOS', sublabel: '12 A 23 MESES' },
    { min: 24, max: 36, label: '3 AÑOS', sublabel: '24 A 35 MESES' },
    { min: 36, max: 48, label: '4 AÑOS', sublabel: '36 A 47 MESES' },
    { min: 48, max: 60, label: '5 AÑOS', sublabel: '48 A 59 MESES' },
    { min: 60, max: 72, label: '6 AÑOS' },
    { min: 72, max: 84, label: '7 AÑOS' },
    { min: 84, max: 96, label: '8 AÑOS' },
  ];

  const getCurrentAgeGroup = () =>
    ageGroups.find((group) => patientAgeInMonths >= group.min && patientAgeInMonths < group.max);

  const upcomingCheckups = [
    { month: 0, name: 'CRED Nº 1' },
    { month: 2, name: 'CRED Nº 2' },
    { month: 3, name: 'Complementaria' },
    { month: 4, name: 'CRED Nº 3' },
    // ... more controls as needed
  ];

  // Launch a workspace to add a new CRED record
  const handleAddCredControl = () => {
    launchWorkspace('cred-form-workspace', {
      workspaceTitle: t('newCredEncounter', 'Nuevo Control CRED'),
      additionalProps: {
        patientUuid,
        // Add anything else needed by the form
      },
    });
  };

  return (
    <Tile className={styles.card}>
      <Grid condensed>
        <Column md={4} lg={8}>
          <div className={styles.header}>
            <h4>{t('credSchedule', 'Seguimiento CRED')}</h4>
            <Tag type="blue">
              {t('currentAge', 'Edad actual')}: {patientAgeInMonths} {t('months', 'meses')}
            </Tag>
          </div>

          <div className={styles.ageGroups}>
            {ageGroups.map((group) => (
              <Tile
                key={group.label}
                className={`${styles.ageTile} ${getCurrentAgeGroup()?.label === group.label ? styles.active : ''}`}
              >
                <strong>{group.label}</strong>
                {group.sublabel && <div>{group.sublabel}</div>}
              </Tile>
            ))}
          </div>
        </Column>

        <Column md={4} lg={8}>
          <div className={styles.checkups}>
            <div className={styles.checkupsHeader}>
              <h5>{t('completedCheckups', 'Controles realizados')}</h5>
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={AddIcon}
                iconDescription={t('addCredControl', 'Agregar Control CRED')}
                onClick={handleAddCredControl}
              >
                {t('addCredControl', 'Agregar Control CRED')}
              </Button>
            </div>

            {encounters.map((encounter) => (
              <div key={encounter.id} className={styles.checkupItem}>
                <span>{encounter.title}</span>
                <span>{formatDate(encounter.date)}</span>
                <Tag type={encounter.type === 'CRED' ? 'green' : 'purple'}>{encounter.type}</Tag>
              </div>
            ))}

            <h5 className={styles.upcomingHeader}>{t('upcomingCheckups', 'Próximos controles')}</h5>
            {upcomingCheckups
              .filter((checkup) => checkup.month > patientAgeInMonths)
              .map((checkup, index) => (
                <div key={index} className={styles.checkupItem}>
                  <span>{checkup.name}</span>
                  <span className={styles.dueDate}>
                    {t('dueAt', 'A los')} {checkup.month} {t('months', 'meses')}
                  </span>
                  <Tag type="blue">{t('pending', 'Pendiente')}</Tag>
                </div>
              ))}
          </div>
        </Column>
      </Grid>
    </Tile>
  );
};

export default CREDSchedule;
