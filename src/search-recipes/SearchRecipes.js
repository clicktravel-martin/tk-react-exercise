import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import routes from '../routes';
import recipeListEndpointAdapter from '../shared/recipeListEndpointAdapter';
import { H1, Button, Label, P, Input, Li, H2 } from '../shared/styled';

const SearchRecipes = () => {
  const [recipeName, setRecipeName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [recipes, setRecipes] = useState();

  function updateRecipeName(event) {
    setRecipeName(event.target.value);
  }

  function search(event) {
    event.preventDefault(); // Don't POST the form to the server
    setSearchTerm(recipeName);
  }

  function recipePath(recipe) {
    return routes.MANAGE_RECIPE.replace(':recipeId', recipe.id);
  }

  useEffect(() => {
    setLoadingRecipes(true);

    async function loadRecipes() {
      setRecipes(await recipeListEndpointAdapter.get({ queryParams: { name: searchTerm || undefined } }));
      setLoadingRecipes(false);
    }

    loadRecipes();
  }, [searchTerm]);

  return (
    <div>
      <H1>Recipes</H1>
      <form>
        <Label>Search by recipe name
          <Input type="text"
                 value={recipeName}
                 onChange={updateRecipeName}
          />
        </Label>
        <Button type="submit" onClick={search}>Search</Button>
        <Link to={routes.ADD_RECIPE}>Add a recipe</Link>
      </form>
      {loadingRecipes && <P role="alert">Please wait...</P>}
      {recipes &&
      <ul>{recipes.map(recipe => (
        <Li key={recipe.id}>
          <Link to={recipePath(recipe)}>
            <H2>{recipe.name}</H2>
            <P>{recipe.description}</P>
          </Link>
        </Li>
      ))}
      </ul>}
    </div>
  );
};

export default SearchRecipes;
