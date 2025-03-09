import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tile, Checkbox, InlineLoading, TextInput, Stack } from '@carbon/react';
import { launchPatientWorkspace, CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import { useLayoutType, useConfig } from '@openmrs/esm-framework';
import { useCephaloCaudalNeurologicalEvaluation } from '../../../hooks/useCephaloCaudalNeurologicalEvaluation'; // Adjust the import path as needed
import styles from './cephalo-caudal-neurological-evaluation.scss'; // You’ll need to create this stylesheet
import dayjs from 'dayjs';
import type { Encounter, Observation } from '../../../ui/encounter-list/encounter.resource'; // Adjust the import path as needed
import type { ConfigObject } from '../../../config-schema'; // Adjust the import path as needed

interface CephaloCaudalNeurologicalEvaluationProps {
  patientUuid: string;
}

const CephaloCaudalNeurologicalEvaluationTable: React.FC<CephaloCaudalNeurologicalEvaluationProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const config = useConfig() as ConfigObject;
  const headerTitle = t(
    'cephaloCaudalNeurologicalEvaluation',
    'Evaluación Céfalocaudal y Neurológica del Recién Nacido',
  );
  const { encounters, error, isValidating, mutate } = useCephaloCaudalNeurologicalEvaluation(patientUuid);

  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});

  const formEvaluationName = config.formsList.newbornNeuroEval;

  const handleAddEvaluation = () => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: headerTitle,
      mutateForm: mutate,
      formInfo: {
        encounterUuid: '',
        formUuid: formEvaluationName,
        patientUuid,
      },
    });
  };

  // Map JSON questions to items for the checklist
  const items = useMemo(
    () => [
      {
        key: 'skinColor',
        label: t('skinColor', 'Color de Piel'),
        type: 'select',
        concept: 'c00971b1-029f-4160-9b68-55e101a512a8',
      },
      {
        key: 'fontanelle',
        label: t('fontanelle', 'Fontanela'),
        type: 'select',
        concept: '52956c82-e8ad-4f85-8dd7-9b993f3d54df',
      },
      {
        key: 'fontanelleOther',
        label: t('fontanelleOther', 'Otros para fontanela'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      {
        key: 'sutures',
        label: t('sutures', 'Suturas'),
        type: 'select',
        concept: 'dde87a4f-cd8c-4fe7-b7ef-f0f43bb31637',
      },
      { key: 'ears', label: t('ears', 'Orejas'), type: 'select', concept: '4b4f8ad4-a934-4ead-921a-266ca1d2102c' },
      {
        key: 'earsImplantationOther',
        label: t('earsImplantationOther', 'Otros para implantación'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      {
        key: 'earsPositionOther',
        label: t('earsPositionOther', 'Otros para ubicación'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      {
        key: 'earsOther',
        label: t('earsOther', 'Otros para orejas'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      { key: 'nose', label: t('nose', 'Nariz'), type: 'select', concept: '313226d7-d67d-4246-8d84-62f7208badf5' },
      {
        key: 'noseOther',
        label: t('noseOther', 'Otros para nariz'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      { key: 'mouth', label: t('mouth', 'Boca'), type: 'select', concept: '1a512c73-916f-4df3-938d-6f2c3d705fc3' },
      {
        key: 'mouthOther',
        label: t('mouthOther', 'Otros para boca'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      { key: 'neck', label: t('neck', 'Cuello'), type: 'select', concept: '7978016d-a854-427b-8451-9f6ca62b5186' },
      {
        key: 'neckOther',
        label: t('neckOther', 'Otros para cuello'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      { key: 'thorax', label: t('thorax', 'Tórax'), type: 'select', concept: '08579338-2599-438e-b3be-6cd3e7d955bd' },
      {
        key: 'nipples',
        label: t('nipples', 'Mamilas'),
        type: 'checkbox',
        concept: '36094aaf-31f7-46e8-92f1-8e8f7b7181ec',
      },
      {
        key: 'clavicle',
        label: t('clavicle', 'Clavícula'),
        type: 'checkbox',
        concept: '3d81681d-081e-4c31-ad24-d5faea4c2833',
      },
      {
        key: 'esophagus',
        label: t('esophagus', 'Permeabilidad Esófago'),
        type: 'checkbox',
        concept: 'f49edae8-ea0c-4013-8452-4dde09d7f8a7',
      },
      {
        key: 'umbilicalCord',
        label: t('umbilicalCord', 'Cordón Umbilical'),
        type: 'select',
        concept: '7f75f2a9-3531-4f9a-b2ac-eaf61d74f614',
      },
      {
        key: 'abdomenCharacteristics',
        label: t('abdomenCharacteristics', 'Características del Abdomen'),
        type: 'select',
        concept: '49d05fba-f1d0-4bb7-8b63-5084d78638e2',
      },
      {
        key: 'genitourinary',
        label: t('genitourinary', 'Genito Urinario'),
        type: 'text',
        concept: '57746a04-5f9e-4e42-9233-efeeeb3db0d0',
      },
      {
        key: 'observation',
        label: t('observation', 'Observación'),
        type: 'text',
        concept: 'f947a4ad-3d8d-4516-8e6b-67b3dca4e227',
      },
      {
        key: 'analPermeability',
        label: t('analPermeability', 'Permeabilidad Anal'),
        type: 'select',
        concept: 'f49edae8-ea0c-4013-8452-4dde09d7f8a7',
      },
      {
        key: 'analPermeabilityOther',
        label: t('analPermeabilityOther', 'Otros para permeabilidad'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      {
        key: 'genitourinaryElimination',
        label: t('genitourinaryElimination', 'Eliminación Genito Urinario'),
        type: 'select',
        concept: 'd79f07ac-bc26-4e3d-84d2-fb764da9409b',
      },
      {
        key: 'genitourinaryEliminationOther',
        label: t('genitourinaryEliminationOther', 'Otros para eliminación'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      {
        key: 'spinalColumn',
        label: t('spinalColumn', 'Columna Vertebral'),
        type: 'select',
        concept: 'd5d244f7-911b-43ca-90a1-3001c167b342',
      },
      {
        key: 'spinalColumnOther',
        label: t('spinalColumnOther', 'Otros para columna vertebral'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      {
        key: 'limbs',
        label: t('limbs', 'Extremidades'),
        type: 'select',
        concept: '46dc8706-c1af-4b04-b5d8-7432de862fef',
      },
      {
        key: 'limbsOther',
        label: t('limbsOther', 'Otros para extremidades'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      {
        key: 'muscleTone',
        label: t('muscleTone', 'Tono Muscular'),
        type: 'select',
        concept: '0d73ab1a-faee-4774-b570-609d98d8f6e0',
      },
      {
        key: 'muscleToneOther',
        label: t('muscleToneOther', 'Otros para tono muscular'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
      { key: 'hip', label: t('hip', 'Cadera'), type: 'select', concept: 'ca9f422f-f103-43c4-ae56-1b43bc2e7ec1' },
      {
        key: 'neurologicalEvaluation',
        label: t('neurologicalEvaluation', 'Valoración Neurológica'),
        type: 'select',
        concept: '7378ae3c-4a25-4d09-adbc-b3fe6b739aa3',
      },
      {
        key: 'neurologicalEvaluationOther',
        label: t('neurologicalEvaluationOther', 'Otros para valoración neurológica'),
        type: 'text',
        concept: 'd29ccdb7-b8ab-4d29-8a58-751300875df4',
      },
    ],
    [t],
  );

  const handleToggle = (key: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const latestEncounter = useMemo(() => {
    if (!encounters || encounters.length === 0) return null;
    return encounters.reduce((latest, current) => {
      return new Date(current.encounterDatetime) > new Date(latest.encounterDatetime) ? current : latest;
    }, encounters[0]) as Encounter;
  }, [encounters]);

  const populateFormData = useMemo(() => {
    if (!latestEncounter) return {};

    const data: Record<string, string | number | boolean> = {};
    latestEncounter.obs.forEach((obs: Observation) => {
      items.forEach((item) => {
        if (obs.display && obs.display.includes(item.label)) {
          const splitValues = obs.display.split(': ');
          const value = splitValues[splitValues.length - 1] || '--';
          if (item.type === 'select') {
            data[item.key] = value;
          } else if (item.type === 'checkbox') {
            data[item.key] = value === 'Sí' || value === 'true';
          } else if (item.type === 'text') {
            data[item.key] = value;
          } else if (item.type === 'datetime') {
            data[item.key] = dayjs(obs.obsDatetime || latestEncounter.encounterDatetime).format('DD/MM/YYYY HH:mm:ss');
          }
        } else if (obs.value && typeof obs.value === 'string' && obs.value.includes(item.label)) {
          const splitValues = obs.value.split(': ');
          const value = splitValues[splitValues.length - 1] || '--';
          if (item.type === 'select') {
            data[item.key] = value;
          } else if (item.type === 'checkbox') {
            data[item.key] = value === 'Sí' || value === 'true';
          } else if (item.type === 'text') {
            data[item.key] = value;
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
        {encounters?.length > 0 ? (
          <>
            <CardHeader title={headerTitle}>
              {isValidating && <InlineLoading />}
              <Button onClick={handleAddEvaluation} kind="ghost">
                {t('edit', 'Editar')}
              </Button>
            </CardHeader>
            <Stack gap={2}>
              {items.map((item) => (
                <Tile key={item.key} className={styles.checklistTile}>
                  <div className={styles.checklistItem}>
                    <span className={styles.label}>{item.label}</span>
                    {item.type === 'select' ? (
                      <TextInput
                        value={(formData[item.key] as string) || '--'}
                        onChange={(e) => handleToggle(item.key, e.target.value)}
                        placeholder={t('selectValue', 'Seleccione un valor')}
                        className={styles.textInput}
                      />
                    ) : item.type === 'checkbox' ? (
                      <Checkbox
                        labelText=""
                        id={item.key}
                        checked={!!formData[item.key]}
                        onChange={(checked) => handleToggle(item.key, checked)}
                      />
                    ) : item.type === 'text' ? (
                      <TextInput
                        value={(formData[item.key] as string) || ''}
                        onChange={(e) => handleToggle(item.key, e.target.value)}
                        placeholder={t('enterText', 'Ingrese texto')}
                        className={styles.textInput}
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
            launchForm={handleAddEvaluation}
          />
        )}
      </div>
    </div>
  );
};

export default CephaloCaudalNeurologicalEvaluationTable;
