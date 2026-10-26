while (!WindowShouldClose()) {
  update();
}
while (isReady() && hasWork(item)) {
  process(item);
}
while (!(isReady() || hasWork(item))) {
  waitForWork();
}
const char *text = "!WindowShouldClose()";
// !WindowShouldClose() is only a comment
