const currentStatus = document.getElementById('status-marker').dataset.status;

// Correct: Check both conditions separately
if (currentStatus === 'pending' || currentStatus === 'processing') {
    console.log("Status is active (" + currentStatus + "). Reloading in 3s...");
    setTimeout(function() {
        window.location.reload();
    }, 3000);
} else {
    console.log("Job finished with status: " + currentStatus + ". Stopping refresh.");
}