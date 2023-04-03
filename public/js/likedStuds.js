const showLikedAssistantsLink = document.getElementById("showLikedStuds");
const likedAssistantsList = document.getElementById("likedStuds");

showLikedAssistantsLink.addEventListener("click", function () {
    likedAssistantsList.classList.toggle("hidden");
});