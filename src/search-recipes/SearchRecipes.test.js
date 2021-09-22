import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import SearchRecipes from '../../src/search-recipes/SearchRecipes';
import recipeListEndpointAdapter from '../shared/recipeListEndpointAdapter';

jest.mock('../shared/recipeListEndpointAdapter');

describe('<SearchRecipes>', () => {
  it('should request a list of all recipes and display a loading message', async () => {
    render(<SearchRecipes/>, { wrapper: MemoryRouter });

    expect(recipeListEndpointAdapter.get).toHaveBeenCalledTimes(1);
    expect(recipeListEndpointAdapter.get).toHaveBeenCalledWith({ queryParams: { name: undefined } });
    expect(screen.getByRole('alert')).toHaveTextContent('Please wait...');

    // The value returned by the endpoint is irrelevant to this test, but we still have to do an "await" so that React
    // doesn't complain about "act()" https://reactjs.org/docs/test-utils.html#act
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));
  });

  it('should display a list of all recipes when they are returned', async () => {
    recipeListEndpointAdapter.get.mockResolvedValue([
      {
        id: '1',
        name: 'Banana split',
        ingredients: [
          'Banana',
          'Ice cream',
        ],
      },
      {
        id: '2',
        name: 'Something else',
        description: 'Food',
        ingredients: [
          'Flour',
          'Butter',
          'Apricots',
        ],
      },
      {
        id: '3',
        name: 'Birthday cake',
        ingredients: [
          'Cake',
          'Candles',
        ],
      },
    ]);

    render(<SearchRecipes/>, { wrapper: MemoryRouter });
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));

    const recipes = screen.getAllByRole('listitem');
    expect(recipes.length).toBe(3);
    expect(within(recipes[0]).getByRole('heading')).toHaveTextContent('Banana split');
    expect(within(recipes[0]).getByRole('link')).toHaveAttribute('href', '/recipe/1');
    expect(within(recipes[1]).getByRole('heading')).toHaveTextContent('Something');
    expect(within(recipes[1]).getByRole('link')).toHaveAttribute('href', '/recipe/2');
    expect(recipes[1]).toHaveTextContent('Food');
    expect(within(recipes[2]).getByRole('heading')).toHaveTextContent('Birthday cake');
    expect(within(recipes[2]).getByRole('link')).toHaveAttribute('href', '/recipe/3');
  });

  it('should search recipes by name when the users enters a name and clicks "Search"', async () => {
    recipeListEndpointAdapter.get.mockResolvedValue([]);
    render(<SearchRecipes/>, { wrapper: MemoryRouter });
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));

    userEvent.type(screen.getByLabelText('Search by recipe name'), 'Apple');
    userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByLabelText('Search by recipe name')).toHaveValue('Apple');
    expect(recipeListEndpointAdapter.get).toHaveBeenCalledTimes(2);
    expect(recipeListEndpointAdapter.get.mock.calls[1]).toEqual([{ queryParams: { name: 'Apple' } }]);
    await waitForElementToBeRemoved(() => screen.getByText('Please wait...'));
  });

});

