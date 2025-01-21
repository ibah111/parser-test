export default function delay(time: number): Promise<void> {
  const sec = time * 1000;
  let seconds = 0;
  const interval = setInterval(() => {
    seconds++;
    console.log(seconds);

    if (seconds === time) {
      clearInterval(interval);
      console.log('Таймер завершён!');
    }
  }, 1000);
  return new Promise((resolve) => {
    setTimeout(resolve, sec);
  });
}
