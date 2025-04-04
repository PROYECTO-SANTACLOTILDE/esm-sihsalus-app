import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Extension, ExtensionSlot, useExtensionSlotMeta } from '@openmrs/esm-framework';
import { Activity, CloudMonitoring, WatsonHealthCobbAngle, UserFollow, Stethoscope } from '@carbon/react/icons';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';

import styles from './well-child-care.scss';

interface NeonatalCareProps {
  patientUuid: string;
}

const NeonatalCare: React.FC<NeonatalCareProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      {
        label: t('vitalsNewborn', 'Monitoreo del Recién Nacido'),
        icon: Activity,
        slotName: 'neonatal-vitals-slot',
      },
      {
        label: t('perinatal', 'Inscripción Materno Perinatal'),
        icon: UserFollow,
        slotName: 'neonatal-perinatal-slot',
      },
      {
        label: t('atencionInmediata', 'Atención Inmediata del RN'),
        icon: CloudMonitoring,
        slotName: 'neonatal-attention-slot',
      },
      {
        label: t('evaluacionInmediata', 'Evaluación del Recién Nacido'),
        icon: Stethoscope,
        slotName: 'neonatal-evaluation-slot',
      },
      {
        label: t('consejeriaLactancia', 'Consejería Lactancia Materna'),
        icon: WatsonHealthCobbAngle,
        slotName: 'neonatal-counseling-slot',
      },
    ],
    [t],
  );

  // Get meta data for all slots at the top level
  const slotMetas = {
    'neonatal-vitals-slot': useExtensionSlotMeta('neonatal-vitals-slot'),
    'neonatal-perinatal-slot': useExtensionSlotMeta('neonatal-perinatal-slot'),
    'neonatal-attention-slot': useExtensionSlotMeta('neonatal-attention-slot'),
    'neonatal-evaluation-slot': useExtensionSlotMeta('neonatal-evaluation-slot'),
    'neonatal-counseling-slot': useExtensionSlotMeta('neonatal-counseling-slot'),
  };

  return (
    <div className={styles.widgetCard}>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t('neonatalCare', 'Cuidado del Recién Nacido')}</h4>
          </div>
        </Tile>
      </Layer>

      <Layer>
        <Tabs>
          <TabList
            className={styles.tabList}
            aria-label={t('neonatalCareTabs', 'Lista de pestañas de cuidado neonatal')}
          >
            {tabs.map((tab, index) => (
              <Tab className={styles.tab} key={index} renderIcon={tab.icon}>
                {tab.label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((tab, index) => (
              <TabPanel key={index} className={styles.dashboardContainer}>
                <div className={styles.dashboardContainer}>
                  <ExtensionSlot key={tab.slotName} name={tab.slotName} className={styles.dashboard}>
                    {(extension) => {
                      const { fullWidth = false } = slotMetas[tab.slotName][extension.id] || {};
                      return (
                        <div className={classNames(styles.extension, fullWidth && styles.fullWidth)}>
                          <Extension state={{ patientUuid, pageSize: 5 }} className={styles.extensionWrapper} />
                        </div>
                      );
                    }}
                  </ExtensionSlot>
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default NeonatalCare;
