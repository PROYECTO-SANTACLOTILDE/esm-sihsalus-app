import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tile, Tag, InlineLoading } from '@carbon/react';
import { ErrorState, usePatient, useConfig } from '@openmrs/esm-framework';
import { useSchemasConceptSet } from '../../hooks/useSchemasConceptSet';
import { type ConfigObject } from '../../config-schema';
import styles from './legend.scss';

interface LegendItem {
  type: 'blue' | 'red' | 'green' | 'teal' | 'gray' | 'orange';
  text: string;
  label: string;
}

interface LegendTileProps {
  conceptSetUUID: string;
}

const LegendTile: React.FC<LegendTileProps> = ({ conceptSetUUID }) => {
  const { t } = useTranslation();
  const { patientUuid } = usePatient();
  const config = useConfig<ConfigObject>();
  const { data: conceptData, isLoading, error } = useConcepts(patientUuid, conceptSetUUID);

  // Extract status-to-color mappings from config
  const statusColors = useMemo(() => config.legend?.statusColors || {}, [config.legend?.statusColors]);

  // Default fallback items from config if provided
  const fallbackItems: LegendItem[] = useMemo(() => {
    return (
      config.legend?.defaultItems?.map((item) => ({
        type: statusColors[item.text.toUpperCase()] || 'gray',
        text: item.text,
        label: t(item.text, item.label),
      })) || []
    );
  }, [config.legend?.defaultItems, statusColors, t]);

  // Map concept data to legend items, using config for colors
  const legendItems: LegendItem[] = useMemo(() => {
    if (!conceptData?.length) return fallbackItems;

    return conceptData.map((concept) => {
      const status = concept.status?.toUpperCase() || 'UNKNOWN';
      return {
        type: statusColors[status] || 'gray',
        text: concept.status || 'unknown',
        label: t(concept.status, concept.display || concept.status || 'Unknown'),
      };
    });
  }, [conceptData, statusColors, fallbackItems, t]);

  if (error) {
    return (
      <ErrorState
        error={error}
        headerTitle={t('legend', 'Leyenda')}
        aria-label={t('errorState', 'Error al cargar la leyenda')}
      />
    );
  }

  return (
    <Tile className={styles.legendTile} aria-label={t('legend', 'Leyenda')}>
      <h3 className={styles.legendTitle}>{t('legend', 'Leyenda')}</h3>
      {isLoading ? (
        <div className={styles.loadingContainer} role="status" aria-live="polite">
          <InlineLoading description={t('loading', 'Cargando...')} />
        </div>
      ) : (
        <div className={styles.legendContainer} role="list" aria-label={t('legendItems', 'Elementos de la leyenda')}>
          {legendItems.map((item) => (
            <div key={item.text} className={styles.legendItem} role="listitem">
              <Tag
                type={item.type}
                size="sm"
                aria-label={t(item.text, item.label)}
                title={t(item.text, item.label)}
                className={styles.legendTag}
              >
                {t(item.text, item.label)}
              </Tag>
            </div>
          ))}
        </div>
      )}
    </Tile>
  );
};

export default LegendTile;
