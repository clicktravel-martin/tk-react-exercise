import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import routes from '../routes';
import recipeEndpointAdapter from '../shared/recipeEndpointAdapter';
import RecipeForm from '../shared/RecipeForm';
import { H1, Button, P } from '../shared/styled';

const Step = {
  LOADING: 'LOADING',
  EDITING: 'EDITING',
  UPDATING: 'SAVING',
  UPDATED: 'SAVED',
  DELETING: 'DELETING',
  DELETED: 'DELETED',
};

/**
 * @param match - Route details from react-router
 */
const ManageRecipe = ({ match }) => {
  const [step, setStep] = useState(Step.LOADING);
  const [recipe, setRecipe] = useState();
  const [recipeToUpdate, setRecipeToUpdate] = useState();

  function updateRecipe(recipe) {
    setStep(Step.UPDATING);
    setRecipeToUpdate(recipe);
  }

  function deleteRecipe() {
    setStep(Step.DELETING);
  }

  useEffect(() => {
    const { recipeId } = match.params;
    (async () => {
      const recipe = await recipeEndpointAdapter.get({ recipeId });
      setRecipe(recipe);
      setStep(Step.EDITING);
    })();
  }, [match.params]); // match.params doesn't change during the page's life, so this only runs once on load

  useEffect(() => {
    const { recipeId } = match.params;
    if (recipeToUpdate && step === Step.UPDATING) {
      (async () => {
        await recipeEndpointAdapter.patch({ recipeId, recipe: recipeToUpdate });
        setStep(Step.UPDATED);
      })();
    } else if (step === Step.DELETING) {
      (async () => {
        await recipeEndpointAdapter.remove({ recipeId });
        setStep(Step.DELETED);
      })();
    }
  }, [recipeToUpdate, step, match.params]);

  return (
    <div>
      <H1>Edit a recipe</H1>
      {step === Step.LOADING && <P role="alert">Please wait...</P>}
      {step === Step.EDITING &&
      <div>
        <RecipeForm saveRecipeCallback={updateRecipe} recipe={recipe}/>
        <Button type="button" onClick={deleteRecipe}>Delete this recipe</Button>
      </div>}
      {step === Step.UPDATING && <P role="alert">Please wait...</P>}
      {step === Step.UPDATED && <P>Recipe updated. <Link to={routes.SEARCH_RECIPES}>Back to recipes</Link></P>}
      {step === Step.DELETING && <P role="alert">Please wait...</P>}
      {step === Step.DELETED && <P>Recipe deleted. <Link to={routes.SEARCH_RECIPES}>Back to recipes</Link></P>}
    </div>
  );
};

export default ManageRecipe;
