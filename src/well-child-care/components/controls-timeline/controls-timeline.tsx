import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Column, Tag, Tile, Button, InlineLoading } from '@carbon/react';
import { AddIcon, launchWorkspace, formatDate, useConfig, usePatient } from '@openmrs/esm-framework';
import styles from './cred-schedule.scss';

interface CredEncounter {
  id: string;
  title: string;
  date: string;
  type: 'CRED' | 'Complementaria';
}

interface CREDScheduleProps {
  patientUuid: string;
}

const CREDSchedule: React.FC<CREDScheduleProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig();
  const { patient, isLoading, error } = usePatient(patientUuid);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<(typeof ageGroups)[0] | null>(null);

  const [encounters, setEncounters] = useState<CredEncounter[]>([]);
  const [isFetchingEncounters, setIsFetchingEncounters] = useState(true);

  const patientAgeInMonths = useMemo(() => {
    if (!patient?.birthDate) return 0;
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    return (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  }, [patient]);

  useEffect(() => {
    const fetchEncounters = async () => {
      try {
        setIsFetchingEncounters(true);
        const response = await fetch(
          `/openmrs/ws/rest/v1/encounter?patient=${patientUuid}&v=custom:(uuid,encounterType,encounterDatetime)`,
        );
        if (!response.ok) throw new Error('Error fetching encounters');
        const data = await response.json();

        const formattedEncounters = data.results.map((encounter: any) => ({
          id: encounter.uuid,
          title: encounter.encounterType.display,
          date: formatDate(encounter.encounterDatetime),
          type: encounter.encounterType.display.includes('CRED') ? 'CRED' : 'Complementaria',
        }));

        setEncounters(formattedEncounters);
      } catch (err) {
        console.error('Error fetching encounters:', err);
      } finally {
        setIsFetchingEncounters(false);
      }
    };

    fetchEncounters();
  }, [patientUuid]);

  const ageGroups = [
    { min: 0, max: 1, label: '0 AÑOS', sublabel: '0 A 29 DÍAS' },
    { min: 1, max: 12, label: '1 AÑO', sublabel: '1 A 11 MESES' },
    { min: 12, max: 24, label: '2 AÑOS', sublabel: '12 A 23 MESES' },
    { min: 24, max: 36, label: '3 AÑOS', sublabel: '24 A 35 MESES' },
    { min: 36, max: 48, label: '4 AÑOS', sublabel: '36 A 47 MESES' },
    { min: 48, max: 60, label: '5 AÑOS', sublabel: '48 A 59 MESES' },
    { min: 60, max: 72, label: '6 AÑOS' },
    { min: 72, max: 84, label: '7 AÑOS' },
    { min: 84, max: 96, label: '8 AÑOS' },
  ];

  const currentAgeGroup = useMemo(
    () => ageGroups.find((group) => patientAgeInMonths >= group.min && patientAgeInMonths < group.max),
    [patientAgeInMonths],
  );

  const upcomingCheckups = [
    { month: 0, name: 'CRED Nº 1' },
    { month: 2, name: 'CRED Nº 2' },
    { month: 3, name: 'Complementaria' },
    { month: 4, name: 'CRED Nº 3' },
  ];

  const handleAddCredControl = () => {
    launchWorkspace('appointments-form-workspace', {
      workspaceTitle: t('newCredEncounter', 'Nuevo Control CRED'),
      additionalProps: { patientUuid },
    });
  };

  const handleAgeGroupClick = (group: (typeof ageGroups)[0]) => {
    setSelectedAgeGroup(group);
    launchWorkspace('newborn-vitals-form', {
      workspaceTitle: `${t('ageGroupDetails', 'Detalles del grupo de edad')} - ${group.label}`,
      additionalProps: {
        patientUuid,
        ageGroup: group,
        patientAgeInMonths,
      },
    });
  };

  if (isLoading) return <InlineLoading description={t('loadingPatient', 'Cargando paciente...')} />;
  if (error)
    return <p className={styles.error}>{t('errorLoadingPatient', 'Error cargando los datos del paciente.')}</p>;

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
                className={`${styles.ageTile} ${selectedAgeGroup?.label === group.label ? styles.active : ''} ${currentAgeGroup?.label === group.label ? styles.current : ''}`}
                onClick={() => handleAgeGroupClick(group)}
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
              <Button kind="tertiary" size="sm" renderIcon={AddIcon} onClick={handleAddCredControl}>
                {t('addCredControl', 'Agregar Control CRED')}
              </Button>
            </div>

            {isFetchingEncounters ? (
              <InlineLoading description={t('loadingEncounters', 'Cargando encuentros...')} />
            ) : (
              encounters.map((encounter) => (
                <div key={encounter.id} className={styles.checkupItem}>
                  <span>{encounter.title}</span>
                  <span>{encounter.date}</span>
                  <Tag type={encounter.type === 'CRED' ? 'green' : 'purple'}>{encounter.type}</Tag>
                </div>
              ))
            )}

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
