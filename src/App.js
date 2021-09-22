import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import routes from './routes';

import SearchRecipes from './search-recipes/SearchRecipes';
import ManageRecipe from './manage-recipe/ManageRecipe';
import AddRecipe from './add-recipe/AddRecipe';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={routes.MANAGE_RECIPE} component={ManageRecipe}/>
        <Route path={routes.ADD_RECIPE} component={AddRecipe}/>
        <Route path={routes.SEARCH_RECIPES} component={SearchRecipes}/>
      </Switch>
    </Router>
  );
}

export default App;
