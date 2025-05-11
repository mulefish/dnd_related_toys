

export function logPink(incoming: unknown) {
  const style = "background-color: pink; color: black; padding: 2px;";

  if (typeof incoming === "string" || typeof incoming === "number") {
    console.log(`%c${incoming}`, style);
  } else if (incoming === null) {
    console.log(`%cnull`, style);
  } else if (incoming === undefined) {
    console.log(`%cundefined`, style);
  } else {
    const x = JSON.stringify(incoming, null, 2);
    console.log(`%c${x}`, style);
  }
}
