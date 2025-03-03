import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Button, Tile, Checkbox, InlineLoading, TextInput } from '@carbon/react';
import { launchPatientWorkspace, CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import { useLayoutType } from '@openmrs/esm-framework';
import { useImmediateNewbornAttentions } from '../../clinical-view-group/immediate-newborn-attention.resource';
import styles from './immediate-newborn-attention.scss';
import dayjs from 'dayjs';
import { Encounter, Observation } from '../../../ui/encounter-list/encounter.resource';

interface ImmediateNewbornAttentionProps {
  patientUuid: string;
}

const NeonatalAttention: React.FC<ImmediateNewbornAttentionProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const headerTitle = t('immediateNewbornAttention', 'Atención Inmediata del Recién Nacido');
  const { newbornEncounters, error, isValidating, mutate } = useImmediateNewbornAttentions(patientUuid);
  const [formData, setFormData] = useState<Record<string, boolean | number | string>>({});

  const formImmediateNewbornUuid = 'IMMEDIATE_NEWBORN_ATTENTION_FORM_UUID'; // Replace with actual UUID in constants

  const handleAddImmediateNewbornAttention = () => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: t('immediateNewbornAttention', 'Atención Inmediata del Recién Nacido'),
      mutateForm: mutate,
      formInfo: {
        encounterUuid: '',
        formUuid: formImmediateNewbornUuid,
        patientUuid,
      },
    });
  };

  const items = useMemo(
    () => [
      { key: 'immediateEvaluation', label: t('immediateEvaluation', 'Evaluación inmediata'), type: 'datetime' },
      { key: 'respiratoryEffort', label: t('respiratoryEffort', 'Esfuerzo respiratorio'), type: 'boolean' },
      { key: 'heartRate', label: t('heartRate', 'Frecuencia cardíaca'), type: 'boolean' },
      { key: 'muscleTone', label: t('muscleTone', 'Tono muscular'), type: 'boolean' },
      { key: 'reflexIrritability', label: t('reflexIrritability', 'Irritabilidad refleja'), type: 'boolean' },
      { key: 'skinColor', label: t('skinColor', 'Color de piel'), type: 'boolean' },
      { key: 'apgarScore', label: t('apgarScore', 'Puntuación APGAR'), type: 'number' },
      { key: 'silvermanScore', label: t('silvermanScore', 'Puntuación de Silverman'), type: 'number' },
      { key: 'cordClamping', label: t('cordClamping', 'Clampeo del cordón'), type: 'boolean' },
      { key: 'vitaminKAdmin', label: t('vitaminKAdmin', 'Administración de Vitamina K'), type: 'boolean' },
      { key: 'orinaElimination', label: t('orinaElimination', 'Eliminación de orina'), type: 'boolean' },
      { key: 'stoolElimination', label: t('stoolElimination', 'Eliminación de heces'), type: 'boolean' },
      { key: 'parentInformation', label: t('parentInformation', 'Información a los padres'), type: 'boolean' },
    ],
    [t],
  );

  const handleToggle = (key: string, value: boolean | number | string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const latestEncounter = useMemo(() => {
    if (!newbornEncounters || newbornEncounters.length === 0) return null;
    return newbornEncounters.reduce((latest, current) => {
      return new Date(current.encounterDatetime) > new Date(latest.encounterDatetime) ? current : latest;
    }, newbornEncounters[0]) as Encounter;
  }, [newbornEncounters]);

  const populateFormData = useMemo(() => {
    if (!latestEncounter) return {};

    const data: Record<string, boolean | number | string> = {};
    latestEncounter.obs.forEach((obs: Observation) => {
      items.forEach((item) => {
        if (obs.display && obs.display.includes(item.label)) {
          const splitValues = obs.display.split(': ');
          const value = splitValues[splitValues.length - 1] || '--';
          if (item.type === 'boolean') {
            data[item.key] = value === 'Sí' || value === 'true'; // Handle both "Sí" and boolean values
          } else if (item.type === 'number') {
            data[item.key] = parseInt(value, 10) || 0; // Parse numerical values (e.g., APGAR, Silverman)
          } else if (item.type === 'datetime') {
            data[item.key] = dayjs(obs.obsDatetime || latestEncounter.encounterDatetime).format('DD/MM/YYYY HH:mm:ss');
          }
        } else if (obs.value && typeof obs.value === 'string' && obs.value.includes(item.label)) {
          // Fallback to check obs.value if display is not available
          const splitValues = obs.value.split(': ');
          const value = splitValues[splitValues.length - 1] || '--';
          if (item.type === 'boolean') {
            data[item.key] = value === 'Sí' || value === 'true';
          } else if (item.type === 'number') {
            data[item.key] = parseInt(value, 10) || 0;
          }
        }
      });
    });
    return data;
  }, [latestEncounter, items]);

  useEffect(() => {
    setFormData(populateFormData);
  }, [populateFormData]);

  if (error) {
    return <div>Error: {error.message}</div>; // Or use a more sophisticated error component
  }

  return (
    <div>
      <div className={styles.widgetCard}>
        {newbornEncounters?.length > 0 ? (
          <>
            <CardHeader title={headerTitle}>
              {isValidating && <InlineLoading />}
              <Button onClick={handleAddImmediateNewbornAttention} kind="ghost">
                {t('edit', 'Editar')}
              </Button>
            </CardHeader>
            <Stack gap={2}>
              {items.map((item) => (
                <Tile key={item.key} className={styles.checklistCard}>
                  <div className={styles.checklistItem}>
                    <span className={styles.label}>{item.label}</span>
                    {item.type === 'boolean' ? (
                      <Checkbox
                        labelText=""
                        id={item.key}
                        checked={!!formData[item.key]}
                        onChange={(checked) => handleToggle(item.key, checked)}
                      />
                    ) : item.type === 'number' ? (
                      <TextInput
                        type="number"
                        value={formData[item.key] as number}
                        onChange={(e) => handleToggle(item.key, parseInt(e.target.value, 10) || 0)}
                        placeholder={t('enterValue', 'Enter value')}
                        className={styles.numberInput}
                      />
                    ) : (
                      <span className={styles.value}>{(formData[item.key] as string) || '--'}</span>
                    )}
                  </div>
                </Tile>
              ))}
            </Stack>
          </>
        ) : (
          <EmptyState
            headerTitle={headerTitle}
            displayText={t('noDataAvailableDescription', 'No data available')}
            launchForm={handleAddImmediateNewbornAttention}
          />
        )}
      </div>
    </div>
  );
};

export default NeonatalAttention;
