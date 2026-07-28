import { useState, useRef, useEffect } from "react";
import { getRecipeFromMistral } from "./ai";
import IngredientsList from "./IngredientsList";
import AIRecipe from "./AIRecipe";
import ChefAIApp from "./CheftAI";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const shouldScrollToBottomRef = useRef(false);

  useEffect(() => {
    if (shouldScrollToBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      shouldScrollToBottomRef.current = false;
    }
  }, [ingredients, recipe]);

  useEffect(() => {
    if (recipe) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [recipe]);

  function addIngredient(e) {
    e.preventDefault();
    if (inputValue.trim()) {
      setIngredients([...ingredients, inputValue]);
      setInputValue("");
      shouldScrollToBottomRef.current = true;
    }
  }

  function removeIngredient(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function clearAllIngredients() {
    setIngredients([]);
  }

  async function getRecipe() {
    setLoading(true);
    const recipeMarkdown = await getRecipeFromMistral(ingredients);
    setRecipe(recipeMarkdown);
    setIngredients([]);
    setLoading(false);
  }

  return (
    <main>
      {!recipe && <ChefAIApp recipe={recipe} />}
      {recipe && <AIRecipe recipe={recipe} />}
      <form onSubmit={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          maxLength={20}
        />
        <button type="submit"></button>
      </form>
      {ingredients.length > 0 && (
        <IngredientsList
          ingredients={ingredients}
          getRecipe={getRecipe}
          loading={loading}
          removeIngredient={removeIngredient}
          clearAllIngredients={clearAllIngredients}
        />
      )}

      <div ref={bottomRef} />
    </main>
  );
}
