import { render, screen, waitForElementToBeRemoved, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AddRecipe from './AddRecipe';
import RecipeForm from '../shared/RecipeForm';
import recipeListEndpointAdapter from '../shared/recipeListEndpointAdapter';

jest.mock('../shared/recipeListEndpointAdapter');
jest.mock('../shared/RecipeForm');

describe('<AddRecipe>', () => {
  beforeEach(() => RecipeForm.mockImplementation(
    (props) => <div data-testid="RecipeForm"></div>),
  );

  it('should display a form for entering recipe details', () => {
    render(<AddRecipe/>);

    expect(screen.getByRole('heading')).toHaveTextContent('Add a recipe');
    expect(screen.getByTestId('RecipeForm')).toBeInTheDocument();
  });

  it('should save the recipe when the user chooses to do so', async () => {
    recipeListEndpointAdapter.post.mockResolvedValue({ id: 'DUMMY_VALUE' });
    render(<AddRecipe/>, { wrapper: MemoryRouter });

    const { saveRecipeCallback } = RecipeForm.mock.calls[0][0];
    act(() => {
      saveRecipeCallback({
        name: 'My recipe',
        description: 'Delicious',
        ingredients: [
          { name: 'Sausage' },
          { name: 'Apricot' },
        ],
      });
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Please wait...');
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));

    expect(recipeListEndpointAdapter.post).toHaveBeenCalledTimes(1);
    expect(recipeListEndpointAdapter.post).toHaveBeenCalledWith({
      recipe: {
        name: 'My recipe',
        description: 'Delicious',
        ingredients: [
          { name: 'Sausage' },
          { name: 'Apricot' },
        ],
      },
    });
    expect(screen.getByText(/Recipe saved/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to recipes' })).toHaveAttribute('href', '/');
  });
});

