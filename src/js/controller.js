import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // getting id from hash
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results view to mark search result
    resultsView.update(model.getSearchResultsPage());

    // 1. Update Bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 2. loading recipe
    await model.loadRecipe(id);

    // 3. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1. Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    //2. Load Search Results
    await model.loadSearchResults(query);

    //3. Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. Render Initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //1. Render NEW Results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1. Update the recipe (in state)
  model.updateServings(newServings);

  // 2. Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add/Delete bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 0. Render Spinner
    addRecipeView.renderSpinner();

    // 1. Upload new Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // 2. Render Recipe
    recipeView.render(model.state.recipe);

    // 3. Success Message
    addRecipeView.renderMessage();

    // Render Boookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 4. Close Modal form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// Using Publisher Subscriber Pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!');
};
init();
