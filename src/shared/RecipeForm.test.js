import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RecipeForm from './RecipeForm';

const NOOP = () => undefined;

describe('<RecipeForm>', () => {
  it('should have blank fields for name, description, and ingredients given no existing recipe', () => {
    render(<RecipeForm saveRecipeCallback={NOOP}/>, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/Name/)).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.getByRole('list')).toBeInTheDocument();
    const ingredients = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(ingredients.length).toBe(1);
    expect(within(ingredients[0]).getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to recipes' })).toHaveAttribute('href', '/');
  });

  it('should have pre-populated form fields given an existing recipe', () => {
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

    render(<RecipeForm saveRecipeCallback={NOOP} recipe={recipe}/>, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/Name/)).toHaveValue('Scotch egg');
    expect(screen.getByLabelText('Description')).toHaveValue('Round');
    const ingredients = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(ingredients.length).toBe(3);
    expect(within(ingredients[0]).getByRole('textbox')).toHaveValue('Egg');
    expect(within(ingredients[1]).getByRole('textbox')).toHaveValue('Sausage meat');
    expect(within(ingredients[2]).getByRole('textbox')).toHaveValue('Breadcrumbs');
  });

  it('should update the name field when the user types in it', () => {
    render(<RecipeForm saveRecipeCallback={NOOP}/>, { wrapper: MemoryRouter });

    userEvent.type(screen.getByLabelText(/Name/), 'Club sandwich');

    expect(screen.getByLabelText(/Name/)).toHaveValue('Club sandwich');
  });

  it('should update the description field when the user types in it', () => {
    render(<RecipeForm saveRecipeCallback={NOOP}/>, { wrapper: MemoryRouter });

    userEvent.type(screen.getByLabelText('Description'), 'Best served chilled');

    expect(screen.getByLabelText('Description')).toHaveValue('Best served chilled');
  });

  it('should update an ingredient field when the user types in it', () => {
    render(<RecipeForm saveRecipeCallback={NOOP}/>, { wrapper: MemoryRouter });

    const ingredientInput = within(screen.getByRole('listitem')).getByRole('textbox');
    userEvent.type(ingredientInput, 'Melon');

    expect(ingredientInput).toHaveValue('Melon');
  });

  it('should add an ingredient field when the user chooses to', () => {
    const recipe = {
      id: '12345',
      name: 'Beans on toast',
      ingredients: [
        { name: 'Beans' },
      ],
    };
    render(<RecipeForm saveRecipeCallback={NOOP} recipe={recipe}/>, { wrapper: MemoryRouter });

    userEvent.click(screen.getByRole('button', { name: 'Add another ingredient' }));

    const ingredients = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(ingredients.length).toBe(2);
    expect(within(ingredients[0]).getByRole('textbox')).toHaveValue('Beans');
    expect(within(ingredients[1]).getByRole('textbox')).toHaveValue('');
  });

  it('should remove an ingredient field when the user chooses to', () => {
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
    render(<RecipeForm saveRecipeCallback={NOOP} recipe={recipe}/>, { wrapper: MemoryRouter });

    userEvent.click(within(screen.getAllByRole('listitem')[1]).getByRole('button', { name: 'Remove' }));

    const ingredients = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(ingredients.length).toBe(2);
    expect(within(ingredients[0]).getByRole('textbox')).toHaveValue('Egg');
    expect(within(ingredients[1]).getByRole('textbox')).toHaveValue('Breadcrumbs');
  });

  it('should pass the recipe details to a callback function when the user chooses to save the recipe, discarding ' +
    'any empty ingredient fields', () => {
    const saveRecipeCallback = jest.fn();
    render(<RecipeForm saveRecipeCallback={saveRecipeCallback}/>, { wrapper: MemoryRouter });
    userEvent.type(screen.getByLabelText(/Name/), 'Glass of milk');
    userEvent.type(screen.getByLabelText('Description'), 'Full of calcium');
    userEvent.type(within(screen.getAllByRole('listitem')[0]).getByRole('textbox'), 'Milk');
    userEvent.click(screen.getByRole('button', { name: 'Add another ingredient' }));
    userEvent.click(screen.getByRole('button', { name: 'Add another ingredient' }));

    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(saveRecipeCallback).toHaveBeenCalledWith({
      name: 'Glass of milk',
      description: 'Full of calcium',
      ingredients: [
        { name: 'Milk' },
      ],
    });
  });

});
