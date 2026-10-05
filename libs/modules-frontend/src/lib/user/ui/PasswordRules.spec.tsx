import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { PasswordRules } from './PasswordRules';

describe('PasswordRules', () => {
  it('ticks the rules the password meets', () => {
    render(<PasswordRules id="rules" password="trail" />);
    expect(screen.getByText('une lettre')).toHaveClass('bg-primary');
    expect(screen.getByText('un chiffre')).not.toHaveClass('bg-primary');
  });
});
