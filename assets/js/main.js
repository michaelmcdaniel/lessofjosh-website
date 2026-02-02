document.addEventListener("DOMContentLoaded", () => {
  console.log("Less of Josh loaded");

  // Set dynamic year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // TDEE Calculator
  const tdeeForm = document.getElementById("tdeeForm");
  const tdeeResult = document.getElementById("tdeeResult");
  const tdeeReset = document.getElementById("tdeeReset");

  if (tdeeForm && tdeeResult) {
    tdeeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form values
      const sex = document.getElementById("sex").value;
      const age = Number(document.getElementById("age").value);
      const heightFt = Number(document.getElementById("heightFt").value);
      const heightIn = Number(document.getElementById("heightIn").value);
      const weight = Number(document.getElementById("weight").value);
      const activity = Number(document.getElementById("activity").value);
      const goal = Number(document.getElementById("goal").value);

      // Validate inputs
      if (!age || !heightFt || heightIn === null || !weight) {
        alert("Please fill in all fields");
        return;
      }

      // Convert to metric
      const totalInches = (heightFt * 12) + heightIn;
      const cm = totalInches * 2.54;
      const kg = weight * 0.453592;

      // Mifflin-St Jeor Equation
      let bmr;
      if (sex === "male") {
        bmr = (10 * kg) + (6.25 * cm) - (5 * age) + 5;
      } else {
        bmr = (10 * kg) + (6.25 * cm) - (5 * age) - 161;
      }

      const maintenance = Math.round(bmr * activity);
      const target = maintenance + goal; // goal is already negative for weight loss
      const weekly = target * 7;

      // Display results
      document.getElementById("bmrOut").textContent = Math.round(bmr).toLocaleString();
      document.getElementById("maintOut").textContent = maintenance.toLocaleString();
      document.getElementById("targetOut").textContent = target.toLocaleString();
      document.getElementById("weeklyOut").textContent = weekly.toLocaleString();

      // Calculate macros (3 options)
      const macroOut = document.getElementById("macroOut");
      macroOut.innerHTML = "";

      // Option 1: Balanced
      const balancedP = Math.round(target * 0.30 / 4);
      const balancedC = Math.round(target * 0.40 / 4);
      const balancedF = Math.round(target * 0.30 / 9);
      
      const macro1 = document.createElement("div");
      macro1.className = "macro";
      macro1.innerHTML = `
        <h4>Balanced (30/40/30)</h4>
        <ul>
          <li>Protein: ${balancedP}g (30%)</li>
          <li>Carbs: ${balancedC}g (40%)</li>
          <li>Fat: ${balancedF}g (30%)</li>
        </ul>
      `;
      macroOut.appendChild(macro1);

      // Option 2: Higher Protein
      const highP = Math.round(target * 0.35 / 4);
      const highC = Math.round(target * 0.35 / 4);
      const highF = Math.round(target * 0.30 / 9);
      
      const macro2 = document.createElement("div");
      macro2.className = "macro";
      macro2.innerHTML = `
        <h4>Higher Protein (35/35/30)</h4>
        <ul>
          <li>Protein: ${highP}g (35%)</li>
          <li>Carbs: ${highC}g (35%)</li>
          <li>Fat: ${highF}g (30%)</li>
        </ul>
      `;
      macroOut.appendChild(macro2);

      // Option 3: Lower Carb
      const lowP = Math.round(target * 0.40 / 4);
      const lowC = Math.round(target * 0.25 / 4);
      const lowF = Math.round(target * 0.35 / 9);
      
      const macro3 = document.createElement("div");
      macro3.className = "macro";
      macro3.innerHTML = `
        <h4>Lower Carb (40/25/35)</h4>
        <ul>
          <li>Protein: ${lowP}g (40%)</li>
          <li>Carbs: ${lowC}g (25%)</li>
          <li>Fat: ${lowF}g (35%)</li>
        </ul>
      `;
      macroOut.appendChild(macro3);

      // Show results
      tdeeResult.hidden = false;

      // Smooth scroll to results
      setTimeout(() => {
        tdeeResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    });
  }

  // Reset button
  if (tdeeReset && tdeeResult) {
    tdeeReset.addEventListener("click", () => {
      tdeeForm.reset();
      tdeeResult.hidden = true;
    });
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
