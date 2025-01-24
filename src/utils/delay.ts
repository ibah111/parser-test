//Promise искусственный таймаут, чтобы после отсчёта, проводить действия.
export default function delay(time: number): Promise<void> {
  const sec = time * 1000;
  let seconds = 0;
  const interval = setInterval(() => {
    seconds++;

    if (seconds === time) {
      clearInterval(interval);
    }
  }, 1000);
  return new Promise((resolve) => {
    setTimeout(resolve, sec);
  });
}
