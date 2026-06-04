export default function IngredientsList(props) {
  const ingredientsListItems = props.ingredients.map((ingredient, index) => (
    <li
      key={index}
      onClick={() => props.removeIngredient(index)}
      className="ingredient-item"
    >
      {ingredient}
    </li>
  ));

  const remaining = 4 - props.ingredients.length;
  const isReady = props.ingredients.length > 3;

  if (props.ingredients.length === 0) {
    return (
      <section className="ingredients-section">
        <h2>Ingredients on hand:</h2>
        <div className="add-ingredients-prompt">
          <p className="prompt-text">
            Add {remaining} ingredients to get started
          </p>
          <div className="progress-dots">
            <span className="dot empty"></span>
            <span className="dot empty"></span>
            <span className="dot empty"></span>
            <span className="dot empty"></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`ingredients-section ${isReady ? "with-recipe" : ""}`}>
      <div className="ingredients-column">
        <h2>Ingredients on hand:</h2>
        <ul className="ingredients-list" aria-live="polite">
          {ingredientsListItems}
        </ul>
        {!isReady && (
          <p className="add-more-text">
            Add {remaining} more to generate recipe
          </p>
        )}
        {!isReady && (
          <div className="progress-dots">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className={`dot ${i < props.ingredients.length ? "filled" : "empty"}`}
              ></span>
            ))}
          </div>
        )}
        <button onClick={props.clearAllIngredients} className="clear-all-btn">
          Clear all
        </button>
      </div>

      {isReady && (
        <div className="get-recipe-container">
          <div>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button
            onClick={props.getRecipe}
            disabled={props.loading}
            className={props.loading ? "loading-btn" : ""}
          >
            {props.loading ? "Genie Chef is thinking..." : "Get a recipe"}
          </button>
        </div>
      )}
    </section>
  );
}
