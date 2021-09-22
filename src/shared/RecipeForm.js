import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import routes from '../routes';
import { Button, Label, P, Input, Li } from '../shared/styled';

/**
 * @param saveRecipeCallback - Called when user chooses to save changes.
 * @param [recipe] - Sets initial values of form fields. Provide this when editing an existing recipe.
 */
const RecipeForm = ({
  saveRecipeCallback,
  recipe,
}) => {
  const [name, setName] = useState(recipe?.name || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [ingredients, setIngredients] = useState(recipe?.ingredients || [{ name: '' }]);

  function updateName(event) {
    setName(event.target.value);
  }

  function updateDescription(event) {
    setDescription(event.target.value);
  }

  function updateIngredientName(index, name) {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      name,
    };
    setIngredients(newIngredients);
  }

  function addIngredient() {
    setIngredients([...ingredients, { name: '' }]);
  }

  function removeIngredient(index) {
    setIngredients([...ingredients].filter((ingredient, i) => i !== index));
  }

  function saveRecipe(event) {
    event.preventDefault();
    saveRecipeCallback({
      name,
      description,
      ingredients: ingredients.filter(ingredient => ingredient.name !== ''), // Discard empty ingredient fields
    });
  }

  return (<div>
    <form onSubmit={saveRecipe}>
      <Label>
        Name (required)
        <Input type="text"
               value={name}
               onChange={updateName}
               required/>
      </Label>
      <Label>
        Description
        <Input type="text"
               value={description}
               onChange={updateDescription}/>
      </Label>
      <fieldset>
        <legend>Ingredients</legend>
        <ul>
          {ingredients.map((ingredient, index) => (
            <Li key={index}>
              <Input type="text"
                     value={ingredient.name}
                     onChange={(event) => updateIngredientName(index, event.target.value)}/>
              <Button type="button" onClick={() => removeIngredient(index)}>Remove</Button>
            </Li>
          ))}
        </ul>
        <Button type="button" onClick={addIngredient}>Add another ingredient</Button>
      </fieldset>
      <Button type="submit">Save</Button>
    </form>
    <P><Link to={routes.SEARCH_RECIPES}>Back to recipes</Link></P>
  </div>);
};

export default RecipeForm;
