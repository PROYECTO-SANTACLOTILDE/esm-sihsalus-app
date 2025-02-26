import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonSet,
  Column,
  DatePicker,
  DatePickerInput,
  Form,
  NumberInput,
  Select,
  SelectItem,
  Stack,
  TextInput,
  TimePicker,
  TimePickerSelect,
} from '@carbon/react';
import type { DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import { showSnackbar } from '@openmrs/esm-framework';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postNeonatalTriageForm } from './neonatal-triage.resource';
import styles from './neonatal-triage-form.scss';

// 📌 Esquema de validación con Zod
const neonatalTriageSchema = z.object({
  fechaDeIngreso: z.date(),
  horaDeIngreso: z.string().min(1, 'Requerido'),
  turno: z.string().min(1, 'Seleccione un turno'),
  temperatura: z.number().min(30).max(45),
  frecuenciaCardiaca: z.number().min(50).max(200),
  frecuenciaRespiratoria: z.number().min(10).max(100),
  presionSistolica: z.number().min(50).max(200),
  presionDiastolica: z.number().min(30).max(120),
  orina24h: z.string().optional(),
  evRec24h: z.string().optional(),
  peso: z.number().min(0.5).max(10),
});

type NeonatalTriageFormType = z.infer<typeof neonatalTriageSchema>;

const NeonatalTriageForm: React.FC<DefaultPatientWorkspaceProps> = ({
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const form = useForm<NeonatalTriageFormType>({
    defaultValues: {
      fechaDeIngreso: new Date(),
      horaDeIngreso: '',
      turno: '',
      temperatura: undefined,
      frecuenciaCardiaca: undefined,
      frecuenciaRespiratoria: undefined,
      presionSistolica: undefined,
      presionDiastolica: undefined,
      orina24h: '',
      evRec24h: '',
      peso: undefined,
    },
    resolver: zodResolver(neonatalTriageSchema),
  });

  useEffect(() => {
    promptBeforeClosing(() => form.formState.isDirty);
  }, [form.formState.isDirty, promptBeforeClosing]);

  const onSubmit = async (values: NeonatalTriageFormType) => {
    try {
      setLoading(true);
      await postNeonatalTriageForm(patientUuid, values);
      showSnackbar({ title: 'Éxito', kind: 'success', subtitle: 'Triaje guardado correctamente' });
      closeWorkspace();
    } catch (error) {
      showSnackbar({ title: 'Error', kind: 'error', subtitle: `${error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Stack gap={4}>
        <Column>
          <Controller
            control={form.control}
            name="fechaDeIngreso"
            render={({ field }) => (
              <DatePicker
                datePickerType="single"
                className={styles.formDatePicker}
                onChange={(event) => {
                  if (event.length) {
                    field.onChange(event[0]);
                  }
                }}
                value={field.value}
              >
                <DatePickerInput
                  {...field}
                  id="fechaDeIngreso"
                  placeholder="yyyy-mm-dd"
                  labelText={t('Fecha de ingreso')}
                  invalid={!!form.formState.errors.fechaDeIngreso}
                  invalidText={form.formState.errors.fechaDeIngreso?.message}
                />
              </DatePicker>
            )}
          />
        </Column>
        <Column>
          <Controller
            control={form.control}
            name="horaDeIngreso"
            render={({ field }) => (
              <TimePicker {...field} labelText={t('Hora de ingreso')} invalid={!!form.formState.errors.horaDeIngreso} />
            )}
          />
          <Controller
            control={form.control}
            name="turno"
            render={({ field }) => (
              <TimePickerSelect {...field} labelText={t('Turno')} invalid={!!form.formState.errors.turno}>
                <SelectItem value="" text="Seleccione" />
                <SelectItem value="40f4d322-2d46-4095-abed-c37399e6a43c" text="Mañana" />
                <SelectItem value="4b01e1f0-7bc3-4184-b473-b62943960a74" text="Tarde" />
                <SelectItem value="75cb1210-3c03-4e9c-ad61-a793f3b9fa76" text="Noche" />
              </TimePickerSelect>
            )}
          />
        </Column>

        {[
          'temperatura',
          'frecuenciaCardiaca',
          'frecuenciaRespiratoria',
          'presionSistolica',
          'presionDiastolica',
          'peso',
        ].map((field) => (
          <Column key={field}>
            <Controller
              control={form.control}
              name={field as keyof NeonatalTriageFormType}
              render={({ field }) => (
                <NumberInput {...field} label={t(field.name)} invalid={!!form.formState.errors[field.name]} />
              )}
            />
          </Column>
        ))}

        <Column>
          <Controller
            control={form.control}
            name="orina24h"
            render={({ field }) => <TextInput {...field} labelText={t('Orina / 24h')} />}
          />
        </Column>
        <Column>
          <Controller
            control={form.control}
            name="evRec24h"
            render={({ field }) => <TextInput {...field} labelText={t('EV. Rec / 24h')} />}
          />
        </Column>
      </Stack>

      <ButtonSet className={styles.buttonSet}>
        <Button kind="secondary" onClick={closeWorkspace}>
          {t('discard', 'Descartar')}
        </Button>
        <Button kind="primary" type="submit" disabled={loading || form.formState.isSubmitting}>
          {t('submit', 'Guardar')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default NeonatalTriageForm;
