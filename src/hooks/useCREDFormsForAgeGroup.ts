// hooks/useCREDFormsForAgeGroup.ts

import { useMemo } from 'react';
import type { ConfigObject } from '../config-schema';
import type { CompletedFormInfo } from '../well-child-care/workspace/well-child-control/types';
import { calculateAgeInMonths } from '../well-child-care/workspace/well-child-control/utils/age-group-utils';

export function useCREDFormsForAgeGroup(config: ConfigObject, birthDate: string | undefined): CompletedFormInfo[] {
  return useMemo(() => {
    if (!birthDate || !config?.CREDFormsByAgeGroup || !config?.formsList) return [];

    const months = calculateAgeInMonths(birthDate);

    const matchedGroup = config.CREDFormsByAgeGroup.find((group) => {
      const min = group.minMonths ?? 0;
      const max = group.maxMonths ?? 999;
      return months >= min && months < max;
    });

    if (!matchedGroup) return [];

    return matchedGroup.forms
      .map((formKey) => {
        const formDef = config.formsList?.[formKey];
        if (!formDef) return null;
        return {
          form: {
            ...formDef,
            formCategory: 'CRED',
          },
          associatedEncounters: [],
          lastCompletedDate: undefined,
        };
      })
      .filter(Boolean) as CompletedFormInfo[];
  }, [birthDate, config]);
}
