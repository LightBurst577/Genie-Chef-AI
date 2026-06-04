import React from "react";

export default function ChefAIApp({ recipe }) {
  return (
    <div className="app-container">
      {!recipe && (
        <div className="start-prompt">
          <img src="./src/assets/gem.png" alt="Chef AI Illustration" />
          <div className="instructions-section">
            <h3 className="instructions-heading">How to Use Genie Chef AI:</h3>
            <ol className="instructions-list">
              <li>Type an ingredient into the box.</li>
              <li>
                Click the <strong>+ Add ingredient</strong> button.
              </li>
              <li>Repeat until you have listed your ingredients.</li>
            </ol>
          </div>
        </div>
      )}

      {recipe && <div className="recipe-display"></div>}
    </div>
  );
}
