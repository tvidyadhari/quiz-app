setTimeout(() => {
	// document.querySelector(".loader").classList.add("hidden");
	document.querySelector(".container").classList.remove("hidden");
	const greenProgress = document.querySelector("#green-progress")
	const result = document.querySelector("#result")
	const score = localStorage.getItem("score")
	const scorePerc = score ? `${score*100/10}%`: "0%";
	greenProgress.style.width = scorePerc;
	result.innerHTML = scorePerc;
}, 200);

