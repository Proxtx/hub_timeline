(async () => {
  let lastEventTime = -Infinity;

  while (true) {
    let end = new Date();
    let start = new Date();
    start.setHours(start.getHours() - 1);
    let response = await (
      await fetch(config.url + "/api/events", {
        method: "POST",
        body: JSON.stringify({
          end: dateToUtcString(end),
          start: dateToUtcString(start),
        }),
        credentials: "include",
      })
    ).json();
    response = response.Ok;
    let newestEventTime = -Infinity;
    for (let plugin in response) {
      if (config.exclude.includes(plugin)) {
        continue;
      }
      for (let event of response[plugin]) {
        if (event.time[0] > newestEventTime) {
          newestEventTime = event.time[0];
        }
      }
    }
    if (newestEventTime > lastEventTime) {
      window.loadSceneApp("hub_timeline");
      await new Promise((r) => setTimeout(r, 10000));
      window.loadSceneIndex(0);
    }
    lastEventTime = newestEventTime;
    await new Promise((r) => setTimeout(r, 30000));
  }
})();
function dateToUtcString(date) {
  return (
    date.getUTCFullYear() +
    "-" +
    (date.getUTCMonth() + 1) +
    "-" +
    date.getUTCDate() +
    "T" +
    date.getUTCHours() +
    ":" +
    date.getUTCMinutes() +
    ":" +
    date.getUTCSeconds() +
    "." +
    date.getUTCMilliseconds() +
    "Z"
  );
}
