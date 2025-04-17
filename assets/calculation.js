function setupSimulator(config) {
    const { startBtn, stopBtn, speedInput, fileInput, progressBar, statusLabel, packetLossInput, sizeUnitSelect } = config;
    let interval;
    let progress = 0;
    let internalSpeed = 0;

    function stopSimulation() {
      clearInterval(interval);
      startBtn.disabled = false;
      stopBtn.disabled = true;
      progressBar.style.backgroundColor = '#4f46e5';
    }

    stopBtn.addEventListener("click", stopSimulation);

    startBtn.addEventListener("click", () => {
      const speedRaw = parseFloat(speedInput.value);
      const fileSizeRaw = parseFloat(fileInput.value);
      const packetLoss = parseFloat(packetLossInput?.value || 0);
      const sizeUnit = sizeUnitSelect?.value || "GB";

      if (isNaN(speedRaw) || isNaN(fileSizeRaw) || speedRaw <= 0 || fileSizeRaw <= 0) return;

      startBtn.disabled = true;
      stopBtn.disabled = false;

      internalSpeed = speedRaw / 8;

      const totalMB = sizeUnit === "GB" ? fileSizeRaw * 1024 : fileSizeRaw;
      const adjustedSpeed = internalSpeed * (1 - packetLoss / 100);

      const totalTimeSec = totalMB / adjustedSpeed;
      const totalMinutes = Math.floor(totalTimeSec / 60);
      const totalSeconds = Math.round(totalTimeSec % 60);

      progress = 0;
      let transferred = 0;
      const updateInterval = 100;
      const totalSteps = (totalMB / adjustedSpeed) * 1000 / updateInterval;
      const increment = 100 / totalSteps;
      const mbIncrement = adjustedSpeed * (updateInterval / 1000);

      interval = setInterval(() => {
        if (progress >= 100) {
          clearInterval(interval);
          startBtn.disabled = false;
          stopBtn.disabled = true;
          progress = 100;
          transferred = totalMB;
          progressBar.style.backgroundColor = '#16a34a';
        } else {
          progress += increment;
          transferred += mbIncrement;
          if (progress > 100) progress = 100;
          if (transferred > totalMB) transferred = totalMB;
        }

        const fluctuatingSpeed = (adjustedSpeed + (Math.random() * 1.5 - 0.75)).toFixed(2);
        const transferredDisplay = sizeUnit === "GB" ? (transferred / 1024).toFixed(2) + ' GB' : transferred.toFixed(2) + ' MB';

        const remainingSec = Math.round(totalTimeSec * (1 - progress / 100));
        const remainingMin = Math.floor(remainingSec / 60);
        const remainingSeconds = remainingSec % 60;

        progressBar.style.width = `${progress}%`;
        statusLabel.textContent = `${progress.toFixed(2)}% - Speed: ${fluctuatingSpeed} Mb/s - Transferred: ${transferredDisplay} - Time Remaining: ${remainingMin.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      }, updateInterval);
    });
  }

  setupSimulator({
    startBtn: document.getElementById("startBtn"),
    stopBtn: document.getElementById("stopBtn"),
    speedInput: document.getElementById("speed"),
    fileInput: document.getElementById("filesize"),
    progressBar: document.getElementById("progressBar"),
    statusLabel: document.getElementById("status"),
    packetLossInput: document.getElementById("packetLoss"),
    sizeUnitSelect: document.getElementById("sizeUnit")
  });

  setupSimulator({
    startBtn: document.getElementById("uploadStartBtn"),
    stopBtn: document.getElementById("uploadStopBtn"),
    speedInput: document.getElementById("uploadSpeed"),
    fileInput: document.getElementById("uploadSize"),
    progressBar: document.getElementById("uploadProgressBar"),
    statusLabel: document.getElementById("uploadStatus"),
    packetLossInput: document.getElementById("uploadPacketLoss"),
    sizeUnitSelect: document.getElementById("uploadSizeUnit")
  });