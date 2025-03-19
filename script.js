const moodBtns = document.querySelectorAll(".mood-button");
const moodList = document.getElementById("mood-list");

// Event listener for mood buttons
moodBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const emoji = btn.querySelector(".emoji").textContent;
    const label = btn.querySelector(".label").textContent;
    const date = new Date().toISOString().split("T")[0];

    // Get mood logs from local storage or initialize empty array
    const moodLogs = JSON.parse(localStorage.getItem("moods")) || [];

    // Check if a mood for today already exists
    const existingEntry = moodLogs.find(entry => entry.date === date);

    if (existingEntry) {
        alert("You've already logged your mood today. Try again tomorrow! 😊");
        return;
    }

    // Mood entry object
    const moodEntry = {
      mood: emoji,
      label: label,
      date: date,
    };

    moodLogs.push(moodEntry);

    // Save mood logs to local storage
    localStorage.setItem("moods", JSON.stringify(moodLogs));

    // Display mood log for the day
    console.log("Saved mood logs:", moodLogs);
    displayMoods("Day");
  });
});

// Function to display moods based on the selected time frame
function displayMoods(timeFrame) {
  moodList.innerHTML = ""; // Clear the list

  const moodLogs = JSON.parse(localStorage.getItem("moods")) || [];
  console.log(`Displaying moods for: ${timeFrame}`, moodLogs);

  const currentDate = new Date();
  const todayStr = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format

  const filteredMoods = moodLogs.filter((entry) => {
    const entryDate = new Date(entry.date);
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    if (timeFrame === "Day") {
      return entry.date === todayStr; // Exact date match
    } else if (timeFrame === "Week") {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Get start of the week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      return entryDate >= weekStart && entryDate <= currentDate;
    } else if (timeFrame === "Month") {
      return entryYear === currentYear && entryMonth === currentMonth;
    }
    return false;
  });

  console.log(`Filtered moods for ${timeFrame}:`, filteredMoods); // Debugging

  if (filteredMoods.length === 0) {
    moodList.innerHTML = "<li>No moods logged for this period.</li>";
    return;
  }

  filteredMoods.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${entry.date}: ${entry.label}   ${entry.mood}`;
    moodList.appendChild(listItem);
});
}

// Initial display of moods for the day
displayMoods("Day");
