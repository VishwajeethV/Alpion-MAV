// rickroll modal logic
document.addEventListener("DOMContentLoaded", function() {
  var btn = document.getElementById("rickrollBtn");
  var modal = document.getElementById("rickrollModal");
  var close = document.getElementById("closeModal");

  btn.onclick = function() {
    modal.style.display = "flex"; // Show the modal
    // Play the video by reloading iframe src
    var frame = modal.querySelector("iframe");
    frame.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
  };
  close.onclick = function() {
    modal.style.display = "none";
    // Pause the video
    var frame = modal.querySelector("iframe");
    frame.src = ""; // Unset src to stop video
  };
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
      var frame = modal.querySelector("iframe");
      frame.src = "";
    }
  }
});