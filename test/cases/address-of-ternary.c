static void RenderClay(Clay_RenderCommandArray cmds) {
  for (int i = 0; i < cmds.length; i++) {
    Clay_RenderCommand *c = Clay_RenderCommandArray_Get(&cmds, i);
    Clay_BoundingBox b = c->boundingBox;
    switch (c->commandType) {
      case CLAY_RENDER_COMMAND_TYPE_RECTANGLE: {
        Clay_RectangleRenderData *r = &c->renderData.rectangle;
        float half = (b.width < b.height ? b.width : b.height) / 2;
        if (r->cornerRadius.topLeft > 0 && half > 0) {
          DrawRectangleRounded((Rectangle){ b.x, b.y, b.width, b.height },
            r->cornerRadius.topLeft / half, 8, ToRay(r->backgroundColor));
        } else {
          DrawRectangle(b.x, b.y, b.width, b.height, ToRay(r->backgroundColor));
        }
        break;
      }
      case CLAY_RENDER_COMMAND_TYPE_TEXT: {
        Clay_TextRenderData *t = &c->renderData.text;
        int n = t->stringContents.length < 511 ? t->stringContents.length : 511;
        memcpy(buf, t->stringContents.chars, n);
        buf[n] = 0;
        DrawTextEx(GetFontDefault(), buf, (Vector2){ b.x, b.y },
          t->fontSize, t->letterSpacing, ToRay(t->textColor));
        break;
      }
    }
  }
}

? int recognizable = 42;
