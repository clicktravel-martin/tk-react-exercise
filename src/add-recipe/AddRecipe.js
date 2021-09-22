import React, { useState, useEffect } from 'react';

import recipeListEndpointAdapter from '../shared/recipeListEndpointAdapter';
import RecipeForm from '../shared/RecipeForm';
import { Link } from 'react-router-dom';
import routes from '../routes';
import { H1, P } from '../shared/styled';

const Step = {
  EDITING: 'EDITING',
  SAVING: 'SAVING',
  SAVED: 'SAVED',
};

const AddRecipe = () => {
  const [step, setStep] = useState(Step.EDITING);
  const [recipeToSave, setRecipeToSave] = useState();

  function saveRecipe(recipe) {
    setStep(Step.SAVING);
    setRecipeToSave(recipe);
  }

  useEffect(() => {
    if (recipeToSave) {
      (async () => {
        await recipeListEndpointAdapter.post({ recipe: recipeToSave });
        setStep(Step.SAVED);
      })();
    }
  }, [recipeToSave]);

  return (
    <div>
      <H1>Add a recipe</H1>
      {step === Step.EDITING && <RecipeForm saveRecipeCallback={saveRecipe}/>}
      {step === Step.SAVING && <P role="alert">Please wait...</P>}
      {step === Step.SAVED && <P>Recipe saved. <Link to={routes.SEARCH_RECIPES}>Back to recipes</Link></P>}
    </div>
  );
};

export default AddRecipe;
