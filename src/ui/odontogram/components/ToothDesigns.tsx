// @ts-expect-error TS(1259): Module '"/home/duvet05/react-odontogram-v2/node_mo... Remove this comment to see the full error message
import React from 'react';
type ToothDesignProps = {
  design: 'default' | 'design2' | 'design3' | 'design4';
};

const ToothDesigns: React.FC<ToothDesignProps> = ({
  design
}: any) => {
  const renderDesign = () => {
    switch (design) {
      case 'default':
        return (
          <>
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="0" y1="20" x2="5" y2="0" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="5" y1="0" x2="10" y2="20" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="10" y1="20" x2="15" y2="0" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="15" y1="0" x2="20" y2="20" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="7.5" y1="10" x2="10" y2="0" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="10" y1="0" x2="12.5" y2="10" stroke="black" strokeWidth="0.15" />
          </>
        );
      case 'design2':
        return (
          <>
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="5" y1="20" x2="10" y2="0" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="10" y1="0" x2="15" y2="20" stroke="black" strokeWidth="0.15" />
          </>
        );

      /* case 'design3':
        return (
          <>
            <line x1="2" y1="20" x2="8" y2="0" stroke="black" strokeWidth="0.15" />
            <line x1="8" y1="0" x2="14" y2="20" stroke="black" strokeWidth="0.15" />
            <line x1="11" y1="10" x2="14" y2="0" stroke="black" strokeWidth="0.15" strokeDasharray="1" />
            <line x1="14" y1="0" x2="18" y2="20" stroke="black" strokeWidth="0.15" strokeDasharray="1" />
          </>
        );
      case 'design4':
        return (
          <>
            <line x1="2" y1="20" x2="8" y2="0" stroke="black" strokeWidth="0.15" strokeDasharray="1" />
            <line x1="8" y1="0" x2="12" y2="10" stroke="black" strokeWidth="0.15" strokeDasharray="1" />
            <line x1="10" y1="20" x2="14" y2="0" stroke="black" strokeWidth="0.15" />
            <line x1="14" y1="0" x2="18" y2="20" stroke="black" strokeWidth="0.15" />
          </>
        ); */
      case 'design3':
        return (
          <>
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="0" y1="20" x2="5" y2="0" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="5" y1="0" x2="10" y2="20" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="10" y1="20" x2="15" y2="0" stroke="black" strokeWidth="0.15" strokeDasharray="1"/>
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="15" y1="0" x2="20" y2="20" stroke="black" strokeWidth="0.15" strokeDasharray="1"/>
          </>
        );
      case 'design4':
        return (
          <>
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="0" y1="20" x2="5" y2="0" stroke="black" strokeWidth="0.15" strokeDasharray="1"/>
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="5" y1="0" x2="10" y2="20" stroke="black" strokeWidth="0.15" strokeDasharray="1"/>
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="10" y1="20" x2="15" y2="0" stroke="black" strokeWidth="0.15" />
            // @ts-expect-error TS(2339): Property 'line' does not exist on type 'JSX.Intrin... Remove this comment to see the full error message
            <line x1="15" y1="0" x2="20" y2="20" stroke="black" strokeWidth="0.15" />
          </>
        );
      default:
        return null;
    }
  };
  return (
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    <svg width="60" height="60" viewBox="0 0 20 20" className="tooth-design">
      {renderDesign()}
    // @ts-expect-error TS(2339): Property 'svg' does not exist on type 'JSX.Intrins... Remove this comment to see the full error message
    </svg>
  );
};

export default ToothDesigns;
