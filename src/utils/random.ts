export default function random() {
  let min = 100;
  let max = 300;
  const a = Math.random() * (max - min) + min;
  const floored = Math.floor(a);
  return floored;
}
