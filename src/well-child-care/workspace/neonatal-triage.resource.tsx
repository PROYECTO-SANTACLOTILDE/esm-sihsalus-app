import { z } from 'zod';

export const neonatalTriageSchema = z.object({
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

// Tipo TypeScript inferido de Zod
export type NeonatalTriageFormType = z.infer<typeof neonatalTriageSchema>;

export async function postNeonatalTriageForm(patientUuid: string, formData: NeonatalTriageFormType): Promise<void> {
  const encounterTypeUuid = '1a2b3c4d-1234-5678-9101-abcdefghij01';

  const payload = {
    encounterType: encounterTypeUuid,
    patient: patientUuid,
    obs: Object.entries(formData).map(([key, value]) => ({
      concept: conceptMapping[key], // 🔹 Usar un mapa de conceptos
      value,
    })),
  };

  const response = await fetch('/openmrs/ws/rest/v1/encounter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:Admin123'),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Error al guardar el formulario');
  }
}

const conceptMapping = {
  fechaDeIngreso: 'a432b5b7-ef2d-43af-82fb-c2357da505f4',
  horaDeIngreso: 'ff13aee5-dfa0-48b0-8966-0aaacdbff931',
  temperatura: '89c9c0bf-e746-4f8d-8d04-b2d2ad9826eb',
  peso: '5cacede4-c947-4092-9df4-24287a7f13ae',
};
