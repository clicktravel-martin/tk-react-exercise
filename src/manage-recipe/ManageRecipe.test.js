import { render, screen, waitForElementToBeRemoved, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ManageRecipe from './ManageRecipe';
import RecipeForm from '../shared/RecipeForm';
import recipeEndpointAdapter from '../shared/recipeEndpointAdapter';

jest.mock('../shared/recipeEndpointAdapter');
jest.mock('../shared/RecipeForm');

describe('<ManageRecipe>', () => {
  beforeEach(() => RecipeForm.mockImplementation(
    (props) => <div data-testid="RecipeForm"></div>),
  );

  it('should load the recipe specified by the route', async () => {
    const recipeId = '12345';
    recipeEndpointAdapter.get.mockResolvedValue({});

    render(<ManageRecipe match={{ params: { recipeId } }}/>);

    expect(screen.getByRole('heading')).toHaveTextContent('Edit a recipe');
    expect(recipeEndpointAdapter.get).toHaveBeenCalledTimes(1);
    expect(recipeEndpointAdapter.get).toHaveBeenCalledWith({ recipeId });

    await waitForElementToBeRemoved(() => screen.getByText('Please wait...')); // Prevent "act()" warning
  });

  it('should display a form for editing the recipe details', async () => {
    const recipe = {
      id: '12345',
      name: 'Scotch egg',
      description: 'Round',
      ingredients: [
        { name: 'Egg' },
        { name: 'Sausage meat' },
        { name: 'Breadcrumbs' },
      ],
    };
    recipeEndpointAdapter.get.mockResolvedValue(recipe);

    render(<ManageRecipe match={{ params: { recipeId: recipe.id } }}/>);
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));

    await expect(screen.getByTestId('RecipeForm')).toBeInTheDocument();
    expect(RecipeForm).toHaveBeenCalledTimes(1);
    expect(RecipeForm.mock.calls[0][0]).toEqual({
      recipe,
      saveRecipeCallback: expect.any(Function),
    });
  });

  it('should update the recipe when the user chooses to do so', async () => {
    recipeEndpointAdapter.get.mockResolvedValue({
      id: '12345',
      name: 'Scotch egg',
      description: 'Round',
      ingredients: [
        { name: 'Egg' },
        { name: 'Sausage meat' },
        { name: 'Breadcrumbs' },
      ],
    });
    recipeEndpointAdapter.patch.mockResolvedValue({ id: 'DUMMY_VALUE' });
    render(<ManageRecipe match={{ params: { recipeId: '12345' } }}/>, { wrapper: MemoryRouter });
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));

    const { saveRecipeCallback } = RecipeForm.mock.calls[0][0];
    const updatedRecipe = {
      id: '12345',
      name: 'Spicy scotch egg',
      description: 'Spherical',
      ingredients: [
        { name: 'Egg' },
        { name: 'Sausage meat' },
        { name: 'Breadcrumbs' },
        { name: 'Chilli' },
      ],
    };
    act(() => {
      saveRecipeCallback(updatedRecipe);
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Please wait...');
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));

    expect(recipeEndpointAdapter.patch).toHaveBeenCalledTimes(1);
    expect(recipeEndpointAdapter.patch).toHaveBeenCalledWith({ recipeId: '12345', recipe: updatedRecipe });
    expect(screen.getByText(/Recipe updated/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to recipes' })).toHaveAttribute('href', '/');
  });

  it('should delete the recipe when the user chooses to do so', async () => {
    recipeEndpointAdapter.get.mockResolvedValue({
      id: '12345',
      name: 'Scotch egg',
      description: 'Round',
      ingredients: [
        { name: 'Egg' },
        { name: 'Sausage meat' },
        { name: 'Breadcrumbs' },
      ],
    });
    recipeEndpointAdapter.remove.mockResolvedValue({});
    render(<ManageRecipe match={{ params: { recipeId: '12345' } }}/>, { wrapper: MemoryRouter });
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));

    userEvent.click(screen.getByRole('button', 'Delete this recipe'));

    expect(screen.getByRole('alert')).toHaveTextContent('Please wait...');
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));

    expect(recipeEndpointAdapter.remove).toHaveBeenCalledTimes(1);
    expect(recipeEndpointAdapter.remove).toHaveBeenCalledWith({ recipeId: '12345' });
    expect(screen.getByText(/Recipe deleted/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to recipes' })).toHaveAttribute('href', '/');
  });
});

