import React, { useEffect } from 'react';
import { ExtensionSlot, useLayoutType } from '@openmrs/esm-framework';
import { SideNavItems, SideNavMenu } from '@carbon/react';
import { registerNavGroup } from '@openmrs/esm-patient-common-lib';
import styles from './dashboard-group.scss';
import { useActivePrograms } from '../../hooks/useActivePrograms';

export interface DashboardGroupExtensionProps {
  title: string;
  slotName?: string;
  basePath: string;
  isExpanded?: boolean;
  isChild?: boolean;
}

export const DashboardGroupExtension: React.FC<DashboardGroupExtensionProps> = ({
  title,
  slotName,
  basePath,
  isExpanded,
  isChild,
}) => {
  const isTablet = useLayoutType() === 'tablet';

  // Llamar al hook para obtener los programas activos del paciente
  const { activePrograms, isLoading } = useActivePrograms({
    vaccinationProgramConceptSet: 'some-uuid', // Reemplazar con el UUID correcto
  });

  useEffect(() => {
    registerNavGroup(slotName);
  }, [slotName]);

  // Condición: Mostrar solo si el paciente está inscrito en al menos un programa
  if (isLoading) {
    return <div>Cargando programas...</div>;
  }

  if (activePrograms.length === 0) {
    return null; // No renderizar nada si no hay programas activos
  }

  return (
    <SideNavItems className={styles.sideMenuItems} isSideNavExpanded={true}>
      <SideNavMenu
        className={isChild && styles.sideNavMenu}
        large={isTablet}
        defaultExpanded={isExpanded ?? true}
        title={title}
      >
        <ExtensionSlot style={{ width: '100%', minWidth: '15rem' }} name={slotName ?? title} state={{ basePath }} />
      </SideNavMenu>
    </SideNavItems>
  );
};

export default DashboardGroupExtension;
