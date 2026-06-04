const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page


WARNING NOTE:
IF IT'S A TROLL INPUT OR SOMETHING UNRELATED TO RECIPES OR INGREDIENTS, THEN OUTPUT: Haha I don't understand! PLZ ONLY RECIPES 🙏💀📃
IF SOMETHING UNREALATED TO RECIPES OR INGREDIENTS IS MENTIONED IN THE USER INPUT, THEN OUTPUT: PLZ ONLY GIVE ME RECIPES 🙏😭
IF THE INPUT WAS NOT (ingredients) or something else THEN OUTPUT: PLZ PUT INGREDIENTS 🙏😭
`;

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/owl-alpha",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(
        `Oh no, I can't think rn, give me time to rest! 😭 status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("Recipe Error:", err);
    alert(`Error generating recipe: ${err.message}`);
  }
}
