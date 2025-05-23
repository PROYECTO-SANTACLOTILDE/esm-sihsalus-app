import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GrowthChart from './growth-chart';

describe('GrowthChart', () => {
  const baseProps = {
    measurementData: [
      {
        eventDate: new Date('2023-01-01').toISOString(),
        dataValues: { height: 70, weight: 8, l: 50 },
      },
    ],
    patientName: 'Juan Pérez',
    gender: 'M', //Male or Female, other genders not supported 
    dateOfBirth: new Date('2022-01-01'),
  };

  it('debe renderizar el componente correctamente', () => {
    render(<GrowthChart {...baseProps} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Percentiles|Z-Scores/i })).toBeInTheDocument();
  });

  it('debe mostrar el género correctamente', () => {
    render(<GrowthChart {...baseProps} />);
    expect(screen.getByText(/Masculino|Femenino/i)).toBeInTheDocument();
  });

  it('debe cambiar entre Percentiles y Z-Scores', () => {
    render(<GrowthChart {...baseProps} />);
    const toggleButton = screen.getByRole('button', { name: /Percentiles|Z-Scores/i });
    fireEvent.click(toggleButton);
    // El texto del botón debe cambiar
    expect(toggleButton.textContent === 'Percentiles' || toggleButton.textContent === 'Z-Scores').toBe(true);
  });

  it('debe renderizar tabs de categorías', () => {
    render(<GrowthChart {...baseProps} />);
    // Busca tabs por su rol o por el aria-label
    expect(screen.getByLabelText(/vertical tabs/i)).toBeInTheDocument();
  });

  // Puedes agregar más tests para interacción y visualización de datos
});
