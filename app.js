let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;

// Кнопки
const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const playButton = document.getElementById('playButton');
const statusDiv = document.getElementById('status');
const audioFileInput = document.getElementById('audioFileInput');

// Начало записи
recordButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    // Собираем аудиоданные
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    // При завершении записи
    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      audioUrl = URL.createObjectURL(audioBlob);
      statusDiv.textContent = 'Запись завершена. Вы можете скачать или воспроизвести её.';
      playButton.disabled = false;

      // Предлагаем скачать файл
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'recording.mp3';
      link.textContent = 'Скачать запись';
      statusDiv.appendChild(link);
    };

    // Начинаем запись
    mediaRecorder.start();
    recordButton.disabled = true;
    stopButton.disabled = false;
    statusDiv.textContent = 'Идёт запись...';
  } catch (error) {
    console.error('Ошибка доступа к микрофону:', error);
    statusDiv.textContent = 'Ошибка доступа к микрофону.';
  }
});

// Остановка записи
stopButton.addEventListener('click', () => {
  mediaRecorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
});

// Воспроизведение выбранного файла
audioFileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileUrl = URL.createObjectURL(file);
    audioUrl = fileUrl; // Сохраняем ссылку на выбранный файл
    playButton.disabled = false;
    statusDiv.textContent = `Выбран файл: ${file.name}`;
  } else {
    statusDiv.textContent = 'Файл не выбран.';
    playButton.disabled = true;
  }
});

// Воспроизведение записи
playButton.addEventListener('click', () => {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  } else {
    statusDiv.textContent = 'Нет файла для воспроизведения.';
  }
});